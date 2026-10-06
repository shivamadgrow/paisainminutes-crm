import { hasPermission, canExport, isSuperAdmin, canViewTab } from '../public_html/crm/src/utils/permissions.js';

// Setup Mock DOM/Session for Node environment
if (typeof globalThis.sessionStorage === 'undefined') {
  let store = {};
  globalThis.sessionStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    dispatchEvent: () => {},
    sessionStorage: globalThis.sessionStorage,
    fetch: async () => new Response("ok", { status: 200 })
  };
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: () => ({ setAttribute: () => {}, click: () => {}, style: {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
  };
}
if (typeof globalThis.URL === 'undefined' || !globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = () => 'blob:mock-url';
  globalThis.URL.revokeObjectURL = () => {};
}

async function runTests() {
  console.log('--- Starting Export Access Restriction Tests ---');
  let failures = 0;
  const assert = (condition, name) => {
    if (condition) {
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name}`);
      failures++;
    }
  };

  // 1. Roles & Permissions Unit Tests
  const superAdmin = {
    id: 'sa-1',
    serverRole: 'SUPER_ADMIN',
    role: 'Super Admin',
    permissions: ['all']
  };

  const adminWithExport = {
    id: 'admin-1',
    serverRole: 'ADMIN',
    role: 'Admin',
    permissions: ['reports.build', 'reports.export', 'leads.export', 'leads.read']
  };

  const adminWithoutExport = {
    id: 'admin-2',
    serverRole: 'ADMIN',
    role: 'Admin',
    permissions: ['reports.build', 'leads.read']
  };

  assert(isSuperAdmin(superAdmin) === true, 'Super Admin recognized as Super Admin');
  assert(isSuperAdmin(adminWithExport) === false, 'Admin NOT recognized as Super Admin');
  assert(canExport(superAdmin) === true, 'Super Admin can export');
  assert(canExport(adminWithExport) === false, 'Admin cannot export');

  // Verify hasPermission denies export for Admin even if "reports.export" or "leads.export" is in array
  assert(hasPermission(superAdmin, 'reports.export') === true, 'Super Admin has permission reports.export');
  assert(hasPermission(superAdmin, 'reports.build') === true, 'Super Admin has permission reports.build');
  assert(hasPermission(adminWithExport, 'reports.build') === true, 'Admin has permission reports.build');
  assert(hasPermission(adminWithExport, 'reports.export') === false, 'Admin DENIED reports.export even if in permission list');
  assert(hasPermission(adminWithExport, 'leads.export') === false, 'Admin DENIED leads.export even if in permission list');
  assert(hasPermission(adminWithoutExport, 'reports.export') === false, 'Admin without export denied reports.export');
  assert(canViewTab(adminWithExport, 'reports') === true, 'Admin can view reports tab to build reports');

  // 2. Test exportToCsv security check
  const { exportToCsv } = await import('../public_html/crm/src/utils/exportCsv.js');

  // Set session to Admin
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(adminWithExport));
  globalThis.alert = (msg) => { /* suppress popup during test */ };

  const adminCsvResult = exportToCsv('test.csv', ['col1'], [['val1']]);
  assert(adminCsvResult && adminCsvResult.status === 403, 'exportToCsv rejects Admin with 403 Forbidden');

  // Set session to Super Admin
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(superAdmin));
  let superAdminAlert = false;
  globalThis.alert = () => { superAdminAlert = true; };
  const saCsvResult = exportToCsv('test.csv', ['col1'], [['val1']]);
  assert(!superAdminAlert, 'exportToCsv allows Super Admin without alert error');

  // 3. Test apiClient.js security guards for API endpoints
  const { api, downloadFile, isSuperAdminSession } = await import('../public_html/crm/src/utils/apiClient.js');

  // As Admin
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(adminWithExport));
  assert(isSuperAdminSession() === false, 'isSuperAdminSession false for Admin');

  const resApiLoanExport = await api('/api/loan-applications/export');
  assert(resApiLoanExport.status === 403 && resApiLoanExport.ok === false, 'api(/api/loan-applications/export) returns 403 Forbidden for Admin');

  const resApiPartnerExport = await api('/api/crm/partners/xyz/leads/export');
  assert(resApiPartnerExport.status === 403 && resApiPartnerExport.ok === false, 'api(/api/crm/partners/:id/leads/export) returns 403 Forbidden for Admin');

  const resDownloadExport = await downloadFile('/api/loan-applications/export');
  assert(resDownloadExport.status === 403 && resDownloadExport.ok === false, 'downloadFile(/api/loan-applications/export) returns 403 Forbidden for Admin');

  // Direct fetch call
  const fetchRes = await globalThis.window.fetch('/api/loan-applications/export');
  assert(fetchRes.status === 403, 'window.fetch(/api/loan-applications/export) intercepted and returns 403 Forbidden for Admin');

  // 4. Test crmApi export function
  const { exportPartnerLeadsCsv } = await import('../public_html/crm/src/utils/crmApi.js');
  const partnerExportRes = await exportPartnerLeadsCsv('test-partner');
  assert(partnerExportRes.status === 403 && partnerExportRes.success === false, 'exportPartnerLeadsCsv returns 403 for Admin');

  // Switch to Super Admin and verify isSuperAdminSession
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(superAdmin));
  assert(isSuperAdminSession() === true, 'isSuperAdminSession true for Super Admin');

  console.log(`--- Test Suite Finished: ${failures === 0 ? 'ALL TESTS PASSED' : failures + ' FAILURES'} ---`);
  if (failures > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
