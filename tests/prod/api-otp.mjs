// Production API tests, phase 3: OTP login and customer session security. SENDS REAL SMS to the test number.
//   node tests/prod/api-otp.mjs [--log]
//
// Budget: exactly 3 OTP SMS (send, send again after the lockout, send for the expiry test), all to MY_PHONE.
// The OTP code is read back from the database (read-only query) because it is only delivered by SMS.
// No bureau calls: the only lead it creates goes through the bureau-free route.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const MY_PHONE = process.env.TEST_PHONE; // the registered test number that receives the OTP SMS (set TEST_PHONE)
if (!MY_PHONE) { console.log("Set TEST_PHONE to the registered test number."); process.exit(1); }
const SERVER_ENV = process.env.SERVER_ENV || "/home/primordic/projects/adgrow/paisa/server/.env";
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const results = [];
let smsSent = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dbUrl = fs.readFileSync(SERVER_ENV, "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL")).replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "");
function mongo(js) {
  return execFileSync("mongosh", [dbUrl, "--quiet", "--eval", js], { encoding: "utf8", timeout: 60000 }).trim();
}
function latestOtp(since) {
  const out = mongo(`const d=db.OTPCode.find({phone:"${MY_PHONE}",createdAt:{$gte:new Date("${since.toISOString()}")}}).sort({createdAt:-1}).limit(1).toArray()[0]; print(d?JSON.stringify({code:d.code,used:d.used,attempts:d.attempts,expiresAt:d.expiresAt}):"null")`);
  return JSON.parse(out);
}

