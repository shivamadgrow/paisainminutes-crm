import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicHtmlDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING LANDING PAGE CRM LEAD ATTRIBUTION & WHATSAPP SEPARATION ===\n');

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

// -------------------------------------------------------------
// 1. Check attribution.js
// -------------------------------------------------------------
const attrPath = path.join(publicHtmlDir, 'js', 'attribution.js');
assert(fs.existsSync(attrPath), 'public_html/js/attribution.js exists');
const attrCode = fs.readFileSync(attrPath, 'utf8');

assert(attrCode.includes("'source'"), 'attribution.js includes source in tracked fields');
assert(attrCode.includes('instant-cash-loan'), 'attribution.js detects instant-cash-loan landing page');
assert(attrCode.includes("touch.utm_source === 'landingpage'"), 'attribution.js handles utm_source=landingpage');
assert(attrCode.includes("utm_campaign: 'instant_cash_loan'"), 'attribution.js sets utm_campaign to instant_cash_loan');
assert(attrCode.includes("utm_medium: 'website'"), 'attribution.js sets utm_medium to website');
assert(attrCode.includes("source: 'landingpage'"), 'attribution.js sets source to landingpage');
assert(attrCode.includes("landing_page: '/instant-cash-loan'"), 'attribution.js sets landing_page to /instant-cash-loan');
assert(attrCode.includes('pim_lead_source'), 'attribution.js syncs pim_lead_source in session storage');
assert(attrCode.includes('isLandingPageLead'), 'attribution.js interceptor protects landing page lead attribution');
assert(attrCode.includes("body.source = 'landingpage'"), 'attribution.js interceptor enforces body.source = landingpage');

// -------------------------------------------------------------
// 2. Check instant-cash-loan.php
// -------------------------------------------------------------
const iclPath = path.join(publicHtmlDir, 'instant-cash-loan.php');
assert(fs.existsSync(iclPath), 'public_html/instant-cash-loan.php exists');
const iclCode = fs.readFileSync(iclPath, 'utf8');

assert(iclCode.includes('function getLandingPageAttribution()'), 'instant-cash-loan.php defines getLandingPageAttribution()');
assert(iclCode.includes("source: 'landingpage'"), 'getLandingPageAttribution defaults to source = landingpage');
assert(iclCode.includes("utm_source: 'landingpage'"), 'getLandingPageAttribution defaults to utm_source = landingpage');
assert(iclCode.includes("utm_medium: 'website'"), 'getLandingPageAttribution defaults to utm_medium = website');
assert(iclCode.includes("utm_campaign: 'instant_cash_loan'"), 'getLandingPageAttribution defaults to utm_campaign = instant_cash_loan');
assert(iclCode.includes("landing_page: '/instant-cash-loan'"), 'getLandingPageAttribution defaults to landing_page = /instant-cash-loan');
assert(iclCode.includes('entry_point: \'instant-cash-loan\''), 'instant-cash-loan.php passes entry_point');
assert(iclCode.includes('pim_lead_source'), 'instant-cash-loan.php syncs pim_lead_source in sessionStorage');
assert(iclCode.includes("source: lpAttr.source"), 'leadPayload uses lpAttr.source instead of hardcoded Meta Ads');
assert(iclCode.includes("lead_source: lpAttr.lead_source"), 'leadPayload uses lpAttr.lead_source');
assert(iclCode.includes("utm_source: lpAttr.utm_source"), 'leadPayload uses lpAttr.utm_source');
assert(iclCode.includes("utm_medium: lpAttr.utm_medium"), 'leadPayload uses lpAttr.utm_medium');
assert(iclCode.includes("utm_campaign: lpAttr.utm_campaign"), 'leadPayload uses lpAttr.utm_campaign');
assert(iclCode.includes("landing_page: lpAttr.landing_page"), 'leadPayload uses lpAttr.landing_page');
assert(!iclCode.includes('source: "Meta Ads (Instant Cash Loan)"'), 'instant-cash-loan.php removed obsolete hardcoded source');

