// Production browser tests, phase 4: what a visitor actually sees and does. Playwright + Chromium.
//   PW_DIR=<folder with node_modules/playwright> node tests/prod/site-browser.mjs [--log]
//
// Cost control: lead / OTP requests made by the pages are INTERCEPTED in the browser (answered locally, never sent),
// so this phase writes nothing, sends no SMS and makes no bureau call. Screenshots of failures go to tests/prod/shots/.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const SITE = "https://paisainminutes.com";
const CRM = "https://crm.paisainminutes.com";
const SHOTS = path.join(here, "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (area, name, pass, detail = "") => {
  results.push({ area, name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`);
};
const VIEWPORTS = { phone: { width: 390, height: 844 }, tablet: { width: 820, height: 1180 }, desktop: { width: 1366, height: 800 } };
const THIRD_PARTY = /googletagmanager|google-analytics|googleapis|gstatic|facebook|doubleclick|clarity|hotjar|cloudflareinsights/i;

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" };
// Answers a request locally. Preflights get CORS headers so the page can run its real fetch; POSTs are handed to onPost.
const intercept = async (route, onPost, body = { status: "success", ok: true, lead: {} }) => {
  if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
  onPost(route.request());
  return route.fulfill({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(body) });
};
const browser = await chromium.launch();
const slug = (s) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

// ------------------------------------------------------------------ A. layout, errors, broken requests at three sizes
const pages = ["/", "/apply-now.php", "/check-eligibility.php", "/personal-loan.php", "/credit-card.php", "/home-loan.php", "/loan-offers.php", "/blog.php", "/contact-us.php", "/about-us.php", "/personal-loan-emi-calculator.php", "/free-cibil-score.php", "/privacy-policy.php", "/terms-and-conditions.php"];
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: vp });
  for (const p of pages) {
    const page = await ctx.newPage();
    const errors = [];
    const bad = [];
    page.on("pageerror", (e) => errors.push("script error: " + e.message.slice(0, 100)));
    page.on("console", (m) => { if (m.type() === "error" && !THIRD_PARTY.test(m.text())) errors.push("console: " + m.text().slice(0, 100)); });
    page.on("response", (r) => { if (r.status() >= 400 && !THIRD_PARTY.test(r.url())) bad.push(`${r.status()} ${r.url().replace(SITE, "").slice(0, 80)}`); });
    let loaded = true;
    await page.goto(SITE + p, { waitUntil: "networkidle", timeout: 45000 }).catch(() => { loaded = false; });
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, h1: !!document.querySelector("h1"), imgsBroken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.offsetParent !== null).length, tiny: [...document.querySelectorAll("a,button")].filter((e) => e.offsetParent && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0 && (e.getBoundingClientRect().height < 24 || e.getBoundingClientRect().width < 24)).length })).catch(() => ({}));
    const problems = [];
    if (!loaded) problems.push("did not finish loading");
    if (m.sw > m.iw + 1) problems.push(`horizontal scroll (${m.sw}px wide on a ${m.iw}px screen)`);
    if (!m.h1) problems.push("no visible h1");
    if (m.imgsBroken) problems.push(`${m.imgsBroken} broken image(s)`);
    if (errors.length) problems.push(errors.slice(0, 2).join(" | "));
    if (bad.length) problems.push("failed requests: " + bad.slice(0, 3).join(", "));
    check("layout", `${p} on ${vpName}`, problems.length === 0, problems.join("; "));
    if (problems.length) await page.screenshot({ path: path.join(SHOTS, `${vpName}-${slug(p)}.png`), fullPage: false }).catch(() => {});
    await page.close();
  }
  await ctx.close();
}

// ------------------------------------------------------------------ B. calculators give the right numbers
const emi = (P, annual, n) => { const r = annual / 12 / 100; return r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); };
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  await page.goto(SITE + "/personal-loan-emi-calculator.php", { waitUntil: "networkidle" });
  const setBox = async (id, v) => { await page.fill("#" + id, String(v)); await page.dispatchEvent("#" + id, "input"); await page.dispatchEvent("#" + id, "change"); };
  const readEmi = async () => Number(((await page.textContent("#resEMI")) || "").replace(/[^\d.]/g, ""));
  for (const [P, rate, n] of [[200000, 10.99, 36], [500000, 12, 60], [100000, 15.5, 12], [1000000, 9.5, 84], [50000, 18, 6]]) {
    await setBox("plAmtBox", P); await setBox("plRateBox", rate); await setBox("plTimeBox", n);
    await page.waitForTimeout(250);
    const shown = await readEmi();
    const want = Math.round(emi(P, rate, n));
    check("calculator", `personal loan EMI for ₹${P.toLocaleString("en-IN")} at ${rate}% for ${n} months = ₹${want.toLocaleString("en-IN")}`, Math.abs(shown - want) <= 1, `page shows ₹${shown}`);
  }
  for (const [label, P, rate, n] of [["zero amount", 0, 11, 36], ["zero rate", 100000, 0, 12], ["huge amount", 99999999999, 11, 36]]) {
    await setBox("plAmtBox", P); await setBox("plRateBox", rate); await setBox("plTimeBox", n);
    await page.waitForTimeout(250);
    const txt = ((await page.textContent("#resEMI")) || "") + ((await page.textContent("body")) || "").slice(0, 0);
    check("calculator", `EMI with ${label} never shows NaN, Infinity or undefined`, !/NaN|Infinity|undefined/.test(txt), `shows "${txt.trim()}"`);
  }
  await ctx.close();
}

// ------------------------------------------------------------------ C. UTM capture in a real browser (requests intercepted, nothing sent)
async function landAndSubmit(url, { referer, preset } = {}) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  if (preset) await ctx.addInitScript((p) => { try { for (const [k, v] of Object.entries(p)) localStorage.setItem(k, v); } catch (e) { /* ignore */ } }, preset);
  const page = await ctx.newPage();
  let sent = null;
  await page.route("**/api/public/leads", (route) => intercept(route, (req) => { try { sent = JSON.parse(req.postData() || "{}"); } catch { sent = {}; } }));
  await page.goto(url, { waitUntil: "networkidle", referer });
  const submit = async (path2) => {
    sent = null;
    if (path2) await page.goto(SITE + path2, { waitUntil: "networkidle" });
    await page.evaluate(async (api) => { try { await fetch(api + "/api/public/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: "9811000000", utm_source: "STALE_FORM_VALUE", lead_source: "Direct Website", source: "Apply Now (Website)" }) }); } catch (e) { /* the request is intercepted */ } }, "https://api.paisainminutes.tech");
    return sent;
  };
  return { page, ctx, submit };
}
const attrCases = [
  ["Google Ads link", `${SITE}/personal-loan.php?utm_source=google&utm_medium=cpc&utm_campaign=autotest_g&gclid=TESTG`, {}, { utm_source: "google", utm_medium: "cpc", utm_campaign: "autotest_g", gclid: "TESTG" }],
  ["Meta link with fbclid", `${SITE}/?utm_source=facebook&utm_medium=paid_social&utm_campaign=autotest_m&fbclid=TESTF`, {}, { utm_source: "facebook", utm_campaign: "autotest_m", fbclid: "TESTF" }],
  ["SMS link", `${SITE}/?utm_source=sms&utm_medium=sms&utm_campaign=autotest_s`, {}, { utm_source: "sms", utm_medium: "sms" }],
  ["RCS link", `${SITE}/?utm_source=rcs&utm_medium=rcs&utm_campaign=autotest_r`, {}, { utm_source: "rcs", utm_medium: "rcs" }],
  ["WhatsApp link", `${SITE}/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=autotest_w`, {}, { utm_source: "whatsapp", utm_medium: "messaging" }],
  ["ChatGPT link", `${SITE}/?utm_source=chatgpt.com&utm_medium=referral`, {}, { utm_source: "chatgpt.com" }],
];
for (const [name, url, opts, expect] of attrCases) {
  const s = await landAndSubmit(url, opts);
  const body = await s.submit();
  const okFields = body && Object.entries(expect).every(([k, v]) => body[k] === v);
  check("attribution", `${name}: the lead request carries the visitor's UTMs`, okFields, JSON.stringify(body));
  check("attribution", `${name}: invented form values (utm_source, lead_source) are removed`, body && body.utm_source !== "STALE_FORM_VALUE" && !("lead_source" in body), JSON.stringify({ u: body && body.utm_source, l: body && body.lead_source }));
  check("attribution", `${name}: the page name is sent as the entry point`, body && typeof body.entry_point === "string" && body.entry_point.length > 0, String(body && body.entry_point));
  if (name === "Google Ads link") {
    const stored = await s.page.evaluate(() => ({ ls: localStorage.getItem("pim_attr_v2"), ck: document.cookie.includes("pim_attr_v2") }));
    check("attribution", "UTMs are remembered in the browser (storage and cookie) for later pages", !!stored.ls && stored.ck, JSON.stringify(stored).slice(0, 120));
    const later = await s.submit("/apply-now.php");
    check("attribution", "after moving to another page the same campaign is still sent", later && later.utm_source === "google" && later.utm_campaign === "autotest_g" && later.gclid === "TESTG", JSON.stringify(later));
    check("attribution", "the first touch is sent as first_utm_source", later && later.first_utm_source === "google", JSON.stringify(later && later.first_utm_source));
    const internal = await s.submit("/apply-now.php?utm_source=google");
    check("attribution", "an internal link with only ?utm_source=google keeps the medium and campaign", internal && internal.utm_medium === "cpc" && internal.utm_campaign === "autotest_g", JSON.stringify(internal));
    const cleanLanding = await s.page.evaluate(() => JSON.parse(localStorage.getItem("pim_attr_v2")).last.landing_page);
    check("attribution", "the original landing page is kept after internal navigation", cleanLanding === "/personal-loan.php" || cleanLanding === "/personal-loan", cleanLanding);
  }
  await s.ctx.close();
}
{
  const s = await landAndSubmit(`${SITE}/personal-loan.php`, { referer: "https://chatgpt.com/" });
  const body = await s.submit();
  check("attribution", "a visit from chatgpt.com (no UTM) sends the referrer so the server can classify it as AI", body && /chatgpt\.com/.test(body.referrer || ""), JSON.stringify(body));
  await s.ctx.close();
}
{
  const s = await landAndSubmit(`${SITE}/personal-loan.php`);
  const body = await s.submit();
  check("attribution", "a visit with no campaign sends NO utm_source at all (never an invented WhatsApp)", body && !body.utm_source && !body.gclid && !body.fbclid, JSON.stringify(body));
  await s.ctx.close();
}
{
  const s = await landAndSubmit(`${SITE}/personal-loan.php`, { preset: { pim_utm_source: "loan_offers_apply_btn" } });
  const body = await s.submit();
  const legacy = await s.page.evaluate(() => localStorage.getItem("pim_utm_source"));
  check("attribution", "a stale legacy value (button name) left in the browser is cleared and not sent", body && !body.utm_source && !legacy, JSON.stringify({ body, legacy }));
  await s.ctx.close();
}
{
  const s = await landAndSubmit(`${SITE}/?utm_source=%3Cscript%3Ealert(1)%3C%2Fscript%3E&utm_campaign=${"x".repeat(500)}`);
  const body = await s.submit();
  check("attribution", "hostile UTM values are sent as inert text and cut to a safe length", body && (body.utm_campaign || "").length <= 200 && !/<script>/i.test(await s.page.content().then((c) => c.replace(/<script[\s\S]*?<\/script>/gi, ""))), JSON.stringify(body).slice(0, 160));
  await s.ctx.close();
}

// ------------------------------------------------------------------ D. forms: validation before any request leaves the browser
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.phone });
  const page = await ctx.newPage();
  let otpCalls = 0;
  await page.route("**/api/auth/send-otp", (route) => intercept(route, () => { otpCalls++; }));
  await page.goto(SITE + "/apply-now.php", { waitUntil: "networkidle" });
  await page.click("#btnSendOtp");
  await page.waitForTimeout(600);
  check("forms", "apply-now: Send OTP with an empty phone does not send an OTP request", otpCalls === 0, `${otpCalls} request(s) left the browser`);
  for (const bad of ["123", "5123456789", "98765abcde"]) {
    await page.fill("#applyPhoneInput", bad);
    await page.click("#btnSendOtp");
    await page.waitForTimeout(500);
    check("forms", `apply-now: phone "${bad}" does not send an OTP request`, otpCalls === 0, `${otpCalls} request(s) left the browser`);
  }
  const maxlen = await page.getAttribute("#applyPhoneInput", "maxlength");
  check("forms", "apply-now: the phone box is limited to 10 characters", maxlen === "10", String(maxlen));
  await page.fill("#applyPhoneInput", "9876543210"); // any valid-looking number: the OTP request is intercepted in this test
  await page.evaluate(() => { for (const id of ["step1Consent1", "step1Consent2"]) { const c = document.getElementById(id); if (c) c.checked = false; } });
  await page.click("#btnSendOtp");
  await page.waitForTimeout(600);
  check("forms", "apply-now: a valid phone with the consent boxes unticked does not send an OTP request", otpCalls === 0, `${otpCalls} request(s) left the browser`);
  const sw = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  check("forms", "apply-now: no horizontal scroll on a phone", sw, "page is wider than the screen");
  await ctx.close();
}

