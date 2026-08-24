import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { INITIAL_STAFF_MEMBERS } from '../data/staffData';

export default function MyProfileView({ currentUser }) {
  const user = currentUser || INITIAL_STAFF_MEMBERS[1]; // default to shivam

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
          My Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your active staff account details and security
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
            {user.initials || 'US'}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">{user.name}</h2>
            <div className="text-xs text-blue-100 font-mono font-medium">
              {user.email}
            </div>
            <div className="pt-1">
              <span className="px-3 py-0.5 text-[11px] font-semibold rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-md">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Branch & Session details */}
        <div className="grid grid-cols-3 gap-8 text-xs border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-8 font-mono z-10 w-full md:w-auto">
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">BRANCH</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.branch || 'Delhi'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">MEMBER SINCE</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.created || '20/08/2026'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">LAST SESSION</div>
            <div className="font-bold text-white text-sm mt-0.5">{user.lastLogin || 'Active'}</div>
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
                <span>Username</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">{user.name}</span>
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
              <span className="font-bold text-slate-800">{user.branch || 'Delhi'}</span>
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
              WAYS YOU CAN SIGN IN
            </span>

            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">Username</div>
                  <div className="font-bold text-slate-800 font-mono">{user.name}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <div className="text-[10px] text-slate-400">Email</div>
                  <div className="font-bold text-slate-800 font-mono">{user.email}</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              All sign-in methods use your official creator account credentials.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-800">Password</div>
                <div className="text-[11px] text-slate-400">Use a strong password you don't reuse elsewhere.</div>
              </div>

              <button
                onClick={() => alert("Change password modal...")}
                className="px-3.5 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition shrink-0 cursor-pointer"
              >
                Change password
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Recent sign-in activity */}
      <div className="crm-card bg-white p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-1.5 h-4 rounded-full bg-emerald-500"></span>
          <h3 className="text-sm font-bold text-slate-800">Recent sign-in activity</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              Success
            </span>
            <span className="font-semibold text-slate-800">Chrome · Windows</span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            127.0.0.1 &nbsp; {user.lastLogin || '22/08/2026, 16:30'}
          </div>
        </div>
      </div>

    </div>
  );
}
