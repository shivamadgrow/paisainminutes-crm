/**
 * Rupay91 Partner Eligibility Rules Test Suite
 *
 * Verifies strict eligibility rules:
 * - CIBIL score >= 700 (verified, valid)
 * - Monthly salary >= ₹1,00,000 (valid monthly salary, not annual income)
 * - Both conditions mandatory.
 * - Ineligible leads cannot reach Rupay91 via UI offers, manual assignment, or API push.
 * - Other partners remain 100% unchanged.
 */

import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');

// Import JS modules from public_html/crm/src
const {
  AFFILIATE_PARTNERS,
  isRupay91Eligible,
  isPartnerEligible,
  getEligibilityMatrix,
  getSalaryMatchedOffers,
  extractCibilScore,
  extractMonthlySalary
} = await import('../public_html/crm/src/data/affiliatePartners.js');

const { cleanSalary } = await import('../public_html/crm/src/utils/amountHelpers.js');

let passedCount = 0;
let failedCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failedCount++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failedCount++;
  }
}

console.log('======================================================================');
console.log('🧪 RUNNING RUPAY91 PARTNER ELIGIBILITY TEST SUITE');
console.log('======================================================================');

// ----------------------------------------------------------------------------
// 1. Core isRupay91Eligible function tests
// ----------------------------------------------------------------------------
console.log('\n--- 1. CORE RUPAY91 ELIGIBILITY LOGIC ---');

test('CIBIL 750 + Salary ₹1,20,000 -> Eligible', () => {
  const lead = { cibil: 750, salary: 120000 };
  assert.strictEqual(isRupay91Eligible(lead), true);
});

test('CIBIL 700 + Salary ₹1,00,000 (Exact threshold boundary) -> Eligible', () => {
  const lead = { cibil: 700, salary: 100000 };
  assert.strictEqual(isRupay91Eligible(lead), true);
});

test('CIBIL 720 + Salary ₹80,000 (High CIBIL, Low Salary) -> NOT Eligible', () => {
  const lead = { cibil: 720, salary: 80000 };
  assert.strictEqual(isRupay91Eligible(lead), false);
});

test('CIBIL 680 + Salary ₹1,50,000 (Low CIBIL, High Salary) -> NOT Eligible', () => {
  const lead = { cibil: 680, salary: 150000 };
  assert.strictEqual(isRupay91Eligible(lead), false);
});

test('CIBIL 699 + Salary ₹99,000 (Just below both thresholds) -> NOT Eligible', () => {
  const lead = { cibil: 699, salary: 99000 };
  assert.strictEqual(isRupay91Eligible(lead), false);
});

test('Missing or null CIBIL -> NOT Eligible', () => {
  assert.strictEqual(isRupay91Eligible({ salary: 120000 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: null, salary: 120000 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: '', salary: 120000 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: '—', salary: 120000 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 'Fetching...', salary: 120000 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil_status: 'failed', salary: 120000 }), false);
});

test('Missing or invalid salary -> NOT Eligible', () => {
  assert.strictEqual(isRupay91Eligible({ cibil: 750 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: null }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '' }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: 0 }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: 'N/A' }), false);
});

// ----------------------------------------------------------------------------
// 2. Formatting and Monthly Salary Extraction
// ----------------------------------------------------------------------------
console.log('\n--- 2. SALARY FORMATTING & CURRENCY PARSING ---');

test('Formatted currency string parsing: "₹1,00,000", "1 Lakh", "120k"', () => {
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '₹1,00,000' }), true);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '1 Lakh' }), true);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '1.2 Lakh' }), true);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '100k' }), true);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '120k' }), true);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '80k' }), false);
  assert.strictEqual(isRupay91Eligible({ cibil: 750, salary: '0.8 Lakh' }), false);
});

test('Annual CTC safeguard: cleanSalary rejects values > ₹5,00,000 without monthly clarity', () => {
  // If annual CTC of 12,00,000 is given without monthly indicator, cleanSalary protects against confusing annual for monthly
  const ctc = cleanSalary('1200000');
  assert.strictEqual(ctc, 0, 'Excessive annual CTC without monthly specification must return 0 to prevent accidental Rupay91 qualification');
});

// ----------------------------------------------------------------------------
// 3. Other Partners Unchanged
// ----------------------------------------------------------------------------
console.log('\n--- 3. OTHER PARTNERS REMAIN UNCHANGED ---');

