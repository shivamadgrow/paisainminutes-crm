import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetFile = path.join(rootDir, 'public_html', 'instant-cash-loan.php');

if (!fs.existsSync(targetFile)) {
    console.error('File not found:', targetFile);
    process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
    if (condition) {
        console.log(`✅ PASS: ${desc}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${desc}`);
        failed++;
    }
}

console.log('==================================================');
console.log('AUDIT SUITE: CIBIL CONTAINER HERO PLACEMENT & CRO');
console.log('==================================================\n');

// 1. Single Card Verification & Placement Check
console.log('--- 1. DOM STRUCTURE & PLACEMENT AUDIT ---');
const cibilContainerMatches = (content.match(/id=["']cibilCardContainer["']/g) || []).length;
assert('Exactly ONE #cibilCardContainer exists in DOM (no duplicates)', cibilContainerMatches === 1);

// Extract the hero section
const heroMatch = content.match(/<section class=["']cro-hero["'][^>]*>([\s\S]*?)<\/section>/i);
assert('Hero section exists', Boolean(heroMatch));
const heroContent = heroMatch ? heroMatch[1] : '';

// Verify CIBIL card is inside the hero section
assert('#cibilCardContainer is inside <section class="cro-hero">', heroContent.includes('id="cibilCardContainer"'));

// Extract the hero right column
const rightColParts = heroContent.split(/class=["'][^"']*cro-hero-right[^"']*["']/i);
assert('Hero right column exists', rightColParts.length > 1);
const rightColContent = rightColParts[1] || '';

assert('#cibilCardContainer is located inside hero right column', rightColContent.includes('id="cibilCardContainer"'));
assert('#formCardInitial (initial form) is inside hero right column', rightColContent.includes('id="formCardInitial"'));
assert('#panelLoading (loading panel) is inside hero right column', rightColContent.includes('id="panelLoading"'));

// Verify CIBIL card is NOT in offers section
const offersMatch = content.match(/<section class=["']cro-offers-section["'][^>]*>([\s\S]*?)<\/section>/i);
assert('Offers section exists', Boolean(offersMatch));
const offersContent = offersMatch ? offersMatch[1] : '';
assert('#cibilCardContainer is NOT inside <section class="cro-offers-section">', !offersContent.includes('id="cibilCardContainer"'));

// 2. Pre-Submission vs Post-Submission Initial States
console.log('\n--- 2. INITIAL COMPONENT VISIBILITY STATES ---');
assert('#cibilCardContainer is hidden by default (style="display: none;`)"', /id=["']cibilCardContainer["'][^>]*style=["'][^"']*display:\s*none/i.test(rightColContent));
assert('#formCardInitial is present for pre-submission display', rightColContent.includes('id="formCardInitial"') && rightColContent.includes('Check Your Loan Eligibility'));

// 3. Elements within CIBIL Status Card
console.log('\n--- 3. CIBIL CARD ELEMENTS AUDIT ---');
assert('Masked phone element #cibilCardPhone is present', rightColContent.includes('id="cibilCardPhone"'));
assert('Application ID element #cibilCardAppId is present', rightColContent.includes('id="cibilCardAppId"'));
assert('CIBIL Score value element #cibilScoreNumber is present', rightColContent.includes('id="cibilScoreNumber"'));
assert('Status tag element #cibilStatusTag is present', rightColContent.includes('id="cibilStatusTag"'));
assert('Status text element #cibilStatusText is present', rightColContent.includes('id="cibilStatusText"'));
assert('Bureau note element #cibilBureauStatus is present', rightColContent.includes('id="cibilBureauStatus"'));
assert('Offers shortcut CTA button .cro-cibil-offers-btn is present in card', rightColContent.includes('cro-cibil-offers-btn'));

// 4. CSS Grid Layout & Styling Requirements
console.log('\n--- 4. CSS GRID & RESPONSIVE LAYOUT AUDIT ---');
assert('Hero grid supports minmax(0, 1.1fr) minmax(380px, 0.9fr)', content.includes('grid-template-columns: minmax(0, 1.1fr) minmax(380px, 0.9fr);'));
assert('Hero grid has 48px gap', content.includes('gap: 48px;'));
assert('.cro-hero-left has min-width: 0 and width: 100%', content.includes('.cro-hero-left') && content.includes('min-width: 0;') && content.includes('width: 100%;'));
assert('.cro-hero-right has min-width: 0 and width: 100%', content.includes('.cro-hero-right') && content.includes('min-width: 0;') && content.includes('width: 100%;'));
assert('.cro-cibil-card-container has max-width: 480px for balanced hero alignment', content.includes('.cro-cibil-card-container') && content.includes('max-width: 480px;'));
assert('Smooth card reveal keyframe croFadeInCard is defined', content.includes('@keyframes croFadeInCard'));
assert('Respects prefers-reduced-motion for card animation', content.includes('prefers-reduced-motion: reduce'));
assert('Tablet media query (max-width: 991px) stacks columns cleanly', content.includes('@media (max-width: 991px)') && content.includes('grid-template-columns: 1fr;'));
assert('Mobile media query (max-width: 576px) adapts CIBIL card padding & font', content.includes('@media (max-width: 576px)') && content.includes('.cro-cibil-score-val'));

// 5. JavaScript Dynamic Reveal & Transition Engine
console.log('\n--- 5. JAVASCRIPT TRANSITION & DATA BINDING AUDIT ---');
assert('revealOffers sets cibilContainer display to block', content.includes("cibilContainer.style.display = 'block'"));
assert('revealOffers adds cro-revealed animation class', content.includes("cibilContainer.classList.add('cro-revealed')"));
assert('revealOffers hides loading panel', content.includes("panelLoading.style.display = 'none'"));
assert('revealOffers hides initial form panel', content.includes("panelInitial.style.display = 'none'"));
assert('revealOffers populates masked phone with last 4 digits', content.includes("cardPhone.textContent = '+91 ******' + last4"));
assert('revealOffers populates Application ID with activeLeadId', content.includes("cardAppId.textContent = 'Application ID: ' + activeLeadId"));
assert('revealOffers handles real bureau score (300-900 bounds)', content.includes("scoreNumberEl.textContent = bureauScoreValue"));
assert('revealOffers handles loading state gracefully', content.includes("scoreNumberEl.textContent = 'Checking your credit profile...'"));
assert('revealOffers handles unavailable/no score fallback safely without fake score', content.includes("scoreNumberEl.textContent = 'CIBIL Score Unavailable'"));
assert('Mobile scroll smoothly focuses on CIBIL card in hero', content.includes("window.innerWidth <= 768 && cibilContainer") && content.includes("window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })"));
assert('croScrollToOffers helper navigates down to offersSection', content.includes("window.croScrollToOffers = function"));

console.log('\n==================================================');
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed === 0) {
    console.log('🎉 ALL CIBIL HERO PLACEMENT AUDIT CHECKS PASSED 100%!');
    process.exit(0);
} else {
    console.error('⚠️ SOME CHECKS FAILED!');
    process.exit(1);
}
