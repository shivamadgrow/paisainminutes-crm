// Production CRM sweep: opens every screen reachable from the menu for three roles and checks it renders cleanly. Read-only.
//   SA_EMAIL=... SA_PASSWORD=... PW_DIR=... node tests/prod/crm-sweep.mjs [--log]
// Clicks menu items only: it never presses Save, Delete, Refresh score, Export or any action button.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const CRM = "https://crm.paisainminutes.com";
const API = "https://api.paisainminutes.tech";
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const SHOTS = path.join(here, "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const browser = await chromium.launch();

async function sweep(label, email, password, viewport = { width: 1366, height: 850 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  let current = "login";
  const problems = new Map();
  const add = (msg) => { (problems.get(current) || problems.set(current, []).get(current)).push(msg); };
  const dialogs = [];
  page.on("dialog", (d) => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });
  page.on("pageerror", (e) => add("script error: " + e.message.slice(0, 100)));
  page.on("console", (m) => { if (m.type() === "error" && !/googletagmanager|fonts\.|Failed to load resource/.test(m.text())) add("console: " + m.text().slice(0, 100)); });
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(API) && !/staff\/login/.test(r.url())) add(`${r.status()} ${r.request().method()} ${r.url().replace(API, "").slice(0, 60)}`); });
  await page.goto(CRM + "/", { waitUntil: "networkidle" });
  const inp = page.locator("input");
  await inp.nth(0).fill(email); await inp.nth(1).fill(password);
  await Promise.all([page.waitForResponse((r) => /staff\/login/.test(r.url())), page.getByRole("button", { name: /sign in/i }).click()]);
  await page.waitForTimeout(2500);
  // every menu entry once (labels, without the trailing count)
  const items = await page.evaluate(() => {
    const seen = new Set(); const out = [];
    for (const e of document.querySelectorAll("nav a, nav button, aside a, aside button")) {
      const t = (e.textContent || "").trim().replace(/\s+/g, " ");
      const label = t.replace(/\s*\d+\s*$/, "").trim();
      if (!label || label.length > 40 || seen.has(label)) continue;
      if (/^(logout|sign out|collapse)/i.test(label)) continue;
      seen.add(label); out.push(label);
    }
    return out;
  });
  console.log(`${label}: ${items.length} menu entries`);
  for (const name of items) {
    current = name;
    const el = page.locator("nav a, nav button, aside a, aside button").filter({ hasText: name }).first();
    if ((await el.count()) === 0) continue;
    await el.click({ timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(1400);
    const text = await page.evaluate(() => { const m = document.querySelector("main") || document.body; const c = m.cloneNode(true); c.querySelectorAll("script,style,noscript").forEach((e) => e.remove()); return c.innerText.replace(/\s+/g, " "); });
    const issues = [...(problems.get(name) || [])];
    const bad = text.match(/.{0,20}(NaN|Infinity|undefined|\[object Object\]|Invalid Date).{0,20}/);
    if (bad) issues.push(`text shows "${bad[0]}"`);
    if (text.length < 60) issues.push("screen looks blank");
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (over && viewport.width < 600) issues.push("page scrolls sideways on a phone");
    check(`${label}`, `"${name}" opens and renders cleanly`, issues.length === 0, issues.slice(0, 3).join(" | "));
    if (issues.length) await page.screenshot({ path: path.join(SHOTS, `sweep-${label}-${name.replace(/[^a-z0-9]+/gi, "-").slice(0, 30)}.png`) }).catch(() => {});
  }
  check(label, "no dialogs or alerts popped up during the sweep", dialogs.length === 0, JSON.stringify(dialogs));
  await ctx.close();
  return items;
}
const saItems = await sweep("superadmin", process.env.SA_EMAIL, process.env.SA_PASSWORD);
const tcItems = await sweep("telecaller", creds.telecaller.email, creds.telecaller.password);
const ptItems = await sweep("partner", creds.partner.email, creds.partner.password);
const phoneItems = await sweep("superadmin-phone", process.env.SA_EMAIL, process.env.SA_PASSWORD, { width: 390, height: 844 });
await browser.close();
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary), { superadmin: saItems.length, telecaller: tcItems.length, partner: ptItems.length, phone: phoneItems.length });
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: CRM screen sweep, every menu entry for 3 roles plus the super admin on a phone (phase 14, read-only)\n\nMenu entries opened: super admin ${saItems.length}, telecaller ${tcItems.length}, partner ${ptItems.length}, super admin on a 390 px phone ${phoneItems.length}. 4 logins. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Nothing was changed: only menu items were clicked.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  md += `\n**Menu seen by the super admin:** ${saItems.join(", ")}\n\n**Menu seen by the telecaller:** ${tcItems.join(", ")}\n\n**Menu seen by the partner:** ${ptItems.join(", ")}\n`;
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
