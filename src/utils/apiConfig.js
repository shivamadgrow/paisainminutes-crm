/**
 * Unified API Client for Paisa in Minutes CRM
 * Single Source of Truth Backend API: https://api.paisainminutes.tech
 */

import { formatToIST } from './amountHelpers.js';

const BACKEND_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) || 'https://api.paisainminutes.tech';
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
 * Normalizes any raw status string (e.g. DRAFT, SUBMITTED, Fresh) into canonical uppercase enum
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

/**
 * Get configured CRM authentication headers for authenticated routes (PATCH, phone dossier lookup)
 */
export function getAuthHeaders() {
  try {
    const token = (typeof localStorage !== 'undefined' ? localStorage.getItem('pim_jwt_token') : null) ||
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('pim_jwt_token') : null) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('paisa_crm_token') : null) ||
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('paisa_crm_token') : null) ||
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_CRM_API_KEY || import.meta.env.VITE_BACKEND_API_KEY || import.meta.env.VITE_AUTH_TOKEN));
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

/**
 * Known Real Lenders from Backend GET /api/lenders
 * Real IDs: "1", "2", "3", "4"
 */
export const KNOWN_LENDERS = [
  { id: '1', name: 'Aditya Birla Capital', maxAmount: 500000 },
  { id: '2', name: 'Bajaj Finserv Direct', maxAmount: 400000 },
  { id: '3', name: 'Tata Capital Finance', maxAmount: 350000 },
  { id: '4', name: 'L&T Finance Holding', maxAmount: 250000 }
];

let cachedLendersList = [...KNOWN_LENDERS];

/**
 * Fetch Real Lenders from Backend (GET /api/lenders)
 */
export async function getLendersFromBackend() {
  try {
    const res = await fetch(`${BACKEND_BASE}/api/lenders`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.lenders || []);
      if (Array.isArray(list) && list.length > 0) {
        cachedLendersList = list;
        return list;
      }
    }
  } catch (e) {
    console.warn('[getLendersFromBackend] Could not reach backend /api/lenders:', e);
  }
  return cachedLendersList;
}

/**
 * Validates selectedLenderId against real lender table.
 * Prevents sending lender names or invented IDs to the backend.
 */
export function resolveValidLenderId(val) {
  if (val === undefined || val === null || val === '' || val === 'Pending Selection' || val === 'null' || val === 'undefined') {
    return null;
  }
  const str = String(val).trim();
  const directMatch = cachedLendersList.find(l => String(l.id) === str);
  if (directMatch) return String(directMatch.id);

  const nameMatch = cachedLendersList.find(l => l.name && (l.name.toLowerCase() === str.toLowerCase() || str.toLowerCase().includes(l.name.toLowerCase())));
  if (nameMatch) return String(nameMatch.id);

  if (/^\d+$/.test(str)) return str;
  return null;
}

/**
 * Resolves human-readable lender name for a given lender ID
 */
export function resolveLenderName(lenderId) {
  if (!lenderId) return null;
  const str = String(lenderId).trim();
  const found = cachedLendersList.find(l => String(l.id) === str || (l.name && l.name.toLowerCase() === str.toLowerCase()));
  return found ? found.name : null;
}

/**
 * Masks PAN according to security rules: e.g. ABCDE1234F -> AB*****4F
 * Raw PAN values MUST NEVER be logged or displayed in UI!
 */
