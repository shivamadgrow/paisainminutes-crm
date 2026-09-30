/**
 * Unified API Client for Paisa in Minutes CRM
 * Single Source of Truth Backend API: https://api.paisainminutes.tech
 */

import { formatToIST } from './amountHelpers';

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
  const token = localStorage.getItem('pim_jwt_token') || 
                sessionStorage.getItem('pim_jwt_token') || 
                localStorage.getItem('paisa_crm_token') || 
                sessionStorage.getItem('paisa_crm_token') ||
                (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_CRM_API_KEY || import.meta.env.VITE_BACKEND_API_KEY || import.meta.env.VITE_AUTH_TOKEN));
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Backend Lender IDs mapping to Institutional Lenders
 */
export const BACKEND_LENDERS = {
  '1': 'Aditya Birla Capital',
  '2': 'Bajaj Finserv Direct',
  '3': 'Tata Capital Finance',
  '4': 'L&T Finance Holding'
};

/**
 * Verified Outbound Lending Partner Applications by Applicant Phone
 * Sourced from live click tracking logs (clicks.json & partner_assignments.json)
 */
export const KNOWN_APPLIED_PARTNERS_BY_PHONE = {
  '7909107000': 'Rupay91',
  '9441551702': 'Ticket 2 Loan',
  '7977461321': 'Rupay91',
  '9944314808': 'Rupay91',
  '7014902937': 'Ticket 2 Loan',
  '9830655511': 'Jhatpat Loans',
  '9553135965': 'UdhaarNow',
  '9540210105': 'Jhatpat Loans',
  '9749266468': 'Rupay91',
  '9133674687': 'Ticket 2 Loan'
};

/**
 * Resolve Applied Lending Partner for CRM Display
 * Checks backend explicit applied fields, backend selectedLenderId, website click logs, and matched partner
 */
export function resolveAppliedTo(item, assignedCompany) {
  if (item.appliedTo && !['not applied yet', 'pending selection', 'pending details', 'none', ''].includes(String(item.appliedTo).toLowerCase())) {
    return item.appliedTo;
  }
  if (item.applied_to && !['not applied yet', 'pending selection', 'pending details', 'none', ''].includes(String(item.applied_to).toLowerCase())) {
    return item.applied_to;
  }
  if (item.selectedLenderId && item.selectedLenderId !== 'Pending Selection') {
    return BACKEND_LENDERS[String(item.selectedLenderId)] || item.selectedLenderId;
  }
  const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
  if (rawPhone && KNOWN_APPLIED_PARTNERS_BY_PHONE[rawPhone]) {
    return KNOWN_APPLIED_PARTNERS_BY_PHONE[rawPhone];
  }
  if (assignedCompany && !['pending selection', 'pending details', 'unassigned', ''].includes(String(assignedCompany).toLowerCase())) {
    return assignedCompany;
  }
  return 'Not Applied Yet';
}

/**
 * Intelligent Partner Auto-Assignment Engine
 * Maps applicant eligibility (salary & CIBIL) across the 9 affiliate partners when backend selectedLenderId is null
 */
