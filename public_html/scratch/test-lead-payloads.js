const assert = require('assert');

// Import or replicate the functions from apiConfig.js to test logic
const {
  KNOWN_LENDERS,
  resolveValidLenderId,
  resolveLenderName,
  maskPan,
  formatIsoDate,
  coerceNumber,
  coerceBoolean,
  coerceCibilScore,
  sanitizePan,
  buildLeadPayload,
  mapBackendLead
} = (() => {
  const KNOWN_LENDERS = [
    { id: '1', name: 'Aditya Birla Capital', maxAmount: 500000 },
    { id: '2', name: 'Bajaj Finserv Direct', maxAmount: 400000 },
    { id: '3', name: 'Tata Capital Finance', maxAmount: 350000 },
    { id: '4', name: 'L&T Finance Holding', maxAmount: 250000 }
  ];

  let cachedLendersList = [...KNOWN_LENDERS];

  function resolveValidLenderId(val) {
    if (val === undefined || val === null || val === '' || val === 'Pending Selection' || val === 'null' || val === 'undefined') {
      return null;
    }
    const str = String(val).trim();
    const directMatch = cachedLendersList.find(l => String(l.id) === str);
    if (directMatch) return String(directMatch.id);

    const nameMatch = cachedLendersList.find(l => l.name && (l.name.toLowerCase() === str.toLowerCase() || str.toLowerCase().includes(l.name.toLowerCase())));
    if (nameMatch) return String(nameMatch.id);

    if (/^\d+$/.test(str)) return str;
    return null;
  }

  function resolveLenderName(lenderId) {
    if (!lenderId) return null;
    const str = String(lenderId).trim();
    const found = cachedLendersList.find(l => String(l.id) === str || (l.name && l.name.toLowerCase() === str.toLowerCase()));
    return found ? found.name : null;
  }

  function maskPan(rawPan) {
    if (!rawPan) return '—';
    const clean = String(rawPan).trim().toUpperCase();
    if (clean.includes('*')) return clean;
    if (clean.length === 10) {
      return `${clean.slice(0, 2)}*****${clean.slice(-2)}`;
    }
    return clean ? `${clean.slice(0, 2)}*****` : '—';
  }

  function formatIsoDate(val) {
    if (!val) return null;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
      if (trimmed.includes('T')) {
        const p = trimmed.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
      }
      const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        const dd = dmy[1].padStart(2, '0');
        const mm = dmy[2].padStart(2, '0');
        const yyyy = dmy[3];
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }

  function coerceNumber(val) {
    if (val === undefined || val === null || val === '') return undefined;
    if (typeof val === 'number') return isNaN(val) ? undefined : val;
    const clean = String(val).replace(/[^0-9.]/g, '');
    if (!clean) return undefined;
    const num = parseFloat(clean);
    return isNaN(num) ? undefined : num;
  }

  function coerceBoolean(val) {
    if (val === undefined || val === null || val === '') return undefined;
    if (typeof val === 'boolean') return val;
    const s = String(val).trim().toLowerCase();
    if (['true', 'yes', '1', 'y'].includes(s)) return true;
    if (['false', 'no', '0', 'n'].includes(s)) return false;
    return undefined;
  }

  function coerceCibilScore(val) {
    if (val === undefined || val === null || val === '' || val === '—') return undefined;
    let num = typeof val === 'number' ? val : null;
    if (num === null && typeof val === 'string') {
      const match = val.match(/(\d{3})/);
      if (match) {
        num = parseInt(match[1], 10);
      }
    }
    if (typeof num === 'number' && !isNaN(num) && num >= 300 && num <= 900) {
      return num;
    }
    return undefined;
  }

  function sanitizePan(val) {
    if (!val || typeof val !== 'string') return undefined;
    const clean = val.trim().toUpperCase();
    if (/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean)) {
      return clean;
    }
    return undefined;
  }

  function buildLeadPayload(input = {}) {
    if (!input || typeof input !== 'object') return {};
    const payload = {};

    const rawName = input.applicantName ?? input.fullName ?? input.name;
    if (rawName && typeof rawName === 'string' && rawName.trim()) {
      payload.applicantName = rawName.trim();
      payload.name = payload.applicantName;
    }

    const rawPhone = input.phone ?? input.phoneNumber ?? input.mobile;
    if (rawPhone) {
      const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        payload.phone = cleanPhone;
      }
    }

    const rawEmail = input.email ?? input.emailAddress;
    if (rawEmail && typeof rawEmail === 'string' && rawEmail.trim() && rawEmail.includes('@')) {
      payload.email = rawEmail.trim();
    }

    const amountVal = coerceNumber(input.amount ?? input.loan_amount ?? input.loanAmount ?? input.applied);
    if (amountVal !== undefined && amountVal > 0) {
      payload.amount = amountVal;
    }

    const tenureVal = coerceNumber(input.tenureMonths ?? input.tenure);
    if (tenureVal !== undefined && tenureVal > 0) {
      payload.tenureMonths = tenureVal;
    }

    const rawPurpose = input.purpose ?? input.loanPurpose;
    if (rawPurpose && typeof rawPurpose === 'string' && rawPurpose.trim()) {
      payload.purpose = rawPurpose.trim();
    }

    const incomeVal = coerceNumber(input.monthlyIncome ?? input.salary ?? input.monthlySalary ?? input.monthly_salary);
    if (incomeVal !== undefined && incomeVal > 0) {
      payload.monthlyIncome = incomeVal;
    }

    const empVal = input.employmentType ?? input.employment_type ?? input.empType;
    if (empVal && typeof empVal === 'string' && empVal.trim()) {
      payload.employmentType = empVal.trim();
    }

    const compVal = input.companyName ?? input.company_name ?? input.company;
    if (compVal && typeof compVal === 'string' && compVal.trim() && compVal !== '—') {
      payload.companyName = compVal.trim();
    }

    const modeVal = input.salaryMode ?? input.mode_of_salary ?? input.modeOfSalary;
    if (modeVal && typeof modeVal === 'string' && modeVal.trim() && modeVal !== '—') {
      payload.salaryMode = modeVal.trim();
    }

    if (input.city && typeof input.city === 'string' && input.city.trim() && input.city !== '—') {
      payload.city = input.city.trim();
    }

    if (input.state && typeof input.state === 'string' && input.state.trim() && input.state !== '—') {
      payload.state = input.state.trim();
    }

    const rawPin = input.pincode ?? input.pinCode ?? input.pin;
    if (rawPin) {
      const cleanPin = String(rawPin).replace(/\D/g, '').slice(0, 6);
      if (cleanPin.length === 6) {
        payload.pincode = cleanPin;
      }
    }

    const rawDob = input.dob ?? input.dateOfBirth ?? input.date_of_birth;
    const isoDob = formatIsoDate(rawDob);
    if (isoDob) {
      payload.dob = isoDob;
    }

    const rawGender = input.gender ?? input.sex;
    if (rawGender && typeof rawGender === 'string' && rawGender.trim() && rawGender !== '—') {
      payload.gender = rawGender.trim();
    }

    const ccBool = coerceBoolean(input.haveCreditCard ?? input.have_credit_card ?? input.hasCreditCard);
    if (ccBool !== undefined) {
      payload.haveCreditCard = ccBool;
    }

    const ccLimit = coerceNumber(input.creditCardLimit ?? input.credit_card_limit);
    if (ccLimit !== undefined) {
      payload.creditCardLimit = ccLimit;
    }

    const rawUtm = input.utmSource ?? input.utm_source;
    if (rawUtm && typeof rawUtm === 'string' && rawUtm.trim() && rawUtm !== 'null' && rawUtm !== 'undefined') {
      payload.utmSource = rawUtm.trim();
    }

    const rawLeadSource = input.leadSource ?? input.lead_source ?? input.source;
    if (rawLeadSource && typeof rawLeadSource === 'string' && rawLeadSource.trim()) {
      payload.leadSource = rawLeadSource.trim();
    }

    const validPan = sanitizePan(input.pan ?? input.panNumber ?? input.pan_card);
    if (validPan) {
      payload.pan = validPan;
    }

    const cibil = coerceCibilScore(input.cibilScore ?? input.cibil);
    if (cibil !== undefined) {
      payload.cibilScore = cibil;
    }

    if (input.selectedLenderId !== undefined) {
      const validLenderId = resolveValidLenderId(input.selectedLenderId);
      if (validLenderId) {
        payload.selectedLenderId = validLenderId;
      }
    }

    const rawAppId = input.lenderApplicationId ?? input.partnerApplicationId;
    if (rawAppId && typeof rawAppId === 'string' && rawAppId.trim()) {
      payload.lenderApplicationId = rawAppId.trim();
    }

    return payload;
  }

  function normalizeStatus(rawStatus) {
    if (!rawStatus) return 'FRESH';
    const clean = String(rawStatus).trim().toUpperCase().replace(/[\s-]+/g, '_');
    if (clean === 'DRAFT' || clean === 'SUBMITTED' || clean === 'FRESH' || clean === 'NEW') return 'FRESH';
    if (clean === 'CALLBACK' || clean === 'CALL_BACK') return 'CALLBACK';
    if (clean === 'INTERESTED') return 'INTERESTED';
    if (clean === 'DOCS_RECEIVED' || clean === 'DOCS' || clean === 'DOCUMENTATION' || clean === 'DOCUMENTS_RECEIVED') return 'DOCS_RECEIVED';
    if (clean === 'APPROVED' || clean === 'SANCTIONED') return 'APPROVED';
    if (clean === 'DISBURSED' || clean === 'DISBURSAL') return 'DISBURSED';
    if (clean === 'REJECTED' || clean === 'NOT_INTERESTED' || clean === 'DECLINED') return 'REJECTED';
    return clean;
  }

  function mapBackendLead(item) {
    if (!item) return null;
    const rawPhone = String(item.phone || item.phoneNumber || item.mobile || (item.user && item.user.phone) || '').replace(/\D/g, '').slice(-10);
    if (!rawPhone || rawPhone.length < 10) return null;

    const rawName = (item.applicantName || item.name || item.fullName || (item.user && item.user.name) || 'Applicant').trim();
    const cleanLoan = Number(item.amount || item.loanAmount) || 0;
    const cleanSalary = Number(item.monthlyIncome || item.salary) || 0;

    const rawCibil = item.cibilScore !== undefined && item.cibilScore !== null ? Number(item.cibilScore) : null;
    const isValidCibil = typeof rawCibil === 'number' && !isNaN(rawCibil) && rawCibil > 0;
    const cibilScore = isValidCibil ? rawCibil : null;

    const city = (item.city || '').trim();
    const state = (item.state || '').trim();
    const pincode = (item.pincode || '').trim();

    const selectedLenderId = item.selectedLenderId ? String(item.selectedLenderId) : null;
    const lenderName = resolveLenderName(selectedLenderId);

    const panMasked = item.panMasked || (item.pan ? maskPan(item.pan) : '—');

    const haveCreditCardBool = typeof item.haveCreditCard === 'boolean'
      ? item.haveCreditCard
      : (String(item.haveCreditCard).toLowerCase() === 'true' || String(item.haveCreditCard).toLowerCase() === 'yes');
    const creditCardLimitNum = (item.creditCardLimit !== null && item.creditCardLimit !== undefined && !isNaN(Number(item.creditCardLimit)))
      ? Number(item.creditCardLimit)
      : null;

    const dobFormatted = item.dob ? (item.dob.includes('T') ? item.dob.split('T')[0] : item.dob) : '—';

    return {
      id: String(item.id || item._id),
      displayId: item.displayId,
      applicantName: rawName,
      name: rawName,
      phone: rawPhone,
      email: item.email ? String(item.email).trim() : '',
      amount: cleanLoan,
      tenureMonths: Number(item.tenureMonths) || 12,
      purpose: item.purpose || 'Personal Loan',
      monthlyIncome: cleanSalary,
      cibilScore: cibilScore,
      status: normalizeStatus(item.status),
      employmentType: item.employmentType || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      utmSource: item.utmSource || null,
      leadSource: item.leadSource || null,
      selectedLenderId: selectedLenderId,
      lenderApplicationId: item.lenderApplicationId || null,
      assignedCompany: lenderName || 'Pending Selection',
      panMasked: panMasked,
      pan: panMasked, // Secure: never exposes raw PAN
      companyName: item.companyName || null,
      salaryMode: item.salaryMode || null,
      dob: dobFormatted,
      gender: item.gender || null,
      haveCreditCard: haveCreditCardBool ? 'Yes' : 'No',
      haveCreditCardBool: haveCreditCardBool,
      creditCardLimit: creditCardLimitNum
    };
  }

  return {
    KNOWN_LENDERS,
    resolveValidLenderId,
    resolveLenderName,
    maskPan,
    formatIsoDate,
    coerceNumber,
    coerceBoolean,
    coerceCibilScore,
    sanitizePan,
    buildLeadPayload,
    mapBackendLead
  };
})();

