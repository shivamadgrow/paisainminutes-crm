// Production browser tests, phase 13: contact page, check-eligibility, track-status. WRITES 1 contact message and updates the test number's lead.
//   PW_DIR=... node tests/prod/site-forms.mjs [--log]
// 0 bureau calls (the test number's result is stored), 0 SMS (check-eligibility has no OTP step).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const SITE = "https://paisainminutes.com";
const MY = process.env.TEST_PHONE; // the registered test number (set TEST_PHONE)
if (!MY) { console.log("Set TEST_PHONE to the registered test number."); process.exit(1); }
const dbUrl = fs.readFileSync("/home/primordic/projects/adgrow/paisa/server/.env", "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL")).replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "");
const mongo = (js) => execFileSync("mongosh", [dbUrl, "--quiet", "--eval", js], { encoding: "utf8", timeout: 60000 }).trim();
const results = [];
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };
const logCreated = (kind, id, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: "site-forms", kind, id, phone: MY, test }) + "\n");
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" };
const browser = await chromium.launch();
const newPage = async (vp = { width: 1200, height: 900 }) => { const ctx = await browser.newContext({ viewport: vp }); const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(e.message.slice(0, 100))); return { ctx, page, errs }; };

// ================================================================ contact page
{
  const { ctx, page, errs } = await newPage();
  const posts = [];
  page.on("request", (r) => { if (r.method() === "POST" && /api\.paisainminutes\.tech|submit-contact/.test(r.url())) posts.push(r.url().replace("https://", "")); });
  await page.goto(SITE + "/contact-us.php", { waitUntil: "networkidle" });
  await page.click("#btnSubmitContact").catch(() => {});
  await page.waitForTimeout(700);
  check("contact", "submitting the empty contact form sends nothing", posts.length === 0, `${posts.length} request(s)`);
  await page.fill("#contactName", "Autotest Contact UI");
  await page.fill("#contactPhone", "123");
  await page.fill("#contactEmail", "not-an-email");
  await page.fill("#contactSubject", "Autotest");
  await page.fill("#contactMessage", "hello");
  await page.check("#contactAgreeConsent");
  await page.click("#btnSubmitContact").catch(() => {});
  await page.waitForTimeout(800);
  check("contact", "a bad phone and bad email are stopped in the browser (nothing sent)", posts.length === 0, `${posts.length} request(s): ${posts.join(", ")}`);
  await page.fill("#contactPhone", "9811700001");
  await page.fill("#contactEmail", "autotest.ui@example.com");
  await page.fill("#contactMessage", "Autotest message with <b>html</b> and a long tail " + "x".repeat(200));
  await page.uncheck("#contactAgreeConsent");
  await page.click("#btnSubmitContact").catch(() => {});
  await page.waitForTimeout(800);
  check("contact", "without ticking the consent box nothing is sent", posts.length === 0, `${posts.length} request(s)`);
  const before = Number(mongo(`print(db.ContactMessage.countDocuments({}))`));
  await page.check("#contactAgreeConsent");
  await Promise.all([page.waitForResponse((r) => /contact/.test(r.url()) && r.request().method() === "POST", { timeout: 20000 }).catch(() => null), page.click("#btnSubmitContact")]);
  await page.waitForTimeout(1500);
  const after = Number(mongo(`print(db.ContactMessage.countDocuments({}))`));
  const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  check("contact", "a valid message is accepted and a thank-you is shown", /thank|sent|success|received/i.test(body), body.slice(0, 160));
  check("contact", "exactly one message was stored", after === before + 1, `${before} -> ${after}`);
  const rec = mongo(`const d=db.ContactMessage.find({email:"autotest.ui@example.com"}).sort({createdAt:-1}).limit(1).toArray()[0]; print(d?d.contactId+"|"+d.message.slice(0,40)+"|"+(d.ipAddress||""):"none")`);
  if (rec !== "none") logCreated("ContactMessage", rec.split("|")[0], "contact page UI submit");
  const storedMsg = mongo(`const d=db.ContactMessage.find({email:"autotest.ui@example.com"}).sort({createdAt:-1}).limit(1).toArray()[0]; print(d?d.message:"")`);
  check("contact", "angle brackets in the message cannot be stored as live HTML", !/<b>|<\/b>/.test(storedMsg), storedMsg.slice(0, 80));
  note("contact", "how the message was cleaned", `typed "<b>html</b>", stored "${storedMsg.slice(20, 50)}" (the < and > characters are removed, the rest is kept)`);
  check("contact", "no script errors on the contact page", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

// ================================================================ check-eligibility (real submit with the test number)
{
  const { ctx, page, errs } = await newPage();
  const leadCalls = [];
  page.on("request", (r) => { if (/\/api\/public\/leads$/.test(r.url()) && r.method() === "POST") { try { leadCalls.push(JSON.parse(r.postData() || "{}")); } catch { leadCalls.push({}); } } });
  const CAMP = "autotest_elig_" + Date.now().toString(36);
  await page.goto(`${SITE}/check-eligibility.php?utm_source=rcs&utm_medium=rcs&utm_campaign=${CAMP}`, { waitUntil: "networkidle" });
  const posts = [];
  page.on("request", (r) => { if (r.method() === "POST" && /api\/public\/leads/.test(r.url())) posts.push(1); });
  await page.click("#eligibilityCheckForm button[type=submit], #eligibilityCheckForm button:has-text('Check'), #eligibilityCheckForm button:has-text('Eligibility')").catch(() => {});
  await page.waitForTimeout(800);
  check("eligibility", "submitting the empty eligibility form sends nothing", posts.length === 0, `${posts.length} request(s)`);
  await page.fill("#eligName", "Autotest Eligibility");
  await page.fill("#eligPhone", MY);
  await page.fill("#eligEmail", "autotest.elig@example.com");
  await page.fill("#eligDob", "1992-03-20");
  await page.fill("#eligPincode", "110001");
  await page.fill("#eligSalary", "70000");
  await page.fill("#eligLoanAmount", "200000");
  await page.fill("#eligCompanyName", "Autotest Pvt Ltd");
  await page.fill("#eligPan", "ABCDE1234F");
  await page.check("#eligAgreeTerms1");
  await page.check("#eligAgreeTerms2");
  const submit = page.locator("#eligibilityCheckForm button[type=submit], #eligibilityCheckForm [type=submit]").first();
  if ((await submit.count()) === 0) note("eligibility", "submit control", "no submit button found by type; trying the last button");
  await (((await submit.count()) > 0 ? submit : page.locator("#eligibilityCheckForm button").last())).click();
  await page.waitForURL(/loan-offers/, { timeout: 40000 }).catch(() => {});
  await page.waitForLoadState("networkidle").catch(() => {});
  check("eligibility", "the eligibility form leads to the loan offers page", /loan-offers/.test(page.url()), page.url());
  check("eligibility", "the request carried the RCS campaign", leadCalls.some((c) => c.utm_source === "rcs" && c.utm_campaign === CAMP), JSON.stringify(leadCalls.map((c) => ({ s: c.utm_source, c: c.utm_campaign, e: c.entry_point }))));
  const cards = await page.locator(".partner-offer-card").count();
  check("eligibility", "partner offers are shown", cards > 0, `cards=${cards}`);
  await new Promise((r) => setTimeout(r, 1500));
  const lead = JSON.parse(mongo(`const d=db.LoanApplication.find({phone:"${MY}"}).sort({updatedAt:-1}).limit(1).toArray()[0]; print(EJSON.stringify(d,{relaxed:true}))`));
  check("eligibility", "the stored lead now has channel RCS, the campaign and the entry point check-eligibility", lead.channel === "RCS" && lead.utmCampaign === CAMP && /check-eligibility/.test(lead.entryPoint || ""), JSON.stringify({ c: lead.channel, u: lead.utmCampaign, e: lead.entryPoint }));
  check("eligibility", "the first-touch channel from the earlier SMS journey is kept (not overwritten)", lead.firstChannel === "SMS", `firstChannel=${lead.firstChannel}`);
  check("eligibility", "the lead's earlier bureau result was reused (no new call)", /No credit record/.test(lead.cibilStatus || ""), lead.cibilStatus);
  check("eligibility", "no script errors on the journey", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

// ================================================================ track-status page
{
  const { ctx, page, errs } = await newPage({ width: 390, height: 844 });
  const gets = [];
  page.on("request", (r) => { if (/leads\/(status|lookup)/.test(r.url())) gets.push(r.url().replace(/^https:\/\//, "")); });
  await page.goto(SITE + "/track-status.php", { waitUntil: "networkidle" });
  await page.fill("#phoneInput", "123");
  await page.click("form:has(#phoneInput) button[type=submit]").catch(() => {});
  await page.waitForTimeout(900);
  const bad = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  check("track", "an invalid phone shows a message and sends no lookup", gets.length === 0 && /valid|10|digit|mobile/i.test(bad), `${gets.length} request(s); ${bad.slice(0, 100)}`);
  await page.fill("#phoneInput", MY);
  await Promise.all([page.waitForResponse((r) => /leads\/status/.test(r.url()), { timeout: 15000 }).catch(() => null), page.click("form:has(#phoneInput) button[type=submit]")]);
  await page.waitForTimeout(1200);
  const shown = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  note("track", "what a stranger sees after typing only a phone number", shown.replace(/^.*?Track/i, "Track").slice(0, 400));
  check("track", "[finding F-26 in the browser] the page does not show the application reference id to someone who only typed a phone number", !/PIM-\d{8}-\d{4}/.test(shown), "the lead code is displayed on the page");
  await page.fill("#phoneInput", "9000000001");
  await page.click("form:has(#phoneInput) button[type=submit]");
  await page.waitForTimeout(1500);
  const unknown = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  check("track", "an unknown phone shows a friendly 'not found' message (no raw error)", /no active application found|not found|no application/i.test(unknown) && !/undefined|\[object|stack/i.test(unknown), unknown.slice(0, 160));
  check("track", "no horizontal scroll on a phone", await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "page wider than screen");
  check("track", "no script errors on the page", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

// ================================================================ content pages that looked odd in the crawl
{
  const { ctx, page } = await newPage();
  await page.goto(SITE + "/careers.php", { waitUntil: "networkidle" });
  const t = await page.title();
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  note("content", "/careers.php", `title "${t}", first heading "${h1.replace(/\s+/g, " ").slice(0, 60)}"`);
  check("content", "the Careers page is about careers (title and heading)", /career|job|hiring|join/i.test(t + " " + h1), `title "${t}", h1 "${h1.slice(0, 60)}": it shows the About Us page`);
  await ctx.close();
}
await browser.close();

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: contact page, check-eligibility and track-status in a browser (phase 13)\n\n**${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0. OTP SMS: 0. Writes: 1 contact message and an update of the test number's lead.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
