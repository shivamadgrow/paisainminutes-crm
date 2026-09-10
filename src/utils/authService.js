import { INITIAL_STAFF_MEMBERS } from '../data/staffData';
import { checkLoginAllowed, logSecurityIncident, isOffHours, getIndianTime } from './shiftSecurity';
import { getLiveSecurityDetails } from './geoService';

export const STAFF_STORAGE_KEY = 'paisa_crm_staff_list';
export const SESSION_STORAGE_KEY = 'paisa_crm_user';
export const AUTH_VERSION = 'v9_super_admin_permanently_active';

/**
 * Purge all stale, duplicate, and unused client-side caches and storage keys
 */
export function purgeAllClientCaches() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pim_deleted_leads');
      localStorage.removeItem('paisa_crm_lead_overrides');
      localStorage.removeItem('paisa_security_incidents');
      localStorage.removeItem('pim_jwt_token');
      localStorage.removeItem(STAFF_STORAGE_KEY);
      localStorage.removeItem('paisa_crm_active_tab');
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    console.log('[CRM CLEAN SLATE] 🧹 Purged all client caches and local lead/staff overrides.');
  } catch (e) {}
}

/**
 * Enforces a global logout and cleans stale/duplicate cache across all browsers/devices
 */
export function checkAndEnforceGlobalLogout() {
  try {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('paisa_crm_auth_version') !== AUTH_VERSION) {
        purgeAllClientCaches();
        localStorage.removeItem(SESSION_STORAGE_KEY);
        try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
        localStorage.setItem('paisa_crm_auth_version', AUTH_VERSION);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('paisa_session_changed', { detail: null }));
        }
        return true;
      }
    }
  } catch (e) {}
  return false;
}

/**
 * Helper to identify if a staff user is a Super Admin
 * Super Admin cannot be deleted, deactivated or disabled by any user.
 */
export function isSuperAdmin(user) {
  if (!user) return false;
  const role = String(user.role || '').trim().toLowerCase();
  const roles = Array.isArray(user.roles) ? user.roles.map(r => String(r).trim().toLowerCase()) : [];
  const email = String(user.email || '').trim().toLowerCase();
  const username = String(user.username || '').trim().toLowerCase();
  const name = String(user.name || '').trim().toLowerCase();
  const id = String(user.id || '');

  return (
    role === 'super admin' ||
    roles.includes('super admin') ||
    user.isSuperAdmin === true ||
    id === '1' ||
    email === 'info@adgrowmedia.com' ||
    username === 'info@adgrowmedia.com' ||
    name === 'super admin'
  );
}

const DUMMY_USER_NAMES = [
  'accounts_team', 'collection_lead', 
  'credit_evaluator', 'telecaller_riya', 'ops_supervisor', 'telecaller_rahul'
];

/**
 * Retrieve all registered staff accounts from localStorage or initial seed
 */
export function getStaffList() {
  checkAndEnforceGlobalLogout();

  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsResave = false;
        // Filter out legacy dummy users and ensure Super Admin info@adgrowmedia.com exists & is Active
        const cleaned = parsed
          .filter(u => u && u.name && !DUMMY_USER_NAMES.includes(u.name.toLowerCase().trim()))
          .map(u => {
            const isSuper = isSuperAdmin(u);
            const status = isSuper ? 'Active' : (u.status || 'Active');
            if (isSuper && u.status !== 'Active') {
              needsResave = true;
            }
            return {
              ...u,
              username: u.username || u.email || u.name,
              password: (u.email === 'info@adgrowmedia.com' || u.username === 'info@adgrowmedia.com' || u.role === 'Super Admin' || isSuper) ? 'Jazz@123' : (u.password || 'Jazz@123'),
              roles: Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : [u.role || 'Super Admin'],
              status: status,
              branch: u.branch || 'Delhi Head Office'
            };
          });

        // Ensure at least Super Admin info@adgrowmedia.com exists
        const hasSuperAdmin = cleaned.some(u => (u.username || u.email || '').toLowerCase() === 'info@adgrowmedia.com');
        if (!hasSuperAdmin) {
          cleaned.unshift(INITIAL_STAFF_MEMBERS[0]);
          needsResave = true;
        }

        if (needsResave) {
          saveStaffList(cleaned);
        }

        return cleaned;
      }
    }
  } catch (e) {
    console.error('Error reading staff list from localStorage:', e);
  }

  // Fallback to initial staff members
  const initial = INITIAL_STAFF_MEMBERS.map(u => ({
    ...u,
    username: u.username || u.email || u.name,
    password: u.password || 'Jazz@123',
    roles: u.roles || [u.role],
    status: u.status || 'Active'
  }));
  saveStaffList(initial);
  return initial;
}

/**
 * Persist staff list to localStorage and trigger global sync event
 */
