export const INITIAL_ROLES = [
  { id: 'SA', code: 'SA', name: 'Super Admin', color: 'bg-indigo-700', desc: 'Complete master system control & user management' },
  { id: 'AD', code: 'AD', name: 'Admin', color: 'bg-indigo-600', desc: 'Full administrative access and operational management' },
  { id: 'CR', code: 'CR', name: 'Credit Manager', color: 'bg-blue-600', desc: 'Underwriting, credit assessment & loan approvals' },
  { id: 'TE', code: 'TE', name: 'Telecaller', color: 'bg-blue-600', desc: 'Inbound/outbound lead calls, callbacks & verification' },
];

export const INITIAL_STAFF_MEMBERS = [
  {
    id: '1',
    name: 'admin',
    username: 'admin',
    email: 'admin@paisainminutes.com',
    mobile: '7982967240',
    password: 'admin123',
    initials: 'AD',
    role: 'Super Admin',
    roles: ['Super Admin', 'Admin'],
    branch: 'Delhi Head Office',
    status: 'Active',
    lastLogin: 'Just now',
    created: '31/08/2026',
    avatarBg: 'bg-[#0A3977]',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'shivam',
    username: 'shivam',
    email: 'shivam@adgrowmedia.com',
    mobile: '7982967240',
    password: 'shivam123',
    initials: 'SH',
    role: 'Super Admin',
    roles: ['Super Admin', 'Admin'],
    branch: 'Delhi Head Office',
    status: 'Active',
    lastLogin: 'Just now',
    created: '20/08/2026',
    avatarBg: 'bg-[#0A3977]',
    permissions: ['all']
  }
];
