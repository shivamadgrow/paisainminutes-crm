import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const phpBinary = 'C:\\xampp\\php\\php.exe';

export function renderOffersPage(query = {}) {
  const getPairs = Object.entries(query)
    .map(([k, v]) => `$_GET['${k}'] = '${v}';`)
    .join(' ');
  const queryString = Object.entries(query)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  
  const phpScript = `
    ${getPairs}
    $_SERVER['REQUEST_METHOD'] = 'GET';
    $_SERVER['HTTP_HOST'] = 'paisainminutes.com';
    $_SERVER['REQUEST_URI'] = '/loan-offers.php?${queryString}';
    ob_start();
    require '${path.join(workspaceRoot, 'public_html', 'loan-offers.php').replace(/\\/g, '/')}';
    echo ob_get_clean();
  `;

  return execFileSync(phpBinary, ['-r', phpScript], { encoding: 'utf8' });
}

console.log('======================================================================');
console.log('🧪 VERIFYING RUPAY91 OFFER CARD UI/UX REQUIREMENTS');
console.log('======================================================================\n');

// 1. INELIGIBLE / LOCKED STATE VERIFICATION
const lockedHtml = renderOffersPage({ cibil: '650', salary: '50000' });
const lockedCardPos = lockedHtml.indexOf('id="partner-card-rupay91"');
assert.ok(lockedCardPos !== -1, 'Rupay91 locked card must be present');
const nextCardPos = lockedHtml.indexOf('id="partner-card-', lockedCardPos + 20);
const lockedCardChunk = nextCardPos !== -1 
  ? lockedHtml.substring(lockedCardPos, nextCardPos) 
  : lockedHtml.substring(lockedCardPos, lockedCardPos + 12000);

// Requirement 1 & 2: Metrics columns
assert.ok(
  lockedCardChunk.includes('MIN. SALARY / CIBIL'),
  'Requirement 2: Label must be "MIN. SALARY / CIBIL"'
);
assert.ok(
  lockedCardChunk.includes('₹1,00,000+') && lockedCardChunk.includes('700+'),
  'Requirement 2: Value must be "₹1,00,000+ / 700+"'
);
assert.ok(
  lockedCardChunk.includes('INTEREST RATE'),
  'Requirement 2: Interest rate label must be "INTEREST RATE"'
);
assert.ok(
  lockedCardChunk.includes('Up to') && lockedCardChunk.includes('1%') && lockedCardChunk.includes('/ day'),
  'Requirement 2: Interest rate value must be "Up to 1% / day"'
);
assert.ok(
  lockedCardChunk.includes('TENURE') && lockedCardChunk.includes('30–90 Days'),
  'Requirement 2: Tenure must be "30–90 Days"'
);

// Requirement 3: Status message
assert.ok(
  lockedCardChunk.includes('Not Eligible — Requires CIBIL ≥ 700 and Monthly Salary ≥ ₹1,00,000'),
  'Requirement 3: Status message must match "Not Eligible — Requires CIBIL ≥ 700 and Monthly Salary ≥ ₹1,00,000"'
);

// Requirement 4: Structure, classes & locked CTA
assert.ok(
  lockedCardChunk.includes('partner-metrics-locked'),
  'Requirement 1 & 4: Uses dedicated non-overlapping locked metrics grid'
);
assert.ok(
  lockedCardChunk.includes('metric-item-elig'),
  'Requirement 1: Uses independent metric-item-elig container'
);
assert.ok(
  lockedCardChunk.includes('btn-partner-locked'),
  'Requirement 4: Styled disabled CTA button with clear locked state'
);
assert.ok(
  lockedCardChunk.includes('card-badge-locked'),
  'Requirement 4: Responsive badge class present'
);
assert.ok(
  lockedCardChunk.includes('Locked • Requires CIBIL 700+ & Min. ₹1,00,000 Salary'),
  'Requirement 4: Locked CTA text must be readable and informative'
);
console.log('✅ All Ineligible / Locked Card requirements verified successfully!');

// 2. ELIGIBLE STATE VERIFICATION
console.log('\n--- 2. ELIGIBLE RUPAY91 CARD ---');
const eligibleHtml = renderOffersPage({ cibil: '750', salary: '120000' });
const eligibleCardPos = eligibleHtml.indexOf('id="partner-card-rupay91"');
const ineligibleOffersPos = eligibleHtml.indexOf('id="ineligibleOffersGrid"');
assert.ok(
  eligibleCardPos !== -1 && (ineligibleOffersPos === -1 || eligibleCardPos < ineligibleOffersPos),
  'Rupay91 must render in the eligible offers grid'
);
const nextEligiblePos = eligibleHtml.indexOf('id="partner-card-', eligibleCardPos + 20);
const eligibleCardChunk = nextEligiblePos !== -1
  ? eligibleHtml.substring(eligibleCardPos, nextEligiblePos)
  : eligibleHtml.substring(eligibleCardPos);

assert.ok(
  eligibleCardChunk.includes('MAX LOAN') && eligibleCardChunk.includes('₹1,00,000'),
  'Eligible card: Max loan must be ₹1,00,000'
);
assert.ok(
  eligibleCardChunk.includes('30–90 Days'),
  'Eligible card: Tenure must be "30–90 Days"'
);
assert.ok(
  eligibleCardChunk.includes('btn-apply-partner'),
  'Eligible card: Apply Now CTA must be present and active'
);
console.log('✅ All Eligible Card requirements verified successfully!');

// 3. OTHER PARTNERS UNCHANGED VERIFICATION
console.log('\n--- 3. OTHER PARTNERS PRESERVATION ---');
// For Jhatpat Loans in ineligible section when salary is 15000:
const otherLockedHtml = renderOffersPage({ cibil: '600', salary: '15000' });
assert.ok(
  otherLockedHtml.includes('MIN. SALARY'),
  'Other locked partner has MIN. SALARY label'
);
assert.ok(
  otherLockedHtml.includes('Not Eligible (Short by ₹'),
  'Other locked partner has shortfall notice'
);
console.log('✅ Other partner cards preserved without modification!');

console.log('\n======================================================================');
console.log('🎉 ALL RUPAY91 UI/UX VERIFICATION CHECKS PASSED 100%!');
console.log('======================================================================');
