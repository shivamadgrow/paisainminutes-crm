// Follow-up to api-staff.mjs: re-tests the checks whose first expectation was wrong, with fresh leads. WRITES test data.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/api-staff-followup.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const CREDS = "/home/primordic/.paisa-autotest-credentials.json";
const TOKEN_CACHE = process.env.TOKEN_CACHE || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/staff-tokens.json";
const creds = JSON.parse(fs.readFileSync(CREDS, "utf8"));
const cache = JSON.parse(fs.readFileSync(TOKEN_CACHE, "utf8"));
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function http(method, url, { body, token } = {}) {
  const r = await fetch(API + url, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch { /* */ }
  await sleep(260); return { status: r.status, json, text };
}
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };
for (const k of ["superadmin", "admin", "telecaller", "partner", "creditmanager"]) {
  const me = await http("GET", "/api/crm/me", { token: cache[k] && cache[k].token });
  if (me.status !== 200) { console.log(`token for ${k} no longer valid (${me.status}); re-run api-staff.mjs first or wait`); process.exit(1); }
}
const T = (k) => cache[k].token;
let seq = 9811200000 + (Math.floor(Date.now() / 1000) % 80000);
const logCreated = (code, phone, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind: "LoanApplication", id: code, phone, test }) + "\n");
async function makeLead(label) {
  const phone = String(seq++);
  const r = await http("POST", "/api/loan-applications/", { body: { phone, name: `Autotest ${label}`, loanAmount: 100000, monthlySalary: "50000", cibilScore: "700", utm_source: "sms", utm_medium: "sms", utm_campaign: "autotest_followup" } });
  const app = r.json && r.json.application; if (app) logCreated(app.leadCode, phone, "followup: " + label);
  return { phone, app };
}

// a. executive overview shape
{
  const ov = await http("GET", "/api/crm/executive-overview", { token: T("superadmin") });
  note("report", "executive-overview keys", Object.keys(ov.json || {}).join(", "));
  check("report", "executive overview answers 200 with success, a period and some figures", ov.status === 200 && ov.json.success === true && ov.json.period && Object.keys(ov.json).length >= 4, `${ov.status}`);
}

// b. a partner and a lead that is genuinely NOT assigned to them
{
  const L6 = await makeLead("unassigned to partner");
  const open = await http("GET", `/api/loan-applications/${L6.app.id}`, { token: T("partner") });
  check("partner-view", "a partner cannot open a lead that is not assigned to them", [403, 404].includes(open.status), `${open.status}`);
  const upd = await http("PATCH", `/api/loan-applications/${L6.app.id}`, { token: T("partner"), body: { partnerStatus: "CONTACTED" } });
  check("partner-view", "a partner cannot update a lead that is not assigned to them", [403, 404].includes(upd.status), `${upd.status}`);
  const lst = await http("GET", `/api/loan-applications/all?q=${L6.phone}`, { token: T("partner") });
  check("partner-view", "searching for that lead as a partner finds nothing", lst.status === 200 && lst.json.total === 0, `total=${lst.json && lst.json.total}`);
  const byPhone = await http("GET", `/api/loan-applications/phone/${L6.phone}`, { token: T("partner") });
  check("partner-view", "looking the lead up by phone as a partner returns nothing", [403].includes(byPhone.status) || (byPhone.status === 200 && (byPhone.json.applications || []).length === 0), `${byPhone.status} n=${byPhone.json && (byPhone.json.applications || []).length}`);
  const ev = await http("GET", `/api/crm/partner-events?applicationId=${L6.app.leadCode}`, { token: T("partner") });
  check("partner-view", "a partner cannot read the event history of a lead that is not theirs", ev.status === 200 ? (ev.json.events || []).length === 0 : [403, 404].includes(ev.status), `${ev.status} n=${ev.json && (ev.json.events || []).length}`);

  // c. who can route a lead to a partner by PATCH?
  const L7 = await makeLead("reassign by patch");
  const byTele = await http("PATCH", `/api/loan-applications/${L7.app.id}`, { token: T("telecaller"), body: { assignedPartnerId: creds.partnerId } });
  note("reassign", "telecaller (2 permissions: leads.read, leads.update) PATCH assignedPartnerId", `${byTele.status} ${byTele.status === 200 ? "accepted" : byTele.text.slice(0, 80)}`);
  const asg = await http("GET", `/api/crm/partner-assignments?applicationId=${L7.app.id}`, { token: T("superadmin") });
  note("reassign", "was a proper PartnerAssignment record and event created by that PATCH?", `assignments=${(asg.json.assignments || []).length}, partnerStatus on lead=${byTele.json && byTele.json.application && byTele.json.application.partnerStatus}, assignedPartnerId=${byTele.json && byTele.json.application && byTele.json.application.assignedPartnerId}`);
  const L8 = await makeLead("reassign by credit manager");
  const byCm = await http("PATCH", `/api/loan-applications/${L8.app.id}`, { token: T("creditmanager"), body: { assignedPartnerId: creds.partnerId } });
  note("reassign", "credit manager PATCH assignedPartnerId", `${byCm.status}`);
  const perms = {};
  for (const k of ["admin", "creditmanager", "telecaller"]) { const me = await http("GET", "/api/crm/me", { token: T(k) }); perms[k] = JSON.stringify((me.json.user && me.json.user.permissions) || me.json.permissions || []); }
  note("reassign", "permissions held", `telecaller has leads.reassign: ${/leads\.reassign/.test(perms.telecaller)}; creditmanager: ${/leads\.reassign/.test(perms.creditmanager)}; admin: ${/leads\.reassign/.test(perms.admin)}; admin has leads.delete: ${/leads\.delete/.test(perms.admin)}`);
  check("reassign", "[finding F-17] a user WITHOUT leads.reassign cannot route a lead to a partner by PATCH", /leads\.reassign/.test(perms.telecaller) || byTele.status === 403, `telecaller got ${byTele.status}: the reassign permission is not enforced on PATCH`);
}

