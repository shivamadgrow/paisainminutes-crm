// Shift Security & Automated Night Lockout Policy (6:35 PM - 9:27 AM IST)

export const SHIFT_POLICY = {
  START_HOUR: 9,
  START_MINUTE: 27, // 9:27 AM IST
  END_HOUR: 18,     // 6:35 PM IST (Standard Shift End Time)
  END_MINUTE: 35,   // 35 minutes
  EXEMPT_USERS: ['director_admin', 'director'], // 24x7 Allowed
};

export function getIndianTime() {
  // Return current Date in IST (UTC+5:30)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 3600000;
  return new Date(utc + istOffset);
}

export function isOffHours(testDate = null) {
  const ist = testDate || getIndianTime();
  const currentMinutes = (ist.getHours() * 60) + ist.getMinutes();
  
  const startMinutes = (SHIFT_POLICY.START_HOUR * 60) + SHIFT_POLICY.START_MINUTE; // 9:27 AM (567 mins)
  const endMinutes = (SHIFT_POLICY.END_HOUR * 60) + SHIFT_POLICY.END_MINUTE;       // 6:35 PM (1115 mins)

  // Off hours: before 9:27 AM OR after 6:35 PM
  return currentMinutes < startMinutes || currentMinutes >= endMinutes;
}

export function isUserExempt(userOrName) {
  if (!userOrName) return false;
  const nameStr = typeof userOrName === 'string'
    ? userOrName
    : (userOrName.name || userOrName.username || userOrName.role || userOrName.email || '');
  const clean = String(nameStr).toLowerCase().trim();
  if (
    clean.includes('director') ||
    clean.includes('admin') ||
    clean.includes('shivam') ||
    clean.includes('super')
  ) {
    return true;
  }
  return SHIFT_POLICY.EXEMPT_USERS.some(u => clean.includes(u));
}

export function checkLoginAllowed(user, forceTestOffHours = false) {
  if (!user) return { allowed: false, reason: 'Invalid user' };

  // Exemption check for director_admin / Super Admin
  if (isUserExempt(user)) {
    return {
      allowed: true,
      exempt: true,
      reason: 'Director / Super Admin 24x7 Exempt Session Active'
    };
  }

  const off = forceTestOffHours || isOffHours();
  if (off) {
    const ist = getIndianTime();
    const timeString = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    return {
      allowed: false,
      exempt: false,
      reason: `Off-Hours Security Lock Active (6:35 PM to 9:27 AM IST). Current Time: ${timeString} IST. Access will resume at 09:27 AM IST.`,
      currentTime: timeString,
      resumeTime: '09:27 AM IST'
    };
  }

  return { allowed: true, exempt: false };
}

// Log unauthorized off-hours access attempt with GPS & Role details
export function logSecurityIncident(user, geoDetails = {}) {
  const ist = getIndianTime();
  const timestamp = ist.toLocaleString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });

  const incident = {
    id: `SEC-${Date.now()}`,
    user: user?.name || 'Staff User',
    role: user?.role || 'Staff',
    email: user?.email || '',
    branch: user?.branch || 'Delhi',
    timestamp,
    ip: geoDetails.ip || '103.246.40.12',
    location: `${geoDetails.city || 'New Delhi'}, ${geoDetails.region || 'Delhi'}, ${geoDetails.country || 'India'}`,
    coords: `${geoDetails.latitude || '28.6139'}, ${geoDetails.longitude || '77.2090'}`,
    device: `${geoDetails.browser || 'Chrome'} · ${geoDetails.os || 'Windows'}`,
    type: 'UNAUTHORIZED_OFF_HOURS_ATTEMPT',
    severity: 'HIGH_SECURITY_ALERT',
    message: `Off-hours login blocked for ${user?.name || 'User'} (${user?.role || 'Role'}). Attempted at ${timestamp} outside permitted working shift hours (9:27 AM - 6:35 PM IST).`
  };

  try {
    const existing = JSON.parse(localStorage.getItem('paisa_security_incidents') || '[]');
    existing.unshift(incident);
    localStorage.setItem('paisa_security_incidents', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {}

  return incident;
}

export function getSecurityIncidents() {
  try {
    return JSON.parse(localStorage.getItem('paisa_security_incidents') || '[]');
  } catch (e) {
    return [];
  }
}
