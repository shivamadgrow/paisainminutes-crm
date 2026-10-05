// Follow-up for api-finance.mjs: notification templates with the correct token format, template cleanup, and whether
// the partner push blocks private addresses at send time. WRITES test data on the dummy partner.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://api.paisainminutes.tech";
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const partnerId = creds.partnerId;
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function http(method, url, { body, token } = {}) {
  const r = await fetch(API + url, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch { /* */ } await sleep(280); return { status: r.status, json, text };
}
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };
const logCreated = (kind, id, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: "finance-followup", kind, id, test }) + "\n");
const lg = await http("POST", "/api/auth/staff/login", { body: { email: process.env.SA_EMAIL, password: process.env.SA_PASSWORD } });
const SA = lg.json.token;

// leftover template from the first run (its "duplicate" request was actually the first valid create)
const all = await http("GET", "/api/crm/settings/notification-templates", { token: SA });
const mine = ((all.json.templates || all.json.items || []).filter((t) => /^autotest-/.test(t.key || "") || /^AUTOTEST/.test(t.name || "")));
note("template", "leftover test templates found", mine.map((t) => `${t.key}:${t.id}`).join(", ") || "none");
for (const t of mine) { logCreated("NotificationTemplate", t.id, "leftover from finance suite run 1 (wrong token format)"); const d = await http("DELETE", `/api/crm/settings/notification-templates/${t.id}`, { token: SA }); check("template", `leftover template ${t.key} removed`, d.status === 200, `${d.status}`); }

const key = "autotest-tpl-" + Date.now().toString(36);
const undeclared = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "SMS", name: "AUTOTEST bad", body: "Hello {Name}, lead {LeadId}", tokens: ["{Name}"] } });
check("template", "a template that uses {LeadId} without declaring it is rejected", undeclared.status === 400, `${undeclared.status} ${undeclared.text.slice(0, 100)}`);
const badCh = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "Telegram", name: "AUTOTEST bad", body: "x", tokens: [] } });
check("template", "an unknown channel is rejected", badCh.status === 400, `${badCh.status}`);
const c = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "SMS", name: "AUTOTEST template", key, body: "Hello {Name}, your lead {LeadId} is received.", tokens: ["{Name}", "{LeadId}"] } });
const tpl = (c.json && (c.json.template || c.json.item)) || {};
check("template", "a valid template is created", [200, 201].includes(c.status) && !!tpl.id, `${c.status} ${c.text.slice(0, 140)}`);
if (tpl.id) logCreated("NotificationTemplate", tpl.id, "finance follow-up template");
const dupe = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "SMS", name: "AUTOTEST template 2", key, body: "x", tokens: [] } });
check("template", "a second template with the same key is refused (409)", dupe.status === 409, `${dupe.status} ${dupe.text.slice(0, 80)}`);
const p = await http("PATCH", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA, body: { body: "Hello {Name}, thanks!", tokens: ["{Name}"], enabled: false } });
check("template", "a template can be edited and disabled", p.status === 200, `${p.status} ${p.text.slice(0, 100)}`);
const xss = await http("PATCH", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA, body: { name: "<script>alert(1)</script>" } });
check("template", "a script in a template name is accepted as text or rejected, never a server error", xss.status < 500, `${xss.status}`);
const d = await http("DELETE", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA });
check("template", "the template can be deleted", d.status === 200, `${d.status}`);
const gone = await http("DELETE", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA });
check("template", "deleting it again is a clean 404", gone.status === 404, `${gone.status}`);

// does the partner push refuse private addresses when it SENDS?
const set = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEndpoint: "https://127.0.0.1:9/hook", apiEnabled: true, status: "CONNECTED" } });
note("ssrf", "saving a loopback https endpoint on the dummy partner", `${set.status}`);
const lead = (await http("GET", "/api/loan-applications/all?utmCampaign=autotest_followup&limit=1", { token: SA })).json.applications[0];
const push = await http("POST", "/api/crm/delivery-logs/push", { token: SA, body: { applicationId: lead.id, partnerId } });
note("ssrf", "pushing a lead to https://127.0.0.1:9/hook", `${push.status} ${push.text.slice(0, 300)}`);
check("ssrf", "[security] pushing to a loopback address is blocked before any connection is made", /block|private|loopback|not allowed|forbidden|internal/i.test(push.text) && !/ECONNREFUSED|connect/i.test(push.text), `${push.status} ${push.text.slice(0, 220)}`);
const meta = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEndpoint: "https://169.254.169.254/latest/meta-data/" } });
const push2 = await http("POST", "/api/crm/delivery-logs/push", { token: SA, body: { applicationId: lead.id, partnerId } });
check("ssrf", "[security] pushing to the cloud metadata address 169.254.169.254 is blocked", /block|private|loopback|not allowed|forbidden|internal|link-local/i.test(push2.text) && !/ECONNREFUSED|timed out|ETIMEDOUT/i.test(push2.text), `${push2.status} ${push2.text.slice(0, 220)}`);
const plain = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEndpoint: "http://example.com/hook" } });
const push3 = await http("POST", "/api/crm/delivery-logs/push", { token: SA, body: { applicationId: lead.id, partnerId } });
check("ssrf", "pushing to a plain http address is refused (https only)", /https|not allowed|block|forbidden/i.test(push3.text) && !/ENOTFOUND|ECONN/i.test(push3.text), `${push3.status} ${push3.text.slice(0, 200)}`);
const clean = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEnabled: false, apiEndpoint: null, webhookUrl: null, status: "PAUSED" } });
note("ssrf", "dummy partner integration reset", `${clean.status}`);
const logs = await http("GET", `/api/crm/delivery-logs?partnerId=${partnerId}`, { token: SA });
note("ssrf", "delivery log entries recorded for the dummy partner", `${((logs.json.logs || logs.json.items || logs.json.deliveryLogs) || []).length}`);

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n### Run ${summary.when}: finance follow-up (templates and partner push safety)\n\n**${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0. OTP SMS: 0.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
