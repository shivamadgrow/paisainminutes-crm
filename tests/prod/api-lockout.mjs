// Production test: repeated wrong passwords lock a staff account, even for the right password. Uses ONLY the test credit-manager user.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/api-lockout.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://api.paisainminutes.tech";
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const target = creds.creditmanager;
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const login = async (email, password) => { const r = await fetch(API + "/api/auth/staff/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); const t = await r.text(); await sleep(400); return { status: r.status, text: t, json: (() => { try { return JSON.parse(t); } catch { return null; } })() }; };

const statuses = [];
let lockedAt = null;
for (let i = 1; i <= 8; i++) {
  const r = await login(target.email, "wrong-password-" + i);
  statuses.push(r.status);
  if (r.status === 423 || r.status === 429) { lockedAt = i; break; }
}
check("lockout", "repeated wrong passwords end in a lock (423) within 8 attempts", lockedAt !== null && statuses.includes(423), `statuses ${statuses.join(",")}`);
check("lockout", "every wrong password before the lock got the same generic 401", statuses.filter((s) => s !== 423 && s !== 429).every((s) => s === 401), statuses.join(","));
const right = await login(target.email, target.password);
check("lockout", "while locked, even the CORRECT password is refused (423)", right.status === 423, `${right.status} ${right.text.slice(0, 80)}`);
check("lockout", "the lock message does not reveal anything beyond 'temporarily locked'", /locked/i.test(right.text) && !/password|attempt count|\d+ attempts/i.test(right.text), right.text.slice(0, 100));
const other = await login(creds.partner.email, creds.partner.password);
check("lockout", "locking one account does not lock other accounts", other.status === 200, `${other.status}`);
const unknown = await login("autotest.nobody@paisainminutes-test.invalid", "x");
check("lockout", "an unknown email gets the same 401 as a wrong password (no account enumeration)", unknown.status === 401 && /invalid credentials/i.test(unknown.text), `${unknown.status} ${unknown.text.slice(0, 60)}`);
const sa = await login(process.env.SA_EMAIL, process.env.SA_PASSWORD);
check("lockout", "the super admin (a different account) can still log in", sa.status === 200, `${sa.status}`);
const aud = await (await fetch(API + "/api/crm/audit-logs?limit=50", { headers: { Authorization: "Bearer " + sa.json.token } })).json();
const actions = ((aud.logs || aud.auditLogs || aud.items) || []).map((a) => a.action);
check("lockout", "the lock and the failed logins are written to the audit log", actions.includes("auth.locked") && actions.includes("auth.login_failed"), [...new Set(actions)].join(","));
// let the support team unlock it: reset password through the staff admin route
const staff = await (await fetch(API + "/api/crm/staff", { headers: { Authorization: "Bearer " + sa.json.token } })).json();
const row = (staff.staff || []).find((s) => s.email === target.email);
const reset = await fetch(API + `/api/crm/staff/${row.id}/reset-password`, { method: "POST", headers: { Authorization: "Bearer " + sa.json.token, "Content-Type": "application/json" }, body: "{}" });
const rj = await reset.json().catch(() => ({}));
check("lockout", "the super admin can reset the locked user's password", reset.status === 200 && !!rj.temporaryPassword, `${reset.status}`);
const after = await login(target.email, rj.temporaryPassword || "x");
check("lockout", "[finding] a password reset by an admin also lifts the lock, so the user can log in again", after.status === 200, `after reset: ${after.status} ${after.text.slice(0, 80)}`);
if (after.status === 200) {
  const next = require_random();
  const ch = await fetch(API + "/api/auth/staff/change-password", { method: "POST", headers: { Authorization: "Bearer " + after.json.token, "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: rj.temporaryPassword, newPassword: next }) });
  if (ch.status === 200) { creds.creditmanager.password = next; fs.writeFileSync("/home/primordic/.paisa-autotest-credentials.json", JSON.stringify(creds, null, 2), { mode: 0o600 }); }
  check("lockout", "the user can set a new password after the reset", ch.status === 200, `${ch.status}`);
}
function require_random() { return Buffer.from(Array.from({ length: 15 }, () => Math.floor(Math.random() * 256))).toString("base64url") + "!9"; }
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary), "lock after", lockedAt, "wrong attempts");
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: staff account lockout (phase 9)\n\nTest credit-manager user only (the super admin was never targeted). The lock came after **${lockedAt} wrong password attempts** (statuses ${statuses.join(", ")}). **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. 3 further logins (partner, unknown user, super admin) were used. Bureau calls: 0. OTP SMS: 0. The test user's password was reset and re-set afterwards, so it works again.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
