export const INITIAL_ROLES = [
  { id: 'AC', code: 'AC', name: 'Accounts', color: 'bg-blue-600', desc: 'Financial records, reconciliations & payouts' },
  { id: 'AD', code: 'AD', name: 'Admin', color: 'bg-indigo-600', desc: 'Full administrative access and system management' },
  { id: 'CA', code: 'CA', name: 'CA', color: 'bg-blue-700', desc: 'Statutory audit, compliance & filing views' },
  { id: 'CO', code: 'CO', name: 'Collection Manager', color: 'bg-blue-600', desc: 'EMI collections, overdue tracking & follow-ups' },
  { id: 'CR', code: 'CR', name: 'Credit Manager', color: 'bg-blue-600', desc: 'Underwriting, credit assessment & loan approvals' },
  { id: 'DI', code: 'DI', name: 'Disbursal Manager', color: 'bg-blue-700', desc: 'Disbursal batches, bank files & loan releases' },
  { id: 'MI', code: 'MI', name: 'MIS', color: 'bg-blue-600', desc: 'Analytics, data extraction & KPI MIS reports' },
  { id: 'PD', code: 'PD', name: 'PD', color: 'bg-blue-600', desc: 'Personal discussion and physical verification' },
  { id: 'RE', code: 'RE', name: 'Recovery Manager', color: 'bg-blue-700', desc: 'Legal recovery, settlements & NPA management' },
  { id: 'TE', code: 'TE', name: 'Telecaller', color: 'bg-blue-600', desc: 'Inbound/outbound lead calls, callbacks & verification' },
];

export const INITIAL_STAFF_MEMBERS = [
  {
    id: '1',
    name: 'admin',
    email: 'admin@paisainminutes.com',
    initials: 'AD',
    role: 'Super Admin',
    branch: 'Delhi Head Office',
    status: 'Active',
    lastLogin: 'Just now',
    created: '31/08/2026',
    avatarBg: 'bg-[#0A3977]',
    permissions: ['all']
  }
];
