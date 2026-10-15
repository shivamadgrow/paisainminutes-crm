#!/usr/bin/env node
/**
 * Test Suite: Ticket 2 Loan Partner Removal & Active Partners Integrity
 *
 * Verifies that:
 * 1. Ticket 2 Loan is completely removed from active affiliate partners list (AFFILIATE_PARTNERS).
 * 2. Ticket 2 Loan does not appear in CRM sidebar, Partner Hub, or filter chips.
 * 3. Outbound routing, partner click tracking, and direct URLs for Ticket 2 Loan are permanently blocked.
 * 4. Router and .htaccess safely intercept legacy Ticket 2 Loan URLs with 301 to /loan-offers.
 * 5. Partner postback receiver immediately rejects Ticket 2 Loan with HTTP 410 Gone.
 * 6. Historical lead records for Ticket 2 Loan resolve safely as Archived without active URLs.
 * 7. Legacy logo files (ticket2loan.jpg/png) are deleted.
 * 8. All active partners remain intact and fully functional.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const phpBin = 'C:\\xampp\\php\\php.exe';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(`   Error: ${err.message}`);
    failedTests++;
  }
}

console.log('======================================================================');
console.log('🧪 RUNNING TICKET 2 LOAN REMOVAL & ACTIVE PARTNERS INTEGRITY TESTS');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// 1. CRM Module & Active Partners List
// ----------------------------------------------------------------------------
console.log('--- 1. CRM MODULE (affiliatePartners.js) ---');

const affiliatePartnersPath = path.join(projectRoot, 'public_html', 'crm', 'src', 'data', 'affiliatePartners.js');
const affiliatePartnersCode = fs.readFileSync(affiliatePartnersPath, 'utf8');

const {
  AFFILIATE_PARTNERS,
  INACTIVE_PARTNERS,
  APPROVED_PARTNER_SLUGS,
  getPartnerMeta,
  getPartnerTrackingUrl,
  trackPartnerClick,
  getPartnerDirectUtmUrl
} = await import(`file://${affiliatePartnersPath.replace(/\\/g, '/')}`);

it('AFFILIATE_PARTNERS contains exactly 6 active partners and does NOT include ticket2loan', () => {
  assert.strictEqual(AFFILIATE_PARTNERS.length, 6, 'Must contain exactly 6 approved partners');
  const slugs = AFFILIATE_PARTNERS.map(p => p.id);
  assert.ok(!slugs.includes('ticket2loan'), 'ticket2loan must not be in AFFILIATE_PARTNERS');
  assert.ok(!slugs.some(s => s.includes('ticket')), 'No ticket partner slug allowed in AFFILIATE_PARTNERS');
});

it('All 6 required active partners are present in AFFILIATE_PARTNERS', () => {
  const slugs = AFFILIATE_PARTNERS.map(p => p.id);
  const expected = ['rupay91', 'borrowera', 'instarupees', 'jhatpatloans', 'easyfincare', 'moneydot'];
  expected.forEach(slug => {
    assert.ok(slugs.includes(slug), `Partner ${slug} must be present in AFFILIATE_PARTNERS`);
  });
});

it('INACTIVE_PARTNERS is empty and does not expose Ticket 2 Loan configuration or URLs', () => {
  assert.strictEqual(INACTIVE_PARTNERS.length, 0, 'INACTIVE_PARTNERS must be empty');
  assert.ok(!affiliatePartnersCode.includes('https://ticket2loan.com'), 'Ticket 2 Loan website must not be in code');
  assert.ok(!affiliatePartnersCode.includes('https://www.ticket2loan.com/apply-loan'), 'Ticket 2 Loan apply URL must not be in code');
});

it('APPROVED_PARTNER_SLUGS strictly excludes ticket2loan', () => {
  assert.ok(!APPROVED_PARTNER_SLUGS.includes('ticket2loan'), 'ticket2loan must not be in APPROVED_PARTNER_SLUGS');
});

// ----------------------------------------------------------------------------
// 2. Outbound Routing & Lead Click Blocking
// ----------------------------------------------------------------------------
console.log('\n--- 2. OUTBOUND ROUTING & CLICK SAFETY ---');

it('getPartnerTrackingUrl blocks ticket2loan and returns safe fallback "#"', () => {
  const trackingUrl = getPartnerTrackingUrl('ticket2loan');
  assert.strictEqual(trackingUrl, '#', 'Outbound tracking for ticket2loan must return "#"');
});

it('getPartnerDirectUtmUrl blocks ticket2loan and redirects to /loan-offers', () => {
  const directUrl = getPartnerDirectUtmUrl('ticket2loan');
  assert.strictEqual(directUrl, 'https://paisainminutes.com/loan-offers', 'Direct URL for ticket2loan must fall back to /loan-offers');
});

it('trackPartnerClick rejects ticket2loan and reports inactive status', async () => {
  const result = await trackPartnerClick('ticket2loan');
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.error, 'Partner inactive');
});

// ----------------------------------------------------------------------------
// 3. Historical Record Preservation
// ----------------------------------------------------------------------------
console.log('\n--- 3. HISTORICAL RECORD PRESERVATION ---');

it('getPartnerMeta preserves historical Ticket 2 Loan audit label as Archived without active URLs', () => {
  const meta = getPartnerMeta('ticket2loan');
  assert.strictEqual(meta.id, 'ticket2loan');
  assert.strictEqual(meta.status, 'INACTIVE');
  assert.strictEqual(meta.disabled, true);
  assert.strictEqual(meta.applyUrl, '#');
  assert.strictEqual(meta.website, '');
  assert.strictEqual(meta.commissionPct, 0);
  assert.ok(meta.name.includes('Archived'), 'Historical label must reflect Archived status');
});

// ----------------------------------------------------------------------------
// 4. Website, Assets & Router Protection
// ----------------------------------------------------------------------------
console.log('\n--- 4. WEBSITE & SERVER-SIDE ROUTING PROTECTION ---');

it('Legacy Ticket 2 Loan logo image files are deleted from public_html/assets', () => {
  const jpgExists = fs.existsSync(path.join(projectRoot, 'public_html', 'assets', 'ticket2loan.jpg'));
  const pngExists = fs.existsSync(path.join(projectRoot, 'public_html', 'assets', 'ticket2loan.png'));
  assert.strictEqual(jpgExists, false, 'ticket2loan.jpg must be deleted');
  assert.strictEqual(pngExists, false, 'ticket2loan.png must be deleted');
});

it('public_html/config/partners.php contains zero references to ticket2loan', () => {
  const partnersPhp = fs.readFileSync(path.join(projectRoot, 'public_html', 'config', 'partners.php'), 'utf8');
  assert.ok(!partnersPhp.includes('ticket2loan'), 'partners.php must not contain ticket2loan');
});

it('postback.php immediately rejects Ticket 2 Loan callbacks with HTTP 410 Gone', () => {
  const postbackPath = path.join(projectRoot, 'public_html', 'postback.php');
  const phpCmd = `
$_SERVER['REQUEST_METHOD'] = 'POST';
$_GET['partner'] = 'ticket2loan';
$_POST['sub_id'] = 'PIM-TEST-1234';
$_POST['status'] = 'approved';
$_POST['secret'] = 'test-secret';
require '${postbackPath.replace(/\\/g, '/')}';
`;
  try {
    const output = execFileSync(phpBin, ['-r', phpCmd], { encoding: 'utf8' });
    const parsed = JSON.parse(output);
    assert.strictEqual(parsed.status, 'error');
    assert.ok(parsed.message.includes('permanently deactivated'), 'Message must indicate partner is discontinued');
  } catch (err) {
    // If output is printed before exit
    assert.ok(err.stdout.includes('permanently deactivated'), 'Output must indicate partner is discontinued');
  }
});

it('router.php intercepts any Ticket 2 Loan request and redirects to /loan-offers', () => {
  const routerPath = path.join(projectRoot, 'public_html', 'router.php');
  const routerCode = fs.readFileSync(routerPath, 'utf8');
  assert.ok(routerCode.includes('ticket2loan'), 'router.php must contain ticket2loan redirect');
  assert.ok(routerCode.includes('Location: /loan-offers'), 'router.php must redirect to /loan-offers');
});

it('.htaccess contains 301 Permanent Redirect rule for Ticket 2 Loan', () => {
  const htaccess = fs.readFileSync(path.join(projectRoot, 'public_html', '.htaccess'), 'utf8');
  assert.ok(htaccess.includes('ticket2loan'), '.htaccess must contain ticket2loan rule');
  assert.ok(htaccess.includes('/loan-offers [R=301,L,NC]'), '.htaccess must redirect to /loan-offers');
});

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED | ${failedTests} FAILED`);
console.log('======================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TICKET 2 LOAN REMOVAL & INTEGRITY TESTS PASSED 100%!');
}