export function saveStaffList(list) {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(list || []));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paisa_staff_updated', { detail: list }));
    }
  } catch (e) {
    console.error('Error writing staff list to localStorage:', e);
  }
}

/**
 * Create a new staff profile
 */
export function addStaffUser(userData) {
  const staffList = getStaffList();
  const username = (userData.username || userData.name || '').trim();
  const email = (userData.email || `${username.toLowerCase()}@paisainminutes.com`).trim().toLowerCase();

  // Validate duplicate username or email
  const isDuplicate = staffList.some(
    u => (u.username || u.name || '').toLowerCase() === username.toLowerCase() ||
         (u.email || '').toLowerCase() === email
  );

  if (isDuplicate) {
    return { success: false, error: `User with username "${username}" or email "${email}" already exists!` };
  }

  const initials = username
    .split(' ')
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2) || username.slice(0, 2).toUpperCase() || 'ST';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const role = userData.role || (Array.isArray(userData.roles) ? userData.roles[0] : 'Admin');
  const roles = Array.isArray(userData.roles) && userData.roles.length > 0 ? userData.roles : [role];

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: username,
    username: username,
    email: email,
    mobile: userData.mobile || '7982967240',
    password: userData.password || `Paisa@${Math.floor(1000 + Math.random() * 9000)}`,
    initials,
    role: role,
    roles: roles,
    branch: userData.branch || 'Delhi Head Office',
    status: userData.status || 'Active',
    lastLogin: 'Never',
    created: dateStr,
    avatarBg: userData.avatarBg || 'bg-[#0A3977]',
    permissions: userData.permissions || (role.includes('Admin') ? ['all'] : ['view_leads', 'edit_status'])
  };

  const updatedList = [...staffList, newUser];
  saveStaffList(updatedList);

  return { success: true, user: newUser };
}

/**
 * Update an existing staff profile
 */
export function updateStaffUser(id, updatedFields) {
  const staffList = getStaffList();
  let updatedUser = null;

  const updatedList = staffList.map(u => {
    if (String(u.id) === String(id)) {
      const isSuper = isSuperAdmin(u);

      const initials = (updatedFields.name || u.name)
        .split(' ')
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .join('')
        .slice(0, 2) || u.initials || 'US';

      let role = updatedFields.role || (Array.isArray(updatedFields.roles) ? updatedFields.roles[0] : u.role);
      let roles = Array.isArray(updatedFields.roles) && updatedFields.roles.length > 0 ? updatedFields.roles : (u.roles || [role]);

      // Protect Super Admin: Must always stay Active and retain Super Admin role
      let status = updatedFields.status || u.status || 'Active';
      if (isSuper) {
        status = 'Active';
        if (!roles.includes('Super Admin')) {
          roles = ['Super Admin', ...roles];
        }
        role = 'Super Admin';
      }

      updatedUser = {
        ...u,
        ...updatedFields,
        initials,
        role,
        roles,
        status
      };
      return updatedUser;
    }
    return u;
  });

  saveStaffList(updatedList);

  // If current logged-in user is updated, update session
  const currentUser = getCurrentUser();
  if (currentUser && String(currentUser.id) === String(id) && updatedUser) {
    setCurrentUserSession(updatedUser);
  }

  return { success: true, user: updatedUser };
}

/**
 * Reset password for a staff member
 */
export function resetStaffPassword(id, newPassword) {
  const staffList = getStaffList();
  let targetUser = null;

  const updatedList = staffList.map(u => {
    if (String(u.id) === String(id)) {
      targetUser = { ...u, password: newPassword };
      return targetUser;
    }
    return u;
  });

  if (!targetUser) {
    return { success: false, error: 'User not found' };
  }

  saveStaffList(updatedList);

  // Update session if self
  const currentUser = getCurrentUser();
  if (currentUser && String(currentUser.id) === String(id)) {
    setCurrentUserSession(targetUser);
  }

  return { success: true, user: targetUser };
}

/**
 * Delete a staff user profile
 * Protected: Super Admin accounts CANNOT be deleted by anyone!
 */
export function deleteStaffUser(id) {
  const staffList = getStaffList();
  const targetUser = staffList.find(u => String(u.id) === String(id));

  if (targetUser && isSuperAdmin(targetUser)) {
    console.warn('[SECURITY] Attempted to delete protected Super Admin account:', targetUser.name);
    return { success: false, error: 'Super Admin account is permanently protected and cannot be deleted!' };
  }

  const filtered = staffList.filter(u => String(u.id) !== String(id));
  saveStaffList(filtered);

  // If deleted user was active session, logout
  const currentUser = getCurrentUser();
  if (currentUser && String(currentUser.id) === String(id)) {
    clearCurrentUserSession();
  }

  return { success: true };
}

/**
 * Toggle Active / Disabled status for a staff profile
 * Protected: Super Admin accounts CANNOT be disabled by anyone!
 */