// -------------------------------------------------------------
// 3. Check customer-details-modal.php
// -------------------------------------------------------------
const modalPath = path.join(publicHtmlDir, 'includes', 'customer-details-modal.php');
assert(fs.existsSync(modalPath), 'public_html/includes/customer-details-modal.php exists');
const modalCode = fs.readFileSync(modalPath, 'utf8');

assert(modalCode.includes("let modalSource = 'landingpage'"), 'customer-details-modal.php resolves modalSource = landingpage');
assert(modalCode.includes("let modalUtmSource = 'landingpage'"), 'customer-details-modal.php resolves modalUtmSource = landingpage');
assert(modalCode.includes("let modalUtmMedium = 'website'"), 'customer-details-modal.php resolves modalUtmMedium = website');
assert(modalCode.includes("let modalUtmCampaign = 'instant_cash_loan'"), 'customer-details-modal.php resolves modalUtmCampaign = instant_cash_loan');
assert(modalCode.includes("let modalLandingPage = '/instant-cash-loan'"), 'customer-details-modal.php resolves modalLandingPage = /instant-cash-loan');
assert(modalCode.includes("source: modalSource"), 'modal lead submission sets source: modalSource');
assert(modalCode.includes("lead_source: modalLeadSource"), 'modal lead submission sets lead_source: modalLeadSource');
assert(modalCode.includes("utm_source: modalUtmSource"), 'modal lead submission sets utm_source: modalUtmSource');
assert(modalCode.includes("utm_medium: modalUtmMedium"), 'modal lead submission sets utm_medium: modalUtmMedium');
assert(modalCode.includes("utm_campaign: modalUtmCampaign"), 'modal lead submission sets utm_campaign: modalUtmCampaign');
assert(modalCode.includes("landing_page: modalLandingPage"), 'modal lead submission sets landing_page: modalLandingPage');
assert(modalCode.includes("whatsappOptIn: Boolean(payloadData.marketingConsent)"), 'modal separates whatsappOptIn from acquisition channel');
assert(!modalCode.includes('source: "Meta Ads (Instant Cash Loan)"'), 'customer-details-modal.php removed obsolete hardcoded source');

// -------------------------------------------------------------
// 4. Check affiliate_tracker.php
// -------------------------------------------------------------
const trackerPath = path.join(publicHtmlDir, 'includes', 'affiliate_tracker.php');
assert(fs.existsSync(trackerPath), 'public_html/includes/affiliate_tracker.php exists');
const trackerCode = fs.readFileSync(trackerPath, 'utf8');
assert(trackerCode.includes('$isLandingPage') && trackerCode.includes('landingpage'), 'affiliate_tracker.php avoids overriding landing page leads with Whatsapp-AGM');

// -------------------------------------------------------------
// 5. Check CRM apiConfig.js
// -------------------------------------------------------------
const apiConfigPath = path.join(publicHtmlDir, 'crm', 'src', 'utils', 'apiConfig.js');
assert(fs.existsSync(apiConfigPath), 'public_html/crm/src/utils/apiConfig.js exists');
const apiConfigCode = fs.readFileSync(apiConfigPath, 'utf8');

assert(apiConfigCode.includes('isLandingPageOrigin'), 'apiConfig.js defines isLandingPageOrigin detection');
assert(apiConfigCode.includes("rawUtm === 'landingpage'"), 'apiConfig.js detects landingpage from utmSource');
assert(apiConfigCode.includes("rawLeadSource === 'landingpage'"), 'apiConfig.js detects landingpage from leadSource');
assert(apiConfigCode.includes("isInstantCashLoanPage"), 'apiConfig.js detects landingpage from URL / campaign / entryPoint');
assert(apiConfigCode.includes("channel = isLandingPageOriginLead"), 'apiConfig.js assigns channel based on isLandingPageOrigin');
assert(apiConfigCode.includes("source = isLandingPageOriginLead"), 'apiConfig.js assigns source based on isLandingPageOrigin');
assert(apiConfigCode.includes("utmSource = isLandingPageOriginLead"), 'apiConfig.js assigns utmSource based on isLandingPageOrigin');
assert(apiConfigCode.includes("utmMedium = isLandingPageOriginLead"), 'apiConfig.js assigns utmMedium based on isLandingPageOrigin');
assert(apiConfigCode.includes("utmCampaign = isLandingPageOriginLead"), 'apiConfig.js assigns utmCampaign based on isLandingPageOrigin');
assert(apiConfigCode.includes("landingPage = isLandingPageOriginLead"), 'apiConfig.js assigns landingPage based on isLandingPageOrigin');
assert(apiConfigCode.includes("whatsappOptIn"), 'apiConfig.js separates whatsappOptIn from acquisition channel');

