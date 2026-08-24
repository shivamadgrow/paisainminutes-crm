import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, CheckCircle2, X, AlertTriangle, ShieldAlert, MapPin, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import paisaLogo from '../assets/paisa-logo.png';
import { INITIAL_STAFF_MEMBERS } from '../data/staffData';
import { checkLoginAllowed, logSecurityIncident, isOffHours, getIndianTime } from '../utils/shiftSecurity';
import { getLiveSecurityDetails } from '../utils/geoService';

export default function LoginModal({ isOpen, onClose, onLogin, currentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [blockedIncident, setBlockedIncident] = useState(null);
  const [isSimulatingOffHours, setIsSimulatingOffHours] = useState(false);

  if (!isOpen) return null;

  const handleAttemptLogin = async (staffUser) => {
    // 1. Check Shift Security Policy (6:35 PM - 9:27 AM IST)
    const check = checkLoginAllowed(staffUser, isSimulatingOffHours);

    if (!check.allowed) {
      // Fetch Live Location & GPS details
      const geo = await getLiveSecurityDetails();
      const incident = logSecurityIncident(staffUser, geo);
      setBlockedIncident({
        ...incident,
        reason: check.reason,
        currentTime: check.currentTime,
        resumeTime: check.resumeTime
      });
      return;
    }

    // Allowed (e.g. director_admin or within 9:27 AM - 6:35 PM IST)
    setBlockedIncident(null);
    onLogin(staffUser);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter username or email');
      return;
    }

    // Find matching staff member or create custom user
    const found = INITIAL_STAFF_MEMBERS.find(
      u => u.name.toLowerCase() === username.trim().toLowerCase() || 
           u.email.toLowerCase() === username.trim().toLowerCase()
    );

    const targetUser = found || {
      id: `usr-${Date.now()}`,
      name: username.trim(),
      email: `${username.trim().toLowerCase()}@paisainminutes.com`,
      initials: username.trim().slice(0, 2).toUpperCase(),
      role: 'Staff',
      branch: 'Delhi',
      status: 'Active',
      lastLogin: 'Just now',
      created: '22/08/2026',
      avatarBg: 'bg-[#0A3977]'
    };

    handleAttemptLogin(targetUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-8">
        
        {/* Close Button if user is already logged in and not currently blocked */}
        {currentUser && !blockedIncident && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 🚨 BLOCKED INCIDENT MODAL VIEW (If Login attempted outside 9:27 AM - 6:35 PM) */}
        {blockedIncident ? (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-xl font-extrabold text-rose-700">
                Access Blocked — Off-Working Hours Security Lock
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Daily shift policy is enforced: All systems automatically lock between <strong>6:35 PM to 9:27 AM IST</strong>. Only <strong>director_admin</strong> is authorized for off-hours access.
              </p>
            </div>

            {/* Security Incident Report Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-rose-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="font-extrabold text-rose-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Incident Logged #{blockedIncident.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                  High Alert Recorded
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 font-mono text-[11px]">
                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">ATTEMPTED USER</div>
                  <div className="font-bold text-slate-900 font-sans text-xs mt-0.5">{blockedIncident.user}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">ASSIGNED ROLE</div>
                  <div className="font-bold text-indigo-700 font-sans text-xs mt-0.5">{blockedIncident.role}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">CAPTURED TIMESTAMP</div>
                  <div className="text-slate-800 mt-0.5">{blockedIncident.timestamp} IST</div>
                </div>

                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">PUBLIC IP ADDRESS</div>
                  <div className="text-slate-800 mt-0.5">{blockedIncident.ip}</div>
                </div>
              </div>

              {/* Live Location Box */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">GEO LOCATION & GPS COORDINATES</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{blockedIncident.location}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Coordinates: {blockedIncident.coords}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const director = INITIAL_STAFF_MEMBERS.find(u => u.name === 'director_admin');
                  handleAttemptLogin(director);
                }}
                className="w-full py-2.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Login as Director Admin (24x7 Exempt Access)</span>
              </button>

              <button
                type="button"
                onClick={() => setBlockedIncident(null)}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Back to Login Screen
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Logo & Header */}
            <div className="text-center space-y-2 mb-5">
              <img 
                src={paisaLogo} 
                alt="Paisa in Minutes" 
                className="h-11 w-auto mx-auto object-contain mb-2"
              />
              <h2 className="text-xl font-extrabold text-[#0A3977]">
                Staff Login & Creator Switcher
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Working Shift: <strong>09:27 AM — 06:35 PM IST</strong></span>
              </div>
            </div>

            {/* Test Simulation Mode Pill */}
            <div className="mb-4 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-[#0A3977]">
                Shift Lock Policy Mode:
              </span>
              <button
                type="button"
                onClick={() => setIsSimulatingOffHours(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  isSimulatingOffHours 
                    ? 'bg-rose-600 text-white shadow-xs' 
                    : 'bg-white border border-blue-200 text-[#0A3977] hover:bg-blue-100'
                }`}
              >
                {isSimulatingOffHours ? '🚨 Off-Hours (After 6:35 PM) Simulated' : '⚡ Normal Shift Hours'}
              </button>
            </div>

            {/* Form Login */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mb-5">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username / Official Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. accounts_team or director_admin"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Sign In to CRM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-2">
                Or 1-Click Select Creator to Test Login
              </div>
            </div>

            {/* Quick Creators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {INITIAL_STAFF_MEMBERS.map((staff) => {
                const isCurrent = currentUser?.name === staff.name;
                const isDirector = staff.name === 'director_admin';
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleAttemptLogin(staff)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${
                      isCurrent 
                        ? 'border-[#0A3977] bg-blue-50/70 ring-2 ring-blue-300' 
                        : isDirector
                        ? 'border-purple-300 bg-purple-50/40 hover:bg-purple-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${staff.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs`}>
                      {staff.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{staff.name}</span>
                        {isDirector && <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" title="24x7 Exempt" />}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 truncate">
                          {staff.role}
                        </span>
                        {isDirector && (
                          <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-800 shrink-0">
                            24x7
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
