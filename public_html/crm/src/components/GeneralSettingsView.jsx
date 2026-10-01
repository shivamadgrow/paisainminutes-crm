import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Check, 
  Save, 
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import { INITIAL_GENERAL_SETTINGS } from '../data/generalSettingsData';

export default function GeneralSettingsView() {
  const [settings, setSettings] = useState(INITIAL_GENERAL_SETTINGS);
  const [savedToast, setSavedToast] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>General System Settings</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Platform Config
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            FY fiscal period, enterprise entity details, default commission rate fallback & security shifts
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Platform configuration saved and synchronized!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Financial Year & Accounting Period */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>1. Fiscal Accounting Period & Calendar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Financial Year (FY)</label>
              <select
                name="fyPeriod"
                value={settings.fyPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="FY 2026-27">FY 2026-27 (Current)</option>
                <option value="FY 2025-26">FY 2025-26 (Audited)</option>
                <option value="FY 2027-28">FY 2027-28 (Upcoming)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Timezone</label>
              <input 
                type="text"
                name="timezone"
                disabled
                value={settings.timezone}
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Base Currency</label>
              <input 
                type="text"
                name="currency"
                disabled
                value={settings.currency}
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Commission Fallback & Taxation */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>2. Commission Commercial Fallbacks & GST</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Commission Rate Fallback (%)
              </label>
              <input 
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                name="defaultCommissionRate"
                value={settings.defaultCommissionRate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Applied when an affiliate partner lacks a custom tiered rate card slab.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard GST Rate for Invoices (%)
              </label>
              <input 
                type="number"
                disabled
                name="defaultGstRate"
                value={settings.defaultGstRate}
                className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                18% GST (CGST 9% + SGST 9%) under SAC Code 998311 for Fintech Lead Routing.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Entity & Legal Branding */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0A3977]" />
            <span>3. Enterprise Entity & Legal Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Platform Brand Name</label>
              <input 
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Entity Legal Name</label>
              <input 
                type="text"
                name="parentEntity"
                value={settings.parentEntity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input 
                type="text"
                name="gstNumber"
                value={settings.gstNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Support Official Email</label>
              <input 
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Head Office Address</label>
              <input 
                type="text"
                name="headOffice"
                value={settings.headOffice}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operational Shifts & Security */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>4. Operational Shifts & Data Guardrails</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telecaller Shift Start (IST)</label>
              <input 
                type="time"
                name="shiftStartTime"
                value={settings.shiftStartTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telecaller Shift End (IST)</label>
              <input 
                type="time"
                name="shiftEndTime"
                value={settings.shiftEndTime}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <input 
              type="checkbox"
              id="autoDisbursalNotification"
              name="autoDisbursalNotification"
              checked={settings.autoDisbursalNotification}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="autoDisbursalNotification" className="text-xs text-slate-700 font-medium cursor-pointer">
              Auto-send WhatsApp & Email alerts to applicants upon loan disbursal confirmation
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