// -------------------------------------------------------------
// 6. Check CRM LeadsView.jsx and CompanyLeadsView.jsx
// -------------------------------------------------------------
const leadsViewPath = path.join(publicHtmlDir, 'crm', 'src', 'components', 'LeadsView.jsx');
assert(fs.existsSync(leadsViewPath), 'public_html/crm/src/components/LeadsView.jsx exists');
const leadsViewCode = fs.readFileSync(leadsViewPath, 'utf8');

assert(leadsViewCode.includes("'landingpage'"), 'LeadsView.jsx includes landingpage in CHANNEL_TABS');
assert(leadsViewCode.includes("isLandingPageLead"), 'LeadsView.jsx exports isLandingPageLead helper');
assert(leadsViewCode.includes("channelOf"), 'LeadsView.jsx exports channelOf helper');
assert(leadsViewCode.includes("WhatsApp Opt-in"), 'LeadsView.jsx displays separate WhatsApp Opt-in badge');
assert(leadsViewCode.includes('Lead Source:'), 'Lead Overview drawer displays "Lead Source:"');
assert(leadsViewCode.includes('UTM Source:'), 'Lead Overview drawer displays "UTM Source:"');
assert(leadsViewCode.includes('UTM Medium:'), 'Lead Overview drawer displays "UTM Medium:"');
assert(leadsViewCode.includes('UTM Campaign:'), 'Lead Overview drawer displays "UTM Campaign:"');
assert(leadsViewCode.includes('Landing Page:'), 'Lead Overview drawer displays "Landing Page:"');

const compLeadsViewPath = path.join(publicHtmlDir, 'crm', 'src', 'components', 'CompanyLeadsView.jsx');
assert(fs.existsSync(compLeadsViewPath), 'public_html/crm/src/components/CompanyLeadsView.jsx exists');
const compLeadsViewCode = fs.readFileSync(compLeadsViewPath, 'utf8');
assert(compLeadsViewCode.includes("landingpage"), 'CompanyLeadsView.jsx renders landingpage badge');

// -------------------------------------------------------------
// 7. Verify All 7 Required User Scenarios in apiConfig.js
// -------------------------------------------------------------
const { mapBackendLead, buildLeadPayload, isLandingPageOrigin } = await import(`file://${apiConfigPath.replace(/\\/g, '/')}`);

// SCENARIO 1: A lead submitted from /instant-cash-loan displays landingpage as source
const scenario1Lead = mapBackendLead({
    id: 'scen-1',
    phone: '9876543210',
    applicantName: 'Landing Page Applicant',
    landingPage: '/instant-cash-loan',
    utmCampaign: 'instant_cash_loan',
    entryPoint: 'instant-cash-loan',
    source: 'landingpage',
    leadSource: 'landingpage',
    utmSource: 'landingpage',
    utmMedium: 'website'
});
assert(scenario1Lead.source === 'landingpage', 'Scenario 1: Lead source is "landingpage"');
assert(scenario1Lead.channel === 'landingpage', 'Scenario 1: Lead channel is "landingpage"');
assert(scenario1Lead.leadSource === 'landingpage', 'Scenario 1: Lead leadSource is "landingpage"');
assert(scenario1Lead.utmSource === 'landingpage', 'Scenario 1: Lead utmSource is "landingpage"');
assert(scenario1Lead.utmMedium === 'website', 'Scenario 1: Lead utmMedium is "website"');
assert(scenario1Lead.utmCampaign === 'instant_cash_loan', 'Scenario 1: Lead utmCampaign is "instant_cash_loan"');
assert(scenario1Lead.landingPage === '/instant-cash-loan', 'Scenario 1: Lead landingPage is "/instant-cash-loan"');

