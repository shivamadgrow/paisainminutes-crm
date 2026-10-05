// Production website + CRM probe, phase 1. Read-only: only GET requests, no forms submitted, no cost.
//   node tests/prod/site-probe.mjs [--log]
// Exposure checks record only the status code and size, never the file contents.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE_URL || "https://paisainminutes.com";
const CRM = process.env.CRM_URL || "https://crm.paisainminutes.com";
const results = [];
const slow = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, opts = {}) {
  const started = performance.now();
  try {
    const res = await fetch(url, { redirect: opts.follow ? "follow" : "manual", signal: AbortSignal.timeout(25000), headers: { "User-Agent": "paisa-prod-probe/1.0", ...(opts.headers || {}) } });
    const ct = res.headers.get("content-type") || "";
    const text = opts.noBody ? "" : await res.text();
    await sleep(80);
    return { status: res.status, ct, text, size: text.length, ms: Math.round(performance.now() - started), headers: res.headers };
  } catch (err) {
    return { status: 0, ct: "", text: "", size: 0, ms: Math.round(performance.now() - started), error: err.message };
  }
}
function record(area, name, pass, detail = "") {
  results.push({ area, name, pass, detail });
  if (!pass) console.log(`FAIL  [${area}] ${name}  -> ${detail}`);
}

// ---------------------------------------------------------------- sitemap and robots
const sm = await get(SITE + "/sitemap.xml", { follow: true });
record("seo", "sitemap.xml loads", sm.status === 200 && /<urlset/.test(sm.text), `${sm.status}`);
const rb = await get(SITE + "/robots.txt", { follow: true });
record("seo", "robots.txt loads", rb.status === 200, `${rb.status}`);
record("seo", "robots.txt lists the sitemap", /sitemap:/i.test(rb.text), "");
const urls = [...sm.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]).map((u) => u.replace(/^https?:\/\/[^/]+/, SITE));
const unique = [...new Set(urls)];
console.log(`sitemap lists ${unique.length} pages`);

