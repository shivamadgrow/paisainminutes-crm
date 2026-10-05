// Production API tests, phase 12: the customer side (profile, bank accounts, documents, KYC, credit score) and the partner postback.
// SENDS 1 real OTP SMS to the test number and makes 2 paid bureau calls (credit-score/check has no cache). WRITES test data.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/api-customer.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const MY = process.env.TEST_PHONE; // the registered test number that receives the OTP SMS (set TEST_PHONE)
if (!MY) { console.log("Set TEST_PHONE to the registered test number."); process.exit(1); }
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const dbUrl = fs.readFileSync("/home/primordic/projects/adgrow/paisa/server/.env", "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL")).replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "");
const mongo = (js) => execFileSync("mongosh", [dbUrl, "--quiet", "--eval", js], { encoding: "utf8", timeout: 60000 }).trim();
const results = [];
let bureauCalls = 0;
let sms = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logCreated = (kind, id, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind, id, phone: MY, test }) + "\n");
async function http(method, url, { body, token, form, headers = {} } = {}) {
  const r = await fetch(API + url, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }, body: form ? form : body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(40000), redirect: "manual" });
  const buf = Buffer.from(await r.arrayBuffer());
  const text = buf.toString("utf8"); let json = null; try { json = JSON.parse(text); } catch { /* */ }
  await sleep(300); return { status: r.status, json, text, buf, headers: r.headers };
}
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };

// ---------------------------------------------------------------- customer login (1 real OTP)
const since = new Date(Date.now() - 1500);
const send = await http("POST", "/api/auth/send-otp", { body: { phone: MY } });
if (send.status !== 200) { console.log("OTP send failed", send.status, send.text.slice(0, 100)); process.exit(1); }
sms++;
let otp = null;
for (let i = 0; i < 10 && !otp; i++) { await sleep(1500); const c = mongo(`const d=db.OTPCode.find({phone:"${MY}",createdAt:{$gte:new Date("${since.toISOString()}")}}).sort({createdAt:-1}).limit(1).toArray()[0]; print(d?d.code:"")`); if (/^\d{6}$/.test(c)) otp = c; }
const ver = await http("POST", "/api/auth/verify-otp", { body: { phone: MY, code: otp } });
check("login", "customer logs in with a real OTP (1 SMS)", ver.status === 200 && !!ver.json.token, `${ver.status}`);
const T = ver.json.token;
const SAlg = await http("POST", "/api/auth/staff/login", { body: { email: process.env.SA_EMAIL, password: process.env.SA_PASSWORD } });
const SA = SAlg.json.token;
const plog = await http("POST", "/api/auth/staff/login", { body: { email: creds.partner.email, password: creds.partner.password } });
const PT = plog.json.token;

