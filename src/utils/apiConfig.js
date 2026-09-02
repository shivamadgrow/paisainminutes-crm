/**
 * Unified API Client for Paisa in Minutes CRM
 * Supports Hostinger Subdomain (crm.paisainminutes.com), Main Domain (paisainminutes.com),
 * Render Cloud Backend API (https://paisainminutes.onrender.com), and Localhost Dev.
 */

const RENDER_BASE = 'https://paisainminutes.onrender.com';

// Candidate Base URLs in fallback priority
const API_BASES = [
  '',                                 // 1. Current Origin (Relative)
  'https://paisainminutes.com',       // 2. Production Main Domain
  'https://www.paisainminutes.com',   // 3. Production WWW Main Domain
  'https://crm.paisainminutes.com',   // 4. Subdomain direct
  RENDER_BASE                         // 5. Render Backend
];

function mapRenderLead(item, index) {
  if (!item) return null;
  const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
  const formattedMobile = rawPhone ? (rawPhone.length === 10 ? `+91 ${rawPhone}` : rawPhone) : '—';
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
    phone: rawPhone || formattedMobile,
    phoneNumber: rawPhone,
    email: item.email && !item.email.includes('@paisainminutes.com') ? item.email : '—',
    emailAddress: item.email && !item.email.includes('@paisainminutes.com') ? item.email : '—',
    creditManager: item.creditManager || 'Unassigned',
    pan: (item.pan || (item.user && item.user.pan) || '—').toUpperCase(),
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
    assignedCompany: item.assignedCompany || (isPhoneOnly ? 'Pending Details' : (cleanSalary >= 30000 ? 'Rupay91' : 'Rupaysure')),
    eligibilityStatus: isPhoneOnly ? 'Incomplete / Phone Only' : (item.eligibilityStatus || 'Eligible'),
    source: item.source || (isPhoneOnly ? 'Apply Now (Phone Only)' : 'Render API / Apply Now'),
    purpose: item.purpose || 'Personal Loan',
    status: item.status || 'Fresh',
    created: item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN'),
    created_at: item.createdAt || new Date().toISOString(),
    date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

/**
 * Universal Fetch with Comprehensive Step-by-Step Console Logging
 */
export async function fetchApi(pathWithSlash, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = pathWithSlash.startsWith('/') ? pathWithSlash : `/${pathWithSlash}`;

  // Generate candidate URLs in order
  const candidateUrls = [];
  for (const base of API_BASES) {
    const rawUrl = `${base}${cleanPath}`;
    candidateUrls.push(rawUrl);
    if (!cleanPath.endsWith('.php') && !cleanPath.includes('?') && !base.includes('onrender.com')) {
      candidateUrls.push(`${base}${cleanPath}.php`);
    }
  }

  let lastError = null;
  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
      const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          ...authHeaders,
          ...(options.headers || {})
        }
      });
      clearTimeout(timeoutId);

      if (res && res.ok) {
        let responseJson = null;
        try {
          const text = await res.text();
          responseJson = text ? JSON.parse(text) : {};
        } catch (parseErr) {
          continue;
        }

        return {
          ok: true,
          status: res.status,
          url: url,
          data: responseJson,
          json: async () => responseJson
        };
      }
    } catch (e) {
      lastError = e;
    }
  }

  return null;
}

/**
 * Helper to check and maintain locally deleted leads blacklist
 */
export function getDeletedLeadBlacklist() {
  try {
    const raw = localStorage.getItem('pim_deleted_leads');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
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
      .map(i => String(i).trim().toLowerCase());
    const combined = Array.from(new Set([...current, ...cleanList]));
    localStorage.setItem('pim_deleted_leads', JSON.stringify(combined));
  } catch (e) {}
}

export function isLeadDeletedLocally(lead, deletedList) {
  if (!deletedList || deletedList.length === 0) return false;
  if (deletedList.includes('*')) return true;

  const id = String(lead.id || lead.lead_id || lead.loanNo || '').trim().toLowerCase();
  const rawPhone = String(lead.phone || lead.mobile || lead.phoneNumber || '').replace(/\D/g, '').slice(-10);

  if (id && deletedList.includes(id)) return true;
  if (rawPhone && deletedList.includes(rawPhone)) return true;
  return false;
}

/**
 * Fetch Leads from Backend (Local stores + Render API)
 */
