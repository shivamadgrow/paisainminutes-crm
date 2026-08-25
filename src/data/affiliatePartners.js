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
  },
  {
    id: 'adgrow',
    name: 'Adgrow',
    code: 'ADGROW',
    tagline: 'Growth Capital & Flexible Personal Finance',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pillClass: 'bg-emerald-600 text-white',
    accentColor: '#059669',
    accentBg: 'bg-emerald-50',
    gradient: 'from-emerald-600 to-teal-700',
    minCibil: 650,
    minSalary: 20000,
    maxLoan: 1000000,
    description: 'High ticket size loans & flexible underwriting for salaried and business owners.',
    website: 'https://adgrow.in',
    commissionRate: '2.8% per disbursal'
  },
  {
    id: 'agdm',
    name: 'AGDM',
    code: 'AGDM',
    tagline: 'Direct Market Lending & Salary Advance Solutions',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    pillClass: 'bg-blue-600 text-white',
    accentColor: '#2563EB',
    accentBg: 'bg-blue-50',
    gradient: 'from-blue-600 to-cyan-700',
    minCibil: 600,
    minSalary: 15000,
    maxLoan: 300000,
    description: 'Specialized in quick salary advances and near-prime applicants across Tier 1 to Tier 3.',
    website: 'https://agdm.in',
    commissionRate: '3.0% per disbursal'
  },
  {
    id: 'rupaysure',
    name: 'Rupaysure',
    code: 'RUPAYSURE',
    tagline: 'Assured Personal & Emergency Credit Line',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    pillClass: 'bg-amber-600 text-white',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    gradient: 'from-amber-600 to-orange-700',
    minCibil: 680,
    minSalary: 18000,
    maxLoan: 750000,
    description: 'Instant credit line & emergency cash assistance with paperless verification.',
    website: 'https://rupaysure.com',
    commissionRate: '2.7% per disbursal'
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
  if (!lead) return { partner: 'AGDM', eligibilityStatus: 'Eligible' };
  const cibilStr = String(lead.cibil || '').toLowerCase();
  const salary = cleanSalary(lead.salary || lead.monthlySalary || lead.monthly_salary, lead.sal_val, lead.salary_range);
  const amount = cleanLoanAmount(lead.loanAmount || lead.applied || lead.loan_amount || lead.amount);

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

  // High CIBIL & prime salary -> Rupay91
  if (cibilNum >= 720 || salary >= 40000) {
    return {
      partner: 'Rupay91',
      eligibilityStatus: 'High Approval'
    };
  }

  // Large ticket or business profile -> Adgrow
  if (amount >= 200000 || (salary >= 25000 && cibilNum >= 650)) {
    return {
      partner: 'Adgrow',
      eligibilityStatus: 'Pre-Approved'
    };
  }

  // Standard prime / Assured emergency -> Rupaysure
  if (cibilNum >= 670 || salary >= 20000) {
    return {
      partner: 'Rupaysure',
      eligibilityStatus: 'Eligible'
    };
  }

  // Standard salary advance / entry level -> AGDM
  return {
    partner: 'AGDM',
    eligibilityStatus: 'Eligible'
  };
}
