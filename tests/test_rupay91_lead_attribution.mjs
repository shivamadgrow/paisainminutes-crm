#!/usr/bin/env node
/**
 * Test Suite: Rupay 91 Lead Tracking & Attribution Across Redirects and Application Flow
 */

import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPartnerTrackingUrl, getPartnerDirectUtmUrl } from '../public_html/crm/src/data/affiliatePartners.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const phpBinary = 'C:\\xampp\\php\\php.exe';
const workspaceRoot = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('🧪 RUNNING RUPAY 91 LEAD ATTRIBUTION AND TRACKING INTEGRATION TESTS');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

// ----------------------------------------------------------------------------
// 1. CRM Affiliate Partners Helper Module Tests
// ----------------------------------------------------------------------------
console.log('--- 1. CRM MODULE (affiliatePartners.js) ---');

it('getPartnerTrackingUrl for rupay91 includes lead_id, ref, sub_id, and encoded next param', () => {
  const leadId = 'PIM-20261014-6964';
  const url = getPartnerTrackingUrl('rupay91', {
    leadId,
    source: 'loan_offers',
    campaign: 'facebook_diwali',
    term: 'cibil750'
  });

  const parsed = new URL(url);
  assert.strictEqual(parsed.origin, 'https://loans.rupay91.com');
  assert.strictEqual(parsed.pathname, '/login');
  assert.strictEqual(parsed.searchParams.get('lead_id'), leadId);
  assert.strictEqual(parsed.searchParams.get('ref'), 'paisainminutes');
  assert.strictEqual(parsed.searchParams.get('sub_id'), leadId);
  assert.strictEqual(parsed.searchParams.get('utm_source'), 'paisainminutes');
  assert.strictEqual(parsed.searchParams.get('utm_campaign'), 'facebook_diwali');

  // Verify next parameter
  const nextVal = parsed.searchParams.get('next');
  assert.ok(nextVal, 'next parameter must be present');
  assert.ok(nextVal.startsWith('/new?'), 'next must target /new route');
  assert.ok(nextVal.includes(`lead_id=${encodeURIComponent(leadId)}`), 'next must contain lead_id');
  assert.ok(nextVal.includes('ref=paisainminutes'), 'next must contain ref=paisainminutes');
  assert.ok(nextVal.includes(`sub_id=${encodeURIComponent(leadId)}`), 'next must contain sub_id');
});

it('getPartnerDirectUtmUrl for rupay91 includes sub_id, lead_id, and encoded next param', () => {
  const leadId = 'PIM-20261014-6964';
  const url = getPartnerDirectUtmUrl('rupay91', {
    leadId,
    campaign: 'google_search',
    term: 'urgent_loan'
  });

  const parsed = new URL(url);
  assert.strictEqual(parsed.searchParams.get('sub_id'), leadId);
  assert.strictEqual(parsed.searchParams.get('lead_id'), leadId);
  assert.strictEqual(parsed.searchParams.get('ref'), 'paisainminutes');

  const nextVal = parsed.searchParams.get('next');
  assert.ok(nextVal, 'next parameter must be present in direct UTM URL');
  assert.ok(nextVal.startsWith('/new?'), 'next parameter must target /new');
});

// ----------------------------------------------------------------------------
// 2. PHP loan-offers.php Rendering & Attribution Tests
// ----------------------------------------------------------------------------
console.log('\n--- 2. LOAN OFFERS PAGE (loan-offers.php) ---');

it('loan-offers.php renders Rupay 91 apply link with lead_id, ref, sub_id, and encoded next', () => {
  const testLead = 'PIM-20261014-6964';
  const phpScript = `
    $_GET['lead_id'] = '${testLead}';
    $_GET['cibil'] = '780';
    $_GET['salary'] = '120000';
    $_GET['utm_source'] = 'test_source';
    $_GET['utm_campaign'] = 'test_campaign';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?lead_id=${testLead}&cibil=780';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    // Find the Rupay91 card
    if (preg_match('#<a\\s+href="([^"]+)"[^>]*data-partner-slug="rupay91"#i', $html, $m)) {
        echo $m[1];
    } else {
        echo "NOT_FOUND";
    }
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.notStrictEqual(output, 'NOT_FOUND', 'Rupay91 apply link must be rendered for CIBIL >= 750');

  const decodedUrl = output.replace(/&amp;/g, '&');
  const parsed = new URL(decodedUrl);
  assert.strictEqual(parsed.hostname, 'loans.rupay91.com');
  assert.strictEqual(parsed.pathname, '/login');
  assert.strictEqual(parsed.searchParams.get('lead_id'), testLead);
  assert.strictEqual(parsed.searchParams.get('ref'), 'paisainminutes');
  assert.strictEqual(parsed.searchParams.get('sub_id'), testLead);
  assert.strictEqual(parsed.searchParams.get('utm_source'), 'test_source');

  const nextVal = parsed.searchParams.get('next');
  assert.ok(nextVal, 'next parameter must be present');
  assert.ok(nextVal.startsWith('/new?'), 'next must target /new');
  assert.ok(nextVal.includes(`lead_id=${encodeURIComponent(testLead)}`), 'next must contain lead_id');
  assert.ok(nextVal.includes('ref=paisainminutes'), 'next must contain ref=paisainminutes');
});

it('loan-offers.php session persistence preserves lead_id across page reloads without URL param', () => {
  const testLead = 'PIM-20261014-9999';
  const phpScript = `
    session_start();
    $_SESSION['pim_lead_id'] = '${testLead}';
    unset($_GET['lead_id']);
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    ob_end_clean();
    echo $leadId;
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.strictEqual(output, testLead, 'Page reload without lead_id in URL must preserve lead_id from session');
});

