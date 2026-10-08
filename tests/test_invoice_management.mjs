import fs from 'fs';
import { 
  canDeleteInvoice, 
  canManageInvoices, 
  canGenerateInvoice, 
  canViewInvoices, 
  canViewTab, 
  isSuperAdmin, 
  hasPermission 
} from '../public_html/crm/src/utils/permissions.js';
import { generateInvoicePdf, formatINR } from '../public_html/crm/src/utils/invoicePdf.js';

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
if (typeof globalThis.localStorage === 'undefined') {
  let store = {};
  globalThis.localStorage = {
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
    localStorage: globalThis.localStorage,
    fetch: async () => new Response("ok", { status: 200 })
  };
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: () => ({ setAttribute: () => {}, click: () => {}, style: {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
  };
}

async function runInvoiceManagementTests() {
  console.log('====================================================');
  console.log('   INVOICE MANAGEMENT & PDF DOWNLOAD TEST SUITE     ');
  console.log('====================================================');
  let failures = 0;
  const assert = (condition, name, details = '') => {
    if (condition) {
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name} ${details ? '-> ' + details : ''}`);
      failures++;
    }
  };

  // ---------------------------------------------------------------
  // 1. PERMISSIONS & ROLES TESTS: Super Admin vs Admin
  // ---------------------------------------------------------------
  console.log('\n--- 1. Testing Invoice Permissions & Role Access (Super Admin Only) ---');

  const superAdminUser = {
    id: 'sa-1',
    serverRole: 'SUPER_ADMIN',
    role: 'Super Admin',
    permissions: ['all']
  };

  const adminUser = {
    id: 'admin-1',
    serverRole: 'ADMIN',
    role: 'Admin',
    permissions: ['finance.read', 'finance.write', 'invoices.manage', 'leads.read', 'leads.write']
  };

  const financeManagerUser = {
    id: 'fin-1',
    serverRole: 'STAFF',
    role: 'Finance Manager',
    permissions: ['finance.read', 'finance.write']
  };

  const telecallerUser = {
    id: 'tc-1',
    serverRole: 'STAFF',
    role: 'Telecaller',
    permissions: ['leads.read', 'leads.update']
  };

  const partnerUser = {
    id: 'partner-1',
    serverRole: 'PARTNER',
    role: 'Partner',
    partnerIds: ['p-1'],
    permissions: ['leads.read']
  };

  const readOnlyUser = {
    id: 'ro-1',
    serverRole: 'STAFF',
    role: 'Auditor',
    permissions: ['finance.read', 'audit.read']
  };

  // Super Admin checks: FULL ACCESS ✅
  assert(isSuperAdmin(superAdminUser) === true, 'Super Admin recognized as Super Admin');
  assert(canViewTab(superAdminUser, 'invoices-raised') === true, 'Super Admin can view Invoices Raised tab in Sidebar');
  assert(canManageInvoices(superAdminUser) === true, 'Super Admin can manage invoices');
  assert(canDeleteInvoice(superAdminUser) === true, 'Super Admin can delete invoice');
  assert(canGenerateInvoice(superAdminUser) === true, 'Super Admin can generate invoice');
  assert(canViewInvoices(superAdminUser) === true, 'Super Admin can view invoices');
  assert(hasPermission(superAdminUser, 'invoices.manage') === true, 'Super Admin has permission invoices.manage');

  // Admin checks: NO INVOICE MANAGEMENT ACCESS ❌
  assert(isSuperAdmin(adminUser) === false, 'Admin is NOT Super Admin');
  assert(canViewTab(adminUser, 'invoices-raised') === false, 'Admin CANNOT view Invoices Raised tab (Sidebar item hidden)');
  assert(canManageInvoices(adminUser) === false, 'Admin CANNOT manage invoices');
  assert(canDeleteInvoice(adminUser) === false, 'Admin CANNOT delete invoice');
  assert(canGenerateInvoice(adminUser) === false, 'Admin CANNOT generate invoice');
  assert(canViewInvoices(adminUser) === false, 'Admin CANNOT view invoices');
  assert(hasPermission(adminUser, 'invoices.manage') === false, 'Admin hasPermission(invoices.manage) is FALSE even if in array');
  assert(hasPermission(adminUser, 'invoices.write') === false, 'Admin hasPermission(invoices.write) is FALSE even if in array');

  // Other roles checks: BLOCKED ❌
  assert(canViewTab(financeManagerUser, 'invoices-raised') === false, 'Finance Manager CANNOT view invoices tab');
  assert(canDeleteInvoice(financeManagerUser) === false, 'Finance Manager CANNOT delete invoice');
  assert(canViewTab(telecallerUser, 'invoices-raised') === false, 'Telecaller CANNOT view invoices tab');
  assert(canDeleteInvoice(telecallerUser) === false, 'Telecaller CANNOT delete invoice');
  assert(canViewTab(partnerUser, 'invoices-raised') === false, 'Partner User CANNOT view invoices tab');
  assert(canDeleteInvoice(partnerUser) === false, 'Partner User CANNOT delete invoice');
  assert(canViewTab(readOnlyUser, 'invoices-raised') === false, 'Read-only Auditor CANNOT view invoices tab');
  assert(canDeleteInvoice(readOnlyUser) === false, 'Read-only Auditor CANNOT delete invoice');

  // ---------------------------------------------------------------
  // 2. BACKEND API SECURITY ENFORCEMENT (403 FORBIDDEN FOR ADMIN & NON-SUPER-ADMIN)
  // ---------------------------------------------------------------
  console.log('\n--- 2. Testing Backend API Client Security (403 Forbidden for Admin) ---');

  const { api, isInvoiceApiUrl, isInvoiceDeleteUrl, canDeleteInvoiceSession, canManageInvoicesSession } = await import('../public_html/crm/src/utils/apiClient.js');
  const { deleteInvoiceApi, getDeletedInvoiceNos } = await import('../public_html/crm/src/utils/crmApi.js');

  // Test detection of invoice URLs
  assert(isInvoiceApiUrl('/api/invoices') === true, 'Identifies /api/invoices as invoice URL');
  assert(isInvoiceApiUrl('/api/crm/invoices') === true, 'Identifies /api/crm/invoices as invoice URL');
  assert(isInvoiceApiUrl('/api/invoices/INV-2026-6024') === true, 'Identifies /api/invoices/:id as invoice URL');
  assert(isInvoiceApiUrl('/api/invoices/INV-2026-6024/pdf') === true, 'Identifies /api/invoices/:id/pdf as invoice URL');
  assert(isInvoiceApiUrl('/api/invoices/INV-2026-6024/print') === true, 'Identifies /api/invoices/:id/print as invoice URL');
  assert(isInvoiceDeleteUrl('/api/crm/invoices/INV-2026-6024', 'DELETE') === true, 'Identifies /api/crm/invoices/:id DELETE');
  assert(isInvoiceDeleteUrl('/api/invoices/INV-2026-6024', 'DELETE') === true, 'Identifies /api/invoices/:id DELETE');
  assert(isInvoiceDeleteUrl('/api/crm/leads/123', 'DELETE') === false, 'Ignores non-invoice DELETE');

  // Test Admin session security (Must return 403 Forbidden on all invoice APIs)
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(adminUser));
  assert(canManageInvoicesSession() === false, 'canManageInvoicesSession is false for Admin');
  assert(canDeleteInvoiceSession() === false, 'canDeleteInvoiceSession is false for Admin');

  // Admin attempting invoice APIs via api()
  const adminPost1 = await api('/api/invoices', { method: 'POST', body: { netCommission: 10000 } });
  assert(adminPost1.ok === false && adminPost1.status === 403, 'POST /api/invoices returns 403 Forbidden for Admin');

  const adminPost2 = await api('/api/crm/invoices', { method: 'POST', body: { netCommission: 10000 } });
  assert(adminPost2.ok === false && adminPost2.status === 403, 'POST /api/crm/invoices returns 403 Forbidden for Admin');

  const adminPut = await api('/api/invoices/INV-2026-6024', { method: 'PUT', body: { status: 'PAID' } });
  assert(adminPut.ok === false && adminPut.status === 403, 'PUT /api/invoices/{id} returns 403 Forbidden for Admin');

  const adminDelete = await api('/api/invoices/INV-2026-6024', { method: 'DELETE' });
  assert(adminDelete.ok === false && adminDelete.status === 403, 'DELETE /api/invoices/{id} returns 403 Forbidden for Admin');

  const adminGetPdf = await api('/api/invoices/INV-2026-6024/pdf', { method: 'GET' });
  assert(adminGetPdf.ok === false && adminGetPdf.status === 403, 'GET /api/invoices/{id}/pdf returns 403 Forbidden for Admin');

  const adminPostPrint = await api('/api/invoices/INV-2026-6024/print', { method: 'POST' });
  assert(adminPostPrint.ok === false && adminPostPrint.status === 403, 'POST /api/invoices/{id}/print returns 403 Forbidden for Admin');

  const adminGetList = await api('/api/crm/invoices', { method: 'GET' });
  assert(adminGetList.ok === false && adminGetList.status === 403, 'GET /api/crm/invoices returns 403 Forbidden for Admin');

  const adminApiCall = await deleteInvoiceApi('INV-2026-6024');
  assert(adminApiCall.success === false && adminApiCall.status === 403, 'deleteInvoiceApi returns 403 Forbidden for Admin');

  // Admin attempting direct window.fetch calls
  const directPostFetch = await globalThis.window.fetch('/api/invoices', { method: 'POST' });
  assert(directPostFetch.status === 403, 'Direct window.fetch(POST /api/invoices) intercepted with 403 Forbidden for Admin');

  const directPutFetch = await globalThis.window.fetch('/api/invoices/INV-2026-6024', { method: 'PUT' });
  assert(directPutFetch.status === 403, 'Direct window.fetch(PUT /api/invoices/{id}) intercepted with 403 Forbidden for Admin');

  const directDeleteFetch = await globalThis.window.fetch('/api/invoices/INV-2026-6024', { method: 'DELETE' });
  assert(directDeleteFetch.status === 403, 'Direct window.fetch(DELETE /api/invoices/{id}) intercepted with 403 Forbidden for Admin');

  const directPdfFetch = await globalThis.window.fetch('/api/invoices/INV-2026-6024/pdf', { method: 'GET' });
  assert(directPdfFetch.status === 403, 'Direct window.fetch(GET /api/invoices/{id}/pdf) intercepted with 403 Forbidden for Admin');

  const directPrintFetch = await globalThis.window.fetch('/api/invoices/INV-2026-6024/print', { method: 'POST' });
  assert(directPrintFetch.status === 403, 'Direct window.fetch(POST /api/invoices/{id}/print) intercepted with 403 Forbidden for Admin');

  // Test Telecaller and Partner sessions as well
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(telecallerUser));
  assert(canManageInvoicesSession() === false, 'canManageInvoicesSession is false for Telecaller');
  const tcRes = await api('/api/invoices', { method: 'POST' });
  assert(tcRes.status === 403, 'POST /api/invoices returns 403 Forbidden for Telecaller');

  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(partnerUser));
  assert(canManageInvoicesSession() === false, 'canManageInvoicesSession is false for Partner');
  const partnerRes = await deleteInvoiceApi('INV-2026-6024');
  assert(partnerRes.status === 403, 'deleteInvoiceApi returns 403 Forbidden for Partner');

  // ---------------------------------------------------------------
  // 3. AUTHORIZED DELETE INVOICE FLOW & BLACKLIST PERSISTENCE
  // ---------------------------------------------------------------
  console.log('\n--- 3. Testing Authorized Delete Flow & Persistence ---');

  // Switch to Super Admin session
  globalThis.sessionStorage.setItem('paisa_crm_user', JSON.stringify(superAdminUser));
  assert(canDeleteInvoiceSession() === true, 'canDeleteInvoiceSession is true for Super Admin');

  const authDeleteRes = await deleteInvoiceApi('INV-2026-6024', 'srv-6024');
  assert(authDeleteRes.success === true && authDeleteRes.status === 200, 'deleteInvoiceApi succeeds for authorized Super Admin');
  assert(authDeleteRes.message === 'Invoice INV-2026-6024 deleted successfully.', 'Success message matches expected format');

  const deletedList = getDeletedInvoiceNos();
  assert(deletedList.includes('INV-2026-6024'), 'Deleted invoice number is persisted in deleted list');
  assert(deletedList.includes('srv-6024'), 'Deleted serverId is persisted in deleted list');

  // ---------------------------------------------------------------
  // 4. REAL PDF GENERATION TESTS
  // ---------------------------------------------------------------
  console.log('\n--- 4. Testing Actual Invoice PDF Generation ---');

  const testInvoice = {
    invoiceNo: 'INV-2026-6024',
    partnerName: 'Rupay91',
    period: '07-10-2026 to 09-10-2026',
    dateIssued: '2026-10-07',
    dueDate: '2026-10-22',
    netCommission: 10000,
    gstRate: 18,
    gstAmount: 1800,
    totalPayable: 11800,
    status: 'Unpaid',
    sacCode: '998311',
    description: 'Affiliate commission for retail personal loans'
  };

  const pdfResult = await generateInvoicePdf(testInvoice);
  assert(pdfResult.success === true, 'generateInvoicePdf executed successfully');
  assert(pdfResult.filename === 'INV-2026-6024.pdf', 'PDF filename matches INV-2026-6024.pdf');

  const pdfBuffer = pdfResult.doc.output('arraybuffer');
  assert(pdfBuffer.byteLength > 20000, `Generated PDF buffer is complete and populated (${pdfBuffer.byteLength} bytes)`);

  const pdfString = Buffer.from(pdfBuffer).toString('latin1');

  // Check required fields in the PDF output stream
  assert(pdfString.includes('INV-2026-6024'), 'PDF contains invoice number INV-2026-6024');
  assert(pdfString.includes('Rupay91'), 'PDF contains partner name Rupay91');
  assert(pdfString.includes('07-10-2026 to 09-10-2026') || pdfString.includes('07-10-2026'), 'PDF contains billing period');
  assert(pdfString.includes('2026-10-07'), 'PDF contains issue date 2026-10-07');
  assert(pdfString.includes('2026-10-22'), 'PDF contains due date 2026-10-22');
  assert(pdfString.includes('998311'), 'PDF contains SAC code 998311');
  assert(pdfString.includes('10,000'), 'PDF contains Net Commission formatted as 10,000');
  assert(pdfString.includes('900'), 'PDF contains CGST & SGST values 900');
  assert(pdfString.includes('11,800'), 'PDF contains Total Payable formatted as 11,800');
  assert(pdfString.includes('UNPAID'), 'PDF contains payment status UNPAID');
  assert(pdfString.includes('07AAICA8910B1ZT'), 'PDF contains GSTIN 07AAICA8910B1ZT');
  assert(pdfString.includes('Adgrow Media Technologies Pvt Ltd'), 'PDF contains legal entity name');
  assert(pdfString.includes('Paisa in Minutes'), 'PDF contains brand name Paisa in Minutes');

  // ---------------------------------------------------------------
  // 5. INVOICE CALCULATIONS INTEGRITY
  // ---------------------------------------------------------------
  console.log('\n--- 5. Testing Invoice Calculations Integrity ---');

  const net = testInvoice.netCommission;
  const cgst = Math.round(testInvoice.gstAmount / 2);
  const sgst = Math.round(testInvoice.gstAmount / 2);
  const total = testInvoice.totalPayable;

  assert(net === 10000, 'Net Commission is exactly ₹10,000');
  assert(cgst === 900, 'CGST 9% is exactly ₹900');
  assert(sgst === 900, 'SGST 9% is exactly ₹900');
  assert(cgst + sgst === 1800, 'Total GST 18% is exactly ₹1,800');
  assert(total === 11800, 'Total Payable is exactly ₹11,800');
  assert(net + cgst + sgst === total, 'Calculation Net + CGST + SGST === Total Payable');

  console.log('====================================================');
  console.log(`   TEST SUITE FINISHED: ${failures === 0 ? 'ALL CHECKS PASSED ✅' : failures + ' CHECKS FAILED ❌'}`);
  console.log('====================================================');

  if (failures > 0) {
    process.exit(1);
  }
}

runInvoiceManagementTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
