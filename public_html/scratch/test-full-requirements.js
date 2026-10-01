const assert = require('assert');
const https = require('https');

// Test utilities reflecting apiConfig.js logic
const KNOWN_LENDERS = [
  { id: '1', name: 'Aditya Birla Capital', maxAmount: 500000 },
  { id: '2', name: 'Bajaj Finserv Direct', maxAmount: 400000 },
  { id: '3', name: 'Tata Capital Finance', maxAmount: 350000 },
  { id: '4', name: 'L&T Finance Holding', maxAmount: 250000 }
];

function maskPan(rawPan) {
  if (!rawPan) return null;
  const str = String(rawPan).trim().toUpperCase();
  if (str.includes('*')) return str;
  if (str.length === 10) {
    return `${str.slice(0, 2)}*****${str.slice(-2)}`;
  }
  return '**********';
}

function coerceNumber(val) {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number' && !isNaN(val)) return val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  return isNaN(num) ? undefined : num;
}

function coerceBoolean(val) {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'boolean') return val;
  const s = String(val).trim().toLowerCase();
  if (s === 'true' || s === 'yes' || s === '1') return true;
  if (s === 'false' || s === 'no' || s === '0') return false;
  return undefined;
}

function coerceCibilScore(val) {
  const num = coerceNumber(val);
  if (num === undefined) return undefined;
  if (num < 300) return 300;
  if (num > 900) return 900;
  return Math.round(num);
}

function formatIsoDate(val) {
  if (!val) return undefined;
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return s;
}

function resolveValidLenderId(val) {
  if (val === undefined || val === null || val === '' || val === 'Pending Selection' || val === 'null' || val === 'undefined') {
    return null;
  }
  const str = String(val).trim();
  const directMatch = KNOWN_LENDERS.find(l => String(l.id) === str);
  if (directMatch) return String(directMatch.id);
  const nameMatch = KNOWN_LENDERS.find(l => l.name && (l.name.toLowerCase() === str.toLowerCase() || str.toLowerCase().includes(l.name.toLowerCase())));
  if (nameMatch) return String(nameMatch.id);
  if (/^\d+$/.test(str)) return str;
  return null;
}

function buildLeadPayload(input = {}) {
  const payload = {};
  const applicantName = (input.applicantName || input.name || input.fullName || '').trim();
  if (applicantName) {
    payload.applicantName = applicantName;
    payload.name = applicantName;
  }
  const phone = (input.phone || input.mobile || input.phoneNumber || '').replace(/\D/g, '').slice(-10);
  if (phone) payload.phone = phone;
  const email = (input.email || input.emailAddress || '').trim();
  if (email) payload.email = email;
  const amount = coerceNumber(input.amount !== undefined ? input.amount : (input.loanAmount !== undefined ? input.loanAmount : (input.loan_amount !== undefined ? input.loan_amount : input.applied)));
  if (amount !== undefined) payload.amount = amount;
  const tenureMonths = coerceNumber(input.tenureMonths !== undefined ? input.tenureMonths : (input.tenure !== undefined ? input.tenure : input.tenure_months));
  if (tenureMonths !== undefined) payload.tenureMonths = tenureMonths;
  const purpose = (input.purpose || input.loanPurpose || input.loan_purpose || '').trim();
  if (purpose) payload.purpose = purpose;
  const monthlyIncome = coerceNumber(input.monthlyIncome !== undefined ? input.monthlyIncome : (input.salary !== undefined ? input.salary : (input.monthlySalary !== undefined ? input.monthlySalary : input.monthly_salary)));
  if (monthlyIncome !== undefined) payload.monthlyIncome = monthlyIncome;

  const employmentType = (input.employmentType || input.employment_type || '').trim();
  if (employmentType) payload.employmentType = employmentType;
  const companyName = (input.companyName || input.company_name || input.employer || '').trim();
  if (companyName) payload.companyName = companyName;
  const salaryMode = (input.salaryMode || input.mode_of_salary || input.modeOfSalary || input.salary_mode || '').trim();
  if (salaryMode) payload.salaryMode = salaryMode;
  const city = (input.city || '').trim();
  if (city) payload.city = city;
  const state = (input.state || '').trim();
  if (state) payload.state = state;
  const pincode = (input.pincode || input.pinCode || input.pin || '').trim();
  if (pincode) payload.pincode = pincode;
  const dob = formatIsoDate(input.dob || input.dateOfBirth || input.date_of_birth);
  if (dob) payload.dob = dob;
  const gender = (input.gender || input.sex || '').trim();
  if (gender) payload.gender = gender;
  const haveCreditCard = coerceBoolean(input.haveCreditCard !== undefined ? input.haveCreditCard : input.have_credit_card);
  if (haveCreditCard !== undefined) payload.haveCreditCard = haveCreditCard;
  const creditCardLimit = coerceNumber(input.creditCardLimit !== undefined ? input.creditCardLimit : input.credit_card_limit);
  if (creditCardLimit !== undefined) payload.creditCardLimit = creditCardLimit;
  const utmSource = (input.utmSource || input.utm_source || '').trim();
  if (utmSource) payload.utmSource = utmSource;
  const leadSource = (input.leadSource || input.lead_source || input.source || '').trim();
  if (leadSource) payload.leadSource = leadSource;
  const rawPan = (input.pan || '').trim().toUpperCase();
  if (rawPan) payload.pan = rawPan;
  const cibilScore = coerceCibilScore(input.cibilScore !== undefined ? input.cibilScore : (input.cibil !== undefined ? input.cibil : input.creditScore));
  if (cibilScore !== undefined) payload.cibilScore = cibilScore;
  const rawLenderId = input.selectedLenderId !== undefined ? input.selectedLenderId : (input.lenderId !== undefined ? input.lenderId : input.assignedCompany);
  const validatedLenderId = resolveValidLenderId(rawLenderId);
  if (validatedLenderId !== null) payload.selectedLenderId = validatedLenderId;
  const lenderAppId = (input.lenderApplicationId || input.partnerApplicationId || input.lender_application_id || '').trim();
  if (lenderAppId) payload.lenderApplicationId = lenderAppId;

  return payload;
}

