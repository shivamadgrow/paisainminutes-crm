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
    commissionRate: '2.8%',
    commissionPct: 0.028,
    paymentStatus: 'Paid'
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
    commissionRate: '2.4%',
    commissionPct: 0.024,
    paymentStatus: 'Paid'
  },
  {
    id: 'instarupees',
    name: 'Insta Rupees',
    code: 'INSTARUPEES',
    tagline: 'Fast Cash Loans (CIBIL 550+)',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    pillClass: 'bg-amber-600 text-white',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    gradient: 'from-amber-600 to-orange-700',
    minCibil: 550,
    minSalary: 20000,
    maxLoan: 100000,
    description: 'Paperless instant sanction & high approval online credit line.',
    website: 'https://instarupees.com',
    commissionRate: '2.5%',
    commissionPct: 0.025,
    paymentStatus: 'Pending'
  },
  {
    id: 'udhaarnow',
    name: 'UdhaarNow',
    code: 'UDHAARNOW',
    tagline: 'Flexible Pre-Approved Credit (CIBIL 500+)',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    pillClass: 'bg-blue-600 text-white',
    accentColor: '#2563EB',
    accentBg: 'bg-blue-50',
    gradient: 'from-blue-600 to-cyan-700',
    minCibil: 500,
    minSalary: 20000,
    maxLoan: 100000,
    description: 'Instant pre-matched credit limit with minimal KYC required.',
    website: 'https://udhaarnow.com',
    commissionRate: '2.2%',
    commissionPct: 0.022,
    paymentStatus: 'Paid'
  },
  {
    id: 'loanwithin',
    name: 'LoanWithin',
    code: 'LOANWITHIN',
    tagline: 'Verified Partner Credit (CIBIL 550+)',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    pillClass: 'bg-teal-600 text-white',
    accentColor: '#0D9488',
    accentBg: 'bg-teal-50',
    gradient: 'from-teal-600 to-emerald-700',
    minCibil: 550,
    minSalary: 25000,
    maxLoan: 100000,
    description: 'Paperless fast-track disbursals with zero collateral needed.',
    website: 'https://loanwithin.com',
    commissionRate: '2.6%',
    commissionPct: 0.026,
    paymentStatus: 'Pending'
  },
  {
    id: 'shubhcash',
    name: 'ShubhCash',
    code: 'SHUBHCASH',
    tagline: 'Instant Credit (CIBIL 500+)',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    pillClass: 'bg-rose-600 text-white',
    accentColor: '#E11D48',
    accentBg: 'bg-rose-50',
    gradient: 'from-rose-600 to-pink-700',
    minCibil: 500,
    minSalary: 20000,
    maxLoan: 100000,
    description: '100% online application with direct bank credit on same day.',
    website: 'https://shubhcash.com',
    commissionRate: '2.3%',
    commissionPct: 0.023,
    paymentStatus: 'Paid'
  },
  {
    id: 'borrowera',
    name: 'Borrowera',
    code: 'BORROWERA',
    tagline: 'Speedy Digital Lending (CIBIL 600+)',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    pillClass: 'bg-purple-600 text-white',
    accentColor: '#9333EA',
    accentBg: 'bg-purple-50',
    gradient: 'from-purple-600 to-fuchsia-700',
    minCibil: 600,
    minSalary: 25000,
    maxLoan: 100000,
    description: 'Direct account credit in minutes with speedy digital verification.',
    website: 'https://borrowera.com',
    commissionRate: '2.7%',
    commissionPct: 0.027,
    paymentStatus: 'Pending'
  },
  {
    id: 'easyfincare',
    name: 'Easy Fincare',
    code: 'EASYFINCARE',
    tagline: 'Simplifying Finance (CIBIL 550+)',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    pillClass: 'bg-cyan-600 text-white',
    accentColor: '#0891B2',
    accentBg: 'bg-cyan-50',
    gradient: 'from-cyan-600 to-blue-700',
    minCibil: 550,
    minSalary: 20000,
    maxLoan: 100000,
    description: 'Fast personal loan process with minimal documentation.',
    website: 'https://easyfincare.com',
    commissionRate: '2.4%',
    commissionPct: 0.024,
    paymentStatus: 'Paid'
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
      gradient: 'from-slate-600 to-slate-700',
      commissionRate: '0%',
      commissionPct: 0,
      paymentStatus: 'Pending'
    };
  }

  const clean = partnerNameOrId.toString().toLowerCase().replace(/[\s\-_]/g, '');
  const found = AFFILIATE_PARTNERS.find(p => 
    p.id.toLowerCase() === clean || 
    p.name.toLowerCase().replace(/[\s\-_]/g, '') === clean ||
    p.code.toLowerCase() === clean ||
    clean.includes(p.id) ||
    clean.includes(p.name.toLowerCase().replace(/[\s\-_]/g, ''))
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
    gradient: 'from-purple-600 to-indigo-700',
    commissionRate: '2.5%',
    commissionPct: 0.025,
    paymentStatus: 'Pending'
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
