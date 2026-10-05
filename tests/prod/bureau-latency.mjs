// Production bureau test: does website lead intake (3 s bureau limit) get a result in time? SPENDS real bureau calls (max 5).
//   node tests/prod/bureau-latency.mjs [--log]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const API = "https://api.paisainminutes.tech";
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const base = 9811300000 + (Math.floor(Date.now() / 1000) % 60000);
const out = [];
let calls = 0;
async function submit(phone, name) {
  const t = Date.now();
  const r = await fetch(API + "/api/public/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, name, loanAmount: 100000, monthlySalary: "50000", utm_source: "google", utm_medium: "cpc", utm_campaign: "autotest_bureau" }) });
  const j = await r.json().catch(() => ({}));
  const ms = Date.now() - t;
  return { status: r.status, ms, cibil_status: j.cibil_status, bureau_score: j.bureau_score, code: j.lead_id };
}
const logCreated = (code, phone, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind: "LoanApplication", id: code, phone, test }) + "\n");
const phones = [0, 1, 2].map((i) => String(base + i));
for (const [i, p] of phones.entries()) {
  const r = await submit(p, `Autotest Bureau ${i + 1}`);
  calls++;
  if (r.code) logCreated(r.code, p, "bureau latency, first submission");
  out.push({ step: `new number ${i + 1}`, ...r });
  console.log(`new number ${i + 1}: ${r.status} in ${r.ms} ms -> ${r.cibil_status}`);
  await sleep(4000);
}
// retry for the first number after its first attempt: does it call the bureau again (not cached after a timeout)?
const again = await submit(phones[0], "Autotest Bureau 1 retry");
out.push({ step: "same number again", ...again });
console.log(`same number again: ${again.status} in ${again.ms} ms -> ${again.cibil_status}`);
const row = (s) => `| ${s.step} | ${s.status} | ${s.ms} ms | ${s.cibil_status} |`;
const timedOut = out.filter((o) => /timed out/i.test(o.cibil_status || "")).length;
console.log(`\n${timedOut} of ${out.length} attempts ended as "timed out"`);
if (process.argv.includes("--log")) {
  let md = `\n### Run ${new Date().toISOString()}: website intake and the bureau time limit (spends bureau calls)\n\nFour submissions through \`POST /api/public/leads\` (the real website route, bureau time limit 3 s) with made-up numbers. Bureau calls attempted: **${calls}** (the repeat for number 1 may add a fifth; see below).\n\n| Step | HTTP | Time | cibil_status |\n| --- | --- | --- | --- |\n${out.map(row).join("\n")}\n\n**${timedOut} of ${out.length} attempts ended as "timed out".**\n`;
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
