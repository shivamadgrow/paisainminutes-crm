#!/usr/bin/env node
/**
 * Test Suite: Meta Conversions API (CAPI) Integration & Compliance
 *
 * Verifies:
 * 1. Meta official customer identifier normalization (Phone, Email, First Name)
 * 2. SHA-256 hashing standards (lowercase hex, no empty hashes)
 * 3. Browser Pixel & Server CAPI deduplication via matching event_id
 * 4. Raw fields integrity (IP address, User Agent, _fbp, _fbc are NOT hashed)
 * 5. Safe failure isolation (missing token or network error never crashes lead flow)
 * 6. API endpoint validation (rejects invalid/empty leads, accepts valid leads)
 * 7. Meta Test Events code support
 */

import assert from 'node:assert';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function runPhpCode(code) {
  const fullScript = `require_once '${path.join(projectRoot, 'public_html', 'includes', 'meta_capi_service.php').replace(/\\/g, '/')}';
${code}
`;
  return execFileSync(phpBin, ['-r', fullScript], { encoding: 'utf8' }).trim();
}

console.log('======================================================================');
console.log('🧪 RUNNING META CONVERSIONS API (CAPI) INTEGRATION & COMPLIANCE TESTS');
console.log('======================================================================\n');

// ----------------------------------------------------------------------------
// 1. Customer Identifiers Normalization & SHA-256 Hashing Tests
// ----------------------------------------------------------------------------
console.log('--- 1. NORMALIZATION & SHA-256 HASHING (META SPECIFICATION) ---');

it('Phone numbers with formatting (+91, spaces, hyphens) are normalized to 91XXXXXXXXXX and SHA-256 hashed', () => {
  const rawPhone = '+91 98110-02000';
  const expectedDigits = '919811002000';
  const expectedHash = crypto.createHash('sha256').update(expectedDigits).digest('hex');

  const phpOutput = runPhpCode(`echo MetaCapiService::hashPhone('${rawPhone}');`);
  assert.strictEqual(phpOutput, expectedHash, 'Normalized phone hash must match SHA-256 of 919811002000');
});

it('Standard 10-digit Indian numbers starting with 6-9 automatically prepend 91 country code', () => {
  const rawPhone = '9876543210';
  const expectedDigits = '919876543210';
  const expectedHash = crypto.createHash('sha256').update(expectedDigits).digest('hex');

  const phpOutput = runPhpCode(`echo MetaCapiService::hashPhone('${rawPhone}');`);
  assert.strictEqual(phpOutput, expectedHash);
});

it('Phone numbers with leading zeroes strip leading zero before country code formatting', () => {
  const rawPhone = '09811002000';
  const expectedDigits = '919811002000';
  const expectedHash = crypto.createHash('sha256').update(expectedDigits).digest('hex');

  const phpOutput = runPhpCode(`echo MetaCapiService::hashPhone('${rawPhone}');`);
  assert.strictEqual(phpOutput, expectedHash);
});

it('Email addresses are trimmed, lowercased, and SHA-256 hashed', () => {
  const rawEmail = '   Applicant.Test@Example.COM  ';
  const normalized = 'applicant.test@example.com';
  const expectedHash = crypto.createHash('sha256').update(normalized).digest('hex');

  const phpOutput = runPhpCode(`echo MetaCapiService::hashEmail('${rawEmail}');`);
  assert.strictEqual(phpOutput, expectedHash);
});

it('Invalid email addresses are rejected and return null (never empty sha256 hash)', () => {
  const phpOutput = runPhpCode(`echo (MetaCapiService::hashEmail('not-an-email') === null ? 'NULL' : 'HASH');`);
  assert.strictEqual(phpOutput, 'NULL', 'Invalid email must not produce a hash');
});

it('Full names extract first name, lowercase, strip special characters, and SHA-256 hash', () => {
  const rawName = '  Amit Kumar Sharma  ';
  const normalized = 'amit';
  const expectedHash = crypto.createHash('sha256').update(normalized).digest('hex');

  const phpOutput = runPhpCode(`echo MetaCapiService::hashFirstName('${rawName}');`);
  assert.strictEqual(phpOutput, expectedHash);
});

it('Empty customer identifiers return null and are omitted from user_data', () => {
  const phpOutput = runPhpCode(`
$data = MetaCapiService::buildUserData(['phone' => '', 'email' => '', 'name' => '']);
echo json_encode($data);
`);
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.ph, undefined, 'Empty phone must not be in user_data');
  assert.strictEqual(parsed.em, undefined, 'Empty email must not be in user_data');
  assert.strictEqual(parsed.fn, undefined, 'Empty name must not be in user_data');
});

// ----------------------------------------------------------------------------
// 2. Un-hashed Technical Identifiers (IP, User Agent, _fbp, _fbc)
// ----------------------------------------------------------------------------
console.log('\n--- 2. TECHNICAL IDENTIFIERS & COOKIES (UN-HASHED) ---');