// SCENARIO 2: A genuine WhatsApp-origin lead retains its correct WhatsApp source
const scenario2Lead = mapBackendLead({
    id: 'scen-2',
    phone: '9876543211',
    applicantName: 'Genuine WhatsApp Applicant',
    source: 'WhatsApp',
    channel: 'WhatsApp',
    utmSource: 'whatsapp',
    utmMedium: 'cpc',
    utmCampaign: 'wa_promo_2026',
    landingPage: null
});
assert(scenario2Lead.source === 'WhatsApp', 'Scenario 2: Genuine WhatsApp lead retains source = "WhatsApp"');
assert(scenario2Lead.channel === 'WhatsApp', 'Scenario 2: Genuine WhatsApp lead retains channel = "WhatsApp"');
assert(scenario2Lead.utmSource === 'whatsapp', 'Scenario 2: Genuine WhatsApp lead retains utmSource = "whatsapp"');

// SCENARIO 3: A website lead with stale/poisoned WhatsApp referer or later contacted on WhatsApp retains landingpage
const scenario3Lead = mapBackendLead({
    id: 'scen-3',
    phone: '9876543212',
    applicantName: 'Poisoned Referer Lead',
    source: 'WhatsApp', // Stale fallback or referer
    channel: 'WhatsApp',
    utmSource: 'Whatsapp-AGM', // Stale cookie from HTTP_REFERER
    utmMedium: 'website',
    utmCampaign: 'instant_cash_loan',
    landingPage: '/instant-cash-loan',
    communicationChannel: 'whatsapp' // contacted via WhatsApp later
});
assert(scenario3Lead.source === 'landingpage', 'Scenario 3: Poisoned WhatsApp referer lead corrected to source = "landingpage"');
assert(scenario3Lead.channel === 'landingpage', 'Scenario 3: Poisoned WhatsApp referer lead corrected to channel = "landingpage"');
assert(scenario3Lead.utmSource === 'landingpage', 'Scenario 3: utmSource corrected to "landingpage"');
assert(scenario3Lead.utmMedium === 'website', 'Scenario 3: utmMedium is "website"');
assert(scenario3Lead.utmCampaign === 'instant_cash_loan', 'Scenario 3: utmCampaign is "instant_cash_loan"');
assert(scenario3Lead.communicationChannel === 'whatsapp', 'Scenario 3: communicationChannel preserved separately');

// SCENARIO 4: WhatsApp opt-in is displayed only when supported by actual consent data
const consentLead = mapBackendLead({
    id: 'scen-4a',
    phone: '9876543213',
    applicantName: 'Consenting Lead',
    landingPage: '/instant-cash-loan',
    marketingConsent: true,
    whatsappOptIn: true
});
assert(consentLead.whatsappOptIn === true, 'Scenario 4a: WhatsApp Opt-in is true when consent is given');
assert(consentLead.source === 'landingpage', 'Scenario 4a: Acquisition source remains "landingpage" despite WhatsApp opt-in');

const noConsentLead = mapBackendLead({
    id: 'scen-4b',
    phone: '9876543214',
    applicantName: 'Non-consenting Lead',
    landingPage: '/instant-cash-loan',
    marketingConsent: false,
    whatsappOptIn: false
});
assert(noConsentLead.whatsappOptIn === false, 'Scenario 4b: WhatsApp Opt-in is false when consent is not given');

