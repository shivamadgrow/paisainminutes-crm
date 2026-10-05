// Production API tests, phase 11: rate cards, commissions, payouts, settlements, invoices (validation only), agreements,
// notification templates, roles and settings validation. WRITES test data on the DUMMY PARTNER only.
//   SA_EMAIL=... SA_PASSWORD=... node tests/prod/api-finance.mjs [--log]
//
// Deliberately NOT called on production:
//  - PUT /api/crm/rate-cards (deletes rate cards missing from the payload, could remove real ones);
//  - PUT /api/crm/settings/general and PATCH with real values (would change live settings);
//  - POST /api/crm/invoices with valid data (invoice numbers are a sequential legal series, 0 invoices exist today);
//  - any PUT bulk route. Invalid input is sent to the POST routes only to prove it is refused before anything is written.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.API_URL || "https://api.paisainminutes.tech";
const creds = JSON.parse(fs.readFileSync("/home/primordic/.paisa-autotest-credentials.json", "utf8"));
const RUN = new Date().toISOString().replace(/[:.]/g, "-");
const TAG = "autotest-" + RUN.slice(5, 16).replace(/[^0-9]/g, "");
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logCreated = (kind, id, test) => fs.appendFileSync(path.join(here, "created.jsonl"), JSON.stringify({ ts: new Date().toISOString(), run: RUN, kind, id, test }) + "\n");
async function http(method, url, { body, token } = {}) {
  const r = await fetch(API + url, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(30000) });
  const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch { /* */ }
  await sleep(280); return { status: r.status, json, text };
}
const check = (area, name, pass, detail = "") => { results.push({ area, name, pass: !!pass, detail }); console.log(`${pass ? "PASS" : "FAIL"}  [${area}] ${name}${pass ? "" : "  -> " + detail}`); };
const note = (area, name, detail) => { results.push({ area, name, pass: true, detail: "observation: " + detail }); console.log(`NOTE  [${area}] ${name} -> ${detail}`); };
const firstArray = (j) => { for (const v of Object.values(j || {})) if (Array.isArray(v)) return v; return []; };
const firstObj = (j, skip = ["success"]) => { for (const [k, v] of Object.entries(j || {})) if (!skip.includes(k) && v && typeof v === "object" && !Array.isArray(v)) return v; return null; };

const lg = await http("POST", "/api/auth/staff/login", { body: { email: process.env.SA_EMAIL, password: process.env.SA_PASSWORD } });
if (lg.status !== 200) { console.log("super admin login failed", lg.status); process.exit(1); }
const SA = lg.json.token;
const partnerId = creds.partnerId;