console.log('--- TEST 1: Minimal Lead Payload ---');
const minimalInput = {
  name: 'Applicant Name',
  phone: '9876543210',
  email: 'test@example.com',
  amount: 50000,
  tenureMonths: 12,
  purpose: 'Personal Loan',
  monthlyIncome: 55000
};
const minimalPayload = buildLeadPayload(minimalInput);
console.log('Minimal Output:', JSON.stringify(minimalPayload, null, 2));
assert.strictEqual(minimalPayload.applicantName, 'Applicant Name');
assert.strictEqual(minimalPayload.phone, '9876543210');
assert.strictEqual(minimalPayload.email, 'test@example.com');
assert.strictEqual(minimalPayload.amount, 50000);
assert.strictEqual(minimalPayload.tenureMonths, 12);
assert.strictEqual(minimalPayload.purpose, 'Personal Loan');
assert.strictEqual(minimalPayload.monthlyIncome, 55000);
assert.strictEqual(minimalPayload.companyName, undefined, 'Optional companyName must not be included');
assert.strictEqual(minimalPayload.pan, undefined, 'Optional PAN must not be included');
console.log('✓ TEST 1 PASSED!');

console.log('\n--- TEST 2: Complete Lead Payload with Aliases & Coercion ---');
const fullInput = {
  fullName: 'Test Applicant',
  mobile: '+91 9876543210',
  emailAddress: 'test@example.com',
  loan_amount: '50000',
  tenure: '12',
  purpose: 'Personal Loan',
  salary: '55000',
  employment_type: 'Salaried',
  company_name: 'Test Company',
  mode_of_salary: 'Bank',
  city: 'Delhi',
  state: 'Delhi',
  pincode: '110001',
  dob: '2000-01-01',
  gender: 'Male',
  have_credit_card: 'yes',
  credit_card_limit: '100000',
  utm_source: 'website',
  lead_source: 'website',
  pan: 'abcde1234f',
  cibil: '720',
  selectedLenderId: '1',
  lenderApplicationId: 'PARTNER_APP_001'
};
const fullPayload = buildLeadPayload(fullInput);
console.log('Full Output (pan masked for display):', JSON.stringify({ ...fullPayload, pan: maskPan(fullPayload.pan) }, null, 2));
assert.strictEqual(fullPayload.applicantName, 'Test Applicant');
assert.strictEqual(fullPayload.phone, '9876543210');
assert.strictEqual(fullPayload.email, 'test@example.com');
assert.strictEqual(fullPayload.amount, 50000);
assert.strictEqual(typeof fullPayload.amount, 'number');
assert.strictEqual(fullPayload.tenureMonths, 12);
assert.strictEqual(typeof fullPayload.tenureMonths, 'number');
assert.strictEqual(fullPayload.monthlyIncome, 55000);
assert.strictEqual(typeof fullPayload.monthlyIncome, 'number');
assert.strictEqual(fullPayload.employmentType, 'Salaried');
assert.strictEqual(fullPayload.companyName, 'Test Company');
assert.strictEqual(fullPayload.salaryMode, 'Bank');
assert.strictEqual(fullPayload.city, 'Delhi');
assert.strictEqual(fullPayload.state, 'Delhi');
assert.strictEqual(fullPayload.pincode, '110001');
assert.strictEqual(fullPayload.dob, '2000-01-01');
assert.strictEqual(fullPayload.gender, 'Male');
assert.strictEqual(fullPayload.haveCreditCard, true);
assert.strictEqual(typeof fullPayload.haveCreditCard, 'boolean');
assert.strictEqual(fullPayload.creditCardLimit, 100000);
assert.strictEqual(typeof fullPayload.creditCardLimit, 'number');
assert.strictEqual(fullPayload.utmSource, 'website');
assert.strictEqual(fullPayload.leadSource, 'website');
assert.strictEqual(fullPayload.pan, 'ABCDE1234F');
assert.strictEqual(fullPayload.cibilScore, 720);
assert.strictEqual(typeof fullPayload.cibilScore, 'number');
assert.strictEqual(fullPayload.selectedLenderId, '1');
assert.strictEqual(fullPayload.lenderApplicationId, 'PARTNER_APP_001');
console.log('✓ TEST 2 PASSED!');

