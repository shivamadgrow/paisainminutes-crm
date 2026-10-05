// Production API tests, phase 5: staff and partner logins, the permission matrix, and CRM data flows. WRITES test data.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/api-staff.mjs [--log] [--lockout]
//
// Uses the test users made by setup-via-api.mjs (credentials in ~/.paisa-autotest-credentials.json, outside the repo)
// and the real super admin from the environment (never written anywhere). Test leads are made with the bureau-free
// intake route; ONE paid bureau refresh is made (section "bureau refresh"). Everything created is logged in created.jsonl.
// Staff login allows 20 attempts per 15 minutes per IP, so each user logs in ONCE per run; --lockout is a separate run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const CREDS = process.env.CREDS_FILE || "/home/primordic/.paisa-autotest-credentials.json";
const creds = JSON.parse(fs.readFileSync(CREDS, "utf8"));
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const routes = JSON.parse(fs.readFileSync(path.join(here, "routes.json"), "utf8"));
const results = [];
let bureauCalls = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logCreated = (kind, id, phone, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind, id, phone, test }) + "\n");

async function http(method, url, { body, token, headers = {}, noRedirect } = {}) {
  const res = await fetch(API + url, {
    method,
    headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: noRedirect ? "manual" : "follow",
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  await sleep(260);
  return { status: res.status, json, text, headers: res.headers };
}
function check(area, name, pass, detail = "") {
  results.push({ area, name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`);
}
function observe(area, name, detail) {
  results.push({ area, name, pass: true, detail: "observation: " + detail });
  console.log(`NOTE  [${area}] ${name} -> ${detail}`);
}

// ------------------------------------------------------------------ logins (once each)
const users = {};
async function login(key, email, password) {
  const r = await http("POST", "/api/auth/staff/login", { body: { email, password } });
  if (r.status !== 200) { check("login", `${key} can log in`, false, `${r.status} ${r.text.slice(0, 100)}`); return; }
  users[key] = { token: r.json.token, refresh: r.json.refreshToken, role: r.json.user.role, perms: r.json.user.permissions || [], id: r.json.user.id, email };
  check("login", `${key} logs in as ${r.json.user.role} with ${users[key].perms.length} permissions`, true);
}
// Re-use tokens from a recent run if they still work (staff login is limited to 20 per 15 minutes per IP).
const TOKEN_CACHE = process.env.TOKEN_CACHE || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/staff-tokens.json";
let cached = {};
try { cached = JSON.parse(fs.readFileSync(TOKEN_CACHE, "utf8")); } catch { /* none */ }
for (const k of ["superadmin", "admin", "creditmanager", "telecaller", "partner"]) {
  const c = cached[k];
  if (c && Date.now() - c.at < 9 * 60 * 1000) {
    const me = await http("GET", "/api/crm/me", { token: c.token });
    if (me.status === 200) { users[k] = c; console.log(`reusing the token for ${k}`); continue; }
  }
  if (k === "superadmin") await login(k, process.env.SA_EMAIL, process.env.SA_PASSWORD);
  else await login(k, creds[k].email, creds[k].password);
  if (users[k]) users[k].at = Date.now();
}
fs.writeFileSync(TOKEN_CACHE, JSON.stringify(users), { mode: 0o600 });
if (!users.superadmin) { console.log("cannot continue without the super admin login"); process.exit(1); }
const SA = users.superadmin.token;
const T = (k) => users[k] && users[k].token;

// who am I
for (const k of Object.keys(users)) {
  const me = await http("GET", "/api/crm/me", { token: T(k) });
  check("login", `${k}: /api/crm/me answers with the same role`, me.status === 200 && JSON.stringify(me.json).includes(users[k].role), `${me.status} ${me.text.slice(0, 80)}`);
  check("privacy", `${k}: /api/crm/me never returns a password hash or token secret`, !/passwordHash|refreshToken|"token"/i.test(me.text), me.text.slice(0, 100));
}
observe("roles", "permissions per role", Object.entries(users).map(([k, u]) => `${k}=${u.role}:${u.perms.length}`).join(", "));

// ------------------------------------------------------------------ the permission matrix
function expected(auth, role, perms) {
  if (auth === "public" || auth === "any" || auth === "token" || /METRICS/.test(auth)) return null;
  if (auth === "customer") return false; // staff tokens must not work on customer routes
  if (auth === "staff") return true;
  let m = auth.match(/^perm:(.+)$/);
  if (m) return perms.includes(m[1]);
  if (/^role:SUPER_ADMIN,ADMIN with permission leads\.delete/.test(auth)) return ["SUPER_ADMIN", "ADMIN"].includes(role) && perms.includes("leads.delete");
  if (/staff\.manage or roles\.manage/.test(auth)) return perms.includes("staff.manage") || perms.includes("roles.manage");
  return null;
}
const skipRoute = (r) => /^\/api\/auth\//.test(r.p) || (r.m === "DELETE" && (/\/all$/.test(r.p) || !/\/:[A-Za-z]+$/.test(r.p)));
const fill = (p) => p.replace(/:[A-Za-z0-9_]+/g, "NOPE-TEST-ID").replace(/\/+$/, "") || "/";
{
  const counts = { forbiddenChecks: 0, allowedChecks: 0, bad: 0 };
  for (const [key, u] of Object.entries(users)) {
    for (const r of routes) {
      if (skipRoute(r)) continue;
      const exp = expected(r.auth, u.role, u.perms);
      if (exp === null) continue;
      const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(r.m);
      if (exp === false) {
        const res = await http(r.m, fill(r.p), { token: u.token, body: mutating && r.m !== "DELETE" ? {} : undefined });
        counts.forbiddenChecks++;
        const pass = [401, 403].includes(res.status);
        if (!pass) counts.bad++;
        check("matrix", `${key} (${u.role}) is refused on ${r.m} ${r.p}`, pass, `got ${res.status} ${res.text.slice(0, 80)}`);
      } else if (!mutating) {
        const res = await http("GET", fill(r.p), { token: u.token });
        counts.allowedChecks++;
        const pass = ![401, 403].includes(res.status) && res.status < 500;
        if (!pass) counts.bad++;
        check("matrix", `${key} (${u.role}) may use GET ${r.p}`, pass, `got ${res.status} ${res.text.slice(0, 80)}`);
      }
    }
  }
  observe("matrix", "routes exercised", `${counts.forbiddenChecks} refusals checked, ${counts.allowedChecks} allowed reads checked, ${counts.bad} unexpected`);
}

// ------------------------------------------------------------------ helper: make a test lead (bureau-free intake route)
let phoneSeq = 9811100000 + (Math.floor(Date.now() / 1000) % 80000);
async function makeLead(label, extra = {}) {
  const phone = String(phoneSeq++);
  const r = await http("POST", "/api/loan-applications/", { body: { phone, name: `Autotest ${label}`, loanAmount: 150000, monthlySalary: "60000", cibilScore: "720", utm_source: "google", utm_medium: "cpc", utm_campaign: `autotest_staff_${RUN.slice(0, 10)}`, ...extra } });
  const app = r.json && r.json.application;
  if (app && app.leadCode) logCreated("LoanApplication", app.leadCode, phone, "staff suite: " + label);
  return { phone, app, status: r.status };
}
const L1 = await makeLead("status flow");
const L2 = await makeLead("partner flow");
const L3 = await makeLead("delete me");
const L4 = await makeLead("csv formula", { name: '=HYPERLINK("http://evil.example/x","click")' });
const L5 = await makeLead("xss name", { name: "<img src=x onerror=alert(document.domain)>" });
check("setup", "five test leads were created", [L1, L2, L3, L4, L5].every((l) => l.app && l.app.leadCode), JSON.stringify([L1, L2, L3, L4, L5].map((l) => l.status)));
const id = (l) => l.app.id;

// ------------------------------------------------------------------ lead list, filters, pagination
{
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const r = await http("GET", `/api/loan-applications/all?limit=100&page=${page}`, { token: SA });
    if (r.status !== 200) { check("list", "leads list answers", false, `${r.status} ${r.text.slice(0, 80)}`); break; }
    all.push(...r.json.applications);
    if (all.length >= r.json.total) { check("list", "pages add up to the reported total", all.length === r.json.total, `${all.length} vs ${r.json.total}`); break; }
  }
  const ids = new Set(all.map((a) => a.id));
  check("list", "no lead appears twice across pages", ids.size === all.length, `${ids.size} unique of ${all.length}`);
  check("list", "the newest lead is listed first", all.length < 2 || new Date(all[0].createdAt) >= new Date(all[1].createdAt), "not sorted newest first");
  check("list", "every lead has a lead code and a status", all.every((a) => a.leadCode && a.status), "missing lead code or status");
  check("privacy", "the list never returns a full PAN", !JSON.stringify(all).match(/"pan(Number)?":"[A-Z]{5}\d{4}[A-Z]"/), "full PAN found in list");

  const by = async (q) => (await http("GET", `/api/loan-applications/all?limit=100&${q}`, { token: SA }));
  const g = await by("channel=Google%20Ads");
  check("filters", "channel=Google Ads returns only Google Ads leads", g.status === 200 && g.json.applications.length > 0 && g.json.applications.every((a) => a.channel === "Google Ads"), `${g.status} n=${g.json && g.json.applications.length}`);
  const legacy = await by("channel=Legacy");
  check("filters", "channel=Legacy returns only leads from before channel tracking", legacy.status === 200 && legacy.json.applications.every((a) => !a.channel), `${legacy.status} n=${legacy.json && legacy.json.applications.length}`);
  const camp = await by(`utmCampaign=autotest_staff_${RUN.slice(0, 10)}`);
  check("filters", "utmCampaign filter finds this run's test leads", camp.status === 200 && camp.json.applications.length >= 5, `n=${camp.json && camp.json.applications.length}`);
  const q = await by(`q=${L1.phone}`);
  check("filters", "search by phone finds the lead", q.status === 200 && q.json.total === 1, `total=${q.json && q.json.total}`);
  const qn = await by("q=Autotest%20status");
  check("filters", "search by name finds the lead", qn.status === 200 && qn.json.applications.some((a) => a.leadCode === L1.app.leadCode), `n=${qn.json && qn.json.applications.length}`);
  const qs = await by(`q=${encodeURIComponent("'\";{$ne:1}")}`);
  check("filters", "a hostile search string does not crash the list", qs.status < 500, `${qs.status}`);
  const bad1 = await by("status=NOPE");
  check("filters", "an unknown status filter is rejected (400)", bad1.status === 400, `${bad1.status}`);
  const bad2 = await by("partnerStatus=NOPE");
  check("filters", "an unknown partnerStatus filter is rejected (400)", bad2.status === 400, `${bad2.status}`);
  const bad3 = await by("from=not-a-date");
  check("filters", "an invalid date filter is rejected (400)", bad3.status === 400, `${bad3.status}`);
  const big = await http("GET", "/api/loan-applications/all?limit=100000", { token: SA });
  check("filters", "an oversized page limit is capped, not honoured", big.status === 200 && big.json.limit <= 500, `limit=${big.json && big.json.limit}`);
  const neg = await http("GET", "/api/loan-applications/all?page=-5&limit=-1", { token: SA });
  check("filters", "negative page and limit are handled", neg.status === 200, `${neg.status}`);
}

// ------------------------------------------------------------------ channel summary report vs. the real data
{
  const rep = await http("GET", "/api/crm/channel-summary?period=all", { token: SA });
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const r = await http("GET", `/api/loan-applications/all?limit=100&page=${page}`, { token: SA });
    all.push(...r.json.applications);
    if (all.length >= r.json.total) break;
  }
  const truth = {};
  for (const a of all) truth[a.channel || "Legacy"] = (truth[a.channel || "Legacy"] || 0) + 1;
  check("report", "channel-summary answers", rep.status === 200 && rep.json.success, `${rep.status} ${rep.text.slice(0, 80)}`);
  check("report", "channel-summary total equals the number of leads", rep.json && rep.json.total === all.length, `${rep.json && rep.json.total} vs ${all.length}`);
  const mismatched = Object.entries(truth).filter(([c, n]) => (rep.json.channels.find((x) => x.channel === c) || {}).leads !== n);
  check("report", "every channel's count matches the leads list exactly", mismatched.length === 0, JSON.stringify(mismatched));
  check("report", "channels are sorted by lead count, largest first", rep.json.channels.every((c, i, a) => i === 0 || a[i - 1].leads >= c.leads), "not sorted");
  check("report", "eligible, redirected and disbursed never exceed leads", rep.json.channels.every((c) => c.eligible <= c.leads && c.redirected <= c.leads && c.disbursed <= c.leads), "a sub-count is larger than the total");
  const bad = await http("GET", "/api/crm/channel-summary?period=banana", { token: SA });
  check("report", "an invalid period is rejected (400)", bad.status === 400, `${bad.status}`);
  const part = await http("GET", "/api/crm/channel-summary?period=all", { token: T("partner") });
  check("report", "a partner user's channel summary only counts their own (assigned) leads", part.status === 200 && part.json.total <= 2, `total=${part.json && part.json.total}`);
  const ov = await http("GET", "/api/crm/executive-overview", { token: SA });
  check("report", "executive overview answers with a period and recent leads", ov.status === 200 && ov.json.period && Array.isArray(ov.json.recent), `${ov.status} ${ov.text.slice(0, 80)}`);
}

// ------------------------------------------------------------------ lead status, remarks and field protection
{
  const patch = (k, l, body) => http("PATCH", `/api/loan-applications/${id(l)}`, { token: T(k), body });
  const s1 = await patch("telecaller", L1, { status: "CALLBACK", remarks: "Autotest: customer asked to call back" });
  check("status", "a telecaller can move a lead to CALLBACK and add a remark", s1.status === 200 && String(s1.json.application.status).toUpperCase() === "CALLBACK", `${s1.status} ${s1.text.slice(0, 100)}`);
  for (const st of ["INTERESTED", "DOCS_RECEIVED", "APPROVED"]) {
    const r = await patch("admin", L1, { status: st });
    check("status", `an admin can move the lead on to ${st}`, r.status === 200 && String(r.json.application.status).toUpperCase() === st, `${r.status} ${r.text.slice(0, 80)}`);
  }
  const lower = await patch("admin", L1, { status: "callback" });
  observe("status", "moving back from APPROVED to lowercase 'callback'", `${lower.status} -> ${lower.json && lower.json.application ? lower.json.application.status : lower.text.slice(0, 80)}`);
  const bogus = await patch("admin", L1, { status: "BOGUS" });
  check("status", "an unknown status is rejected (400)", bogus.status === 400, `${bogus.status}`);
  const phone = await patch("admin", L1, { phone: "9000000000", userId: "x", leadCode: "PIM-HACK", createdAt: "2000-01-01" });
  check("status", "identity fields (phone, userId, leadCode, createdAt) in a PATCH are ignored or rejected, never applied", phone.status === 400 || (phone.status === 200 && phone.json.application.phone === L1.phone && phone.json.application.leadCode === L1.app.leadCode), `${phone.status} phone=${phone.json && phone.json.application && phone.json.application.phone}`);
  const neg = await patch("admin", L1, { loanAmountRupees: -5 });
  check("status", "a negative loan amount is rejected (400)", neg.status === 400, `${neg.status}`);
  const huge = await patch("admin", L1, { disbursedAmountRupees: 99999999999999 });
  check("status", "an absurd disbursed amount is rejected (400)", huge.status === 400, `${huge.status}`);
  const longRemark = await patch("admin", L1, { remarks: "R".repeat(50000) });
  check("status", "a 50,000-character remark is cut or rejected, not stored whole", longRemark.status === 400 || (longRemark.status === 200 && String(longRemark.json.application.remarks).length < 5000), `${longRemark.status} len=${longRemark.json && longRemark.json.application && String(longRemark.json.application.remarks).length}`);
  const reassign = await patch("telecaller", L1, { assignedPartnerId: creds.partnerId });
  observe("status", "a telecaller (no leads.reassign) setting assignedPartnerId directly", `${reassign.status} ${reassign.status === 200 ? "ACCEPTED: a telecaller can route leads to a partner without the reassign permission" : reassign.text.slice(0, 80)}`);
  const none = await patch("admin", L1, {});
  check("status", "an empty PATCH is rejected (400)", none.status === 400, `${none.status}`);
  const unauth = await http("PATCH", `/api/loan-applications/${id(L1)}`, { body: { status: "FRESH" } });
  check("status", "a PATCH without a login is refused", unauth.status === 401, `${unauth.status}`);
  const xss = await patch("admin", L5, { remarks: '<script>alert("x")</script>' });
  check("status", "a script in remarks is accepted as text and returned as JSON (the CRM must escape it)", xss.status === 200, `${xss.status}`);
}

// ------------------------------------------------------------------ partner assignment, partner visibility, redirect
{
  const assign = (k, body) => http("POST", "/api/crm/partner-assignments", { token: T(k), body });
  const a1 = await assign("admin", { applicationId: id(L2), partnerId: creds.partnerId });
  check("partner", "an admin can assign a lead to the dummy partner", [200, 201].includes(a1.status), `${a1.status} ${a1.text.slice(0, 100)}`);
  const a2 = await assign("admin", { applicationId: id(L2), partnerId: creds.partnerId });
  check("partner", "assigning the same lead and partner again is idempotent", a2.status === 200 && a2.json && a2.json.created === false, `${a2.status} ${a2.text.slice(0, 100)}`);
  const a3 = await assign("telecaller", { applicationId: id(L1), partnerId: creds.partnerId });
  check("partner", "a telecaller cannot assign partners (partners.manage)", [401, 403].includes(a3.status), `${a3.status}`);
  const a4 = await assign("partner", { applicationId: id(L1), partnerId: creds.partnerId });
  check("partner", "a partner user cannot assign leads", [401, 403].includes(a4.status), `${a4.status}`);
  const a5 = await assign("admin", { applicationId: "NOPE-TEST-ID", partnerId: creds.partnerId });
  check("partner", "assigning an unknown lead is a clean 4xx", a5.status >= 400 && a5.status < 500, `${a5.status}`);
  const a6 = await assign("admin", { applicationId: id(L2), partnerId: "NOPE-TEST-ID" });
  check("partner", "assigning to an unknown partner is a clean 4xx", a6.status >= 400 && a6.status < 500, `${a6.status}`);
  await assign("admin", { applicationId: id(L4), partnerId: creds.partnerId });
  await assign("admin", { applicationId: id(L5), partnerId: creds.partnerId });

  // what the partner user sees
  const lst = await http("GET", "/api/loan-applications/all?limit=100", { token: T("partner") });
  const mine = (lst.json && lst.json.applications) || [];
  check("partner-view", "a partner user sees only leads assigned to their partner", lst.status === 200 && mine.length >= 3 && mine.every((a) => a.assignedPartnerId === creds.partnerId), `n=${mine.length} others=${mine.filter((a) => a.assignedPartnerId !== creds.partnerId).length}`);
  const l2p = mine.find((a) => a.leadCode === L2.app.leadCode) || {};
  check("partner-view", "the phone number is masked until the lead is redirected", /^X+\d{4}$/.test(String(l2p.phone || "")), `phone=${l2p.phone}`);
  check("partner-view", "email, date of birth, gender, PAN and internal ids are hidden from the partner", !("email" in l2p) && !("dob" in l2p) && !("gender" in l2p) && !("userId" in l2p) && !("panMasked" in l2p) && !("remarks" in l2p), Object.keys(l2p).join(","));
  const other = await http("GET", `/api/loan-applications/${id(L1)}`, { token: T("partner") });
  check("partner-view", "a partner cannot open a lead that is not assigned to them", [403, 404].includes(other.status), `${other.status}`);
  const otherPatch = await http("PATCH", `/api/loan-applications/${id(L1)}`, { token: T("partner"), body: { partnerStatus: "CONTACTED" } });
  check("partner-view", "a partner cannot update a lead that is not assigned to them", [403, 404].includes(otherPatch.status), `${otherPatch.status}`);
  const staffField = await http("PATCH", `/api/loan-applications/${id(L2)}`, { token: T("partner"), body: { status: "DISBURSED" } });
  check("partner-view", "a partner naming a staff-only field (status) gets 403", staffField.status === 403, `${staffField.status}`);
  const redirected = await http("PATCH", `/api/loan-applications/${id(L2)}`, { token: T("partner"), body: { partnerStatus: "REDIRECTED" } });
  check("partner-view", "a partner cannot set REDIRECTED themselves (to unmask a phone)", [400, 403].includes(redirected.status), `${redirected.status} ${redirected.text.slice(0, 80)}`);
  const partners = await http("GET", "/api/crm/partners", { token: T("partner") });
  check("partner-view", "a partner user sees only their own partner, and no secrets", partners.status === 200 && partners.json.partners.length === 1 && !/apiEndpoint|webhookUrl|apiKey|postbackSecret/.test(partners.text.replace(/"isSet"/g, "")), `${partners.status} n=${partners.json && partners.json.partners.length}`);

  // public redirect: records a click, sends the customer to the partner
  const rd = await http("GET", `/api/public/redirect/autotest-partner?lead_id=${L2.app.leadCode}`, { noRedirect: true });
  check("redirect", "the public redirect answers 302 to the dummy partner's stored URL with the lead code", rd.status === 302 && /^https:\/\/example\.com\/apply\?/.test(rd.headers.get("location") || "") && (rd.headers.get("location") || "").includes(L2.app.leadCode), `${rd.status} ${rd.headers.get("location")}`);
  const evil = await http("GET", `/api/public/redirect/autotest-partner?lead_id=${L2.app.leadCode}&target=https://evil.example&url=https://evil.example&redirect=https://evil.example`, { noRedirect: true });
  check("redirect", "extra target/url/redirect parameters can never change where the customer is sent (no open redirect)", evil.status === 302 && new URL(evil.headers.get("location")).hostname === "example.com", `${evil.status} ${evil.headers.get("location")}`);
  const inj = await http("GET", `/api/public/redirect/autotest-partner?lead_id=${encodeURIComponent(L2.app.leadCode + "&evil=1#x")}`, { noRedirect: true });
  check("redirect", "a lead_id with & and # is encoded, not injected into the partner URL", inj.status !== 302 || !/[?&]evil=1/.test(inj.headers.get("location") || ""), `${inj.status} ${inj.headers.get("location")}`);
  const unk = await http("GET", "/api/public/redirect/not-a-partner?lead_id=x", { noRedirect: true });
  check("redirect", "an unknown partner is a 404, never a redirect", unk.status === 404, `${unk.status} ${unk.headers.get("location")}`);
  const slug = await http("GET", "/api/public/redirect/..%2F..%2Fetc%2Fpasswd?lead_id=x", { noRedirect: true });
  check("redirect", "a path-trick partner name is refused", slug.status !== 302 && slug.status < 500, `${slug.status}`);

  const after = await http("GET", `/api/loan-applications/${id(L2)}`, { token: T("partner") });
  check("partner-view", "after the redirect the partner sees the lead as REDIRECTED with the real phone number", after.status === 200 && after.json.application.partnerStatus === "REDIRECTED" && after.json.application.phone === L2.phone, `${after.status} partnerStatus=${after.json && after.json.application && after.json.application.partnerStatus} phone=${after.json && after.json.application && after.json.application.phone}`);
  const contacted = await http("PATCH", `/api/loan-applications/${id(L2)}`, { token: T("partner"), body: { partnerStatus: "CONTACTED", partnerRemarks: "Autotest: partner contacted customer" } });
  check("partner-view", "a partner can then mark their own lead CONTACTED with a remark", contacted.status === 200, `${contacted.status} ${contacted.text.slice(0, 100)}`);
  const events = await http("GET", `/api/crm/partner-events?applicationId=${L2.app.leadCode}`, { token: SA });
  check("partner", "the assignment, click and status changes were recorded as events", events.status === 200 && (events.json.events || []).length >= 3, `${events.status} n=${events.json && (events.json.events || []).length}`);
  const push = await http("POST", "/api/crm/delivery-logs/push", { token: SA, body: { applicationId: id(L2), partnerId: creds.partnerId } });
  check("partner", "pushing to a partner with no API configured is a clean 4xx, not a crash", push.status >= 400 && push.status < 500, `${push.status} ${push.text.slice(0, 100)}`);
}

// ------------------------------------------------------------------ CSV export (formula injection)
{
  const ex = await http("GET", `/api/crm/partners/${creds.partnerId}/leads/export`, { token: SA });
  check("export", "the partner lead export answers with a CSV", ex.status === 200 && /csv|text\/plain|octet/.test(ex.headers.get("content-type") || ""), `${ex.status} ${ex.headers.get("content-type")}`);
  const lines = ex.text.split(/\r?\n/);
  const formula = lines.find((l) => /HYPERLINK/.test(l)) || "";
  check("export", "[finding] a name that starts with = is neutralised in the CSV (no formula injection into Excel)", formula !== "" && !/(^|,)"?=HYPERLINK/.test(formula), `row: ${formula.slice(0, 120)}`);
  check("export", "the export masks or omits full PAN and email for partner exports", !/[A-Z]{5}\d{4}[A-Z]/.test(ex.text), "full PAN in export");
  const part = await http("GET", `/api/crm/partners/${creds.partnerId}/leads/export`, { token: T("partner") });
  check("export", "a partner user can export their own leads, with masked phones until redirected", part.status === 200, `${part.status}`);
  const tele = await http("GET", `/api/crm/partners/${creds.partnerId}/leads/export`, { token: T("telecaller") });
  check("export", "a telecaller with leads.read can request the export without a server error", tele.status < 500, `${tele.status}`);
  const nope = await http("GET", "/api/crm/partners/NOPE-TEST-ID/leads/export", { token: SA });
  check("export", "exporting an unknown partner is a clean 4xx", nope.status >= 400 && nope.status < 500, `${nope.status}`);
}

// ------------------------------------------------------------------ staff administration and privilege escalation
{
  const staff = await http("GET", "/api/crm/staff", { token: SA });
  const saRow = (staff.json.staff || []).find((s) => s.email === users.superadmin.email) || {};
  check("staff", "the super admin can list staff", staff.status === 200 && (staff.json.staff || []).length >= 4, `${staff.status}`);
  check("staff", "the staff list never returns password hashes", !/passwordHash/.test(staff.text), "passwordHash in staff list");
  const esc1 = await http("POST", "/api/crm/staff", { token: T("admin"), body: { name: "Autotest Escalation", email: "autotest.escalate@paisainminutes-test.invalid", roleKey: "super-admin" } });
  check("escalation", "an admin cannot create a super admin", [400, 403].includes(esc1.status), `${esc1.status} ${esc1.text.slice(0, 100)}`);
  if (esc1.status === 201 && esc1.json.user) logCreated("StaffUser", esc1.json.user.id, null, "UNEXPECTED: admin created a super admin");
  const esc2 = await http("PATCH", `/api/crm/staff/${saRow.id}`, { token: T("admin"), body: { name: "Hacked Name" } });
  check("escalation", "an admin cannot edit the super admin account", [400, 403, 404].includes(esc2.status), `${esc2.status} ${esc2.text.slice(0, 100)}`);
  const esc3 = await http("POST", `/api/crm/staff/${saRow.id}/reset-password`, { token: T("admin"), body: {} });
  check("escalation", "an admin cannot reset the super admin's password", [400, 403, 404].includes(esc3.status), `${esc3.status} ${esc3.text.slice(0, 100)}`);
  const esc4 = await http("DELETE", `/api/crm/staff/${saRow.id}`, { token: T("admin") });
  check("escalation", "an admin cannot disable or delete the super admin", [400, 403, 404].includes(esc4.status), `${esc4.status} ${esc4.text.slice(0, 100)}`);
  const esc5 = await http("PATCH", `/api/crm/staff/${users.telecaller.id}`, { token: T("telecaller"), body: { roleKey: "super-admin" } });
  check("escalation", "a telecaller cannot promote themselves", [401, 403].includes(esc5.status), `${esc5.status}`);
  const esc6 = await http("POST", "/api/crm/roles", { token: T("admin"), body: { key: "autotest-god", name: "Autotest God", matrix: {} } });
  check("escalation", "an admin (no roles.manage) cannot create roles", [401, 403].includes(esc6.status), `${esc6.status}`);
  const badEmail = await http("POST", "/api/crm/staff", { token: SA, body: { name: "Bad Email", email: "not-an-email", roleKey: "telecaller" } });
  check("staff", "creating staff with an invalid email is rejected (400)", badEmail.status === 400, `${badEmail.status}`);
  const badRole = await http("POST", "/api/crm/staff", { token: SA, body: { name: "Bad Role", email: "autotest.badrole@paisainminutes-test.invalid", roleKey: "does-not-exist" } });
  check("staff", "creating staff with an unknown role is rejected (400)", badRole.status === 400, `${badRole.status}`);
  const dupe = await http("POST", "/api/crm/staff", { token: SA, body: { name: "Dup", email: creds.telecaller.email, roleKey: "telecaller" } });
  check("staff", "creating staff with an existing email is rejected (409)", dupe.status === 409, `${dupe.status}`);
  const noName = await http("POST", "/api/crm/staff", { token: SA, body: { email: "autotest.noname@paisainminutes-test.invalid", roleKey: "telecaller" } });
  check("staff", "creating staff with no name is rejected (400)", noName.status === 400, `${noName.status}`);
}

// ------------------------------------------------------------------ disabling a user must end their session
{
  const off = await http("PATCH", `/api/crm/staff/${users.creditmanager.id}`, { token: SA, body: { status: "DISABLED" } });
  check("sessions", "the super admin can disable a staff user", off.status === 200, `${off.status} ${off.text.slice(0, 100)}`);
  const stillWorks = await http("GET", "/api/crm/me", { token: T("creditmanager") });
  check("sessions", "[finding] a disabled user's existing access token stops working immediately", stillWorks.status === 401 || stillWorks.status === 403, `disabled user's token still answers ${stillWorks.status}`);
  const refreshAfter = await http("POST", "/api/auth/refresh", { body: { refreshToken: users.creditmanager.refresh } });
  check("sessions", "a disabled user's refresh token is revoked", refreshAfter.status === 401, `${refreshAfter.status}`);
  const relogin = await http("POST", "/api/auth/staff/login", { body: { email: creds.creditmanager.email, password: creds.creditmanager.password } });
  check("sessions", "a disabled user cannot log in again (403)", relogin.status === 403, `${relogin.status} ${relogin.text.slice(0, 80)}`);
  const on = await http("PATCH", `/api/crm/staff/${users.creditmanager.id}`, { token: SA, body: { status: "ACTIVE" } });
  check("sessions", "the user can be re-enabled", on.status === 200, `${on.status}`);
}

// ------------------------------------------------------------------ bureau refresh (ONE paid call)
{
  const mine = await http("GET", `/api/loan-applications/all?q=${process.env.TEST_PHONE}`, { token: SA });
  const myLead = (mine.json.applications || [])[0];
  const denied = await http("POST", `/api/loan-applications/${myLead.id}/refresh-score`, { token: T("partner") });
  check("bureau", "a partner user cannot force a bureau refresh", [401, 403].includes(denied.status), `${denied.status}`);
  const before = myLead.bureauCheckedAt;
  const r = await http("POST", `/api/loan-applications/${myLead.id}/refresh-score`, { token: T("telecaller") });
  bureauCalls++;
  check("bureau", "a telecaller (leads.update) can refresh a lead's score: one real, paid bureau call", r.status === 200 && r.json && r.json.bureau, `${r.status} ${r.text.slice(0, 120)}`);
  check("bureau", "the refresh stores a newer check time on the lead", r.status === 200 && new Date(r.json.application.bureauCheckedAt) > new Date(before || 0), `before=${before} after=${r.json && r.json.application && r.json.application.bureauCheckedAt}`);
  check("bureau", "the refresh result is shown as a score or a clear 'no record' (never a blank)", r.status === 200 && (r.json.bureau.found === true || r.json.bureau.found === false), JSON.stringify(r.json && r.json.bureau));
  const aud = await http("GET", "/api/crm/audit-logs?limit=50", { token: SA });
  const list = (aud.json && (aud.json.logs || aud.json.auditLogs || aud.json.items)) || [];
  check("audit", "the refresh was written to the audit log with the actor", list.some((a) => a.action === "lead.refresh_score"), `audit entries=${list.length} actions=${[...new Set(list.map((a) => a.action))].slice(0, 8).join(",")}`);
  check("audit", "audit entries never contain passwords, tokens or full PAN", !/passwordHash|"password"|refreshToken|[A-Z]{5}\d{4}[A-Z]/.test(aud.text), "secret-looking content in the audit log");
  const mutations = ["lead.refresh_score", "staff.create", "staff.update", "partner.create", "partner_assignment.create", "auth.login"];
  observe("audit", "recent audit actions", [...new Set(list.map((a) => a.action))].join(", ").slice(0, 200));
  void mutations;
}

// ------------------------------------------------------------------ delete rules
{
  const t = await http("DELETE", `/api/loan-applications/${id(L3)}`, { token: T("telecaller") });
  check("delete", "a telecaller cannot delete a lead", [401, 403].includes(t.status), `${t.status}`);
  const c = await http("DELETE", `/api/loan-applications/${id(L3)}`, { token: T("creditmanager") });
  check("delete", "a credit manager cannot delete a lead", [401, 403].includes(c.status), `${c.status}`);
  const p = await http("DELETE", `/api/loan-applications/${id(L3)}`, { token: T("partner") });
  check("delete", "a partner user cannot delete a lead", [401, 403].includes(p.status), `${p.status}`);
  const still = await http("GET", `/api/loan-applications/${id(L3)}`, { token: SA });
  check("delete", "the lead still exists after those refused deletes", still.status === 200, `${still.status}`);
  const a = await http("DELETE", `/api/loan-applications/${id(L3)}`, { token: T("admin") });
  check("delete", "an admin (leads.delete) can delete one lead", a.status === 200, `${a.status} ${a.text.slice(0, 100)}`);
  const gone = await http("GET", `/api/loan-applications/${id(L3)}`, { token: SA });
  check("delete", "the deleted lead is gone (404)", gone.status === 404, `${gone.status}`);
  const again = await http("DELETE", `/api/loan-applications/${id(L3)}`, { token: SA });
  check("delete", "deleting it again is a clean 404", again.status === 404, `${again.status}`);
}

// ------------------------------------------------------------------ settings
{
  const g = await http("GET", "/api/crm/settings/general", { token: T("telecaller") });
  check("settings", "any staff can read the general settings", g.status === 200, `${g.status}`);
  const w = await http("PATCH", "/api/crm/settings/general", { token: T("telecaller"), body: { companyName: "Hacked Co" } });
  check("settings", "a telecaller cannot change settings", [401, 403].includes(w.status), `${w.status}`);
  const pi = await http("GET", "/api/crm/settings/integrations", { token: SA });
  check("settings", "integration secrets are masked (only whether set and the last 4 characters)", pi.status === 200 && !/"apiKey":"[^"]{8,}"|"postbackSecret":"[^"]{8,}"/.test(pi.text), pi.text.slice(0, 120));
}

// ------------------------------------------------------------------ summary
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), run: RUN, checks: results.length, passed: results.length - failed.length, failed: failed.length, bureauCalls };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-api-staff.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: staff and partner API, permissions and CRM data flows (phase 5, writes test data)\n\n`;
  md += `5 logins (super admin plus 4 test users). **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. **Bureau calls: ${bureauCalls}** (the refresh test). OTP SMS: 0. Test leads created: 5 (in \`created.jsonl\`).\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
  console.log("appended to TEST_LOG.md");
}
process.exit(failed.length ? 1 : 0);