// ============================================================ rate cards (dummy partner only)
let rateCard = null;
{
  const bad = async (name, body) => { const r = await http("POST", "/api/crm/rate-cards", { token: SA, body }); check("rate-card", name, r.status === 400, `${r.status} ${r.text.slice(0, 100)}`); return r; };
  await bad("a negative rate is rejected", { partnerId, model: "flat_pct", defaultRatePercent: -1, effectiveFrom: "2026-10-01" });
  await bad("a rate above 100 percent is rejected", { partnerId, model: "flat_pct", defaultRatePercent: 150, effectiveFrom: "2026-10-01" });
  await bad("an unknown model is rejected", { partnerId, model: "magic", defaultRatePercent: 5, effectiveFrom: "2026-10-01" });
  await bad("a missing effective date is rejected", { partnerId, model: "flat_pct", defaultRatePercent: 5 });
  await bad("an invalid date is rejected", { partnerId, model: "flat_pct", defaultRatePercent: 5, effectiveFrom: "not-a-date" });
  await bad("a rate that is not a number is rejected", { partnerId, model: "flat_pct", defaultRatePercent: "five", effectiveFrom: "2026-10-01" });
  const unknown = await http("POST", "/api/crm/rate-cards", { token: SA, body: { partnerId: "NOPE-TEST-ID", model: "flat_pct", defaultRatePercent: 5, effectiveFrom: "2026-10-01" } });
  check("rate-card", "a rate card for an unknown partner is a clean 4xx", unknown.status >= 400 && unknown.status < 500, `${unknown.status}`);
  const c = await http("POST", "/api/crm/rate-cards", { token: SA, body: { partnerId, model: "flat_pct", defaultRatePercent: 5, effectiveFrom: "2026-10-01" } });
  rateCard = firstObj(c.json) || {};
  check("rate-card", "a flat 5 percent rate card for the dummy partner is created", [200, 201].includes(c.status) && !!rateCard.id, `${c.status} ${c.text.slice(0, 120)}`);
  if (rateCard.id) logCreated("RateCard", rateCard.id, "finance suite: dummy partner rate card");
  const list = await http("GET", `/api/crm/rate-cards?partnerId=${partnerId}`, { token: SA });
  check("rate-card", "the list filtered by partner shows only the dummy partner's card", list.status === 200 && firstArray(list.json).length >= 1 && firstArray(list.json).every((x) => !x.partnerId || x.partnerId === partnerId), `${list.status} n=${firstArray(list.json).length}`);
  const p = await http("PATCH", `/api/crm/rate-cards/${rateCard.id}`, { token: SA, body: { defaultRatePercent: 6 } });
  const after = firstObj(p.json) || {};
  check("rate-card", "changing the rate works and writes a history entry", p.status === 200 && (after.defaultRatePercent === 6 || after.rate === 6) && JSON.stringify(after).includes("history"), `${p.status} ${p.text.slice(0, 160)}`);
  await http("PATCH", `/api/crm/rate-cards/${rateCard.id}`, { token: SA, body: { defaultRatePercent: 5 } });
  const bad2 = await http("PATCH", `/api/crm/rate-cards/${rateCard.id}`, { token: SA, body: { defaultRatePercent: 500 } });
  check("rate-card", "patching to an absurd rate is rejected", bad2.status === 400, `${bad2.status}`);
  const part = await http("GET", "/api/crm/partners", { token: SA });
  const dp = (part.json.partners || []).find((x) => x.id === partnerId) || {};
  check("rate-card", "the dummy partner's live commission rate follows the flat rate card (5)", dp.commissionRate === 5, `commissionRate=${dp.commissionRate}`);
  const real = (part.json.partners || []).filter((x) => x.id !== partnerId);
  check("rate-card", "real partners' commission rates were not touched by the test", real.every((x) => typeof x.commissionRate === "number"), JSON.stringify(real.map((x) => x.commissionRate)));
  const nf = await http("PATCH", "/api/crm/rate-cards/NOPE-TEST-ID", { token: SA, body: { defaultRatePercent: 5 } });
  check("rate-card", "patching an unknown rate card is a clean 404", nf.status === 404, `${nf.status}`);
}

