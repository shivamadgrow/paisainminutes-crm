#!/usr/bin/env node
/**
 * Visitor-flow check for the public website against the Node server.
 *
 *   BACKEND_API_URL=http://localhost:4000 node public_html/scripts/website-flow-check.mjs
 *
 * It sends the same requests the website pages send after the Phase 8 change (apply-now / check-eligibility /
 * home modal / offers page / status page / contact form / credit check / partner click) and checks the
 * answers the pages rely on. Run it ONLY against a test server and database: it creates test leads.
 * It does not test PHP rendering itself (that needs a PHP server, see the manual checklist in plan.md).
 */
const BASE = (process.env.BACKEND_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const phone = '9' + String(Date.now()).slice(-9);
let failures = 0;

const check = (name, ok, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  <= ' + detail}`);
};
const call = async (method, path, body) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch (e) { /* not json */ }
  return { status: res.status, json };
};

// 1. Home modal: phone-only first step (js/main.js)
let r = await call('POST', '/api/public/leads', { phone, utm_source: null, lead_source: 'Direct Website', source: 'Modal Quick Apply' });
check('home modal: phone-only step accepted', r.status < 300 && r.json && r.json.lead_id, JSON.stringify(r.json));
const leadId = r.json && r.json.lead_id;

// 2. apply-now.php full form, same lead (no duplicate)
const full = {
  name: 'Flow Check', fullName: 'Flow Check', phone, mobile: phone, email: 'flow.check@example.test', dob: '1990-01-01', gender: 'Male',
  pincode: '110001', employmentType: 'Salaried', salary: 52000, monthlySalary: 52000, loanAmount: 150000, loan_amount: 150000, amount: 150000,
  modeOfSalary: 'Bank Transfer', companyName: 'Example Co', pan: 'ABCDE1234F', haveCreditCard: 'No', cibilScore: '', utm_source: null,
  lead_source: 'Direct Website', source: 'Apply Now (Website)', status: 'Fresh',
};
r = await call('POST', '/api/public/leads', full);
check('apply-now: full submit returns the same lead_id', r.json && r.json.lead_id === leadId, `${leadId} vs ${r.json && r.json.lead_id}`);
check('apply-now: response has data.redirect_url', r.json && r.json.data && /lead_id=/.test(r.json.data.redirect_url || ''), JSON.stringify(r.json && r.json.data));
check('apply-now: raw PAN is not echoed', !JSON.stringify(r.json).includes('ABCDE1234F'));
const slugLead = leadId;

// 3. check-eligibility.php repeat submit
r = await call('POST', '/api/public/leads', { ...full, source: 'Check Eligibility Website' });
check('check-eligibility: repeat submit is a no-op (same lead)', r.json && r.json.lead_id === slugLead);

// 4. credit check (consent required)
r = await call('POST', '/api/public/credit-check', { phone });
check('credit check without consent is refused (400)', r.status === 400);
r = await call('POST', '/api/public/credit-check', { phone, consent: true });
check('credit check with consent answers 200 (success true or false, never a made-up score)', r.status === 200 && r.json && (r.json.success === true || (r.json.success === false && !('score' in r.json))), JSON.stringify(r.json));

// 5. offers page lookup
r = await call('GET', `/api/public/leads/lookup?phone=${phone}&leadCode=${encodeURIComponent(leadId)}`);
check('loan-offers: lookup with phone + lead id returns details', r.json && r.json.scope === 'full' && r.json.data && r.json.data.name, JSON.stringify(r.json));
r = await call('GET', `/api/public/leads/lookup?phone=${phone}`);
check('loan-offers: lookup by phone only is limited (no name)', r.json && r.json.scope === 'limited' && !(r.json.data && r.json.data.name));

// 6. status page
r = await call('GET', `/api/public/leads/status?phone=${phone}`);
check('track-status: found, reference id + status, name masked', r.json && r.json.status === 'success' && r.json.data.reference_id === leadId && /\*/.test(r.json.data.name || ''), JSON.stringify(r.json));
r = await call('GET', '/api/public/leads/status?phone=9000000001');
check('track-status: unknown number is 404', r.status === 404);

// 7. contact form
r = await call('POST', '/api/public/contact', { name: 'Flow Check', phone, email: 'flow.check@example.test', subject: 'Hello', message: 'Visitor flow check message', agree_consent: '1' });
check('contact-us: accepted with a reference id', r.json && r.json.status === 'success' && /^MSG-/.test(r.json.reference_id || ''), JSON.stringify(r.json));
r = await call('POST', '/api/public/contact', { name: '', phone: '1', message: '' });
check('contact-us: invalid input is rejected (400)', r.status === 400);

// 8. partner click-out from the offers page (needs a partner named in PARTNER_SLUG; skipped otherwise)
const slug = process.env.PARTNER_SLUG;
if (slug) {
  r = await call('POST', '/api/public/partner-click', { partner: slug, leadId, phone, source: 'loan_offers' });
  check(`offers: click on "${slug}" is recorded with a stored target URL`, r.status === 200 && r.json && r.json.success && r.json.target_url, JSON.stringify(r.json));
} else {
  console.log('SKIP  partner click (set PARTNER_SLUG to an existing partner slug to test it)');
}

// 9. OTP preflight: the website origin must be in CORS_ORIGINS
const origin = process.env.WEBSITE_ORIGIN;
if (origin) {
  const pre = await fetch(BASE + '/api/auth/send-otp', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' } });
  check(`CORS preflight allows ${origin}`, pre.headers.get('access-control-allow-origin') === origin, String(pre.headers.get('access-control-allow-origin')));
} else {
  console.log('SKIP  CORS preflight (set WEBSITE_ORIGIN, e.g. https://www.paisainminutes.com)');
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
