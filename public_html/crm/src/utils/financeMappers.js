/**
 * Converts finance records between the Node server's shape (integer paise, upper-case status constants,
 * server partner ids) and the shape the finance screens render (rupees, display labels, partner slugs).
 * The server stays the source of truth: these helpers only translate units and labels.
 */
import { getPartnerSlugByServerId, getServerPartnerId } from '../data/affiliatePartners.js';

export const toRupees = (paise) => (Number(paise) || 0) / 100;
export const toPaise = (rupees) => Math.round((Number(rupees) || 0) * 100);

const partnerSlug = (serverId) => getPartnerSlugByServerId(serverId) || serverId;
export const serverPartnerId = (uiPartnerId) => getServerPartnerId(uiPartnerId);

const PAYOUT_LABELS = { REQUESTED: 'Requested', ACKNOWLEDGED: 'Acknowledged', PAID: 'Paid', CANCELLED: 'Cancelled' };
const SETTLEMENT_LABELS = { MATCHED: 'Matched', VARIANCE_FLAGGED: 'Variance Flagged', SURPLUS: 'Surplus' };
const INVOICE_LABELS = { UNPAID: 'Unpaid', PAID: 'Paid', OVERDUE: 'Overdue', CANCELLED: 'Cancelled' };

export function payoutFromServer(p) {
  return {
    id: p.payoutCode,
    serverId: p.id,
    partnerId: partnerSlug(p.partnerId),
    partnerName: p.partnerName,
    amount: toRupees(p.amountPaise),
    requestedDate: p.requestedDate,
    status: PAYOUT_LABELS[p.status] || p.status,
    leadsCount: p.leadsCount,
    disbursalPeriod: p.disbursalPeriod,
    invoiceNo: p.invoiceNo || '',
    contactPerson: p.contactPerson || '',
    contactEmail: p.contactEmail || '',
    notes: p.notes || '',
    paidDate: p.paidDate || null
  };
}

export function settlementFromServer(s) {
  return {
    id: s.settlementCode,
    serverId: s.id,
    partnerId: partnerSlug(s.partnerId),
    partnerName: s.partnerName,
    settlementDate: s.settlementDate,
    expectedAmount: toRupees(s.expectedAmountPaise),
    receivedAmount: toRupees(s.receivedAmountPaise),
    variance: toRupees(s.variancePaise),
    bankRef: s.bankRef || '',
    reconciledStatus: SETTLEMENT_LABELS[s.reconciledStatus] || s.reconciledStatus,
    period: s.periodLabel || '',
    notes: s.notes || ''
  };
}

export function invoiceFromServer(i) {
  return {
    invoiceNo: i.invoiceNo,
    serverId: i.id,
    partnerId: partnerSlug(i.partnerId),
    partnerName: i.partnerName,
    period: i.periodLabel || '',
    dateIssued: i.dateIssued,
    dueDate: i.dueDate,
    netCommission: toRupees(i.netCommissionPaise),
    gstRate: i.gstRatePercent,
    gstAmount: toRupees(i.gstAmountPaise),
    totalPayable: toRupees(i.totalPayablePaise),
    status: INVOICE_LABELS[i.status] || i.status,
    paidDate: i.paidDate || null,
    sacCode: i.sacCode,
    description: i.description || ''
  };
}

export function commissionFromServer(c) {
  return {
    id: c.id,
    applicationId: c.applicationId,
    leadCode: c.leadCode,
    partnerId: partnerSlug(c.partnerId),
    partnerName: c.partnerName,
    basis: toRupees(c.basisPaise),
    ratePercent: c.ratePercent,
    amount: toRupees(c.amountPaise),
    status: c.status,
    payoutRequestId: c.payoutRequestId
  };
}

const RATE_MODEL_TO_UI = { flat_pct: 'flat_pct', slab: 'tiered', fixed_per_lead: 'per_lead' };
export const RATE_MODEL_TO_SERVER = { flat_pct: 'flat_pct', tiered: 'slab', per_lead: 'fixed_per_lead' };


export function rateCardFromServer(rc) {
  const model = RATE_MODEL_TO_UI[rc.model] || rc.model;
  const slabs = (rc.slabs || []).map((sl) => ({
    minVolume: toRupees(sl.minVolumePaise),
    maxVolume: sl.maxVolumePaise === null || sl.maxVolumePaise === undefined ? null : toRupees(sl.maxVolumePaise),
    ratePct: sl.ratePercent,
    label: sl.label || ''
  }));
  // The per-lead fee has its own server field (integer paise)
  const perLeadFee = rc.perLeadFeePaise !== null && rc.perLeadFeePaise !== undefined ? toRupees(rc.perLeadFeePaise) : null;
  return {
    id: rc.code,
    serverId: rc.id,
    partnerId: partnerSlug(rc.partnerId),
    partnerName: rc.partnerName,
    model,
    defaultRate: model === 'per_lead' ? (perLeadFee ? `₹${perLeadFee} / lead` : '—') : `${Number(rc.defaultRatePercent).toFixed(1)}%`,
    defaultRatePercent: rc.defaultRatePercent,
    perLeadFee,
    effectiveFrom: rc.effectiveFrom,
    slabs: slabs.map((sl) => ({ ...sl, perLeadFee: model === 'per_lead' ? perLeadFee : undefined })),
    rawSlabs: rc.slabs || [],
    history: (rc.history || []).map((h) => ({
      effectiveFrom: h.effectiveFrom,
      effectiveTo: h.effectiveTo,
      rate: h.model === 'fixed_per_lead' ? 'per lead' : `${Number(h.ratePercent).toFixed(1)}%`,
      model: RATE_MODEL_TO_UI[h.model] || h.model,
      updatedBy: h.updatedBy
    }))
  };
}