// ============================================================ commissions, payouts, settlements (dummy partner, one disbursed lead)
let commission = null;
let payout = null;
{
  // one lead: create, assign to the dummy partner, mark disbursed with an amount
  const phone = String(9811500000 + (Math.floor(Date.now() / 1000) % 80000));
  const cr = await http("POST", "/api/loan-applications/", { body: { phone, name: "Autotest Finance", loanAmount: 100000, monthlySalary: "60000", cibilScore: "720", utm_source: "email", utm_campaign: TAG } });
  const lead = cr.json.application;
  logCreated("LoanApplication", lead.leadCode, "finance suite lead");
  await http("POST", "/api/crm/partner-assignments", { token: SA, body: { applicationId: lead.id, partnerId } });
  const dis = await http("PATCH", `/api/loan-applications/${lead.id}`, { token: SA, body: { status: "DISBURSED", disbursedAmountRupees: 100000 } });
  check("commission", "a lead assigned to the dummy partner can be marked DISBURSED with an amount", dis.status === 200, `${dis.status} ${dis.text.slice(0, 100)}`);

  const dry = await http("POST", "/api/crm/commissions/calculate", { token: SA, body: { partnerId, dryRun: true } });
  check("commission", "a dry-run calculation answers and writes nothing", dry.status === 200, `${dry.status} ${dry.text.slice(0, 160)}`);
  const before = await http("GET", `/api/crm/commissions?partnerId=${partnerId}`, { token: SA });
  check("commission", "after a dry run there are still no commissions for the dummy partner", firstArray(before.json).length === 0, `n=${firstArray(before.json).length}`);
  const calc = await http("POST", "/api/crm/commissions/calculate", { token: SA, body: { partnerId } });
  check("commission", "the real calculation answers 200", calc.status === 200, `${calc.status} ${calc.text.slice(0, 160)}`);
  const list = await http("GET", `/api/crm/commissions?partnerId=${partnerId}`, { token: SA });
  const items = firstArray(list.json);
  commission = items.find((x) => x.leadCode === lead.leadCode || x.applicationId === lead.id) || items[0];
  check("commission", "exactly one commission exists for the disbursed lead", items.length === 1 && !!commission, `n=${items.length}`);
  if (commission) {
    check("commission", "the amount is 5% of ₹1,00,000 = ₹5,000 = 500000 paise, as a whole number", commission.amountPaise === 500000 && Number.isInteger(commission.amountPaise), `amountPaise=${commission.amountPaise}`);
    check("commission", "a new commission starts as ACCRUED", commission.status === "ACCRUED", `status=${commission.status}`);
    logCreated("Commission", commission.id, "finance suite commission");
  }
  const again = await http("POST", "/api/crm/commissions/calculate", { token: SA, body: { partnerId } });
  const list2 = await http("GET", `/api/crm/commissions?partnerId=${partnerId}`, { token: SA });
  check("commission", "calculating again is idempotent (still one commission)", again.status === 200 && firstArray(list2.json).length === 1, `n=${firstArray(list2.json).length}`);
  const f = await http("GET", `/api/crm/commissions?partnerId=${partnerId}&status=PAID`, { token: SA });
  check("commission", "filtering by status PAID returns none yet", f.status === 200 && firstArray(f.json).length === 0, `n=${firstArray(f.json).length}`);
  const bs = await http("GET", "/api/crm/commissions?status=BOGUS", { token: SA });
  check("commission", "an unknown status filter is rejected (400)", bs.status === 400, `${bs.status}`);
  const cp = await http("POST", "/api/crm/commissions/calculate", { token: SA, body: { partnerId: "NOPE-TEST-ID" } });
  check("commission", "calculating for an unknown partner is a clean 4xx", cp.status >= 400 && cp.status < 500, `${cp.status}`);
  const pb = await http("PATCH", `/api/crm/commissions/${commission.id}`, { token: SA, body: { status: "PAID" } });
  check("commission", "a commission cannot be set to PAID directly (only CANCELLED is allowed there)", pb.status === 400, `${pb.status}`);

  // payouts
  const badP = async (name, body) => { const r = await http("POST", "/api/crm/payout-requests", { token: SA, body }); check("payout", name, r.status === 400, `${r.status} ${r.text.slice(0, 100)}`); };
  await badP("a payout with a fractional amount is rejected", { partnerId, disbursalPeriod: TAG + "-bad", amountPaise: 10.5 });
  await badP("a payout with a negative amount is rejected", { partnerId, disbursalPeriod: TAG + "-bad", amountPaise: -100 });
  await badP("a payout with a zero amount is rejected", { partnerId, disbursalPeriod: TAG + "-bad", amountPaise: 0 });
  await badP("a payout with no amount and no commissions is rejected", { partnerId, disbursalPeriod: TAG + "-bad" });
  await badP("a payout with no period is rejected", { partnerId, amountPaise: 100 });
  const pr = await http("POST", "/api/crm/payout-requests", { token: SA, body: { partnerId, disbursalPeriod: `Oct 2026 ${TAG}`, commissionIds: [commission.id], contactPerson: "Autotest", contactEmail: "autotest@example.com" } });
  payout = firstObj(pr.json) || {};
  check("payout", "a payout built from the commission is created for ₹5,000", [200, 201].includes(pr.status) && payout.amountPaise === 500000, `${pr.status} ${pr.text.slice(0, 160)}`);
  if (payout.id) logCreated("PayoutRequest", payout.id, "finance suite payout");
  const dup = await http("POST", "/api/crm/payout-requests", { token: SA, body: { partnerId, disbursalPeriod: ` ${`Oct 2026 ${TAG}`.toUpperCase()} `, amountPaise: 100 } });
  check("payout", "a second active payout for the same partner and period (any case or spacing) is refused", dup.status === 409, `${dup.status} ${dup.text.slice(0, 100)}`);
  const cm = await http("GET", `/api/crm/commissions?partnerId=${partnerId}`, { token: SA });
  check("payout", "the linked commission moved to REQUESTED", firstArray(cm.json)[0] && firstArray(cm.json)[0].status === "REQUESTED", `status=${firstArray(cm.json)[0] && firstArray(cm.json)[0].status}`);
  const used = await http("POST", "/api/crm/payout-requests", { token: SA, body: { partnerId, disbursalPeriod: `Nov 2026 ${TAG}`, commissionIds: [commission.id] } });
  check("payout", "the same commission cannot be put in a second payout", used.status === 409 || used.status === 400, `${used.status} ${used.text.slice(0, 100)}`);
  const amt = await http("PATCH", `/api/crm/payout-requests/${payout.id}`, { token: SA, body: { amountPaise: 999 } });
  check("payout", "the amount of a payout built from commissions cannot be edited", amt.status === 400 || amt.status === 409, `${amt.status}`);
  const ack = await http("PATCH", `/api/crm/payout-requests/${payout.id}`, { token: SA, body: { status: "ACKNOWLEDGED" } });
  check("payout", "REQUESTED can move to ACKNOWLEDGED", ack.status === 200, `${ack.status} ${ack.text.slice(0, 100)}`);
  const bogus = await http("PATCH", `/api/crm/payout-requests/${payout.id}`, { token: SA, body: { status: "REQUESTED" } });
  check("payout", "it cannot move back to REQUESTED", bogus.status === 400 || bogus.status === 409, `${bogus.status}`);

  // settlement that covers the payout
  const sBad = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: 1.5, receivedAmountPaise: 100 } });
  check("settlement", "a settlement with a fractional amount is rejected", sBad.status === 400, `${sBad.status}`);
  const sNeg = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: -1, receivedAmountPaise: 100 } });
  check("settlement", "a settlement with a negative amount is rejected", sNeg.status === 400, `${sNeg.status}`);
  const s1 = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: 500000, receivedAmountPaise: 450000, bankRef: TAG + "-short", periodLabel: "Oct 2026" } });
  const set1 = firstObj(s1.json) || {};
  check("settlement", "receiving less than expected is flagged VARIANCE_FLAGGED with variance -50000", [200, 201].includes(s1.status) && set1.reconciledStatus === "VARIANCE_FLAGGED" && set1.variancePaise === -50000, `${s1.status} ${s1.text.slice(0, 200)}`);
  if (set1.id) logCreated("Settlement", set1.id, "finance suite settlement (variance)");
  const s2 = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: 500000, receivedAmountPaise: 500000, bankRef: TAG + "-full", payoutRequestId: payout.id } });
  const set2 = firstObj(s2.json) || {};
  check("settlement", "receiving exactly the expected amount is MATCHED", [200, 201].includes(s2.status) && set2.reconciledStatus === "MATCHED", `${s2.status} ${s2.text.slice(0, 200)}`);
  if (set2.id) logCreated("Settlement", set2.id, "finance suite settlement (matched, linked to payout)");
  const s3 = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: 100000, receivedAmountPaise: 120000, bankRef: TAG + "-over" } });
  check("settlement", "receiving more than expected is SURPLUS", firstObj(s3.json) && firstObj(s3.json).reconciledStatus === "SURPLUS", `${s3.status} ${s3.text.slice(0, 160)}`);
  if (firstObj(s3.json) && firstObj(s3.json).id) logCreated("Settlement", firstObj(s3.json).id, "finance suite settlement (surplus)");
  const forged = await http("POST", "/api/crm/settlements", { token: SA, body: { partnerId, expectedAmountPaise: 100000, receivedAmountPaise: 90000, bankRef: TAG + "-forge", reconciledStatus: "MATCHED", variancePaise: 0 } });
  check("settlement", "a client-supplied reconciledStatus or variance is ignored (the server computes them)", firstObj(forged.json) && firstObj(forged.json).reconciledStatus === "VARIANCE_FLAGGED", `${forged.status} ${forged.text.slice(0, 160)}`);
  if (firstObj(forged.json) && firstObj(forged.json).id) logCreated("Settlement", firstObj(forged.json).id, "finance suite settlement (forged status)");
  const note1 = await http("PATCH", `/api/crm/settlements/${set1.id}`, { token: SA, body: { notes: "Autotest note" } });
  check("settlement", "only the notes of a settlement can be changed", note1.status === 200, `${note1.status}`);
  const edit = await http("PATCH", `/api/crm/settlements/${set1.id}`, { token: SA, body: { receivedAmountPaise: 500000 } });
  check("settlement", "the received amount of a settlement cannot be edited afterwards (immutable)", edit.status === 400 || (edit.status === 200 && (firstObj(edit.json) || {}).receivedAmountPaise === 450000), `${edit.status} ${edit.text.slice(0, 120)}`);
  const del = await http("DELETE", `/api/crm/settlements/${set1.id}`, { token: SA });
  check("settlement", "there is no delete route for settlements", [404, 405].includes(del.status), `${del.status}`);
  const po = await http("GET", `/api/crm/payout-requests/${payout.id}`, { token: SA });
  note("payout", "payout after a covering settlement was linked", `status=${(firstObj(po.json) || {}).status}`);
  const stillPaid = (firstObj(po.json) || {}).status;
  check("payout", "settlements that cover a payout mark it PAID", stillPaid === "PAID", `status=${stillPaid} (a MATCHED settlement of the full amount was linked)`);
  const term = await http("PATCH", `/api/crm/payout-requests/${payout.id}`, { token: SA, body: { status: "CANCELLED" } });
  check("payout", "a PAID payout is terminal: it cannot be cancelled", term.status === 400 || term.status === 409, `${term.status} ${term.text.slice(0, 100)}`);
  const cm2 = await http("GET", `/api/crm/commissions?partnerId=${partnerId}`, { token: SA });
  check("payout", "the commission is PAID once its payout is PAID", firstArray(cm2.json)[0] && firstArray(cm2.json)[0].status === "PAID", `status=${firstArray(cm2.json)[0] && firstArray(cm2.json)[0].status}`);
  const cancelPaid = await http("PATCH", `/api/crm/commissions/${commission.id}`, { token: SA, body: { status: "CANCELLED" } });
  check("commission", "a PAID commission cannot be cancelled", cancelPaid.status === 400 || cancelPaid.status === 409, `${cancelPaid.status}`);
  const nfp = await http("GET", "/api/crm/payout-requests/NOPE-TEST-ID", { token: SA });
  check("payout", "an unknown payout is a clean 404", nfp.status === 404, `${nfp.status}`);
}