// ---------------------------------------------------------------- profile
{
  const me = await http("GET", "/api/users/me", { token: T });
  check("profile", "GET /api/users/me returns the customer", me.status === 200 && JSON.stringify(me.json).includes(MY), `${me.status}`);
  const ok = await http("PATCH", "/api/users/me", { token: T, body: { name: "Autotest Customer", email: "autotest.customer@example.com", city: "Delhi", state: "Delhi", pincode: "110001" } });
  check("profile", "profile fields can be updated", ok.status === 200, `${ok.status} ${ok.text.slice(0, 100)}`);
  const bad = async (name, body) => { const r = await http("PATCH", "/api/users/me", { token: T, body }); check("profile", name, r.status === 400, `${r.status} ${r.text.slice(0, 100)}`); };
  await bad("an invalid email is rejected", { email: "not-an-email" });
  await bad("an invalid PAN is rejected", { pan: "123" });
  await bad("a pincode with letters is rejected", { pincode: "abc123" });
  const mass = await http("PATCH", "/api/users/me", { token: T, body: { role: "ADMIN", phone: "9000000000", id: "hacked", creditScore: 900, kycStatus: "VERIFIED" } });
  const after = await http("GET", "/api/users/me", { token: T });
  check("profile", "role, phone, id and KYC status cannot be changed through the profile", JSON.stringify(after.json).includes(MY) && !/ADMIN|hacked|VERIFIED/.test(JSON.stringify(after.json)), `${mass.status} ${after.text.slice(0, 150)}`);
  const pan = await http("PATCH", "/api/users/me", { token: T, body: { pan: "ABCDE1234F" } });
  const withPan = await http("GET", "/api/users/me", { token: T });
  check("profile", "a PAN can be saved and is never returned in full", pan.status === 200 && !withPan.text.includes("ABCDE1234F") && !pan.text.includes("ABCDE1234F"), `${pan.status} ${withPan.text.slice(0, 160)}`);
  const longName = await http("PATCH", "/api/users/me", { token: T, body: { name: "N".repeat(5000) } });
  check("profile", "a 5,000-character name is cut or rejected, not stored whole", longName.status === 400 || (await http("GET", "/api/users/me", { token: T })).json.user.name.length < 500, `${longName.status}`);
  await http("PATCH", "/api/users/me", { token: T, body: { name: "Autotest Customer" } });
  const un = await http("GET", "/api/users/me");
  check("profile", "no profile without a login", un.status === 401, `${un.status}`);
}

// ---------------------------------------------------------------- bank accounts
{
  const bad = async (name, body) => { const r = await http("POST", "/api/users/me/bank-accounts", { token: T, body }); check("bank", name, r.status === 400, `${r.status} ${r.text.slice(0, 100)}`); };
  await bad("a bank account with an invalid IFSC is rejected", { bankName: "Autotest Bank", ifsc: "BADIFSC", accountNumber: "123456789012" });
  await bad("an account number with letters is rejected", { bankName: "Autotest Bank", ifsc: "HDFC0001234", accountNumber: "12AB56789" });
  await bad("an account number that is too short is rejected", { bankName: "Autotest Bank", ifsc: "HDFC0001234", accountNumber: "123" });
  await bad("a bank name of one letter is rejected", { bankName: "X", ifsc: "HDFC0001234", accountNumber: "123456789012" });
  const c = await http("POST", "/api/users/me/bank-accounts", { token: T, body: { bankName: "Autotest Bank", ifsc: "hdfc0001234", accountNumber: "123456789012", userId: "hacked", status: "VERIFIED" } });
  const acc = (c.json && c.json.account) || {};
  check("bank", "a valid bank account is saved with the IFSC upper-cased", c.status === 201 && acc.ifsc === "HDFC0001234", `${c.status} ${c.text.slice(0, 140)}`);
  check("bank", "the account number is returned only masked (XXXXXX9012)", acc.accountNumberMasked === "XXXXXX9012" && !c.text.includes("123456789012"), c.text.slice(0, 160));
  check("bank", "the customer cannot set the account status or owner", acc.status !== "VERIFIED", `status=${acc.status}`);
  if (acc.id) logCreated("BankAccount", acc.id, "customer suite bank account");
  const list = await http("GET", "/api/users/me/bank-accounts", { token: T });
  check("bank", "the list never contains the full account number", list.status === 200 && !list.text.includes("123456789012"), list.text.slice(0, 160));
  const stored = mongo(`const b=db.BankAccount.findOne({_id:"${acc.id}"}); print(b?String(b.accountNumberEncrypted).slice(0,12):"none")`);
  check("bank", "the account number is stored encrypted in the database", stored !== "none" && !/^123456789012/.test(stored), `stored starts with ${stored}`);
}

