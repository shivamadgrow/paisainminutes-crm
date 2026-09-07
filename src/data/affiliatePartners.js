// Affiliate Lending Partners & Companies Configuration for Paisa in Minutes CRM

export const AFFILIATE_PARTNERS = [
  {
    id: 'rupay91',
    name: 'Rupay91',
    code: 'RUPAY91',
    tagline: 'Instant Digital Credit & Quick Personal Loans',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    pillClass: 'bg-indigo-600 text-white',
    accentColor: '#4F46E5',
    accentBg: 'bg-indigo-50',
    gradient: 'from-indigo-600 to-violet-700',
    minCibil: 700,
    minSalary: 25000,
    maxLoan: 500000,
    description: 'Fast digital approvals for prime & salaried applicants with CIBIL >= 700.',
    website: 'https://rupay91.com',
    commissionRate: '2.5% - 3.2% per disbursal'
  }
];

// Helper to find partner metadata by name or id
export function getPartnerMeta(partnerNameOrId) {
  if (!partnerNameOrId || partnerNameOrId === '—' || partnerNameOrId === 'Unassigned') {
    return {
      id: 'unassigned',
      name: 'Unassigned',
      code: 'NONE',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      pillClass: 'bg-slate-500 text-white',
      accentColor: '#64748B',
      accentBg: 'bg-slate-50',
      gradient: 'from-slate-600 to-slate-700'
    };
  }

  const clean = partnerNameOrId.toString().toLowerCase().replace(/[\s\-_]/g, '');
  const found = AFFILIATE_PARTNERS.find(p => 
    p.id.toLowerCase() === clean || 
    p.name.toLowerCase().replace(/[\s\-_]/g, '') === clean ||
    p.code.toLowerCase() === clean
  );

  if (found) return found;

  // Custom or unknown partner
  return {
    id: clean,
    name: partnerNameOrId,
    code: partnerNameOrId.toUpperCase().slice(0, 8),
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    pillClass: 'bg-purple-600 text-white',
    accentColor: '#7C3AED',
    accentBg: 'bg-purple-50',
    gradient: 'from-purple-600 to-indigo-700'
  };
}

import { cleanLoanAmount, cleanSalary } from '../utils/amountHelpers';

// Smart Auto-assignment rule engine based on eligibility factors
export function recommendPartner(lead) {
  if (!lead) return { partner: 'Rupay91', eligibilityStatus: 'Eligible' };
  const cibilStr = String(lead.cibil || '').toLowerCase();
  const salary = cleanSalary(lead.salary || lead.monthlySalary || lead.monthly_salary, lead.sal_val, lead.salary_range);

  // Extract numeric CIBIL score if present
  let cibilNum = 0;
  const matches = cibilStr.match(/\d{3}/);
  if (matches) {
    cibilNum = parseInt(matches[0], 10);
  } else if (cibilStr.includes('750') || cibilStr.includes('excellent')) {
    cibilNum = 780;
  } else if (cibilStr.includes('700') || cibilStr.includes('good')) {
    cibilNum = 720;
  } else if (cibilStr.includes('650') || cibilStr.includes('average')) {
    cibilNum = 660;
  } else if (cibilStr.includes('600') || cibilStr.includes('poor')) {
    cibilNum = 610;
  }

  return {
    partner: 'Rupay91',
    eligibilityStatus: (cibilNum >= 700 || salary >= 30000) ? 'High Approval' : 'Eligible'
  };
}