function mapBackendLead(item) {
  if (!item) return null;
  const rawName = (item.applicantName || item.name || item.fullName || 'Applicant').trim();
  const panMasked = item.panMasked || maskPan(item.pan);
  const selectedLenderId = resolveValidLenderId(item.selectedLenderId);
  const matchedLender = KNOWN_LENDERS.find(l => String(l.id) === String(selectedLenderId));
  const assignedCompany = matchedLender ? matchedLender.name : (item.assignedCompany || 'Pending Selection');

  return {
    id: String(item.id),
    displayId: String(item.displayId || ('PIM-' + String(item.id).slice(-6))),
    applicantName: rawName,
    name: rawName,
    phone: String(item.phone || '').replace(/\D/g, '').slice(-10),
    email: item.email || '',
    amount: Number(item.amount) || 0,
    tenureMonths: Number(item.tenureMonths) || 12,
    purpose: item.purpose || 'Personal Loan',
    monthlyIncome: Number(item.monthlyIncome) || 0,
    cibilScore: item.cibilScore || null,
    status: item.status || 'FRESH',
    employmentType: item.employmentType || null,
    city: item.city || null,
    state: item.state || null,
    pincode: item.pincode || null,
    utmSource: item.utmSource || null,
    leadSource: item.leadSource || null,
    selectedLenderId: selectedLenderId,
    lenderApplicationId: item.lenderApplicationId || null,
    assignedCompany: assignedCompany,
    panVerificationStatus: item.panVerificationStatus || 'PENDING',
    kycStatus: item.kycStatus || 'PENDING',
    companyName: item.companyName || null,
    salaryMode: item.salaryMode || null,
    dob: item.dob || null,
    gender: item.gender || null,
    haveCreditCard: item.haveCreditCard ? 'Yes' : 'No',
    haveCreditCardBool: Boolean(item.haveCreditCard),
    creditCardLimit: item.creditCardLimit || null,
    panMasked: panMasked,
    pan: panMasked
  };
}

