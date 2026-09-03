export const INITIAL_ROLES = [
  { id: 'SA', code: 'SA', name: 'Super Admin', color: 'bg-indigo-700', desc: 'Complete master system control & user management' },
  { id: 'AD', code: 'AD', name: 'Admin', color: 'bg-indigo-600', desc: 'Full administrative access and operational management' },
  { id: 'CR', code: 'CR', name: 'Credit Manager', color: 'bg-blue-600', desc: 'Underwriting, credit assessment & loan approvals' },
  { id: 'TE', code: 'TE', name: 'Telecaller', color: 'bg-blue-600', desc: 'Inbound/outbound lead calls, callbacks & verification' },
];

export const INITIAL_STAFF_MEMBERS = [
  {
    id: '1',
    name: 'Super Admin',
    username: 'info@adgrowmedia.com',
    email: 'info@adgrowmedia.com',
    mobile: '9990666578',
    password: 'Jazz@123',
    initials: 'SA',
    role: 'Super Admin',
    roles: ['Super Admin', 'Admin'],
    branch: 'Delhi Head Office',
    status: 'Active',
    lastLogin: 'Just now',
    created: '03/09/2026',
    avatarBg: 'bg-[#0A3977]',
    permissions: ['all']
  }
];