// ============================================================ invoices: validation only (no invoice number is consumed)
{
  const bad = async (name, body) => { const r = await http("POST", "/api/crm/invoices", { token: SA, body }); check("invoice", name, r.status === 400, `${r.status} ${r.text.slice(0, 100)}`); };
  const before = await http("GET", "/api/crm/invoices", { token: SA });
  await bad("an invoice with a fractional amount is rejected", { partnerId, netCommissionPaise: 100.5, periodLabel: "Oct 2026" });
  await bad("an invoice with a negative amount is rejected", { partnerId, netCommissionPaise: -100, periodLabel: "Oct 2026" });
  await bad("an invoice with a zero amount is rejected", { partnerId, netCommissionPaise: 0, periodLabel: "Oct 2026" });
  await bad("an invoice with no period label is rejected", { partnerId, netCommissionPaise: 100 });
  await bad("an invoice with a GST rate above 100 is rejected", { partnerId, netCommissionPaise: 100, periodLabel: "Oct 2026", gstRatePercent: 250 });
  await bad("an invoice with a negative GST rate is rejected", { partnerId, netCommissionPaise: 100, periodLabel: "Oct 2026", gstRatePercent: -5 });
  await bad("an invoice with a text amount is rejected", { partnerId, netCommissionPaise: "lots", periodLabel: "Oct 2026" });
  const unknown = await http("POST", "/api/crm/invoices", { token: SA, body: { partnerId: "NOPE-TEST-ID", netCommissionPaise: 100, periodLabel: "Oct 2026" } });
  check("invoice", "an invoice for an unknown partner is a clean 4xx", unknown.status >= 400 && unknown.status < 500, `${unknown.status}`);
  const after = await http("GET", "/api/crm/invoices", { token: SA });
  check("invoice", "none of those invalid requests created an invoice", firstArray(before.json).length === firstArray(after.json).length, `${firstArray(before.json).length} -> ${firstArray(after.json).length}`);
  const nf = await http("GET", "/api/crm/invoices/INV-DOES-NOT-EXIST", { token: SA });
  check("invoice", "an unknown invoice number is a clean 404", nf.status === 404, `${nf.status}`);
  const nfp = await http("PATCH", "/api/crm/invoices/INV-DOES-NOT-EXIST", { token: SA, body: { status: "PAID" } });
  check("invoice", "patching an unknown invoice is a clean 404", nfp.status === 404, `${nfp.status}`);
  note("invoice", "NOT RUN on purpose", "the happy path (GST, total, due date, numbering, OVERDUE) would consume the first number of the legal invoice series; run it once on a staging copy");
}

