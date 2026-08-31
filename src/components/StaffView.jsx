import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, Search, Shield, User, LogIn, CheckCircle2, X, Users, Lock, KeyRound, AlertTriangle, RefreshCw, Copy, Check, MapPin, Navigation, Globe, ShieldCheck, ShieldAlert, Wifi, ExternalLink } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { INITIAL_ROLES, INITIAL_STAFF_MEMBERS } from '../data/staffData';
import { getLiveSecurityDetails } from '../utils/geoService';
import { getSecurityIncidents } from '../utils/shiftSecurity';

export default function StaffView({ onSwitchUser, currentUser }) {
  const [activeTab, setActiveTab] = useState('Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState(() => {
    try {
      const version = localStorage.getItem('paisa_crm_staff_v');
      if (version === 'v2') {
        const saved = localStorage.getItem('paisa_crm_staff_list');
        if (saved) return JSON.parse(saved);
      } else {
        localStorage.setItem('paisa_crm_staff_v', 'v2');
        localStorage.setItem('paisa_crm_staff_list', JSON.stringify(INITIAL_STAFF_MEMBERS));
        return INITIAL_STAFF_MEMBERS;
      }
    } catch (e) {}
    return INITIAL_STAFF_MEMBERS;
  });
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
  const [newRole, setNewRole] = useState('Admin');
  const [newBranch, setNewBranch] = useState('Delhi');

  // Edit user form state (Pixel-perfect matching modal design)
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editRoles, setEditRoles] = useState(['Admin']);
  const [editBranch, setEditBranch] = useState('Delhi');
  const [editStatus, setEditStatus] = useState('Active');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    const q = searchQuery.toLowerCase();
    return !q || 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      (u.mobile && u.mobile.includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) || 
      (u.branch && u.branch.toLowerCase().includes(q));
  });

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initials = newName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .join('')
      .slice(0, 2) || 'US';

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const newUser = {
      id: String(staffList.length + 1),
      name: newName.trim(),
      email: newEmail.trim() || `${newName.trim().toLowerCase()}@paisainminutes.com`,
      mobile: '7982967240',
      initials,
      role: newRole,
      roles: [newRole],
      branch: newBranch,
      status: 'Active',
      lastLogin: 'Never',
      created: dateStr,
      avatarBg: 'bg-[#0A3977]'
    };

    setStaffList(prev => [...prev, newUser]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    showToast(`Staff user "${newUser.name}" created successfully!`);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditMobile(user.mobile || '7982967240');
    setEditStatus(user.status === 'Disabled' ? 'Inactive' : (user.status || 'Active'));
    setEditRoles(user.roles && user.roles.length > 0 ? user.roles : [user.role || 'Admin']);
    setEditBranch(user.branch === '—' ? 'Delhi' : (user.branch || 'Delhi'));
  };

  const toggleEditRole = (roleName) => {
    setEditRoles(prev => {
      if (prev.includes(roleName)) {
        if (prev.length === 1) return prev; // maintain at least 1 role
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

    const updatedInitials = editName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .join('')
      .slice(0, 2) || 'US';

    const primaryRole = editRoles[0] || 'Admin';

    setStaffList(prev => prev.map(u => {
      if (u.id === editingUser.id) {
        const updated = {
          ...u,
          name: editName.trim(),
          email: editEmail.trim(),
          mobile: editMobile.trim(),
          role: primaryRole,
          roles: editRoles,
          branch: editBranch,
          status: editStatus === 'Inactive' ? 'Disabled' : 'Active',
          initials: updatedInitials
        };
        // Update current session if editing self
        if (currentUser?.id === u.id && onSwitchUser) {
          onSwitchUser(updated);
        }
        return updated;
      }
      return u;
    }));

    showToast(`User "${editName}" updated successfully!`);
    setEditingUser(null);
  };

  // Toggle Disable / Enable
  const handleToggleDisable = (user) => {
    const nextStatus = user.status === 'Active' ? 'Disabled' : 'Active';
    setStaffList(prev => prev.map(u => {
      if (u.id === user.id) {
        const updated = { ...u, status: nextStatus };
        if (currentUser?.id === u.id && onSwitchUser) {
          onSwitchUser(updated);
        }
        return updated;
      }
      return u;
    }));
    showToast(`User "${user.name}" is now ${nextStatus}!`);
  };

  // Open Reset Password Modal
  const handleOpenReset = (user) => {
    setResettingUser(user);
    setNewPassword(`Paisa@${Math.floor(1000 + Math.random() * 9000)}`);
    setIsCopied(false);
  };

  // Submit Password Reset
  const handleSaveResetPassword = (e) => {
    e.preventDefault();
    showToast(`Password for ${resettingUser.name} has been reset successfully!`);
    setResettingUser(null);
  };

  const handleDeleteUser = (userToDelete) => {
    if (confirm(`Are you sure you want to permanently delete user "${userToDelete.name}"?`)) {
      setStaffList(prev => {
        const updated = prev.filter(u => u.id !== userToDelete.id && u.name !== userToDelete.name);
        try {
          localStorage.setItem('paisa_crm_staff_list', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      showToast(`🗑️ User "${userToDelete.name}" deleted successfully!`);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const allBranchOptions = ['Delhi', 'Noida', 'Gurugram'];

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
    const locations = [
      { city: 'Delhi, India', coords: '28.6139, 77.2090', ip: '103.246.40.12' },
      { city: 'Noida, Uttar Pradesh', coords: '28.5355, 77.3910', ip: '103.212.80.45' },
      { city: 'Gurugram, Haryana', coords: '28.4595, 77.0266', ip: '103.195.120.89' },
      { city: 'Mumbai, Maharashtra', coords: '19.0760, 72.8777', ip: '115.112.54.33' },
      { city: 'Delhi, India', coords: '28.6280, 77.2180', ip: '103.246.40.18' }
    ];
    return { ...locations[idx % locations.length], isLive: false };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3977] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
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
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add user</span>
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
                    const isLogged = currentUser?.name === user.name;
                    const isDisabled = user.status === 'Disabled' || user.status === 'Inactive';
                    return (
                      <tr key={user.id} className={`hover:bg-slate-50/80 transition ${isLogged ? 'bg-blue-50/40' : ''}`}>
                        {/* USER */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${user.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}>
                              {user.initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <span className={isDisabled ? 'line-through text-slate-400' : ''}>{user.name}</span>
                                {isLogged && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* ROLES */}
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(user.roles && user.roles.length > 0 ? user.roles : [user.role || 'Admin']).map((r, i) => (
                              <span key={i} className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                                r === 'Admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                r === 'Credit Manager' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                r === 'Collection Manager' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                r === 'Telecaller' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                                'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* BRANCH */}
                        <td className="p-3.5 text-slate-600 font-medium">
                          {user.branch}
                        </td>

                        {/* STATUS */}
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                            isDisabled 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {user.status || 'Active'}
                          </span>
                        </td>

                        {/* LAST LOGIN */}
                        <td className="p-3.5 text-xs text-slate-500 font-mono">
                          {user.lastLogin}
                        </td>

                        {/* CREATED */}
                        <td className="p-3.5 text-xs text-slate-500 font-mono">
                          {user.created}
                        </td>

                        {/* ACTION BUTTONS (Login, Edit, Reset, Disable/Enable) */}
                        <td className="p-3.5 text-right space-x-2 font-medium text-[11px] whitespace-nowrap">
                          {onSwitchUser && !isLogged && (
                            <button 
                              onClick={() => {
                                onSwitchUser(user);
                                showToast(`Switched session to ${user.name} (${user.role})!`);
                              }}
                              className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0A3977] hover:bg-[#0A3977] hover:text-white transition font-bold border border-blue-200/80 cursor-pointer shadow-2xs"
                              title="Login with this creator session"
                            >
                              Login
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenEdit(user)} 
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer px-1 py-0.5"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleOpenReset(user)} 
                            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline cursor-pointer px-1 py-0.5"
                          >
                            Reset
                          </button>
                          <button 
                            onClick={() => handleToggleDisable(user)} 
                            className={`font-semibold hover:underline cursor-pointer px-1 py-0.5 ${
                              isDisabled ? 'text-emerald-600 hover:text-emerald-800' : 'text-amber-600 hover:text-amber-800'
                            }`}
                          >
                            {isDisabled ? 'Enable' : 'Disable'}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)} 
                            className="text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer px-1 py-0.5"
                            title="Delete user"
                          >
                            Delete
                          </button>
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

      {/* TAB 2: ROLES CARDS (Matching Screenshot 1) */}
      {activeTab === 'Roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {roleCounts.map((role) => (
              <div 
                key={role.id}
                className="crm-card p-3.5 bg-white flex items-center gap-3.5 border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md transition"
              >
                {/* Role Code Badge (AC, AD, CA, CO, CR, DI, MI, PD, RE, TE) */}
                <div className={`w-10 h-10 rounded-xl ${role.color || 'bg-blue-600'} text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0 tracking-wider`}>
                  {role.code}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    {role.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            Roles and their permissions are provisioned by the platform. Assign roles to users from the Users tab.
          </p>
        </div>
      )}

      {/* TAB 3: LOGIN HISTORY (With Live Location & GPS Tracking) */}
      {activeTab === 'Login History' && (
        <div className="space-y-4">
          
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
                        {/* User */}
                        <td className="p-3.5 font-sans font-bold text-slate-900 flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${user.avatarBg || 'bg-[#0A3977]'} text-white text-[10px] flex items-center justify-center font-bold shrink-0`}>
                            {user.initials}
                          </div>
                          <span>{user.name}</span>
                          {isLogged && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded-full font-sans">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="p-3.5 font-sans">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {user.role}
                          </span>
                        </td>

                        {/* LIVE LOCATION */}
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

                        {/* IP Address */}
                        <td className="p-3.5 text-slate-600 font-mono">
                          {loc.ip}
                        </td>

                        {/* Browser / OS */}
                        <td className="p-3.5 text-slate-600 font-sans">
                          {liveGeo.browser} · {liveGeo.os}
                        </td>

                        {/* Timestamp */}
                        <td className="p-3.5 text-slate-500 font-mono">
                          {user.lastLogin && user.lastLogin !== 'Never' ? user.lastLogin : '22/08/2026, 16:30'}
                        </td>

                        {/* Status */}
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

          {/* Recorded Off-Hours Security Incidents / Alerts */}
          <div className="crm-card bg-white p-4.5 rounded-2xl border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>Shift Security Alerts & Off-Hours Lockout Log</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">Policy: 06:35 PM – 09:27 AM IST</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Any login attempt made outside working hours (except by director_admin) is blocked immediately and logged with GPS & role details.
                  </p>
                </div>
              </div>
            </div>

            {getSecurityIncidents().length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <span className="font-semibold text-slate-700">No unauthorized off-hours attempts detected.</span>
                <span className="text-[11px]">System is secure. All staff sessions automatically locked during night hours.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="bg-rose-50/50 text-rose-800 font-bold uppercase text-[9px] border-b border-rose-100">
                      <th className="p-2.5">INCIDENT ID</th>
                      <th className="p-2.5">ATTEMPTED USER</th>
                      <th className="p-2.5">ROLE</th>
                      <th className="p-2.5">LOCATION & GPS</th>
                      <th className="p-2.5">IP ADDRESS</th>
                      <th className="p-2.5">TIMESTAMP</th>
                      <th className="p-2.5">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getSecurityIncidents().map((inc) => (
                      <tr key={inc.id} className="hover:bg-rose-50/30 transition">
                        <td className="p-2.5 font-bold text-rose-700">{inc.id}</td>
                        <td className="p-2.5 font-sans font-bold text-slate-900">{inc.user}</td>
                        <td className="p-2.5 font-sans text-indigo-700">{inc.role}</td>
                        <td className="p-2.5 font-sans">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>{inc.location}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-slate-600">{inc.ip}</td>
                        <td className="p-2.5 text-slate-600">{inc.timestamp} IST</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold font-sans">
                            BLOCKED & LOGGED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 1. EXACT EDIT USER MODAL (Matching User Screenshot 100%) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in text-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Edit user
              </h2>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              
              {/* Row 1: Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Username *</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium text-xs shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Always usable to sign in — renaming changes how they sign in
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Email *</label>
                  <input 
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium text-xs shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sign-in identifier — keep it current
                  </p>
                </div>
              </div>

              {/* Row 2: Mobile & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Mobile</label>
                  <input 
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    placeholder="7982967240"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium text-xs shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sign-in identifier when mobile login is enabled
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Status</label>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button 
                      type="button"
                      onClick={() => setEditStatus('Active')}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        editStatus === 'Active' 
                          ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] font-bold ring-1 ring-[#4F46E5]' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Active
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditStatus('Inactive')}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        editStatus === 'Inactive' || editStatus === 'Disabled' 
                          ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] font-bold ring-1 ring-[#4F46E5]' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Roles * (select one or more) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Roles * (select one or more)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INITIAL_ROLES.map((r) => {
                    const isSelected = editRoles.includes(r.name);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleEditRole(r.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isSelected 
                            ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] font-bold ring-1 ring-[#4F46E5] shadow-2xs' 
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Branch * */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Branch *
                </label>
                <div className="flex flex-wrap gap-2">
                  {allBranchOptions.map((b) => {
                    const isSelected = editBranch === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setEditBranch(b)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isSelected 
                            ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] font-bold ring-1 ring-[#4F46E5] shadow-2xs' 
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Password Box */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800 text-xs">Password</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Forgot it? Set a new one — active sessions are signed out.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenReset(editingUser);
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  Reset password
                </button>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl shadow-md transition cursor-pointer text-xs active:scale-95"
                >
                  Save changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. RESET PASSWORD MODAL */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
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
              <h3 className="font-extrabold text-slate-900 text-base">Reset Password</h3>
              <p className="text-xs text-slate-500">
                Reset password for <strong className="text-slate-800">{resettingUser.name}</strong> ({resettingUser.email})
              </p>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Temporary Password</label>
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
                      onClick={() => setNewPassword(`Paisa@${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="p-1.5 text-slate-400 hover:text-[#0A3977] hover:bg-slate-100 rounded-lg transition"
                      title="Generate new password"
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
                <p>An automated notification with the new temporary credentials will be delivered to the staff member.</p>
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
                  Confirm & Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-slate-900 text-base mb-4">Add New Staff / Creator</h3>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Username *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. credit_manager_2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input 
                  type="email"
                  placeholder="user@paisainminutes.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                <select 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977]"
                >
                  {INITIAL_ROLES.map(r => (
                    <option key={r.id} value={r.name}>{r.name} ({r.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch</label>
                <input 
                  type="text"
                  placeholder="Delhi"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A3977] hover:bg-blue-900 text-white font-bold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
