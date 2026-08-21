import React, { useState } from 'react';
import { FileSpreadsheet, Search } from 'lucide-react';

const AUDIT_LOGS = [];

export default function AuditLogView() {
  const [employeeFilter, setEmployeeFilter] = useState('All employees');
  const [actorFilter, setActorFilter] = useState('Everyone');
  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredLogs = AUDIT_LOGS.filter(item => {
    const matchesSearch = 
      !searchQuery || 
      item.who.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Audit log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {filteredLogs.length} recorded action(s) — every staff action and data change, newest first.
          </p>
        </div>

        <button 
          onClick={() => alert("Exporting Audit log to Excel...")}
          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Excel</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="crm-card p-4 bg-white space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* EMPLOYEE Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">EMPLOYEE:</span>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All employees">All employees</option>
              <option value="admin">admin</option>
              <option value="shivam">shivam</option>
            </select>
          </div>

          {/* ACTOR Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">ACTOR:</span>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Everyone">Everyone</option>
              <option value="Staff">Staff only</option>
              <option value="Customer">Customer only</option>
            </select>
          </div>

          {/* MODULE Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">MODULE:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All modules">All modules</option>
              <option value="Exports">Exports</option>
              <option value="Staff">Staff</option>
              <option value="Customers">Customers</option>
              <option value="Leads">Leads</option>
            </select>
          </div>

          {/* FROM Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">FROM</span>
            <input 
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
            />
          </div>

          {/* TO Date */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-slate-400">TO</span>
            <input 
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
            />
          </div>

          {/* SEARCH Input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Activity, employee, record id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977]"
            />
          </div>

          <button 
            onClick={() => {
              setEmployeeFilter('All employees');
              setActorFilter('Everyone');
              setModuleFilter('All modules');
              setSearchQuery('');
              setFromDate('');
              setToDate('');
            }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 w-44">WHEN</th>
                <th className="p-3.5 w-44">WHO</th>
                <th className="p-3.5 w-32">MODULE</th>
                <th className="p-3.5 w-24">TYPE</th>
                <th className="p-3.5">ACTIVITY</th>
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
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-[#0A3977] border border-blue-200">
                        {item.module}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${item.typeColor}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-sans leading-snug">
                      {item.activity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400 text-xs font-medium">
                    No activity logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-slate-400 text-xs font-mono">
          <span>Page 1 of 1</span>
          <div className="space-x-2">
            <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-300">‹ Prev</button>
            <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-300">Next ›</button>
          </div>
        </div>
      </div>

    </div>
  );
}