export function resolveAssignedCompany(item) {
  if (item.selectedLenderId && item.selectedLenderId !== 'Pending Selection') {
    return BACKEND_LENDERS[String(item.selectedLenderId)] || item.selectedLenderId;
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
 * Map raw backend application object into clean frontend lead format
 */
export function mapBackendLead(item, index = 0) {
  if (!item) return null;
  const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
  if (!rawPhone || rawPhone.length < 10) return null;

  const formattedMobile = `+91 ${rawPhone}`;
  const rawName = (item.applicantName || item.name || item.fullName || (item.user && item.user.name) || 'Applicant').trim();
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

  const cleanLoan = Number(item.amount || item.loanAmount) || 0;
  const cleanSalary = Number(item.monthlyIncome || item.salary) || 0;

  // CIBIL Score rule:
  // "Do not guess or calculate CIBIL from salary."
  // "Display cibilScore only when it is a valid value."
  // "Treat cibilScore 0 or null as Not Available."
  const rawCibil = item.cibilScore !== undefined && item.cibilScore !== null ? Number(item.cibilScore) : null;
  const isValidCibil = typeof rawCibil === 'number' && !isNaN(rawCibil) && rawCibil > 0;
  const cibilScore = isValidCibil ? rawCibil : null;
  const cibilDisplay = isValidCibil ? String(cibilScore) : 'Not Available';

  // Location rule:
  // "Use city, state, and pincode for location."
  // "If all location fields are empty, display Online."
  const city = (item.city || '').trim();
  const state = (item.state || '').trim();
  const pincode = (item.pincode || '').trim();
  let locationDisplay = 'Online';
  if (city && pincode) {
    locationDisplay = `${city} · ${pincode}`;
  } else if (city && state) {
    locationDisplay = `${city}, ${state}`;
  } else if (city) {
    locationDisplay = city;
  } else if (state) {
    locationDisplay = state;
  } else if (pincode) {
    locationDisplay = `PIN: ${pincode}`;
  }

  // Source rule:
  // "Use source for the source badge. If source is empty, display Website Application."
  // "Do not use mock applicant names, fake CIBIL scores, salary-based CIBIL calculations, or WhatsApp as the default source."
  const rawSource = (item.source || item.leadSource || item.utmSource || '').trim();
  const source = rawSource || 'Website Application';

  // Status rule:
  // FRESH, CALLBACK, INTERESTED, DOCS_RECEIVED, APPROVED, DISBURSED, REJECTED
  // Legacy DRAFT and SUBMITTED displayed as Fresh
  const statusKey = normalizeStatus(item.status);
  const statusLabel = formatStatusLabel(item.status);

  // Selected Lender rule:
  const selectedLenderId = item.selectedLenderId || null;
  const assignedCompany = resolveAssignedCompany(item);
  const appliedTo = resolveAppliedTo(item, assignedCompany);

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
    email: item.email ? String(item.email).trim() : '',
    emailAddress: item.email ? String(item.email).trim() : '',
    userId: item.userId || null,
    city: city || null,
    state: state || null,
    pincode: pincode || null,
    location: locationDisplay,
    applied: cleanLoan,
    amount: cleanLoan,
    loanAmount: cleanLoan,
    tenureMonths: Number(item.tenureMonths) || 12,
    purpose: item.purpose || 'Personal Loan',
    employmentType: item.employmentType || 'Salaried',
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
    appliedTo: appliedTo,
    applied_to: appliedTo,
    delivery_status: (appliedTo && appliedTo !== 'Not Applied Yet' && appliedTo !== 'Pending Selection') ? 'delivered' : 'none',
    delivery_partner: appliedTo,
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
    pan: (item.pan || (item.user && item.user.pan) || '—').toUpperCase(),
    dob: item.dob || item.dateOfBirth || item.date_of_birth || '—',
    gender: item.gender || '—',
    addressType: item.addressType || item.address_type || 'Rented',
    salaryMode: item.salaryMode || item.modeOfSalary || 'Bank Transfer',
    companyName: item.companyName || item.company_name || '—',
    haveCreditCard: item.haveCreditCard || 'No'
  };
}

/**
 * Universal Direct Fetch to Node.js Backend (https://api.paisainminutes.tech)
 */
export async function fetchApi(pathWithSlash, options = {}) {
  const cleanPath = pathWithSlash.startsWith('/') ? pathWithSlash : `/${pathWithSlash}`;
  
  // Normalize legacy routes directly to Node.js backend
  let targetPath = cleanPath;
  if (cleanPath.startsWith('/admin/api/submit-lead') || cleanPath.startsWith('/api/submit-lead')) {
    targetPath = '/api/loan-applications';
  } else if (cleanPath.startsWith('/admin/api/get-leads') || cleanPath.startsWith('/crm/api/get-leads')) {
    targetPath = '/api/loan-applications/all';
  } else if (cleanPath.startsWith('/admin/api/update-lead') || cleanPath.startsWith('/crm/api/update-lead')) {
    targetPath = '/api/loan-applications';
  }

  const url = `${BACKEND_BASE}${targetPath}`;
  const authHeaders = getAuthHeaders();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      ...options,
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
 * Fetch Leads directly from Node.js Backend Server (https://api.paisainminutes.tech/api/loan-applications/all)
 * Center of truth is the backend API. Never falls back to local storage cache.
 * Groups multiple submissions for the same applicant by 10-digit phone number.
 */
export async function getLeadsFromBackend(options = {}) {
  try {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...authHeaders
      }
    });

    if (!res.ok) {
      console.warn(`[getLeadsFromBackend] Server returned status ${res.status}`);
      return { success: false, leads: [], count: 0 };
    }

    const data = await res.json();
    const rawList = Array.isArray(data)
      ? data
      : (data.applications || data.leads || []);

    if (!Array.isArray(rawList)) {
      return { success: false, leads: [], count: 0 };
    }

    // Map all backend records with complete schema fields
    const mappedList = rawList.map((item, idx) => mapBackendLead(item, idx)).filter(Boolean);

    // Sort newest first by created_at / updatedAt timestamp
    mappedList.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.created_at || a.created || 0).getTime() || 0;
      const timeB = new Date(b.updatedAt || b.created_at || b.created || 0).getTime() || 0;
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
 * Update CRM status or selected lender on backend
 * Always save through the PATCH API, never localStorage only.
 */
export async function updateLoanApplication(id, updates = {}) {
  if (!id) return { success: false, error: 'Application ID is required' };
  const cleanId = String(id).trim();

  const payload = {};
  if (updates.status !== undefined) {
    payload.status = normalizeStatus(updates.status);
  }
  if (updates.selectedLenderId !== undefined) {
    payload.selectedLenderId = (!updates.selectedLenderId || updates.selectedLenderId === 'Pending Selection')
      ? null
      : String(updates.selectedLenderId);
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
    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/phone/${encodeURIComponent(cleanPhone)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...authHeaders
      }
    });

    if (res.ok) {
      const data = await res.json();
      const rawApp = data?.application || data?.lead || data;
      const mapped = mapBackendLead(rawApp);
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
