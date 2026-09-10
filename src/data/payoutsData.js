export const INITIAL_PAYOUT_REQUESTS = [
  {
    id: 'PR-2026-081',
    partnerId: 'instarupees',
    partnerName: 'Insta Rupees',
    amount: 145000,
    requestedDate: '2026-08-15',
    status: 'Requested', // 'Requested' | 'Acknowledged' | 'Paid'
    leadsCount: 14,
    disbursalPeriod: '01/08/2026 - 15/08/2026',
    invoiceNo: 'INV-2026-089',
    contactPerson: 'Aditya Mehta',
    contactEmail: 'aditya@instarupees.in',
    notes: 'Payout request for first half of August'
  },
  {
    id: 'PR-2026-079',
    partnerId: 'loanwithin',
    partnerName: 'LoanWithin',
    amount: 88500,
    requestedDate: '2026-08-12',
    status: 'Acknowledged',
    leadsCount: 9,
    disbursalPeriod: '01/08/2026 - 10/08/2026',
    invoiceNo: 'INV-2026-085',
    contactPerson: 'Sanjay Rawat',
    contactEmail: 'payouts@loanwithin.com',
    notes: 'Finance team acknowledged, scheduled for release next Monday'
  },
  {
    id: 'PR-2026-075',
    partnerId: 'borrowera',
    partnerName: 'Borrowera',
    amount: 67200,
    requestedDate: '2026-08-10',
    status: 'Requested',
    leadsCount: 6,
    disbursalPeriod: '01/08/2026 - 10/08/2026',
    invoiceNo: 'INV-2026-082',
    contactPerson: 'Meera Sen',
    contactEmail: 'settlements@borrowera.com',
    notes: 'Submitted via partner portal'
  },
  {
    id: 'PR-2026-068',
    partnerId: 'rupay91',
    partnerName: 'Rupay91',
    amount: 284000,
    requestedDate: '2026-08-02',
    status: 'Paid',
    paidDate: '2026-08-05',
    leadsCount: 22,
    disbursalPeriod: '16/07/2026 - 31/07/2026',
    invoiceNo: 'INV-2026-074',
    contactPerson: 'Vikram Joshi',
    contactEmail: 'vikram@rupay91.com',
    notes: 'Settled via NEFT UTR #HDFC009283719'
  },
  {
    id: 'PR-2026-064',
    partnerId: 'jhatpat',
    partnerName: 'Jhatpat Loans',
    amount: 112000,
    requestedDate: '2026-08-01',
    status: 'Paid',
    paidDate: '2026-08-04',
    leadsCount: 11,
    disbursalPeriod: '16/07/2026 - 31/07/2026',
    invoiceNo: 'INV-2026-071',
    contactPerson: 'Karan Sharma',
    contactEmail: 'karan@jhatpatloans.com',
    notes: 'Payment confirmed in ICICI account'
  }
];
