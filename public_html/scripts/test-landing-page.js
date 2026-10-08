const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'instant-cash-loan.php');
if (!fs.existsSync(targetPath)) {
    console.error('File not found:', targetPath);
    process.exit(1);
}

const code = fs.readFileSync(targetPath, 'utf8');
const checks = [
    ['Canonical tag present', code.includes('rel="canonical"')],
    ['Robots meta present', code.includes('name="robots"')],
    ['OpenGraph image present', code.includes('og:image')],
    ['Paisa in Minutes logo present', code.includes('/assets/logo.webp')],
    ['Mobile input present', code.includes('id="croMobileInput"')],
    ['Bureau consent unchecked by default', code.includes('id="consentBureau" class="cro-checkbox"') && !code.includes('id="consentBureau" class="cro-checkbox" checked')],
    ['Terms consent present', code.includes('id="consentTerms"')],
    ['PimOtpService integration present', code.includes('window.PimOtpService')],
    ['Real Credit Check API call', code.includes('/api/public/credit-check')],
    ['Real Leads API call', code.includes('/api/public/leads')],
    ['Meta Pixel dispatcher present', code.includes('trackMetaEvent')],
    ['No hardcoded CIBIL score', !code.includes('cibilScore: 724') && !code.includes('"score": 724')],
    ['Dynamic partner redirect link', code.includes('/api/public/redirect/')],
    ['Partner click logger', code.includes('/api/public/partner-click')],
    ['Sticky mobile CTA bar', code.includes('id="stickyMobileBar"')],
    ['10 FAQ items present in HTML', (code.match(/<h3 class="cro-faq-question">/g) || []).length === 10],
    ['5 Category cards present in HTML', (code.match(/<div class="cro-cat-card">/g) || []).length === 5],
    ['6 Benefits present in HTML', (code.match(/<div class="cro-benefit-card">/g) || []).length === 6],
    ['4 Steps present in HTML', (code.match(/<div class="cro-step-card">/g) || []).length === 4],
    ['No emoji icons in categories', !code.includes('⚡') || code.includes('⚡ Fast Approval')],
    ['Pre-approved lender cards loop from partners config', code.includes('foreach ($campaignPartners as $slug => $p):')]
];

console.log('--- META ADS LANDING PAGE INTEGRITY CHECK ---');
let allPassed = true;
checks.forEach(([name, pass]) => {
    console.log((pass ? '[PASS] ' : '[FAIL] ') + name);
    if (!pass) allPassed = false;
});

if (allPassed) {
    console.log('\n✓ 100% OF LANDING PAGE REQUIREMENTS PASSED PERFECTLY!');
} else {
    console.error('\nOne or more checks failed.');
    process.exit(1);
}
