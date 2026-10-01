/**
 * Authentication and account management against the Node server.
 *
 * Login is email/username + password checked by the server (bcrypt). No password, account list or role
 * decision lives in the browser any more. The only things kept in the tab are the token pair
 * (see apiClient.js) and a cached copy of the signed-in user's non-sensitive profile.
 */
import { api, getTokens, setTokens, clearTokens, endSession, revokeTokens, SESSION_EVENT } from './apiClient';
import { syncPartnersFromServer } from '../data/affiliatePartners';

export const SESSION_STORAGE_KEY = 'paisa_crm_user';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  PARTNER: 'Partner',
};

const AVATAR_COLORS = {
  SUPER_ADMIN: 'bg-[#0A3977]',
  ADMIN: 'bg-indigo-600',
  STAFF: 'bg-blue-600',
  PARTNER: 'bg-emerald-600',
};

function initialsOf(name) {
  return (
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join('')
      .slice(0, 2) || 'US'
  );
}

function formatDateTime(value) {
  if (!value) return 'Never';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Never';
  return (
    d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }) +
    ', ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
  );
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

/** Converts a server account (login `user`, `/crm/me` user or `/crm/staff` row) to the shape the screens use. */
export function mapServerUser(u, roleNames = {}) {
  if (!u) return null;
  const serverRole = u.role;
  const humanizedKey = u.roleKey ? String(u.roleKey).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;
  const roleLabel = (u.roleKey && roleNames[u.roleKey]) || (serverRole === 'STAFF' && humanizedKey) || ROLE_LABELS[serverRole] || String(serverRole || 'Staff');
  return {
    id: u.id,
    name: u.name || u.email || u.username,
    username: u.username || u.email,
    email: u.email,
    mobile: u.mobile || '',
    role: serverRole === 'PARTNER' ? 'Partner' : roleLabel,
    roles: [roleLabel],
    serverRole,
    roleKey: u.roleKey || null,
    permissions: Array.isArray(u.permissions) ? u.permissions : [],
    partnerIds: Array.isArray(u.partnerIds) ? u.partnerIds : [],
    status: u.status === 'ACTIVE' ? 'Active' : 'Disabled',
    mustChangePassword: !!u.mustChangePassword,
    initials: initialsOf(u.name || u.email),
    avatarBg: AVATAR_COLORS[serverRole] || 'bg-[#0A3977]',
    branch: u.branch || 'Delhi Head Office',
    lastLogin: formatDateTime(u.lastLoginAt),
    created: formatDate(u.createdAt),
  };
}

/** Helper: is this the (server-defined) Super Admin? */
export function isSuperAdmin(user) {
  return !!user && user.serverRole === 'SUPER_ADMIN';
}

/** Helper: is this a partner-portal account? */
export function isPartnerUser(user) {
  return !!user && (user.serverRole === 'PARTNER' || user.role === 'Partner');
}

// ---------------------------------------------------------------- session cache

export function getCurrentUser() {
  try {
    if (!getTokens()) return null;
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.id || parsed.email)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function setCurrentUserSession(user) {
  try {
    if (user) sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: user }));
  }
}

export function clearCurrentUserSession() {
  endSession();
}

/** Adds the partner slug/name for PARTNER accounts and keeps the partner directory up to date. */
async function attachPartnerScope(user) {
  const res = await api('/api/crm/partners', { query: { limit: 500 } });
  if (res.ok && res.data && Array.isArray(res.data.partners)) {
    syncPartnersFromServer(res.data.partners);
    if (isPartnerUser(user)) {
      const own = res.data.partners.find((p) => user.partnerIds.includes(p.id)) || res.data.partners[0];
      if (own) return { ...user, partnerId: own.slug, partnerName: own.name, serverPartnerId: own.id };
    }
  }
  return user;
}

// ---------------------------------------------------------------- login / logout

/**
 * Staff / partner login. Resolves to `{ success:true, user }` or `{ success:false, error, blocked? }`.
 */
export async function authenticateStaff(usernameOrEmail, password) {
  if (!usernameOrEmail || !usernameOrEmail.trim()) {
    return { success: false, error: 'Please enter your User ID / Username or Email' };
  }
  if (!password || !password.trim()) {
    return { success: false, error: 'Please enter your Password' };
  }

  const identifier = usernameOrEmail.trim();
  const res = await api('/api/auth/staff/login', {
    method: 'POST',
    auth: false,
    body: { email: identifier, password },
  });

  if (!res.ok || !res.data || !res.data.token) {
    if (res.status === 401) return { success: false, error: 'Incorrect User ID or Password. Please check and try again.' };
    if (res.status === 423) return { success: false, error: 'Too many failed attempts. This account is locked for a few minutes — please try again later.' };
    if (res.status === 429) return { success: false, error: 'Too many login attempts. Please wait a few minutes and try again.' };
    if (res.status === 403 && /working hours/i.test(res.error || '')) {
      return { success: false, error: res.error, blocked: { user: identifier, reason: res.error, at: new Date() } };
    }
    if (res.status === 403) return { success: false, error: 'Your staff account is currently Disabled. Please contact Super Admin.' };
    return { success: false, error: res.error || 'Authentication failed. Please check credentials.' };
  }

  // Switching accounts: close the previous account's server session first (best effort).
  const previous = getTokens();
  if (previous) await revokeTokens(previous);
  setTokens({ accessToken: res.data.token, refreshToken: res.data.refreshToken });
  let user = mapServerUser(res.data.user);
  user = await attachPartnerScope(user);
  setCurrentUserSession(user);
  return { success: true, user };
}