test('Other partner requirements (minSalary, minCibil) remain completely unmodified', () => {
  const borrowera = AFFILIATE_PARTNERS.find(p => p.id === 'borrowera');
  assert.strictEqual(borrowera.minSalary, 45000);
  assert.strictEqual(borrowera.minCibil, 600);

  const instarupees = AFFILIATE_PARTNERS.find(p => p.id === 'instarupees');
  assert.strictEqual(instarupees.minSalary, 40000);
  assert.strictEqual(instarupees.minCibil, 550);

  const jhatpatloans = AFFILIATE_PARTNERS.find(p => p.id === 'jhatpatloans');
  assert.strictEqual(jhatpatloans.minSalary, 30000);
  assert.strictEqual(jhatpatloans.minCibil, 500);

  const moneydot = AFFILIATE_PARTNERS.find(p => p.id === 'moneydot');
  assert.strictEqual(moneydot.minSalary, 15000);
  assert.strictEqual(moneydot.minCibil, 300);

  const easyfincare = AFFILIATE_PARTNERS.find(p => p.id === 'easyfincare');
  assert.strictEqual(easyfincare.minSalary, 45000);
  assert.strictEqual(easyfincare.minCibil, 550);

  const rupay91 = AFFILIATE_PARTNERS.find(p => p.id === 'rupay91');
  assert.strictEqual(rupay91.minSalary, 100000);
  assert.strictEqual(rupay91.minCibil, 700);
});

test('Leads failing Rupay91 criteria are still eligible for other partners', () => {
  const lead = { cibil: 650, salary: 50000 };
  assert.strictEqual(isRupay91Eligible(lead), false, 'Rupay91 must be ineligible');
  assert.strictEqual(isPartnerEligible('borrowera', lead), true, 'Borrowera must be eligible');
  assert.strictEqual(isPartnerEligible('instarupees', lead), true, 'Insta Rupees must be eligible');
  assert.strictEqual(isPartnerEligible('jhatpatloans', lead), true, 'Jhatpat Loans must be eligible');
  assert.strictEqual(isPartnerEligible('moneydot', lead), true, 'MoneyDot must be eligible');
  assert.strictEqual(isPartnerEligible('easyfincare', lead), true, 'Easy Fincare must be eligible');
});

// ----------------------------------------------------------------------------
// 4. Offer Matching & Visibility (getSalaryMatchedOffers)
// ----------------------------------------------------------------------------
console.log('\n--- 4. OFFER MATCHING & VISIBILITY ---');

test('getSalaryMatchedOffers places Rupay91 in eligible offers ONLY when both criteria met', () => {
  // Case A: Eligible lead (CIBIL 750 + Salary 120000)
  const offersA = getSalaryMatchedOffers({ cibil: 750, salary: 120000 });
  const rupayEligibleA = offersA.eligible.some(p => p.id === 'rupay91');
  assert.strictEqual(rupayEligibleA, true, 'Rupay91 must be in eligible offers for CIBIL 750 + ₹120k');

  // Case B: Ineligible lead due to low salary (CIBIL 750 + Salary 60000)
  const offersB = getSalaryMatchedOffers({ cibil: 750, salary: 60000 });
  const rupayEligibleB = offersB.eligible.some(p => p.id === 'rupay91');
  const rupayIneligibleB = offersB.ineligible.some(p => p.id === 'rupay91');
  assert.strictEqual(rupayEligibleB, false, 'Rupay91 must NOT be in eligible offers for salary ₹60k');
  assert.strictEqual(rupayIneligibleB, true, 'Rupay91 must be locked in ineligible offers for salary ₹60k');

  // Case C: Ineligible lead due to low CIBIL (CIBIL 650 + Salary 150000)
  const offersC = getSalaryMatchedOffers({ cibil: 650, salary: 150000 });
  const rupayEligibleC = offersC.eligible.some(p => p.id === 'rupay91');
  const rupayIneligibleC = offersC.ineligible.some(p => p.id === 'rupay91');
  assert.strictEqual(rupayEligibleC, false, 'Rupay91 must NOT be in eligible offers for CIBIL 650');
  assert.strictEqual(rupayIneligibleC, true, 'Rupay91 must be locked in ineligible offers for CIBIL 650');

  // Case D: Missing CIBIL with high salary
  const offersD = getSalaryMatchedOffers({ cibil: null, salary: 150000 });
  const rupayEligibleD = offersD.eligible.some(p => p.id === 'rupay91');
  assert.strictEqual(rupayEligibleD, false, 'Rupay91 must NOT be in eligible offers when CIBIL is null');
});

// ----------------------------------------------------------------------------
// 5. Automatic Lead Assignment Fallback (getEligibilityMatrix)
// ----------------------------------------------------------------------------
console.log('\n--- 5. AUTOMATIC DISTRIBUTION & RE-EVALUATION ---');

test('getEligibilityMatrix falls back to other partner if Rupay91 criteria fail', () => {
  // Existing lead assigned to Rupay 91 that meets new criteria stays assigned
  const eligibleLead = { assignedCompany: 'Rupay 91', cibil: 750, salary: 120000 };
  const eligibleMatrix = getEligibilityMatrix(eligibleLead);
  assert.strictEqual(eligibleMatrix.partner, 'Rupay 91', 'Eligible lead can remain assigned to Rupay 91');

  // Existing lead assigned to Rupay 91 that fails new rules is flagged as Pending Selection to block future delivery
  const ineligibleLead = { assignedCompany: 'Rupay 91', cibil: 650, salary: 50000 };
  const reevalMatrix = getEligibilityMatrix(ineligibleLead);
  assert.strictEqual(reevalMatrix.partner, 'Pending Selection', 'Ineligible existing lead cannot remain assigned to Rupay91');
});

