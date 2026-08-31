/**
 * Unified API Client for Paisa in Minutes CRM
 * Seamlessly supports both https://crm.paisainminutes.com and https://paisainminutes.com
 */

const API_BASES = [
  '',
  'https://paisainminutes.com',
  'https://www.paisainminutes.com'
];

export async function fetchApi(pathWithSlash, options = {}) {
  const cleanPath = pathWithSlash.startsWith('/') ? pathWithSlash : `/${pathWithSlash}`;
  
  // Try candidate URLs in order
  const candidateUrls = [];
  
  for (const base of API_BASES) {
    candidateUrls.push(`${base}${cleanPath}`);
    if (!cleanPath.endsWith('.php') && !cleanPath.includes('?')) {
      candidateUrls.push(`${base}${cleanPath}.php`);
    }
  }

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      if (res && res.ok) {
        return res;
      }
    } catch (e) {
      // Continue to next fallback
    }
  }

  return null;
}

export async function getLeadsFromBackend() {
  const endpoints = [
    '/admin/api/get-leads',
    '/admin/api/get-leads.php',
    '/api/get-leads',
    '/api/get-leads.php',
    '/crm/api/get-leads.php',
    '/crm.php?action=fetch_realtime'
  ];

  for (const ep of endpoints) {
    const res = await fetchApi(ep);
    if (res && res.ok) {
      try {
        const data = await res.json();
        const leads = Array.isArray(data.leads) ? data.leads : (data.data && Array.isArray(data.data.leads) ? data.data.leads : null);
        if (leads && leads.length >= 0) {
          return { success: true, count: leads.length, leads };
        }
      } catch (e) {}
    }
  }

  return { success: false, leads: [] };
}
