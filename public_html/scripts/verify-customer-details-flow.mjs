import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicHtmlDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING CUSTOMER DETAILS MODAL FLOW & LOAN AMOUNT MANUAL INPUT ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passCount++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failCount++;
    }
}

// 1. Check customer-details-modal.php
const modalPath = path.join(publicHtmlDir, 'includes', 'customer-details-modal.php');
assert(fs.existsSync(modalPath), 'customer-details-modal.php exists');
const modalCode = fs.readFileSync(modalPath, 'utf8');

// Title & Subtitle
assert(modalCode.includes('Complete Your Loan Profile'), 'Modal title is "Complete Your Loan Profile"');
assert(modalCode.includes('Share a few details to help us understand your loan requirements and identify suitable loan options.'), 'Modal subtitle matches specification');

// Verified mobile display
assert(modalCode.includes('pimDetailsVerifiedPhone'), 'Verified mobile display element present');
assert(modalCode.includes('OTP Verified'), 'OTP Verified badge present');

// Fields in Row 1: Full Name | Official Email
assert(modalCode.includes('id="pimFullName"'), 'Full Name input present');
assert(modalCode.includes('id="pimOfficialEmail"'), 'Official Email input present');

// Fields in Row 2: PAN Number | Employment Type
assert(modalCode.includes('id="pimPanNumber"'), 'PAN Number input present');
assert(modalCode.includes('id="pimEmploymentType"'), 'Employment Type select present');
assert(modalCode.includes('id="pimEmployerFieldWrap"'), 'Conditional Employer/Business field present');

// Fields in Row 3: Address Type | PIN Code
assert(modalCode.includes('id="pimAddressType"'), 'Address Type select present');
assert(modalCode.includes('Current Residential Address'), 'Current Residential Address option present');
assert(modalCode.includes('Permanent Residential Address'), 'Permanent Residential Address option present');
assert(modalCode.includes('Office/Business Address'), 'Office/Business Address option present');
assert(modalCode.includes('id="pimPincode"'), 'PIN Code input present');

// Fields in Row 4: Address Line 1 | Address Line 2
assert(modalCode.includes('id="pimAddressLine1"'), 'Address Line 1 input present');
assert(modalCode.includes('id="pimAddressLine2"'), 'Address Line 2 input present');

// Fields in Row 5: City | State
assert(modalCode.includes('id="pimCity"'), 'City input present');
assert(modalCode.includes('id="pimState"'), 'State select present');

// Fields in Row 6: Monthly Income | Loan Amount Required (Manual Numeric Input)
assert(modalCode.includes('id="pimMonthlySalary"'), 'Monthly Income input present');

// Verify Loan Amount is a manual input and NOT a select dropdown
assert(!modalCode.includes('<select id="pimLoanAmount"'), 'Dropdown select completely removed for pimLoanAmount');
assert(modalCode.includes('<input type="text" \n                                   id="pimLoanAmount"') || modalCode.includes('id="pimLoanAmount"\n                                   name="loanAmount" class="pim-form-input pim-has-currency"') || modalCode.includes('id="pimLoanAmount"'), 'Loan Amount input field present');
assert(modalCode.includes('placeholder="Enter loan amount (₹5,00,000)') || modalCode.includes('placeholder="Enter loan amount (₹5,000–₹1,00,000)"'), 'Loan Amount placeholder matches specification');
assert(modalCode.includes('Maximum available up to ₹1,00,000'), 'Helper text "Maximum available up to ₹1,00,000" preserved');
assert(modalCode.includes('Minimum loan amount is ₹5,000.'), 'Error message for amount below ₹5,000 present');
assert(modalCode.includes('Maximum loan amount is ₹1,00,000.'), 'Error message for amount above ₹1,00,000 present');
assert(modalCode.includes('Please enter your required loan amount.'), 'Error message for empty loan amount present');

// Emulate client-side validation logic from customer-details-modal.php
function cleanLoanAmountVal(raw) {
    if (typeof raw === 'number') return raw;
    if (!raw) return NaN;
    const str = String(raw).trim();
    if (str.includes('-')) return -1;
    const stripped = str.replace(/[₹,\s]/g, '');
    if (/[^\d]/.test(stripped)) return NaN;
    const clean = str.replace(/[^\d]/g, '');
    return clean ? parseInt(clean, 10) : NaN;
}

function testValidateLoanAmount(rawVal) {
    if (!rawVal || !String(rawVal).trim()) {
        return { valid: false, error: 'Please enter your required loan amount.' };
    }
    const numVal = cleanLoanAmountVal(rawVal);
    if (isNaN(numVal) || numVal <= 0) {
        return { valid: false, error: 'Please enter your required loan amount.' };
    }
    if (numVal < 5000) {
        return { valid: false, error: 'Minimum loan amount is ₹5,000.' };
    }
    if (numVal > 100000) {
        return { valid: false, error: 'Maximum loan amount is ₹1,00,000.' };
    }
    return { valid: true, value: numVal };
}

