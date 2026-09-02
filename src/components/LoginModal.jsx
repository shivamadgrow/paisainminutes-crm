import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ExternalLink, 
  RefreshCw,
  KeyRound,
  Shield,
  Info
} from 'lucide-react';
import paisaLogo from '../assets/paisa-logo.png';
import { 
  authenticateStaff, 
  getStaffList, 
  setCurrentUserSession 
} from '../utils/authService';

export default function LoginModal({ isOpen = true, onClose, onLogin, currentUser, isFullScreen = false }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blockedIncident, setBlockedIncident] = useState(null);
  const [isSimulatingOffHours, setIsSimulatingOffHours] = useState(false);
  const [showCredentialsHelp, setShowCredentialsHelp] = useState(false);

  // If not full screen and not open, don't render
  if (!isFullScreen && !isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await authenticateStaff(username, password, isSimulatingOffHours);

      if (result.success && result.user) {
        setBlockedIncident(null);
        if (onLogin) onLogin(result.user);
        if (onClose) onClose();
      } else if (result.blockedIncident) {
        setBlockedIncident(result.blockedIncident);
      } else {
        setError(result.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginAsAdmin = async (adminUsername, adminPass) => {
    setUsername(adminUsername);
    setPassword(adminPass);
    setIsLoading(true);
    setError('');
    try {
      const result = await authenticateStaff(adminUsername, adminPass, false);
      if (result.success && result.user) {
        if (onLogin) onLogin(result.user);
        if (onClose) onClose();
      } else {
        setError(result.error || 'Failed to authenticate.');
      }
    } catch (e) {
      setError('Error authenticating admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${
      isFullScreen 
        ? 'bg-gradient-to-br from-slate-900 via-[#0A2540] to-indigo-950 min-h-screen' 
        : 'bg-slate-900/70 backdrop-blur-sm'
    }`}>
      
      {/* Background Decorative Lighting */}
      {isFullScreen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative my-6 animate-fade-in text-slate-800 z-10">
        
        {/* Close button only available in modal mode when user is already logged in */}
        {!isFullScreen && currentUser && !blockedIncident && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 🚨 BLOCKED OFF-HOURS INCIDENT VIEW */}
        {blockedIncident ? (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-lg font-extrabold text-rose-700 leading-tight">
                Access Locked — Off-Working Hours Policy
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standard shift security policy is active. System automatically locks between <strong>6:35 PM to 9:27 AM IST</strong>. Only <strong>Super Admin / Director</strong> is authorized for off-hours access.
              </p>
            </div>

            {/* Incident Details */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-rose-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-extrabold text-rose-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Incident #{blockedIncident.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                  Logged & Blocked
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono text-[11px]">
                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">USER</div>
                  <div className="font-bold text-slate-900 font-sans text-xs mt-0.5">{blockedIncident.user}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">ROLE</div>
                  <div className="font-bold text-indigo-700 font-sans text-xs mt-0.5">{blockedIncident.role}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">TIME</div>
                  <div className="text-slate-800 mt-0.5">{blockedIncident.timestamp} IST</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans text-[10px] uppercase font-bold">IP</div>
                  <div className="text-slate-800 mt-0.5">{blockedIncident.ip}</div>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-slate-900">{blockedIncident.location}</span>
                  <div className="text-[10px] text-slate-400 font-mono">GPS: {blockedIncident.coords}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLoginAsAdmin('admin', 'admin123')}
                className="w-full py-2.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign in as Super Admin (24x7 Exempt)</span>
              </button>

              <button
                type="button"
                onClick={() => setBlockedIncident(null)}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Back to Login Form
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header & Logo */}
            <div className="text-center space-y-1.5 mb-5">
              <img 
                src={paisaLogo} 
                alt="Paisa in Minutes" 
                className="h-10 w-auto mx-auto object-contain mb-2 hover:scale-105 transition-transform"
              />
              <h2 className="text-xl font-extrabold text-[#0A3977] tracking-tight">
                {isFullScreen ? 'Staff & CRM Login' : 'Switch Staff Account'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter your authorized User ID & Password to access the CRM
              </p>
            </div>

            {/* Shift Security Status Pill */}
            <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px]">Shift: <strong>09:27 AM – 06:35 PM IST</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active
              </span>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-start gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  User ID / Username / Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. admin or your username"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:border-transparent text-slate-800 font-medium shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-[11px] text-[#0A3977] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:border-transparent text-slate-800 font-medium shadow-2xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#0A3977] hover:bg-blue-900 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to CRM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Credentials Accordion */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCredentialsHelp(prev => !prev)}
                className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer py-1"
              >
                <div className="flex items-center gap-1.5 text-blue-700">
                  <Info className="w-3.5 h-3.5" />
                  <span>Default Super Admin Credentials</span>
                </div>
                <span>{showCredentialsHelp ? '▲ Hide' : '▼ View'}</span>
              </button>

              {showCredentialsHelp && (
                <div className="mt-2 p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-[11px] space-y-2 text-slate-700 animate-fade-in">
                  <div className="flex items-center justify-between font-mono">
                    <span>Username: <strong className="text-slate-900">admin</strong></span>
                    <span>Password: <strong className="text-slate-900">admin123</strong></span>
                    <button
                      type="button"
                      onClick={() => handleQuickLoginAsAdmin('admin', 'admin123')}
                      className="px-2 py-0.5 bg-[#0A3977] text-white rounded text-[10px] font-sans font-bold hover:bg-blue-900 cursor-pointer"
                    >
                      Use
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono pt-1 border-t border-blue-200/50">
                    <span>Username: <strong className="text-slate-900">shivam</strong></span>
                    <span>Password: <strong className="text-slate-900">shivam123</strong></span>
                    <button
                      type="button"
                      onClick={() => handleQuickLoginAsAdmin('shivam', 'shivam123')}
                      className="px-2 py-0.5 bg-[#0A3977] text-white rounded text-[10px] font-sans font-bold hover:bg-blue-900 cursor-pointer"
                    >
                      Use
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Footer Note */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted & Session Guard Protected</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