/** Loads the signed-in account from the server (used on page load so a stale or revoked session is detected). */
export async function restoreSession() {
  if (!getTokens()) return null;
  const res = await api('/api/crm/me');
  if (!res.ok || !res.data || !res.data.user) {
    if (res.status === 0) return getCurrentUser(); // offline: keep the cached view until the server answers
    return null;
  }
  const user = await attachPartnerScope(mapServerUser(res.data.user));
  setCurrentUserSession(user);
  return user;
}

export async function logoutStaff() {
  const tokens = getTokens();
  if (tokens) {
    await api('/api/auth/staff/logout', { method: 'POST', body: { refreshToken: tokens.refreshToken } });
  }
  endSession();
}

/** Replaces a password. The server revokes every session afterwards, so the caller must sign in again. */
export async function changeOwnPassword(currentPassword, newPassword) {
  const res = await api('/api/auth/staff/change-password', { method: 'POST', body: { currentPassword, newPassword } });
  if (res.ok) {
    clearTokens();
    return { success: true };
  }
  return { success: false, error: res.error };
}

/** Clears browser-side UI preferences and the tab session (does not delete any server data). */
export function purgeAllClientCaches() {
  try {
    ['paisa_crm_active_tab', 'paisa_crm_sidebar_sections'].forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
  } catch (e) {
    // ignore
  }
  clearTokens();
}

// ---------------------------------------------------------------- staff accounts (/api/crm/staff)

let roleNameCache = {};

export async function loadRoleNames() {
  const res = await api('/api/crm/roles', { query: { limit: 500 } });
  if (res.ok && res.data && Array.isArray(res.data.roles)) {
    roleNameCache = Object.fromEntries(res.data.roles.map((r) => [r.key, r.name]));
    return { success: true, roles: res.data.roles };
  }
  return { success: false, roles: [], error: res.error };
}

export async function listStaffAccounts() {
  const res = await api('/api/crm/staff', { query: { limit: 500 } });
  if (!res.ok) return { success: false, error: res.error, staff: [] };
  return { success: true, staff: (res.data.staff || []).map((s) => mapServerUser(s, roleNameCache)) };
}

export async function createStaffAccount({ name, email, roleKey, mobile, branch }) {
  const res = await api('/api/crm/staff', { method: 'POST', body: { name, email, roleKey, mobile, branch } });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, user: mapServerUser(res.data.user, roleNameCache), temporaryPassword: res.data.temporaryPassword };
}

export async function updateStaffAccount(id, fields) {
  const res = await api(`/api/crm/staff/${encodeURIComponent(id)}`, { method: 'PATCH', body: fields });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, user: mapServerUser(res.data.user, roleNameCache) };
}

export async function resetStaffAccountPassword(id) {
  const res = await api(`/api/crm/staff/${encodeURIComponent(id)}/reset-password`, { method: 'POST' });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, temporaryPassword: res.data.temporaryPassword };
}

/** "Delete" in the UI disables the account on the server (history and audit entries are kept). */
export async function disableStaffAccount(id) {
  const res = await api(`/api/crm/staff/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, user: mapServerUser(res.data.user, roleNameCache) };
}

// ---------------------------------------------------------------- partner portal accounts (/api/crm/partners/users)

function mapPartnerUser(u, partners = []) {
  const base = mapServerUser(u);
  const partner = partners.find((p) => (u.partnerIds || []).includes(p.id));
  return {
    ...base,
    partnerId: partner ? partner.slug : (u.partnerIds || [])[0] || '',
    partnerName: partner ? partner.name : 'Partner',
    serverPartnerId: partner ? partner.id : (u.partnerIds || [])[0] || null,
  };
}

export async function listPartnerAccounts() {
  const [users, partners] = await Promise.all([
    api('/api/crm/partners/users', { query: { limit: 500 } }),
    api('/api/crm/partners', { query: { limit: 500 } }),
  ]);
  if (!users.ok) return { success: false, error: users.error, accounts: [] };
  const partnerList = partners.ok && partners.data ? partners.data.partners || [] : [];
  const rows = users.data.users || users.data.partnerUsers || [];
  return { success: true, accounts: rows.map((u) => mapPartnerUser(u, partnerList)) };
}

export async function createPartnerAccount({ serverPartnerId, name, email, username }) {
  const res = await api('/api/crm/partners/users', {
    method: 'POST',
    body: { partnerIds: [serverPartnerId], name, email, username: username || undefined },
  });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, user: res.data.user, temporaryPassword: res.data.temporaryPassword };
}

export async function setPartnerAccountStatus(id, status) {
  const res = await api(`/api/crm/partners/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { status: status === 'Active' ? 'ACTIVE' : 'DISABLED' },
  });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, user: res.data.user };
}

export async function resetPartnerAccountPassword(id) {
  const res = await api(`/api/crm/partners/users/${encodeURIComponent(id)}/reset-password`, { method: 'POST' });
  if (!res.ok) return { success: false, error: res.error };
  return { success: true, temporaryPassword: res.data.temporaryPassword };
}
