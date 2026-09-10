export const INITIAL_RATE_CARDS = [
  {
    id: 'rc-rupay91',
    partnerId: 'rupay91',
    partnerName: 'Rupay91',
    model: 'tiered', // 'flat_pct' | 'tiered' | 'per_lead'
    defaultRate: '2.8%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: 5000000, ratePct: 2.5, label: 'Up to ₹50 Lakhs (2.5%)' },
      { minVolume: 5000001, maxVolume: 20000000, ratePct: 2.8, label: '₹50L - ₹2 Cr (2.8%)' },
      { minVolume: 20000001, maxVolume: null, ratePct: 3.2, label: 'Above ₹2 Cr (3.2%)' }
    ],
    history: [
      { effectiveFrom: '2025-04-01', effectiveTo: '2026-03-31', rate: '2.5%', model: 'flat_pct', updatedBy: 'Super Admin' },
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.8% (Tiered)', model: 'tiered', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-jhatpat',
    partnerId: 'jhatpat',
    partnerName: 'Jhatpat Loans',
    model: 'flat_pct',
    defaultRate: '2.4%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.4, label: 'Flat 2.4% on all Disbursals' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.4%', model: 'flat_pct', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-instarupees',
    partnerId: 'instarupees',
    partnerName: 'Insta Rupees',
    model: 'flat_pct',
    defaultRate: '2.5%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.5, label: 'Flat 2.5% on all Disbursals' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.5%', model: 'flat_pct', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-udhaarnow',
    partnerId: 'udhaarnow',
    partnerName: 'UdhaarNow',
    model: 'per_lead',
    defaultRate: '₹1,500 / lead',
    effectiveFrom: '2026-04-01',
    perLeadFee: 1500,
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.2, perLeadFee: 1500, label: '₹1,500 flat fee per approved lead or 2.2% of disbursal' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '₹1,500 / lead', model: 'per_lead', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-loanwithin',
    partnerId: 'loanwithin',
    partnerName: 'LoanWithin',
    model: 'flat_pct',
    defaultRate: '2.6%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.6, label: 'Flat 2.6% on all Disbursals' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.6%', model: 'flat_pct', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-shubhcash',
    partnerId: 'shubhcash',
    partnerName: 'ShubhCash',
    model: 'flat_pct',
    defaultRate: '2.3%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.3, label: 'Flat 2.3% on all Disbursals' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.3%', model: 'flat_pct', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-borrowera',
    partnerId: 'borrowera',
    partnerName: 'Borrowera',
    model: 'tiered',
    defaultRate: '2.7%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: 10000000, ratePct: 2.7, label: 'Up to ₹1 Cr (2.7%)' },
      { minVolume: 10000001, maxVolume: null, ratePct: 3.0, label: 'Above ₹1 Cr (3.0%)' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.7%', model: 'tiered', updatedBy: 'Super Admin' }
    ]
  },
  {
    id: 'rc-easyfincare',
    partnerId: 'easyfincare',
    partnerName: 'Easy Fincare',
    model: 'flat_pct',
    defaultRate: '2.4%',
    effectiveFrom: '2026-04-01',
    slabs: [
      { minVolume: 0, maxVolume: null, ratePct: 2.4, label: 'Flat 2.4% on all Disbursals' }
    ],
    history: [
      { effectiveFrom: '2026-04-01', effectiveTo: 'Present', rate: '2.4%', model: 'flat_pct', updatedBy: 'Super Admin' }
    ]
  }
];