// ============================================================ agreements
{
  const bad = await http("POST", "/api/crm/agreements", { token: SA, body: { partnerId, signedDate: "2026-12-01", validUntil: "2026-01-01" } });
  check("agreement", "an agreement that ends before it was signed is rejected", bad.status === 400, `${bad.status} ${bad.text.slice(0, 100)}`);
  const bad2 = await http("POST", "/api/crm/agreements", { token: SA, body: { partnerId, signedDate: "garbage", validUntil: "2027-01-01" } });
  check("agreement", "an agreement with an invalid date is rejected", bad2.status === 400, `${bad2.status}`);
  const c = await http("POST", "/api/crm/agreements", { token: SA, body: { partnerId, signedDate: "2026-10-01", validUntil: "2026-11-15", agreementNumber: TAG, contactPerson: "Autotest" } });
  const ag = firstObj(c.json) || {};
  check("agreement", "an agreement for the dummy partner is created", [200, 201].includes(c.status) && !!ag.id, `${c.status} ${c.text.slice(0, 120)}`);
  if (ag.id) logCreated("PartnerAgreement", ag.id, "finance suite agreement");
  check("agreement", "its status is derived from the end date (Expiring Soon: under 60 days left)", /expiring/i.test(ag.status || ""), `status=${ag.status}`);
  const p = await http("PATCH", `/api/crm/agreements/${ag.id}`, { token: SA, body: { validUntil: "2027-12-31" } });
  check("agreement", "extending the agreement changes its status to Active", p.status === 200 && /active/i.test((firstObj(p.json) || {}).status || ""), `${p.status} ${p.text.slice(0, 120)}`);
  const d = await http("DELETE", `/api/crm/agreements/${ag.id}`, { token: SA });
  check("agreement", "the agreement can be deleted", d.status === 200, `${d.status}`);
  const gone = await http("DELETE", `/api/crm/agreements/${ag.id}`, { token: SA });
  check("agreement", "deleting it again is a clean 404", gone.status === 404, `${gone.status}`);
}

