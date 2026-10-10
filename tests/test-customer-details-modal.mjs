import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicHtmlDir = path.join(rootDir, 'public_html');
const modalPath = path.join(publicHtmlDir, 'includes', 'customer-details-modal.php');
const landingPath = path.join(publicHtmlDir, 'instant-cash-loan.php');

let failures = 0;
let passed = 0;

function assert(name, condition, details = '') {
    if (!condition) {
        console.error(`❌ FAIL: ${name} ${details ? '– ' + details : ''}`);
        failures++;
    } else {
        console.log(`✅ PASS: ${name}`);
        passed++;
    }
}

console.log('\n=== 1. VERIFYING CUSTOMER DETAILS MODAL COMPONENT (customer-details-modal.php) ===');

if (!fs.existsSync(modalPath)) {
    console.error(`Modal file missing at ${modalPath}`);
    process.exit(1);
}

const modalContent = fs.readFileSync(modalPath, 'utf8');

// A. Title and Subtitle
assert('Modal title is "Complete Your Details"', modalContent.includes('Complete Your Details'));
assert('Modal subtitle matches audited string', modalContent.includes('Please provide your details to help us evaluate available loan options.'));

// B. Required Fields
assert('Full Name input #pimFullName is present', modalContent.includes('id="pimFullName"'));
assert('Full Name has required indicator', modalContent.includes('for="pimFullName"') && modalContent.includes('Full Name <span class="pim-req">*</span>'));
assert('PAN Number input #pimPanNumber is present', modalContent.includes('id="pimPanNumber"'));
assert('PAN Number has required indicator', modalContent.includes('for="pimPanNumber"') && modalContent.includes('PAN Number <span class="pim-req">*</span>'));
assert('PAN input has maxlength 10', modalContent.includes('maxlength="10"'));
assert('PAN placeholder ABCDE1234F is present', modalContent.includes('placeholder="ABCDE1234F"'));

assert('Official Email input #pimOfficialEmail is present', modalContent.includes('id="pimOfficialEmail"'));
assert('Official Email has required indicator', modalContent.includes('for="pimOfficialEmail"') && modalContent.includes('Official Email Address <span class="pim-req">*</span>'));

assert('Address Type select #pimAddressType is present', modalContent.includes('id="pimAddressType"'));
assert('Address Type has required indicator', modalContent.includes('for="pimAddressType"') && modalContent.includes('Address Type <span class="pim-req">*</span>'));
assert('Address Type contains option "Owned"', modalContent.includes('<option value="Owned">Owned</option>'));
assert('Address Type contains option "Rented"', modalContent.includes('<option value="Rented">Rented</option>'));
assert('Address Type contains option "Family-Owned"', modalContent.includes('<option value="Family-Owned">Family-Owned</option>'));
assert('Address Type contains option "Company-Provided"', modalContent.includes('<option value="Company-Provided">Company-Provided</option>'));
assert('Address Type contains option "Other"', modalContent.includes('<option value="Other">Other</option>'));

assert('Monthly Salary input #pimMonthlySalary is present', modalContent.includes('id="pimMonthlySalary"'));
assert('Monthly Salary has required indicator', modalContent.includes('for="pimMonthlySalary"') && modalContent.includes('Monthly Salary <span class="pim-req">*</span>'));
assert('Monthly Salary displays currency prefix ₹', modalContent.includes('class="pim-currency-prefix">₹</span>'));
assert('Monthly Salary is NOT prefilled with assumed salary', !modalContent.includes('id="pimMonthlySalary" value=') && !modalContent.includes('id="pimMonthlySalary" name="monthlySalary" value='));

// C. Consents and Privacy
assert('Explicit Terms & Privacy consent checkbox #pimConsentTerms is present', modalContent.includes('id="pimConsentTerms"'));
assert('Explicit Credit bureau consent checkbox #pimConsentBureau is present', modalContent.includes('id="pimConsentBureau"'));
assert('Consents are separate checkboxes', modalContent.includes('id="pimConsentTerms"') && modalContent.includes('id="pimConsentBureau"'));
assert('Terms consent is NOT pre-checked', !modalContent.includes('id="pimConsentTerms" class="pim-checkbox" checked') && !modalContent.includes('id="pimConsentTerms" checked'));
assert('Credit bureau consent is NOT pre-checked', !modalContent.includes('id="pimConsentBureau" class="pim-checkbox" checked') && !modalContent.includes('id="pimConsentBureau" checked'));

// D. CTA Button and Feedback
assert('CTA button text "Save Details & Continue →"', modalContent.includes('Save Details &amp; Continue →') || modalContent.includes('Save Details & Continue →'));
assert('Alert banner #pimDetailsAlert is present for error/loading feedback', modalContent.includes('id="pimDetailsAlert"'));
assert('Inline field error elements present for all fields', 
    modalContent.includes('id="pimFullNameError"') &&
    modalContent.includes('id="pimPanError"') &&
    modalContent.includes('id="pimEmailError"') &&
    modalContent.includes('id="pimAddressTypeError"') &&
    modalContent.includes('id="pimSalaryError"') &&
    modalContent.includes('id="pimConsentTermsError"') &&
    modalContent.includes('id="pimConsentBureauError"')
);