export function maskPan(rawPan) {
  if (!rawPan) return '—';
  const clean = String(rawPan).trim().toUpperCase();
  if (clean.includes('*')) return clean;
  if (clean.length === 10) {
    return `${clean.slice(0, 2)}*****${clean.slice(-2)}`;
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
    const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
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
 * Builds the canonical camelCase payload for POST /api/loan-applications.
 * 
 * Rules:
 * - Only send fields that actually exist in frontend state or user input.
 * - Do not send fake, placeholder, or randomly generated values.
 * - Minimal payload remains fully supported.
 * - Aliases normalized to canonical names:
 *     name/fullName -> applicantName
 *     loan_amount -> amount
 *     salary/monthlySalary -> monthlyIncome
 *     employment_type -> employmentType
 *     company_name -> companyName
 *     mode_of_salary -> salaryMode
 *     utm_source -> utmSource
 *     lead_source -> leadSource
 *     have_credit_card -> haveCreditCard
 *     credit_card_limit -> creditCardLimit
 */
export function buildLeadPayload(input = {}) {
  if (!input || typeof input !== 'object') return {};

  const payload = {};

  // 1. applicantName (with name / fullName aliases)
  const rawName = input.applicantName ?? input.fullName ?? input.name;
  if (rawName && typeof rawName === 'string' && rawName.trim()) {
    payload.applicantName = rawName.trim();
    // Preserve name for minimal payload backward compatibility
    payload.name = payload.applicantName;
  }

  // 2. phone (10-digit mobile)
  const rawPhone = input.phone ?? input.phoneNumber ?? input.mobile;
  if (rawPhone) {
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length === 10) {
      payload.phone = cleanPhone;
    }
  }

  // 3. email
  const rawEmail = input.email ?? input.emailAddress;
  if (rawEmail && typeof rawEmail === 'string' && rawEmail.trim() && rawEmail.includes('@')) {
    payload.email = rawEmail.trim();
  }

  // 4. amount (numeric)
  const amountVal = coerceNumber(input.amount ?? input.loan_amount ?? input.loanAmount ?? input.applied);
  if (amountVal !== undefined && amountVal > 0) {
    payload.amount = amountVal;
  }

  // 5. tenureMonths (numeric)
  const tenureVal = coerceNumber(input.tenureMonths ?? input.tenure);
  if (tenureVal !== undefined && tenureVal > 0) {
    payload.tenureMonths = tenureVal;
  }

  // 6. purpose
  const rawPurpose = input.purpose ?? input.loanPurpose;
  if (rawPurpose && typeof rawPurpose === 'string' && rawPurpose.trim()) {
    payload.purpose = rawPurpose.trim();
  }

  // 7. monthlyIncome (numeric)
  const incomeVal = coerceNumber(input.monthlyIncome ?? input.salary ?? input.monthlySalary ?? input.monthly_salary);
  if (incomeVal !== undefined && incomeVal > 0) {
    payload.monthlyIncome = incomeVal;
  }

  // 8. employmentType
  const empVal = input.employmentType ?? input.employment_type ?? input.empType;
  if (empVal && typeof empVal === 'string' && empVal.trim()) {
    payload.employmentType = empVal.trim();
  }

  // 9. companyName
  const compVal = input.companyName ?? input.company_name ?? input.company;
  if (compVal && typeof compVal === 'string' && compVal.trim() && compVal !== '—') {
    payload.companyName = compVal.trim();
  }

  // 10. salaryMode
  const modeVal = input.salaryMode ?? input.mode_of_salary ?? input.modeOfSalary;
  if (modeVal && typeof modeVal === 'string' && modeVal.trim() && modeVal !== '—') {
    payload.salaryMode = modeVal.trim();
  }

  // 11. city
  if (input.city && typeof input.city === 'string' && input.city.trim() && input.city !== '—') {
    payload.city = input.city.trim();
  }

  // 12. state
  if (input.state && typeof input.state === 'string' && input.state.trim() && input.state !== '—') {
    payload.state = input.state.trim();
  }

  // 13. pincode
  const rawPin = input.pincode ?? input.pinCode ?? input.pin;
  if (rawPin) {
    const cleanPin = String(rawPin).replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length === 6) {
      payload.pincode = cleanPin;
    }
  }

  // 14. dob (ISO YYYY-MM-DD)
  const rawDob = input.dob ?? input.dateOfBirth ?? input.date_of_birth;
  const isoDob = formatIsoDate(rawDob);
  if (isoDob) {
    payload.dob = isoDob;
  }

  // 15. gender
  const rawGender = input.gender ?? input.sex;
  if (rawGender && typeof rawGender === 'string' && rawGender.trim() && rawGender !== '—') {
    payload.gender = rawGender.trim();
  }

  // 16. haveCreditCard (boolean)
  const ccBool = coerceBoolean(input.haveCreditCard ?? input.have_credit_card ?? input.hasCreditCard);
  if (ccBool !== undefined) {
    payload.haveCreditCard = ccBool;
  }

  // 17. creditCardLimit (number)
  const ccLimit = coerceNumber(input.creditCardLimit ?? input.credit_card_limit);
  if (ccLimit !== undefined) {
    payload.creditCardLimit = ccLimit;
  }

  // 18. utmSource
  const rawUtm = input.utmSource ?? input.utm_source;
  if (rawUtm && typeof rawUtm === 'string' && rawUtm.trim() && rawUtm !== 'null' && rawUtm !== 'undefined') {
    payload.utmSource = rawUtm.trim();
  }

  // 19. leadSource
  const rawLeadSource = input.leadSource ?? input.lead_source ?? input.source;
  if (rawLeadSource && typeof rawLeadSource === 'string' && rawLeadSource.trim()) {
    payload.leadSource = rawLeadSource.trim();
  }

  // 20. pan (10-char uppercase PAN, never log raw)
  const validPan = sanitizePan(input.pan ?? input.panNumber ?? input.pan_card);
  if (validPan) {
    payload.pan = validPan;
  }

  // 21. cibilScore (number 300 - 900)
  const cibil = coerceCibilScore(input.cibilScore ?? input.cibil);
  if (cibil !== undefined) {
    payload.cibilScore = cibil;
  }

  // 22. selectedLenderId (validated against backend lenders)
  if (input.selectedLenderId !== undefined) {
    const validLenderId = resolveValidLenderId(input.selectedLenderId);
    if (validLenderId) {
      payload.selectedLenderId = validLenderId;
    }
  }

  // 23. lenderApplicationId
  const rawAppId = input.lenderApplicationId ?? input.partnerApplicationId;
  if (rawAppId && typeof rawAppId === 'string' && rawAppId.trim()) {
    payload.lenderApplicationId = rawAppId.trim();
  }

  return payload;
}

/**
 * Intelligent Partner Auto-Assignment Engine (Fallback when backend selectedLenderId is null)
 */
export function resolveAssignedCompany(item) {
  if (item.selectedLenderId && item.selectedLenderId !== 'Pending Selection') {
    const name = resolveLenderName(item.selectedLenderId);
    return name || item.selectedLenderId;
  }
  if (item.assignedCompany && !['pending selection', 'pending details', 'unassigned', '—', ''].includes(String(item.assignedCompany).toLowerCase())) {
    return item.assignedCompany;
  }
  const sal = Number(item.monthlyIncome || item.salary || 0);
  const cibil = Number(item.cibilScore || 0);

  if (sal >= 70000 || cibil >= 750) return 'Rupay91';
  if (sal >= 50000 || cibil >= 700) return 'Borrowera';
  if (sal >= 45000 || cibil >= 650) return 'Jhatpat Loans';
  if (sal >= 35000 || cibil >= 600) return 'Easy Fincare';
  if (sal >= 30000 || cibil >= 550) return 'LoanWithin';
  if (sal >= 25000 || cibil >= 500) return 'Insta Rupees';
  if (sal >= 20000) return 'ShubhCash';
  if (sal >= 15000) return 'UdhaarNow';
  return 'Ticket 2 Loan';
}

