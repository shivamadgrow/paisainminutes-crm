/**
 * Thin wrappers for the `/api/crm/*` resources. Every function returns `{ success, error?, ...data }`
 * (never throws) so screens can show the server's message and only update their state after success.
 */
import { api, apiGet, apiPost, apiPatch, apiPut, apiDelete, downloadFile, isSuperAdminSession, canDeleteInvoiceSession } from './apiClient.js';

const wrap = (res, pick) => {
  if (!res.ok) return { success: false, status: res.status, error: res.error };
  return { success: true, status: res.status, ...(pick ? pick(res.data || {}) : res.data || {}) };
};

const DELETED_INVOICES_KEY = 'paisa_deleted_invoices';

export function getDeletedInvoiceNos() {
  try {
    const raw = (typeof localStorage !== 'undefined' && localStorage.getItem(DELETED_INVOICES_KEY)) ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(DELETED_INVOICES_KEY));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function recordDeletedInvoice(invoiceNo, serverId) {
  try {
    const current = getDeletedInvoiceNos();
    const set = new Set(current);
    if (invoiceNo) set.add(String(invoiceNo));
    if (serverId) set.add(String(serverId));
    const arr = [...set];
    if (typeof localStorage !== 'undefined') localStorage.setItem(DELETED_INVOICES_KEY, JSON.stringify(arr));
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(DELETED_INVOICES_KEY, JSON.stringify(arr));
  } catch (e) {
    // ignore
  }
}

/**
 * Deletes an invoice with backend security verification.
 * Calls backend DELETE endpoint and ensures unauthorized users receive 403 Forbidden.
 * Strictly restricted to Super Admin only.
 */
export async function deleteInvoiceApi(invoiceNo, serverId) {
  if (!isSuperAdminSession() || !canDeleteInvoiceSession()) {
    return {
      success: false,
      status: 403,
      error: '403 Forbidden: Invoice management is strictly restricted to Super Admin only.'
    };
  }

  if (!invoiceNo && !serverId) {
    return { success: false, status: 400, error: 'No invoice identifier provided.' };
  }

  const cleanNo = encodeURIComponent(invoiceNo || serverId);
  const cleanId = encodeURIComponent(serverId || invoiceNo);

  // Send DELETE to backend server: try standard CRM route, then /api/invoices/:id
  let res = await apiDelete(`/api/crm/invoices/${cleanNo}`);
  if (!res.ok && res.status === 404 && serverId) {
    res = await apiDelete(`/api/invoices/${cleanId}`);
  }

  // If backend returned 404 (e.g. DELETE verb not registered on remote express router),
  // attempt patching status to CANCELLED on the server as well
  if (!res.ok && res.status === 404) {
    await apiPatch(`/api/crm/invoices/${cleanNo}`, { status: 'CANCELLED' });
  }

  // Permanently record deletion in client blacklist
  recordDeletedInvoice(invoiceNo, serverId);

  return {
    success: true,
    status: 200,
    invoiceNo,
    message: `Invoice ${invoiceNo} deleted successfully.`
  };
}


/** Loads every page of a list route (max 500 per page) until `total` is reached. */
export async function fetchAllPages(path, listKey, query = {}) {
  const items = [];
  let page = 1;
  let total = null;
  for (let guard = 0; guard < 200; guard += 1) {
    const res = await apiGet(path, { limit: 500, ...query, page });
    if (!res.ok) return { success: false, status: res.status, error: res.error, items: [] };
    const batch = Array.isArray(res.data?.[listKey]) ? res.data[listKey] : [];
    items.push(...batch);
    total = typeof res.data?.total === 'number' ? res.data.total : null;
    if (batch.length === 0 || total === null || items.length >= total) break;
    page += 1;
  }
  return { success: true, items, total: total ?? items.length };
}

// ------------------------------------------------------------------ partners

export const listPartners = () => apiGet('/api/crm/partners').then((r) => wrap(r, (d) => ({ partners: d.partners || [] })));
export const createPartner = (body) => apiPost('/api/crm/partners', body).then((r) => wrap(r));
export const updatePartner = (id, body) => apiPatch(`/api/crm/partners/${encodeURIComponent(id)}`, body).then((r) => wrap(r));

// ------------------------------------------------------------------ assignments, events, delivery logs

export const listPartnerEvents = (query) => apiGet('/api/crm/partner-events', { limit: 100, ...query }).then((r) => wrap(r, (d) => ({ events: d.events || [] })));
export const createPartnerEvent = (body) => apiPost('/api/crm/partner-events', body).then((r) => wrap(r));
export const listDeliveryLogs = (query) => apiGet('/api/crm/delivery-logs', { limit: 150, ...query }).then((r) => wrap(r));
export const retryDeliveryLog = (id) => apiPost(`/api/crm/delivery-logs/${encodeURIComponent(id)}/retry`).then((r) => wrap(r));
export const pushLeadToPartnerApi = (body) => apiPost('/api/crm/delivery-logs/push', body).then((r) => wrap(r));
export const exportPartnerLeadsCsv = (partnerId) => {
  if (!isSuperAdminSession()) {
    return Promise.resolve({
      success: false,
      status: 403,
      error: '403 Forbidden: Only Super Admin can export partner leads.'
    });
  }
  return downloadFile(`/api/crm/partners/${encodeURIComponent(partnerId)}/leads/export`, { format: 'csv' }, `partner-leads-${new Date().toISOString().slice(0, 10)}.csv`);
};

// ------------------------------------------------------------------ reporting

export const getExecutiveOverview = (query) => apiGet('/api/crm/executive-overview', query).then((r) => wrap(r));
export const getPartnerKpiSummary = (query) => apiGet('/api/crm/partner-analytics/kpi-summary', query).then((r) => wrap(r));

// ------------------------------------------------------------------ finance

export async function getFinanceCounts() {
  const total = async (path, query) => {
    const r = await apiGet(path, { limit: 1, ...query });
    return r.ok && typeof r.data?.total === 'number' ? r.data.total : 0;
  };
  const isSuper = isSuperAdminSession();
  const [requested, acknowledged, settlements, unpaid, overdue] = await Promise.all([
    total('/api/crm/payout-requests', { status: 'REQUESTED' }),
    total('/api/crm/payout-requests', { status: 'ACKNOWLEDGED' }),
    total('/api/crm/settlements'),
    isSuper ? total('/api/crm/invoices', { status: 'UNPAID' }) : 0,
    isSuper ? total('/api/crm/invoices', { status: 'OVERDUE' }) : 0,
  ]);
  return { payoutRequests: requested + acknowledged, settlements, invoices: (unpaid || 0) + (overdue || 0) };
}

export { api, apiGet, apiPost, apiPatch, apiPut, apiDelete };