// ---------------------------------------------------------------- every page
const internal = new Map(); // link -> first page that links to it
let attributionPages = 0;
let withHeader = 0;
async function checkPage(url) {
  const r = await get(url, { follow: true });
  const p = url.replace(SITE, "") || "/";
  if (r.status !== 200) return record("page", `${p} loads`, false, `status ${r.status}${r.error ? " " + r.error : ""}`);
  const html = r.text;
  const problems = [];
  if (!/text\/html/.test(r.ct)) problems.push(`content-type ${r.ct}`);
  if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) problems.push("no <title>");
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i.test(html)) problems.push("no/short meta description");
  if (!/<h1[\s>]/i.test(html)) problems.push("no <h1>");
  if ((html.match(/<h1[\s>]/gi) || []).length > 1) problems.push("more than one <h1>");
  if (/(Warning|Fatal error|Parse error|Notice|Deprecated):\s.*\son line\s\d+/i.test(html) || /Stack trace:/.test(html)) problems.push("PHP error text on page");
  if (/\{\{[^}]+\}\}|<\?php|\bundefined\b(?![^<]*<\/script>)/.test(html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, ""))) problems.push("template/undefined text visible");
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) problems.push("no viewport meta (not mobile friendly)");
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) problems.push("no canonical link");
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) problems.push("image without alt text");
  if (r.ms > 3000) { slow.push(`${p} ${r.ms}ms`); problems.push(`slow ${r.ms}ms`); }
  if (/attribution\.js/.test(html)) attributionPages++;
  if (/<form\b/i.test(html) || /id=["']applyPhoneInput/.test(html)) withHeader += 0;
  for (const m of html.matchAll(/href=["'](\/[^"'#?][^"'#]*)["']/g)) {
    const link = m[1];
    if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|woff2?|xml|txt|pdf)(\?|$)/i.test(link)) continue;
    if (!internal.has(link)) internal.set(link, p);
  }
  record("page", `${p} basics`, problems.length === 0, problems.join("; "));
  return html;
}
for (const url of unique) await checkPage(url);

record("attribution", "attribution.js is loaded on the pages", attributionPages > 0, `${attributionPages} of ${unique.length} pages include it`);
const attr = await get(SITE + "/js/attribution.js", { follow: true });
record("attribution", "attribution.js is served as JavaScript", attr.status === 200 && /javascript/.test(attr.ct), `${attr.status} ${attr.ct}`);

// ---------------------------------------------------------------- internal links
const links = [...internal.keys()].slice(0, 400);
let broken = 0;
for (const link of links) {
  const r = await get(SITE + link, { follow: true, noBody: true });
  if (r.status === 0 || r.status >= 400) { broken++; record("links", `${link} (linked from ${internal.get(link)})`, false, `status ${r.status}`); }
}
record("links", `internal links resolve (${links.length} checked)`, broken === 0, `${broken} broken`);

// ---------------------------------------------------------------- files that must NOT be public (status only)
const mustBeClosed = [
  "/.env", "/.git/HEAD", "/.git/config", "/.gitignore", "/leads_log.csv", "/clicks_log.csv", "/data/leads.json", "/data/", "/config/partners.php",
  "/config/env.php", "/includes/config.php", "/crm/leads_log.csv", "/crm/partner_assignments.json", "/crm/.env", "/crm/package.json", "/crm/src/utils/apiConfig.js",
  "/admin/.env", "/plan.md", "/scripts/generate-sitemap.js", "/deploy_update/", "/scratch/", "/composer.json", "/phpinfo.php", "/info.php", "/backup.zip", "/db.sql",
  "/api/submit-lead.php", "/submit-lead.php", "/crm/submit-lead.php", "/crm/api/submit-lead.php", "/admin/api/submit-lead.php",
];
const exposed = [];
for (const f of mustBeClosed) {
  const r = await get(SITE + f, { noBody: false });
  // A real exposure = 200 with content that is not just the site's 404/redirect page.
  const isOpen = r.status === 200 && r.size > 0 && !/<title>[^<]*(404|not found)/i.test(r.text);
  if (isOpen) exposed.push(`${f} (${r.status}, ${r.size} bytes, ${r.ct.split(";")[0]})`);
}
record("exposure", `sensitive files are not publicly readable (${mustBeClosed.length} paths)`, exposed.length === 0, exposed.length ? "OPEN: " + exposed.join(", ") : "");

// ---------------------------------------------------------------- CRM
const crm = await get(CRM + "/", { follow: true });
record("crm", "CRM page loads", crm.status === 200 && /<div id=["']root["']/.test(crm.text), `${crm.status}`);
const assets = [...crm.text.matchAll(/(?:src|href)=["']([^"']*assets\/[^"']+)["']/g)].map((m) => m[1]);
for (const a of assets) {
  const url = a.startsWith("http") ? a : new URL(a, CRM + "/").toString();
  const r = await get(url, { follow: true, noBody: true });
  record("crm", `CRM asset ${a.split("?")[0]} loads`, r.status === 200, `${r.status}`);
}
for (const f of ["/.env", "/.git/HEAD", "/leads_log.csv", "/partner_assignments.json", "/package.json", "/src/utils/apiConfig.js"]) {
  const r = await get(CRM + f);
  const open = r.status === 200 && r.size > 0 && !/<div id=["']root["']/.test(r.text) && !/text\/html/.test(r.ct);
  record("exposure", `CRM ${f} is not publicly readable`, !open, open ? `OPEN ${r.status} ${r.size} bytes ${r.ct}` : `${r.status}`);
}

// ---------------------------------------------------------------- transport
const insecure = await get(SITE.replace("https://", "http://") + "/", {});
record("security", "http redirects to https", [301, 302, 307, 308].includes(insecure.status), `${insecure.status}`);
const home = await get(SITE + "/", { follow: true });
for (const h of ["strict-transport-security", "x-content-type-options"]) record("security", `website sends ${h}`, !!home.headers.get(h), String(home.headers.get(h)));

// ---------------------------------------------------------------- summary
const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), site: SITE, crm: CRM, pages: unique.length, checks: results.length, failed: failed.length };
console.log("SUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-site-probe.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  const byProblem = {};
  for (const f of failed.filter((x) => x.area === "page")) for (const p of f.detail.split("; ")) { const k = p.replace(/\d+ms/, "Nms"); (byProblem[k] ||= []).push(f.name.replace(" basics", "")); }
  let md = `\n## Run ${summary.when}: website and CRM probe (phase 1, read-only)\n\n`;
  md += `Targets \`${SITE}\` and \`${CRM}\`. ${summary.pages} pages from the sitemap, ${summary.checks} checks, **${summary.checks - summary.failed} passed, ${summary.failed} failed**. GET requests only; no forms submitted. Paid calls: 0. Records created: 0.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  const nonPage = failed.filter((f) => f.area !== "page");
  if (nonPage.length) md += "\n**Failures (not page-level)**\n\n" + nonPage.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  if (Object.keys(byProblem).length) {
    md += "\n**Page problems, grouped**\n\n| Problem | Pages | Examples |\n| --- | --- | --- |\n" +
      Object.entries(byProblem).sort((a, b) => b[1].length - a[1].length).map(([k, v]) => `| ${k} | ${v.length} | ${v.slice(0, 4).map((x) => "`" + x + "`").join(", ")} |`).join("\n") + "\n";
  }
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
  console.log("appended to TEST_LOG.md");
}
process.exit(failed.length ? 1 : 0);
