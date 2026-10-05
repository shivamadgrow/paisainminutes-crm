/**
 * Lead data layer for the CRM. Everything goes through the single API client (`apiClient.js`) to the Node
 * server; MongoDB (via that server) is the only source of truth. There are no static-file, CSV or
 * localStorage fallbacks: when the server cannot be reached the caller gets `{ success:false, error }`.
 */

import { formatToIST } from './amountHelpers.js';
import { api, BACKEND_BASE } from './apiClient.js';
import { AFFILIATE_PARTNERS, getServerPartnerId, getPartnerSlugByServerId } from '../data/affiliatePartners.js';

export { BACKEND_BASE };

/**
 * Official CRM Status Stages Enum & Display Mapping
 */
export const CRM_STATUS_STAGES = [
  'FRESH',
  'CALLBACK',
  'INTERESTED',
  'DOCS_RECEIVED',
  'APPROVED',
  'DISBURSED',
  'REJECTED'
];

export const CRM_STATUS_MAP = {
  FRESH: { key: 'FRESH', label: 'Fresh', dot: 'bg-sky-500', classes: 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/80', bg: 'hover:bg-sky-50 text-sky-800' },
  CALLBACK: { key: 'CALLBACK', label: 'Callback', dot: 'bg-amber-500', classes: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80', bg: 'hover:bg-amber-50 text-amber-800' },
  INTERESTED: { key: 'INTERESTED', label: 'Interested', dot: 'bg-purple-500', classes: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80', bg: 'hover:bg-purple-50 text-purple-800' },
  DOCS_RECEIVED: { key: 'DOCS_RECEIVED', label: 'Docs Received', dot: 'bg-indigo-500', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/80', bg: 'hover:bg-indigo-50 text-indigo-800' },
  APPROVED: { key: 'APPROVED', label: 'Approved', dot: 'bg-emerald-500', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80', bg: 'hover:bg-emerald-50 text-emerald-800' },
  DISBURSED: { key: 'DISBURSED', label: 'Disbursed', dot: 'bg-teal-500', classes: 'bg-teal-50 text-teal-700 border-teal-200/80 hover:bg-teal-100/80', bg: 'hover:bg-teal-50 text-teal-800' },
  REJECTED: { key: 'REJECTED', label: 'Rejected', dot: 'bg-rose-500', classes: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/80', bg: 'hover:bg-rose-50 text-rose-800' }
};

/**
 * Normalizes any raw status string (e.g. DRAFT, SUBMITTED, Fresh) into the canonical uppercase CRM enum.
 * The CRM `status` only ever holds the seven values above; partner delivery state ("Contacted",
 * "Redirected", ...) lives in the separate `partnerStatus` field.
 */
export function normalizeStatus(rawStatus) {
  if (!rawStatus) return 'FRESH';
  const clean = String(rawStatus).trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (clean === 'DRAFT' || clean === 'SUBMITTED' || clean === 'FRESH' || clean === 'NEW') return 'FRESH';
  if (clean === 'CALLBACK' || clean === 'CALL_BACK') return 'CALLBACK';
  if (clean === 'INTERESTED') return 'INTERESTED';
  if (clean === 'DOCS_RECEIVED' || clean === 'DOCS' || clean === 'DOCUMENTATION' || clean === 'DOCUMENTS_RECEIVED') return 'DOCS_RECEIVED';
  if (clean === 'APPROVED' || clean === 'SANCTIONED') return 'APPROVED';
  if (clean === 'DISBURSED' || clean === 'DISBURSAL') return 'DISBURSED';
  if (clean === 'REJECTED' || clean === 'NOT_INTERESTED' || clean === 'DECLINED') return 'REJECTED';
  return clean;
}

/**
 * Returns human-readable status display label (e.g. "Docs Received", "Fresh")
 */
export function formatStatusLabel(rawStatus) {
  const norm = normalizeStatus(rawStatus);
  return CRM_STATUS_MAP[norm]?.label || norm;
}

/** Partner delivery states kept by the server in `partnerStatus` (never in `status`). */
export const PARTNER_STATUS_LABELS = {
  NONE: 'Not Assigned',
  ASSIGNED: 'Assigned',
  REDIRECTED: 'Redirected',
  CONTACTED: 'Contacted',
  APPROVED: 'Approved',
  DISBURSED: 'Disbursed',
  REJECTED: 'Rejected'
};

export function formatPartnerStatusLabel(raw) {
  const key = String(raw || 'NONE').toUpperCase();
  return PARTNER_STATUS_LABELS[key] || key;
}

// ---------------------------------------------------------------- lenders (real Lender rows only)

let cachedLendersList = [];

/**
 * Real lenders from `GET /api/lenders`. A lender id is only ever a Lender table id, never a partner slug.
 */
export async function getLendersFromBackend() {
  const res = await api('/api/lenders', { auth: false });
  if (res.ok && res.data) {
    const list = Array.isArray(res.data) ? res.data : res.data.lenders || [];
    if (Array.isArray(list)) cachedLendersList = list;
  }
  return cachedLendersList;
}

/**
 * Resolves human-readable lender name for a given lender ID
 */
export function resolveLenderName(lenderId) {
  if (!lenderId) return null;
  const str = String(lenderId).trim();
  const found = cachedLendersList.find(l => String(l.id) === str);
  return found ? found.name : null;
}

/**
 * Masks PAN: the server already returns `ABCDE****F`; anything else is masked here. Raw PAN values must
 * never be logged or displayed in the UI.
 */
export function maskPan(rawPan) {
  if (!rawPan) return '—';
  const clean = String(rawPan).trim().toUpperCase();
  if (clean.includes('*')) return clean;
  if (clean.length === 10) {
    return `${clean.slice(0, 5)}****${clean.slice(-1)}`;
  }
  return clean ? `${clean.slice(0, 2)}*****` : '—';
}

/**
 * Formats a date into ISO YYYY-MM-DD
 */
export function formatIsoDate(val) {
  if (!val) return null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed.includes('T')) {
      const p = trimmed.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
    }
    // DD/MM/YYYY or DD-MM-YYYY
    const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (dmy) {
      const dd = dmy[1].padStart(2, '0');
      const mm = dmy[2].padStart(2, '0');
      const yyyy = dmy[3];
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

/**
 * Coerces numeric inputs safely
 */
export function coerceNumber(val) {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') return isNaN(val) ? undefined : val;
  const clean = String(val).replace(/[^0-9.]/g, '');
  if (!clean) return undefined;
  const num = parseFloat(clean);
  return isNaN(num) ? undefined : num;
}

/**
 * Coerces boolean inputs safely
 */
export function coerceBoolean(val) {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).trim().toLowerCase();
  if (['true', 'yes', '1', 'y'].includes(s)) return true;
  if (['false', 'no', '0', 'n'].includes(s)) return false;
  return undefined;
}

/**
 * Validates CIBIL score is a number between 300 and 900
 */
export function coerceCibilScore(val) {
  if (val === undefined || val === null || val === '' || val === '—') return undefined;
  let num = typeof val === 'number' ? val : null;
  if (num === null && typeof val === 'string') {
    const match = val.match(/(\d{3})/);
    if (match) {
      num = parseInt(match[1], 10);
    }
  }
  if (typeof num === 'number' && !isNaN(num) && num >= 300 && num <= 900) {
    return num;
  }
  return undefined;
}

/**
 * Validates PAN structure without logging
 */
export function sanitizePan(val) {
  if (!val || typeof val !== 'string') return undefined;
  const clean = val.trim().toUpperCase();
  if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean)) {
    return clean;
  }
  return undefined;
}

/**
 * Builds the canonical camelCase payload for POST /api/loan-applications (CRM "add lead" forms).
 * Only fields that exist in the form are sent; nothing is invented.
 */
export function buildLeadPayload(input = {}) {
  if (!input || typeof input !== 'object') return {};

  const payload = {};

  const rawName = input.applicantName ?? input.fullName ?? input.name;
  if (rawName && typeof rawName === 'string' && rawName.trim()) {
    payload.applicantName = rawName.trim();
    payload.name = payload.applicantName;
  }

  const rawPhone = input.phone ?? input.phoneNumber ?? input.mobile;
  if (rawPhone) {
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length === 10) {
      payload.phone = `+91${cleanPhone}`;
      payload.phoneNumber = cleanPhone;
      payload.mobile = cleanPhone;
    }
  }

  const rawEmail = input.email ?? input.emailAddress;
  if (rawEmail && typeof rawEmail === 'string' && rawEmail.trim() && rawEmail.includes('@')) {
    payload.email = rawEmail.trim();
  }

  const amountVal = coerceNumber(input.amount ?? input.loan_amount ?? input.loanAmount ?? input.applied);
  if (amountVal !== undefined && amountVal > 0) {
    payload.amount = amountVal;
  }

  const tenureVal = coerceNumber(input.tenureMonths ?? input.tenure);
  if (tenureVal !== undefined && tenureVal > 0) {
    payload.tenureMonths = tenureVal;
  }

  const rawPurpose = input.purpose ?? input.loanPurpose;
  if (rawPurpose && typeof rawPurpose === 'string' && rawPurpose.trim()) {
    payload.purpose = rawPurpose.trim();
  }

  const incomeVal = coerceNumber(input.monthlyIncome ?? input.salary ?? input.monthlySalary ?? input.monthly_salary);
  if (incomeVal !== undefined && incomeVal > 0) {
    payload.monthlyIncome = incomeVal;
  }

  const empVal = input.employmentType ?? input.employment_type ?? input.empType;
  if (empVal && typeof empVal === 'string' && empVal.trim()) {
    payload.employmentType = empVal.trim();
  }

  const compVal = input.companyName ?? input.company_name ?? input.company;
  if (compVal && typeof compVal === 'string' && compVal.trim() && compVal !== '—') {
    payload.companyName = compVal.trim();
  }

  const modeVal = input.salaryMode ?? input.mode_of_salary ?? input.modeOfSalary;
  if (modeVal && typeof modeVal === 'string' && modeVal.trim() && modeVal !== '—') {
    payload.salaryMode = modeVal.trim();
  }

  if (input.city && typeof input.city === 'string' && input.city.trim() && input.city !== '—') {
    payload.city = input.city.trim();
  }

  if (input.state && typeof input.state === 'string' && input.state.trim() && input.state !== '—') {
    payload.state = input.state.trim();
  }

  const rawPin = input.pincode ?? input.pinCode ?? input.pin;
  if (rawPin) {
    const cleanPin = String(rawPin).replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length === 6) {
      payload.pincode = cleanPin;
    }
  }

  const rawDob = input.dob ?? input.dateOfBirth ?? input.date_of_birth;
  const isoDob = formatIsoDate(rawDob);
  if (isoDob) {
    payload.dob = isoDob;
  }

  const rawGender = input.gender ?? input.sex;
  if (rawGender && typeof rawGender === 'string' && rawGender.trim() && rawGender !== '—') {
    payload.gender = rawGender.trim();
  }

  const ccBool = coerceBoolean(input.haveCreditCard ?? input.have_credit_card ?? input.hasCreditCard);
  if (ccBool !== undefined) {
    payload.haveCreditCard = ccBool;
  }

  const ccLimit = coerceNumber(input.creditCardLimit ?? input.credit_card_limit);
  if (ccLimit !== undefined) {
    payload.creditCardLimit = ccLimit;
  }

  const rawUtm = input.utmSource ?? input.utm_source;
  if (rawUtm && typeof rawUtm === 'string' && rawUtm.trim() && rawUtm !== 'null' && rawUtm !== 'undefined') {
    payload.utmSource = rawUtm.trim();
  }

  const rawLeadSource = input.leadSource ?? input.lead_source ?? input.source;
  if (rawLeadSource && typeof rawLeadSource === 'string' && rawLeadSource.trim()) {
    payload.leadSource = rawLeadSource.trim();
  }

  const validPan = sanitizePan(input.pan ?? input.panNumber ?? input.pan_card);
  if (validPan) {
    payload.pan = validPan;
  }

  const cibil = coerceCibilScore(input.cibilScore ?? input.cibil);
  if (cibil !== undefined) {
    payload.cibilScore = cibil;
  }

  return payload;
}

const PLACEHOLDER_COMPANY = ['pending selection', 'pending details', 'unassigned', '—', '', 'null', 'undefined'];

/**
 * Display name of whoever the lead is assigned to. Strict rule: never guess or auto-route.
 * Assigned partner (real `assignedPartnerId`) first, then a real lender, otherwise 'Pending Selection'.
 */
export function resolveAssignedCompany(item) {
  if (!item) return 'Pending Selection';
  if (item.assignedPartnerId) {
    const slug = getPartnerSlugByServerId(item.assignedPartnerId);
    const partner = slug ? AFFILIATE_PARTNERS.find((p) => p.id === slug) : null;
    if (partner) return partner.name;
  }
  if (item.selectedLenderId) {
    const name = resolveLenderName(item.selectedLenderId);
    if (name) return name;
  }
  return 'Pending Selection';
}

/**
 * Map a lead returned by the Node server (`/api/loan-applications/*`) into the CRM's lead shape.
 * Nothing is enriched from static files or browser storage: what the server returns is what is shown.
 */
export function mapBackendLead(item, index = 0) {
  if (!item) return null;
  // A partner user receives a masked number (XXXXXX1234) until the applicant has been redirected / worked
  const phoneText = String(item.phone || item.phoneNumber || item.mobile || '');
  const phoneMasked = /x/i.test(phoneText);
  const rawPhone = phoneMasked ? phoneText.toUpperCase() : phoneText.replace(/\D/g, '').slice(-10);
  if (!rawPhone || (!phoneMasked && rawPhone.length < 10)) return null;

  const formattedMobile = phoneMasked ? rawPhone : `+91 ${rawPhone}`;
  const rawName = String(item.applicantName || item.name || 'Applicant').trim() || 'Applicant';
  const initials = rawName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2) || (rawName !== 'Applicant' ? rawName.slice(0, 2).toUpperCase() : 'AP');

  const displayId = String(item.leadCode || item.displayId || `PIM-${rawPhone.slice(-4)}-${index}`);

  const cleanLoan = Number(item.loanAmountRupees ?? item.amount) || 0;
  const cleanSalary = Number(item.monthlyIncome) || 0;

  const rawCibil = item.cibilScore !== undefined && item.cibilScore !== null ? Number(item.cibilScore) : null;
  const isValidCibil = typeof rawCibil === 'number' && !isNaN(rawCibil) && rawCibil > 0;
  const cibilScore = isValidCibil ? rawCibil : null;
  const cibilDisplay = isValidCibil ? String(cibilScore) : 'Not Available';

  const city = item.city && item.city !== '—' ? String(item.city).trim() : null;
  const state = item.state && item.state !== '—' ? String(item.state).trim() : null;
  const pincode = item.pincode && item.pincode !== '—' ? String(item.pincode).trim() : null;

  let locationDisplay = 'Online';
  if (city && pincode) locationDisplay = `${city} · ${pincode}`;
  else if (city && state) locationDisplay = `${city}, ${state}`;
  else if (city) locationDisplay = city;
  else if (state) locationDisplay = state;
  else if (pincode) locationDisplay = `PIN: ${pincode}`;

  // channel is derived on the server from the visitor's own UTM / click id / referrer; leads created before
  // channel tracking have none and are shown as "Legacy" instead of a guessed source.
  const channel = item.channel ? String(item.channel).trim() : null;
  const rawSource = String(item.leadSource || item.utmSource || item.source || '').trim();
  const source = channel || rawSource || 'Website Application';

  const statusKey = normalizeStatus(item.status);
  const statusLabel = formatStatusLabel(item.status);
  const partnerStatus = String(item.partnerStatus || 'NONE').toUpperCase();

  const selectedLenderId = item.selectedLenderId ? String(item.selectedLenderId) : null;
  const assignedPartnerId = item.assignedPartnerId ? String(item.assignedPartnerId) : null;
  const partnerSlug = assignedPartnerId ? getPartnerSlugByServerId(assignedPartnerId) : null;
  const assignedCompany = resolveAssignedCompany(item);
  const wasClicked = ['REDIRECTED', 'CONTACTED', 'APPROVED', 'DISBURSED', 'REJECTED'].includes(partnerStatus);

  const panMasked = item.panMasked ? maskPan(item.panMasked) : '—';
  const haveCreditCardBool = item.haveCreditCard === true;
  const ccLimit = item.creditCardLimit !== null && item.creditCardLimit !== undefined && !isNaN(Number(item.creditCardLimit))
    ? Number(item.creditCardLimit)
    : null;
  const dobFormatted = item.dob ? String(item.dob).split('T')[0] : '—';
  const isPhoneOnly = (rawName === 'Applicant') && cleanLoan === 0 && cleanSalary === 0;
  const createdIso = item.createdAt || null;
  const ist = createdIso ? formatToIST(createdIso) : { full: '—', time: '—', date: '—' };

  return {
    id: String(item.id),
    displayId,
    loanNo: displayId,
    lead_id: displayId,
    leadCode: displayId,
    applicantName: rawName,
    name: rawName,
    fullName: rawName,
    initials,
    avatarBg: 'bg-[#0A3977]',
    mobile: formattedMobile,
    phone: rawPhone,
    phoneNumber: rawPhone,
    phoneMasked,
    email: item.email ? String(item.email).trim() : '',
    emailAddress: item.email ? String(item.email).trim() : '',
    userId: item.userId || null,
    city,
    state,
    pincode,
    location: locationDisplay,
    applied: cleanLoan,
    amount: cleanLoan,
    loanAmount: cleanLoan,
    disbursedAmount: Number(item.disbursedAmountRupees) || 0,
    disbursedAmountRupees: item.disbursedAmountRupees ?? null,
    tenureMonths: Number(item.tenureMonths) || 12,
    purpose: item.purpose || 'Personal Loan',
    employmentType: item.employmentType || '—',
    monthlyIncome: cleanSalary,
    salary: cleanSalary,
    monthlySalary: cleanSalary,
    source,
    channel,
    leadSource: item.leadSource || null,
    utmSource: item.utmSource || null,
    utmMedium: item.utmMedium || null,
    utmCampaign: item.utmCampaign || null,
    utmTerm: item.utmTerm || null,
    utmContent: item.utmContent || null,
    entryPoint: item.entryPoint || null,
    landingPage: item.landingPage || null,
    firstChannel: item.firstChannel || null,
    cibilScore,
    cibilScoreUpdatedAt: item.cibilScoreUpdatedAt || null,
    cibil: cibilDisplay,
    cibilDisplay,
    cibilStatus: item.cibilStatus || null,
    slab: item.slab ?? null,
    eligibility: item.eligibility || null,
    cibilRange: item.cibilRange || null,
    salaryRange: item.salaryRange || null,
    selectedLenderId,
    lenderApplicationId: item.lenderApplicationId || null,
    assignedPartnerId,
    assignedPartnerSlug: partnerSlug,
    partnerStatus,
    partnerStatusLabel: formatPartnerStatusLabel(partnerStatus),
    remarks: item.remarks || '',
    partnerRemarks: item.partnerRemarks || '',
    suggestedCompany: item.assignedCompany || null,
    assignedCompany,
    appliedTo: wasClicked ? assignedCompany : 'Not Applied Yet',
    delivery_status: assignedPartnerId ? 'delivered' : 'none',
    panVerificationStatus: item.panVerificationStatus || 'PENDING',
    kycStatus: item.kycStatus || 'PENDING',
    eligibilityStatus: isPhoneOnly ? 'Incomplete / Phone Only' : (item.eligibility || 'Eligible'),
    isPhoneOnly,
    status: statusKey,
    statusLabel,
    created: ist.full,
    created_at: createdIso,
    created_time: ist.time,
    date: ist.date,
    updatedAt: item.updatedAt || createdIso,
    panMasked,
    pan: panMasked, // always masked, never raw
    dob: dobFormatted,
    dateOfBirth: dobFormatted,
    gender: item.gender || null,
    addressType: null,
    salaryMode: item.salaryMode || null,
    modeOfSalary: item.salaryMode || null,
    mode_of_salary: item.salaryMode || null,
    companyName: item.companyName || null,
    company_name: item.companyName || null,
    haveCreditCard: haveCreditCardBool ? 'Yes' : 'No',
    haveCreditCardBool,
    creditCardLimit: ccLimit
  };
}

/**
 * Submit a lead from a CRM "add lead" form to the public intake route.
 */
export async function submitLoanApplication(rawInput = {}) {
  const payload = buildLeadPayload(rawInput);
  const res = await api('/api/loan-applications', { method: 'POST', auth: false, body: payload });
  if (res.ok && res.data) {
    return { success: true, status: res.status, data: res.data, lead: mapBackendLead(res.data.application || res.data.lead) };
  }
  return { success: false, status: res.status, error: res.error || 'Failed to submit loan application', data: res.data };
}

/**
 * Loads every lead the signed-in account may see. Pages through `GET /api/loan-applications/all`
 * (max 500 per page) until `total` is reached. A PARTNER account is scoped by the server; a staff
 * account may pass `partnerId` (a UI partner slug) to view one partner's leads.
 */
export async function getLeadsFromBackend(options = {}) {
  const query = { limit: 500 };
  if (options.partnerId) {
    const serverId = getServerPartnerId(options.partnerId);
    if (serverId) query.partnerId = serverId;
  }
  ['status', 'partnerStatus', 'from', 'to', 'q'].forEach((key) => {
    if (options[key]) query[key] = options[key];
  });

  const all = [];
  let page = 1;
  let total = null;
  const MAX_PAGES = 200;
  while (page <= MAX_PAGES) {
    const res = await api('/api/loan-applications/all', { query: { ...query, page } });
    if (!res.ok) {
      return { success: false, leads: [], count: 0, status: res.status, error: res.error };
    }
    const batch = Array.isArray(res.data?.applications) ? res.data.applications : [];
    total = typeof res.data?.total === 'number' ? res.data.total : total;
    all.push(...batch);
    if (batch.length === 0 || total === null || all.length >= total) break;
    page += 1;
  }

  const leads = all.map((item, idx) => mapBackendLead(item, idx)).filter(Boolean);
  return { success: true, count: leads.length, total: total ?? leads.length, leads };
}

const STAFF_UPDATE_FIELDS = ['status', 'selectedLenderId', 'lenderApplicationId', 'assignedPartnerId', 'remarks', 'loanAmountRupees', 'disbursedAmountRupees'];
const PARTNER_UPDATE_FIELDS = ['partnerStatus', 'partnerRemarks', 'disbursedAmountRupees'];

/**
 * PATCH /api/loan-applications/{id}. Only fields on the shared allowlist are sent; the server decides
 * the actor, role and time from the token. `role` selects which allowlist applies ('partner' | 'staff').
 */
export async function updateLoanApplication(id, updates = {}, { role = 'staff' } = {}) {
  if (!id) return { success: false, error: 'Application ID is required' };
  const allowed = role === 'partner' ? PARTNER_UPDATE_FIELDS : STAFF_UPDATE_FIELDS;
  const payload = {};
  allowed.forEach((key) => {
    if (updates[key] !== undefined) payload[key] = updates[key];
  });
  if (payload.status !== undefined) payload.status = normalizeStatus(payload.status);
  if (payload.partnerStatus !== undefined) payload.partnerStatus = String(payload.partnerStatus).toUpperCase();
  if (Object.keys(payload).length === 0) return { success: false, error: 'Nothing to update' };

  const res = await api(`/api/loan-applications/${encodeURIComponent(String(id).trim())}`, { method: 'PATCH', body: payload });
  if (res.ok) {
    const lead = mapBackendLead(res.data?.application);
    return { success: true, status: res.status, data: res.data?.application, lead };
  }
  return { success: false, status: res.status, error: res.error || 'Failed to update application', data: res.data };
}

/**
 * GET /api/loan-applications/phone/{phone}: all applications for a number, newest first.
 * `data` is the newest one for convenience; `applications` has all of them.
 */
export async function fetchLoanApplicationByPhone(phone) {
  if (!phone) return { success: false, error: 'Phone number is required' };
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) return { success: false, error: 'Valid 10-digit phone number is required' };

  const res = await api(`/api/loan-applications/phone/${encodeURIComponent(cleanPhone)}`);
  if (!res.ok) return { success: false, status: res.status, error: res.error };
  const applications = (Array.isArray(res.data?.applications) ? res.data.applications : [])
    .map((item, idx) => mapBackendLead(item, idx))
    .filter(Boolean);
  return { success: true, applications, data: applications[0] || null };
}

