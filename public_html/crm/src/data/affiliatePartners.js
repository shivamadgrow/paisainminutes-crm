import { cleanLoanAmount, cleanSalary } from '../utils/amountHelpers.js';
import { api, BACKEND_BASE } from '../utils/apiClient.js';

export const AFFILIATE_PARTNERS = [
  {
    id: 'rupay91',
    name: 'Rupay91',
    partnerName: 'Rupay 91',
    displayName: 'Rupay 91',
    code: 'RUPAY91',
    tagline: 'Instant Digital Credit (CIBIL 700+ & Salary ₹1,00,000+)',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    pillClass: 'bg-indigo-600 text-white',
    accentColor: '#4F46E5',
    accentBg: 'bg-indigo-50',
    gradient: 'from-indigo-600 to-violet-700',
    minCibil: 700,
    minSalary: 100000,
    maxLoan: 100000,
    interestRate: 'Up to 1% per day',
    tenure: '30 - 45 Days',
    description: 'Fast digital approvals for prime applicants with salary >= ₹1,00,000 and CIBIL >= 700.',
    website: 'https://rupay91.com',
    applyUrl: 'https://loans.rupay91.com/login',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  },
  {
    id: 'borrowera',
    name: 'Borrowera',
    partnerName: 'Borrowera',
    displayName: 'Borrowera',
    code: 'BORROWERA',
    tagline: 'Speedy Digital Lending',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    pillClass: 'bg-purple-600 text-white',
    accentColor: '#9333EA',
    accentBg: 'bg-purple-50',
    gradient: 'from-purple-600 to-fuchsia-700',
    minCibil: 600,
    minSalary: 45000,
    maxLoan: 100000,
    interestRate: 'Up to 1% per day',
    tenure: '30 - 45 Days',
    description: 'Direct account credit in minutes with speedy digital verification.',
    website: 'https://borrowera.com',
    applyUrl: 'https://www.borrowera.com/apply-loan?utm_source=paisainminutes&utm_medium=affiliate&utm_campaign=paisainminutes_crm&utm_term=borrowera_crm&sub_id=CRM&ref=paisainminutes&source=paisainminutes',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  },
  {
    id: 'instarupees',
    name: 'Insta Rupees',
    partnerName: 'Insta Rupees',
    displayName: 'Insta Rupees',
    code: 'INSTARUPEES',
    tagline: 'Fast Cash Loans',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    pillClass: 'bg-amber-600 text-white',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    gradient: 'from-amber-600 to-orange-700',
    minCibil: 550,
    minSalary: 40000,
    maxLoan: 100000,
    interestRate: 'Up to 1% per day',
    tenure: '30 - 45 Days',
    description: 'Paperless instant sanction & high approval online credit line.',
    website: 'https://instarupees.com',
    applyUrl: 'https://www.instarupees.com/apply-loan?utm_source=paisainminutes&utm_medium=affiliate&utm_campaign=paisainminutes_crm&utm_term=instarupees_crm&sub_id=CRM&ref=paisainminutes&source=paisainminutes',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  },
  {
    id: 'jhatpatloans',
    name: 'Jhatpat Loans',
    partnerName: 'Jhatpat Loans',
    displayName: 'Jhatpat Loans',
    code: 'JHATPAT',
    tagline: 'Quick Personal Loans',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pillClass: 'bg-emerald-600 text-white',
    accentColor: '#059669',
    accentBg: 'bg-emerald-50',
    gradient: 'from-emerald-600 to-teal-700',
    minCibil: 500,
    minSalary: 30000,
    maxLoan: 100000,
    interestRate: 'Up to 0.8% per day',
    tenure: '30 - 45 Days',
    description: 'Flexible personal loans for applicants with salary >= ₹30,000.',
    website: 'https://jhatpatloans.com',
    applyUrl: 'https://www.jhatpatloans.com/apply-loan?utm_source=paisainminutes&utm_medium=affiliate&utm_campaign=paisainminutes_crm&utm_term=jhatpatloans_crm&sub_id=CRM&ref=paisainminutes&source=paisainminutes',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  },
  {
    id: 'easyfincare',
    name: 'Easy Finca₹e',
    partnerName: 'Easy Finca₹e',
    displayName: 'Easy Finca₹e',
    code: 'EASYFINCARE',
    tagline: 'Simplifying Finance',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    pillClass: 'bg-cyan-600 text-white',
    accentColor: '#0891B2',
    accentBg: 'bg-cyan-50',
    gradient: 'from-cyan-600 to-blue-700',
    minCibil: 550,
    minSalary: 45000,
    maxLoan: 100000,
    interestRate: 'Up to 1% per day',
    tenure: '30 - 45 Days',
    description: 'Fast personal loan process with minimal documentation.',
    website: 'https://easyfincare.com',
    applyUrl: 'https://www.easyfincare.com/apply-now?utm_source=paisainminutes&utm_medium=affiliate&utm_campaign=paisainminutes_crm&utm_term=easyfincare_crm&sub_id=CRM&ref=paisainminutes&source=paisainminutes',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  },
  {
    id: 'moneydot',
    name: 'MoneyDot',
    partnerName: 'MoneyDot',
    displayName: 'MoneyDot',
    code: 'MONEYDOT',
    tagline: 'Personal Loan App',
    badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
    pillClass: 'bg-sky-600 text-white',
    accentColor: '#0284C7',
    accentBg: 'bg-sky-50',
    gradient: 'from-sky-600 to-blue-700',
    minCibil: 300,
    minSalary: 15000,
    maxLoan: 100000,
    interestRate: '24% – 60% per annum',
    tenure: '3 - 12 Months',
    description: 'Personal Loan App with flexible 3 to 12 months tenure up to ₹1,00,000.',
    website: 'https://www.moneydot.in',
    applyUrl: 'https://play.google.com/store/apps/details?id=com.yrs.moneydot&hl=en_IN',
    commissionRate: '6.0%',
    commissionPct: 0.06,
  }
];

