import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Shield, 
  User, 
  LogIn, 
  CheckCircle2, 
  X, 
  Users, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  MapPin, 
  Navigation, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Wifi, 
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { INITIAL_ROLES } from '../data/staffData';
import { getLiveSecurityDetails } from '../utils/geoService';
import { getSecurityIncidents } from '../utils/shiftSecurity';
import { 
  getStaffList, 
  addStaffUser, 
  updateStaffUser, 
  resetStaffPassword, 
  deleteStaffUser, 
  toggleUserStatus,
  setCurrentUserSession 
} from '../utils/authService';

export default function StaffView({ onSwitchUser, currentUser }) {
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');

  // Live dynamic staff list from authService / localStorage
  const [staffList, setStaffList] = useState(() => getStaffList());

  // Listen to cross-app staff list updates
  useEffect(() => {
    const handleStaffUpdated = (e) => {
      if (e.detail) {
        setStaffList(e.detail);
      } else {
        setStaffList(getStaffList());
      }
    };
    window.addEventListener('paisa_staff_updated', handleStaffUpdated);
    return () => window.removeEventListener('paisa_staff_updated', handleStaffUpdated);
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live Location / Geo-Security state
  const [liveGeo, setLiveGeo] = useState({
    ip: '103.246.40.12',
    city: 'New Delhi',
    region: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    latitude: 28.6139,
    longitude: 77.2090,
    browser: 'Chrome',
    os: 'Windows 11',
    device: 'Desktop',
    accuracy: 'GPS Verified',
    isp: 'Airtel Broadband / Local Network'
  });
  const [isFetchingGeo, setIsFetchingGeo] = useState(false);

  // Fetch Live Geolocation on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchGeo = async () => {
      setIsFetchingGeo(true);
      try {
        const details = await getLiveSecurityDetails();
        if (isMounted && details) {
          setLiveGeo(details);
        }
      } catch (e) {
      } finally {
        if (isMounted) setIsFetchingGeo(false);
      }
    };
    fetchGeo();
    return () => { isMounted = false; };
  }, []);

  const handleRefreshLocation = async () => {
    setIsFetchingGeo(true);
    try {
      const details = await getLiveSecurityDetails();
      if (details) {
        setLiveGeo(details);
        showToast(`📍 Live Location updated: ${details.city}, ${details.region} (${details.latitude}, ${details.longitude})`);
      }
    } catch (e) {
      showToast("Unable to refresh GPS coordinates");
    } finally {
      setIsFetchingGeo(false);
    }
  };

  // Modals state for Edit & Reset Password
  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(true);
  const [newRole, setNewRole] = useState('Admin');
  const [newRoles, setNewRoles] = useState(['Admin']);
  const [newBranch, setNewBranch] = useState('Delhi Head Office');
  const [addError, setAddError] = useState('');

  // Edit user form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editRoles, setEditRoles] = useState(['Admin']);
  const [editBranch, setEditBranch] = useState('Delhi Head Office');
  const [editStatus, setEditStatus] = useState('Active');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Compute live role counts
  const roleCounts = INITIAL_ROLES.map(r => ({
    ...r,
    userCount: staffList.filter(u => {
      if (u.roles && Array.isArray(u.roles)) {
        return u.roles.some(roleName => roleName.toLowerCase() === r.name.toLowerCase());
      }
      return (u.role || '').toLowerCase() === r.name.toLowerCase();
    }).length
  }));

  const filteredStaff = staffList.filter(u => {
    if (!u || (!u.name && !u.username)) return false;
    const q = searchQuery.toLowerCase();
    return !q || 
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.username && u.username.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q)) || 
      (u.mobile && u.mobile.includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) || 
      (u.branch && u.branch.toLowerCase().includes(q));
  });

  const generateRandomPassword = () => {
    return `Paisa@${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleOpenAddModal = () => {
    setNewName('');
    setNewEmail('');
    setNewMobile('7982967240');
    setNewPass(generateRandomPassword());
    setShowNewPass(true);
    setNewRole('Admin');
    setNewRoles(['Admin']);
    setNewBranch('Delhi Head Office');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const toggleNewRole = (roleName) => {
    setNewRoles(prev => {
      if (prev.includes(roleName)) {
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
    setNewRole(roleName);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim()) {
      setAddError('Please enter username or full name');
      return;
    }
    if (!newPass.trim()) {
      setAddError('Please specify a password for this user');
      return;
    }

    const email = newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '_')}@paisainminutes.com`;

    const result = addStaffUser({
      name: newName.trim(),
      username: newName.trim().toLowerCase().replace(/\s+/g, '_'),
      email: email,
      mobile: newMobile.trim() || '7982967240',
      password: newPass.trim(),
      role: newRoles[0] || newRole || 'Admin',
      roles: newRoles,
      branch: newBranch || 'Delhi Head Office',
      status: 'Active'
    });

    if (!result.success) {
      setAddError(result.error);
      return;
    }

    // Refresh state
    setStaffList(getStaffList());
    setIsAddModalOpen(false);
    showToast(`✅ Profile "${result.user.name}" created! User ID: ${result.user.username} | Pass: ${result.user.password}`);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || user.username || '');
    setEditEmail(user.email || '');
    setEditMobile(user.mobile || '7982967240');
    setEditStatus(user.status === 'Disabled' ? 'Inactive' : (user.status || 'Active'));
    setEditRoles(user.roles && user.roles.length > 0 ? user.roles : [user.role || 'Admin']);
    setEditBranch(user.branch || 'Delhi Head Office');
  };

  const toggleEditRole = (roleName) => {
    setEditRoles(prev => {
      if (prev.includes(roleName)) {
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const primaryRole = editRoles[0] || 'Admin';

    const result = updateStaffUser(editingUser.id, {
      name: editName.trim(),
      username: editName.trim().toLowerCase().replace(/\s+/g, '_'),
      email: editEmail.trim(),
      mobile: editMobile.trim(),
      role: primaryRole,
      roles: editRoles,
      branch: editBranch,
      status: editStatus === 'Inactive' ? 'Disabled' : 'Active'
    });

    if (result.success) {
      setStaffList(getStaffList());
      if (currentUser?.id === editingUser.id && onSwitchUser) {
        onSwitchUser(result.user);
      }
      showToast(`User "${editName}" updated successfully!`);
      setEditingUser(null);
    }
  };

  // Toggle Disable / Enable
  const handleToggleDisable = (user) => {
    const result = toggleUserStatus(user.id);
    if (result.success) {
      setStaffList(getStaffList());
      showToast(`User "${user.name}" is now ${result.status}!`);
    }
  };

  // Open Reset Password Modal
  const handleOpenReset = (user) => {
    setResettingUser(user);
    setNewPassword(generateRandomPassword());
    setIsCopied(false);
  };

  // Submit Password Reset
  const handleSaveResetPassword = (e) => {
    e.preventDefault();
    if (!resettingUser || !newPassword.trim()) return;

    const result = resetStaffPassword(resettingUser.id, newPassword.trim());
    if (result.success) {
      setStaffList(getStaffList());
      showToast(`🔑 Password for ${resettingUser.name} reset to: ${newPassword}`);
      setResettingUser(null);
    }
  };

  const handleDeleteUser = (userToDelete) => {
    if (confirm(`Are you sure you want to permanently delete user "${userToDelete.name}"?`)) {
      deleteStaffUser(userToDelete.id);
      setStaffList(getStaffList());
      showToast(`🗑️ User "${userToDelete.name}" deleted successfully!`);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const allBranchOptions = ['Delhi Head Office'];

  // City helper for staff login simulation
  const getUserLocation = (user, idx) => {
    if (user.name === currentUser?.name && liveGeo.city) {
      return {
        city: `${liveGeo.city}, ${liveGeo.region || 'India'}`,
        coords: `${liveGeo.latitude}, ${liveGeo.longitude}`,
        ip: liveGeo.ip,
        isLive: true
      };
    }
    return {
      city: `${liveGeo.city || 'Delhi'}, ${liveGeo.region || 'India'}`,
      coords: `${liveGeo.latitude || '28.6139'}, ${liveGeo.longitude || '77.2090'}`,
      ip: liveGeo.ip || '103.246.40.12',
      isLive: false
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3977] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce border border-blue-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title & Top Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Staff
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            <span className="font-bold text-slate-800">{staffList.length} users</span> · <span className="font-bold text-slate-800">10 roles</span>
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add user</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit text-xs font-semibold text-slate-600">
        {['Users', 'Roles', 'Login History'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === tab 
                ? 'bg-white text-[#0A3977] font-bold shadow-xs' 
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'Users' && (
        <div className="space-y-4">
          {/* Search Input Bar & Excel Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search name, email, role or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
              />
            </div>

            <button 
              onClick={() => {
                const headers = ['User Name', 'Email', 'Role', 'Branch', 'Status', 'Last Login', 'Created Date'];
                const rows = filteredStaff.map(s => [s.name, s.email, s.role, s.branch, s.status, s.lastLogin, s.created]);
                exportToCsv(`paisa-crm-staff-users-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
              }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              title="Export Staff Users to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
          </div>

          {/* Staff Table Box */}
          <div className="crm-card bg-white overflow-hidden shadow-xs border border-slate-200/80 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                    <th className="p-3.5 min-w-[200px]">USER</th>
                    <th className="p-3.5">ROLES</th>
                    <th className="p-3.5">BRANCH</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5">LAST LOGIN</th>
                    <th className="p-3.5">CREATED</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStaff.map((user) => {
                    const isLogged = currentUser?.name === user.name || currentUser?.username === user.username;
                    const isDisabled = user.status === 'Disabled' || user.status === 'Inactive';
                    return (
                      <tr key={user.id} className={`hover:bg-slate-50/80 transition ${isLogged ? 'bg-blue-50/40' : ''}`}>
                        
                        {/* User info */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${user.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                              {user.initials || 'US'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isLogged && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Roles Pill */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(user.roles || [user.role || 'Admin']).map((r, idx) => (
                              <span 
                                key={idx}
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#0A3977] border border-blue-100"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="p-3.5 font-medium text-slate-700">
                          {user.branch || 'Delhi Head Office'}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isDisabled 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isDisabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>

                        {/* Last Login */}
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {user.lastLogin || 'Never'}
                        </td>

                        {/* Created Date */}
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {user.created || '20/08/2026'}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Login / Switch session */}
                            <button
                              onClick={() => {
                                onSwitchUser(user);
                                showToast(`Switched active session to "${user.name}"`);
                              }}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                                isLogged 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 pointer-events-none' 
                                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                              }`}
                              title="Sign in as this user"
                            >
                              {isLogged ? 'Active' : 'Login'}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Edit user details"
                            >
                              Edit
                            </button>

                            {/* Reset Password */}
                            <button
                              onClick={() => handleOpenReset(user)}
                              className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Reset Password"
                            >
                              Reset
                            </button>

                            {/* Disable / Enable */}
                            <button
                              onClick={() => handleToggleDisable(user)}
                              className={`px-2 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                                isDisabled 
                                  ? 'text-emerald-700 hover:bg-emerald-50' 
                                  : 'text-amber-700 hover:bg-amber-50'
                              }`}
                              title={isDisabled ? 'Enable user' : 'Disable user'}
                            >
                              {isDisabled ? 'Enable' : 'Disable'}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete user"
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES VIEW */}
      {activeTab === 'Roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleCounts.map((role) => (
            <div key={role.id} className="crm-card bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${role.color || 'bg-blue-600'} text-white flex items-center justify-center font-extrabold text-xs shadow-xs`}>
                    {role.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{role.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Role Code: {role.code}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0A3977] text-xs font-extrabold">
                  {role.userCount} users
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LOGIN HISTORY & GEO SECURITY */}
      {activeTab === 'Login History' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Live Geolocation Security Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-[#0A3977] to-indigo-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md border border-blue-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-blue-200">
                    Live Security Geolocation Engine
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Active & Encrypted
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Current Device Location:</span>
                  <strong className="text-white font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {liveGeo.city}, {liveGeo.region}, {liveGeo.country}
                  </strong>
                  <span className="text-blue-300 font-mono text-[11px]">({liveGeo.latitude}°, {liveGeo.longitude}°)</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-300 font-mono text-[11px]">IP: {liveGeo.ip}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleRefreshLocation}
              disabled={isFetchingGeo}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGeo ? 'animate-spin' : ''}`} />
              <span>{isFetchingGeo ? 'Fetching GPS...' : 'Refresh Live GPS'}</span>
            </button>
          </div>

          {/* Login History Table Box */}
          <div className="crm-card bg-white overflow-hidden shadow-xs border border-slate-200/80 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                    <th className="p-3.5">USER</th>
                    <th className="p-3.5">ROLE</th>
                    <th className="p-3.5 min-w-[220px]">LIVE LOCATION (GPS / CITY)</th>
                    <th className="p-3.5">IP ADDRESS</th>
                    <th className="p-3.5">BROWSER / OS</th>
                    <th className="p-3.5">TIMESTAMP</th>
                    <th className="p-3.5">SECURITY STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                  {staffList.map((user, idx) => {
                    const loc = getUserLocation(user, idx);
                    const isLogged = currentUser?.name === user.name;
                    return (
                      <tr key={user.id} className={`hover:bg-slate-50/80 transition ${isLogged ? 'bg-blue-50/30' : ''}`}>
                        <td className="p-3.5 font-sans font-bold text-slate-900 flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${user.avatarBg || 'bg-[#0A3977]'} text-white text-[10px] flex items-center justify-center font-bold shrink-0`}>
                            {user.initials || 'US'}
                          </div>
                          <span>{user.name}</span>
                          {isLogged && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full font-sans">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {user.role}
                          </span>
                        </td>

                        <td className="p-3.5 font-sans">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                <span>{loc.city}</span>
                                {loc.isLive && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                GPS: {loc.coords}
                              </div>
                            </div>
                            <a
                              href={`https://www.google.com/maps?q=${loc.coords}`}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-auto p-1 text-slate-400 hover:text-blue-600 transition"
                              title="View on Google Maps"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-600 font-mono">
                          {loc.ip}
                        </td>

                        <td className="p-3.5 text-slate-600 font-sans">
                          {liveGeo.browser} · {liveGeo.os}
                        </td>

                        <td className="p-3.5 text-slate-500 font-mono">
                          {user.lastLogin && user.lastLogin !== 'Never' ? user.lastLogin : 'Active'}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit font-sans">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1. ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in text-slate-800">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Add New Staff / Creator Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set credentials and permissions for new team member
              </p>
            </div>

            {addError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              {/* Row 1: Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Username / Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. rohit_credit or priya_telecaller"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Used as sign-in ID</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input 
                    type="email"
                    placeholder="user@paisainminutes.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Optional secondary sign-in</p>
                </div>
              </div>

              {/* Row 2: Mobile & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input 
                    type="text"
                    placeholder="7982967240"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      Login Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewPass(generateRandomPassword())}
                      className="text-[10px] text-[#0A3977] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="e.g. Paisa@4921"
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(prev => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Role Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Role(s) *
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {INITIAL_ROLES.map(r => {
                    const isSelected = newRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleNewRole(r.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A3977] text-white border-[#0A3977] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Branch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned Branch *
                </label>
                <div className="flex flex-wrap gap-2">
                  {allBranchOptions.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNewBranch(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        newBranch === b
                          ? 'border-[#0A3977] bg-blue-50 text-[#0A3977] font-bold ring-1 ring-[#0A3977]'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0A3977] hover:bg-blue-900 text-white font-bold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Create Profile & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit user profile</h2>
                <p className="text-xs text-slate-400">Update staff details and access levels</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input 
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile</label>
                  <input 
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button 
                      type="button"
                      onClick={() => setEditStatus('Active')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        editStatus === 'Active' 
                          ? 'border-[#0A3977] bg-blue-50 text-[#0A3977] font-bold ring-1 ring-[#0A3977]' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Active
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditStatus('Inactive')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        editStatus === 'Inactive' || editStatus === 'Disabled' 
                          ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-1 ring-rose-500' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Disabled
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Roles *</label>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_ROLES.map((r) => {
                    const isSelected = editRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleEditRole(r.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isSelected 
                            ? 'border-[#0A3977] bg-blue-50 text-[#0A3977] font-bold ring-1 ring-[#0A3977]' 
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Branch *</label>
                <div className="flex flex-wrap gap-2">
                  {allBranchOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditBranch(b)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        editBranch === b 
                          ? 'border-[#0A3977] bg-blue-50 text-[#0A3977] font-bold ring-1 ring-[#0A3977]' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800 text-xs">Password Management</div>
                  <div className="text-[11px] text-slate-500">Reset or set a new password for this user</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenReset(editingUser)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap"
                >
                  Reset password
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0A3977] hover:bg-blue-900 text-white font-bold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. RESET PASSWORD MODAL */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in text-slate-800">
            <button 
              onClick={() => setResettingUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Reset User Password</h3>
              <p className="text-xs text-slate-500">
                Reset password for <strong className="text-slate-800">{resettingUser.name}</strong> ({resettingUser.email})
              </p>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-24 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-mono font-bold tracking-wider"
                  />
                  <div className="absolute inset-y-0 right-1 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNewPassword(generateRandomPassword())}
                      className="p-1.5 text-slate-400 hover:text-[#0A3977] hover:bg-slate-100 rounded-lg transition"
                      title="Generate new random password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] space-y-1">
                <p className="font-semibold">Security Note:</p>
                <p>The user can sign in immediately using this new password with their User ID <strong>{resettingUser.username || resettingUser.name}</strong>.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A3977] hover:bg-blue-900 text-white font-bold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Confirm & Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
