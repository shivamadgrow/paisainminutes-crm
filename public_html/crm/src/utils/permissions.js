/**
 * Menu / button visibility helpers. These only hide UI for convenience: the Node server re-checks every
 * request against the permissions of the signed-in account and is the real authority.
 */

export function hasPermission(user, permission) {
  if (!user) return false;
  if (user.serverRole === 'SUPER_ADMIN') return true;
  const list = Array.isArray(user.permissions) ? user.permissions : [];
  return list.includes(permission);
}

export function hasAnyPermission(user, permissions) {
  return permissions.some((p) => hasPermission(user, p));
}

/** Permission(s) required to open each CRM tab (any one of them is enough). */
const TAB_PERMISSIONS = {
  executive: ['dashboards.read', 'leads.read'],
  kpi: ['dashboards.read', 'leads.read'],
  'partner-hub': ['partners.read', 'leads.read'],
  'partner-agreements': ['partners.read'],
  'partner-onboarding': ['partners.manage', 'partners.onboard'],
  'delivery-logs': ['leads.read'],
  'commission-summary': ['finance.read'],
  'payout-requests': ['finance.read'],
  settlements: ['finance.read'],
  'invoices-raised': ['finance.read'],
  'rate-cards': ['finance.read'],
  pipeline: ['leads.read'],
  tracker: ['leads.read'],
  'admin-staff': ['staff.manage'],
  'admin-roles': ['roles.manage', 'staff.manage'],
  'admin-audit': ['audit.read'],
  'admin-integrations': ['settings.manage'],
  'admin-notifications': ['settings.manage'],
  'admin-settings': ['settings.manage'],
  reports: ['reports.build', 'reports.export', 'leads.read'],
};

const LEAD_TABS = new Set([
  'all-leads', 'fresh', 'callback', 'no-answer', 'interested', 'not-interested', 'docs-received',
  'approved', 'rejected', 'rupay91', 'mobile-only', 'duplicate-leads',
]);

export function canViewTab(user, tab) {
  if (!user) return false;
  if (tab === 'profile') return true;
  if (user.role === 'Partner') return tab === 'partner-leads';
  if (tab === 'partner-leads') return false;
  let required = TAB_PERMISSIONS[tab];
  if (!required && (LEAD_TABS.has(tab) || String(tab).startsWith('company-'))) required = ['leads.read'];
  if (!required) return true;
  return hasAnyPermission(user, required);
}