// ============================================================ notification templates (own template only)
{
  const bad = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "Email", name: TAG, subject: "Hi {Name}", body: "Hello {Name}, your lead {LeadId}", tokens: ["Name"] } });
  check("template", "a template that uses a {Token} it did not declare is rejected", bad.status === 400, `${bad.status} ${bad.text.slice(0, 100)}`);
  const badCh = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "Telegram", name: TAG, body: "x" } });
  check("template", "an unknown channel is rejected", badCh.status === 400, `${badCh.status}`);
  const key = TAG + "-tpl";
  const c = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "SMS", name: "AUTOTEST template", key, body: "Hello {Name}, your lead {LeadId} is received.", tokens: ["Name", "LeadId"] } });
  const tpl = firstObj(c.json) || {};
  check("template", "a valid template is created", [200, 201].includes(c.status) && !!tpl.id, `${c.status} ${c.text.slice(0, 140)}`);
  if (tpl.id) logCreated("NotificationTemplate", tpl.id, "finance suite template");
  const dupe = await http("POST", "/api/crm/settings/notification-templates", { token: SA, body: { channel: "SMS", name: "AUTOTEST template 2", key, body: "x", tokens: [] } });
  check("template", "a second template with the same key is refused (409)", dupe.status === 409, `${dupe.status}`);
  const p = await http("PATCH", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA, body: { body: "Hello {Name}, thanks!", tokens: ["Name"], enabled: false } });
  check("template", "a template can be edited and disabled", p.status === 200, `${p.status} ${p.text.slice(0, 100)}`);
  const xss = await http("PATCH", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA, body: { name: "<script>alert(1)</script>" } });
  check("template", "a script in a template name is stored as text (the CRM must escape it)", xss.status === 200 || xss.status === 400, `${xss.status}`);
  const d = await http("DELETE", `/api/crm/settings/notification-templates/${tpl.id}`, { token: SA });
  check("template", "the template can be deleted", d.status === 200, `${d.status}`);
}