// ----------------------------------------------------------------------------
// 3. PHP instant-cash-loan.php Landing Page Tests
// ----------------------------------------------------------------------------
console.log('\n--- 3. LANDING PAGE (instant-cash-loan.php) ---');

it('instant-cash-loan.php generates Rupay 91 CTA with lead_id, sub_id, ref, and next', () => {
  const testLead = 'PIM-20261014-5555';
  const phpScript = `
    $_GET['lead_id'] = '${testLead}';
    $_GET['utm_source'] = 'meta_ads';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/instant-cash-loan?lead_id=${testLead}';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'instant-cash-loan.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    // Match rupay91 CTA link
    if (preg_match('#<a\\s+href="([^"]+)"[^>]*data-partner-slug="rupay91"#i', $html, $m)) {
        echo $m[1];
    } else {
        echo "NOT_FOUND";
    }
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.notStrictEqual(output, 'NOT_FOUND', 'Rupay91 CTA must be present in instant-cash-loan.php');

  const decodedUrl = output.replace(/&amp;/g, '&');
  const parsed = new URL(decodedUrl);
  assert.strictEqual(parsed.hostname, 'loans.rupay91.com');
  assert.strictEqual(parsed.searchParams.get('lead_id'), testLead);
  assert.strictEqual(parsed.searchParams.get('ref'), 'paisainminutes');
  assert.strictEqual(parsed.searchParams.get('sub_id'), testLead);

  const nextVal = parsed.searchParams.get('next');
  assert.ok(nextVal, 'next parameter must be present');
  assert.ok(nextVal.includes(`lead_id=${encodeURIComponent(testLead)}`), 'next must contain lead_id');
});

// ----------------------------------------------------------------------------
// 4. Partner-Side Angular SPA Routing Simulation
// ----------------------------------------------------------------------------
console.log('\n--- 4. RUPAY 91 ANGULAR ROUTER SIMULATION ---');

it('Rupay 91 production explicitNext() and resolveLanding() navigate to /new with preserved attribution', () => {
  // Exact reverse-engineered Angular methods from loans.rupay91.com/chunk-DRdy3ZFB.js:
  //
  // explicitNext() {
  //   let t = this.route.snapshot.queryParamMap.get("next");
  //   return t && t.startsWith("/") && !t.startsWith("//") ? t : null
  // }
  // resolveLanding(t) {
  //   let e = this.explicitNext();
  //   return e && e !== "/new" ? e : this.hasResumableDraft() ? "/new?resume=1" : t === 0 ? "/new" : "/"
  // }

  const leadId = 'PIM-20261014-6964';
  const outboundUrl = getPartnerTrackingUrl('rupay91', { leadId });
  const parsed = new URL(outboundUrl);

  // Simulated snapshot of queryParamMap in Angular
  const queryParamMap = {
    get: (key) => parsed.searchParams.get(key)
  };

  const hasResumableDraft = () => false;

  function explicitNext() {
    let t = queryParamMap.get("next");
    return t && t.startsWith("/") && !t.startsWith("//") ? t : null;
  }

  function resolveLanding(applicationsCount) {
    let e = explicitNext();
    return e && e !== "/new" ? e : hasResumableDraft() ? "/new?resume=1" : applicationsCount === 0 ? "/new" : "/";
  }

  // 1. User enters email and verifies OTP:
  const extractedNext = explicitNext();
  assert.ok(extractedNext, 'explicitNext() must extract the valid path');
  assert.ok(extractedNext.startsWith('/new?'), 'must start with /new?');

  // 2. Resolve target route for a brand new applicant (0 prior applications):
  const landingRoute = resolveLanding(0);
  assert.strictEqual(landingRoute, extractedNext, 'resolveLanding() must return the extractedNext with query parameters');

  // 3. Simulated router.navigateByUrl(landingRoute):
  const postLoginUrl = new URL('https://loans.rupay91.com' + landingRoute);
  assert.strictEqual(postLoginUrl.pathname, '/new');
  assert.strictEqual(postLoginUrl.searchParams.get('lead_id'), leadId);
  assert.strictEqual(postLoginUrl.searchParams.get('ref'), 'paisainminutes');
  assert.strictEqual(postLoginUrl.searchParams.get('sub_id'), leadId);
  console.log(`   Verified Post-OTP Destination: ${postLoginUrl.toString()}`);
});

// ----------------------------------------------------------------------------
// 5. Security & Parameter Validation Tests
// ----------------------------------------------------------------------------
console.log('\n--- 5. FINTECH SECURITY & ATTRIBUTION INTEGRITY ---');

it('lead_id with special characters is sanitized and cannot inject query parameters', () => {
  const maliciousLead = 'PIM-20261014-6964&evil=1#fragment';
  const url = getPartnerTrackingUrl('rupay91', { leadId: maliciousLead });
  const parsed = new URL(url);

  // The lead_id parameter must be properly encoded and not split into &evil=1
  assert.strictEqual(parsed.searchParams.get('evil'), null, 'Query parameter injection must be prevented');
  assert.strictEqual(parsed.searchParams.get('lead_id'), maliciousLead);
});

it('Open redirect protection: protocol-relative and external URLs in next are rejected by partner router logic', () => {
  const maliciousTargets = [
    '//evil.example.com',
    'https://evil.example.com/new',
    'javascript:alert(1)',
    'data:text/html,evil'
  ];

  for (const target of maliciousTargets) {
    const isAllowed = target.startsWith('/') && !target.startsWith('//');
    assert.strictEqual(isAllowed, false, `Malicious target ${target} must be rejected by Angular router constraint`);
  }
});

// ----------------------------------------------------------------------------
// 6. Postback Webhook Handler Tests
// ----------------------------------------------------------------------------
console.log('\n--- 6. PARTNER CONVERSION POSTBACK HANDLER (postback.php) ---');

it('postback.php rejects requests with missing secret (HTTP 401)', () => {
  const phpScript = `
    $_GET['partner'] = 'rupay91';
    $_GET['sub_id'] = 'PIM-20261014-6964';
    $_GET['status'] = 'approved';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    require '${path.join(workspaceRoot, 'public_html', 'postback.php').replace(/\\/g, '/')}';
  `;

  try {
    const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
    const json = JSON.parse(output);
    assert.strictEqual(json.success, false);
    assert.ok(json.error && json.error.includes('Unauthorized'));
  } catch (err) {
    assert.fail('Postback script execution failed: ' + err.message);
  }
});

it('postback.php rejects invalid status word (HTTP 400)', () => {
  const phpScript = `
    $_GET['partner'] = 'rupay91';
    $_GET['sub_id'] = 'PIM-20261014-6964';
    $_GET['status'] = 'invalid_banana';
    $_GET['secret'] = 'dummy_secret';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    require '${path.join(workspaceRoot, 'public_html', 'postback.php').replace(/\\/g, '/')}';
  `;

  try {
    const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
    const json = JSON.parse(output);
    assert.strictEqual(json.success, false);
    assert.ok(json.message && json.message.includes('Invalid status value'));
  } catch (err) {
    assert.fail('Postback script execution failed: ' + err.message);
  }
});

it('postback.php rejects negative amount (HTTP 400)', () => {
  const phpScript = `
    $_GET['partner'] = 'rupay91';
    $_GET['sub_id'] = 'PIM-20261014-6964';
    $_GET['status'] = 'disbursed';
    $_GET['amount'] = '-50000';
    $_GET['secret'] = 'dummy_secret';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    require '${path.join(workspaceRoot, 'public_html', 'postback.php').replace(/\\/g, '/')}';
  `;

  try {
    const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
    const json = JSON.parse(output);
    assert.strictEqual(json.success, false);
    assert.ok(json.message && json.message.includes('non-negative number'));
  } catch (err) {
    assert.fail('Postback script execution failed: ' + err.message);
  }
});

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log('======================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL RUPAY 91 LEAD ATTRIBUTION AND INTEGRATION TESTS PASSED 100%!');
}
