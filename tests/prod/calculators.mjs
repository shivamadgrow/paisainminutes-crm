// Production browser test: every calculator page survives zero, huge and negative inputs. Read-only.
//   PW_DIR=... node tests/prod/calculators.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const SITE = "https://paisainminutes.com";
const sm = await (await fetch(SITE + "/sitemap.xml")).text();
const pages = [...new Set([...sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "")))].filter((u) => /calculator/i.test(u));
console.log(`${pages.length} calculator pages`);
const browser = await chromium.launch();
const rows = [];
for (const p of pages) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 80)));
  await page.goto(SITE + p, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  const inputs = page.locator("main input[type=number]:visible, input[type=number]:visible");
  const n = await inputs.count();
  const bad = [];
  const scenarios = [["zero", "0"], ["huge", "99999999999999"], ["negative", "-5"], ["decimal", "0.0001"]];
  for (const [label, val] of scenarios) {
    for (let i = 0; i < Math.min(n, 6); i++) {
      await inputs.nth(i).fill(val).catch(() => {});
      await inputs.nth(i).dispatchEvent("input").catch(() => {});
      await inputs.nth(i).dispatchEvent("change").catch(() => {});
    }
    await page.waitForTimeout(300);
    const text = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll("script,style,noscript").forEach((e) => e.remove()); return c.innerText; });
    const m = text.match(/.{0,25}(NaN|Infinity|undefined|\[object).{0,15}/);
    if (m) bad.push(`${label}: "${m[0].replace(/\s+/g, " ")}"`);
  }
  rows.push({ page: p, inputs: n, bad, errs });
  console.log(`${bad.length || errs.length ? "FAIL" : "PASS"}  ${p}  (${n} number inputs)${bad.length ? "  " + bad[0] : ""}${errs.length ? "  errors: " + errs[0] : ""}`);
  await ctx.close();
}
await browser.close();
const failed = rows.filter((r) => r.bad.length || r.errs.length);
console.log(`\n${rows.length - failed.length} of ${rows.length} calculator pages passed`);
if (process.argv.includes("--log")) {
  let md = `\n## Run ${new Date().toISOString()}: all calculator pages with extreme inputs (phase 10, read-only)\n\n${pages.length} calculator pages from the sitemap, each given 0, 99,999,999,999,999, -5 and 0.0001 in every number box, checking for NaN, Infinity, undefined and script errors. **${rows.length - failed.length} passed, ${failed.length} failed.** Pages with no number inputs found: ${rows.filter((r) => r.inputs === 0).length}.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- \`${f.page}\`: ${[...f.bad.slice(0, 2), ...f.errs.slice(0, 1)].join("; ")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
