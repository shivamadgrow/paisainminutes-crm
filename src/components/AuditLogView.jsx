import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Search, Filter, Clock, ShieldCheck, Activity, Calendar } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'act-001',
    when: '10/08/2026 04:12 PM',
    date: '2026-08-10',
    who: 'Super Admin (info@adgrowmedia.com)',
    module: 'Commissions',
    type: 'Update',
    typeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    activity: 'Updated Commission Rate Card for Rupay91 to 2.8% Tiered slab structure effective 01/04/2026.'
  },
  {
    id: 'act-002',
    when: '10/08/2026 02:45 PM',
    date: '2026-08-10',
    who: 'Admin (Karan S.)',
    module: 'Leads',
    type: 'Status Change',
    typeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    activity: 'Changed lead status for Shivam (PIM-1002) from "Fresh" to "Approved" with ₹25,000 disbursal on Rupay91.'
  },
  {
    id: 'act-003',
    when: '10/08/2026 11:30 AM',
    date: '2026-08-10',
    who: 'Telecaller (Pooja R.)',
    module: 'Mobile-only Leads',
    type: 'Outreach',
    typeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    activity: 'Sent instant application link via WhatsApp to abandoned mini-form lead +91 9811223344.'
  },
  {
    id: 'act-004',
    when: '09/08/2026 05:20 PM',
    date: '2026-08-09',
    who: 'Super Admin',
    module: 'Partners',
    type: 'Agreement',
    typeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    activity: 'Uploaded executed contract renewal deed for Jhatpat Loans (PIM-AGR-2025-004).'
  },
  {
    id: 'act-005',
    when: '08/08/2026 03:15 PM',
    date: '2026-08-08',
    who: 'Finance Desk',
    module: 'Payouts',
    type: 'Settlement',
    typeColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    activity: 'Reconciled settlement #SET-2026-042 for ₹2,84,000 from Rupay91 via NEFT-HDFC009283719.'
  },
  {
    id: 'act-006',
    when: '07/08/2026 10:05 AM',
    date: '2026-08-07',
    who: 'Admin (Karan S.)',
    module: 'Leads',
    type: 'De-duplicate',
    typeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    activity: 'Merged duplicate lead #PIM-1048 into primary lead #PIM-1012 (matched on mobile +91 7838056998).'
  }
];

export default function AuditLogView() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('paisa_crm_activity_log');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ACTIVITY_LOGS;
  });

  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredLogs = logs.filter(item => {
    if (moduleFilter !== 'All modules' && item.module !== moduleFilter) return false;
    if (fromDate && item.date && item.date < fromDate) return false;
    if (toDate && item.date && item.date > toDate) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchWho = item.who.toLowerCase().includes(q);
      const matchAct = item.activity.toLowerCase().includes(q);
      const matchMod = item.module.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      if (!matchWho && !matchAct && !matchMod && !matchType) return false;
    }

    return true;
  });

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Who (User / Actor)', 'Module', 'Action Type', 'Activity Description'];
    const rows = filteredLogs.map(l => [l.when, l.who, l.module, l.type, l.activity]);
    exportToCsv(`paisa-crm-activity-log-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            <span>Activity Log & Audit Trail</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredLogs.length} Actions
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete tamper-evident audit log of lead status updates, commission rate card revisions, and partner settlements
          </p>
        </div>

        <button 
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Module Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">MODULE:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All modules">All Modules</option>
              <option value="Commissions">Commissions</option>
              <option value="Leads">Leads</option>
              <option value="Mobile-only Leads">Mobile-only Leads</option>
              <option value="Partners">Partners</option>
              <option value="Payouts">Payouts</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Date range filters */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">FROM</span>
            <input 
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">TO</span>
            <input 
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
            />
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search user, action, partner, record id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977]"
            />
          </div>

          <button 
            onClick={() => {
              setModuleFilter('All modules');
              setSearchQuery('');
              setFromDate('');
              setToDate('');
            }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 font-medium cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 w-44">WHEN (IST)</th>
                <th className="p-3.5 w-52">WHO (ACTOR)</th>
                <th className="p-3.5 w-36">MODULE</th>
                <th className="p-3.5 w-28">ACTION TYPE</th>
                <th className="p-3.5">ACTIVITY AUDIT DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {item.when}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {item.who}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.module}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${item.typeColor}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-sans leading-relaxed">
                      {item.activity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400 text-xs font-medium">
                    No activity logs recorded matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