// ------------------------------------------------------------------ E. CRM login screen
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 100)));
  await page.goto(CRM + "/", { waitUntil: "networkidle" });
  check("crm", "login screen shows an email box, a password box and Sign In", (await page.locator("input[type=password]").count()) === 1 && (await page.getByRole("button", { name: /sign in/i }).count()) >= 1, "login form not found");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForTimeout(700);
  const stillLogin = await page.locator("input[type=password]").count();
  check("crm", "submitting an empty login does nothing harmful (stays on the login screen)", stillLogin === 1, "left the login screen");
  const inputs = page.locator("input");
  await inputs.nth(0).fill("autotest.nobody@paisainminutes-test.invalid");
  await inputs.nth(1).fill("definitely-wrong-password");
  const loginResp = page.waitForResponse((r) => /staff\/login/.test(r.url()), { timeout: 15000 }).catch(() => null);
  await page.getByRole("button", { name: /sign in/i }).click();
  const resp = await loginResp;
  await page.waitForTimeout(800);
  const body = await page.textContent("body");
  check("crm", "a wrong login is refused by the server (401)", resp && resp.status() === 401, String(resp && resp.status()));
  check("crm", "a wrong login shows a readable message and stays on the login screen", (await page.locator("input[type=password]").count()) === 1 && /invalid|incorrect|wrong|failed|credentials/i.test(body), body.replace(/\s+/g, " ").slice(0, 160));
  check("crm", "the error does not reveal whether the email exists or show a stack trace", !/not found|no such user|stack|at \w+ \(/i.test(body), body.replace(/\s+/g, " ").slice(0, 120));
  const type = await inputs.nth(1).getAttribute("type");
  await page.getByRole("button", { name: /show/i }).click().catch(() => {});
  const shown = await inputs.nth(1).getAttribute("type").catch(() => null);
  check("crm", "the Show button reveals the password field", type === "password" && shown === "text", `${type} -> ${shown}`);
  const ls = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  check("crm", "nothing sensitive (token, password) is stored after a failed login", !/token|password/i.test(ls.replace(/pim_attr[^,]*/g, "")), ls.slice(0, 120));
  check("crm", "no script errors on the login screen", errors.length === 0, errors.join(" | "));
  const noindex = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content || "");
  check("crm", "the CRM asks search engines not to index it", /noindex/i.test(noindex), `robots meta is "${noindex}"`);
  await ctx.close();
}
await browser.close();

// ------------------------------------------------------------------ summary
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-site-browser.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: website browser tests (phase 4)\n\n`;
  md += `Chromium at phone (390 px), tablet (820 px) and desktop (1366 px). **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Lead and OTP requests were intercepted in the browser and never sent: 0 records created, 0 SMS, 0 bureau calls.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
  console.log("appended to TEST_LOG.md");
}
process.exit(failed.length ? 1 : 0);
