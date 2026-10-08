import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// scripts directory is inside public_html/scripts, so public_html is the parent folder
const publicHtmlDir = path.resolve(__dirname, '..');
const landingPath = path.join(publicHtmlDir, 'instant-cash-loan.php');
const partnersPath = path.join(publicHtmlDir, 'config', 'partners.php');
const otpModalPath = path.join(publicHtmlDir, 'includes', 'otp-modal.php');

let failures = 0;
function assert(name, condition, details = '') {
    if (!condition) {
        console.error(`❌ FAIL: ${name} ${details ? '– ' + details : ''}`);
        failures++;
    } else {
        console.log(`✅ PASS: ${name}`);
    }
}

console.log('\n--- 1. AUDITING public_html/instant-cash-loan.php ---');
if (!fs.existsSync(landingPath)) {
    console.error(`Cannot find landing page at: ${landingPath}`);
    process.exit(1);
}
const landingContent = fs.readFileSync(landingPath, 'utf8');

// A. Guarantee Claims & Deceptive Language Elimination
const bannedPhrases = [
    'High Approval Guarantee',
    '100% Instant Online Approval',
    'Guaranteed Approval',
    'Guaranteed Disbursal',
    'Guaranteed Loan',
    '100% Approval',
    'Bank-grade security',
    'RBI Compliant Platform',
    'Pre-Approved Partners',
    'check pre-approved options'
];

for (const phrase of bannedPhrases) {
    assert(`No banned phrase: "${phrase}"`, !landingContent.includes(phrase));
}

// B. Primary CTA consistency
assert('Primary CTA is "Check My Loan Offers"', landingContent.includes('Check My Loan Offers'));
assert('Mobile Sticky CTA is "Check Loan Offers →"', landingContent.includes('Check Loan Offers →'));

// C. Hero Copy and Badges
assert('Header trust badge contains "Connected with RBI-regulated lending partners"', landingContent.includes('Connected with RBI-regulated lending partners'));
assert('Hero concept pill "Need Cash for an Urgent Expense?"', landingContent.includes('Need Cash for an Urgent Expense?'));
assert('Hero H1 "Check Loan Offers Up to ₹1 Lakh"', landingContent.includes('Check Loan Offers <span class="cro-highlight">Up to ₹1 Lakh</span>'));
assert('Hero supporting copy matches audited string', landingContent.includes('Compare available loan options from our lending partners through a quick digital application.'));
assert('Hero bullets contain Digital Application', landingContent.includes('<span>Digital Application</span>'));
assert('Hero bullets contain Multiple Lending Partners', landingContent.includes('<span>Multiple Lending Partners</span>'));
assert('Hero bullets contain Secure Application', landingContent.includes('<span>Secure Application</span>'));
assert('Hero bullets contain Transparent Loan Terms', landingContent.includes('<span>Transparent Loan Terms</span>'));
assert('Hero bullets contain Online Process', landingContent.includes('<span>Online Process</span>'));

// D. Bureau / CIBIL Card & Structure
assert('CIBIL Score Card container #cibilCardContainer is present', landingContent.includes('id="cibilCardContainer"'));
assert('CIBIL Score number container #cibilScoreNumber is present', landingContent.includes('id="cibilScoreNumber"'));
assert('Header title "YOUR CIBIL SCORE" is present', landingContent.includes('YOUR CIBIL SCORE'));
assert('Status tag "Credit Score Checked ✓" is present', landingContent.includes('Credit Score Checked ✓'));
assert('Bureau note "Eligible for Income-Based Disbursal" is present', landingContent.includes('Eligible for Income-Based Disbursal'));
assert('Offers section tag is "Matched Lending Partners"', landingContent.includes('Matched Lending Partners'));

// E. Dynamic Lender Card Metrics & Costs
assert('Lender brand name container .cro-offer-lender-name is present', landingContent.includes('cro-offer-lender-name'));
assert('Cost breakdown container .cro-cost-breakdown is present', landingContent.includes('cro-cost-breakdown'));
assert('Processing fee display is present in offer card', landingContent.includes('Processing Fee:'));
assert('Applicable GST display is present in offer card', landingContent.includes('Applicable GST:'));
assert('Indicative APR display is present in offer card', landingContent.includes('Indicative APR:'));
assert('Total Repayment display is present in offer card', landingContent.includes('Total Repayment:'));

