#!/usr/bin/env node
/**
 * Test Suite: Production-Ready Google Tag Manager + GA4 Setup for Paisa In Minutes
 * 
 * Verifies:
 * 1. GTM container presence & consistency (GTM-P8QSMXHR) across main site & landing page
 * 2. Official GTM head snippet & body noscript placement
 * 3. Centralized PIM Analytics pipeline (dataLayer schema & event registration)
 * 4. Strict Financial Privacy (Zero PII leak guarantee)
 * 5. Conversion deduplication (generate_lead fires at most once per lead ID)
 * 6. Marketing attribution preservation (utm_*, gclid, gbraid, wbraid)
 * 7. Preservation of Meta Pixel & CAPI integrations
 * 8. PHP syntax validity
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const phpBinary = 'C:\\xampp\\php\\php.exe';

console.log('======================================================================');
console.log('🧪 RUNNING PRODUCTION GTM + GA4 TEST SUITE FOR PAISA IN MINUTES');
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
// 1. PHP Syntax Checks
// ----------------------------------------------------------------------------
console.log('--- 1. PHP SYNTAX VERIFICATION ---');

const phpFilesToCheck = [
    'public_html/config/analytics.php',
    'public_html/includes/header.php',
    'public_html/instant-cash-loan.php',
    'public_html/check-eligibility.php',
    'public_html/apply-now.php'
];

for (const relPath of phpFilesToCheck) {
    it(`PHP lint passes for ${relPath}`, () => {
        const fullPath = path.join(rootDir, relPath);
        assert.ok(fs.existsSync(fullPath), `File must exist: ${relPath}`);
        const output = execFileSync(phpBinary, ['-l', fullPath], { encoding: 'utf8' });
        assert.ok(output.includes('No syntax errors detected'), `Syntax check must pass for ${relPath}`);
    });
}

// ----------------------------------------------------------------------------
// 2. GTM Container Installation & Configuration Checks
// ----------------------------------------------------------------------------
console.log('\n--- 2. GTM CONTAINER INSTALLATION & ARCHITECTURE ---');

const headerContent = fs.readFileSync(path.join(rootDir, 'public_html/includes/header.php'), 'utf8');
const lpContent = fs.readFileSync(path.join(rootDir, 'public_html/instant-cash-loan.php'), 'utf8');
const analyticsConfigContent = fs.readFileSync(path.join(rootDir, 'public_html/config/analytics.php'), 'utf8');

it('analytics.php defines configurable GTM container ID defaulting to GTM-P8QSMXHR', () => {
    assert.ok(analyticsConfigContent.includes("getEnvVal('GTM_CONTAINER_ID', 'GTM-P8QSMXHR')"));
    assert.ok(analyticsConfigContent.includes("function render_gtm_head"));
    assert.ok(analyticsConfigContent.includes("function render_gtm_body"));
});

it('header.php includes config/analytics.php and renders official GTM snippet in <head>', () => {
    assert.ok(headerContent.includes("require_once __DIR__ . '/../config/analytics.php'"));
    assert.ok(headerContent.includes("https://www.googletagmanager.com/gtm.js?id='+i+dl"));
    assert.ok(headerContent.includes("$pim_gtm_container_id"));
    // Ensure the artificial delay was removed
    assert.ok(!headerContent.includes("events = ['scroll', 'mousemove'"), 'Delayed GTM loader should be removed');
});

it('header.php renders official GTM noscript immediately after <body>', () => {
    assert.ok(headerContent.includes('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo htmlspecialchars($pim_gtm_container_id); ?>"'));
    assert.ok(headerContent.includes('style="display:none;visibility:hidden"'));
});

it('instant-cash-loan.php includes config/analytics.php and renders official GTM snippet in <head>', () => {
    assert.ok(lpContent.includes("require_once __DIR__ . '/config/analytics.php'"));
    assert.ok(lpContent.includes("https://www.googletagmanager.com/gtm.js?id='+i+dl"));
    assert.ok(lpContent.includes("$pim_gtm_container_id"));
});

it('instant-cash-loan.php renders official GTM noscript immediately after <body>', () => {
    assert.ok(lpContent.includes('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo htmlspecialchars($pim_gtm_container_id); ?>"'));
    assert.ok(lpContent.includes('style="display:none;visibility:hidden"'));
});

it('Both header.php and instant-cash-loan.php load /js/pim-analytics.js', () => {
    assert.ok(headerContent.includes('/js/pim-analytics.js'));
    assert.ok(lpContent.includes('/js/pim-analytics.js'));
});

// ----------------------------------------------------------------------------
// 3. Centralized Analytics Module (pim-analytics.js) Functional Tests
// ----------------------------------------------------------------------------
console.log('\n--- 3. PIM ANALYTICS MODULE & STRICT PII SANITIZATION ---');

const pimAnalyticsCode = fs.readFileSync(path.join(rootDir, 'public_html/js/pim-analytics.js'), 'utf8');

function createAnalyticsContext(initialPath = '/') {
    const dataLayer = [];
    const context = {
        window: {
            dataLayer: dataLayer,
            location: {
                pathname: initialPath,
                search: '',
                href: 'https://paisainminutes.com' + initialPath
            },
            history: {
                pushState: function(s, t, url) {
                    if (url) {
                        context.window.location.pathname = url.split('?')[0];
                        context.window.location.search = url.includes('?') ? '?' + url.split('?')[1] : '';
                        context.window.location.href = 'https://paisainminutes.com' + url;
                    }
                },
                replaceState: function() {}
            },
            addEventListener: function() {},
            sessionStorage: {
                _data: {},
                getItem: function(k) { return this._data[k] || null; },
                setItem: function(k, v) { this._data[k] = String(v); }
            },
            localStorage: {
                _data: {},
                getItem: function(k) { return this._data[k] || null; },
                setItem: function(k, v) { this._data[k] = String(v); }
            },
            requestAnimationFrame: function(cb) { cb(); }
        },
        document: {
            readyState: 'complete',
            title: 'Paisa In Minutes',
            addEventListener: function() {},
            documentElement: { scrollTop: 0, scrollHeight: 1000, clientHeight: 500 },
            body: { scrollTop: 0, scrollHeight: 1000 }
        },
        Date: Date,
        Object: Object,
        Array: Array,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Math: Math,
        console: console
    };
    context.window.window = context.window;
    context.window.document = context.document;
    vm.createContext(context);
    vm.runInContext(pimAnalyticsCode, context);
    return { context, dataLayer };
}

it('pim-analytics.js initializes window.PIMAnalytics with required public API', () => {
    const { context } = createAnalyticsContext();
    assert.ok(context.window.PIMAnalytics, 'PIMAnalytics should be exported');
    assert.strictEqual(typeof context.window.PIMAnalytics.push, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackLandingPageView, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackFormStart, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackOtpSuccess, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackApplicationStart, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackLeadGenerated, 'function');
    assert.strictEqual(typeof context.window.PIMAnalytics.trackPartnerRedirect, 'function');
});

it('STRICT PRIVACY: All PII (phone, email, PAN, salary, CIBIL, OTP) is stripped from dataLayer events', () => {
    const { context, dataLayer } = createAnalyticsContext();
    const unsafeData = {
        phone: '9999066657',
        mobile: '9876543210',
        email: 'applicant@example.com',
        applicantName: 'John Doe',
        name: 'John Doe',
        pan: 'ABCDE1234F',
        panNumber: 'ABCDE1234F',
        cibil: 780,
        cibilScore: 780,
        salary: 45000,
        monthlySalary: 45000,
        otp: '123456',
        bankAccount: '123456789012',
        // Safe parameters
        event_id: 'PIM-20261026-9999',
        lead_reference: 'PIM-20261026-9999',
        currency: 'INR',
        value: 50000,
        safe_category: 'personal_loan'
    };

    context.window.PIMAnalytics.push('custom_event', unsafeData);

    assert.strictEqual(dataLayer.length, 1);
    const event = dataLayer[0];
    assert.strictEqual(event.event, 'custom_event');
    assert.strictEqual(event.event_id, 'PIM-20261026-9999');
    assert.strictEqual(event.lead_reference, 'PIM-20261026-9999');
    assert.strictEqual(event.currency, 'INR');
    assert.strictEqual(event.value, 50000);
    assert.strictEqual(event.safe_category, 'personal_loan');

    // Verify all sensitive keys are absent
    assert.strictEqual(event.phone, undefined);
    assert.strictEqual(event.mobile, undefined);
    assert.strictEqual(event.email, undefined);
    assert.strictEqual(event.name, undefined);
    assert.strictEqual(event.applicantName, undefined);
    assert.strictEqual(event.pan, undefined);
    assert.strictEqual(event.panNumber, undefined);
    assert.strictEqual(event.cibil, undefined);
    assert.strictEqual(event.cibilScore, undefined);
    assert.strictEqual(event.salary, undefined);
    assert.strictEqual(event.monthlySalary, undefined);
    assert.strictEqual(event.otp, undefined);
    assert.strictEqual(event.bankAccount, undefined);
});

it('DEDUPLICATION: generate_lead fires exactly ONCE for a given lead_reference', () => {
    const { context, dataLayer } = createAnalyticsContext();
    const leadId = 'PIM-TEST-LEAD-5555';

    // Simulate 3 calls (e.g. initial save, modal close, redirect step)
    context.window.PIMAnalytics.trackLeadGenerated(leadId, { lead_source: 'landingpage', value: 50000 });
    context.window.PIMAnalytics.trackLeadGenerated(leadId, { lead_source: 'landingpage', value: 50000 });
    context.window.PIMAnalytics.trackLeadGenerated(leadId, { lead_source: 'landingpage', value: 50000 });

    const leadEvents = dataLayer.filter(e => e.event === 'generate_lead');
    assert.strictEqual(leadEvents.length, 1, 'generate_lead must fire only once per lead ID');
    assert.strictEqual(leadEvents[0].lead_reference, leadId);
    assert.strictEqual(leadEvents[0].event_id, leadId);
    assert.strictEqual(leadEvents[0].currency, 'INR');
    assert.strictEqual(leadEvents[0].value, 50000);
    assert.strictEqual(leadEvents[0].lead_source, 'landingpage');
});

it('view_landing_page triggers on /instant-cash-loan with correct parameters', () => {
    const { context, dataLayer } = createAnalyticsContext('/instant-cash-loan');
    context.window.PIMAnalytics.trackLandingPageView();

    const vlpEvents = dataLayer.filter(e => e.event === 'view_landing_page');
    assert.strictEqual(vlpEvents.length, 1);
    assert.strictEqual(vlpEvents[0].campaign_category, 'instant_cash_loan');
    assert.strictEqual(vlpEvents[0].page_path, '/instant-cash-loan');
});

it('form_start triggers once on first form interaction', () => {
    const { context, dataLayer } = createAnalyticsContext();

    context.window.PIMAnalytics.trackFormStart('instant_loan_form', 'hero');
    context.window.PIMAnalytics.trackFormStart('instant_loan_form', 'hero'); // Duplicate interaction

    const fsEvents = dataLayer.filter(e => e.event === 'form_start');
    assert.strictEqual(fsEvents.length, 1);
    assert.strictEqual(fsEvents[0].form_name, 'instant_loan_form');
    assert.strictEqual(fsEvents[0].form_location, 'hero');
});

it('otp_verification_success triggers without PII', () => {
    const { context, dataLayer } = createAnalyticsContext();

    context.window.PIMAnalytics.trackOtpSuccess('otp');

    const otpEvents = dataLayer.filter(e => e.event === 'otp_verification_success');
    assert.strictEqual(otpEvents.length, 1);
    assert.strictEqual(otpEvents[0].auth_method, 'otp');
    assert.strictEqual(otpEvents[0].status, 'success');
});

it('partner_redirect captures partner_name, destination_url, and lead_reference', () => {
    const { context, dataLayer } = createAnalyticsContext();

    context.window.PIMAnalytics.trackPartnerRedirect('rupay91', 'https://loans.rupay91.com/login?lead_id=PIM-99', 'PIM-99');

    const prEvents = dataLayer.filter(e => e.event === 'partner_redirect');
    assert.strictEqual(prEvents.length, 1);
    assert.strictEqual(prEvents[0].partner_name, 'rupay91');
    assert.strictEqual(prEvents[0].partner_category, 'instant_loan');
    assert.strictEqual(prEvents[0].lead_reference, 'PIM-99');
    assert.ok(prEvents[0].outbound_url.includes('loans.rupay91.com'));
});

// ----------------------------------------------------------------------------
// 4. Marketing Attribution Engine (attribution.js) Tests
// ----------------------------------------------------------------------------
console.log('\n--- 4. MARKETING ATTRIBUTION & UTM PERSISTENCE ---');

const attrJsCode = fs.readFileSync(path.join(rootDir, 'public_html/js/attribution.js'), 'utf8');

function createAttributionContext(urlStr) {
    const url = new URL(urlStr);
    const storage = {};
    const context = {
        location: {
            pathname: url.pathname,
            search: url.search,
            hostname: url.hostname,
            href: urlStr
        },
        document: {
            referrer: '',
            cookie: ''
        },
        localStorage: {
            getItem: (k) => storage[k] || null,
            setItem: (k, v) => { storage[k] = String(v); },
            removeItem: (k) => { delete storage[k]; }
        },
        sessionStorage: {
            getItem: (k) => storage['sess_' + k] || null,
            setItem: (k, v) => { storage['sess_' + k] = String(v); },
            removeItem: (k) => { delete storage['sess_' + k]; }
        },
        URLSearchParams: URLSearchParams,
        URL: URL,
        Date: Date,
        JSON: JSON,
        RegExp: RegExp,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent,
        window: {}
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(attrJsCode, context);
    return { context, storage };
}

it('attribution.js captures all 8 required parameters: utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, gbraid, wbraid', () => {
    const testUrl = 'https://paisainminutes.com/instant-cash-loan?utm_source=google&utm_medium=cpc&utm_campaign=diwali_instant&utm_content=banner_ad1&utm_term=quick_loan&gclid=Cj0KCQjw123&gbraid=gb123&wbraid=wb123';
    const { context, storage } = createAttributionContext(testUrl);

    const payload = context.window.PIMAttribution.payload();
    assert.strictEqual(payload.utm_source, 'google');
    assert.strictEqual(payload.utm_medium, 'cpc');
    assert.strictEqual(payload.utm_campaign, 'diwali_instant');
    assert.strictEqual(payload.utm_content, 'banner_ad1');
    assert.strictEqual(payload.utm_term, 'quick_loan');
    assert.strictEqual(payload.gclid, 'Cj0KCQjw123');
    assert.strictEqual(payload.gbraid, 'gb123');
    assert.strictEqual(payload.wbraid, 'wb123');

    // First touch must also be preserved separately
    assert.strictEqual(payload.first_utm_source, 'google');
    assert.strictEqual(payload.first_gclid, 'Cj0KCQjw123');

    // Session storage synced
    assert.strictEqual(storage['sess_pim_utm_source'], 'google');
    assert.strictEqual(storage['sess_pim_utm_campaign'], 'diwali_instant');
    assert.strictEqual(storage['sess_pim_gclid'], 'Cj0KCQjw123');
});

it('attribution.js handles Google Ads auto-tagging (gclid only) without overwriting with landingpage', () => {
    const testUrl = 'https://paisainminutes.com/instant-cash-loan?gclid=Cj0KCQjwTest456';
    const { context, storage } = createAttributionContext(testUrl);

    const payload = context.window.PIMAttribution.payload();
    assert.strictEqual(payload.utm_source, 'google');
    assert.strictEqual(payload.utm_medium, 'cpc');
    assert.strictEqual(payload.utm_campaign, 'google_ads');
    assert.strictEqual(payload.gclid, 'Cj0KCQjwTest456');
    assert.strictEqual(storage['sess_pim_gclid'], 'Cj0KCQjwTest456');
});

it('attribution.js handles gbraid and wbraid without utm_source', () => {
    const testUrl = 'https://paisainminutes.com/instant-cash-loan?gbraid=ios_test_789';
    const { context, storage } = createAttributionContext(testUrl);

    const payload = context.window.PIMAttribution.payload();
    assert.strictEqual(payload.utm_source, 'google');
    assert.strictEqual(payload.utm_medium, 'cpc');
    assert.strictEqual(payload.gbraid, 'ios_test_789');
    assert.strictEqual(storage['sess_pim_gbraid'], 'ios_test_789');
});

it('Direct landing page visit without campaigns defaults cleanly to landingpage', () => {
    const testUrl = 'https://paisainminutes.com/instant-cash-loan';
    const { context } = createAttributionContext(testUrl);

    const payload = context.window.PIMAttribution.payload();
    assert.strictEqual(payload.utm_source, 'landingpage');
    assert.strictEqual(payload.utm_medium, 'website');
    assert.strictEqual(payload.utm_campaign, 'instant_cash_loan');
    assert.strictEqual(payload.landing_page, '/instant-cash-loan');
});

// ----------------------------------------------------------------------------
// 5. Meta Pixel and CAPI Preservation
// ----------------------------------------------------------------------------
console.log('\n--- 5. META PIXEL & CAPI PRESERVATION ---');

it('Meta Pixel 1113720467814583 is preserved in header.php', () => {
    assert.ok(headerContent.includes("fbq('init', '1113720467814583')"));
    assert.ok(headerContent.includes("https://connect.facebook.net/en_US/fbevents.js"));
    assert.ok(headerContent.includes("window.pimSendLeadCapi"));
});

it('Meta Pixel 1113720467814583 is preserved in instant-cash-loan.php', () => {
    assert.ok(lpContent.includes("fbq('init', '1113720467814583')"));
    assert.ok(lpContent.includes("https://connect.facebook.net/en_US/fbevents.js"));
    assert.ok(lpContent.includes("window.pimSendLeadCapi"));
});

// ----------------------------------------------------------------------------
// Final Summary
// ----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================================');

if (failed > 0) {
    process.exit(1);
}