console.log('\n--- TEST 3: PAN Masking & Security ---');
const rawPan = 'ABCDE1234F';
const masked = maskPan(rawPan);
console.log('Raw PAN:', '******** (Hidden)');
console.log('Masked PAN:', masked);
assert.strictEqual(masked, 'AB*****4F');
assert(!masked.includes('CDE123'), 'Masked PAN must never contain middle characters');
console.log('✓ TEST 3 PASSED!');

console.log('\n--- TEST 4: Backend Lender ID Validation ---');
assert.strictEqual(resolveValidLenderId('1'), '1');
assert.strictEqual(resolveValidLenderId('Aditya Birla Capital'), '1');
assert.strictEqual(resolveValidLenderId('Bajaj Finserv Direct'), '2');
assert.strictEqual(resolveValidLenderId('Tata Capital Finance'), '3');
assert.strictEqual(resolveValidLenderId('L&T Finance Holding'), '4');
assert.strictEqual(resolveValidLenderId('Pending Selection'), null);
assert.strictEqual(resolveValidLenderId('FakeLenderName'), null);
console.log('✓ TEST 4 PASSED!');

console.log('\n--- TEST 5: GET /loan-applications/all Mapping ---');
const sampleBackendItem = {
  id: 'test-uuid-1234',
  displayId: 'PIM-260930-1234',
  applicantName: 'Shalini Gupta',
  phone: '9876543210',
  email: 'shalini@example.com',
  amount: 75000,
  tenureMonths: 24,
  purpose: 'Personal Loan',
  monthlyIncome: 65000,
  cibilScore: 780,
  status: 'FRESH',
  employmentType: 'Salaried',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  utmSource: 'google_ads',
  leadSource: 'campaign',
  selectedLenderId: '2',
  lenderApplicationId: 'BAJAJ-778899',
  panVerificationStatus: 'VERIFIED',
  kycStatus: 'VERIFIED',
  companyName: 'Infosys Ltd',
  salaryMode: 'Bank',
  dob: '1995-05-15T00:00:00.000Z',
  gender: 'Female',
  haveCreditCard: true,
  creditCardLimit: 250000,
  panMasked: 'XY*****9Z',
  createdAt: '2026-09-30T07:30:00.000Z',
  updatedAt: '2026-09-30T07:30:00.000Z'
};

