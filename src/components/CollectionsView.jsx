import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Search } from 'lucide-react';

export default function CollectionsView({ type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDateFilter, setActiveDateFilter] = useState('All dates');
  const [activeBucketFilter, setActiveBucketFilter] = useState('All');

  if (type === 'collections-queue') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Collection Queue Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Collection queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            0 overdue installment(s), oldest first
          </p>
        </div>

        {/* Excel Button */}
        <div>
          <button 
            onClick={() => alert("Exporting Collection queue to Excel...")}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>

        {/* Queue Table */}
        <div className="crm-card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                  <th className="p-3.5">LOAN NO.</th>
                  <th className="p-3.5">EMI #</th>
                  <th className="p-3.5">DUE DATE</th>
                  <th className="p-3.5">AMOUNT DUE</th>
                  <th className="p-3.5">OVERDUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400 text-xs font-medium">
                    Nothing overdue. 💸
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'collections-followups') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Follow-ups Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
              Follow-ups
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              0 account(s) with a promise-to-pay or callback due.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, mobile, loan no"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
          />
        </div>

        {/* Follow-ups Table */}
        <div className="crm-card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                  <th className="p-3.5 w-8">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="p-3.5">APPLICANT</th>
                  <th className="p-3.5">COLLECTION MGR</th>
                  <th className="p-3.5">LOAN NO.</th>
                  <th className="p-3.5">CITY</th>
                  <th className="p-3.5">OUTSTANDING</th>
                  <th className="p-3.5">AMOUNT DUE</th>
                  <th className="p-3.5">DPD</th>
                  <th className="p-3.5">STATUS</th>
                  <th className="p-3.5">PENALTY</th>
                  <th className="p-3.5">REPAY DATE</th>
                  <th className="p-3.5">LAST FOLLOW-UP</th>
                  <th className="p-3.5">PTP</th>
                  <th className="p-3.5">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td colSpan="14" className="p-16 text-center text-slate-400 text-xs font-medium">
                    No follow-ups due. 💸
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Collection Workspace (Default)
  const bucketPills = [
    { id: 'All', label: 'All', count: 0 },
    { id: 'Due', label: 'Due', count: 0 },
    { id: 'Due today', label: 'Due today', count: 0 },
    { id: 'Upcoming', label: 'Upcoming', count: 0 },
    { id: 'Overdue', label: 'Overdue', count: 0 },
    { id: '1-30d', label: '1-30d', count: 0 },
    { id: '31-60d', label: '31-60d', count: 0 },
    { id: '60+d', label: '60+d', count: 0 },
    { id: 'NPA (90+)', label: 'NPA (90+)', count: 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Collection workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            0 account(s) pending, most overdue first.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => alert("Refreshed Collection Workspace.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Search, Date Pills & Bucket Pills */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search name, mobile, loan no."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg text-xs font-semibold text-slate-600">
            {['All dates', 'Custom range'].map(d => (
              <button
                key={d}
                onClick={() => setActiveDateFilter(d)}
                className={`px-3 py-1 rounded-md transition ${
                  activeDateFilter === d
                    ? 'bg-[#0A3977] text-white shadow-2xs'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Bucket Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {bucketPills.map(pill => (
            <button
              key={pill.id}
              onClick={() => setActiveBucketFilter(pill.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition flex items-center gap-1.5 ${
                activeBucketFilter === pill.id
                  ? 'bg-[#0A3977] text-white shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{pill.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                activeBucketFilter === pill.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Box */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="p-3.5">APPLICANT</th>
                <th className="p-3.5">COLLECTION MGR</th>
                <th className="p-3.5">LOAN NO.</th>
                <th className="p-3.5">CITY</th>
                <th className="p-3.5">OUTSTANDING</th>
                <th className="p-3.5">AMOUNT DUE</th>
                <th className="p-3.5">DPD</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">PENALTY</th>
                <th className="p-3.5">REPAY DATE</th>
                <th className="p-3.5">LAST FOLLOW-UP</th>
                <th className="p-3.5">PTP</th>
                <th className="p-3.5">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td colSpan="14" className="p-16 text-center text-slate-400 text-xs font-medium">
                  Nothing pending. 💸
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
