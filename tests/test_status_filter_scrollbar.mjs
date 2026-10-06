import fs from 'fs';

const indexCss = fs.readFileSync('public_html/crm/src/index.css', 'utf8');
const builtCss = fs.readFileSync('public_html/crm/assets/index.css', 'utf8');
const leadsView = fs.readFileSync('public_html/crm/src/components/LeadsView.jsx', 'utf8');
const appJsx = fs.readFileSync('public_html/crm/src/App.jsx', 'utf8');
const perms = fs.readFileSync('public_html/crm/src/utils/permissions.js', 'utf8');

const checks = [
  ['index.css contains .status-filter-wrapper', indexCss.includes('.status-filter-wrapper')],
  ['index.css contains .status-filter-list', indexCss.includes('.status-filter-list')],
  ['built index.css contains .status-filter-wrapper', builtCss.includes('status-filter-wrapper')],
  ['built index.css contains .status-filter-list', builtCss.includes('status-filter-list')],
  ['LeadsView has status-filter-wrapper class', leadsView.includes('status-filter-wrapper')],
  ['LeadsView has status-filter-list class', leadsView.includes('status-filter-list')],
  ['LeadsView has overflow-x-auto and overflow-y-hidden', leadsView.includes('overflow-x-auto overflow-y-hidden')],
  ['LeadsView has All Status', leadsView.includes("label: 'All Status'")],
  ['LeadsView has Mobile leads', leadsView.includes("label: 'Mobile leads'")],
  ['LeadsView has Fresh', leadsView.includes("label: 'Fresh'")],
  ['LeadsView has Callback', leadsView.includes("label: 'Callback'")],
  ['LeadsView has Interested', leadsView.includes("label: 'Interested'")],
  ['LeadsView has Approved', leadsView.includes("label: 'Approved'")],
  ['LeadsView has Disbursed', leadsView.includes("label: 'Disbursed'")],
  ['LeadsView has Rejected', leadsView.includes("label: 'Rejected'")],
  ['LeadsView has Duplicate Leads', leadsView.includes("label: 'Duplicate Leads'")],
  ['LeadsView has Organization', leadsView.includes("label: 'Organization'")],
  ['App.jsx has case organization', appJsx.includes("case 'organization':")],
  ['permissions.js has organization in LEAD_TABS', perms.includes("'organization'")],
];

let allPassed = true;
checks.forEach(([name, pass]) => {
  if (pass) {
    console.log('[PASS] ' + name);
  } else {
    console.error('[FAIL] ' + name);
    allPassed = false;
  }
});

if (!allPassed) {
  process.exit(1);
}
console.log('All 19 verification checks passed successfully!');