// F. Representative Example Consistency & Mathematical Accuracy
assert('Representative Worked Example mentions ₹50,000', landingContent.includes('₹50,000'));
assert('Representative Worked Example mentions 90 days', landingContent.includes('90 days'));
assert('Representative Worked Example mentions 18% p.a.', landingContent.includes('18% p.a.'));
assert('Representative Worked Example mentions interest ₹2,250', landingContent.includes('₹2,250'));
assert('Representative Worked Example mentions processing fee ₹1,000', landingContent.includes('₹1,000'));
assert('Representative Worked Example mentions GST ₹180', landingContent.includes('₹180'));
assert('Representative Worked Example mentions net disbursed ₹48,820', landingContent.includes('₹48,820'));
assert('Representative Worked Example mentions total repayment ₹52,250', landingContent.includes('₹52,250'));

// G. JavaScript Engine & Bureau Score Logic
assert('Authorization Bearer header is sent to credit-check & leads API', landingContent.includes("apiHeaders['Authorization'] = 'Bearer ' + authToken"));
assert('extractBureauScore function is implemented', landingContent.includes('function extractBureauScore('));
assert('extractBureauScore checks bureau_score, cibilScore, and score', landingContent.includes('res.bureau_score') && landingContent.includes('res.cibilScore'));
assert('extractBureauScore validates 300 to 900 score bounds', landingContent.includes('num >= 300 && num <= 900'));
assert('Unavailability fallback displays "CIBIL Score Unavailable"', landingContent.includes("'CIBIL Score Unavailable'"));
assert('Never shows 0, null, or NaN on score element', !landingContent.includes("scoreNumberEl.textContent = 0"));
assert('Mobile sticky bar is suppressed when offers are revealed', landingContent.includes("if (offersRevealed)"));

// H. Meta Ads Tracking Audit
assert('Meta event PageView is tracked', landingContent.includes("trackMetaEvent('PageView'"));
assert('Meta event ViewContent is tracked', landingContent.includes("trackMetaEvent('ViewContent'"));
assert('Meta event ApplicationStarted is tracked', landingContent.includes("trackMetaEvent('ApplicationStarted'"));
assert('Meta event Lead is tracked', landingContent.includes("trackMetaEvent('Lead'"));
assert('Meta event OTPStarted is tracked', landingContent.includes("trackMetaEvent('OTPStarted'"));
assert('Meta event OTPVerified is tracked', landingContent.includes("trackMetaEvent('OTPVerified'"));
assert('Meta event CreditCheckStarted is tracked', landingContent.includes("trackMetaEvent('CreditCheckStarted'"));
assert('Meta event CreditCheckCompleted is tracked', landingContent.includes("trackMetaEvent('CreditCheckCompleted'"));
assert('Meta event ApplicationCompleted is tracked', landingContent.includes("trackMetaEvent('ApplicationCompleted'"));
assert('Meta event LoanOffersViewed is tracked', landingContent.includes("trackMetaEvent('LoanOffersViewed'"));
assert('Meta event LoanOfferClicked is tracked', landingContent.includes("trackMetaEvent('LoanOfferClicked'"));

// Verify no PII or financial sensitive data in tracking calls
assert('Tracking does not send bureau score', !landingContent.includes("bureau_score: bureauScoreValue") && !landingContent.includes("cibil: bureauScoreValue"));
assert('Tracking does not send salary', !landingContent.includes("salary: 35000") || !landingContent.includes("trackMetaEvent('Lead', { salary"));

console.log('\n--- 2. AUDITING public_html/config/partners.php ---');
if (!fs.existsSync(partnersPath)) {
    console.error(`Cannot find partners config at: ${partnersPath}`);
    process.exit(1);
}
const partnersContent = fs.readFileSync(partnersPath, 'utf8');

for (const phrase of bannedPhrases) {
    assert(`partners.php: No banned phrase "${phrase}"`, !partnersContent.includes(phrase));
}
assert('partners.php: Contains transparent apr field', partnersContent.includes("'apr'"));
assert('partners.php: Contains processing_fee field', partnersContent.includes("'processing_fee'"));
assert('partners.php: Contains gst field', partnersContent.includes("'gst'"));
assert('partners.php: Contains total_repayment field', partnersContent.includes("'total_repayment'"));

console.log('\n--- 3. AUDITING public_html/includes/otp-modal.php ---');
if (!fs.existsSync(otpModalPath)) {
    console.error(`Cannot find OTP modal at: ${otpModalPath}`);
    process.exit(1);
}
const otpContent = fs.readFileSync(otpModalPath, 'utf8');
assert('OTP modal contains Change Number button', otpContent.includes('Change Number') || otpContent.includes('changePhoneBtn'));
assert('OTP modal uses secure digital verification copy', otpContent.includes('Secure &amp; Digital Verification') || otpContent.includes('Secure & Digital Verification'));

console.log('\n==================================================');
if (failures === 0) {
    console.log('🎉 ALL AUDIT CHECKS PASSED PERFECTLY!');
    process.exit(0);
} else {
    console.error(`⚠️ TOTAL AUDIT FAILURES: ${failures}`);
    process.exit(1);
}