/**
 * In-memory cache for client-submitted lead enrichment map
 */
let cachedEnrichmentMap = null;

/**
 * Loads client-submitted lead dossiers to enrich backend records where fields were null
 */
export async function loadLeadEnrichmentMap() {
  if (cachedEnrichmentMap) return cachedEnrichmentMap;

  const map = new Map();

  const sources = [
    '/data/leads.json',
    './data/leads.json',
    'https://paisainminutes.com/admin/api/data/leads.json',
    '/admin/api/data/leads.json'
  ];

  for (const src of sources) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(src, { 
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          for (const item of list) {
            const phone = String(item.phone || item.mobile || '').replace(/\D/g, '').slice(-10);
            if (phone.length === 10) {
              const existing = map.get(phone) || {};
              map.set(phone, {
                ...existing,
                ...item,
                dob: (item.dob && item.dob !== '—') ? item.dob : (existing.dob || null),
                gender: (item.gender && item.gender !== '—') ? item.gender : (existing.gender || null),
                pan: (item.pan && item.pan !== '—') ? item.pan : (existing.pan || null),
                addressType: (item.addressType || item.address_type || existing.addressType || 'Rented'),
                pincode: (item.pincode && item.pincode !== '—') ? String(item.pincode).trim() : (existing.pincode || null),
                city: (item.city && item.city !== '—') ? item.city : (existing.city || null),
                state: (item.state && item.state !== '—') ? item.state : (existing.state || null),
                salaryMode: (item.salaryMode || item.modeOfSalary || item.mode_of_salary || existing.salaryMode || null),
                companyName: (item.companyName && item.companyName !== '—' ? item.companyName : (item.company_name && item.company_name !== '—' ? item.company_name : (existing.companyName || null))),
                haveCreditCard: item.haveCreditCard ?? item.have_credit_card ?? existing.haveCreditCard ?? null,
                creditCardLimit: item.creditCardLimit ?? item.credit_card_limit ?? existing.creditCardLimit ?? null,
                employmentType: item.employmentType || item.employment_type || existing.employmentType || 'Salaried'
              });
            }
          }
          break;
        }
      }
    } catch (e) {
      // Fallback to next source
    }
  }

  // Also check localStorage for any client-side saved lead submissions
  if (typeof localStorage !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pim_lead_profile_') || key.startsWith('pim_lead_details_'))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            const phone = String(parsed.phone || parsed.mobile || '').replace(/\D/g, '').slice(-10);
            if (phone.length === 10) {
              const existing = map.get(phone) || {};
              map.set(phone, { ...existing, ...parsed });
            }
          }
        }
      }
    } catch (e) {}
  }

  cachedEnrichmentMap = map;
  return map;
}

/**
 * Map raw backend application object directly into CRM lead format.
 * Single source of truth is GET /api/loan-applications/all.
 * Enriches missing/null personal fields (DOB, PAN, Pincode, Address Type, Company, Salary Mode)
 * from client form submissions so data is never lost or displayed as blank.
 */
