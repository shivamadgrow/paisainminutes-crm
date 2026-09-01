/**
 * Unified API Client for Paisa in Minutes CRM
 * Supports Hostinger Subdomain (crm.paisainminutes.com), Main Domain (paisainminutes.com), and Localhost Dev.
 * Features Comprehensive Color-Coded Console Logging for Debugging Network & Data Flow.
 */

// Candidate Base URLs in fallback priority
const API_BASES = [
  '',                                 // 1. Current Origin (Relative)
  'https://paisainminutes.com',       // 2. Production Main Domain
  'https://www.paisainminutes.com',   // 3. Production WWW Main Domain
  'https://crm.paisainminutes.com'    // 4. Subdomain direct
];

/**
 * Universal Fetch with Comprehensive Step-by-Step Console Logging
 */
export async function fetchApi(pathWithSlash, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = pathWithSlash.startsWith('/') ? pathWithSlash : `/${pathWithSlash}`;
  
  console.groupCollapsed(
    `%c[CRM API REQUEST]%c ${method} %c${cleanPath}`, 
    'background: #1e293b; color: #38bdf8; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'background: #0284c7; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #0f172a; font-weight: bold;'
  );
  
  if (options.body) {
    try {
      console.log('%c📤 Request Payload (Body):', 'color: #8b5cf6; font-weight: bold;', JSON.parse(options.body));
    } catch (e) {
      console.log('%c📤 Request Payload (Raw):', 'color: #8b5cf6; font-weight: bold;', options.body);
    }
  }

  // Generate candidate URLs in order
  const candidateUrls = [];
  for (const base of API_BASES) {
    const rawUrl = `${base}${cleanPath}`;
    candidateUrls.push(rawUrl);
    if (!cleanPath.endsWith('.php') && !cleanPath.includes('?')) {
      candidateUrls.push(`${base}${cleanPath}.php`);
    }
  }

  console.log('%c📋 Candidate Endpoints Order:', 'color: #64748b;', candidateUrls);

  let lastError = null;
  let attemptCount = 0;

  for (const url of candidateUrls) {
    attemptCount++;
    try {
      console.log(`%c[Attempt #${attemptCount}]%c Trying endpoint: %c${url}`, 'color: #d97706; font-weight: bold;', 'color: #64748b;', 'color: #2563eb; font-weight: bold;');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
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
          console.warn(`%c⚠️ URL responded 200 OK but body was not JSON: ${url}`, 'color: #f59e0b;');
          continue;
        }

        console.log(
          `%c[CRM API SUCCESS] ✅ HTTP ${res.status} from %c${url}`,
          'background: #065f46; color: #34d399; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
          'color: #059669; font-weight: bold;',
          responseJson
        );
        console.groupEnd();

        return {
          ok: true,
          status: res.status,
          url: url,
          data: responseJson,
          json: async () => responseJson
        };
      } else {
        console.warn(`%c[Attempt #${attemptCount} Failed] ⚠️ HTTP ${res ? res.status : 'No Response'} from ${url}`, 'color: #ea580c;');
      }
    } catch (e) {
      lastError = e;
      console.warn(`%c[Attempt #${attemptCount} Error] ❌ ${e.message || e} on ${url}`, 'color: #dc2626;');
    }
  }

  console.error('%c[CRM API ALL FALLBACKS FAILED] ❌ Could not reach any backend endpoint for ' + cleanPath, 'color: #ef4444; font-weight: bold;', lastError);
  console.groupEnd();

  return null;
}

/**
 * Fetch Leads from Backend with Full Diagnostics
 */
export async function getLeadsFromBackend() {
  console.log('%c[CRM SYNC] 📡 Polling live leads data from backend...', 'color: #6366f1; font-weight: bold;');

  const endpoints = [
    '/admin/api/get-leads.php',
    '/admin/api/get-leads',
    '/crm/api/get-leads.php',
    '/api/get-leads.php',
    '/api/get-leads',
    '/crm.php?action=fetch_realtime'
  ];

  for (const ep of endpoints) {
    const res = await fetchApi(ep);
    if (res && res.ok && res.data) {
      const data = res.data;
      const leads = Array.isArray(data.leads) 
        ? data.leads 
        : (data.data && Array.isArray(data.data.leads) ? data.data.leads : null);

      if (leads && Array.isArray(leads)) {
        console.log(
          `%c[CRM DATA SOURCE] 📂 Leads successfully loaded from %c${res.url}%c | Total: %c${leads.length} leads`,
          'color: #0284c7; font-weight: bold;',
          'color: #059669; font-weight: bold; text-decoration: underline;',
          'color: #0284c7; font-weight: bold;',
          'color: #dc2626; font-weight: bold;',
          { endpoint: res.url, total: leads.length, serverDebug: data }
        );
        return { success: true, count: leads.length, leads, sourceUrl: res.url, raw: data };
      }
    }
  }

  console.warn('%c[CRM SYNC] ⚠️ No live leads endpoint responded. Returning empty list [].', 'color: #d97706; font-weight: bold;');
  return { success: false, leads: [], count: 0 };
}

/**
 * Delete Leads API with Full Console Logging
 */
export async function deleteLeadsApi(payload) {
  console.log('%c[CRM DELETE API] 🗑️ Initiating delete request with payload:', 'color: #dc2626; font-weight: bold;', payload);

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
      console.log('%c[CRM DELETE API] ✅ Deletion confirmed by server:', 'color: #10b981; font-weight: bold;', res.data);
      return { success: true, ...res.data, endpoint: res.url };
    }
  }

  console.error('%c[CRM DELETE API] ❌ All delete endpoints failed to execute deletion.', 'color: #ef4444; font-weight: bold;');
  return { success: false, error: 'Failed to connect to delete endpoint' };
}