export const INACTIVE_PARTNERS = [];

export const ALL_PARTNERS = [...AFFILIATE_PARTNERS, ...INACTIVE_PARTNERS];

const DEFAULT_PARTNER_STYLES = [
  { badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200', pillClass: 'bg-purple-600 text-white', accentColor: '#7C3AED', accentBg: 'bg-purple-50', gradient: 'from-purple-600 to-indigo-700' },
  { badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200', pillClass: 'bg-emerald-600 text-white', accentColor: '#059669', accentBg: 'bg-emerald-50', gradient: 'from-emerald-600 to-teal-700' },
  { badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200', pillClass: 'bg-amber-600 text-white', accentColor: '#D97706', accentBg: 'bg-amber-50', gradient: 'from-amber-600 to-orange-700' }
];

export const APPROVED_PARTNER_SLUGS = [
  'rupay91',
  'borrowera',
  'instarupees',
  'jhatpatloans',
  'easyfincare',
  'moneydot'
];

/**
 * Merges the partner records returned by the Node server (`GET /api/crm/partners`) into AFFILIATE_PARTNERS.
 * Strictly filters to the 6 approved partners to ensure old/unapproved partners are never added.
 */
export function syncPartnersFromServer(serverPartners) {
  if (!Array.isArray(serverPartners)) return AFFILIATE_PARTNERS;
  serverPartners.forEach((sp) => {
    const slug = String(sp.slug || '').toLowerCase();
    if (!slug || !APPROVED_PARTNER_SLUGS.includes(slug)) return;
    const rate = Number(sp.commissionRate);
    const rateFields = Number.isFinite(rate) ? { commissionRate: `${rate.toFixed(1)}%`, commissionPct: rate / 100 } : {};
    let existing = AFFILIATE_PARTNERS.find((p) => p.id === slug);
    if (existing) {
      const serverApplyUrl = (slug === 'rupay91' && sp.applyUrl && sp.applyUrl.includes('applynow.php'))
        ? 'https://loans.rupay91.com/login'
        : (sp.applyUrl || existing.applyUrl);
      Object.assign(existing, {
        serverId: sp.id,
        name: sp.name || existing.name,
        website: sp.website || existing.website,
        applyUrl: slug === 'rupay91' ? 'https://loans.rupay91.com/login' : serverApplyUrl,
        status: sp.status,
        ...rateFields
      });
    }
  });
  return AFFILIATE_PARTNERS;
}

/** Server id of a partner given its UI id (slug), or null when it is not known to the server. */
export function getServerPartnerId(slugOrId) {
  const key = String(slugOrId || '').toLowerCase();
  const found = AFFILIATE_PARTNERS.find((p) => p.id === key || p.serverId === slugOrId);
  return found && found.serverId ? found.serverId : null;
}

/** UI id (slug) for a server partner id. */
export function getPartnerSlugByServerId(serverId) {
  const found = AFFILIATE_PARTNERS.find((p) => p.serverId === serverId);
  return found ? found.id : null;
}

// Helper to find partner metadata by name or id
export function getPartnerMeta(partnerNameOrId) {
  if (typeof partnerNameOrId === 'object' && partnerNameOrId !== null) {
    if (partnerNameOrId.applyUrl && partnerNameOrId.id) return partnerNameOrId;
    partnerNameOrId = partnerNameOrId.name || partnerNameOrId.id || partnerNameOrId.slug || '';
  }

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
    };
  }

  const clean = partnerNameOrId.toString().toLowerCase().replace(/[\s\-_₹]/g, '');

  // Guard for permanently discontinued partner Ticket 2 Loan (preserves historical label without active URLs)
  if (clean.includes('ticket2loan') || clean.includes('ticket')) {
    return {
      id: 'ticket2loan',
      name: 'Ticket 2 Loan (Archived)',
      code: 'TICKET2LOAN',
      status: 'INACTIVE',
      disabled: true,
      tagline: 'Deactivated Partner',
      badgeClass: 'bg-slate-100 text-slate-500 border border-slate-200',
      pillClass: 'bg-slate-500 text-white',
      accentColor: '#64748B',
      accentBg: 'bg-slate-50',
      gradient: 'from-slate-500 to-slate-600',
      description: 'Permanently discontinued partner. Preserved for historical audit recordkeeping.',
      website: '',
      applyUrl: '#',
      commissionRate: '0.0%',
      commissionPct: 0
    };
  }

  const found = ALL_PARTNERS.find(p => 
    p.id.toLowerCase() === clean || 
    p.name.toLowerCase().replace(/[\s\-_₹]/g, '') === clean ||
    (p.code && p.code.toLowerCase() === clean) ||
    clean.includes(p.id) ||
    clean.includes(p.name.toLowerCase().replace(/[\s\-_₹]/g, ''))
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
    commissionRate: '6.0%',
    commissionPct: 0.06,
  };
}

/**
 * Extracts and validates a numerical CIBIL score from a lead or input.
 * Returns null if CIBIL is unavailable, null, unverified, or out of range [300, 900].
 */
export function extractCibilScore(lead) {
  if (!lead) return null;
  if (typeof lead === 'number') {
    return lead >= 300 && lead <= 900 ? lead : null;
  }
  if (typeof lead === 'string') {
    const s = lead.trim();
    if (!s || s === '—' || /not\s*available|fetching|pending|none|no\s*record/i.test(s)) return null;
    const m = s.match(/\b([3-8]\d{2}|900)\b/);
    if (m) {
      const v = parseInt(m[1], 10);
      return v >= 300 && v <= 900 ? v : null;
    }
    if (/^700\s*[-–—to]\s*749/i.test(s)) return 725;
    if (/^750\s*[-–—to]\s*799/i.test(s)) return 775;
    if (/^800\s*[-–—to]\s*849/i.test(s)) return 825;
    if (/^850\s*[-–—to]\s*900/i.test(s)) return 875;
    if (/^650\s*[-–—to]\s*699/i.test(s)) return 675;
    if (/^600\s*[-–—to]\s*649/i.test(s)) return 625;
    if (/^550\s*[-–—to]\s*599/i.test(s)) return 575;
    if (/^500\s*[-–—to]\s*549/i.test(s)) return 525;
    return null;
  }

  // Object lead
  const rawNum = lead.cibilScore !== undefined && lead.cibilScore !== null
    ? Number(lead.cibilScore)
    : (lead.cibil_score !== undefined && lead.cibil_score !== null ? Number(lead.cibil_score) : null);
  if (typeof rawNum === 'number' && !isNaN(rawNum) && rawNum >= 300 && rawNum <= 900) {
    return rawNum;
  }

  const rawCibil = lead.cibil ?? lead.cibilDisplay ?? lead.cibil_range ?? '';
  if (typeof rawCibil === 'number' && rawCibil >= 300 && rawCibil <= 900) {
    return rawCibil;
  }

  const str = String(rawCibil).trim();
  if (!str || str === '—' || /not\s*available|fetching|pending|none|no\s*record/i.test(str)) {
    return null;
  }
  const match = str.match(/\b([3-8]\d{2}|900)\b/);
  if (match) {
    const val = parseInt(match[1], 10);
    return val >= 300 && val <= 900 ? val : null;
  }

  if (/^700\s*[-–—to]\s*749/i.test(str)) return 725;
  if (/^750\s*[-–—to]\s*799/i.test(str)) return 775;
  if (/^800\s*[-–—to]\s*849/i.test(str)) return 825;
  if (/^850\s*[-–—to]\s*900/i.test(str)) return 875;
  if (/^650\s*[-–—to]\s*699/i.test(str)) return 675;
  if (/^600\s*[-–—to]\s*649/i.test(str)) return 625;
  if (/^550\s*[-–—to]\s*599/i.test(str)) return 575;
  if (/^500\s*[-–—to]\s*549/i.test(str)) return 525;

  return null;
}

/**
 * Extracts and validates monthly salary in rupees.
 * Rejects values > 500,000 as annual income or erroneous data.
 */
export function extractMonthlySalary(lead) {
  if (!lead) return 0;
  if (typeof lead === 'number') {
    return Number.isFinite(lead) && lead > 0 && lead <= 500000 ? lead : 0;
  }
  if (typeof lead === 'string') {
    return cleanSalary(lead);
  }
  const salNum = typeof lead.salary === 'number' && lead.salary > 0
    ? lead.salary
    : (typeof lead.monthlySalary === 'number' && lead.monthlySalary > 0
      ? lead.monthlySalary
      : cleanSalary(lead.salary || lead.monthlySalary || lead.monthly_salary || lead.monthlyIncome, lead.sal_val, lead.salary_range));

  return Number.isFinite(salNum) && salNum > 0 && salNum <= 500000 ? salNum : 0;
}

/**
 * Strictly verifies Rupay91 eligibility for a lead:
 * Rupay91 is ONLY eligible when BOTH conditions are satisfied:
 * 1. CIBIL score >= 700 (must be verified, valid, non-null)
 * 2. Monthly salary >= ₹1,00,000 (must represent monthly salary, not annual income)
 * Both conditions are mandatory.
 */
export function isRupay91Eligible(lead) {
  if (!lead) return false;

  // Unverified, pending or failed CIBIL statuses are strictly ineligible
  const cibilStatus = String(lead.cibilStatus || lead.cibil_status || '').toLowerCase().trim();
  if (cibilStatus && /timed\s*out|no\s*credit|no\s*record|failed|not\s*found|none|pending|fetching/i.test(cibilStatus)) {
    return false;
  }

  const cibil = extractCibilScore(lead);
  if (cibil === null || typeof cibil !== 'number' || cibil < 700) {
    return false;
  }

  const salary = extractMonthlySalary(lead);
  if (!salary || salary < 100000 || salary > 500000) {
    return false;
  }

  return true;
}

/**
 * Checks partner eligibility for a given lead.
 * Strictly applies the CIBIL >= 700 & Salary >= ₹1,00,000 rule for Rupay91.
 * All other partners follow their existing rules.
 */
export function isPartnerEligible(partnerOrSlug, lead) {
  const meta = getPartnerMeta(partnerOrSlug);
  if (!meta || meta.disabled || meta.status === 'INACTIVE') return false;
  const slug = meta.id;
  if (slug === 'rupay91') {
    return isRupay91Eligible(lead);
  }

  const sal = extractMonthlySalary(lead);
  const minSal = Number(meta.minSalary || 0);
  if (sal < minSal) return false;

  const cibil = extractCibilScore(lead);
  const minCibil = Number(meta.minCibil || 0);
  if (cibil !== null && cibil < minCibil) return false;

  return true;
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

  const cibilVal = extractCibilScore(lead) || 0;
  const salNum = extractMonthlySalary(lead);
  const rupayOk = isRupay91Eligible(lead);

  let slab = 0;
  let cibilRange = cibilVal > 0 ? String(cibilVal) : 'Not Available';
  let salaryRange = 'Under ₹20,000';
  let eligibilityStatus = 'Eligible';
  let partner = 'Jhatpat Loans';

  if (rupayOk) {
    slab = 8;
    salaryRange = '₹1,00,000+';
    eligibilityStatus = 'Eligible – Premium';
    partner = 'Rupay91';
  } else if (salNum >= 90000 || cibilVal >= 850) {
    slab = 8;
    salaryRange = '₹90,000+';
    eligibilityStatus = 'Eligible – Premium';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 80000 || cibilVal >= 800) {
    slab = 7;
    salaryRange = '₹80,000–₹89,999';
    eligibilityStatus = 'Eligible – Premium';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 70000 || cibilVal >= 750) {
    slab = 6;
    salaryRange = '₹70,000–₹79,999';
    eligibilityStatus = 'Eligible – Preferred';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 60000 || cibilVal >= 700) {
    slab = 5;
    salaryRange = '₹60,000–₹69,999';
    eligibilityStatus = 'Eligible – Good';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 50000 || cibilVal >= 650) {
    slab = 4;
    salaryRange = '₹50,000–₹59,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 40000 || cibilVal >= 600) {
    slab = 3;
    salaryRange = '₹40,000–₹49,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 30000 || cibilVal >= 550) {
    slab = 2;
    salaryRange = '₹30,000–₹39,999';
    eligibilityStatus = 'Eligible';
    partner = 'Jhatpat Loans';
  } else if (salNum >= 20000 || cibilVal >= 500) {
    slab = 1;
    salaryRange = '₹20,000–₹29,999';
    eligibilityStatus = 'Eligible – Base';
    partner = 'Jhatpat Loans';
  } else {
    slab = 0;
    salaryRange = 'Under ₹20,000';
    eligibilityStatus = (cibilVal === 0 && salNum === 0) ? 'Incomplete / Phone Only' : 'Below Minimum Threshold';
    partner = (cibilVal === 0 && salNum === 0) ? 'Pending Details' : 'Jhatpat Loans';
  }

  // Resolve assigned partner: prioritize lead's assignedCompany if set and eligible, else Pending Selection
  const existingAssigned = lead.assignedCompany || lead.partner_name || lead.partner || '';
  if (existingAssigned && !['auto', '—', '', 'null', 'pending details'].includes(existingAssigned.toLowerCase())) {
    const isAssignedRupay = existingAssigned.toLowerCase().replace(/[\s\-_]/g, '').includes('rupay91') ||
      existingAssigned.toLowerCase().replace(/[\s\-_]/g, '') === 'rupay';
    if (isAssignedRupay && !rupayOk) {
      // Ineligible leads cannot remain assigned to Rupay91 for future delivery
      partner = 'Pending Selection';
    } else {
      partner = existingAssigned;
    }
  } else {
    partner = (cibilVal === 0 && salNum === 0) ? 'Pending Details' : 'Pending Selection';
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

/**
 * Categorizes lending partners into Eligible and Ineligible offers.
 * Strictly checks CIBIL >= 700 AND Monthly Salary >= ₹1,00,000 for Rupay91.
 * All other partners continue using their existing criteria.
 * Accepts either lead object or (salary, cibilOrLead).
 */
export function getSalaryMatchedOffers(salaryOrLead, cibilOrLead) {
  let leadObj = null;
  let salNum = 0;
  let cibilVal = null;

  if (salaryOrLead && typeof salaryOrLead === 'object') {
    leadObj = salaryOrLead;
    salNum = extractMonthlySalary(leadObj);
    cibilVal = extractCibilScore(leadObj);
  } else {
    salNum = extractMonthlySalary(salaryOrLead);
    if (cibilOrLead && typeof cibilOrLead === 'object') {
      leadObj = cibilOrLead;
      cibilVal = extractCibilScore(cibilOrLead);
    } else if (cibilOrLead !== undefined && cibilOrLead !== null) {
      cibilVal = extractCibilScore(cibilOrLead);
    }
  }

  const eligible = [];
  const ineligible = [];

  AFFILIATE_PARTNERS.forEach(partner => {
    if (partner.id === 'rupay91') {
      const isEligible = leadObj
        ? isRupay91Eligible(leadObj)
        : (cibilVal !== null && cibilVal >= 700 && salNum >= 100000 && salNum <= 500000);

      if (isEligible) {
        eligible.push(partner);
      } else {
        ineligible.push(partner);
      }
    } else {
      const minSal = Number(partner.minSalary || 25000);
      if (salNum >= minSal) {
        eligible.push(partner);
      } else {
        ineligible.push(partner);
      }
    }
  });

  return {
    salary: salNum,
    cibil: cibilVal,
    eligible,
    ineligible
  };
}

/**
 * Builds the outbound tracking URL served by the Node server (`GET /api/public/redirect/:partnerSlug`).
 * The server logs the click, assigns the lead to the partner and 302-redirects to the partner's stored URL
 * (the target never comes from the query string).
 */
export function getPartnerTrackingUrl(partnerOrId, options = {}) {
  const meta = getPartnerMeta(partnerOrId);
  const partnerSlug = meta?.id || 'jhatpatloans';
  if (meta?.disabled || meta?.status === 'INACTIVE' || partnerSlug === 'ticket2loan' || partnerSlug.includes('ticket')) {
    console.warn(`[routing] partner ${partnerSlug} is inactive; outbound routing blocked.`);
    return '#';
  }
  if (partnerSlug === 'moneydot') {
    const playStoreBase = 'https://play.google.com/store/apps/details?id=com.yrs.moneydot&hl=en_IN';
    const params = new URLSearchParams({
      utm_source: 'paisainminutes',
      utm_medium: 'affiliate',
      utm_campaign: options.campaign || 'paisainminutes_crm',
      utm_term: options.term || 'moneydot_crm'
    });
    return `${playStoreBase}&referrer=${encodeURIComponent(params.toString())}`;
  }
  if (partnerSlug === 'rupay91') {
    const rupayBase = (meta?.applyUrl && !meta.applyUrl.includes('applynow.php')) ? meta.applyUrl : 'https://loans.rupay91.com/login';
    const leadCode = String(options.leadId || 'CRM');
    const affRef = 'paisainminutes';
    const source = options.source || 'crm';
    const campaign = options.campaign || 'paisainminutes_crm';
    const term = options.term || 'rupay91_crm';

    // Construct next target URL for Rupay91's Angular router after OTP verification
    const nextParams = new URLSearchParams({
      lead_id: leadCode,
      ref: affRef,
      sub_id: leadCode,
      source: source,
      utm_source: 'paisainminutes',
      utm_medium: 'affiliate',
      utm_campaign: campaign,
      utm_term: term
    });
    const nextPathAndQuery = `/new?${nextParams.toString()}`;

    const params = new URLSearchParams({
      ref: affRef,
      source: source,
      lead_id: leadCode,
      sub_id: leadCode,
      utm_source: 'paisainminutes',
      utm_medium: 'affiliate',
      utm_campaign: campaign,
      utm_term: term,
      next: nextPathAndQuery
    });
    if (options.phone) {
      params.set('phone', String(options.phone).replace(/\D/g, '').slice(-10));
    }
    return `${rupayBase}?${params.toString()}`;
  }
  const leadId = options.leadId || 'CRM';
  const source = options.source || 'crm';
  const campaign = options.campaign || 'paisainminutes_crm';
  const term = options.term || `${partnerSlug}_crm`;

  const params = new URLSearchParams({
    ref: 'paisainminutes',
    source: source,
    lead_id: String(leadId),
    utm_source: 'paisainminutes',
    utm_medium: 'affiliate',
    utm_campaign: campaign,
    utm_term: term
  });

  if (options.phone) {
    params.set('phone', String(options.phone).replace(/\D/g, '').slice(-10));
  }

  return `${BACKEND_BASE}/api/public/redirect/${encodeURIComponent(partnerSlug)}?${params.toString()}`;
}

/**
 * Records an outbound partner click on the Node server (`POST /api/public/partner-click`).
 * Idempotent on the server (same partner + lead + source within 10 minutes counts once). A failure is
 * logged to the console only: the visitor's navigation must never be blocked by tracking.
 */
export async function trackPartnerClick(partnerOrId, options = {}) {
  const meta = getPartnerMeta(partnerOrId);
  const partnerSlug = meta?.id || 'jhatpatloans';
  if (meta?.disabled || meta?.status === 'INACTIVE' || partnerSlug === 'ticket2loan' || partnerSlug.includes('ticket')) {
    console.warn(`[partner click] blocked: partner ${partnerSlug} is inactive.`);
    return { ok: false, error: 'Partner inactive' };
  }
  const payload = {
    partner: partnerSlug,
    ref: 'paisainminutes',
    source: options.source || 'crm',
    leadId: String(options.leadId || 'CRM'),
    phone: options.phone ? String(options.phone).replace(/\D/g, '').slice(-10) : '',
    utm_source: 'paisainminutes',
    utm_medium: 'affiliate',
    utm_campaign: options.campaign || 'paisainminutes_crm',
    utm_term: options.term || `${partnerSlug}_crm`
  };

  const res = await api('/api/public/partner-click', { method: 'POST', auth: false, body: payload, timeoutMs: 8000 });
  if (!res.ok) {
    console.warn('[partner click] not recorded:', res.error);
  }
  return res;
}

/**
 * Returns direct destination URL with pre-baked UTMs for fallback or direct preview.
 */
export function getPartnerDirectUtmUrl(partnerOrId, options = {}) {
  const meta = getPartnerMeta(partnerOrId);
  if (!meta || !meta.applyUrl || meta.disabled || meta.status === 'INACTIVE' || meta.id === 'ticket2loan' || (meta.id && meta.id.includes('ticket'))) {
    return 'https://paisainminutes.com/loan-offers';
  }
  let url = meta.applyUrl;
  if (meta.id === 'rupay91') {
    const rupayBase = (!url || url.includes('applynow.php')) ? 'https://loans.rupay91.com/login' : url;
    const leadCode = String(options.leadId || 'CRM');
    const affRef = 'paisainminutes';
    const campaign = options.campaign || 'paisainminutes_crm';
    const term = options.term || options.leadId || 'rupay91_crm';

    const nextParams = new URLSearchParams({
      lead_id: leadCode,
      ref: affRef,
      sub_id: leadCode,
      utm_source: 'paisainminutes',
      utm_medium: 'affiliate',
      utm_campaign: campaign,
      utm_term: term
    });
    const nextPathAndQuery = `/new?${nextParams.toString()}`;

    const params = new URLSearchParams({
      utm_source: 'paisainminutes',
      utm_medium: 'affiliate',
      utm_campaign: campaign,
      utm_term: term,
      sub_id: leadCode,
      lead_id: leadCode,
      ref: affRef,
      next: nextPathAndQuery
    });
    return `${rupayBase}?${params.toString()}`;
  }
  if (options.leadId) {
    url = url.replace(/sub_id=CRM/g, `sub_id=${encodeURIComponent(options.leadId)}`);
    url = url.replace(/utm_term=[^&]*/g, `utm_term=${encodeURIComponent(options.leadId)}`);
  }
  if (options.campaign) {
    url = url.replace(/utm_campaign=[^&]*/g, `utm_campaign=${encodeURIComponent(options.campaign)}`);
  }
  return url;
}

