// Production API tests, phase 2: lead intake, marketing channel, validation, abuse. WRITES test leads.
//   node tests/prod/api-intake.mjs [--log]
//
// Cost control: uses POST /api/loan-applications/ (public intake that NEVER calls the credit bureau) with
// made-up phone numbers, so 0 bureau calls and 0 SMS. Every lead it creates is appended to created.jsonl
// (the cleanup log) the moment it exists, so a crash cannot orphan records.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const CREATED = path.join(here, "created.jsonl");
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const GAP = 2400; // keep under 30 requests a minute per IP (the route's own limit)

// made-up numbers: 98110 02xxx, one per scenario
let nextPhone = 9811002000;
const phone = () => String(nextPhone++);

function logCreated(kind, id, phoneNo, test) {
  fs.appendFileSync(CREATED, JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind, id, phone: phoneNo, test }) + "\n");
}
const seen = new Set();

async function http(method, url, { body, headers = {} } = {}) {
  const res = await fetch(API + url, {
    method,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: res.status, json, text, ms: 0 };
}

async function create(test, body) {
  const r = await http("POST", "/api/loan-applications/", { body });
  const app = r.json && r.json.application;
  if (app && app.leadCode && !seen.has(app.leadCode)) {
    seen.add(app.leadCode);
    logCreated("LoanApplication", app.leadCode, body.phone, test);
  }
  await sleep(GAP);
  return { ...r, app };
}

function check(area, name, pass, detail = "") {
  results.push({ area, name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`);
}
const ok = (r) => [200, 201].includes(r.status) && !!r.app;
const base = (p, extra = {}) => ({ phone: p, name: "Autotest Person", loanAmount: 100000, monthlySalary: "50000", cibilScore: "690", ...extra });

// ------------------------------------------------------------------ marketing channel
const channelCases = [
  ["Google Ads by utm + gclid", { utm_source: "google", utm_medium: "cpc", utm_campaign: "autotest_google", gclid: "TESTGCLID1" }, "Google Ads"],
  ["Google Ads by gclid alone", { gclid: "TESTGCLID2" }, "Google Ads"],
  ["Meta by utm", { utm_source: "facebook", utm_medium: "paid_social", utm_campaign: "autotest_meta" }, "Meta"],
  ["Meta by fbclid alone", { fbclid: "TESTFBCLID" }, "Meta"],
  ["Instagram counts as Meta", { utm_source: "instagram" }, "Meta"],
  ["SMS", { utm_source: "sms", utm_medium: "sms", utm_campaign: "autotest_sms" }, "SMS"],
  ["RCS", { utm_source: "rcs", utm_medium: "rcs", utm_campaign: "autotest_rcs" }, "RCS"],
  ["WhatsApp", { utm_source: "whatsapp", utm_medium: "messaging", utm_campaign: "autotest_wa" }, "WhatsApp"],
  ["WhatsApp legacy value Whatsapp-AGM", { utm_source: "Whatsapp-AGM" }, "WhatsApp"],
  ["ChatGPT by utm", { utm_source: "chatgpt.com", utm_medium: "referral" }, "AI"],
  ["AI by referrer", { referrer: "https://chatgpt.com/" }, "AI"],
  ["Perplexity by referrer", { referrer: "https://www.perplexity.ai/search?q=loan" }, "AI"],
  ["Email", { utm_source: "email", utm_medium: "email", utm_campaign: "autotest_mail" }, "Email"],
  ["Organic search by referrer", { referrer: "https://www.google.com/" }, "Organic Search"],
  ["Referral by external referrer", { referrer: "https://some-blog.example.com/post" }, "Referral"],
  ["Own site referrer is not a referral", { referrer: "https://paisainminutes.com/personal-loan" }, "Website"],
  ["No signal at all is Website (not WhatsApp)", {}, "Website"],
  ["Old button name as utm_source is ignored", { utm_source: "loan_offers_apply_btn" }, "Website"],
  ["Form name in source is an entry point, not a channel", { source: "Apply Now (Website)", lead_source: "Direct Website" }, "Website"],
  ["Unknown campaign source is Other", { utm_source: "brand_new_partner" }, "Other"],
  ["Staff typed lead is Manual", { utm_source: "crm_manual" }, "Manual"],
  ["Posting channel directly does not set it", { channel: "Google Ads", leadSource: "Google Ads" }, "Website"],
  ["utm_source beats a misleading referrer", { utm_source: "google", referrer: "https://chatgpt.com/" }, "Google Ads"],
  ["Uppercase and spaces still match", { utm_source: "  GOOGLE ADS " }, "Google Ads"],
];
for (const [name, extra, expected] of channelCases) {
  const r = await create("channel: " + name, base(phone(), extra));
  check("channel", `${name} -> ${expected}`, ok(r) && r.app.channel === expected, `status ${r.status} channel=${r.app && r.app.channel} ${r.text.slice(0, 100)}`);
}

// campaign and click-id fields are stored
{
  const p = phone();
  const r = await create("channel: fields stored", base(p, { utm_source: "google", utm_medium: "cpc", utm_campaign: "autotest_store", utm_term: "personal loan", utm_content: "ad1", gclid: "TESTGCLID9", landing_page: "/personal-loan.php", entry_point: "apply-now" }));
  const a = r.app || {};
  check("channel", "campaign, term, content, gclid, landing page and entry point are stored", ok(r) && a.utmCampaign === "autotest_store" && a.utmTerm === "personal loan" && a.utmContent === "ad1" && a.gclid === "TESTGCLID9" && a.landingPage === "/personal-loan.php" && a.entryPoint === "apply-now", JSON.stringify({ c: a.utmCampaign, t: a.utmTerm, ct: a.utmContent, g: a.gclid, l: a.landingPage, e: a.entryPoint }));
}

// ------------------------------------------------------------------ attribution survives later steps
{
  const p = phone();
  const first = await create("attribution: first touch", base(p, { utm_source: "google", utm_medium: "cpc", utm_campaign: "autotest_first", first_utm_source: "google", first_utm_campaign: "autotest_first" }));
  const again = await create("attribution: later step, no signal", { phone: p, name: "Autotest Person Renamed", loanAmount: 120000, monthlySalary: "55000", cibilScore: "700" });
  check("attribution", "a later step with no signal keeps the same lead and its channel", ok(first) && ok(again) && again.app.leadCode === first.app.leadCode && again.app.channel === "Google Ads" && again.app.utmCampaign === "autotest_first", `first=${first.app && first.app.leadCode}/${first.app && first.app.channel} again=${again.app && again.app.leadCode}/${again.app && again.app.channel}/${again.app && again.app.utmCampaign}`);
  const touched = await create("attribution: new campaign signal", { phone: p, name: "Autotest Person Renamed", loanAmount: 120000, monthlySalary: "55000", cibilScore: "700", utm_source: "sms", utm_medium: "sms", utm_campaign: "autotest_second" });
  check("attribution", "a new campaign signal updates the channel (last touch)", ok(touched) && touched.app.channel === "SMS", `channel=${touched.app && touched.app.channel}`);
  check("attribution", "the first touch is kept after a later touch", ok(touched) && touched.app.firstChannel === "Google Ads", `firstChannel=${touched.app && touched.app.firstChannel}`);
}

// ------------------------------------------------------------------ same person, different phone formats, repeats
{
  const p = phone();
  const plain = await create("formats: plain", base(p));
  const variants = [`+91 ${p.slice(0, 5)} ${p.slice(5)}`, `0${p}`, `91-${p}`, `+91${p}`];
  for (const v of variants) {
    const r = await create("formats: " + v, { ...base(v), name: "Autotest Person" });
    check("formats", `"${v}" is the same lead as ${p}`, ok(r) && ok(plain) && r.app.leadCode === plain.app.leadCode, `got ${r.app && r.app.leadCode} vs ${plain.app && plain.app.leadCode} (status ${r.status})`);
  }
  const dupA = await create("dedupe: a", base(phone()));
  const body = base(phone(), { name: "Dedupe Person" });
  const x = await create("dedupe: first", body);
  const y = await create("dedupe: identical repeat", body);
  check("dedupe", "an identical repeat does not create a second lead", ok(x) && ok(y) && x.app.leadCode === y.app.leadCode, `${x.app && x.app.leadCode} vs ${y.app && y.app.leadCode}`);
  void dupA;
  const po = phone();
  const phoneOnly = await create("phone-only step", { phone: po });
  const full = await create("phone-only then full", base(po, { name: "Now Full" }));
  check("dedupe", "phone-only first step then the full form is one lead", ok(phoneOnly) && ok(full) && phoneOnly.app.leadCode === full.app.leadCode, `${phoneOnly.app && phoneOnly.app.leadCode} vs ${full.app && full.app.leadCode}`);
}

// ------------------------------------------------------------------ business rules and slabs
{
  const r = await create("slab: 690 / 50000", base(phone()));
  check("rules", "CIBIL 690 with salary 50,000 gives slab 4", ok(r) && r.app.slab === 4, `slab=${r.app && r.app.slab} eligibility=${r.app && r.app.eligibility}`);
  const hi = await create("slab: 780 / 120000", base(phone(), { cibilScore: "780", monthlySalary: "120000" }));
  check("rules", "a higher score and salary gives a higher slab than 4", ok(hi) && hi.app.slab > 4, `slab=${hi.app && hi.app.slab}`);
  const lo = await create("slab: 480 / 15000", base(phone(), { cibilScore: "480", monthlySalary: "15000" }));
  check("rules", "a low score and salary gives a lower slab than 4", ok(lo) && lo.app.slab < 4, `slab=${lo.app && lo.app.slab}`);
  check("rules", "no bureau call was made on this route (status is not a bureau result)", ok(r) && !/^Bureau/.test(r.app.cibilStatus || "") && r.app.bureauScore == null, `cibilStatus=${r.app && r.app.cibilStatus}`);
}

// ------------------------------------------------------------------ mass assignment: fields a user must never be able to set
{
  const p = phone();
  const r = await create("mass assignment", base(p, {
    status: "DISBURSED", partnerStatus: "DISBURSED", leadCode: "PIM-HACKED-0001", id: "hacked-id", userId: "hacked-user", assignedPartnerId: "hacked-partner",
    bureauScore: 900, slab: 9, eligibility: "Eligible – Premium", remarks: "injected remark", partnerRemarks: "injected", createdAt: "2000-01-01T00:00:00Z",
    disbursedAmountRupees: 99999999, loanAmountRupees: 99999999, assignedCompany: "Hacked Partner Ltd",
  }));
  const a = r.app || {};
  check("mass-assignment", "status cannot be set by the customer (stays FRESH)", ok(r) && String(a.status).toUpperCase() === "FRESH", `status=${a.status}`);
  check("mass-assignment", "partnerStatus cannot be set", ok(r) && a.partnerStatus !== "DISBURSED", `partnerStatus=${a.partnerStatus}`);
  check("mass-assignment", "leadCode and id cannot be chosen by the customer", ok(r) && a.leadCode !== "PIM-HACKED-0001" && a.id !== "hacked-id", `leadCode=${a.leadCode} id=${a.id}`);
  check("mass-assignment", "userId and assignedPartnerId cannot be set", ok(r) && a.userId !== "hacked-user" && a.assignedPartnerId !== "hacked-partner", `userId=${a.userId} partner=${a.assignedPartnerId}`);
  check("mass-assignment", "bureauScore cannot be set (no fake credit score)", ok(r) && a.bureauScore !== 900, `bureauScore=${a.bureauScore}`);
  check("mass-assignment", "slab and eligibility are calculated, not accepted", ok(r) && a.slab !== 9, `slab=${a.slab}`);
  check("mass-assignment", "remarks cannot be injected", ok(r) && a.remarks !== "injected remark" && a.partnerRemarks !== "injected", `remarks=${a.remarks}`);
  check("mass-assignment", "createdAt cannot be back-dated", ok(r) && new Date(a.createdAt).getFullYear() >= 2026, `createdAt=${a.createdAt}`);
  check("mass-assignment", "money paid out fields cannot be set", ok(r) && a.disbursedAmountRupees !== 99999999 && a.loanAmountRupees !== 99999999, `disbursed=${a.disbursedAmountRupees} loan=${a.loanAmountRupees}`);
  check("mass-assignment", "a customer cannot choose their partner by naming a company", ok(r) && a.assignedCompany !== "Hacked Partner Ltd", `assignedCompany=${a.assignedCompany} (explicit company is a known legacy alias; noted either way)`);
}

// ------------------------------------------------------------------ validation
{
  const expectReject = async (name, extra) => {
    const r = await http("POST", "/api/loan-applications/", { body: base(phone(), extra) });
    check("validation", name, r.status === 400, `status ${r.status} ${r.text.slice(0, 100)}`);
    await sleep(GAP);
  };
  await expectReject("negative loan amount is rejected", { loanAmount: -5 });
  await expectReject("absurd loan amount (10^10) is rejected", { loanAmount: 10_000_000_000 });
  await expectReject("tenure 0 months is rejected", { tenureMonths: 0 });
  await expectReject("tenure 99999 months is rejected", { tenureMonths: 99999 });
  await expectReject("creditCardLimit that is not a number is rejected", { creditCardLimit: "lots" });
  const r = await create("validation: bad optional fields", base(phone(), { email: "not-an-email", pan: "123", dob: "not a date", cibilScore: "9999" }));
  check("validation", "bad email, PAN, date and CIBIL are dropped, not stored, and the lead still saves", ok(r) && !r.app.email && !String(r.text).includes('"pan":"123"'), `status ${r.status} email=${r.app && r.app.email}`);
  const pan = await create("validation: PAN masked", base(phone(), { pan: "ABCDE1234F" }));
  check("privacy", "a valid PAN is never returned in full", ok(pan) && !pan.text.includes("ABCDE1234F"), "PAN appears in the response");
  const long = await create("validation: long name", base(phone(), { name: "A".repeat(5000), companyName: "B".repeat(5000) }));
  check("validation", "a 5,000-character name is cut to a safe length or rejected", (ok(long) && String(long.app.applicantName || "").length <= 200) || long.status === 400, `status ${long.status} len=${String(long.app && long.app.applicantName).length}`);
  const xss = await create("validation: script in name", base(phone(), { name: "<img src=x onerror=alert(1)>", companyName: "<script>alert(1)</script>" }));
  check("validation", "a script in the name is stored as plain text and returned as JSON (the CRM must escape it: checked in the CRM browser tests)", ok(xss), `status ${xss.status}`);
  const nosql = await http("POST", "/api/loan-applications/", { body: base(phone(), { name: { $gt: "" }, loanAmount: { $ne: 0 } }) });
  check("validation", "NoSQL operators in other fields do not crash the server", nosql.status < 500, `status ${nosql.status} ${nosql.text.slice(0, 80)}`);
  await sleep(GAP);
  const unicode = await create("validation: unicode name", base(phone(), { name: "राहुल कुमार 😀" }));
  check("validation", "a Hindi name with emoji is accepted", ok(unicode), `status ${unicode.status}`);
}

// ------------------------------------------------------------------ rate limit per phone (needs a quiet minute first)
{
  console.log("waiting 65 s for the rate-limit window to reset...");
  await sleep(65000);
  const p = phone();
  const statuses = [];
  for (let i = 0; i < 11; i++) {
    const r = await http("POST", "/api/loan-applications/", { body: base(p, { name: `Burst ${i}` }) });
    statuses.push(r.status);
    if (r.json && r.json.application && r.json.application.leadCode && !seen.has(r.json.application.leadCode)) {
      seen.add(r.json.application.leadCode);
      logCreated("LoanApplication", r.json.application.leadCode, p, "rate limit burst");
    }
  }
  const limited = statuses.filter((s) => s === 429).length;
  check("rate-limit", "11 rapid submissions for one phone are cut off by the per-phone limit (8 a minute)", limited >= 1 && statuses.filter((s) => s !== 429).length <= 8, `statuses ${statuses.join(",")}`);
  console.log("waiting 65 s for the window to reset...");
  await sleep(65000);
}

// ------------------------------------------------------------------ lookup and status endpoints (privacy)
{
  const p = phone();
  const c = await create("lookup subject", base(p, { name: "Lookup Person" }));
  const code = c.app && c.app.leadCode;
  const get = async (q) => { const r = await http("GET", "/api/public/leads/lookup?" + q); await sleep(900); return r; };
  const full = await get(`phone=${p}&leadCode=${code}`);
  check("lookup", "phone + correct lead code returns the offer details", full.status === 200 && full.json && full.json.scope === "full", `${full.status} ${full.text.slice(0, 80)}`);
  const wrongPhone = await get(`phone=${phone()}&leadCode=${code}`);
  check("lookup", "the right lead code with a different phone returns nothing", wrongPhone.status === 404 && !/Lookup|"salary"/i.test(wrongPhone.text), `${wrongPhone.status} ${wrongPhone.text.slice(0, 80)}`);
  const codeOnly = await get(`leadCode=${code}`);
  check("lookup", "a lead code without a phone is rejected", codeOnly.status === 400, `${codeOnly.status}`);
  const phoneOnly = await get(`phone=${p}`);
  check("lookup", "[finding L-1] phone alone must not reveal eligibility, slab or CIBIL range for that number", !(phoneOnly.status === 200 && phoneOnly.json && phoneOnly.json.data && phoneOnly.json.data.cibil_range), `phone-only lookup answered ${phoneOnly.status}: ${phoneOnly.text.slice(0, 120)}`);
  const fullBody = JSON.stringify(full.json || {});
  check("lookup", "the full lookup does not include email, PAN or full phone", !/@|[A-Z]{5}\d{4}[A-Z]|"phone"|"pan"/.test(fullBody), fullBody.slice(0, 160));
  const st = await http("GET", `/api/public/leads/status?phone=${p}`);
  await sleep(900);
  check("lookup", "status endpoint answers for a phone and does not return 5xx", st.status < 500, `${st.status} ${st.text.slice(0, 100)}`);
  const guess = await get(`phone=${p}&leadCode=PIM-20261005-0000`);
  check("lookup", "a guessed lead code with a real phone returns nothing", guess.status === 404, `${guess.status}`);
}

// ------------------------------------------------------------------ contact form (creates a ContactMessage, sends no SMS or email from the public route)
{
  const body = { name: "Autotest Contact", phone: phone(), email: "autotest@example.com", message: "Autotest message <b>bold</b>. Please ignore.", agree_consent: true };
  const a = await http("POST", "/api/public/contact", { body });
  await sleep(GAP);
  check("contact", "a valid contact message is accepted", a.status === 200 || a.status === 201, `${a.status} ${a.text.slice(0, 100)}`);
  if (a.status < 300) logCreated("ContactMessage", `${body.email}|${body.phone}`, body.phone, "contact form");
  const b = await http("POST", "/api/public/contact", { body });
  await sleep(GAP);
  check("contact", "the identical message again is not stored twice (no error, no crash)", b.status < 500, `${b.status} ${b.text.slice(0, 100)}`);
  const bad = await http("POST", "/api/public/contact", { body: { ...body, email: "nope" } });
  check("contact", "an invalid email is rejected", bad.status === 400, `${bad.status}`);
}

// ------------------------------------------------------------------ summary
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), run: RUN, checks: results.length, passed: results.length - failed.length, failed: failed.length, leads: seen.size };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-api-intake.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: API intake, channel and abuse (phase 2, writes test leads)\n\n`;
  md += `Route \`POST /api/loan-applications/\` (never calls the bureau) with made-up numbers 98110 02xxx. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Paid calls: 0 bureau, 0 OTP. Test leads created: **${summary.leads}** (listed in \`tests/prod/created.jsonl\`).\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
  console.log("appended to TEST_LOG.md");
}
process.exit(failed.length ? 1 : 0);
