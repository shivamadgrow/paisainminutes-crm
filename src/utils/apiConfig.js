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
    email: item.email || (rawPhone ? `${rawPhone}@paisainminutes.com` : '—'),
    emailAddress: item.email || (rawPhone ? `${rawPhone}@paisainminutes.com` : '—'),
    creditManager: item.creditManager || 'Unassigned',
    pan: (item.pan || (item.user && item.user.pan) || '—').toUpperCase(),
    cibil: item.cibil || '750+',
    cibilScore: item.cibil || '750+',
    applied: Number(item.amount || item.loanAmount) || 50000,
    loanAmount: Number(item.amount || item.loanAmount) || 50000,
    salary: Number(item.monthlyIncome || item.salary) || 35000,
    monthlySalary: Number(item.monthlyIncome || item.salary) || 35000,
    city: item.city || 'Delhi NCR',
    state: item.state || 'India',
    pincode: item.pincode || '110001',
    employmentType: item.employmentType || 'Salaried',
    assignedCompany: item.assignedCompany || (Number(item.monthlyIncome || item.salary) >= 30000 ? 'Rupay91' : 'Rupaysure'),
    eligibilityStatus: item.eligibilityStatus || 'Eligible',
    source: item.source || 'Render API / Apply Now',
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

  let combinedLeads = [];
  const seenIds = new Set();
  const seenPhones = new Set();

  // 1. Try local endpoints
  for (const ep of endpoints) {
    const res = await fetchApi(ep);
    if (res && res.ok && res.data) {
      const data = res.data;
      const leads = Array.isArray(data.leads) 
        ? data.leads 
        : (data.data && Array.isArray(data.data.leads) ? data.data.leads : null);

      if (leads && Array.isArray(leads) && leads.length > 0) {
        for (const l of leads) {
          const id = String(l.id || l.lead_id || l.loanNo);
          const p = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
          if (!seenIds.has(id)) {
            seenIds.add(id);
            if (p) seenPhones.add(p);
            combinedLeads.push(l);
          }
        }
        break;
      }
    }
  }

  // 2. Also try fetching from Render Cloud database
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
          if (mapped && !seenIds.has(mapped.id)) {
            seenIds.add(mapped.id);
            combinedLeads.unshift(mapped);
          }
        });
      }
    }
  } catch (err) {
    // Render offline or background sync
  }

  if (combinedLeads.length > 0) {
    return { success: true, count: combinedLeads.length, leads: combinedLeads };
  }

  return { success: false, leads: [], count: 0 };
}

/**
 * Delete Leads API
 */
export async function deleteLeadsApi(payload) {
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
      return { success: true, ...res.data, endpoint: res.url };
    }
  }

  return { success: false, error: 'Failed to connect to delete endpoint' };
}