it('Client IP address and User Agent are passed raw without hashing', () => {
  const phpOutput = runPhpCode(`
$data = MetaCapiService::buildUserData([
  'client_ip_address' => '203.0.113.195',
  'client_user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
]);
echo json_encode($data);
`);
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.client_ip_address, '203.0.113.195', 'IP address must be unhashed');
  assert.strictEqual(parsed.client_user_agent, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'User agent must be unhashed');
});

it('Facebook Browser ID (_fbp) cookie is preserved in correct format', () => {
  const testFbp = 'fb.1.1760520000.123456789';
  const phpOutput = runPhpCode(`
$data = MetaCapiService::buildUserData(['fbp' => '${testFbp}']);
echo json_encode($data);
`);
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.fbp, testFbp);
});

it('Facebook Click ID (_fbc) is constructed properly from fbclid query parameter', () => {
  const testFbclid = 'IwAR1234567890abcdef';
  const phpOutput = runPhpCode(`
$fbc = MetaCapiService::getFbc(null, '${testFbclid}');
echo $fbc;
`);
  assert.ok(phpOutput.startsWith('fb.1.'), '_fbc must start with fb.1.');
  assert.ok(phpOutput.endsWith('.' + testFbclid), '_fbc must end with fbclid parameter');
});

// ----------------------------------------------------------------------------
// 3. Browser-Server Deduplication (event_id Matching)
// ----------------------------------------------------------------------------
console.log('\n--- 3. EVENT DEDUPLICATION & METRICS ---');

it('sendLeadEvent requires a valid event_id (rejects empty string or missing ID)', () => {
  const phpOutput = runPhpCode(`
$res = MetaCapiService::sendLeadEvent([]);
echo json_encode($res);
`);
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.success, false);
  assert.strictEqual(parsed.code, 400);
});

it('sendLeadEvent performs runtime idempotency check for repeat submissions of same lead_id', () => {
  const phpOutput = runPhpCode(`
$first = MetaCapiService::sendLeadEvent(['event_id' => 'PIM-DEDUPE-TEST-001', 'phone' => '9811002000']);
$second = MetaCapiService::sendLeadEvent(['event_id' => 'PIM-DEDUPE-TEST-001', 'phone' => '9811002000']);
echo json_encode(['first' => $first, 'second' => $second]);
`);
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.second.skipped, true, 'Second call with identical event_id must be skipped');
  assert.strictEqual(parsed.second.code, 200);
});

// ----------------------------------------------------------------------------
// 4. Endpoint Routing & Safe Failure Isolation
// ----------------------------------------------------------------------------
console.log('\n--- 4. ENDPOINT EXECUTION & FAILURE ISOLATION ---');

it('api/meta-capi.php rejects GET requests with HTTP 405 Method Not Allowed', () => {
  const scriptPath = path.join(projectRoot, 'public_html', 'api', 'meta-capi.php');
  const phpCmd = `
$_SERVER['REQUEST_METHOD'] = 'GET';
require '${scriptPath.replace(/\\/g, '/')}';
`;
  const phpOutput = execFileSync(phpBin, ['-r', phpCmd], { encoding: 'utf8' });
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.success, false);
  assert.ok(/Method Not Allowed/i.test(parsed.error));
});

it('api/meta-capi.php rejects POST requests with missing event_id / lead_id with HTTP 400', () => {
  const scriptPath = path.join(projectRoot, 'public_html', 'api', 'meta-capi.php');
  const phpCmd = `
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = [];
require '${scriptPath.replace(/\\/g, '/')}';
`;
  const phpOutput = execFileSync(phpBin, ['-r', phpCmd], { encoding: 'utf8' });
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.success, false);
  assert.ok(/Missing required/i.test(parsed.error));
});

it('api/meta-capi.php gracefully handles missing META_CAPI_TOKEN without failing lead submission', () => {
  const scriptPath = path.join(projectRoot, 'public_html', 'api', 'meta-capi.php');
  const phpCmd = `
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST = ['event_id' => 'PIM-GRACEFUL-TEST-001', 'phone' => '9811002000'];
putenv('META_CAPI_TOKEN=');
require '${scriptPath.replace(/\\/g, '/')}';
`;
  const phpOutput = execFileSync(phpBin, ['-r', phpCmd], { encoding: 'utf8' });
  const parsed = JSON.parse(phpOutput);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.event_id, 'PIM-GRACEFUL-TEST-001');
  assert.strictEqual(parsed.skipped, true);
});

it('META_TEST_EVENT_CODE is included in payload when configured', () => {
  const phpOutput = runPhpCode(`
putenv('META_TEST_EVENT_CODE=TEST_DEBUG_123');
echo MetaCapiService::getTestEventCode();
`);
  assert.strictEqual(phpOutput, 'TEST_DEBUG_123');
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
  console.log('🎉 ALL META CONVERSIONS API (CAPI) COMPLIANCE TESTS PASSED 100%!');
}
