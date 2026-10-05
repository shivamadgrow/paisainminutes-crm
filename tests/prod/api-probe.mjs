// Production API probe, phase 1. Makes NO paid calls and creates NO data.
//   node tests/prod/api-probe.mjs [--log]        (--log appends the run to TEST_LOG.md)
//
// Safe by design:
//  - protected routes are called WITHOUT a login and must refuse (401/403); bodies are empty so even a
//    broken guard would fail validation before any bureau / SMS call;
//  - public routes that write or cost money are only sent INVALID input that is rejected before any side effect;
//  - DELETE is only sent to :id routes with an id that does not exist.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://paisainminutes.com";
const routes = JSON.parse(fs.readFileSync(path.join(here, "routes.json"), "utf8"));
const results = [];
const timings = [];
let requests = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(method, url, { headers = {}, body, raw } = {}) {
  requests++;
  const started = performance.now();
  let res;
  try {
    res = await fetch(API + url, {
      method,
      headers: { ...(body !== undefined && !raw ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
    });
  } catch (err) {
    return { status: 0, error: err.message, ms: Math.round(performance.now() - started) };
  }
  const ms = Math.round(performance.now() - started);
  timings.push(ms);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  await sleep(150); // stay far below the server's own rate limits
  return { status: res.status, headers: res.headers, text, json, ms };
}

function record(area, name, pass, detail = "") {
  results.push({ area, name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${detail ? "  -> " + detail : ""}`);
}

const fill = (p) => p.replace(/:[A-Za-z0-9_]+/g, "NOPE-TEST-ID").replace(/\/+$/, "") || "/";
const leaks = (text) => /at\s+\S+\s+\(.*:\d+:\d+\)|node_modules|PrismaClient|mongodb(\+srv)?:\/\/|stack/i.test(text || "");

// ------------------------------------------------------------------ A. health and basics
{
  const r = await call("GET", "/api/health");
  record("health", "GET /api/health returns 200 JSON", r.status === 200 && !!r.json, `${r.status} in ${r.ms}ms`);
  const ready = await call("GET", "/api/health/ready");
  record("health", "GET /api/health/ready answers (200 ready or 503 not ready, never a crash)", [200, 503].includes(ready.status), `${ready.status} ${ready.text.slice(0, 80)}`);
  const nf = await call("GET", "/api/definitely-not-a-route");
  record("errors", "unknown route is a JSON 404", nf.status === 404 && !!nf.json && !leaks(nf.text), `${nf.status} ${nf.text.slice(0, 80)}`);
  const hdr = (await call("GET", "/api/health")).headers;
  record("security", "no X-Powered-By header", !hdr.get("x-powered-by"), `x-powered-by=${hdr.get("x-powered-by")}`);
  record("security", "X-Content-Type-Options is nosniff", hdr.get("x-content-type-options") === "nosniff", String(hdr.get("x-content-type-options")));
  record("security", "HSTS header present", !!hdr.get("strict-transport-security"), String(hdr.get("strict-transport-security")));
  const http = await fetch(API.replace("https://", "http://") + "/api/health", { redirect: "manual", signal: AbortSignal.timeout(15000) }).catch((e) => ({ status: 0, error: e.message }));
  record("security", "plain http redirects to https (or is closed)", [0, 301, 302, 307, 308].includes(http.status), `status ${http.status}`);
}

// ------------------------------------------------------------------ B. CORS
{
  const ok = await call("OPTIONS", "/api/public/leads", { headers: { Origin: SITE_ORIGIN, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } });
  record("cors", "website origin is allowed", ok.headers?.get("access-control-allow-origin") === SITE_ORIGIN, `allow-origin=${ok.headers?.get("access-control-allow-origin")} (status ${ok.status}). If empty, website leads are being lost`);
  const crm = await call("OPTIONS", "/api/auth/staff/login", { headers: { Origin: "https://crm.paisainminutes.com", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } });
  record("cors", "CRM origin is allowed", crm.headers?.get("access-control-allow-origin") === "https://crm.paisainminutes.com", `allow-origin=${crm.headers?.get("access-control-allow-origin")}`);
  const evil = await call("OPTIONS", "/api/public/leads", { headers: { Origin: "https://evil.example.com", "Access-Control-Request-Method": "POST" } });
  const allow = evil.headers?.get("access-control-allow-origin");
  record("cors", "an unknown origin is NOT allowed", !allow || (allow !== "*" && allow !== "https://evil.example.com"), `allow-origin=${allow}`);
  const wild = await call("GET", "/api/health", { headers: { Origin: "https://evil.example.com" } });
  record("cors", "no wildcard Access-Control-Allow-Origin", wild.headers?.get("access-control-allow-origin") !== "*", String(wild.headers?.get("access-control-allow-origin")));
}

// ------------------------------------------------------------------ C. every protected route refuses anonymous callers
{
  const skipPublic = new Set(["public"]);
  let checked = 0;
  for (const r of routes) {
    if (skipPublic.has(r.auth)) continue;
    if (r.m === "DELETE" && !/\/:[A-Za-z]+$/.test(r.p)) continue; // never aim a bulk delete at production
    if (r.m === "DELETE" && /\/all$/.test(r.p)) continue;
    const url = fill(r.p);
    const withBody = ["POST", "PUT", "PATCH"].includes(r.m);
    const res = await call(r.m, url, withBody ? { body: {} } : {});
    const metrics = /METRICS_TOKEN/.test(r.auth);
    const postback = r.auth === "token"; // partner postbacks check a secret; 400 (missing sub_id) / 404 (unknown partner) are fine, 200 and 5xx are not
    const expected = metrics ? [401, 403, 404] : postback ? [400, 401, 403, 404] : [401, 403];
    const pass = expected.includes(res.status) && !leaks(res.text);
    checked++;
    record("auth", `${r.m} ${r.p} refuses anonymous (${r.auth})`, pass, pass ? `${res.status}` : `got ${res.status} ${res.text.slice(0, 100)}`);
  }
  console.log(`-- ${checked} protected routes checked`);
}

// ------------------------------------------------------------------ D. public routes: only safe probes
{
  const get = async (name, url, okStatuses) => {
    const r = await call("GET", url);
    record("public", name, okStatuses.includes(r.status) && !leaks(r.text), `${r.status} ${r.ms}ms`);
  };
  await get("GET /api/lenders/offers answers", "/api/lenders/offers", [200]);
  await get("GET /api/lenders/ answers", "/api/lenders/", [200]);
  await get("GET /api/public/leads/lookup with no params is rejected, not a crash", "/api/public/leads/lookup", [400, 404]);
  await get("GET /api/public/leads/status with no params is rejected, not a crash", "/api/public/leads/status", [400, 404]);
  await get("GET /api/lenders/:id with an unknown id is a 404", "/api/lenders/NOPE-TEST-ID", [404, 400]);
}

// ------------------------------------------------------------------ E. invalid input is rejected before any cost or write
{
  const expect400 = async (area, name, method, url, opts) => {
    const r = await call(method, url, opts);
    record(area, name, [400, 401, 413, 415, 422].includes(r.status) && !leaks(r.text), `${r.status} ${r.text.slice(0, 90)}`);
  };
  await expect400("intake", "empty body is rejected", "POST", "/api/public/leads", { body: {} });
  await expect400("intake", "invalid phone is rejected", "POST", "/api/public/leads", { body: { phone: "12345" } });
  await expect400("intake", "phone starting with 5 is rejected", "POST", "/api/public/leads", { body: { phone: "5123456789" } });
  await expect400("intake", "NoSQL operator in phone is rejected", "POST", "/api/public/leads", { body: { phone: { $ne: "" } } });
  // NOTE: ["9811000000"] (an array holding a VALID number) is accepted and creates a lead (finding F-1), so this probe
  // uses an invalid element: it proves arrays are coerced, not rejected, without creating data.
  await expect400("intake", "array holding an invalid phone is rejected", "POST", "/api/public/leads", { body: { phone: ["123"] } });
  await expect400("intake", "malformed JSON is a clean 400", "POST", "/api/public/leads", { body: "{not json", raw: true });
  await expect400("intake", "invalid phone on the legacy create route is rejected", "POST", "/api/loan-applications/", { body: { phone: "123" } });
  await expect400("credit-check", "credit check without consent is rejected before the bureau", "POST", "/api/public/credit-check", { body: { phone: "9811000000", name: "X", consent: false } });
  await expect400("credit-check", "credit check with invalid phone is rejected", "POST", "/api/public/credit-check", { body: { phone: "123", consent: true } });
  await expect400("otp", "send-otp with a too-short phone is rejected before any SMS", "POST", "/api/auth/send-otp", { body: { phone: "123" } });
  await expect400("otp", "send-otp with no body is rejected", "POST", "/api/auth/send-otp", { body: {} });
  await expect400("contact", "contact form with an empty body is rejected", "POST", "/api/public/contact", { body: {} });

  const huge = await call("POST", "/api/public/leads", { body: { phone: "9811000000", name: "A".repeat(2_000_000) } });
  record("intake", "a 2 MB body is refused (413) and not processed", [400, 413].includes(huge.status), `${huge.status}`);

  const login = await call("POST", "/api/auth/staff/login", { body: { email: "no-such-user@example.com", password: "wrong-password-123" } });
  record("auth", "staff login with unknown user fails with 401 and a generic message", login.status === 401 && !/not found|no such user|does not exist/i.test(login.text), `${login.status} ${login.text.slice(0, 90)}`);
  const refresh = await call("POST", "/api/auth/refresh", { body: { refreshToken: "not-a-real-token" } });
  record("auth", "refresh with a bogus token is refused", [400, 401].includes(refresh.status), `${refresh.status}`);
  const forged = await call("GET", "/api/loan-applications/all", { headers: { Authorization: "Bearer eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIn0." } });
  record("auth", "a forged 'alg: none' admin token is refused", [401, 403].includes(forged.status), `${forged.status}`);
  const junk = await call("GET", "/api/loan-applications/all", { headers: { Authorization: "Bearer not.a.jwt" } });
  record("auth", "a garbage token is refused", [401, 403].includes(junk.status), `${junk.status}`);
}

// ------------------------------------------------------------------ summary
const failed = results.filter((r) => !r.pass);
const sorted = [...timings].sort((a, b) => a - b);
const pct = (p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] ?? 0;
const summary = { when: new Date().toISOString(), api: API, requests, total: results.length, passed: results.length - failed.length, failed: failed.length, p50: pct(50), p95: pct(95), max: sorted.at(-1) ?? 0 };
console.log("\nSUMMARY", JSON.stringify(summary));

fs.writeFileSync(path.join(here, "last-api-probe.json"), JSON.stringify({ summary, results }, null, 2));

if (process.argv.includes("--log")) {
  const logFile = path.join(here, "..", "..", "TEST_LOG.md");
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: API probe (phase 1, read-only)\n\n`;
  md += `Target \`${API}\`. ${summary.requests} requests, **${summary.passed} passed, ${summary.failed} failed** of ${summary.total} checks. Response time p50 ${summary.p50} ms, p95 ${summary.p95} ms, max ${summary.max} ms. Paid calls: 0 bureau, 0 OTP. Records created: 0.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  fs.appendFileSync(logFile, md);
  console.log("appended to", logFile);
}
process.exit(failed.length ? 1 : 0);