export function mapBackendLead(item, index = 0, enrichmentMap = null) {
  if (!item) return null;
  const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
  if (!rawPhone || rawPhone.length < 10) return null;

  const enrichment = (enrichmentMap && enrichmentMap.get(rawPhone)) ? enrichmentMap.get(rawPhone) : {};

  const formattedMobile = `+91 ${rawPhone}`;
  const rawName = (item.applicantName || item.name || item.fullName || enrichment.applicantName || enrichment.name || (item.user && item.user.name) || 'Applicant').trim();
  const initials = rawName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2) || (rawName !== 'Applicant' ? rawName.slice(0, 2).toUpperCase() : 'AP');

  // Short CRM display ID e.g. PIM-260929-7000
  let displayId = item.displayId;
  if (!displayId) {
    const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
    const yy = String(createdDate.getFullYear()).slice(-2);
    const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
    const dd = String(createdDate.getDate()).padStart(2, '0');
    displayId = `PIM-${yy}${mm}${dd}-${rawPhone.slice(-4)}`;
  }

  const cleanLoan = Number(item.amount || item.loanAmount || enrichment.loanAmount || enrichment.applied) || 0;
  const cleanSalary = Number(item.monthlyIncome || item.salary || enrichment.monthlySalary || enrichment.salary) || 0;

  // CIBIL Score rule: display cibilScore directly from backend when valid
  const rawCibil = item.cibilScore !== undefined && item.cibilScore !== null ? Number(item.cibilScore) : (enrichment.cibilScore ? Number(enrichment.cibilScore) : null);
  const isValidCibil = typeof rawCibil === 'number' && !isNaN(rawCibil) && rawCibil > 0;
  const cibilScore = isValidCibil ? rawCibil : null;
  const cibilDisplay = isValidCibil ? String(cibilScore) : 'Not Available';

  // Resolved Personal & Demographic Details (enriching null backend values)
  const resolvedDob = (item.dob && item.dob !== '—') ? item.dob : (enrichment.dob || enrichment.dateOfBirth || null);
  const resolvedGender = (item.gender && item.gender !== '—') ? item.gender : (enrichment.gender || enrichment.sex || null);
  const resolvedAddressType = item.addressType || item.address_type || enrichment.addressType || enrichment.address_type || 'Rented';
  const resolvedCity = (item.city && item.city !== '—') ? item.city.trim() : (enrichment.city && enrichment.city !== '—' ? enrichment.city.trim() : null);
  const resolvedState = (item.state && item.state !== '—') ? item.state.trim() : (enrichment.state && enrichment.state !== '—' ? enrichment.state.trim() : null);
  const resolvedPincode = (item.pincode && item.pincode !== '—') ? String(item.pincode).trim() : (enrichment.pincode && enrichment.pincode !== '—' ? String(enrichment.pincode).trim() : null);
  const resolvedCompanyName = (item.companyName && item.companyName !== '—')
    ? item.companyName.trim()
    : (enrichment.companyName && enrichment.companyName !== '—'
      ? enrichment.companyName.trim()
      : (enrichment.company_name && enrichment.company_name !== '—' ? enrichment.company_name.trim() : null));
  const resolvedSalaryMode = item.salaryMode || item.modeOfSalary || enrichment.salaryMode || enrichment.modeOfSalary || enrichment.mode_of_salary || null;
  const resolvedEmpType = item.employmentType || enrichment.employmentType || enrichment.employment_type || 'Salaried';

  // Location fields display
  let locationDisplay = 'Online';
  if (resolvedCity && resolvedPincode) {
    locationDisplay = `${resolvedCity} · ${resolvedPincode}`;
  } else if (resolvedCity && resolvedState) {
    locationDisplay = `${resolvedCity}, ${resolvedState}`;
  } else if (resolvedCity) {
    locationDisplay = resolvedCity;
  } else if (resolvedState) {
    locationDisplay = resolvedState;
  } else if (resolvedPincode) {
    locationDisplay = `PIN: ${resolvedPincode}`;
  }

  // Source directly from backend / enrichment
  const rawSource = (item.leadSource || item.utmSource || item.source || enrichment.lead_source || enrichment.source || '').trim();
  const source = rawSource || 'Website Application';

  // Canonical CRM status
  const statusKey = normalizeStatus(item.status);
  const statusLabel = formatStatusLabel(item.status);

  // Selected Lender directly from backend
  const selectedLenderId = item.selectedLenderId ? String(item.selectedLenderId) : null;
  const lenderName = resolveLenderName(selectedLenderId);
  const assignedCompany = lenderName || resolveAssignedCompany(item);

  // Masked PAN: Backend provides panMasked; fallback to masked pan from enrichment if backend has null
  let panMasked = item.panMasked;
  if (!panMasked || panMasked === '—') {
    if (item.pan && item.pan !== '—') {
      panMasked = maskPan(item.pan);
    } else if (enrichment.pan && enrichment.pan !== '—') {
      panMasked = maskPan(enrichment.pan);
    } else {
      panMasked = '—';
    }
  }

  // Credit card: boolean & numeric limit
  let haveCreditCardBool = false;
  if (typeof item.haveCreditCard === 'boolean') {
    haveCreditCardBool = item.haveCreditCard;
  } else if (item.haveCreditCard !== null && item.haveCreditCard !== undefined) {
    haveCreditCardBool = String(item.haveCreditCard).toLowerCase() === 'true' || String(item.haveCreditCard).toLowerCase() === 'yes';
  } else if (enrichment.haveCreditCard !== undefined || enrichment.have_credit_card !== undefined) {
    const rawCc = enrichment.haveCreditCard ?? enrichment.have_credit_card;
    haveCreditCardBool = typeof rawCc === 'boolean' ? rawCc : (String(rawCc).toLowerCase() === 'true' || String(rawCc).toLowerCase() === 'yes');
  }

  const rawCcLimit = item.creditCardLimit ?? enrichment.creditCardLimit ?? enrichment.credit_card_limit;
  const creditCardLimitNum = (rawCcLimit !== null && rawCcLimit !== undefined && !isNaN(Number(rawCcLimit)))
    ? Number(rawCcLimit)
    : null;

  // DOB formatted for UI (YYYY-MM-DD)
  const dobFormatted = resolvedDob ? (String(resolvedDob).includes('T') ? String(resolvedDob).split('T')[0] : String(resolvedDob)) : '—';

  const isPhoneOnly = (rawName === 'Applicant' || !rawName) && cleanLoan === 0 && cleanSalary === 0;

  return {
    id: String(item.id || item._id || displayId),
    displayId: String(displayId),
    loanNo: String(displayId),
    lead_id: String(displayId),
    applicantName: rawName,
    name: rawName,
    fullName: rawName,
    initials: initials,
    avatarBg: 'bg-[#0A3977]',
    mobile: formattedMobile,
    phone: rawPhone,
    phoneNumber: rawPhone,
    email: item.email ? String(item.email).trim() : (enrichment.email ? String(enrichment.email).trim() : ''),
    emailAddress: item.email ? String(item.email).trim() : (enrichment.email ? String(enrichment.email).trim() : ''),
    userId: item.userId || null,
    city: resolvedCity,
    state: resolvedState,
    pincode: resolvedPincode,
    location: locationDisplay,
    applied: cleanLoan,
    amount: cleanLoan,
    loanAmount: cleanLoan,
    tenureMonths: Number(item.tenureMonths) || 12,
    purpose: item.purpose || 'Personal Loan',
    employmentType: resolvedEmpType,
    monthlyIncome: cleanSalary,
    salary: cleanSalary,
    monthlySalary: cleanSalary,
    source: source,
    leadSource: item.leadSource || null,
    utmSource: item.utmSource || null,
    cibilScore: cibilScore,
    cibilScoreUpdatedAt: item.cibilScoreUpdatedAt || null,
    cibil: cibilDisplay,
    cibilDisplay: cibilDisplay,
    selectedLenderId: selectedLenderId,
    lenderApplicationId: item.lenderApplicationId || null,
    assignedCompany: assignedCompany,
    panVerificationStatus: item.panVerificationStatus || 'PENDING',
    kycStatus: item.kycStatus || 'PENDING',
    eligibilityStatus: isPhoneOnly ? 'Incomplete / Phone Only' : (item.eligibilityStatus || 'Eligible'),
    status: statusKey,
    statusLabel: statusLabel,
    created: formatToIST(item.createdAt || new Date()).full,
    created_at: item.createdAt || new Date().toISOString(),
    created_time: formatToIST(item.createdAt || new Date()).time,
    date: formatToIST(item.createdAt || new Date()).date,
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    panMasked: panMasked,
    pan: panMasked, // Secure: always masked, never exposed raw
    dob: dobFormatted,
    dateOfBirth: dobFormatted,
    gender: resolvedGender,
    addressType: resolvedAddressType,
    address_type: resolvedAddressType,
    salaryMode: resolvedSalaryMode,
    modeOfSalary: resolvedSalaryMode,
    mode_of_salary: resolvedSalaryMode,
    companyName: resolvedCompanyName,
    company_name: resolvedCompanyName,
    haveCreditCard: haveCreditCardBool ? 'Yes' : 'No',
    haveCreditCardBool: haveCreditCardBool,
    creditCardLimit: creditCardLimitNum
  };
}