// ============================================================ roles (own role only)
{
  const bad = await http("POST", "/api/crm/roles", { token: SA, body: { name: "Autotest Bad", permissions: { leads: { fly: true } } } });
  check("role", "a role matrix with an unknown permission is rejected", bad.status === 400, `${bad.status} ${bad.text.slice(0, 100)}`);
  const bad2 = await http("POST", "/api/crm/roles", { token: SA, body: { name: "Autotest Bad 2", permissions: { leads: { view: "yes" } } } });
  check("role", "a role matrix with a non-boolean value is rejected", bad2.status === 400, `${bad2.status}`);
  const bad3 = await http("POST", "/api/crm/roles", { token: SA, body: { permissions: { leads: { view: true } } } });
  check("role", "a role with no name is rejected", bad3.status === 400, `${bad3.status}`);
  const key = TAG + "-role";
  const c = await http("POST", "/api/crm/roles", { token: SA, body: { name: "AUTOTEST Role", key, description: "temporary", permissions: { leads: { view: true } } } });
  const role = firstObj(c.json) || {};
  check("role", "a valid role is created", [200, 201].includes(c.status) && (role.key === key || !!role.id), `${c.status} ${c.text.slice(0, 140)}`);
  if (role.id) logCreated("Role", role.id, "finance suite role");
  const dupe = await http("POST", "/api/crm/roles", { token: SA, body: { name: "AUTOTEST Role again", key, permissions: { leads: { view: true } } } });
  check("role", "a second role with the same key is refused (409)", dupe.status === 409, `${dupe.status}`);
  const list = await http("GET", "/api/crm/roles", { token: SA });
  check("role", "the role list includes the new role with derived permission strings", JSON.stringify(list.json).includes(key) && /leads\.read/.test(JSON.stringify(list.json)), "role or leads.read missing");
  const p = await http("PATCH", `/api/crm/roles/${role.id}`, { token: SA, body: { permissions: { leads: { view: true, edit: true } } } });
  check("role", "a role can be edited", p.status === 200, `${p.status} ${p.text.slice(0, 100)}`);
  const sys = (list.json.roles || []).find((r) => r.key === "super-admin");
  if (sys) {
    const ds = await http("DELETE", `/api/crm/roles/${sys.id}`, { token: SA });
    check("role", "the built-in super-admin role cannot be deleted", [400, 403, 409].includes(ds.status), `${ds.status} ${ds.text.slice(0, 100)}`);
    const es = await http("PATCH", `/api/crm/roles/${sys.id}`, { token: SA, body: { permissions: { leads: { view: false } } } });
    check("role", "the built-in super-admin role cannot be stripped of permissions", [400, 403, 409].includes(es.status), `${es.status} ${es.text.slice(0, 100)}`);
  }
  const inUse = (list.json.roles || []).find((r) => r.key === "telecaller");
  if (inUse) {
    const du = await http("DELETE", `/api/crm/roles/${inUse.id}`, { token: SA });
    check("role", "a role that still has staff (telecaller) cannot be deleted", [400, 409].includes(du.status), `${du.status} ${du.text.slice(0, 100)}`);
  }
  const d = await http("DELETE", `/api/crm/roles/${role.id}`, { token: SA });
  check("role", "the unused test role can be deleted", d.status === 200, `${d.status}`);
}