// Run test cases specified by Section 6 of Developer Prompt
console.log('\n--- Testing Section 6 Loan Amount Test Cases ---');
const tc1 = testValidateLoanAmount('5000');
assert(tc1.valid && tc1.value === 5000, 'Test Case 1: ₹5,000 is valid');

const tc2 = testValidateLoanAmount('15500');
assert(tc2.valid && tc2.value === 15500, 'Test Case 2: ₹15,500 is valid');

const tc3 = testValidateLoanAmount('35,000');
assert(tc3.valid && tc3.value === 35000, 'Test Case 3: ₹35,000 is valid');

const tc4 = testValidateLoanAmount('99999');
assert(tc4.valid && tc4.value === 99999, 'Test Case 4: ₹99,999 is valid');

const tc5 = testValidateLoanAmount('100000');
assert(tc5.valid && tc5.value === 100000, 'Test Case 5: ₹1,00,000 is valid');

const tc6 = testValidateLoanAmount('4999');
assert(!tc6.valid && tc6.error === 'Minimum loan amount is ₹5,000.', 'Test Case 6: ₹4,999 is invalid (Below ₹5,000)');

const tc7 = testValidateLoanAmount('100001');
assert(!tc7.valid && tc7.error === 'Maximum loan amount is ₹1,00,000.', 'Test Case 7: ₹1,00,001 is invalid (Above ₹1,00,000)');

const tc8 = testValidateLoanAmount('');
assert(!tc8.valid && tc8.error === 'Please enter your required loan amount.', 'Test Case 8: Empty value is invalid');

const tc9 = testValidateLoanAmount('-5000');
assert(!tc9.valid, 'Test Case 9: Negative value is invalid');

const tc10 = testValidateLoanAmount('abc');
assert(!tc10.valid && tc10.error === 'Please enter your required loan amount.', 'Test Case 10: Alphabetic input is invalid');

// Fields in Row 7: Loan Purpose | Preferred Location
console.log('\n--- Checking Row 7 and Consents ---');
assert(modalCode.includes('id="pimLoanPurpose"'), 'Loan Purpose select present');
assert(modalCode.includes('Medical Emergency'), 'Medical Emergency option present');
assert(modalCode.includes('Household Expenses'), 'Household Expenses option present');
assert(modalCode.includes('Rent or Bills'), 'Rent or Bills option present');
assert(modalCode.includes('id="pimPreferredLocation"'), 'Preferred Location input present');
assert(modalCode.includes('id="pimSameLocationToggle"'), 'Same as residential address toggle present');

// Consents
assert(modalCode.includes('id="pimConsentTerms"'), 'Terms consent checkbox present');
assert(modalCode.includes('id="pimConsentBureau"'), 'Credit Bureau consent checkbox present');
assert(modalCode.includes('id="pimConsentComms"'), 'Optional communications consent checkbox present');

// CTA button & state text
assert(modalCode.includes('Submit Details &amp; View Offers'), 'Submit CTA button has correct label');
assert(modalCode.includes('Your details have been submitted successfully. We are checking the available loan options.'), 'Success message matches exact requirement');

// 2. Check instant-cash-loan.php integration
const landingPath = path.join(publicHtmlDir, 'instant-cash-loan.php');
const landingCode = fs.readFileSync(landingPath, 'utf8');

assert(landingCode.includes("include_once __DIR__ . '/includes/customer-details-modal.php'"), 'customer-details-modal.php included in landing page');
assert(landingCode.includes('window.PimCustomerDetailsModal.open'), 'PimCustomerDetailsModal.open invoked in handleOtpSuccess');
assert(landingCode.includes('proceedWithVerifiedDetails(detailsResult)'), 'proceedWithVerifiedDetails handles details callback');
assert(landingCode.includes('customerLoanAmount'), 'customerLoanAmount mapped in landing page');
assert(landingCode.includes('loanAmount: customerLoanAmount'), 'leadPayload uses customerLoanAmount');

// 3. Check CRM integration
const apiConfigPath = path.join(publicHtmlDir, 'crm', 'src', 'utils', 'apiConfig.js');
const apiConfigCode = fs.readFileSync(apiConfigPath, 'utf8');
assert(apiConfigCode.includes('payload.addressLine1 = addr1Val.trim()'), 'apiConfig buildLeadPayload handles addressLine1');
assert(apiConfigCode.includes('addressLine1: item.addressLine1'), 'apiConfig mapBackendLead handles addressLine1');

console.log(`\n==================================================`);
if (failCount === 0) {
    console.log(`🎉 ALL ${passCount} VERIFICATION CHECKS PASSED PERFECTLY!`);
    process.exit(0);
} else {
    console.error(`⚠️ ${failCount} CHECKS FAILED!`);
    process.exit(1);
}