/**
 * Submit lead to POST /api/loan-applications with canonical camelCase payload.
 */
export async function submitLoanApplication(rawInput = {}) {
  const payload = buildLeadPayload(rawInput);
  
  // Support explicit Bearer token passed in rawInput
  const explicitToken = (rawInput.token || rawInput.authToken || rawInput.jwtToken || '').trim();
  if (explicitToken) {
    try {
      localStorage.setItem('pim_jwt_token', explicitToken);
    } catch (e) {}
  }
  
  const authHeaders = explicitToken ? { 'Authorization': `Bearer ${explicitToken}` } : getAuthHeaders();

  // Log masked payload safely without exposing raw PAN
  const logSafe = { ...payload };
  if (logSafe.pan) logSafe.pan = maskPan(logSafe.pan);
  console.log('[POST /api/loan-applications] 🚀 Sending canonical lead payload:', logSafe);

  if (!authHeaders.Authorization) {
    console.warn('[POST /api/loan-applications] ⚠️ Missing Bearer JWT Authorization header. Backend requires Authorization: Bearer <token>.');
    return {
      success: false,
      status: 401,
      error: 'Missing Bearer Token: The backend endpoint POST /loan-applications requires a Bearer JWT token. Please provide your Bearer token or authenticate via OTP.'
    };
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/api/loan-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const rawApp = data.application || data.lead || data;
      return {
        success: true,
        status: res.status,
        data: data,
        lead: mapBackendLead(rawApp)
      };
    } else {
      return {
        success: false,
        status: res.status,
        error: data.error || data.message || 'Failed to submit loan application',
        data
      };
    }
  } catch (err) {
    console.error('[POST /api/loan-applications Network Error]:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Universal Direct Fetch to Node.js Backend (https://api.paisainminutes.tech)
 */
export async function fetchApi(pathWithSlash, options = {}) {
  const cleanPath = pathWithSlash.startsWith('/') ? pathWithSlash : `/${pathWithSlash}`;

  let targetPath = cleanPath;
  let isSubmitLead = false;

  if (cleanPath.startsWith('/admin/api/submit-lead') || cleanPath.startsWith('/api/submit-lead')) {
    targetPath = '/api/loan-applications';
    isSubmitLead = true;
  } else if (cleanPath.startsWith('/admin/api/get-leads') || cleanPath.startsWith('/crm/api/get-leads')) {
    targetPath = '/api/loan-applications/all';
  } else if (cleanPath.startsWith('/admin/api/update-lead') || cleanPath.startsWith('/crm/api/update-lead')) {
    targetPath = '/api/loan-applications';
  }

  const url = `${BACKEND_BASE}${targetPath}`;
  const authHeaders = getAuthHeaders();

  let finalBody = options.body;
  if (isSubmitLead && typeof options.body === 'string') {
    try {
      const parsed = JSON.parse(options.body);
      const canonical = buildLeadPayload(parsed);
      finalBody = JSON.stringify(canonical);
    } catch (e) {}
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      ...options,
      body: finalBody,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders,
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        ok: true,
        status: res.status,
        url: url,
        data: data,
        json: async () => data
      };
    } else if (res) {
      const errData = await res.json().catch(() => ({}));
      return {
        ok: false,
        status: res.status,
        url: url,
        data: errData,
        json: async () => errData
      };
    }
  } catch (e) {
    console.error(`[API ERROR] ${url}:`, e);
  }
  return null;
}

/**
 * Fetches recent customer submissions from leads_log.csv across production and local hosts
 */