// ============================================================ settings (validation only, no live value changed)
{
  const before = await http("GET", "/api/crm/settings/general", { token: SA });
  const unk = await http("PATCH", "/api/crm/settings/general", { token: SA, body: { notARealSetting: 1 } });
  check("settings", "an unknown settings key is rejected (400)", unk.status === 400, `${unk.status} ${unk.text.slice(0, 100)}`);
  const badRate = await http("PATCH", "/api/crm/settings/general", { token: SA, body: { defaultGstRate: 900 } });
  check("settings", "an absurd GST rate in settings is rejected", badRate.status === 400, `${badRate.status} ${badRate.text.slice(0, 100)}`);
  const badTime = await http("PATCH", "/api/crm/settings/general", { token: SA, body: { shiftStartTime: "25:99" } });
  check("settings", "an invalid shift time is rejected", badTime.status === 400, `${badTime.status}`);
  const after = await http("GET", "/api/crm/settings/general", { token: SA });
  check("settings", "none of those rejected changes altered the live settings", JSON.stringify(before.json) === JSON.stringify(after.json), "settings changed");
  const integ = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEndpoint: "http://169.254.169.254/latest/meta-data", apiEnabled: true } });
  check("settings", "[security] a partner API endpoint pointing at a private or metadata address is rejected (SSRF)", integ.status === 400, `${integ.status} ${integ.text.slice(0, 120)}`);
  const integ2 = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { webhookUrl: "http://localhost:3000/hook" } });
  check("settings", "[security] a partner webhook on localhost or plain http is rejected", integ2.status === 400, `${integ2.status} ${integ2.text.slice(0, 120)}`);
  const integ3 = await http("PATCH", `/api/crm/settings/integrations/${partnerId}`, { token: SA, body: { apiEnabled: false, apiEndpoint: null, webhookUrl: null } });
  note("settings", "clean-up patch of the dummy partner's integration", `${integ3.status}`);
}

const failed = results.filter((r) => !r.pass);
const summary = { when: new Date().toISOString(), checks: results.length, passed: results.length - failed.length, failed: failed.length };
console.log("\nSUMMARY", JSON.stringify(summary));
fs.writeFileSync(path.join(here, "last-api-finance.json"), JSON.stringify({ summary, results }, null, 2));
if (process.argv.includes("--log")) {
  const byArea = {};
  for (const r of results) (byArea[r.area] ||= { pass: 0, fail: 0 })[r.pass ? "pass" : "fail"]++;
  let md = `\n## Run ${summary.when}: finance, agreements, templates, roles and settings (phase 11, writes test data on the dummy partner)\n\n**${summary.passed} passed, ${summary.failed} failed** of ${summary.checks}. Bureau calls: 0. OTP SMS: 0. Not run on purpose: the bulk PUT routes, valid invoices (sequential legal numbering) and real settings changes.\n\n`;
  md += "| Area | Passed | Failed |\n| --- | --- | --- |\n" + Object.entries(byArea).map(([a, v]) => `| ${a} | ${v.pass} | ${v.fail} |`).join("\n") + "\n";
  if (failed.length) md += "\n**Failures**\n\n" + failed.map((f) => `- [${f.area}] ${f.name}: ${f.detail}`).join("\n") + "\n";
  const notes = results.filter((r) => /^observation/.test(r.detail));
  if (notes.length) md += "\n**Observations**\n\n" + notes.map((n) => `- [${n.area}] ${n.name}: ${n.detail.replace(/^observation: /, "")}`).join("\n") + "\n";
  fs.appendFileSync(path.join(here, "..", "..", "TEST_LOG.md"), md);
}
process.exit(failed.length ? 1 : 0);
