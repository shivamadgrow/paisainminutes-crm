/**
 * Menu / button visibility helpers.
 * Security Note:
 * 1. Data export functionality across all modules is strictly restricted to Super Admin only.
 * 2. Complete Invoice Management (Generate, View, Edit, Delete, Download PDF, Print, Status) is strictly restricted to Super Admin only.
 */

export function isSuperAdmin(user) {
  if (!user) return false;
  const sRole = String(user.serverRole || '').toUpperCase();
  const uRole = String(user.role || '').toUpperCase();
  return sRole === 'SUPER_ADMIN' || uRole === 'SUPER_ADMIN' || uRole === 'SUPER ADMIN';
}

export function isExportPermission(permission) {
  if (!permission) return false;
  const p = String(permission).toLowerCase();
  return (
    p === 'reports.export' ||
    p === 'leads.export' ||
    p === 'dashboards.export' ||
    p === 'export' ||
    p === 'exportdata' ||
    (p.includes('export') && !p.includes('build'))
  );
}

export function isInvoicePermission(permission) {
  if (!permission) return false;
  const p = String(permission).toLowerCase();
  return (
    p.startsWith('invoices.') ||
    p.startsWith('invoice.') ||
    p === 'invoices' ||
    p === 'invoice' ||
    p === 'invoices.manage' ||
    p === 'invoices.read' ||
    p === 'invoices.write' ||
    p === 'invoices.generate' ||
    p === 'invoices.delete' ||
    p.includes('invoice')
  );
}

export function canExport(user) {
  return isSuperAdmin(user);
}

/**
 * Complete Invoice Access: Strictly Super Admin only.
 * Admin and all other roles must NOT have invoice management access.
 */
export function canManageInvoices(user) {
  return isSuperAdmin(user);
}

export function canDeleteInvoice(user) {
  return isSuperAdmin(user);
}

export function canGenerateInvoice(user) {
  return isSuperAdmin(user);
}

export function canViewInvoices(user) {
  return isSuperAdmin(user);
}

export function canEditInvoice(user) {
  return isSuperAdmin(user);
}

export function hasPermission(user, permission) {
  if (!user) return false;
  const isSuper = isSuperAdmin(user);
  // All export actions are strictly restricted to Super Admin only
  if (isExportPermission(permission)) {
    return isSuper;
  }
  // All invoice actions are strictly restricted to Super Admin only
  if (isInvoicePermission(permission)) {
    return isSuper;
  }
  if (isSuper) return true;
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
  'invoices-raised': ['invoices.manage'],
  'rate-cards': ['finance.read'],
  pipeline: ['leads.read'],
  tracker: ['leads.read'],
  'admin-staff': ['staff.manage'],
  'admin-roles': ['roles.manage', 'staff.manage'],
  'admin-audit': ['audit.read'],
  'admin-integrations': ['settings.manage'],
  'admin-notifications': ['settings.manage'],
  'admin-settings': ['settings.manage'],
  reports: ['reports.build', 'leads.read'],
};

const LEAD_TABS = new Set([
  'all-leads', 'fresh', 'callback', 'no-answer', 'interested', 'not-interested',
  'approved', 'disbursed', 'rejected', 'rupay91', 'mobile-only', 'duplicate-leads',
  'organization',
]);

export function canViewTab(user, tab) {
  if (!user) return false;
  if (tab === 'profile') return true;
  if (user.role === 'Partner') return tab === 'partner-leads';
  if (tab === 'partner-leads') return false;
  // Invoice management tab is strictly restricted to Super Admin only
  if (tab === 'invoices-raised' || tab === 'invoices') {
    return isSuperAdmin(user);
  }
  let required = TAB_PERMISSIONS[tab];
  if (!required && (LEAD_TABS.has(tab) || String(tab).startsWith('company-'))) required = ['leads.read'];
  if (!required) return true;
  return hasAnyPermission(user, required);
}


