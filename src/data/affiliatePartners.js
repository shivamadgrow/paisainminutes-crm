// Affiliate Lending Partners & Companies Configuration for Paisa in Minutes CRM
import { cleanLoanAmount, cleanSalary } from '../utils/amountHelpers';

export const AFFILIATE_PARTNERS = [
  {
    id: 'rupay91',
    name: 'Rupay91',
    code: 'RUPAY91',
    tagline: 'Instant Digital Credit (CIBIL 750+)',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    pillClass: 'bg-indigo-600 text-white',
    accentColor: '#4F46E5',
    accentBg: 'bg-indigo-50',
    gradient: 'from-indigo-600 to-violet-700',
    minCibil: 750,
    minSalary: 70000,
    maxLoan: 500000,
    description: 'Fast digital approvals for prime applicants with CIBIL >= 750 (Slabs 6, 7, 8).',
    website: 'https://rupay91.com',
    commissionRate: '2.5% - 3.2% per disbursal'
  },
  {
    id: 'jhatpatloans',
    name: 'Jhatpat Loans',
    code: 'JHATPAT',
    tagline: 'Quick Personal Loans (CIBIL < 750)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pillClass: 'bg-emerald-600 text-white',
    accentColor: '#059669',
    accentBg: 'bg-emerald-50',
    gradient: 'from-emerald-600 to-teal-700',
    minCibil: 500,
    minSalary: 20000,
    maxLoan: 300000,
    description: 'Flexible personal loans for applicants with CIBIL 500–749 (Slabs 1 to 5).',
    website: 'https://jhatpatloans.com',
    commissionRate: '2.0% - 2.8% per disbursal'
  }
];

// Helper to find partner metadata by name or id
export function getPartnerMeta(partnerNameOrId) {
  if (!partnerNameOrId || partnerNameOrId === '—' || partnerNameOrId === 'Unassigned' || partnerNameOrId === 'Pending Details') {
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
  if (clean.includes('rupay91') || clean.includes('rupay')) {
    return AFFILIATE_PARTNERS[0];
  }
  if (clean.includes('jhatpat')) {
    return AFFILIATE_PARTNERS[1];
  }

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

// Exact 8-Slab Matrix & Partner Rule engine
export function getEligibilityMatrix(lead) {
  if (!lead) {
    return {
      slab: 0,
      cibilRange: '—',
      salaryRange: '—',
      eligibilityStatus: 'Incomplete / Phone Only',
      partner: 'Pending Details'
    };
  }

  const cibilStr = String(lead.cibil || lead.cibilScore || lead.cibil_score || lead.cibil_range || '').trim();
  let cibilVal = 0;
  if (cibilStr && cibilStr !== '—') {
    if (/\b(850|8[5-9]\d|900)\b/.test(cibilStr)) cibilVal = 875;
    else if (/\b(800|8[0-4]\d)\b/.test(cibilStr)) cibilVal = 825;
    else if (/\b(750|7[5-9]\d)\b/.test(cibilStr)) cibilVal = 775;
    else if (/\b(700|7[0-4]\d)\b/.test(cibilStr)) cibilVal = 725;
    else if (/\b(650|6[5-9]\d)\b/.test(cibilStr)) cibilVal = 675;
    else if (/\b(600|6[0-4]\d)\b/.test(cibilStr)) cibilVal = 625;
    else if (/\b(550|5[5-9]\d)\b/.test(cibilStr)) cibilVal = 575;
    else if (/\b(500|5[0-4]\d)\b/.test(cibilStr)) cibilVal = 525;
    else {
      const match = cibilStr.match(/\d{3}/);
      if (match) cibilVal = parseInt(match[0], 10);
    }
  }

  const salNum = typeof lead.salary === 'number' && lead.salary > 0 
    ? lead.salary 
    : cleanSalary(lead.salary || lead.monthlySalary || lead.monthly_salary, lead.sal_val, lead.salary_range);

  let slab = 0;
  let cibilRange = '—';
  let salaryRange = 'Under ₹20,000';
  let eligibilityStatus = 'Eligible';
  let partner = 'Jhatpat Loans';

  if (cibilVal >= 850 || (cibilVal === 0 && salNum >= 90000)) {
    slab = 8;
    cibilRange = '850–900';
    salaryRange = '₹90,000+';
    eligibilityStatus = 'Eligible – Premium';
    partner = 'Rupay91';
  } else if (cibilVal >= 800 || (cibilVal === 0 && salNum >= 80000)) {
    slab = 7;
    cibilRange = '800–849';
    salaryRange = '₹80,000–₹89,999';
    eligibilityStatus = 'Eligible – Premium';
    partner = 'Rupay91';
  } else if (cibilVal >= 750 || (cibilVal === 0 && salNum >= 70000)) {
    slab = 6;
    cibilRange = '750–799';
    salaryRange = '₹70,000–₹79,999';
    eligibilityStatus = 'Eligible – Preferred';
    partner = 'Rupay91';
  } else if (cibilVal >= 700 || (cibilVal === 0 && salNum >= 60000)) {
    slab = 5;
    cibilRange = '700–749';
    salaryRange = '₹60,000–₹69,999';
    eligibilityStatus = 'Eligible – Good';
    partner = 'Jhatpat Loans';
  } else if (cibilVal >= 650 || (cibilVal === 0 && salNum >= 50000)) {
    slab = 4;
    cibilRange = '650–699';
    salaryRange = '₹50,000–₹59,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (cibilVal >= 600 || (cibilVal === 0 && salNum >= 40000)) {
    slab = 3;
    cibilRange = '600–649';
    salaryRange = '₹40,000–₹49,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (cibilVal >= 550 || (cibilVal === 0 && salNum >= 30000)) {
    slab = 2;
    cibilRange = '550–599';
    salaryRange = '₹30,000–₹39,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (cibilVal >= 500 || (cibilVal === 0 && salNum >= 20000)) {
    slab = 1;
    cibilRange = '500–549';
    salaryRange = '₹20,000–₹29,999';
    eligibilityStatus = 'Eligible – Base';
    partner = 'Jhatpat Loans';
  } else {
    slab = 0;
    cibilRange = (cibilStr && cibilStr !== '—') ? cibilStr : '—';
    salaryRange = 'Under ₹20,000';
    eligibilityStatus = (cibilVal === 0 && salNum === 0) ? 'Incomplete / Phone Only' : 'Below Minimum Threshold';
    partner = (cibilVal === 0 && salNum === 0) ? 'Pending Details' : 'Jhatpat Loans';
  }

  // Exact routing rule: 750+ CIBIL -> Rupay91, below 750 -> Jhatpat Loans
  if (cibilVal >= 750) {
    partner = 'Rupay91';
  } else if (cibilVal > 0) {
    partner = 'Jhatpat Loans';
  }

  return {
    slab,
    cibilRange,
    salaryRange,
    eligibilityStatus,
    partner
  };
}

export function recommendPartner(lead) {
  const result = getEligibilityMatrix(lead);
  return {
    partner: result.partner,
    eligibilityStatus: result.eligibilityStatus
  };
}
