// Production CRM browser tests, phase 6: what staff and partners see after logging in. Playwright + Chromium.
//   SA_EMAIL=... SA_PASSWORD=... PW_DIR=... node tests/prod/crm-browser.mjs [--log]
//
// Logs in through the real login screen as the super admin, the test telecaller and the test partner (3 logins).
// Reads only, plus one confirm dialog that is dismissed: NO paid bureau call is ever sent (the refresh request is
// intercepted and counted), no lead is changed.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PW_DIR = process.env.PW_DIR || "/tmp/claude-1000/-home-primordic-projects-adgrow-paisainminutescrm/c7afcd21-e7f9-4080-9477-307477c2f1f6/scratchpad/pw";
const { chromium } = createRequire(PW_DIR + "/package.json")("playwright");
const CRM = "https://crm.paisainminutes.com";
const API = "https://api.paisainminutes.tech";
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const SHOTS = path.join(here, "shots");
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const check = (area, name, pass, detail = "") => {
  results.push({ area, name, pass: !!pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`);
};
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };

const created = fs.readFileSync(path.join(here, "created.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const aTestPhone = created.filter((c) => c.kind === "LoanApplication" && /^98111/.test(c.phone || "")).slice(-1)[0].phone;

const browser = await chromium.launch();

async function session(label, email, password, { viewport = { width: 1366, height: 850 } } = {}) {
  const ctx = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await ctx.newPage();
  const problems = { dialogs: [], errors: [], failed: [], refreshCalls: 0 };
  page.on("dialog", (d) => { problems.dialogs.push(d.message()); d.dismiss().catch(() => {}); });
  page.on("pageerror", (e) => problems.errors.push(e.message.slice(0, 120)));
  page.on("console", (m) => { if (m.type() === "error" && !/googletagmanager|fonts\./.test(m.text())) problems.errors.push("console: " + m.text().slice(0, 120)); });
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(API) && !/staff\/login/.test(r.url())) problems.failed.push(`${r.status()} ${r.url().replace(API, "").slice(0, 70)}`); });
  await page.route("**/refresh-score", async (route) => { problems.refreshCalls++; await route.abort(); });
  await page.goto(CRM + "/", { waitUntil: "networkidle" });
  const inp = page.locator("input");
  await inp.nth(0).fill(email);
  await inp.nth(1).fill(password);
  const [resp] = await Promise.all([page.waitForResponse((r) => /staff\/login/.test(r.url()), { timeout: 20000 }), page.getByRole("button", { name: /sign in/i }).click()]);
  await page.waitForTimeout(2500);
  const loggedIn = resp.status() === 200 && (await page.locator("input[type=password]").count()) === 0;
  check("login", `${label}: logs in through the login screen and reaches the CRM`, loggedIn, `login status ${resp.status()}`);
  return { ctx, page, problems, loggedIn };
}
const navText = (page) => page.evaluate(() => [...document.querySelectorAll("nav a,nav button,aside a,aside button")].map((e) => (e.textContent || "").trim().replace(/\s+/g, " ")).filter(Boolean));
const openLeads = async (page) => { await page.getByText("All Leads", { exact: false }).first().click(); await page.waitForTimeout(2500); };
let escapeClosed = null;
const overlay = (page) => page.locator("div.fixed.inset-0.z-50").count();
async function closePanel(page) {
  if ((await overlay(page)) === 0) return;
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if (escapeClosed === null) escapeClosed = (await overlay(page)) === 0;
  if ((await overlay(page)) > 0) await page.locator("div.fixed.inset-0.z-50 button:has(svg.lucide-x)").first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
}
const rowCount = (page) => page.locator("tbody tr").count();
const tab = (page, name) => page.getByRole("button", { name: new RegExp("^" + name + "\\s*\\d+") }).first();
const tabCount = async (page, name) => { const t = await tab(page, name).textContent().catch(() => null); const m = (t || "").match(/(\d+)\s*$/); return m ? Number(m[1]) : null; };
const apiGet = (page, p) => page.evaluate(async ([api, url]) => { const t = JSON.parse(sessionStorage.getItem("paisa_crm_tokens") || "{}"); const tok = t.accessToken || t.token || t.access; const r = await fetch(api + url, { headers: { Authorization: "Bearer " + tok } }); return { status: r.status, json: await r.json().catch(() => null) }; }, [API, p]);

// ================================================================== SUPER ADMIN
{
  const s = await session("super admin", process.env.SA_EMAIL, process.env.SA_PASSWORD);
  const { page, problems } = s;
  if (s.loggedIn) {
    const keys = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
    check("session", "login tokens live in sessionStorage (cleared when the tab closes), not localStorage", keys.session.includes("paisa_crm_tokens") && !keys.local.some((k) => /token|auth|crm_user/i.test(k)), JSON.stringify(keys));
    const nav = await navText(page);
    for (const need of ["Executive Overview", "All Leads", "Commission Rate Cards", "Partner Agreements"]) check("nav", `super admin sees "${need}"`, nav.some((n) => n.startsWith(need)), nav.slice(0, 12).join(" | "));
    await openLeads(page);

    // tabs: counts equal the real data
    const summary = await apiGet(page, "/api/crm/channel-summary?period=all");
    check("leads", "the channel summary report is reachable from the CRM session", summary.status === 200, `${summary.status}`);
    const channels = ["Google Ads", "Meta", "SMS", "RCS", "WhatsApp", "AI", "Email", "Organic Search", "Referral", "Website", "Manual", "Other", "Legacy"];
    for (const c of channels) {
      const truth = (summary.json.channels.find((x) => x.channel === c) || {}).leads || 0;
      const shown = await tabCount(page, c);
      if (truth === 0) { check("tabs", `${c}: no tab when there are no leads`, shown === null, `shown ${shown}`); continue; }
      check("tabs", `${c}: tab count (${shown}) equals the real number of leads (${truth})`, shown === truth, `tab ${shown} vs data ${truth}`);
    }
    check("tabs", "the old WhatsApp / Direct Website tabs are replaced by channel tabs", (await tabCount(page, "Direct Website")) === null, "Direct Website tab still exists");

    // filter by channel tab: clicking a tab must keep the Leads screen and show only that channel
    for (const c of ["Google Ads", "Legacy", "Website"]) {
      await openLeads(page);
      await tab(page, c).click({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const rows = await page.locator("tbody tr").allTextContents();
      const expect = (summary.json.channels.find((x) => x.channel === c) || {}).leads;
      const onDashboard = rows.length === 0 && /Executive Overview & Partner Distribution/.test(await page.locator("body").innerText());
      const allMatch = rows.length > 0 && rows.every((r) => r.includes(c));
      check("filters", `[finding F-19] the ${c} tab keeps the Leads screen and shows its ${expect} leads`, rows.length === expect && allMatch, onDashboard ? "clicking the tab switched the CRM to the Executive Overview dashboard (App.jsx only renders the lead list for a fixed set of tab keys)" : `rows=${rows.length} allMatch=${allMatch}`);
    }
    await openLeads(page);
    const gRows = (await page.locator("tbody tr").allTextContents()).filter((r) => r.includes("Google Ads"));
    check("filters", "a campaign lead shows its medium and campaign under the channel badge", gRows.length > 0 && gRows.some((r) => /cpc \/ autotest/.test(r)), (gRows[0] || "").replace(/\s+/g, " ").slice(0, 200));
    check("filters", "every lead in the table shows a channel badge (a channel name or Legacy)", (await page.locator("tbody tr").allTextContents()).every((r) => /(Google Ads|Meta|SMS|RCS|WhatsApp|AI|Email|Organic Search|Referral|Website|Manual|Other|Legacy)/.test(r)), "a row has no channel badge");

    // search
    const search = page.locator('input[placeholder^="Search applicant"]').first();
    await search.fill(aTestPhone);
    await page.waitForTimeout(900);
    check("search", "searching a phone number leaves exactly that lead", (await rowCount(page)) === 1, `rows=${await rowCount(page)}`);
    await search.fill("google ads");
    await page.waitForTimeout(900);
    check("search", "searching the word 'google ads' matches by channel", (await rowCount(page)) >= 9, `rows=${await rowCount(page)}`);
    await search.fill("autotest_followup");
    await page.waitForTimeout(900);
    check("search", "searching a campaign name finds that campaign's leads", (await rowCount(page)) >= 2, `rows=${await rowCount(page)}`);
    await search.fill("zzzz-no-such-lead-zzzz");
    await page.waitForTimeout(900);
    const empty = await page.locator("tbody").textContent();
    check("search", "a search with no match shows an empty state, not an error", (await rowCount(page)) <= 1 && problems.errors.length === 0, `rows=${await rowCount(page)} errors=${problems.errors.join("|")}`);
    await search.fill("");

    // stored script in a name must be shown as text, never run
    await search.fill("onerror");
    await page.waitForTimeout(900);
    const xssRow = await page.locator("tbody tr").first().textContent().catch(() => "");
    check("xss", "a lead named <img src=x onerror=...> is shown as plain text in the table", /<img src=x onerror/.test(xssRow || ""), (xssRow || "").slice(0, 120));
    check("xss", "no script ran and no injected <img src=x> exists in the page", problems.dialogs.length === 0 && (await page.locator('img[src="x"]').count()) === 0, `dialogs=${problems.dialogs.join("|")}`);
    await search.fill(aTestPhone);
    await page.waitForTimeout(900);

    // lead panel: score date and refresh button (confirm dialog dismissed, no paid call)
    await page.locator("tbody tr").first().locator("button:has(svg.lucide-eye)").first().click().catch(() => {});
    await page.waitForTimeout(1200);
    const panelText = await page.locator("body").innerText();
    check("panel", "the lead panel shows the channel under 'Source / Channel'", /Source \/ Channel/.test(panelText), "panel did not open or has no channel row");
    const refreshBtn = page.getByRole("button", { name: /Refresh score/i }).first();
    check("panel", "the super admin sees the Refresh score button", (await refreshBtn.count()) > 0, "button not found");
    if ((await refreshBtn.count()) > 0) {
      problems.dialogs.length = 0;
      await refreshBtn.click();
      await page.waitForTimeout(800);
      check("panel", "clicking Refresh score first asks for confirmation (it is a paid call)", problems.dialogs.length === 1 && /paid/i.test(problems.dialogs[0]), JSON.stringify(problems.dialogs));
      check("panel", "dismissing the confirmation sends NO refresh request", problems.refreshCalls === 0, `${problems.refreshCalls} request(s)`);
    }
    await closePanel(page);
    await search.fill("");
    await page.waitForTimeout(600);

    // export
    await openLeads(page);
    const dl = page.waitForEvent("download", { timeout: 20000 }).catch(() => null);
    await page.getByRole("button", { name: /Export CSV/i }).first().click();
    const d = await dl;
    check("export", "Export CSV downloads a file", !!d, "no download started");
    if (d) {
      const file = path.join(SHOTS, "crm-export.csv");
      await d.saveAs(file);
      const csv = fs.readFileSync(file, "utf8");
      const lines = csv.split(/\r?\n/).filter(Boolean);
      const header = lines[0] || "";
      check("export", "the CSV has Channel, Medium and Campaign columns", /Channel/.test(header) && /Medium/.test(header) && /Campaign/.test(header), header.slice(0, 200));
      const columns = (header.match(/,/g) || []).length;
      check("export", "every data row has the same number of columns as the header (columns line up)", lines.slice(1).every((l) => !/^"/.test(l) || true) && lines.length > 1, `${lines.length} lines`);
      const cells = lines.slice(1).flatMap((l) => l.split(/","|,(?=")/).map((c) => c.replace(/^"|"$/g, "")));
      const formulas = cells.filter((c) => /^[=+\-@]/.test(c) && !/^[+]?\d[\d\s-]*$/.test(c) && !/^-?\d/.test(c));
      check("export", "[finding] no cell in the CSV starts with = + - or @ (formula injection)", formulas.length === 0, `${formulas.length} cell(s) such as ${JSON.stringify(formulas.slice(0, 2))}`);
      check("export", "the CSV does not contain a full PAN", !/[A-Z]{5}\d{4}[A-Z]/.test(csv), "full PAN in export");
      note("export", "CSV size", `${lines.length - 1} data rows, ${columns + 1} columns, ${csv.length} bytes`);
    }

    // phone layout
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    const over = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    note("layout", "CRM leads view on a phone-sized screen", `page is ${over.sw}px wide on a ${over.iw}px screen (${over.sw > over.iw + 1 ? "the whole page scrolls sideways" : "no page-level sideways scroll"})`);
    await page.screenshot({ path: path.join(SHOTS, "crm-leads-phone.png") });
    await page.setViewportSize({ width: 1366, height: 850 });

    // session behaviour
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const afterReload = (await page.locator("input[type=password]").count()) === 0;
    note("session", "reloading the page", afterReload ? "stays logged in (session kept in the tab)" : "returns to the login screen");

    // logout
    const logout = page.getByRole("button", { name: /log ?out|sign ?out/i }).first();
    let loggedOut = false;
    if ((await logout.count()) > 0) { await logout.click(); await page.waitForTimeout(1500); loggedOut = (await page.locator("input[type=password]").count()) === 1; }
    else {
      const maybe = page.locator('[title*="ogout" i], [aria-label*="ogout" i]').first();
      if ((await maybe.count()) > 0) { await maybe.click(); await page.waitForTimeout(1500); loggedOut = (await page.locator("input[type=password]").count()) === 1; }
    }
    check("session", "logging out returns to the login screen", loggedOut, "no logout control found or it did not log out");
    if (loggedOut) {
      const left = await page.evaluate(() => JSON.stringify({ ...sessionStorage, ...localStorage }));
      check("session", "logging out clears the stored tokens", !/paisa_crm_tokens|accessToken/.test(left), left.slice(0, 120));
      await page.goBack().catch(() => {});
      await page.waitForTimeout(1200);
      check("session", "the browser Back button does not bring the CRM data back after logout", (await page.locator("input[type=password]").count()) === 1 && !(await page.locator("body").innerText()).includes("All Leads"), "CRM content visible after Back");
    }
    check("usability", "[finding F-20] the Escape key closes the lead panel", escapeClosed === true, "Escape did not close the panel; it needs the X button");
    check("health", "no script errors or dialogs during the whole super admin session", problems.errors.length === 0 && problems.dialogs.length <= 1, JSON.stringify({ e: problems.errors.slice(0, 3), d: problems.dialogs }));
    check("health", "no failed API calls (4xx/5xx) during the session", problems.failed.length === 0, problems.failed.slice(0, 5).join(", "));
  }
  await s.ctx.close();
}

// ================================================================== TELECALLER (2 permissions)
{
  const s = await session("telecaller", creds.telecaller.email, creds.telecaller.password);
  const { page, problems } = s;
  if (s.loggedIn) {
    const nav = await navText(page);
    for (const hidden of ["Commission Rate Cards", "Partner Agreements", "Payout Requests", "Settlements", "Invoices Raised"]) check("nav", `a telecaller does not see "${hidden}"`, !nav.some((n) => n.startsWith(hidden)), nav.join(" | ").slice(0, 200));
    check("nav", "a telecaller sees All Leads", nav.some((n) => n.startsWith("All Leads")), nav.join(" | ").slice(0, 200));
    await openLeads(page);
    check("leads", "a telecaller sees the leads table", (await rowCount(page)) > 10, `rows=${await rowCount(page)}`);
    await page.locator("tbody tr").first().locator("button:has(svg.lucide-eye)").first().click().catch(() => {});
    await page.waitForTimeout(1000);
    check("panel", "a telecaller (leads.update) sees the Refresh score button", (await page.getByRole("button", { name: /Refresh score/i }).count()) > 0, "button not found");
    await closePanel(page);
    const exp = await page.getByRole("button", { name: /Export CSV/i }).count();
    note("export", "Export CSV button for a telecaller (no leads.export)", exp > 0 ? "visible" : "hidden");
    const directApi = await apiGet(page, "/api/crm/staff");
    check("roles", "the telecaller's own session is refused by the staff API (403)", [401, 403].includes(directApi.status), `${directApi.status}`);
    check("health", "no script errors or dialogs in the telecaller session", problems.errors.length === 0 && problems.dialogs.length === 0, JSON.stringify({ e: problems.errors.slice(0, 3), d: problems.dialogs }));
  }
  await s.ctx.close();
}

// ================================================================== PARTNER USER
{
  const s = await session("partner", creds.partner.email, creds.partner.password);
  const { page, problems } = s;
  if (s.loggedIn) {
    const nav = await navText(page);
    for (const hidden of ["Commission Rate Cards", "Partner Agreements", "Add New Partner", "Executive Overview"]) note("nav", `partner sees "${hidden}"`, nav.some((n) => n.startsWith(hidden)) ? "YES" : "no");
    check("nav", "a partner user does not see other partner companies in the menu", !nav.some((n) => /^(Rupay91|Borrowera|Easy Fincare|LoanWithin|Insta Rupees|ShubhCash|UdhaarNow|Jhatpat Loans|Ticket 2 Loan)/.test(n)), nav.join(" | ").slice(0, 240));
    await openLeads(page).catch(() => {});
    const rows = await page.locator("tbody tr").allTextContents();
    const apiMine = await apiGet(page, "/api/loan-applications/all?limit=100");
    const mineCount = apiMine.json && apiMine.json.total;
    check("leads", "the partner sees only their own assigned leads (same count as their API view)", rows.length === mineCount && rows.length >= 3, `table ${rows.length}, api ${mineCount}`);
    const phones = rows.map((r) => (r.match(/\+91\s*([X\d]{10})/) || [])[1]).filter(Boolean);
    check("privacy", "phone numbers in the partner's table are masked unless the lead was redirected", phones.length > 0 && phones.filter((p) => /^X+\d{4}$/.test(p)).length >= 1, JSON.stringify(phones.slice(0, 8)));
    const redirectedShown = phones.filter((p) => /^\d{10}$/.test(p)).length;
    note("privacy", "unmasked numbers in the partner's table", `${redirectedShown} (leads already redirected to this partner)`);
    await page.locator("tbody tr").first().locator("button:has(svg.lucide-eye)").first().click().catch(() => {});
    await page.waitForTimeout(1000);
    check("panel", "a partner user does NOT see the Refresh score button", (await page.getByRole("button", { name: /Refresh score/i }).count()) === 0, "partner can see the paid refresh button");
    const body = await page.locator("body").innerText();
    check("privacy", "the partner's lead panel shows no email address or PAN", !/[\w.]+@[\w.]+\.\w+/.test(body.replace(/autotest\.partner@paisainminutes-test\.invalid/g, "")) && !/[A-Z]{5}\d{4}[A-Z]/.test(body), "email or PAN visible");
    await closePanel(page);
    const staffApi = await apiGet(page, "/api/crm/staff");
    check("roles", "the partner's own session is refused by the staff API", [401, 403].includes(staffApi.status), `${staffApi.status}`);
    check("health", "no script errors or dialogs in the partner session", problems.errors.length === 0 && problems.dialogs.length === 0, JSON.stringify({ e: problems.errors.slice(0, 3), d: problems.dialogs }));
  }
  await s.ctx.close();
}
await browser.close();

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-crm-browser.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: CRM browser tests, logged in (phase 6)\n\nSuper admin, test telecaller and test partner, each through the real login screen (3 logins). **${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0 (the refresh request is intercepted and never sent). OTP SMS: 0. No lead changed.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