/**
 * Deletes leads on the server. Local state must only be changed after `success`.
 *  - payload.ids (array of lead ids) -> bulk delete with confirmation
 *  - payload.id / leadId                -> single delete
 *  - payload.clear_all                  -> delete everything (server requires the confirmation phrase)
 */
export async function deleteLeadsApi(payload = {}) {
  const isClearAll = Boolean(payload.clear_all || payload.all || payload.action === 'reset_all' || payload.action === 'clear_all');
  if (isClearAll) {
    const res = await api('/api/loan-applications/all', { method: 'DELETE', body: { confirm: 'DELETE_ALL_LEADS' } });
    return { success: res.ok, is_clear_all: true, error: res.error, deletedCount: res.data?.deletedCount };
  }

  const ids = [];
  if (payload.id) ids.push(String(payload.id));
  if (Array.isArray(payload.ids)) payload.ids.forEach((i) => i && ids.push(String(i)));
  const unique = [...new Set(ids)];
  if (unique.length === 0) return { success: false, error: 'No lead id supplied' };

  if (unique.length === 1) {
    const res = await api(`/api/loan-applications/${encodeURIComponent(unique[0])}`, { method: 'DELETE' });
    return { success: res.ok, error: res.error, deletedIds: res.ok ? [unique[0]] : [] };
  }
  const res = await api('/api/loan-applications', { method: 'DELETE', body: { ids: unique, confirm: true } });
  return { success: res.ok, error: res.error, deletedIds: res.data?.deletedIds || [], notFound: res.data?.notFound || [] };
}
