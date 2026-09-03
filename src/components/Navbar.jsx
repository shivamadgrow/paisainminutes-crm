import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  LogOut, 
  Menu, 
  UserCheck, 
  ChevronDown, 
  Shield, 
  Users, 
  CheckCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Sparkles,
  RotateCcw,
  X
} from 'lucide-react';
import { getStaffList, purgeAllClientCaches } from '../utils/authService';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  setIsMobileOpen, 
  setActiveTab, 
  currentUser, 
  onOpenLogin, 
  onSwitchUser,
  onLogout 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [staffList, setStaffList] = useState(() => getStaffList());
  
  const notifRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleStaffUpdated = (e) => {
      setStaffList(e.detail || getStaffList());
    };
    window.addEventListener('paisa_staff_updated', handleStaffUpdated);
    return () => window.removeEventListener('paisa_staff_updated', handleStaffUpdated);
  }, []);

  const activeUser = currentUser || {
    name: 'Admin',
    role: 'Super Admin',
    email: 'admin@paisainminutes.com',
    initials: 'AD',
    avatarBg: 'bg-[#0A3977]'
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsNotificationsOpen(false);
    if (onLogout) {
      onLogout();
    } else if (onOpenLogin) {
      onOpenLogin();
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'lead',
      title: 'New Lead Submission',
      desc: 'Application received from verified phone +91 9818052620',
      time: 'Just now',
      unread: true,
      action: 'leads'
    },
    {
      id: 2,
      type: 'system',
      title: 'Render Cloud DB Sync',
      desc: 'Real-time database polling active (3s interval)',
      time: '2m ago',
      unread: false,
      action: 'executive'
    },
    {
      id: 3,
      type: 'security',
      title: 'Shift & Security Active',
      desc: 'Operational shift (09:27 AM – 06:35 PM IST) verified',
      time: '10m ago',
      unread: false,
      action: 'staff'
    }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={() => setIsMobileOpen(prev => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, mobile, loan no., PAN, reference..."
            className="block w-full pl-9 pr-16 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:border-transparent text-slate-800 placeholder-slate-400 transition"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications, User Profile / Creator Switcher & Logout */}
      <div className="flex items-center gap-2 sm:gap-3 relative">
        
        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(prev => !prev);
              setIsDropdownOpen(false);
            }}
            className={`relative p-2 rounded-full transition cursor-pointer ${
              isNotificationsOpen 
                ? 'bg-blue-50 text-[#0A3977]' 
                : 'text-slate-500 hover:text-[#0A3977] hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-0 z-50 animate-fade-in text-slate-800 overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  {hasUnread && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-[#0A3977]">
                      1 New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasUnread && (
                    <button
                      onClick={() => setHasUnread(false)}
                      className="text-[11px] font-semibold text-[#0A3977] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (setActiveTab && n.action) setActiveTab(n.action);
                      setIsNotificationsOpen(false);
                      setHasUnread(false);
                    }}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer ${
                      n.unread && hasUnread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {n.type === 'lead' && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0A3977] flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      {n.type === 'system' && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {n.type === 'security' && (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (setActiveTab) setActiveTab('leads');
                    setIsNotificationsOpen(false);
                  }}
                  className="w-full text-center py-1.5 text-xs font-bold text-[#0A3977] hover:bg-blue-100/50 rounded-lg transition cursor-pointer"
                >
                  View All Live Leads →
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Creator Switcher Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button 
            onClick={() => {
              setIsDropdownOpen(prev => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition cursor-pointer"
            title="User Account details"
          >
            <div className={`w-8 h-8 rounded-full ${activeUser.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}>
              {activeUser.initials || 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                <span>{activeUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] font-semibold text-slate-500">
                {activeUser.role}
              </div>
            </div>
          </button>

          {/* Switcher Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in text-slate-800">
              <div className="p-2 border-b border-slate-100 mb-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Signed In As</div>
                <div className="text-xs font-bold text-slate-900">{activeUser.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{activeUser.email}</div>
                <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#0A3977]">
                  {activeUser.role}
                </span>
              </div>

              {/* Quick Profile list */}
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between">
                <span>Switch Staff Account</span>
                <span className="text-slate-400 font-normal">{staffList.length} staff</span>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                {staffList.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      onSwitchUser(staff);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-1.5 rounded-lg text-left flex items-center justify-between text-xs transition cursor-pointer ${
                      activeUser.name === staff.name || activeUser.username === staff.username
                        ? 'bg-blue-50 text-[#0A3977] font-bold' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-5 h-5 rounded-full ${staff.avatarBg || 'bg-[#0A3977]'} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                        {staff.initials || 'ST'}
                      </div>
                      <span className="truncate">{staff.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{staff.role}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab && setActiveTab('profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Clear all local caches, duplicate stored data, and reload CRM?')) {
                      purgeAllClientCaches();
                      window.location.reload();
                    }
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Clear Cache & Reset Data</span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout / Lock Screen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct Logout Button */}
        <button 
          onClick={handleLogoutClick}
          className="ml-1 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-2xs cursor-pointer active:scale-95"
          title="Logout and Lock CRM"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

    </header>
  );
}
