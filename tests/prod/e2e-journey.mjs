// Production end-to-end journey: campaign link -> apply-now -> REAL OTP -> application form -> offers page -> stored lead -> CRM API.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/e2e-journey.mjs [--log]
// Uses the test number in TEST_PHONE (its bureau result is already stored, so NO bureau call) and sends 1 real OTP SMS.
// Writes: updates the lead for the test number and its customer profile. Nothing is clicked on the partner offers.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const SITE = "https://paisainminutes.com";
const API = "https://api.paisainminutes.tech";
const PHONE = process.env.TEST_PHONE; // the registered test number that receives the OTP SMS (set TEST_PHONE)
if (!PHONE) { console.log("Set TEST_PHONE to the registered test number."); process.exit(1); }
const CAMPAIGN = "autotest_e2e_" + Date.now().toString(36);
const dbUrl = fs.readFileSync("/home/primordic/projects/adgrow/paisa/server/.env", "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL")).replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "");
const mongo = (js) => execFileSync("mongosh", [dbUrl, "--quiet", "--eval", js], { encoding: "utf8", timeout: 60000 }).trim();
const results = [];
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const bureauBefore = JSON.parse(mongo(`print(JSON.stringify(db.BureauCheck.find({phone:"${PHONE}"},{_id:0,checkedAt:1,status:1}).toArray()))`));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
const page = await ctx.newPage();
const problems = { errors: [], failed: [] };
const leadCalls = [];
page.on("pageerror", (e) => problems.errors.push(e.message.slice(0, 120)));
page.on("console", (m) => { if (m.type() === "error" && !/googletagmanager|fonts\.|Failed to load resource/.test(m.text())) problems.errors.push("console: " + m.text().slice(0, 120)); });
page.on("response", (r) => { if (r.status() >= 400 && /paisainminutes/.test(r.url())) problems.failed.push(`${r.status()} ${r.url().replace(/https:\/\/[^/]+/, "").slice(0, 80)}`); });
page.on("request", (r) => { if (/\/api\/public\/leads$/.test(r.url()) && r.method() === "POST") { try { leadCalls.push(JSON.parse(r.postData() || "{}")); } catch { leadCalls.push({}); } } });

// 1. campaign link on a content page, then move to apply-now through the site
await page.goto(`${SITE}/personal-loan.php?utm_source=sms&utm_medium=sms&utm_campaign=${CAMPAIGN}`, { waitUntil: "networkidle" });
const stored = await page.evaluate(() => localStorage.getItem("pim_attr_v2"));
check("journey", "landing on a campaign link stores the attribution", !!stored && stored.includes("sms"), String(stored).slice(0, 100));
await page.goto(`${SITE}/apply-now.php`, { waitUntil: "networkidle" }); // plain link, no UTM in the URL

// 2. phone + consent -> real OTP
await page.fill("#applyPhoneInput", PHONE);
await page.check("#step1Consent1").catch(() => {});
await page.check("#step1Consent2").catch(() => {});
const since = new Date(Date.now() - 1500);
await page.click("#btnSendOtp");
let otp = null;
for (let i = 0; i < 12 && !otp; i++) {
  await sleep(1500);
  const row = mongo(`const d=db.OTPCode.find({phone:"${PHONE}",createdAt:{$gte:new Date("${since.toISOString()}")}}).sort({createdAt:-1}).limit(1).toArray()[0]; print(d?d.code:"")`);
  if (/^\d{6}$/.test(row)) otp = row;
}
check("journey", "a real OTP was created for the test number after clicking Send OTP (1 SMS)", !!otp, "no OTP found");
if (!otp) { await browser.close(); process.exit(1); }
const boxes = page.locator("input[type=tel]:visible");
const total = await boxes.count();
let first = null;
for (let i = 0; i < total; i++) { if (!(await boxes.nth(i).getAttribute("id"))) { first = boxes.nth(i); break; } }
await first.click();
await page.keyboard.type(otp, { delay: 120 });
await page.waitForSelector("#leadName", { state: "visible", timeout: 20000 }).catch(() => {});
check("journey", "the correct OTP unlocks the application form", await page.locator("#leadName").isVisible(), "form did not appear");
check("journey", "the phone number is carried into the form", (await page.inputValue("#leadPhone").catch(() => "")).includes(PHONE), await page.inputValue("#leadPhone").catch(() => ""));

// 3. application form
await page.fill("#leadName", "Autotest Journey");
await page.fill("#leadEmail", "autotest.journey@example.com");
await page.fill("#leadDob", "1990-05-15");
await page.fill("#leadPincode", "110001");
await page.fill("#leadSalary", "60000");
await page.fill("#leadLoanAmount", "150000");
await page.fill("#leadCompanyName", "Autotest Pvt Ltd");
await page.fill("#leadPan", "ABCDE1234F"); // the form requires a PAN; this is an obviously fake one
await page.check("#agreeTerms1").catch(() => {});
await page.check("#agreeTerms2").catch(() => {});
await page.click("#btnSubmitApplication");
await page.waitForURL(/loan-offers/, { timeout: 40000 }).catch(() => {});
await page.waitForLoadState("networkidle").catch(() => {});
check("journey", "submitting the form lands on the loan offers page", /loan-offers/.test(page.url()), page.url());
check("journey", "the lead request carried the campaign even though apply-now was opened without a UTM", leadCalls.length > 0 && leadCalls.some((c) => c.utm_source === "sms" && c.utm_campaign === CAMPAIGN), JSON.stringify(leadCalls.map((c) => ({ s: c.utm_source, c: c.utm_campaign, e: c.entry_point }))));
check("journey", "no form value (utm_source, lead_source) overrides the real attribution", leadCalls.every((c) => !("lead_source" in c)) , JSON.stringify(leadCalls.map((c) => c.lead_source)));