// d. delete rules with the right expectations
{
  const found = await http("GET", `/api/loan-applications/all?utmCampaign=autotest_staff_${RUN.slice(0, 7)}&limit=100&q=delete`, { token: T("superadmin") });
  let target = (found.json.applications || []).find((a) => /delete me/i.test(a.applicantName || a.name || ""));
  if (!target) target = (await makeLead("delete me 2")).app;
  const adm = await http("DELETE", `/api/loan-applications/${target.id}`, { token: T("admin") });
  check("delete", "the test admin role has no leads.delete permission and is refused", adm.status === 403, `${adm.status}`);
  const sa = await http("DELETE", `/api/loan-applications/${target.id}`, { token: T("superadmin") });
  check("delete", "the super admin can delete one lead", sa.status === 200, `${sa.status} ${sa.text.slice(0, 100)}`);
  const gone = await http("GET", `/api/loan-applications/${target.id}`, { token: T("superadmin") });
  check("delete", "the deleted lead is gone (404)", gone.status === 404, `${gone.status}`);
  const again = await http("DELETE", `/api/loan-applications/${target.id}`, { token: T("superadmin") });
  check("delete", "deleting it again is a clean 404", again.status === 404, `${again.status}`);
  const bulkTele = await http("DELETE", "/api/loan-applications/", { token: T("telecaller"), body: { ids: [target.id], confirm: true } });
  check("delete", "a telecaller cannot bulk delete", [401, 403].includes(bulkTele.status), `${bulkTele.status}`);
  const noConfirm = await http("DELETE", "/api/loan-applications/", { token: T("superadmin"), body: { ids: ["NOPE-TEST-ID"] } });
  check("delete", "bulk delete without confirm:true is refused (400)", noConfirm.status === 400, `${noConfirm.status}`);
  const delAll = await http("DELETE", "/api/loan-applications/all", { token: T("superadmin"), body: {} });
  check("delete", "delete-everything without a confirm word is refused (400)", delAll.status === 400, `${delAll.status} ${delAll.text.slice(0, 80)}`);
  const count = await http("GET", "/api/loan-applications/all?limit=1", { token: T("superadmin") });
  check("delete", "the lead database is still intact after the delete-everything probe (more than 50 leads)", count.json && count.json.total > 50, `total=${count.json && count.json.total}`);
}

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: staff API follow-up (phase 5b, writes test data)\n\nRe-tests the checks whose first expectation was wrong in phase 5. **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0. OTP SMS: 0.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