export function toggleUserStatus(id) {
  const staffList = getStaffList();
  const targetCheck = staffList.find(u => String(u.id) === String(id));

  if (targetCheck && isSuperAdmin(targetCheck)) {
    console.warn('[SECURITY] Attempted to disable protected Super Admin account:', targetCheck.name);
    return { 
      success: false, 
      status: 'Active', 
      error: 'Super Admin account is permanently active and cannot be disabled!' 
    };
  }

  let nextStatus = 'Active';
  let targetUser = null;

  const updatedList = staffList.map(u => {
    if (String(u.id) === String(id)) {
      if (isSuperAdmin(u)) {
        targetUser = { ...u, status: 'Active' };
        return targetUser;
      }
      nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
      targetUser = { ...u, status: nextStatus };
      return targetUser;
    }
    return u;
  });

  saveStaffList(updatedList);

  // If current user is disabled, end their session
  const currentUser = getCurrentUser();
  if (currentUser && String(currentUser.id) === String(id)) {
    if (nextStatus === 'Disabled') {
      clearCurrentUserSession();
    } else {
      setCurrentUserSession(targetUser);
    }
  }

  return { success: true, status: nextStatus, user: targetUser };
}

/**
 * Authenticate staff member credentials (Username / Email + Password)
 */
export async function authenticateStaff(usernameOrEmail, password, isSimulatingOffHours = false) {
  if (!usernameOrEmail || !usernameOrEmail.trim()) {
    return { success: false, error: 'Please enter your User ID / Username or Email' };
  }
  if (!password || !password.trim()) {
    return { success: false, error: 'Please enter your Password' };
  }

  const staffList = getStaffList();
  const input = usernameOrEmail.trim().toLowerCase();

  // Find matching user by username, name, email or Super Admin alias
  const user = staffList.find(u => 
    (u.username && u.username.toLowerCase() === input) ||
    (u.name && u.name.toLowerCase() === input) ||
    (u.email && u.email.toLowerCase() === input) ||
    (input === 'info@adgrowmedia.com' && (u.role === 'Super Admin' || u.email === 'info@adgrowmedia.com')) ||
    (input === 'super admin' && u.role === 'Super Admin') ||
    (input === 'superadmin' && u.role === 'Super Admin') ||
    (input === 'admin' && u.role === 'Super Admin')
  );

  if (!user) {
    return { success: false, error: `Invalid User ID or Email "${usernameOrEmail}". Account not found.` };
  }

  // Check password - Super Admin is Jazz@123
  const expectedPassword = user.password || 'Jazz@123';
  if (password !== expectedPassword) {
    return { success: false, error: 'Incorrect Password. Please check and try again.' };
  }

  // Check account status - Super Admin can NEVER be disabled
  if (isSuperAdmin(user) || (user.email && user.email.toLowerCase() === 'info@adgrowmedia.com') || (user.username && user.username.toLowerCase() === 'info@adgrowmedia.com')) {
    user.status = 'Active';
  } else if (user.status === 'Disabled') {
    return { success: false, error: 'Your staff account is currently Disabled. Please contact Super Admin.' };
  }

  // Check Shift Security Policy (6:35 PM - 9:27 AM IST)
  const shiftCheck = checkLoginAllowed(user, isSimulatingOffHours);
  if (!shiftCheck.allowed) {
    const geo = await getLiveSecurityDetails();
    const incident = logSecurityIncident(user, geo);
    return {
      success: false,
      blockedIncident: {
        ...incident,
        reason: shiftCheck.reason,
        currentTime: shiftCheck.currentTime,
        resumeTime: shiftCheck.resumeTime
      }
    };
  }

  // Update last login
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ', ' + 
                  now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  const updatedUser = {
    ...user,
    lastLogin: timeStr
  };

  // Update in staff list
  const updatedList = staffList.map(u => String(u.id) === String(user.id) ? updatedUser : u);
  saveStaffList(updatedList);

  // Set active session
  setCurrentUserSession(updatedUser);

  return { success: true, user: updatedUser };
}

/**
 * Get active logged-in user session
 */
export function getCurrentUser() {
  checkAndEnforceGlobalLogout();

  try {
    // Only check active tab sessionStorage so fresh browser/incognito windows always require credentials
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.name || parsed.username || parsed.email)) return parsed;
    }
  } catch (e) {}
  return null;
}

/**
 * Set active logged-in user session
 */
export function setCurrentUserSession(user) {
  try {
    if (user) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      // Remove from localStorage so it never persists across new windows/tabs automatically
      try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
    } else {
      try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
      try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paisa_session_changed', { detail: user }));
    }
  } catch (e) {
    console.error('Error saving session:', e);
  }
}

/**
 * Clear user session (Logout)
 */
export function clearCurrentUserSession() {
  setCurrentUserSession(null);
}
