// Creates the test staff users and one dummy partner in PRODUCTION through the official, audited API, as the super admin.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/setup-via-api.mjs
// The super admin password is only read from the environment and never written anywhere. The new users' passwords are
// saved OUTSIDE the repo (mode 600) in ~/.paisa-autotest-credentials.json. Safe to re-run: skips what already exists.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const CREDS = process.env.CREDS_FILE || "/home/primordic/.paisa-autotest-credentials.json";
const creds = fs.existsSync(CREDS) ? JSON.parse(fs.readFileSync(CREDS, "utf8")) : {};
const logCreated = (kind, id, note) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: "setup-api", kind, id, test: note }) + "\n");
const call = async (method, url, { body, token } = {}) => {
  const r = await fetch(API + url, { method, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch { /* */ }
  return { status: r.status, json: j, text: t };
};
const sa = await call("POST", "/api/auth/staff/login", { body: { email: process.env.SA_EMAIL, password: process.env.SA_PASSWORD } });
if (sa.status !== 200) { console.log("super admin login failed", sa.status); process.exit(1); }
const token = sa.json.token;
const strong = () => crypto.randomBytes(15).toString("base64url") + "!9";

// dummy partner
let partner = ((await call("GET", "/api/crm/partners", { token })).json.partners || []).find((p) => p.slug === "autotest-partner");
if (!partner) {
  const r = await call("POST", "/api/crm/partners", { token, body: { slug: "autotest-partner", name: "AUTOTEST Dummy Partner", status: "ACTIVE", website: "https://example.com", applyUrl: "https://example.com/apply", redirectUrl: "https://example.com/apply?lead={lead_id}&aff={aff_id}", commissionRate: 0, apiEnabled: false } });
  console.log("create partner:", r.status, r.text.slice(0, 120));
  partner = r.json && (r.json.partner || r.json);
  if (partner && partner.id) logCreated("AffiliatePartner", partner.id, "dummy partner for all test assignments");
}
creds.partnerId = partner && partner.id;
console.log("dummy partner id:", creds.partnerId);

async function finish(key, email, temp) {
  // log in with the temporary password and replace it, so the saved password is one only this machine knows
  const lg = await call("POST", "/api/auth/staff/login", { body: { email, password: temp } });
  if (lg.status !== 200) { console.log(key, "temp login failed", lg.status, lg.text.slice(0, 100)); return; }
  const next = strong();
  const ch = await call("POST", "/api/auth/staff/change-password", { token: lg.json.token, body: { currentPassword: temp, newPassword: next } });
  console.log(key, "change password:", ch.status);
  creds[key] = { email, password: ch.status === 200 ? next : temp, id: lg.json.user && lg.json.user.id, role: lg.json.user && lg.json.user.role };
}
for (const [key, roleKey, label] of [["admin", "admin", "ADMIN"], ["creditmanager", "credit-manager", "CREDIT MANAGER"], ["telecaller", "telecaller", "TELECALLER"]]) {
  if (creds[key] && creds[key].password) { console.log("exists", key); continue; }
  const email = `autotest.${key}@paisainminutes-test.invalid`;
  const r = await call("POST", "/api/crm/staff", { token, body: { name: `AUTOTEST ${label}`, email, roleKey } });
  console.log("create", key, r.status, r.status === 201 ? "" : r.text.slice(0, 140));
  if (r.status === 201) { logCreated("StaffUser", r.json.user.id, `test ${label} user ${email}`); await finish(key, email, r.json.temporaryPassword); }
}
if (!(creds.partner && creds.partner.password) && creds.partnerId) {
  const email = "autotest.partner@paisainminutes-test.invalid";
  const r = await call("POST", "/api/crm/partners/users", { token, body: { name: "AUTOTEST PARTNER USER", email, partnerIds: [creds.partnerId] } });
  console.log("create partner user", r.status, r.status === 201 ? "" : r.text.slice(0, 140));
  if (r.status === 201) { logCreated("StaffUser", r.json.user.id, `test partner user ${email}`); await finish("partner", email, r.json.temporaryPassword); }
}
fs.writeFileSync(CREDS, JSON.stringify(creds, null, 2), { mode: 0o600 });
fs.chmodSync(CREDS, 0o600);
console.log("saved:", Object.keys(creds).join(", "), "->", CREDS, "(outside the repo, mode 600)");
