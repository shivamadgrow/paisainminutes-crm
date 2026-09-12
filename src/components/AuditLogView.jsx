import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Search, Filter, Clock, ShieldCheck, Activity, Calendar } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export const INITIAL_ACTIVITY_LOGS = [];


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