export async function getLeadsFromBackend() {
  const endpoints = [
    '/admin/api/get-leads.php',
    '/admin/api/get-leads',
    '/crm/api/get-leads.php',
    '/api/get-leads.php',
    '/api/get-leads',
    '/crm.php?action=fetch_realtime'
  ];

  const deletedBlacklist = getDeletedLeadBlacklist();
  if (deletedBlacklist.includes('*')) {
    return { success: true, count: 0, leads: [] };
  }

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
      if (l.assignedCompany && l.assignedCompany !== 'Pending Details') {
        existing.assignedCompany = l.assignedCompany;
      }
      return;
    }

    if (id && leadsById.has(id)) {
      return;
    }

    if (phoneKey) leadsByPhone.set(phoneKey, l);
    if (id) leadsById.set(id, l);
  }

  // 1. Fetch from local endpoints
  for (const ep of endpoints) {
    const res = await fetchApi(ep);
    if (res && res.ok && res.data) {
      const data = res.data;
      const leads = Array.isArray(data.leads) 
        ? data.leads 
        : (data.data && Array.isArray(data.data.leads) ? data.data.leads : null);

      if (leads && Array.isArray(leads) && leads.length > 0) {
        for (const l of leads) {
          mergeOrAddLead(l);
        }
        break;
      }
    }
  }

  // 2. Also fetch and merge from Render Cloud database
  try {
    const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
    const renderHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    const renderRes = await fetch(`${RENDER_BASE}/api/loan-applications/all`, {
      headers: { 'Accept': 'application/json', ...renderHeaders }
    });

    if (renderRes.ok) {
      const rData = await renderRes.json();
      const rList = Array.isArray(rData) ? rData : (rData.applications || rData.leads || []);
      if (Array.isArray(rList)) {
        rList.forEach((item, idx) => {
          const mapped = mapRenderLead(item, idx);
          if (mapped) {
            mergeOrAddLead(mapped);
          }
        });
      }
    }
  } catch (err) {
    // Render offline / background sync
  }

  // Combine unique leads list
  const combinedLeads = Array.from(
    new Set([...leadsByPhone.values(), ...leadsById.values()])
  ).filter(l => !isLeadDeletedLocally(l, deletedBlacklist));

  return { success: true, count: combinedLeads.length, leads: combinedLeads };
}

/**
 * Delete Leads API
 */
export async function deleteLeadsApi(payload) {
  const isClearAll = payload.clear_all || payload.all || (payload.ids && payload.ids.includes('*')) || payload.action === 'reset_all' || payload.action === 'clear_all';

  if (isClearAll) {
    localStorage.setItem('pim_deleted_leads', JSON.stringify(['*']));
  } else {
    const toAdd = [];
    if (payload.id) toAdd.push(String(payload.id).toLowerCase());
    if (payload.leadId) toAdd.push(String(payload.leadId).toLowerCase());
    if (payload.ids && Array.isArray(payload.ids)) {
      payload.ids.forEach(i => toAdd.push(String(i).toLowerCase()));
    }
    if (payload.phone) {
      const p = String(payload.phone).replace(/\D/g, '').slice(-10);
      if (p) toAdd.push(p);
    }
    if (payload.mobile) {
      const m = String(payload.mobile).replace(/\D/g, '').slice(-10);
      if (m) toAdd.push(m);
    }
    addToDeletedLeadBlacklist(toAdd);
  }

  const deleteEndpoints = [
    '/admin/api/delete-lead.php',
    '/admin/api/delete-lead',
    '/crm/api/delete-lead.php',
    '/api/delete-lead.php',
    '/api/delete-lead'
  ];

  for (const ep of deleteEndpoints) {
    const res = await fetchApi(ep, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res && res.ok && res.data) {
      break;
    }
  }

  // Also notify Render API of deletion
  try {
    const token = localStorage.getItem('pim_jwt_token') || sessionStorage.getItem('pim_jwt_token');
    const renderHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
    const targetId = payload.id || payload.leadId;
    if (targetId && !isClearAll) {
      fetch(`${RENDER_BASE}/api/loan-applications/${targetId}`, {
        method: 'DELETE',
        headers: renderHeaders
      }).catch(() => {});
    }
  } catch (err) {}

  return { success: true, is_clear_all: isClearAll };
}