// SCENARIO 5: Deterministic mapping on CRM refresh (no transient or mutated state)
const refreshLead1 = mapBackendLead({
    id: 'scen-5',
    phone: '9876543215',
    applicantName: 'Refresh Lead',
    landingPage: '/instant-cash-loan'
});
const refreshLead2 = mapBackendLead({
    id: 'scen-5',
    phone: '9876543215',
    applicantName: 'Refresh Lead',
    landingPage: '/instant-cash-loan'
});
assert(refreshLead1.source === 'landingpage' && refreshLead2.source === 'landingpage', 'Scenario 5: Refreshing produces identical landingpage source');
assert(refreshLead1.channel === 'landingpage' && refreshLead2.channel === 'landingpage', 'Scenario 5: Refreshing produces identical landingpage channel');

// SCENARIO 6: Updating lead status does not change original source
const activeLead = mapBackendLead({
    id: 'scen-6',
    phone: '9876543216',
    applicantName: 'Status Transition Lead',
    landingPage: '/instant-cash-loan',
    status: 'FRESH'
});
const updatedStatusLead = mapBackendLead({
    ...activeLead,
    status: 'INTERESTED',
    history: [{ status: 'INTERESTED', timestamp: new Date().toISOString() }]
});
assert(updatedStatusLead.source === activeLead.source, 'Scenario 6: Updating status retains source = "landingpage"');
assert(updatedStatusLead.channel === activeLead.channel, 'Scenario 6: Updating status retains channel = "landingpage"');
assert(updatedStatusLead.status === 'INTERESTED', 'Scenario 6: Status is successfully updated');

// SCENARIO 7: Existing lead details, application IDs, and partner delivery remain intact
const fullLead = mapBackendLead({
    id: 'scen-7',
    leadCode: 'PIM-APP-7788',
    phone: '9876543217',
    applicantName: 'Aarav Sharma',
    amount: 50000,
    monthlyIncome: 35000,
    cibilScore: 750,
    city: 'Mumbai',
    pincode: '400001',
    landingPage: '/instant-cash-loan',
    assignedPartnerId: 'partner-123'
});
assert(fullLead.leadCode === 'PIM-APP-7788', 'Scenario 7: Lead code preserved');
assert(fullLead.amount === 50000, 'Scenario 7: Loan amount preserved');
assert(fullLead.monthlyIncome === 35000, 'Scenario 7: Monthly income preserved');
assert(fullLead.cibilScore === 750, 'Scenario 7: CIBIL score preserved');
assert(fullLead.city === 'Mumbai', 'Scenario 7: City preserved');
assert(fullLead.pincode === '400001', 'Scenario 7: Pincode preserved');
assert(fullLead.source === 'landingpage', 'Scenario 7: Source attributed to landingpage');
assert(fullLead.assignedPartnerId === 'partner-123', 'Scenario 7: Partner assignment preserved');

// External ad campaign preservation test
const metaLead = mapBackendLead({
    id: 'meta-1',
    phone: '9876543218',
    applicantName: 'Meta Ad Clicker',
    source: 'Meta',
    channel: 'Meta',
    utmSource: 'facebook',
    utmMedium: 'paid_social',
    utmCampaign: 'spring_campaign_2026',
    landingPage: '/instant-cash-loan'
});
assert(metaLead.source === 'Meta', 'External Ad Campaign: Source preserves "Meta"');
assert(metaLead.channel === 'Meta', 'External Ad Campaign: Channel preserves "Meta"');
assert(metaLead.utmSource === 'facebook', 'External Ad Campaign: utmSource preserves "facebook"');

// -------------------------------------------------------------
// 8. Check compiled CRM bundle
// -------------------------------------------------------------
const crmBundlePath = path.join(publicHtmlDir, 'crm', 'assets', 'index.js');
assert(fs.existsSync(crmBundlePath), 'CRM compiled bundle index.js exists');
const bundleCode = fs.readFileSync(crmBundlePath, 'utf8');
assert(bundleCode.includes('landingpage'), 'Compiled bundle index.js includes landingpage');

console.log('\n======================================================');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('======================================================\n');

if (failCount > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