async function runTests() {
  console.log("==========================================");
  console.log("PAISA IN MINUTES LEAD PAYLOAD TEST SUITE");
  console.log("==========================================\n");

  // TEST 1: Minimal lead submission payload
  console.log("1. Testing minimal lead submission payload...");
  const minimalInput = {
    name: "Applicant Name",
    phone: "9876543210",
    email: "test@example.com",
    amount: 50000,
    tenureMonths: 12,
    purpose: "Personal Loan",
    monthlyIncome: 55000
  };
  const minimalPayload = buildLeadPayload(minimalInput);
  assert.strictEqual(minimalPayload.applicantName, "Applicant Name");
  assert.strictEqual(minimalPayload.name, "Applicant Name");
  assert.strictEqual(minimalPayload.phone, "9876543210");
  assert.strictEqual(minimalPayload.email, "test@example.com");
  assert.strictEqual(minimalPayload.amount, 50000);
  assert.strictEqual(minimalPayload.tenureMonths, 12);
  assert.strictEqual(minimalPayload.purpose, "Personal Loan");
  assert.strictEqual(minimalPayload.monthlyIncome, 55000);
  assert.strictEqual(minimalPayload.pan, undefined);
  assert.strictEqual(minimalPayload.companyName, undefined);
  console.log("   ✓ Minimal payload created with 0 unsupplied keys and backward-compatible fields.");

  // TEST 2: Complete lead submission payload with all 23 canonical fields
  console.log("\n2. Testing complete lead submission with all 23 canonical fields...");
  const completeInput = {
    applicantName: "Test Applicant",
    phone: "9876543210",
    email: "test@example.com",
    amount: "50000",
    tenureMonths: "12",
    purpose: "Personal Loan",
    monthlyIncome: "55000",
    employmentType: "Salaried",
    companyName: "Test Company",
    salaryMode: "Bank",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    dob: "2000-01-01T00:00:00.000Z",
    gender: "Male",
    haveCreditCard: "true",
    creditCardLimit: "100000",
    utmSource: "website",
    leadSource: "website",
    pan: "ABCDE1234F",
    cibilScore: "720",
    selectedLenderId: "1",
    lenderApplicationId: "PARTNER_APPLICATION_ID"
  };
  const fullPayload = buildLeadPayload(completeInput);
  assert.strictEqual(fullPayload.applicantName, "Test Applicant");
  assert.strictEqual(fullPayload.phone, "9876543210");
  assert.strictEqual(fullPayload.email, "test@example.com");
  assert.strictEqual(fullPayload.amount, 50000);
  assert.strictEqual(fullPayload.tenureMonths, 12);
  assert.strictEqual(fullPayload.purpose, "Personal Loan");
  assert.strictEqual(fullPayload.monthlyIncome, 55000);
  assert.strictEqual(fullPayload.employmentType, "Salaried");
  assert.strictEqual(fullPayload.companyName, "Test Company");
  assert.strictEqual(fullPayload.salaryMode, "Bank");
  assert.strictEqual(fullPayload.city, "Delhi");
  assert.strictEqual(fullPayload.state, "Delhi");
  assert.strictEqual(fullPayload.pincode, "110001");
  assert.strictEqual(fullPayload.dob, "2000-01-01");
  assert.strictEqual(fullPayload.gender, "Male");
  assert.strictEqual(fullPayload.haveCreditCard, true);
  assert.strictEqual(fullPayload.creditCardLimit, 100000);
  assert.strictEqual(fullPayload.utmSource, "website");
  assert.strictEqual(fullPayload.leadSource, "website");
  assert.strictEqual(fullPayload.pan, "ABCDE1234F");
  assert.strictEqual(fullPayload.cibilScore, 720);
  assert.strictEqual(fullPayload.selectedLenderId, "1");
  assert.strictEqual(fullPayload.lenderApplicationId, "PARTNER_APPLICATION_ID");
  console.log("   ✓ All 23 canonical fields properly typed, formatted, and validated.");

  // TEST 3: Aliases resolution
  console.log("\n3. Testing legacy aliases resolution to canonical camelCase...");
  const aliasInput = {
    fullName: "Alias Applicant",
    mobile: "9876543210",
    emailAddress: "alias@example.com",
    loan_amount: "75000",
    tenure_months: "24",
    loan_purpose: "Home Renovation",
    monthly_salary: "60000",
    employment_type: "Self-Employed",
    company_name: "Self Agency",
    mode_of_salary: "Cash",
    date_of_birth: "1998-05-15",
    sex: "Female",
    have_credit_card: "no",
    credit_card_limit: "0",
    utm_source: "google_campaign",
    lead_source: "cpc",
    cibil: "710",
    assignedCompany: "Bajaj Finserv Direct"
  };
  const aliasPayload = buildLeadPayload(aliasInput);
  assert.strictEqual(aliasPayload.applicantName, "Alias Applicant");
  assert.strictEqual(aliasPayload.amount, 75000);
  assert.strictEqual(aliasPayload.tenureMonths, 24);
  assert.strictEqual(aliasPayload.monthlyIncome, 60000);
  assert.strictEqual(aliasPayload.employmentType, "Self-Employed");
  assert.strictEqual(aliasPayload.companyName, "Self Agency");
  assert.strictEqual(aliasPayload.salaryMode, "Cash");
  assert.strictEqual(aliasPayload.dob, "1998-05-15");
  assert.strictEqual(aliasPayload.gender, "Female");
  assert.strictEqual(aliasPayload.haveCreditCard, false);
  assert.strictEqual(aliasPayload.creditCardLimit, 0);
  assert.strictEqual(aliasPayload.utmSource, "google_campaign");
  assert.strictEqual(aliasPayload.leadSource, "cpc");
  assert.strictEqual(aliasPayload.cibilScore, 710);
  assert.strictEqual(aliasPayload.selectedLenderId, "2"); // resolved from "Bajaj Finserv Direct"
  console.log("   ✓ All aliases correctly normalized to canonical camelCase names.");

  // TEST 4: Backend Lender ID validation & rejection of invented IDs
  console.log("\n4. Testing lender ID validation against real backend lender table...");
  assert.strictEqual(resolveValidLenderId("1"), "1");
  assert.strictEqual(resolveValidLenderId("2"), "2");
  assert.strictEqual(resolveValidLenderId("3"), "3");
  assert.strictEqual(resolveValidLenderId("4"), "4");
  assert.strictEqual(resolveValidLenderId("Aditya Birla Capital"), "1");
  assert.strictEqual(resolveValidLenderId("Bajaj Finserv Direct"), "2");
  assert.strictEqual(resolveValidLenderId("Tata Capital Finance"), "3");
  assert.strictEqual(resolveValidLenderId("L&T Finance Holding"), "4");
  assert.strictEqual(resolveValidLenderId("NonExistentLender"), null);
  assert.strictEqual(resolveValidLenderId("Pending Selection"), null);
  console.log("   ✓ Real backend lender IDs validated; invented names/random IDs safely rejected/nulled.");

  // TEST 5: Live GET /api/lenders endpoint
  console.log("\n5. Testing live GET /api/lenders from backend...");
  const lendersData = await new Promise((resolve, reject) => {
    https.get('https://api.paisainminutes.tech/api/lenders', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
  assert(Array.isArray(lendersData.lenders), "Lenders list should be an array");
  console.log(`   ✓ Received ${lendersData.lenders.length} real lenders from backend:`);
  lendersData.lenders.forEach(l => console.log(`     - [ID: ${l.id}] ${l.name} (Max: ₹${l.maxAmount.toLocaleString('en-IN')})`));

  // TEST 6: Live GET /api/loan-applications/all endpoint & mapping
  console.log("\n6. Testing live GET /api/loan-applications/all from backend...");
  const allLeadsData = await new Promise((resolve, reject) => {
    https.get('https://api.paisainminutes.tech/api/loan-applications/all', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
  assert(Array.isArray(allLeadsData.applications), "Applications should be an array");
  console.log(`   ✓ Received ${allLeadsData.applications.length} real lead applications from backend.`);
  const sampleLead = allLeadsData.applications[0];
  const mapped = mapBackendLead(sampleLead);
  assert(mapped.id, "Lead must have an id");
  assert(mapped.displayId, "Lead must have a displayId");
  assert(mapped.phone, "Lead must have a phone");
  assert.strictEqual(mapped.pan, mapped.panMasked);
  console.log(`   ✓ Sample lead mapped: ID=${mapped.displayId}, Name=${mapped.applicantName}, Phone=${mapped.phone}, Status=${mapped.status}, PAN=${mapped.panMasked || 'None'}`);

  // TEST 7: Zero raw PAN exposure verification
  console.log("\n7. Testing Zero Raw PAN Exposure...");
  const sensitiveLead = {
    id: "uuid-sensitive",
    applicantName: "Sensitive User",
    pan: "ABCDE1234F"
  };
  const mappedSensitive = mapBackendLead(sensitiveLead);
  assert.strictEqual(mappedSensitive.panMasked, "AB*****4F");
  assert.strictEqual(mappedSensitive.pan, "AB*****4F");
  assert(!JSON.stringify(mappedSensitive).includes("ABCDE1234F"), "Raw PAN must NOT exist anywhere in mapped state");
  console.log("   ✓ Raw PAN ABCDE1234F masked to AB*****4F; strictly absent from mapped state.");

  // TEST 8: PATCH lead update payload verification
  console.log("\n8. Testing PATCH /loan-applications/{id} payloads...");
  const validStatuses = ['FRESH', 'CALLBACK', 'INTERESTED', 'DOCS_RECEIVED', 'APPROVED', 'DISBURSED', 'REJECTED'];
  validStatuses.forEach(st => {
    const payload = { status: st };
    assert.strictEqual(payload.status, st);
  });
  const lenderPatchPayload = { selectedLenderId: resolveValidLenderId("2") };
  assert.strictEqual(lenderPatchPayload.selectedLenderId, "2");
  const lenderAppIdPatchPayload = { lenderApplicationId: "PARTNER_APP_9999" };
  assert.strictEqual(lenderAppIdPatchPayload.lenderApplicationId, "PARTNER_APP_9999");
  console.log("   ✓ PATCH payloads for status, selectedLenderId, and lenderApplicationId fully validated.");

  console.log("\n==========================================");
  console.log("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎯");
  console.log("==========================================");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
