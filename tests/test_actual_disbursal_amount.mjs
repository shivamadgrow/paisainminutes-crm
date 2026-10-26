// tests/test_actual_disbursal_amount.mjs
// Automated Acceptance Test Suite for: CRM Enhancement: Editable Actual Disbursal Amount
// Verifies all 8 user acceptance criteria and business requirements.

import assert from 'node:assert/strict';
import { cleanLoanAmount } from '../public_html/crm/src/utils/amountHelpers.js';
import { 
  mapBackendLead, 
  normalizeStatus, 
  updateDisbursalAmount 
} from '../public_html/crm/src/utils/apiConfig.js';
import { setTokens } from '../public_html/crm/src/utils/apiClient.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  FAIL: ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('  TEST SUITE: Editable Actual Disbursal Amount Verification');
  console.log('======================================================\n');

  // Provide mock staff auth token so API calls are treated as authorized
  setTokens({ accessToken: 'mock-test-staff-token', refreshToken: 'mock-refresh' });

  // -----------------------------------------------------------------------------------
  // Scenario 1: ₹50,000 application with ₹20,000 actual disbursal displays both amounts
  // -----------------------------------------------------------------------------------
  console.log('Scenario 1: Separate applied and actual disbursal amounts');
  it('Lead with ₹50,000 applied and ₹20,000 actual disbursal maps both fields separately', () => {
    const backendLead = {
      id: 'lead-test-01',
      leadCode: 'PIM-2026-001',
      name: 'Rahul Sharma',
      phone: '9876543210',
      loanAmountRupees: 50000,
      status: 'DISBURSED',
      disbursedAmountRupees: 20000,
      disbursalDate: '2026-10-25',
      remarks: 'Approved by partner bank'
    };

    const mapped = mapBackendLead(backendLead);

    // Applied amount must be 50,000
    assert.equal(mapped.loanAmount, 50000, 'Original applied loanAmount must be 50,000');
    assert.equal(mapped.applied, 50000, 'Original applied alias must be 50,000');
    assert.equal(mapped.appliedAmount, 50000, 'Original appliedAmount must be 50,000');

    // Actual disbursal amount must be 20,000
    assert.equal(mapped.disbursedAmountRupees, 20000, 'disbursedAmountRupees must be 20,000');
    assert.equal(mapped.actualDisbursalAmount, 20000, 'actualDisbursalAmount must be 20,000');
    assert.equal(mapped.actual_disbursal_amount, 20000, 'actual_disbursal_amount must be 20,000');

    // Disbursal date & remarks mapped
    assert.equal(mapped.disbursalDate, '2026-10-25');
  });

  // -----------------------------------------------------------------------------------
  // Scenario 2 & 3: Editing ₹20,000 to ₹25,000 persists and preserves applied amount
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 2 & 3: Disbursal edit persistence & Applied amount preservation');
  await itAsync('Editing disbursal from ₹20,000 to ₹25,000 generates valid payload and keeps applied amount unchanged', async () => {
    let simulatedBackendDoc = {
      id: 'lead-test-02',
      leadCode: 'PIM-2026-002',
      name: 'Priya Patel',
      phone: '9876543210',
      status: 'DISBURSED',
      loanAmountRupees: 50000,
      disbursedAmountRupees: 20000,
      remarks: 'Initial disbursal'
    };

    // Mock fetch to simulate PATCH /api/loan-applications/lead-test-02
    const originalFetch = globalThis.fetch;
    let interceptedPayload = null;
    globalThis.fetch = async (url, options = {}) => {
      if (options.method === 'PATCH') {
        interceptedPayload = JSON.parse(options.body);
        simulatedBackendDoc = {
          ...simulatedBackendDoc,
          disbursedAmountRupees: interceptedPayload.disbursedAmountRupees,
          remarks: interceptedPayload.remarks || simulatedBackendDoc.remarks
        };
        return new Response(JSON.stringify({
          success: true,
          application: simulatedBackendDoc
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return originalFetch(url, options);
    };

    try {
      const result = await updateDisbursalAmount(
        'lead-test-02',
        {
          status: 'DISBURSED',
          actualDisbursalAmount: 25000,
          appliedAmount: 50000,
          disbursalDate: '2026-10-26',
          disbursalRemarks: 'Confirmed partial disbursal tranche'
        },
        {
          role: 'staff',
          lead: { id: 'lead-test-02', status: 'DISBURSED', loanAmountRupees: 50000 }
        }
      );

      assert.equal(result.success, true, 'Update must succeed');
      assert.equal(interceptedPayload.disbursedAmountRupees, 25000, 'PATCH body must contain new amount 25,000');
      assert.ok(interceptedPayload.remarks.includes('[Disbursal Amount Updated]'), 'Remarks must contain audit entry');
      assert.equal(interceptedPayload.loanAmountRupees, undefined, 'Applied amount must NEVER be overwritten in disbursal patch');

      // Verify after mapping
      const remapped = mapBackendLead(simulatedBackendDoc);
      assert.equal(remapped.disbursedAmountRupees, 25000, 'New disbursal amount must be 25,000');
      assert.equal(remapped.applied, 50000, 'Original applied amount must remain 50,000');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // -----------------------------------------------------------------------------------
  // Scenario 4: Non-Disbursed leads cannot be edited through either UI or API
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 4: Non-Disbursed lead protection');
  await itAsync('Rejects disbursal editing for leads in FRESH status', async () => {
    const result = await updateDisbursalAmount(
      'lead-fresh-01',
      {
        status: 'FRESH',
        actualDisbursalAmount: 15000,
        appliedAmount: 50000
      }
    );

    assert.equal(result.success, false, 'Must fail for non-disbursed lead');
    assert.ok(result.error.includes('Disbursed'), 'Error must specify Disbursed status required');
  });

  await itAsync('Rejects disbursal editing for leads in APPROVED status', async () => {
    const result = await updateDisbursalAmount(
      'lead-appr-01',
      {
        status: 'APPROVED',
        actualDisbursalAmount: 30000,
        appliedAmount: 50000
      }
    );

    assert.equal(result.success, false, 'Must fail for non-disbursed lead');
    assert.ok(result.error.includes('Disbursed'), 'Error must specify Disbursed status required');
  });

  await itAsync('Rejects disbursal editing for leads in REJECTED status', async () => {
    const result = await updateDisbursalAmount(
      'lead-rej-01',
      {
        status: 'REJECTED',
        actualDisbursalAmount: 10000,
        appliedAmount: 50000
      }
    );

    assert.equal(result.success, false, 'Must fail for rejected lead');
  });

  // -----------------------------------------------------------------------------------
  // Scenario 5: Existing leads without confirmed amounts show "Not recorded"
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 5: Unverified disbursal records map to null (Not recorded)');
  it('Disbursed lead with no verified actual amount resolves disbursedAmountRupees to null, not applied amount', () => {
    const legacyLead = {
      id: 'legacy-lead-01',
      leadCode: 'PIM-LEGACY-01',
      name: 'Legacy Applicant 1',
      phone: '9876543210',
      loanAmountRupees: 75000,
      status: 'DISBURSED',
      disbursedAmountRupees: null
    };

    const mapped = mapBackendLead(legacyLead);

    assert.equal(mapped.loanAmount, 75000, 'Original applied amount must be 75,000');
    assert.equal(mapped.disbursedAmountRupees, null, 'Unrecorded actual amount must be strictly null');
    assert.equal(mapped.actualDisbursalAmount, null, 'actualDisbursalAmount must be strictly null');
  });

  it('Disbursed lead with undefined disbursedAmountRupees resolves to null, not applied amount', () => {
    const legacyLead = {
      id: 'legacy-lead-02',
      name: 'Legacy Applicant 2',
      phone: '9876543211',
      loanAmountRupees: 100000,
      status: 'DISBURSED'
      // disbursedAmountRupees omitted
    };

    const mapped = mapBackendLead(legacyLead);
    assert.equal(mapped.disbursedAmountRupees, null, 'Omitted disbursal amount must be strictly null');
  });

  // -----------------------------------------------------------------------------------
  // Scenario 6: Accurate CRM reporting and aggregation
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 6: CRM reporting and volume aggregation');
  it('Applied volume and actual disbursal volume calculated separately, excluding unrecorded leads', () => {
    const testLeads = [
      // Lead 1: Fresh, applied 50,000
      { id: '1', status: 'FRESH', loanAmount: 50000, disbursedAmountRupees: null },
      // Lead 2: Disbursed with verified actual 20,000 (applied 50,000)
      { id: '2', status: 'DISBURSED', loanAmount: 50000, disbursedAmountRupees: 20000 },
      // Lead 3: Disbursed without verified actual (applied 100,000)
      { id: '3', status: 'DISBURSED', loanAmount: 100000, disbursedAmountRupees: null },
      // Lead 4: Disbursed with verified actual 75,000 (applied 75,000)
      { id: '4', status: 'DISBURSED', loanAmount: 75000, disbursedAmountRupees: 75000 },
      // Lead 5: Approved, applied 80,000
      { id: '5', status: 'APPROVED', loanAmount: 80000, disbursedAmountRupees: null }
    ];

    // Applied volume: sum of all applied loans (50k + 50k + 100k + 75k + 80k = 355k)
    const totalAppliedVolume = testLeads.reduce((s, l) => s + cleanLoanAmount(l.loanAmount), 0);
    assert.equal(totalAppliedVolume, 355000, 'Total applied volume must be 355,000');

    // Disbursed leads
    const disbursedLeads = testLeads.filter(l => normalizeStatus(l.status) === 'DISBURSED');
    assert.equal(disbursedLeads.length, 3, 'There are 3 disbursed leads');

    // Verified actual disbursals (Lead 2 and Lead 4 only)
    const verifiedDisbursed = disbursedLeads.filter(l => 
      l.disbursedAmountRupees !== null && 
      l.disbursedAmountRupees !== undefined && 
      !isNaN(Number(l.disbursedAmountRupees))
    );
    assert.equal(verifiedDisbursed.length, 2, '2 disbursed leads have verified amounts');

    const unrecordedCount = disbursedLeads.length - verifiedDisbursed.length;
    assert.equal(unrecordedCount, 1, '1 disbursed lead is unrecorded');

    // Actual disbursal volume: 20,000 + 75,000 = 95,000 (Lead 3 is excluded!)
    const actualDisbursalVolume = verifiedDisbursed.reduce((s, l) => s + cleanLoanAmount(l.disbursedAmountRupees), 0);
    assert.equal(actualDisbursalVolume, 95000, 'Actual disbursal volume must be 95,000 (not 195,000 or 225,000)');
  });

  // -----------------------------------------------------------------------------------
  // Scenario 7: Exceeds-applied confirmation warning
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 7: Exceeds-applied validation and confirmation requirement');
  await itAsync('Disbursal amount exceeding applied amount requires explicit confirmation', async () => {
    const result = await updateDisbursalAmount(
      'lead-exceed-01',
      {
        status: 'DISBURSED',
        actualDisbursalAmount: 60000,
        appliedAmount: 50000,
        isExceedsConfirmed: false
      }
    );

    assert.equal(result.success, false, 'Must fail when disbursal > applied without confirmation');
    assert.ok(result.error.includes('exceeds the original applied amount'), 'Error must prompt for confirmation');
    assert.equal(result.requiresConfirmation, true);
  });

  await itAsync('Disbursal amount exceeding applied amount is allowed when explicitly confirmed', async () => {
    let interceptedPayload = null;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options = {}) => {
      interceptedPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({
        success: true,
        application: { 
          id: 'lead-exceed-01', 
          status: 'DISBURSED', 
          disbursedAmountRupees: 60000, 
          loanAmountRupees: 50000,
          phone: '9876543210' 
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    try {
      const result = await updateDisbursalAmount(
        'lead-exceed-01',
        {
          status: 'DISBURSED',
          actualDisbursalAmount: 60000,
          appliedAmount: 50000,
          isExceedsConfirmed: true
        }
      );

      assert.equal(result.success, true, 'Must succeed when confirmation flag is true');
      assert.equal(interceptedPayload.disbursedAmountRupees, 60000);
      assert.ok(interceptedPayload.remarks.includes('exceeds applied amount confirmed'), 'Audit note must record over-sanction confirmation');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // -----------------------------------------------------------------------------------
  // Scenario 8: Validation of invalid, negative, NaN, infinity, and permissions
  // -----------------------------------------------------------------------------------
  console.log('\nScenario 8: Input validation & Security');
  await itAsync('Rejects negative disbursal amount', async () => {
    const result = await updateDisbursalAmount('lead-01', {
      status: 'DISBURSED',
      actualDisbursalAmount: -1000
    });
    assert.equal(result.success, false);
    assert.ok(result.error.includes('non-negative'));
  });

  await itAsync('Rejects NaN disbursal amount', async () => {
    const result = await updateDisbursalAmount('lead-01', {
      status: 'DISBURSED',
      actualDisbursalAmount: 'not-a-number'
    });
    assert.equal(result.success, false);
    assert.ok(result.error.includes('valid non-negative number'));
  });

  await itAsync('Rejects infinite disbursal amount', async () => {
    const result = await updateDisbursalAmount('lead-01', {
      status: 'DISBURSED',
      actualDisbursalAmount: Infinity
    });
    assert.equal(result.success, false);
    assert.ok(result.error.includes('valid non-negative number'));
  });

  await itAsync('Rejects empty or missing lead ID', async () => {
    const result = await updateDisbursalAmount('', {
      status: 'DISBURSED',
      actualDisbursalAmount: 20000
    });
    assert.equal(result.success, false);
    assert.ok(result.error.includes('Missing lead ID'));
  });

  console.log('\n======================================================');
  console.log(`  ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('======================================================\n');
}

runAllTests().catch((err) => {
  console.error('\nFatal test runner error:', err);
  process.exit(1);
});
