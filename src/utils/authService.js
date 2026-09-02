import { INITIAL_STAFF_MEMBERS } from '../data/staffData';
import { checkLoginAllowed, logSecurityIncident, isOffHours, getIndianTime } from './shiftSecurity';
import { getLiveSecurityDetails } from './geoService';

export const STAFF_STORAGE_KEY = 'paisa_crm_staff_list';
export const SESSION_STORAGE_KEY = 'paisa_crm_user';

const DUMMY_USER_NAMES = [
  'accounts_team', 'collection_lead', 
  'credit_evaluator', 'telecaller_riya', 'ops_supervisor', 'telecaller_rahul'
];

/**
 * Retrieve all registered staff accounts from localStorage or initial seed
 */
export function getStaffList() {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out legacy dummy users and ensure passwords exist
        const cleaned = parsed
          .filter(u => u && u.name && !DUMMY_USER_NAMES.includes(u.name.toLowerCase().trim()))
          .map(u => ({
            ...u,
            username: u.username || u.name,
            password: u.password || (u.name === 'admin' ? 'admin123' : u.name === 'shivam' ? 'shivam123' : 'Paisa@1234'),
            roles: Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : [u.role || 'Admin'],
            status: u.status || 'Active',
            branch: u.branch || 'Delhi Head Office'
          }));

        // Ensure at least admin exists
        const hasAdmin = cleaned.some(u => (u.username || u.name).toLowerCase() === 'admin');
        if (!hasAdmin) {
          cleaned.unshift(INITIAL_STAFF_MEMBERS[0]);
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
    username: u.username || u.name,
    password: u.password || 'admin123',
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
      const initials = (updatedFields.name || u.name)
        .split(' ')
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .join('')
        .slice(0, 2) || u.initials || 'US';

      const role = updatedFields.role || (Array.isArray(updatedFields.roles) ? updatedFields.roles[0] : u.role);
      const roles = Array.isArray(updatedFields.roles) && updatedFields.roles.length > 0 ? updatedFields.roles : (u.roles || [role]);

      updatedUser = {
        ...u,
        ...updatedFields,
        initials,
        role,
        roles
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
 */
export function deleteStaffUser(id) {
  const staffList = getStaffList();
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
 */
export function toggleUserStatus(id) {
  const staffList = getStaffList();
  let nextStatus = 'Active';
  let targetUser = null;

  const updatedList = staffList.map(u => {
    if (String(u.id) === String(id)) {
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

  // Find matching user by username, name or email
  const user = staffList.find(u => 
    (u.username && u.username.toLowerCase() === input) ||
    (u.name && u.name.toLowerCase() === input) ||
    (u.email && u.email.toLowerCase() === input)
  );

  if (!user) {
    return { success: false, error: `Invalid User ID or Email "${usernameOrEmail}". Account not found.` };
  }

  // Check password
  const expectedPassword = user.password || (user.name === 'admin' ? 'admin123' : user.name === 'shivam' ? 'shivam123' : 'Paisa@1234');
  if (user.password && user.password !== password) {
    return { success: false, error: 'Incorrect Password. Please check and try again.' };
  }

  // Check account status
  if (user.status === 'Disabled') {
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
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
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
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      try { sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user)); } catch (e) {}
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      try { sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
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