// ---------------------------------------------------------------- documents
let docId = null;
{
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
  const up = async (name, bytes, type, fname) => { const fd = new FormData(); fd.append("file", new Blob([bytes], { type }), fname); return http("POST", "/api/documents/upload", { token: T, form: fd }); };
  const ok = await up("png", png, "image/png", "../../autotest-photo.png");
  docId = ok.json && ok.json.document && ok.json.document.id;
  check("documents", "a small PNG can be uploaded", ok.status === 201 && !!docId, `${ok.status} ${ok.text.slice(0, 120)}`);
  if (docId) logCreated("Document", docId, "customer suite document");
  check("documents", "a filename with ../ is reduced to its base name and the response hides the server path", ok.json && ok.json.document && !/\.\./.test(ok.json.document.filename) && !("path" in ok.json.document), ok.text.slice(0, 160));
  const exe = await up("exe", Buffer.from("MZ fake exe"), "application/x-msdownload", "virus.exe");
  check("documents", "an .exe upload is rejected", exe.status === 400, `${exe.status} ${exe.text.slice(0, 80)}`);
  const html = await up("html", Buffer.from("<script>alert(1)</script>"), "text/html", "page.html");
  check("documents", "an HTML upload is rejected", html.status === 400, `${html.status}`);
  const svg = await up("svg", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'), "image/svg+xml", "x.svg");
  check("documents", "an SVG upload (can carry scripts) is rejected", svg.status === 400, `${svg.status}`);
  const fake = await up("fake", Buffer.from("<html><script>alert(1)</script></html>"), "image/png", "innocent.png");
  note("documents", "an HTML file that CLAIMS to be image/png", `${fake.status} ${fake.status === 201 ? "ACCEPTED: only the declared type is checked, not the file's real content" : fake.text.slice(0, 80)}`);
  if (fake.json && fake.json.document) logCreated("Document", fake.json.document.id, "customer suite: html disguised as png");
  const big = await up("big", Buffer.alloc(6 * 1024 * 1024, 1), "image/png", "big.png");
  check("documents", "a 6 MB file is refused (limit 5 MB)", big.status === 400 || big.status === 413, `${big.status} ${big.text.slice(0, 80)}`);
  const none = await http("POST", "/api/documents/upload", { token: T, form: new FormData() });
  check("documents", "an upload with no file is rejected", none.status === 400, `${none.status}`);
  const list = await http("GET", "/api/documents/", { token: T });
  check("documents", "the document list shows own files without server paths", list.status === 200 && !/"path"/.test(list.text), list.text.slice(0, 140));
  const mine = await http("GET", `/api/documents/${docId}/download`, { token: T });
  check("documents", "the owner can download their own file", mine.status === 200 && mine.buf.length === png.length, `${mine.status} ${mine.buf.length} bytes`);
  const anon = await http("GET", `/api/documents/${docId}/download`);
  check("documents", "no download without a login", anon.status === 401, `${anon.status}`);
  const stored = mongo(`const d=db.Document.findOne({_id:"${docId}"}); print(d?d.path:"")`);
  const stat = await http("GET", `/uploads/${stored}`);
  const stat2 = await http("GET", `/api/uploads/${stored}`);
  check("documents", "uploaded files are not served statically (/uploads/<name>)", stat.status === 404 && stat2.status === 404, `${stat.status} / ${stat2.status}`);
  const trav = await http("GET", "/api/documents/..%2F..%2Fetc%2Fpasswd/download", { token: T });
  check("documents", "a path-traversal id is a clean 404", trav.status === 404, `${trav.status}`);
  const sa = await http("GET", `/api/documents/${docId}/download`, { token: SA });
  check("documents", "staff with leads.read can download (support use)", sa.status === 200, `${sa.status}`);
  const partner = await http("GET", `/api/documents/${docId}/download`, { token: PT });
  check("documents", "[finding F-28] a PARTNER user cannot download a customer's uploaded document that is not their lead", partner.status === 404 || partner.status === 403, `partner got ${partner.status} (${partner.buf.length} bytes): the document route lets any staff user with leads.read, which includes partners, download any customer's file`);
}

// ---------------------------------------------------------------- KYC (mock provider)
{
  const calls = [["POST", "/api/kyc/session", {}], ["POST", "/api/kyc/aadhaar/start", { aadhaar: "123456789012" }], ["POST", "/api/kyc/liveness/start", {}], ["POST", "/api/kyc/pan/verify", { pan: "ABCDE1234F" }], ["GET", "/api/kyc/NOPE-TEST-ID/status", undefined]];
  for (const [m, u, b] of calls) {
    const r = await http(m, u, { token: T, body: b });
    check("kyc", `${m} ${u} answers cleanly (no crash) and does not pretend to verify`, r.status < 500 || r.status === 501, `${r.status} ${r.text.slice(0, 100)}`);
    if (r.status === 200 && /verified|success/i.test(r.text)) check("kyc", `${u} must not report a real verification from a mock`, false, r.text.slice(0, 120));
  }
  note("kyc", "KYC provider in production", "answers are mock/not implemented unless ENABLE_MOCK_KYC=true");
}

// ---------------------------------------------------------------- credit score (2 paid bureau calls)
{
  const lat = await http("GET", "/api/credit-score/latest", { token: T });
  const his = await http("GET", "/api/credit-score/history", { token: T });
  const lst = await http("GET", "/api/credit-score/", { token: T });
  check("credit", "latest, history and list answer without a server error", [lat, his, lst].every((r) => r.status < 500), `${lat.status}/${his.status}/${lst.status}`);
  const con = await http("POST", "/api/credit-score/consent", { token: T, body: {} });
  check("credit", "the consent step answers", con.status === 200, `${con.status}`);
  const noConsent = await http("POST", "/api/credit-score/check", { token: T, body: { name: "Autotest Customer", mobile: MY } });
  check("credit", "a check without consent is refused before the bureau (400)", noConsent.status === 400, `${noConsent.status} ${noConsent.text.slice(0, 80)}`);
  const noName = await http("POST", "/api/credit-score/check", { token: T, body: { mobile: MY, consent: true } });
  check("credit", "a check without a name is refused (400)", noName.status === 400, `${noName.status}`);
  const t0 = Date.now();
  const own = await http("POST", "/api/credit-score/check", { token: T, body: { name: "Autotest Customer", mobile: MY, consent: true } });
  bureauCalls++;
  note("credit", "own number check (logged-in route, no cache)", `${own.status} in ${Date.now() - t0} ms: ${own.text.slice(0, 100)}`);
  const other = await http("POST", "/api/credit-score/check", { token: T, body: { name: "Someone Else", mobile: "9811900001", consent: true } });
  bureauCalls++;
  check("credit", "[finding F-29] a logged-in customer cannot run a paid credit check on ANOTHER person's mobile number", other.status === 400 || other.status === 403, `got ${other.status} ${other.text.slice(0, 120)}: the route takes any mobile from the request body, not the logged-in number`);
}

// ---------------------------------------------------------------- partner postback (dummy partner, own secret)
{
  const slug = "autotest-partner";
  const secret = "autotest-" + crypto.randomBytes(9).toString("hex");
  const set = await http("PATCH", `/api/crm/settings/integrations/${creds.partnerId}`, { token: SA, body: { secretKey: secret } });
  check("postback", "a postback secret can be set on the dummy partner", set.status === 200, `${set.status}`);
  const mk = async (label, extra = {}) => { const phone = String(9811600000 + (Math.floor(Date.now() / 1000) % 90000) + Math.floor(Math.random() * 9)); const r = await http("POST", "/api/loan-applications/", { body: { phone, name: `Autotest Postback ${label}`, loanAmount: 100000, monthlySalary: "50000", cibilScore: "700", utm_source: "sms", utm_campaign: "autotest_postback", ...extra } }); logCreated("LoanApplication", r.json.application.leadCode, "postback " + label); return r.json.application; };
  const mine = await mk("assigned");
  await http("POST", "/api/crm/partner-assignments", { token: SA, body: { applicationId: mine.id, partnerId: creds.partnerId } });
  const foreign = await mk("not assigned");
  const call = (qs, m = "GET", body) => http(m, `/api/public/postback/${slug}${m === "GET" ? "?" + qs : ""}`, { body: m === "POST" ? body : undefined });
  const noSecret = await call(`sub_id=${mine.leadCode}&status=contacted`);
  check("postback", "a postback with no secret is refused", [401, 403].includes(noSecret.status), `${noSecret.status} ${noSecret.text.slice(0, 80)}`);
  const wrong = await call(`sub_id=${mine.leadCode}&status=contacted&secret=wrong`);
  check("postback", "a postback with the wrong secret is refused", [401, 403].includes(wrong.status), `${wrong.status}`);
  const other = await http("GET", `/api/public/postback/rupay91?sub_id=${mine.leadCode}&status=contacted&secret=${secret}`);
  check("postback", "this partner's secret does not work on another partner's endpoint", [401, 403, 404].includes(other.status), `${other.status}`);
  const badStatus = await call(`sub_id=${mine.leadCode}&status=banana&secret=${secret}`);
  check("postback", "an unknown status word is rejected (400)", badStatus.status === 400, `${badStatus.status} ${badStatus.text.slice(0, 80)}`);
  const unknown = await call(`sub_id=PIM-00000000-0000&status=contacted&secret=${secret}`);
  check("postback", "an unknown lead is a clean 404", unknown.status === 404, `${unknown.status}`);
  const notMine = await call(`sub_id=${foreign.leadCode}&status=disbursed&amount=100000&secret=${secret}`);
  const fAfter = (await http("GET", `/api/loan-applications/${foreign.id}`, { token: SA })).json.application;
  check("postback", "[security] a partner's postback cannot change a lead that is NOT assigned to that partner", [403, 404].includes(notMine.status) && fAfter.partnerStatus !== "DISBURSED", `${notMine.status}; lead partnerStatus now ${fAfter.partnerStatus}`);
  const ok = await call(`sub_id=${mine.leadCode}&status=contacted&secret=${secret}`);
  const mAfter = (await http("GET", `/api/loan-applications/${mine.id}`, { token: SA })).json.application;
  check("postback", "a correct postback moves the assigned lead to CONTACTED", ok.status === 200 && mAfter.partnerStatus === "CONTACTED", `${ok.status} ${ok.text.slice(0, 80)} partnerStatus=${mAfter.partnerStatus}`);
  const neg = await call(`sub_id=${mine.leadCode}&status=disbursed&amount=-500&secret=${secret}`);
  check("postback", "a negative amount in a postback is rejected", neg.status === 400, `${neg.status} ${neg.text.slice(0, 80)}`);
  const post = await call("", "POST", { sub_id: mine.leadCode, status: "approved", secret });
  check("postback", "the POST form works with a JSON body", post.status === 200, `${post.status} ${post.text.slice(0, 80)}`);
  const back = await call(`sub_id=${mine.leadCode}&status=contacted&secret=${secret}`);
  const afterBack = (await http("GET", `/api/loan-applications/${mine.id}`, { token: SA })).json.application;
  note("postback", "a late 'contacted' after 'approved'", `${back.status} partnerStatus now ${afterBack.partnerStatus} (${afterBack.partnerStatus === "APPROVED" ? "not downgraded" : "moved backwards"})`);
  note("postback", "the secret travels in the URL query for GET postbacks", "it will appear in the partner's and our access logs; a header or POST body is safer");
  await http("PATCH", `/api/crm/settings/integrations/${creds.partnerId}`, { token: SA, body: { secretKey: null } });
  const gone = await call(`sub_id=${mine.leadCode}&status=contacted&secret=${secret}`);
  check("postback", "after the secret is cleared, nothing is accepted (a partner without a secret accepts nothing)", [401, 403].includes(gone.status), `${gone.status}`);
}

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary), { bureauCalls, sms });
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: customer routes and partner postback (phase 12, writes test data)\n\n**${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. **OTP SMS: ${sms}. Bureau calls: ${bureauCalls}** (the logged-in credit-score route has no cache).\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