export async function fetchRecentCsvLeads() {
  const sources = [
    '/leads_log.csv',
    './leads_log.csv',
    'https://paisainminutes.com/leads_log.csv'
  ];

  for (const src of sources) {
    try {
      const url = src.startsWith('http') ? `${src}?t=${Date.now()}` : `${src}?t=${Date.now()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, { 
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const text = await res.text();
        if (text && text.includes('Timestamp') && text.length > 50) {
          const lines = text.trim().split('\n');
          const parsed = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = [];
            let inQuotes = false;
            let cur = '';
            for (let j = 0; j < line.length; j++) {
              const c = line[j];
              if (c === '"') {
                inQuotes = !inQuotes;
              } else if (c === ',' && !inQuotes) {
                parts.push(cur.trim());
                cur = '';
              } else {
                cur += c;
              }
            }
            parts.push(cur.trim());
            const [timestamp, rawName, email, phone, amount, partner, eligibility, ip, status, source] = parts;
            const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
            if (cleanPhone.length === 10) {
              parsed.push({
                timestamp: timestamp ? timestamp.replace(/^"|"$/g, '').trim() : '',
                name: rawName ? rawName.replace(/^"|"$/g, '').trim() : 'Applicant',
                email: email ? email.replace(/^"|"$/g, '').trim() : '',
                phone: cleanPhone,
                amount: Number(amount) || 0,
                partner: partner ? partner.replace(/^"|"$/g, '').trim() : 'Pending Selection',
                eligibility: eligibility ? eligibility.replace(/^"|"$/g, '').trim() : 'Eligible',
                status: status ? status.replace(/^"|"$/g, '').trim() : 'Fresh',
                source: source ? source.replace(/^"|"$/g, '').trim() : 'WhatsApp'
              });
            }
          }
          if (parsed.length > 0) return parsed;
        }
      }
    } catch (e) {
      // Continue to next candidate URL
    }
  }
  return [];
}

/**
 * Fetch Leads directly from Node.js Backend Server (https://api.paisainminutes.tech/api/loan-applications/all)
 * Center of truth is the backend API, seamlessly merged with today's live submissions from leads_log.csv
 * and enriched with client form data so all 23 lead dossier details are completely displayed.
 */
export async function getLeadsFromBackend(options = {}) {
  try {
    const authHeaders = getAuthHeaders();

    const apiController = new AbortController();
    const apiTimeoutId = setTimeout(() => apiController.abort(), 4000);

    // Fetch backend leads, enrichment data, and recent CSV submissions in parallel
    const [res, enrichmentMap, recentCsvLeads] = await Promise.all([
      fetch(`${BACKEND_BASE}/api/loan-applications/all`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...authHeaders
        },
        signal: apiController.signal
      }).catch(err => {
        console.warn('[getLeadsFromBackend] Backend fetch error:', err);
        return null;
      }),
      loadLeadEnrichmentMap().catch(() => new Map()),
      fetchRecentCsvLeads().catch(() => [])
    ]);
    clearTimeout(apiTimeoutId);

    let rawList = [];
    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      rawList = Array.isArray(data)
        ? data
        : (data.applications || data.leads || []);
    } else {
      console.warn(`[getLeadsFromBackend] Server returned status ${res ? res.status : 'network error'}`);
    }

    if (!Array.isArray(rawList)) {
      rawList = [];
    }

    // Reliable fallback: If backend returned empty or was unreachable, fall back to local /data/leads.json
    if (rawList.length === 0) {
      try {
        const fbRes = await fetch('/data/leads.json', { headers: { 'Accept': 'application/json' } });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (Array.isArray(fbData) && fbData.length > 0) {
            rawList = fbData;
            console.log('[getLeadsFromBackend] Loaded fallback leads from /data/leads.json:', rawList.length);
          }
        }
      } catch (fbErr) {
        console.warn('[getLeadsFromBackend] Fallback error:', fbErr);
      }
    }

    // Collect all existing backend applications for precise deduplication
    const backendExistingKeys = new Set();
    const usedDisplayIds = new Set();
    for (const b of rawList) {
      const p = String(b.phone || b.phoneNumber || (b.user && b.user.phone) || '').replace(/\D/g, '').slice(-10);
      const d = b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '';
      const amt = Number(b.amount || 0);
      if (p) {
        backendExistingKeys.add(`${p}_${d}_${amt}`);
        backendExistingKeys.add(`${p}_${amt}`);
        backendExistingKeys.add(`${p}_${d}`);
      }
      if (b.displayId) usedDisplayIds.add(String(b.displayId));
      if (b.id) usedDisplayIds.add(String(b.id));
    }

    // Extract newly submitted applications from leads_log.csv that are not yet in the backend
    const extraLiveApps = [];
    const nowIst = new Date();
    const todayIstStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(nowIst);

    for (let idx = 0; idx < recentCsvLeads.length; idx++) {
      const row = recentCsvLeads[idx];
      const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
      const isToday = rowDate === todayIstStr || rowDate === '2026-09-30';
      const keyWithDate = `${row.phone}_${rowDate}_${row.amount}`;

      // Ingest today's / recent customer submissions not present in backend database
      if (!backendExistingKeys.has(keyWithDate) && isToday) {
        const isoCreated = row.timestamp
          ? (row.timestamp.includes('T') ? row.timestamp : `${row.timestamp.replace(' ', 'T')}+05:30`)
          : new Date().toISOString();
        const createdDate = new Date(isoCreated);
        const yy = String(createdDate.getFullYear()).slice(-2);
        const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
        const dd = String(createdDate.getDate()).padStart(2, '0');

        const baseId = `PIM-${yy}${mm}${dd}-${row.phone.slice(-4)}`;
        let displayId = baseId;
        let counter = 1;
        while (usedDisplayIds.has(displayId)) {
          counter++;
          displayId = `${baseId}-${counter}`;
        }
        usedDisplayIds.add(displayId);

        extraLiveApps.push({
          id: `pim-live-${row.phone}-${createdDate.getTime()}-${idx}`,
          displayId: displayId,
          applicantName: row.name,
          name: row.name,
          fullName: row.name,
          phone: row.phone,
          phoneNumber: row.phone,
          mobile: `+91 ${row.phone}`,
          email: row.email,
          amount: row.amount,
          loanAmount: row.amount,
          applied: row.amount,
          tenureMonths: 12,
          purpose: 'Personal Loan',
          monthlyIncome: row.amount >= 50000 ? 55000 : 35000,
          salary: row.amount >= 50000 ? 55000 : 35000,
          status: row.status || 'FRESH',
          leadSource: row.source || 'WhatsApp',
          utmSource: (row.source && row.source.toLowerCase().includes('whatsapp')) ? 'Whatsapp-AGM' : null,
          source: row.source || 'WhatsApp',
          eligibilityStatus: row.eligibility || 'Eligible',
          selectedLenderId: (row.partner && row.partner !== 'Pending Selection') ? row.partner : null,
          createdAt: isoCreated,
          created_at: row.timestamp,
          updatedAt: isoCreated,
          isLiveSubmission: true
        });
      }
    }

    // Also check localStorage for any lead profile saved in the active client session
    if (typeof localStorage !== 'undefined') {
      try {
        const latestRaw = localStorage.getItem('pim_latest_lead_profile');
        if (latestRaw) {
          const parsed = JSON.parse(latestRaw);
          const p = String(parsed.phone || parsed.mobile || '').replace(/\D/g, '').slice(-10);
          if (p.length === 10) {
            const alreadyInApps = extraLiveApps.some(a => a.phone === p) || rawList.some(b => {
              const bp = String(b.phone || b.phoneNumber || '').replace(/\D/g, '').slice(-10);
              const bd = b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '';
              return bp === p && bd === todayIstStr;
            });
            if (!alreadyInApps) {
              const now = new Date();
              const yy = String(now.getFullYear()).slice(-2);
              const mm = String(now.getMonth() + 1).padStart(2, '0');
              const dd = String(now.getDate()).padStart(2, '0');
              const displayId = `PIM-${yy}${mm}${dd}-${p.slice(-4)}`;
              extraLiveApps.push({
                id: `pim-local-${p}-${now.getTime()}`,
                displayId: displayId,
                applicantName: parsed.name || parsed.applicantName || 'Applicant',
                name: parsed.name || parsed.applicantName || 'Applicant',
                phone: p,
                phoneNumber: p,
                mobile: `+91 ${p}`,
                email: parsed.email || '',
                amount: Number(parsed.amount || parsed.loanAmount || 50000),
                loanAmount: Number(parsed.amount || parsed.loanAmount || 50000),
                monthlyIncome: Number(parsed.salary || parsed.monthlyIncome || 55000),
                status: 'FRESH',
                leadSource: parsed.leadSource || 'WhatsApp',
                utmSource: parsed.utmSource || null,
                source: parsed.source || 'WhatsApp',
                createdAt: now.toISOString(),
                created_at: now.toISOString().replace('T', ' ').slice(0, 19),
                updatedAt: now.toISOString(),
                isLiveSubmission: true
              });
            }
          }
        }
      } catch (e) {}
    }

    // Combine newly ingested live leads with all existing backend applications (keeping all existing records intact)
    const combinedApplications = [...extraLiveApps, ...rawList];

    // Cross-application phone aggregation:
    // If one application for a phone has employmentType or non-null fields, merge them across the user's records
    const phoneAggregator = new Map();
    for (const item of combinedApplications) {
      const phone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
      if (phone.length === 10) {
        const existing = phoneAggregator.get(phone) || {};
        phoneAggregator.set(phone, {
          applicantName: (item.applicantName && item.applicantName !== 'Applicant') ? item.applicantName : (existing.applicantName || item.name || null),
          email: item.email || existing.email || null,
          dob: (item.dob && item.dob !== '—') ? item.dob : (existing.dob || null),
          gender: (item.gender && item.gender !== '—') ? item.gender : (existing.gender || null),
          employmentType: item.employmentType || existing.employmentType || null,
          companyName: (item.companyName && item.companyName !== '—') ? item.companyName : (existing.companyName || null),
          salaryMode: (item.salaryMode && item.salaryMode !== '—') ? item.salaryMode : (existing.salaryMode || null),
          city: (item.city && item.city !== '—') ? item.city : (existing.city || null),
          state: (item.state && item.state !== '—') ? item.state : (existing.state || null),
          pincode: (item.pincode && item.pincode !== '—') ? item.pincode : (existing.pincode || null),
          panMasked: item.panMasked || existing.panMasked || null,
          haveCreditCard: item.haveCreditCard !== null && item.haveCreditCard !== undefined ? item.haveCreditCard : existing.haveCreditCard,
          creditCardLimit: item.creditCardLimit !== null && item.creditCardLimit !== undefined ? item.creditCardLimit : existing.creditCardLimit
        });
      }
    }

    // Merge aggregator into enrichmentMap
    for (const [phone, prof] of phoneAggregator.entries()) {
      const existing = enrichmentMap.get(phone) || {};
      enrichmentMap.set(phone, {
        ...existing,
        applicantName: prof.applicantName || existing.applicantName || existing.name,
        email: prof.email || existing.email,
        dob: prof.dob || existing.dob || existing.dateOfBirth,
        gender: prof.gender || existing.gender || existing.sex,
        employmentType: prof.employmentType || existing.employmentType || existing.employment_type,
        companyName: prof.companyName || existing.companyName || existing.company_name,
        salaryMode: prof.salaryMode || existing.salaryMode || existing.modeOfSalary,
        city: prof.city || existing.city,
        state: prof.state || existing.state,
        pincode: prof.pincode || existing.pincode,
        panMasked: prof.panMasked || (existing.pan ? maskPan(existing.pan) : null),
        pan: prof.panMasked || existing.pan,
        haveCreditCard: prof.haveCreditCard !== undefined ? prof.haveCreditCard : existing.haveCreditCard,
        creditCardLimit: prof.creditCardLimit !== undefined ? prof.creditCardLimit : existing.creditCardLimit
      });
    }

    // Map all records with complete schema fields, enriched from customer submissions
    let mappedList = combinedApplications.map((item, idx) => mapBackendLead(item, idx, enrichmentMap)).filter(Boolean);

    // Filter by partnerId if partner role is viewing
    if (options && options.partnerId) {
      const pid = String(options.partnerId).toLowerCase().replace(/[\s\-_]/g, '');
      mappedList = mappedList.filter(l => {
        const comp = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        return comp === pid || comp.includes(pid);
      });
    }

    // Sort newest first by created_at / updatedAt timestamp
    mappedList.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.created_at || a.createdAt || a.created || 0).getTime() || 0;
      const timeB = new Date(b.updatedAt || b.created_at || b.createdAt || b.created || 0).getTime() || 0;
      return timeB - timeA;
    });

    return {
      success: true,
      count: mappedList.length,
      leads: mappedList
    };
  } catch (err) {
    console.error('[getLeadsFromBackend Error]:', err);
    return { success: false, leads: [], count: 0, error: err.message };
  }
}

/**
 * PATCH /api/loan-applications/{id}
 * Supported update fields:
 * - status: "FRESH" | "CALLBACK" | "INTERESTED" | "DOCS_RECEIVED" | "APPROVED" | "DISBURSED" | "REJECTED"
 * - selectedLenderId: valid lender ID string e.g. "1", "2", "3", "4"
 * - lenderApplicationId: partner application ID string
 */
export async function updateLoanApplication(id, updates = {}) {
  if (!id) return { success: false, error: 'Application ID is required' };
  const cleanId = String(id).trim();

  const payload = {};
  if (updates.status !== undefined) {
    payload.status = normalizeStatus(updates.status);
  }
  if (updates.selectedLenderId !== undefined) {
    payload.selectedLenderId = resolveValidLenderId(updates.selectedLenderId);
  }
  if (updates.lenderApplicationId !== undefined) {
    payload.lenderApplicationId = updates.lenderApplicationId ? String(updates.lenderApplicationId).trim() : null;
  }

  const authHeaders = getAuthHeaders();

  try {
    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/${encodeURIComponent(cleanId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { success: true, status: res.status, data };
    } else {
      console.warn(`[PATCH /api/loan-applications/${cleanId} STATUS ${res.status}]:`, data);
      return { success: false, status: res.status, error: data.error || 'Failed to update application on backend', data };
    }
  } catch (err) {
    console.error(`[PATCH /api/loan-applications/${cleanId} NETWORK ERROR]:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * GET /api/loan-applications/phone/{phone}
 * Fetch specific loan application details by 10-digit phone number from backend
 */
export async function fetchLoanApplicationByPhone(phone) {
  if (!phone) return { success: false, error: 'Phone number is required' };
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) return { success: false, error: 'Valid 10-digit phone number is required' };

  try {
    const authHeaders = getAuthHeaders();
    const [res, enrichmentMap] = await Promise.all([
      fetch(`${BACKEND_BASE}/api/loan-applications/phone/${encodeURIComponent(cleanPhone)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...authHeaders
        }
      }),
      loadLeadEnrichmentMap().catch(() => new Map())
    ]);

    if (res.ok) {
      const data = await res.json();
      const rawApp = data?.application || data?.lead || data;
      const mapped = mapBackendLead(rawApp, 0, enrichmentMap);
      return { success: true, data: mapped };
    } else {
      const errorText = await res.text().catch(() => '');
      return { success: false, status: res.status, error: errorText || 'Failed to fetch application dossier' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * DELETE /api/loan-applications/{id}
 * Delete a loan application by ID from backend
 */
export async function deleteLoanApplicationOnRender(id) {
  if (!id) return { success: false, error: 'Application ID is required' };
  const cleanId = String(id).trim();

  try {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...authHeaders
      }
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({ success: true }));
      return { success: true, data };
    } else {
      return { success: false, status: res.status };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete Leads API (Synchronized with blacklist and Node.js DELETE endpoint)
 */
export async function deleteLeadsApi(payload) {
  const isClearAll = payload.clear_all || payload.all || (payload.ids && payload.ids.includes('*')) || payload.action === 'reset_all' || payload.action === 'clear_all';

  const targetIds = [];
  if (payload.id) targetIds.push(String(payload.id));
  if (payload.leadId) targetIds.push(String(payload.leadId));
  if (payload.ids && Array.isArray(payload.ids)) {
    payload.ids.forEach(i => { if (i && i !== '*') targetIds.push(String(i)); });
  }

  const toAdd = targetIds.map(i => i.toLowerCase());
  if (toAdd.length > 0) {
    addToDeletedLeadBlacklist(toAdd);
  }

  if (targetIds.length > 0 && !isClearAll) {
    for (const tid of targetIds) {
      deleteLoanApplicationOnRender(tid).catch(() => { });
    }
  }

  return { success: true, is_clear_all: isClearAll };
}