// ----------------------------------------------------------------------------
// 6. PHP loan-offers.php Verification via PHP CLI
// ----------------------------------------------------------------------------
console.log('\n--- 6. PHP LOAN-OFFERS.PHP RENDER VERIFICATION ---');

const phpBinary = 'C:\\xampp\\php\\php.exe';

test('PHP loan-offers.php: CIBIL 750 + Salary ₹1,20,000 renders Rupay91 as eligible', () => {
  const phpScript = `
    $_GET['cibil'] = '750';
    $_GET['salary'] = '120000';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?cibil=750&salary=120000';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    // Check if rupay91 is in eligible offers container (not in ineligibleOffersGrid)
    $hasCard = strpos($html, 'id="partner-card-rupay91"') !== false;
    $ineligiblePos = strpos($html, 'id="ineligibleOffersGrid"');
    $cardPos = strpos($html, 'id="partner-card-rupay91"');
    $isEligible = $hasCard && ($ineligiblePos === false || $cardPos < $ineligiblePos);
    echo $isEligible ? 'ELIGIBLE' : 'NOT_ELIGIBLE';
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.strictEqual(output, 'ELIGIBLE', 'Rupay91 must be rendered in eligible offers grid');
});

test('PHP loan-offers.php: CIBIL 720 + Salary ₹80,000 renders Rupay91 as locked/ineligible', () => {
  const phpScript = `
    $_GET['cibil'] = '720';
    $_GET['salary'] = '80000';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?cibil=720&salary=80000';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    // Check if rupay91 is locked in ineligible offers
    $isLocked = (strpos($html, 'id="partner-card-rupay91"') !== false &&
                 strpos($html, 'partner-card-rupay91') > strpos($html, 'id="ineligibleOffersGrid"'));
    echo $isLocked ? 'LOCKED' : 'NOT_LOCKED';
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.strictEqual(output, 'LOCKED', 'Rupay91 must be locked in ineligible offers grid when salary < 100k');
});

test('PHP loan-offers.php: CIBIL 680 + Salary ₹1,50,000 renders Rupay91 as locked/ineligible', () => {
  const phpScript = `
    $_GET['cibil'] = '680';
    $_GET['salary'] = '150000';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?cibil=680&salary=150000';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    $isLocked = (strpos($html, 'id="partner-card-rupay91"') !== false &&
                 strpos($html, 'partner-card-rupay91') > strpos($html, 'id="ineligibleOffersGrid"'));
    echo $isLocked ? 'LOCKED' : 'NOT_LOCKED';
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.strictEqual(output, 'LOCKED', 'Rupay91 must be locked in ineligible offers grid when CIBIL < 700');
});

test('PHP loan-offers.php: Missing CIBIL renders Rupay91 as locked/ineligible', () => {
  const phpScript = `
    $_GET['salary'] = '150000';
    unset($_GET['cibil']);
    unset($_GET['cibil_score']);
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?salary=150000';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    $html = ob_get_clean();

    $isLocked = (strpos($html, 'id="partner-card-rupay91"') !== false &&
                 strpos($html, 'partner-card-rupay91') > strpos($html, 'id="ineligibleOffersGrid"'));
    echo $isLocked ? 'LOCKED' : 'NOT_LOCKED';
  `;

  const output = execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' }).trim();
  assert.strictEqual(output, 'LOCKED', 'Rupay91 must be locked in ineligible offers grid when CIBIL is missing');
});

// ----------------------------------------------------------------------------
// 7. API Delivery Guards (pushLeadToPartnerApi)
// ----------------------------------------------------------------------------
console.log('\n--- 7. API DELIVERY GUARDS ---');

const { pushLeadToPartnerApi } = await import('../public_html/crm/src/utils/crmApi.js');

await testAsync('pushLeadToPartnerApi blocks delivery of ineligible leads to Rupay91 (HTTP 422)', async () => {
  const ineligibleLead = { id: 'LEAD-101', cibil: 650, salary: 120000 };
  const res = await pushLeadToPartnerApi({ partnerId: 'rupay91', applicationId: 'LEAD-101' }, ineligibleLead);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 422);
  assert.ok(res.error.includes('Delivery blocked'));
});

await testAsync('pushLeadToPartnerApi blocks delivery if salary < 100k (HTTP 422)', async () => {
  const ineligibleLead = { id: 'LEAD-102', cibil: 750, salary: 80000 };
  const res = await pushLeadToPartnerApi({ partnerId: 'rupay91', applicationId: 'LEAD-102' }, ineligibleLead);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 422);
  assert.ok(res.error.includes('Delivery blocked'));
});

console.log('\n======================================================================');
console.log(`TEST SUMMARY: ${passedCount} PASSED | ${failedCount} FAILED`);
console.log('======================================================================');

if (failedCount > 0) {
  process.exit(1);
}