async function http(method, url, { body, token, headers = {} } = {}) {
  const res = await fetch(API + url, {
    method,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  await sleep(500);
  return { status: res.status, json, text };
}
function check(area, name, pass, detail = "") {
  results.push({ area, name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`);
}
function logCreated(kind, id, test) {
  fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind, id, phone: MY_PHONE, test }) + "\n");
}
async function sendOtp() {
  const since = new Date(Date.now() - 1000);
  const r = await http("POST", "/api/auth/send-otp", { body: { phone: MY_PHONE } });
  if (r.status === 200) { smsSent++; await sleep(1500); }
  return { ...r, since };
}

// ------------------------------------------------------------------ 1. send, cooldown, wrong codes, lockout
const s1 = await sendOtp();
check("otp", "send-otp to the test number succeeds (1 SMS)", s1.status === 200 && s1.json && s1.json.ok === true, `${s1.status} ${s1.text.slice(0, 100)}`);
if (s1.status !== 200) { console.log("OTP send failed; stopping to avoid wasting SMS"); process.exit(1); }
check("otp", "the response never contains the code", !/"code"|"debug"/.test(s1.text), s1.text.slice(0, 120));
const rec1 = latestOtp(s1.since);
check("otp", "[finding O-1] the OTP is stored hashed, not as readable digits", rec1 && !/^\d{6}$/.test(rec1.code), `stored value looks like a plain 6-digit code (${rec1 ? rec1.code.length : "?"} chars)`);
check("otp", "OTP expires in about 5 minutes", rec1 && Math.abs(new Date(rec1.expiresAt) - (s1.since.getTime() + 300000)) < 15000, `expiresAt=${rec1 && rec1.expiresAt}`);

const resend = await http("POST", "/api/auth/send-otp", { body: { phone: MY_PHONE } });
check("otp", "a resend within 30 seconds is refused (429) and sends no SMS", resend.status === 429, `${resend.status}`);

const wrong = [];
for (let i = 0; i < 5; i++) wrong.push((await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: "000000" } })).status);
check("otp", "5 wrong codes are each rejected with 400", wrong.every((s) => s === 400), wrong.join(","));
const afterLock = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: rec1.code } });
check("otp", "after 5 wrong guesses even the CORRECT code is refused (lockout)", afterLock.status === 400 && /too many attempts/i.test(afterLock.text), `${afterLock.status} ${afterLock.text.slice(0, 80)}`);
const unknown = await http("POST", "/api/auth/verify-otp", { body: { phone: "9811002999", code: "123456" } });
const wrongMsg = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: "111111" } });
check("otp", "verifying a phone that never asked for an OTP gives the same generic error as a wrong code (no enumeration)", unknown.status === 400 && JSON.parse(unknown.text).error === "invalid" && wrongMsg.status === 400, `${unknown.text.slice(0, 60)} vs ${wrongMsg.text.slice(0, 60)}`);
const typed = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: 123456 } });
check("otp", "a numeric (not text) code is rejected by validation", typed.status === 400, `${typed.status}`);

// ------------------------------------------------------------------ 2. second OTP, successful login
console.log("waiting 32 s for the resend cooldown...");
await sleep(32000);
const s2 = await sendOtp();
check("otp", "a new OTP is sent after the cooldown (2 SMS used)", s2.status === 200, `${s2.status} ${s2.text.slice(0, 80)}`);
const rec2 = latestOtp(s2.since);
const login = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: rec2.code } });
check("session", "the correct code logs in and returns an access token and a refresh token", login.status === 200 && !!login.json.token && !!login.json.refreshToken, `${login.status} ${login.text.slice(0, 80)}`);
const token = login.json && login.json.token;
const refresh1 = login.json && login.json.refreshToken;
const reuse = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: rec2.code } });
check("otp", "the same code cannot be used twice", reuse.status === 400, `${reuse.status} ${reuse.text.slice(0, 60)}`);
if (refresh1) logCreated("RefreshToken", "customer refresh token(s) for the test number, created by api-otp", "otp login");

// ------------------------------------------------------------------ 3. what a logged-in customer can and cannot do
const testLeads = fs.readFileSync(path.join(here, "created.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((x) => x.kind === "LoanApplication" && x.phone !== MY_PHONE);
const victim = testLeads[0];
const me = await http("GET", "/api/users/me", { token });
check("session", "GET /api/users/me returns the customer's own record", me.status === 200 && JSON.stringify(me.json).includes(MY_PHONE), `${me.status} ${me.text.slice(0, 100)}`);
check("privacy", "users/me never returns a password hash or full PAN", !/passwordHash|"pan":"[A-Z]{5}\d{4}[A-Z]"/.test(me.text), me.text.slice(0, 120));
const mine = await http("GET", "/api/loan-applications/my", { token });
check("session", "GET /api/loan-applications/my works and lists only own leads", mine.status === 200 && Array.isArray(mine.json && mine.json.applications) && mine.json.applications.every((a) => a.phone === MY_PHONE), `${mine.status} ${mine.text.slice(0, 80)}`);
const idor1 = await http("GET", `/api/loan-applications/${victim.id}`, { token });
check("idor", "a customer cannot read another person's lead by lead code", [401, 403, 404].includes(idor1.status), `${idor1.status} ${idor1.text.slice(0, 80)}`);
const idor2 = await http("GET", `/api/loan-applications/phone/${victim.phone}`, { token });
check("idor", "a customer cannot list another person's leads by phone", [401, 403].includes(idor2.status), `${idor2.status} ${idor2.text.slice(0, 80)}`);
const all = await http("GET", "/api/loan-applications/all", { token });
check("roles", "a customer token cannot use the staff lead list", [401, 403].includes(all.status), `${all.status}`);
for (const [m, p] of [["GET", "/api/crm/staff"], ["GET", "/api/crm/me"], ["GET", "/api/crm/settings/general"], ["GET", "/api/crm/channel-summary"], ["GET", "/api/crm/audit-logs"]]) {
  const r = await http(m, p, { token });
  check("roles", `a customer token is refused on ${m} ${p}`, [401, 403].includes(r.status), `${r.status}`);
}
const patch = await http("PATCH", `/api/loan-applications/${victim.id}`, { token, body: { status: "DISBURSED" } });
check("idor", "a customer cannot change another lead's status", [401, 403, 404].includes(patch.status), `${patch.status} ${patch.text.slice(0, 80)}`);
const del = await http("DELETE", `/api/loan-applications/${victim.id}`, { token });
check("idor", "a customer cannot delete a lead", [401, 403, 404].includes(del.status), `${del.status} ${del.text.slice(0, 80)}`);
const refreshStaff = await http("POST", `/api/loan-applications/${victim.id}/refresh-score`, { token });
check("roles", "a customer cannot force a paid bureau refresh", [401, 403].includes(refreshStaff.status), `${refreshStaff.status}`);

// a logged-in customer posting someone else's phone must not create a lead for that phone
const spoof = await http("POST", "/api/loan-applications/", { token, body: { phone: "9811002998", name: "Spoof Attempt", loanAmount: 50000, monthlySalary: "30000" } });
const spoofApp = spoof.json && spoof.json.application;
check("idor", "a logged-in customer posting another phone number gets a lead for their OWN number, not the other one", spoofApp && spoofApp.phone === MY_PHONE, `lead phone=${spoofApp && spoofApp.phone} status=${spoof.status}`);
if (spoofApp && spoofApp.leadCode) logCreated("LoanApplication", spoofApp.leadCode, "customer-token spoof test");
check("cost", "that submission made no bureau call", spoofApp && !/^Bureau/.test(spoofApp.cibilStatus || "") && spoofApp.bureauScore == null, `cibilStatus=${spoofApp && spoofApp.cibilStatus}`);

// token tampering
const parts = (token || "").split(".");
const forgedPayload = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(parts[1], "base64url").toString()), role: "SUPER_ADMIN", kind: "staff" })).toString("base64url");
const tampered = await http("GET", "/api/crm/staff", { token: `${parts[0]}.${forgedPayload}.${parts[2]}` });
check("tokens", "a token with the payload edited to SUPER_ADMIN is refused (signature check)", [401, 403].includes(tampered.status), `${tampered.status}`);
const noSig = await http("GET", "/api/users/me", { token: `${parts[0]}.${parts[1]}.` });
check("tokens", "a token with the signature removed is refused", noSig.status === 401, `${noSig.status}`);

// refresh token rotation and theft detection
const rot = await http("POST", "/api/auth/refresh", { body: { refreshToken: refresh1 } });
check("tokens", "a refresh token returns a new access token and a new refresh token", rot.status === 200 && !!rot.json.token && !!rot.json.refreshToken, `${rot.status} ${rot.text.slice(0, 80)}`);
const replay = await http("POST", "/api/auth/refresh", { body: { refreshToken: refresh1 } });
check("tokens", "re-using the OLD refresh token is refused", replay.status === 401, `${replay.status}`);
const after = await http("POST", "/api/auth/refresh", { body: { refreshToken: rot.json && rot.json.refreshToken } });
check("tokens", "after a replay, the newer refresh token is revoked too (theft detection)", after.status === 401, `${after.status}`);

// ------------------------------------------------------------------ 4. expiry (third SMS)
console.log("waiting for the resend cooldown, then sending OTP 3 for the expiry check...");
await sleep(15000);
const s3 = await sendOtp();
check("otp", "a third OTP is sent for the expiry test (3 SMS used in total)", s3.status === 200, `${s3.status} ${s3.text.slice(0, 80)}`);
if (s3.status === 200) {
  const rec3 = latestOtp(s3.since);
  const wait = Math.max(0, 305000 - 3000);
  console.log(`waiting ${Math.round(wait / 1000)} s for the OTP to expire...`);
  await sleep(wait);
  const exp = await http("POST", "/api/auth/verify-otp", { body: { phone: MY_PHONE, code: rec3.code } });
  check("otp", "the correct code is refused after 5 minutes (expired)", exp.status === 400 && /expired/i.test(exp.text), `${exp.status} ${exp.text.slice(0, 80)}`);
}

// ------------------------------------------------------------------ summary
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), run: RUN, checks: results.length, passed: results.length - failed.length, failed: failed.length, smsSent };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-api-otp.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: OTP login and customer session security (phase 3)\n\n`;
  md += `Test number ${MY_PHONE}. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. **OTP SMS sent: ${smsSent}.** Bureau calls: 0.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
  console.log("appended to TEST_LOG.md");
}
process.exit(failed.length ? 1 : 0);
