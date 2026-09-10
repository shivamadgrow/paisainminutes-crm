export const INITIAL_SETTLEMENTS = [
  {
    id: 'SET-2026-042',
    partnerId: 'rupay91',
    partnerName: 'Rupay91',
    settlementDate: '2026-08-05',
    expectedAmount: 284000,
    receivedAmount: 284000,
    variance: 0,
    bankRef: 'NEFT-HDFC009283719',
    reconciledStatus: 'Matched',
    period: '16/07/2026 - 31/07/2026',
    notes: 'Exact match with MIS sheet'
  },
  {
    id: 'SET-2026-041',
    partnerId: 'jhatpat',
    partnerName: 'Jhatpat Loans',
    settlementDate: '2026-08-04',
    expectedAmount: 115000,
    receivedAmount: 112000,
    variance: -3000, // Shortfall flagged
    bankRef: 'RTGS-ICIC881923019',
    reconciledStatus: 'Variance Flagged',
    period: '16/07/2026 - 31/07/2026',
    notes: '₹3,000 TDS deduction disputed, requested TDS certificate'
  },
  {
    id: 'SET-2026-039',
    partnerId: 'udhaarnow',
    partnerName: 'UdhaarNow',
    settlementDate: '2026-07-28',
    expectedAmount: 78000,
    receivedAmount: 78000,
    variance: 0,
    bankRef: 'IMPS-AXIS002938192',
    reconciledStatus: 'Matched',
    period: '01/07/2026 - 15/07/2026',
    notes: 'Per-lead payout verified against 52 disbursed loans'
  },
  {
    id: 'SET-2026-036',
    partnerId: 'shubhcash',
    partnerName: 'ShubhCash',
    settlementDate: '2026-07-25',
    expectedAmount: 94500,
    receivedAmount: 96000,
    variance: 1500, // Surplus bonus
    bankRef: 'NEFT-KOTAK82719201',
    reconciledStatus: 'Surplus',
    period: '01/07/2026 - 15/07/2026',
    notes: 'Included ₹1,500 target volume incentive'
  },
  {
    id: 'SET-2026-033',
    partnerId: 'easyfincare',
    partnerName: 'Easy Fincare',
    settlementDate: '2026-07-20',
    expectedAmount: 62000,
    receivedAmount: 62000,
    variance: 0,
    bankRef: 'NEFT-SBIN00291823',
    reconciledStatus: 'Matched',
    period: '01/07/2026 - 15/07/2026',
    notes: 'Reconciled & cleared by accounts'
  }
];
