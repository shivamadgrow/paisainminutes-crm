export const INITIAL_ROLE_DEFINITIONS = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    badgeColor: 'bg-indigo-700 text-white',
    description: 'Complete unrestricted master system control, user management, and security exemptions',
    userCount: 1,
    isLocked: true, // Super Admin cannot be deleted or disabled
    permissions: {
      dashboards: { view: true, export: true },
      partners: { view: true, manage: true, onboard: true },
      leads: { view: true, edit: true, delete: true, export: true, reassign: true },
      commissions: { view: true, createRequest: true, recordSettlement: true, manageRateCards: true },
      administration: { staffManagement: true, roleConfig: true, securityConfig: true, viewAuditLog: true },
      reports: { buildReports: true, exportData: true }
    }
  },
  {
    id: 'admin',
    name: 'Admin',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'Full operational and affiliate CRM management across all lending modules',
    userCount: 2,
    isLocked: false,
    permissions: {
      dashboards: { view: true, export: true },
      partners: { view: true, manage: true, onboard: true },
      leads: { view: true, edit: true, delete: false, export: true, reassign: true },
      commissions: { view: true, createRequest: true, recordSettlement: true, manageRateCards: false },
      administration: { staffManagement: true, roleConfig: false, securityConfig: false, viewAuditLog: true },
      reports: { buildReports: true, exportData: true }
    }
  },
  {
    id: 'credit-manager',
    name: 'Credit Manager',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Underwriting assessment, CIBIL eligibility verification, and lead approval routing',
    userCount: 3,
    isLocked: false,
    permissions: {
      dashboards: { view: true, export: false },
      partners: { view: true, manage: false, onboard: false },
      leads: { view: true, edit: true, delete: false, export: true, reassign: true },
      commissions: { view: false, createRequest: false, recordSettlement: false, manageRateCards: false },
      administration: { staffManagement: false, roleConfig: false, securityConfig: false, viewAuditLog: false },
      reports: { buildReports: true, exportData: false }
    }
  },
  {
    id: 'telecaller',
    name: 'Telecaller / Sales Agent',
    badgeColor: 'bg-teal-600 text-white',
    description: 'Inbound & outbound calling, mini-form followups, documentation collection',
    userCount: 5,
    isLocked: false,
    permissions: {
      dashboards: { view: false, export: false },
      partners: { view: false, manage: false, onboard: false },
      leads: { view: true, edit: true, delete: false, export: false, reassign: false },
      commissions: { view: false, createRequest: false, recordSettlement: false, manageRateCards: false },
      administration: { staffManagement: false, roleConfig: false, securityConfig: false, viewAuditLog: false },
      reports: { buildReports: false, exportData: false }
    }
  }
];

export const MODULE_PERMISSIONS_CONFIG = [
  {
    moduleKey: 'dashboards',
    label: 'Dashboards & Analytics',
    description: 'Access to Executive Overview and Partner Analytics KPI summary',
    actions: ['view', 'export']
  },
  {
    moduleKey: 'partners',
    label: 'Affiliate Partners',
    description: 'Partner Hub, individual partner leads view, onboarding, and agreements',
    actions: ['view', 'manage', 'onboard']
  },
  {
    moduleKey: 'leads',
    label: 'Lead Management',
    description: 'Access to leads pipeline, mobile-only leads, duplicate resolution, edit and deletion',
    actions: ['view', 'edit', 'delete', 'export', 'reassign']
  },
  {
    moduleKey: 'commissions',
    label: 'Commissions & Payouts',
    description: 'Commission summary, payout requests, settlement logs, invoices, and rate cards',
    actions: ['view', 'createRequest', 'recordSettlement', 'manageRateCards']
  },
  {
    moduleKey: 'administration',
    label: 'Administration',
    description: 'Staff directory, role matrix, activity audit log, and system integrations',
    actions: ['staffManagement', 'roleConfig', 'securityConfig', 'viewAuditLog']
  },
  {
    moduleKey: 'reports',
    label: 'Custom Reports',
    description: 'Custom query builder and Excel/CSV dataset exports',
    actions: ['buildReports', 'exportData']
  }
];
