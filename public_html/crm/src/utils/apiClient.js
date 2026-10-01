/**
 * Single API client for the Paisa in Minutes CRM.
 *
 * Every request to the Node server goes through `api()`:
 *  - prefixes BACKEND_BASE,
 *  - attaches `Authorization: Bearer <accessToken>`,
 *  - on HTTP 401 refreshes the token pair ONCE (single flight) and retries ONCE,
 *    otherwise ends the session (the app then shows the login screen),
 *  - applies a timeout,
 *  - never throws: it always resolves to `{ ok, status, data, error }`.
 *
 * Token storage decision: access + refresh tokens live in `sessionStorage` (per browser tab, cleared when
 * the tab closes, never in long-lived `localStorage`). This matches how the CRM session already behaved
 * (a new window always asks for credentials). The server owns authorization; nothing stored here is trusted.
 */

const BACKEND_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) ||
  'https://api.paisainminutes.tech';

export { BACKEND_BASE };

const TOKEN_KEY = 'paisa_crm_tokens';
export const SESSION_EVENT = 'paisa_session_changed';
export const SESSION_EXPIRED_EVENT = 'paisa_session_expired';
const DEFAULT_TIMEOUT_MS = 20000;

// ---------------------------------------------------------------- token storage

let memoryTokens = null;

export function getTokens() {
  if (memoryTokens) return memoryTokens;
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.accessToken) {
        memoryTokens = parsed;
        return memoryTokens;
      }
    }
  } catch (e) {
    // sessionStorage unavailable: fall through to memory only
  }
  return null;
}

export function setTokens(tokens) {
  memoryTokens = tokens && tokens.accessToken ? { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken || null } : null;
  try {
    if (memoryTokens) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(memoryTokens));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // memory copy still works for this page load
  }
}

export function clearTokens() {
  setTokens(null);
}

// ---------------------------------------------------------------- helpers

function buildUrl(path, query) {
  const clean = path.startsWith('http') ? path : `${BACKEND_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return clean;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${clean}${clean.includes('?') ? '&' : '?'}${qs}` : clean;
}

function errorMessageFrom(status, data) {
  if (data && typeof data === 'object') {
    if (data.error) return String(data.error);
    if (data.message) return String(data.message);
  }
  if (status === 0) return 'Cannot reach the server. Check your connection and try again.';
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'Not found.';
  if (status === 409) return 'This conflicts with existing data.';
  if (status === 423) return 'Account temporarily locked. Try again later.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status === 503) return 'The service is temporarily unavailable. Please try again shortly.';
  return `Request failed (HTTP ${status}).`;
}

async function rawFetch(url, { method, headers, body, timeoutMs, responseType }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs || DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, { method, headers, body, signal: controller.signal });
    let data = null;
    let blob = null;
    if (responseType === 'blob') {
      blob = res.ok ? await res.blob() : null;
      if (!res.ok) data = await res.json().catch(() => null);
    } else {
      const text = await res.text().catch(() => '');
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = responseType === 'text' ? text : { raw: text.slice(0, 500) };
        }
      }
    }
    return { ok: res.ok, status: res.status, data, blob, headers: res.headers };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      data: null,
      blob: null,
      headers: null,
      networkError: e && e.name === 'AbortError' ? 'The request timed out.' : 'Cannot reach the server.',
    };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------- refresh (single flight)

let refreshInFlight = null;

async function refreshTokens() {
  if (refreshInFlight) return refreshInFlight;
  const current = getTokens();
  if (!current || !current.refreshToken) return false;
  refreshInFlight = (async () => {
    const res = await rawFetch(buildUrl('/api/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (res.ok && res.data && res.data.token) {
      setTokens({ accessToken: res.data.token, refreshToken: res.data.refreshToken || current.refreshToken });
      return true;
    }
    return false;
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/** Best-effort revocation of an old token pair on the server without touching the current session. */
export async function revokeTokens(tokens) {
  if (!tokens || !tokens.accessToken || !tokens.refreshToken) return;
  await rawFetch(buildUrl('/api/auth/staff/logout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${tokens.accessToken}` },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    timeoutMs: 8000,
  });
}

/** Ends the browser session (tokens + cached user) and tells the app to show the login screen. */
export function endSession(reason) {
  clearTokens();
  try {
    sessionStorage.removeItem('paisa_crm_user');
  } catch (e) {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: null }));
    if (reason) window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, { detail: reason }));
  }
}

// ---------------------------------------------------------------- main entry

/**
 * @param {string} path  e.g. '/api/crm/partners'
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {object} [options.body]        JSON body
 * @param {object} [options.query]       query-string parameters (empty values are dropped)
 * @param {boolean} [options.auth=true]  attach the bearer token and refresh on 401
 * @param {number} [options.timeoutMs]
 * @param {'json'|'blob'|'text'} [options.responseType='json']
 * @param {object} [options.headers]     extra headers (e.g. Idempotency-Key)
 * @returns {Promise<{ok:boolean,status:number,data:any,error:string|null,blob:Blob|null,headers:Headers|null}>}
 */
export async function api(path, options = {}) {
  const { method = 'GET', body, query, auth = true, timeoutMs, responseType = 'json', headers = {} } = options;
  const url = buildUrl(path, query);
  const hasBody = body !== undefined && body !== null;

  const send = () => {
    const h = { Accept: responseType === 'blob' ? '*/*' : 'application/json', ...headers };
    if (hasBody) h['Content-Type'] = 'application/json';
    if (auth) {
      const tokens = getTokens();
      if (tokens && tokens.accessToken) h.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return rawFetch(url, { method, headers: h, body: hasBody ? JSON.stringify(body) : undefined, timeoutMs, responseType });
  };

  let res = await send();

  if (auth && res.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      res = await send();
    }
    if (res.status === 401) {
      endSession('expired');
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data: res.data,
    blob: res.blob || null,
    headers: res.headers,
    error: res.ok ? null : res.networkError || errorMessageFrom(res.status, res.data),
  };
}

/** Convenience wrappers. */
export const apiGet = (path, query, options = {}) => api(path, { ...options, method: 'GET', query });
export const apiPost = (path, body, options = {}) => api(path, { ...options, method: 'POST', body: body === undefined ? {} : body });
export const apiPatch = (path, body, options = {}) => api(path, { ...options, method: 'PATCH', body });
export const apiPut = (path, body, options = {}) => api(path, { ...options, method: 'PUT', body });
export const apiDelete = (path, body, options = {}) => api(path, { ...options, method: 'DELETE', body });

/** Downloads a protected file (e.g. CSV export) with the bearer token and saves it through a temporary blob URL. */
export async function downloadFile(path, query, fallbackName = 'export.csv') {
  const res = await api(path, { query, responseType: 'blob', timeoutMs: 60000 });
  if (!res.ok || !res.blob) return res;
  let filename = fallbackName;
  const disposition = res.headers && res.headers.get('content-disposition');
  const match = disposition && /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  if (match) filename = decodeURIComponent(match[1]);
  const objectUrl = URL.createObjectURL(res.blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  return res;
}