const mapped = mapBackendLead(sampleBackendItem);
console.log('Mapped Backend Lead:', JSON.stringify(mapped, null, 2));
assert.strictEqual(mapped.id, 'test-uuid-1234');
assert.strictEqual(mapped.displayId, 'PIM-260930-1234');
assert.strictEqual(mapped.applicantName, 'Shalini Gupta');
assert.strictEqual(mapped.phone, '9876543210');
assert.strictEqual(mapped.amount, 75000);
assert.strictEqual(mapped.monthlyIncome, 65000);
assert.strictEqual(mapped.cibilScore, 780);
assert.strictEqual(mapped.status, 'FRESH');
assert.strictEqual(mapped.employmentType, 'Salaried');
assert.strictEqual(mapped.city, 'Mumbai');
assert.strictEqual(mapped.state, 'Maharashtra');
assert.strictEqual(mapped.pincode, '400001');
assert.strictEqual(mapped.selectedLenderId, '2');
assert.strictEqual(mapped.assignedCompany, 'Bajaj Finserv Direct');
assert.strictEqual(mapped.lenderApplicationId, 'BAJAJ-778899');
assert.strictEqual(mapped.companyName, 'Infosys Ltd');
assert.strictEqual(mapped.salaryMode, 'Bank');
assert.strictEqual(mapped.dob, '1995-05-15');
assert.strictEqual(mapped.gender, 'Female');
assert.strictEqual(mapped.haveCreditCard, 'Yes');
assert.strictEqual(mapped.haveCreditCardBool, true);
assert.strictEqual(mapped.creditCardLimit, 250000);
assert.strictEqual(mapped.panMasked, 'XY*****9Z');
assert.strictEqual(mapped.pan, 'XY*****9Z');
console.log('✓ TEST 5 PASSED!');

console.log('\nALL 5 LOCAL UNIT TESTS PASSED SUCCESSFULLY! 🎯');