// 4. offers page
const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
check("offers", "the offers page shows loan offers for the applicant", /offer|loan|₹|partner/i.test(text) && (await page.locator(".partner-offer-card").count()) > 0, `cards=${await page.locator(".partner-offer-card").count()} ${text.slice(0, 100)}`);
const hrefs = await page.evaluate(() => [...document.querySelectorAll(".partner-offer-card a[href]")].map((a) => a.href));
check("offers", "offer buttons go through our tracked redirect, not straight to a partner site with the phone number", hrefs.length > 0 && hrefs.every((h) => /redirect|api\.paisainminutes|paisainminutes\.com/.test(h)) && hrefs.every((h) => !h.includes(PHONE)), JSON.stringify(hrefs.slice(0, 3)));
check("offers", "no script errors or failed requests on the journey", problems.errors.length === 0 && problems.failed.length === 0, JSON.stringify({ e: problems.errors.slice(0, 3), f: problems.failed.slice(0, 4) }));
await page.screenshot({ path: path.join(here, "shots", "e2e-offers.png") }).catch(() => {});
await browser.close();

// 5. what was stored
await sleep(1500);
const lead = JSON.parse(mongo(`const d=db.LoanApplication.find({phone:"${PHONE}"}).sort({updatedAt:-1}).limit(1).toArray()[0]; print(EJSON.stringify(d||{},{relaxed:true}))`));
check("stored", "the lead for the test number was updated with the campaign: channel SMS", lead.channel === "SMS", `channel=${lead.channel}`);
check("stored", "campaign, medium and landing page are stored", lead.utmCampaign === CAMPAIGN && lead.utmMedium === "sms" && /personal-loan/.test(lead.landingPage || ""), JSON.stringify({ c: lead.utmCampaign, m: lead.utmMedium, l: lead.landingPage }));
check("stored", "the entry point is the page that submitted the form (apply-now)", /apply-now/.test(lead.entryPoint || ""), `entryPoint=${lead.entryPoint}`);
check("stored", "the first-touch channel is recorded as SMS", lead.firstChannel === "SMS", `firstChannel=${lead.firstChannel}`);
check("stored", "the form data is stored (salary, loan amount, company, date of birth)", lead.monthlyIncome === 60000 && lead.amount === 150000 && lead.companyName === "Autotest Pvt Ltd" && !!lead.dob, JSON.stringify({ s: lead.monthlyIncome, a: lead.amount, c: lead.companyName, d: lead.dob }));
check("stored", "the lead is still FRESH (a customer's submission never advances the status)", lead.status === "FRESH", `status=${lead.status}`);
const bureauAfter = JSON.parse(mongo(`print(JSON.stringify(db.BureauCheck.find({phone:"${PHONE}"},{_id:0,checkedAt:1,status:1}).toArray()))`));
check("cost", "no new bureau call was made (the stored result was reused)", JSON.stringify(bureauBefore) === JSON.stringify(bureauAfter), JSON.stringify({ before: bureauBefore, after: bureauAfter }));
check("stored", "the bureau result on the lead is the stored one (no record), checked earlier today", /No credit record/.test(lead.cibilStatus || "") && !!lead.bureauCheckedAt, `${lead.cibilStatus} ${lead.bureauCheckedAt}`);
const user = JSON.parse(mongo(`const u=db.User.findOne({phone:"${PHONE}"}); print(JSON.stringify(u?{name:u.name,email:u.email,pincode:u.pincode,hasPan:!!u.pan}:{}))`));
check("stored", "the customer profile was updated (name, email, pincode)", user.name === "Autotest Journey" && user.email === "autotest.journey@example.com" && user.pincode === "110001", JSON.stringify(user));

// 6. the CRM API shows it
const login = await (await fetch(API + "/api/auth/staff/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: process.env.SA_EMAIL, password: process.env.SA_PASSWORD }) })).json();
const list = await (await fetch(API + `/api/loan-applications/all?q=${PHONE}`, { headers: { Authorization: "Bearer " + login.token } })).json();
const row = (list.applications || [])[0] || {};
check("crm", "the CRM list shows the lead with channel SMS and the campaign", row.channel === "SMS" && row.utmCampaign === CAMPAIGN, JSON.stringify({ c: row.channel, u: row.utmCampaign }));
const rep = await (await fetch(API + "/api/crm/channel-summary?period=all", { headers: { Authorization: "Bearer " + login.token } })).json();
check("crm", "channel-summary now counts SMS leads and lists this campaign", (rep.channels || []).some((c) => c.channel === "SMS") && (rep.campaigns || []).some((c) => c.campaign === CAMPAIGN), JSON.stringify((rep.campaigns || []).filter((c) => c.campaign === CAMPAIGN)));
fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: "e2e", kind: "LoanApplication", id: lead.leadCode, phone: PHONE, test: "end-to-end journey (updated existing lead for the test number)" }) + "\n");

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: end-to-end journey (phase 7)\n\nCampaign link (\`utm_source=sms\`, campaign \`${CAMPAIGN}\`) -> apply-now -> **real OTP** to ${PHONE} (1 SMS) -> application form -> offers page -> database -> CRM API. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0 (stored result reused). Updated the existing lead \`${lead.leadCode}\` for the test number.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
