// UI constants only: the module / action layout of the permission matrix. Role definitions and the
// permissions each role holds are stored on the server (GET /api/crm/roles).
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