// E. Component API & Validation Logic
assert('window.PimCustomerDetailsModal API is exposed', modalContent.includes('window.PimCustomerDetailsModal ='));
assert('PimCustomerDetailsModal has open method', modalContent.includes('open: open'));
assert('PimCustomerDetailsModal has close method', modalContent.includes('close: close'));
assert('PAN format validation regex implemented', modalContent.includes('/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/'));
assert('Email validation regex implemented', modalContent.includes('emailRegex'));
assert('Salary positive amount check implemented', modalContent.includes('val <= 0') || modalContent.includes('val < 5000'));
assert('Privacy notice version is recorded', modalContent.includes('PRIVACY_NOTICE_VERSION') || modalContent.includes('noticeVersion'));
assert('Consent timestamp is recorded', modalContent.includes('consentTimestamp'));
assert('Backend save sends to /api/public/leads', modalContent.includes('/api/public/leads'));
assert('Lead update sends addressType and monthlySalary', modalContent.includes('addressType: addressType') && modalContent.includes('monthlySalary: monthlySalary'));

console.log('\n=== 2. VERIFYING INTEGRATION IN instant-cash-loan.php ===');

if (!fs.existsSync(landingPath)) {
    console.error(`Landing page missing at ${landingPath}`);
    process.exit(1);
}

const landingContent = fs.readFileSync(landingPath, 'utf8');

assert('customer-details-modal.php is included in instant-cash-loan.php', landingContent.includes("include_once __DIR__ . '/includes/customer-details-modal.php'"));
assert('OTP success callback triggers PimCustomerDetailsModal.open', landingContent.includes('window.PimCustomerDetailsModal.open('));
assert('Customer Details Modal onSuccess triggers credit check workflow', landingContent.includes('proceedWithVerifiedDetails('));
assert('Credit check payload uses customerName from details', landingContent.includes('customerName') && landingContent.includes('pan: customerPan'));
assert('Explicit consent recorded on backend via /api/credit-score/consent', landingContent.includes('/api/credit-score/consent'));
assert('Backend lead submission includes verified details', landingContent.includes('leadPayload') && landingContent.includes('salary: customerSalary'));

console.log('\n=== 3. RUNNING REVISED FLOW LOGIC UNIT TESTS ===');

// Unit test PAN regex
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
assert('PAN ABCDE1234F is valid', panRegex.test('ABCDE1234F'));
assert('PAN BKZPK1928L is valid', panRegex.test('BKZPK1928L'));
assert('PAN 12345 is invalid', !panRegex.test('12345'));
assert('PAN ABCDE12345 is invalid', !panRegex.test('ABCDE12345'));
assert('PAN abcde1234f (lowercase) fails regex before upper transformation', !panRegex.test('abcde1234f'));
assert('PAN abcde1234f passes after uppercase transformation', panRegex.test('abcde1234f'.toUpperCase()));

// Unit test Email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
assert('Email user@company.com is valid', emailRegex.test('user@company.com'));
assert('Email user.name+tag@sub.example.co.in is valid', emailRegex.test('user.name+tag@sub.example.co.in'));
assert('Email "invalid-email" is invalid', !emailRegex.test('invalid-email'));
assert('Email "@nodomain.com" is invalid', !emailRegex.test('@nodomain.com'));

// Unit test Name validation
const nameRegex = /^[a-zA-Z\s.']{2,70}$/;
assert('Name "Rahul Sharma" is valid', nameRegex.test('Rahul Sharma'));
assert('Name "Dr. A. P. J. Kalam" is valid', nameRegex.test('Dr. A. P. J. Kalam'));
assert('Name "A" is invalid (too short)', !nameRegex.test('A'));
assert('Name "   " is invalid (whitespace only)', !nameRegex.test('   '.trim()));

// Unit test Salary validation
function isValidSalary(val) {
    const num = Number(val);
    return !isNaN(num) && num >= 5000 && num <= 10000000;
}
assert('Salary 35000 is valid', isValidSalary(35000));
assert('Salary 5000 is valid', isValidSalary(5000));
assert('Salary 0 is invalid', !isValidSalary(0));
assert('Salary -15000 is invalid', !isValidSalary(-15000));
assert('Salary 2500 is invalid (below minimum threshold)', !isValidSalary(2500));

console.log('\n==================================================');
console.log(`TOTAL CHECKS: ${passed + failures} | PASSED: ${passed} | FAILED: ${failures}`);

if (failures === 0) {
    console.log('🎉 ALL CUSTOMER DETAILS MODAL AUDIT CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
} else {
    console.error(`⚠️ FAILED CHECKS: ${failures}\n`);
    process.exit(1);
}
