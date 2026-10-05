// Production smoke test in Firefox and WebKit (Safari's engine): key pages at phone and desktop size. Read-only.
//   PW_DIR=... node tests/prod/cross-browser.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const pw = createRequire(PW_DIR + "/package.json")("playwright");
const SITE = "https://paisainminutes.com";
const results = [];
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const pages = ["/", "/apply-now.php", "/check-eligibility.php", "/personal-loan.php", "/personal-loan-emi-calculator.php", "/contact-us.php", "/track-status.php", "/loan-offers.php"];
const THIRD = /googletagmanager|google-analytics|googleapis|gstatic|facebook|doubleclick|clarity/i;
for (const [name, type] of [["firefox", pw.firefox], ["webkit", pw.webkit]]) {
  let browser;
  try { browser = await type.launch(); } catch (e) { check(name, `${name} starts`, false, e.message.split("\n")[0].slice(0, 120)); continue; }
  for (const [vpName, vp] of [["phone", { width: 390, height: 844 }], ["desktop", { width: 1366, height: 800 }]]) {
    const ctx = await browser.newContext({ viewport: vp });
    for (const p of pages) {
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message.slice(0, 80)));
      page.on("response", (r) => { if (r.status() >= 400 && /paisainminutes/.test(r.url()) && !THIRD.test(r.url())) errs.push(`${r.status()} ${r.url().replace(SITE, "").slice(0, 50)}`); });
      let ok = true;
      await page.goto(SITE + p, { waitUntil: "networkidle", timeout: 45000 }).catch(() => { ok = false; });
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, h1: !!document.querySelector("h1") })).catch(() => ({}));
      const problems = [];
      if (!ok) problems.push("did not finish loading");
      if (m.sw > m.iw + 1) problems.push(`sideways scroll (${m.sw}px on ${m.iw}px)`);
      if (!m.h1) problems.push("no heading");
      if (errs.length) problems.push(errs.slice(0, 2).join(" | "));
      check(`${name}-${vpName}`, `${p}`, problems.length === 0, problems.join("; "));
      await page.close();
    }
    await ctx.close();
  }
  // forms in this engine
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  let otp = 0;
  await page.route("**/api/auth/send-otp", async (route) => { if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" } }); otp++; return route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: '{"ok":true}' }); });
  await page.goto(SITE + "/apply-now.php?utm_source=google&utm_medium=cpc&utm_campaign=autotest_xb&gclid=XB1", { waitUntil: "networkidle" });
  await page.fill("#applyPhoneInput", "123");
  await page.click("#btnSendOtp");
  await page.waitForTimeout(600);
  check(`${name}-forms`, "apply-now refuses a short phone number (no OTP request)", otp === 0, `${otp} request(s)`);
  const stored = await page.evaluate(() => localStorage.getItem("pim_attr_v2"));
  check(`${name}-forms`, "the campaign link is remembered by the attribution script", !!stored && /google/.test(stored) && /XB1/.test(stored), String(stored).slice(0, 100));
  await ctx.close();
  await browser.close();
}
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: Firefox and WebKit smoke test (phase 15, read-only)\n\n${pages.length} key pages at phone and desktop size in each engine, plus the apply-now phone check and the attribution script. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. 0 records created, 0 SMS, 0 bureau calls.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
