/**
 * Unified API Client for Paisa in Minutes CRM
 * Single Source of Truth Backend API: https://api.paisainminutes.tech
 */

import { formatToIST } from './amountHelpers';

const BACKEND_BASE = 'https://api.paisainminutes.tech';
export { BACKEND_BASE };

function mapBackendLead(item, index) {
  if (!item) return null;
  const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
  if (!rawPhone || rawPhone.length < 10) return null;

  const todayIso = new Date().toISOString().split('T')[0];
  const itemDate = item.createdAt ? item.createdAt.split('T')[0] : todayIso;

  const formattedMobile = `+91 ${rawPhone}`;
  const rawName = (item.name || item.fullName || (item.user && item.user.name) || 'Applicant').trim();
  const initials = rawName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2) || 'AP';
  const leadId = item.id || item._id || item.loanNo || `PIM-${item.id || (index + 1001)}`;

  const cleanLoan = Number(item.amount || item.loanAmount) || 0;
  const cleanSalary = Number(item.monthlyIncome || item.salary) || 0;
  const isPhoneOnly = (rawName === 'Applicant' || !rawName) && cleanLoan === 0 && cleanSalary === 0;

  return {
    id: String(leadId),
    loanNo: String(leadId),
    lead_id: String(leadId),
    name: rawName,
    fullName: rawName,
    initials: initials,
    avatarBg: 'bg-blue-600',
    mobile: formattedMobile,
    phone: rawPhone,
    phoneNumber: rawPhone,
    email: item.email && !item.email.includes('@paisainminutes.com') ? item.email : '—',
    emailAddress: item.email && !item.email.includes('@paisainminutes.com') ? item.email : '—',
    creditManager: item.creditManager || 'Unassigned',
    pan: (item.pan || (item.user && item.user.pan) || '—').toUpperCase(),
    dob: item.dob || item.dateOfBirth || item.date_of_birth || '—',
    dateOfBirth: item.dateOfBirth || item.dob || item.date_of_birth || '—',
    gender: item.gender || '—',
    addressType: item.addressType || item.address_type || 'Rented',
    address_type: item.address_type || item.addressType || 'Rented',
    salaryMode: item.salaryMode || item.modeOfSalary || item.mode_of_salary || 'Bank Transfer',
    modeOfSalary: item.modeOfSalary || item.salaryMode || item.mode_of_salary || 'Bank Transfer',
    mode_of_salary: item.mode_of_salary || item.salaryMode || item.modeOfSalary || 'Bank Transfer',
    companyName: item.companyName || item.company_name || item.employer || '—',
    company_name: item.company_name || item.companyName || item.employer || '—',
    haveCreditCard: item.haveCreditCard || item.have_credit_card || 'No',
    have_credit_card: item.have_credit_card || item.haveCreditCard || 'No',
    creditCardLimit: item.creditCardLimit || item.credit_card_limit || null,
    credit_card_limit: item.credit_card_limit || item.creditCardLimit || null,
    cibil: item.cibil || '—',
    cibilScore: item.cibil || '—',
    applied: cleanLoan,
    loanAmount: cleanLoan,
    salary: cleanSalary,
    monthlySalary: cleanSalary,
    city: item.city || '—',
    state: item.state || '—',
    pincode: item.pincode || '—',
    employmentType: item.employmentType || 'Salaried',
    assignedCompany: item.selectedLenderId || item.assignedCompany || (isPhoneOnly ? 'Pending Details' : 'Pending Selection'),
    eligibilityStatus: isPhoneOnly ? 'Incomplete / Phone Only' : (item.eligibilityStatus || 'Eligible'),
    source: item.source || (isPhoneOnly ? 'Apply Now (Phone Only)' : 'Apply Now (Website)'),
    utm_source: item.utm_source || null,
    lead_source: item.lead_source || null,
    purpose: item.purpose || 'Personal Loan',
    status: item.status || 'Fresh',
    created: formatToIST(item.createdAt || new Date()).full,
    created_at: item.createdAt || new Date().toISOString(),
    created_time: formatToIST(item.createdAt || new Date()).time,
    date: formatToIST(item.createdAt || new Date()).date
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
  const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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
 * Helper to check and maintain locally deleted leads blacklist
 */
const UNBLOCKED_LEAD_KEYS = ['pim-20260921-7609', 'pim-20260921-3514', 'pim-20260922-7609', '8470087609'];

export function getDeletedLeadBlacklist() {
  try {
    const raw = localStorage.getItem('pim_deleted_leads');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // Remove legacy '*' wildcard, 10-digit phone numbers, and explicitly unblocked IDs
    const filtered = arr.filter(x => x !== '*' && !/^[6-9]\d{9}$/.test(String(x).trim()) && !UNBLOCKED_LEAD_KEYS.includes(String(x).trim().toLowerCase()));
    if (filtered.length !== arr.length) {
      localStorage.setItem('pim_deleted_leads', JSON.stringify(filtered));
    }
    return filtered;
  } catch (e) {
    return [];
  }
}

export function addToDeletedLeadBlacklist(idsOrPhones) {
  try {
    const current = getDeletedLeadBlacklist();
    const newItems = Array.isArray(idsOrPhones) ? idsOrPhones : [idsOrPhones];
    const cleanList = newItems
      .filter(Boolean)
      .filter(i => i !== '*' && !/^[6-9]\d{9}$/.test(String(i).trim()) && !UNBLOCKED_LEAD_KEYS.includes(String(i).trim().toLowerCase())) // Do not blacklist raw phone numbers or unblocked keys
      .map(i => String(i).trim().toLowerCase());
    const combined = Array.from(new Set([...current, ...cleanList]));
    localStorage.setItem('pim_deleted_leads', JSON.stringify(combined));
  } catch (e) { }
}

export const LIVE_LAUNCH_TIMESTAMP = 1789151400000; // 2026-09-12T00:00:00+05:30

export function isLeadDeletedLocally(lead, deletedList) {
  if (!lead) return true;

  const id = String(lead.id || lead.lead_id || lead.loanNo || '').trim().toLowerCase();
  const phone = String(lead.phone || lead.mobile || lead.phoneNumber || '').replace(/\D/g, '').slice(-10);

  // 1. If lead ID or phone is in deleted blacklist, it is deleted
  if (id && deletedList && deletedList.includes(id)) {
    return true;
  }
  if (phone && deletedList && deletedList.includes(phone)) {
    return true;
  }

  // 2. Pre-launch testing leads filter: Any lead created before 12 Sep 2026 IST is a test lead
  const leadTime = new Date(lead.created_at || lead.createdAt || lead.created || lead.date || 0).getTime();
  if (leadTime > 0 && leadTime < LIVE_LAUNCH_TIMESTAMP) {
    return true;
  }

  return false;
}

export const LEAD_OVERRIDES_STORAGE_KEY = 'paisa_crm_lead_overrides';

export function getLeadOverrides() {
  try {
    const raw = localStorage.getItem(LEAD_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
}

export function saveLeadOverride(leadIdOrPhone, updates) {
  try {
    if (!leadIdOrPhone || !updates) return;
    const current = getLeadOverrides();
    const key = String(leadIdOrPhone).trim();
    if (!key) return;
    current[key] = {
      ...(current[key] || {}),
      ...updates,
      _updatedAt: Date.now()
    };
    localStorage.setItem(LEAD_OVERRIDES_STORAGE_KEY, JSON.stringify(current));
  } catch (e) { }
}

export function applyLeadOverrides(lead) {
  if (!lead) return lead;
  const overrides = getLeadOverrides();
  const id = String(lead.id || lead.lead_id || lead.loanNo || '').trim();
  const rawPhone = String(lead.phone || lead.mobile || lead.phoneNumber || '').replace(/\D/g, '').slice(-10);

  const ov = (id && overrides[id]) || (rawPhone && overrides[rawPhone]);
  if (ov) {
    if (ov.assignedCompany) {
      lead.assignedCompany = ov.assignedCompany;
      lead.partner_name = ov.assignedCompany;
    }
    if (ov.status) {
      lead.status = ov.status;
    }
    if (ov.city) {
      lead.city = ov.city;
    }
    if (ov.eligibilityStatus) {
      lead.eligibilityStatus = ov.eligibilityStatus;
    }
  }
  return lead;
}

/**
 * Fetch Leads directly from Node.js Backend Server (https://api.paisainminutes.tech)
 */
export async function getLeadsFromBackend(options = {}) {
  const deletedBlacklist = getDeletedLeadBlacklist();

  const leadsByPhone = new Map();
  const leadsById = new Map();

  function mergeOrAddLead(l) {
    if (!l) return;
    if (isLeadDeletedLocally(l, deletedBlacklist)) {
      return; // Skip lead deleted by user
    }

    const rawPhone = String(l.phone || l.mobile || l.phoneNumber || (l.user && l.user.phone) || '').replace(/\D/g, '').slice(-10);
    const id = String(l.id || l.lead_id || l.loanNo || '');
    const phoneKey = (rawPhone && rawPhone.length === 10) ? rawPhone : null;

    if (phoneKey) {
      l.phone = phoneKey;
      l.phoneNumber = phoneKey;
      l.mobile = `+91 ${phoneKey}`;
    }

    if (phoneKey && leadsByPhone.has(phoneKey)) {
      const existing = leadsByPhone.get(phoneKey);
      const isSameLeadId = existing.id === l.id || existing.lead_id === l.lead_id;
      const isStepUpgrade = (existing.name === 'Applicant' || !existing.name) && l.name && l.name !== 'Applicant';
      const timeDiff = Math.abs(new Date(l.created_at || l.created || 0).getTime() - new Date(existing.created_at || existing.created || 0).getTime());
      const isCloseInTime = !isNaN(timeDiff) && timeDiff < 120000; // within 2 minutes

      if (isSameLeadId || isStepUpgrade || isCloseInTime) {
        const newTime = new Date(l.created_at || l.created || l.date || 0).getTime() || 0;
        const oldTime = new Date(existing.created_at || existing.created || existing.date || 0).getTime() || 0;

        // Merge best fields: keep non-generic name, non-default amounts, richest source
        if ((existing.name === 'Applicant' || !existing.name) && l.name && l.name !== 'Applicant') {
          existing.name = l.name;
          existing.fullName = l.fullName || l.name;
          existing.initials = l.initials || existing.initials;
        }
        if ((existing.source === 'Website Application' || existing.source === 'Apply Now (Phone Only)') && l.source === 'Check Eligibility Website') {
          existing.source = l.source;
        }
        if ((!existing.cibil || existing.cibil === '—') && l.cibil && l.cibil !== '—') {
          existing.cibil = l.cibil;
          existing.cibilScore = l.cibilScore || l.cibil;
        }
        if ((!existing.loanAmount || existing.loanAmount === 0) && Number(l.loanAmount) > 0) {
          existing.loanAmount = Number(l.loanAmount);
          existing.applied = Number(l.loanAmount);
        }
        if ((!existing.salary || existing.salary === 0) && Number(l.salary) > 0) {
          existing.salary = Number(l.salary);
          existing.monthlySalary = Number(l.salary);
        }
        if (l.email && l.email !== '—' && (!existing.email || existing.email === '—')) {
          existing.email = l.email;
          existing.emailAddress = l.email;
        }
        if (l.pincode && l.pincode !== '—' && (!existing.pincode || existing.pincode === '—')) {
          existing.pincode = l.pincode;
        }
        if (l.city && l.city !== '—' && (!existing.city || existing.city === '—')) {
          existing.city = l.city;
        }
        if (l.eligibilityStatus && l.eligibilityStatus !== 'Incomplete / Phone Only') {
          existing.eligibilityStatus = l.eligibilityStatus;
        }
        if ((!existing.assignedCompany || existing.assignedCompany === 'Pending Details' || existing.assignedCompany === 'Unassigned') && l.assignedCompany && l.assignedCompany !== 'Pending Details') {
          existing.assignedCompany = l.assignedCompany;
        }
        if ((!existing.status || existing.status === 'Fresh') && l.status && l.status !== 'Fresh') {
          existing.status = l.status;
        }
        if (l.appliedTo && l.appliedTo !== 'Not Applied Yet') {
          existing.appliedTo = l.appliedTo;
          existing.applied_to = l.appliedTo;
        }
        if (l.clicked_partner) existing.clicked_partner = l.clicked_partner;
        if (l.delivery_status && l.delivery_status !== 'none') existing.delivery_status = l.delivery_status;
        if (l.delivery_partner) existing.delivery_partner = l.delivery_partner;
        if (l.remarks) existing.remarks = l.remarks;
        if (l.is_phone_masked !== undefined) existing.is_phone_masked = l.is_phone_masked;

        // If newer submission, update timestamps and ID so it displays at the top
        if (newTime >= oldTime) {
          existing.id = l.id || existing.id;
          existing.loanNo = l.loanNo || existing.loanNo;
          existing.lead_id = l.lead_id || existing.lead_id;
          existing.created = l.created || existing.created;
          existing.created_at = l.created_at || existing.created_at;
          existing.created_time = l.created_time || existing.created_time;
          existing.date = l.date || existing.date;
          if (l.status) existing.status = l.status;
        }
        return;
      }
    }

    if (id && leadsById.has(id)) {
      return;
    }

    if (phoneKey) leadsByPhone.set(phoneKey, l);
    if (id) leadsById.set(id, l);
  }

  // 1. Direct fetch from Node.js Backend (https://api.paisainminutes.tech/api/loan-applications/all)
  try {
    const res = await fetchApi('/api/loan-applications/all');
    if (res && res.ok && res.data) {
      const rawList = Array.isArray(res.data)
        ? res.data
        : (res.data.applications || res.data.leads || []);

      if (Array.isArray(rawList)) {
        rawList.forEach((item, idx) => {
          const mapped = mapBackendLead(item, idx);
          if (mapped) {
            mergeOrAddLead(mapped);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[CRM DIRECT BACKEND SYNC ERROR]:', err);
  }

  // Combine unique leads list and apply user persistent overrides
  const combinedLeads = Array.from(
    new Set([...leadsByPhone.values(), ...leadsById.values()])
  ).filter(l => !isLeadDeletedLocally(l, deletedBlacklist))
    .map(applyLeadOverrides);

  // Sort newest first by created_at / created timestamp
  combinedLeads.sort((a, b) => {
    const timeA = new Date(a.created_at || a.created || a.date || 0).getTime() || 0;
    const timeB = new Date(b.created_at || b.created || b.date || 0).getTime() || 0;
    return timeB - timeA;
  });

  return { success: true, count: combinedLeads.length, leads: combinedLeads };
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
    const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
    const backendHeaders = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/phone/${encodeURIComponent(cleanPhone)}`, {
      method: 'GET',
      headers: backendHeaders
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    } else {
      const errorText = await res.text().catch(() => '');
      return { success: false, status: res.status, error: errorText || 'Failed to fetch application' };
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
    const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
    const backendHeaders = {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch(`${BACKEND_BASE}/api/loan-applications/${encodeURIComponent(cleanId)}`, {
      method: 'DELETE',
      headers: backendHeaders
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
 * Delete Leads API (Synchronized with local stores, blacklist, and Render DELETE endpoint)
 */
export async function deleteLeadsApi(payload) {
  const isClearAll = payload.clear_all || payload.all || (payload.ids && payload.ids.includes('*')) || payload.action === 'reset_all' || payload.action === 'clear_all';

  const targetIds = [];
  if (payload.id) targetIds.push(String(payload.id));
  if (payload.leadId) targetIds.push(String(payload.leadId));
  if (payload.ids && Array.isArray(payload.ids)) {
    payload.ids.forEach(i => { if (i && i !== '*') targetIds.push(String(i)); });
  }

  // Only blacklist lead IDs, NEVER phone numbers
  const toAdd = targetIds.map(i => i.toLowerCase());
  if (toAdd.length > 0) {
    addToDeletedLeadBlacklist(toAdd);
  }

  // Directly call Node.js DELETE endpoint: DELETE https://api.paisainminutes.tech/api/loan-applications/{id}
  if (targetIds.length > 0 && !isClearAll) {
    for (const tid of targetIds) {
      deleteLoanApplicationOnRender(tid).catch(() => { });
    }
  }

  return { success: true, is_clear_all: isClearAll };
}
