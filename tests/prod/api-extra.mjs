// Production API tests, phase 8: race conditions, the public lead-status endpoint, unusual phone digits. Writes test leads (bureau-free route).
//   node tests/prod/api-extra.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://api.paisainminutes.tech";
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const dbUrl = fs.readFileSync("/home/primordic/projects/adgrow/paisa/server/.env", "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL")).replace(/^DATABASE_URL=/, "").replace(/^"|"$/g, "");
const mongo = (js) => execFileSync("mongosh", [dbUrl, "--quiet", "--eval", js], { encoding: "utf8", timeout: 60000 }).trim();
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const logCreated = (code, phone, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind: "LoanApplication", id: code, phone, test }) + "\n");
const post = async (body) => { const r = await fetch(API + "/api/loan-applications/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json().catch(() => ({})); return { status: r.status, json: j, app: j.application }; };
let seq = 9811400000 + (Math.floor(Date.now() / 1000) % 60000);

// ---- race: identical submissions at the same moment must make ONE lead
{
  const phone = String(seq++);
  const body = { phone, name: "Autotest Race", loanAmount: 100000, monthlySalary: "50000", cibilScore: "700", utm_source: "email", utm_medium: "email", utm_campaign: "autotest_race" };
  const rs = await Promise.all(Array.from({ length: 6 }, () => post(body)));
  const codes = [...new Set(rs.map((r) => r.app && r.app.leadCode).filter(Boolean))];
  codes.forEach((c) => logCreated(c, phone, "race: identical parallel submissions"));
  const n = Number(mongo(`print(db.LoanApplication.countDocuments({phone:"${phone}"}))`));
  check("race", "6 identical submissions at the same moment create exactly one lead", n === 1 && codes.length === 1, `leads in database=${n}, distinct lead codes returned=${codes.length}, statuses=${rs.map((r) => r.status).join(",")}`);
  const users = Number(mongo(`print(db.User.countDocuments({phone:"${phone}"}))`));
  check("race", "and exactly one customer record", users === 1, `customers=${users}`);
}
{
  const phone = String(seq++);
  const rs = await Promise.all(Array.from({ length: 6 }, (_, i) => post({ phone, name: `Autotest Race ${"ABCDEF"[i]}`, loanAmount: 100000 + i * 1000, monthlySalary: "50000", cibilScore: "700" })));
  const codes = [...new Set(rs.map((r) => r.app && r.app.leadCode).filter(Boolean))];
  codes.forEach((c) => logCreated(c, phone, "race: different parallel submissions"));
  const n = Number(mongo(`print(db.LoanApplication.countDocuments({phone:"${phone}"}))`));
  check("race", "6 different submissions for one phone at the same moment still make exactly one lead", n === 1, `leads=${n}, codes=${codes.join(",")}, statuses=${rs.map((r) => r.status).join(",")}`);
  const dupCodes = mongo(`print(db.LoanApplication.aggregate([{$group:{_id:"$leadCode",n:{$sum:1}}},{$match:{n:{$gt:1}}}]).toArray().length)`);
  check("race", "no two leads in the whole database share a lead code", dupCodes === "0", `duplicated codes: ${dupCodes}`);
}
await sleep(1500);

// ---- unusual phone digits
for (const [name, phone] of [["Devanagari digits", "९८११४०९९०१"], ["full-width digits", "９８１１４０９９０２"], ["Arabic-Indic digits", "٩٨١١٤٠٩٩٠٣"], ["number with letters and spaces", "98 11 40 99 04 x"], ["too long (15 digits)", "981140990501234"]]) {
  const r = await post({ phone, name: "Autotest Digits" });
  const code = r.app && r.app.leadCode;
  if (code) logCreated(code, String(r.app.phone), "unusual phone digits: " + name);
  check("phone", `${name}: rejected, or normalised to a valid 10-digit number`, r.status === 400 || (r.app && /^[6-9]\d{9}$/.test(String(r.app.phone))), `${r.status} phone stored=${r.app && r.app.phone}`);
  await sleep(2200);
}

// ---- public lead status endpoint: what does it give a stranger?
{
  const phone = String(seq++);
  const c = await post({ phone, name: "Autotest Status Person", email: "autotest.status@example.com", loanAmount: 120000, monthlySalary: "55000", cibilScore: "710", pan: "ABCDE1234F" });
  if (c.app) logCreated(c.app.leadCode, phone, "status endpoint subject");
  await sleep(1500);
  const q = async (qs) => { const r = await fetch(API + "/api/public/leads/status?" + qs); const t = await r.text(); await sleep(900); let j = null; try { j = JSON.parse(t); } catch { /* */ } return { status: r.status, text: t, json: j }; };
  const byPhone = await q(`phone=${phone}`);
  check("status", "status by phone answers without a server error", byPhone.status < 500, `${byPhone.status} ${byPhone.text.slice(0, 120)}`);
  check("status", "[finding] status by phone alone does not reveal the person's name, email, PAN, amount or salary", !/Autotest Status Person|autotest\.status@|ABCDE1234F|120000|55000|"salary"|"email"|"name"/i.test(byPhone.text), byPhone.text.slice(0, 220));
  const unknown = await q("phone=9000000001");
  check("status", "an unknown phone gives the same style of answer as a known one (no easy way to tell who has applied)", unknown.status === byPhone.status, `known=${byPhone.status} unknown=${unknown.status}`);
  const bad = await q("phone=123");
  check("status", "an invalid phone is a clean 400", bad.status === 400, `${bad.status}`);
  const none = await q("");
  check("status", "no parameters is a clean 4xx", none.status >= 400 && none.status < 500, `${none.status}`);
  observe: {
    results.push({ area: "status", name: "what status-by-phone returns", pass: true, detail: "observation: " + byPhone.text.slice(0, 260) });
    console.log("NOTE  [status] returns:", byPhone.text.slice(0, 260));
  }
}

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
if (process.argv.includes("--log")) {
  let md = `\n## Run ${summary.when}: race conditions, unusual phone digits and the public status endpoint (phase 8, writes test leads)\n\n**${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau-free route. Bureau calls: 0. OTP SMS: 0.\n`;
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
