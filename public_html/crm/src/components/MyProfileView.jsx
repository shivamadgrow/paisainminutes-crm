import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle2, XCircle, KeyRound, X, Check, Copy, RefreshCw } from 'lucide-react';
import { getCurrentUser, resetStaffPassword } from '../utils/authService';

export default function MyProfileView({ currentUser }) {
  const user = currentUser || getCurrentUser() || {
    id: '1',
    name: 'Admin',
    email: 'admin@paisainminutes.com',
    role: 'Super Admin',
    branch: 'Delhi Head Office',
    created: '20/08/2026',
    lastLogin: 'Active'
  };

  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    if (user.id) {
      resetStaffPassword(user.id, newPassword.trim());
      showToast('✅ Password changed successfully!');
      setIsChangePassOpen(false);
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3977] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce border border-blue-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
          My Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your active staff account details, roles and authentication security
        </p>
      </div>

      {/* Blue / Violet Gradient Hero Card */}
      <div 
        className="crm-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl rounded-2xl border border-blue-900 overflow-hidden relative"
        style={{ 
          background: 'linear-gradient(135deg, #0A3977 0%, #154585 50%, #4F46E5 100%)',
          color: '#ffffff'
        }}
      >
        
        {/* User Info */}
        <div className="flex items-center gap-5 z-10">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0 backdrop-blur-xs">
            {user.initials || user.name?.slice(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">{user.name}</h2>
            <div className="text-xs text-blue-100 font-mono font-medium">
              {user.email}
            </div>
            <div className="pt-1 flex items-center gap-2">
              <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-md">
                {user.role || 'Super Admin'}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400/30 text-emerald-200 border border-emerald-400/40">
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Branch & Session details */}
        <div className="grid grid-cols-3 gap-8 text-xs border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-8 font-mono z-10 w-full md:w-auto">
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">BRANCH</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.branch || 'Delhi Head Office'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">MEMBER SINCE</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.created || '20/08/2026'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">LAST SESSION</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.lastLogin || 'Just now'}</div>
          </div>
        </div>

      </div>

      {/* 2 Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Account details */}
        <div className="crm-card bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 rounded-full bg-[#0A3977]"></span>
            <h3 className="text-sm font-bold text-slate-800">Account details</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-500">
                <User className="w-4 h-4 text-slate-400" />
                <span>Username / Sign-In ID</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">{user.username || user.name}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">{user.email}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Role</span>
              </div>
              <span className="font-bold text-[#0A3977]">{user.role}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Branch</span>
              </div>
              <span className="font-bold text-slate-800">{user.branch || 'Delhi Head Office'}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Status</span>
              </div>
              <span className="font-bold text-emerald-600 font-mono">{user.status || 'Active'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sign-in & security */}
        <div className="crm-card bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-1.5 h-4 rounded-full bg-amber-500"></span>
            <h3 className="text-sm font-bold text-slate-800">Sign-in & security</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              AUTHORIZED SIGN-IN METHODS
            </span>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">User ID / Username</div>
                  <div className="font-bold text-slate-800 font-mono">{user.username || user.name}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">Email Address</div>
                  <div className="font-bold text-slate-800 font-mono">{user.email}</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Your staff credentials grant authorized role-based access to the Paisa in Minutes CRM.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-800">Password</div>
                <div className="text-[11px] text-slate-400">Keep your account secure with a strong password.</div>
              </div>

              <button
                onClick={() => setIsChangePassOpen(true)}
                className="px-3.5 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition shrink-0 cursor-pointer"
              >
                Change password
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Change Password Modal */}
      {isChangePassOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-fade-in text-slate-800">
            <button 
              onClick={() => setIsChangePassOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0A3977] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Change My Password</h3>
              <p className="text-xs text-slate-500">
                Enter your new password below for account <strong className="text-slate-800">{user.name}</strong>
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A3977] hover:bg-blue-900 text-white font-bold rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
