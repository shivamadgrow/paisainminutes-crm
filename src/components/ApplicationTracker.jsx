import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Search } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

const INITIAL_APPLICANTS = [];

export default function ApplicationTracker() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'All', label: 'All', count: INITIAL_APPLICANTS.length },
    { id: 'OTP not verified', label: 'OTP not verified', count: INITIAL_APPLICANTS.filter(a => a.stage === 'OTP not verified').length },
    { id: 'OTP verified', label: 'OTP verified', count: INITIAL_APPLICANTS.filter(a => a.otp === 'Verified').length },
    { id: 'Loan details', label: 'Loan details', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Loan details').length },
    { id: 'Personal', label: 'Personal', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Personal').length },
    { id: 'Address', label: 'Address', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Address').length },
    { id: 'Employment', label: 'Employment', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Employment').length },
    { id: 'References', label: 'References', count: INITIAL_APPLICANTS.filter(a => a.stage === 'References').length },
    { id: 'Documents', label: 'Documents', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Documents').length },
    { id: 'Submitted', label: 'Submitted', count: INITIAL_APPLICANTS.filter(a => a.stage === 'Submitted').length },
  ];

  const filteredApplicants = INITIAL_APPLICANTS.filter(item => {
    const matchesFilter = 
      activeFilter === 'All' || 
      item.stage.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch = 
      !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.mobile.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Application Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Self-service applicants — from mobile & OTP to final submission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = ['Applicant Name', 'Mobile', 'Stage', 'OTP Status', 'Loan Amount', 'City', 'Created'];
              const rows = (filteredApplicants || []).map(a => [a.name, a.mobile, a.stage, a.otp, a.amount, a.city, a.created]);
              exportToCsv(`paisa-crm-application-tracker-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
            }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
            title="Export Application Tracker to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => alert("Refreshed Application Tracker.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stage Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? 'bg-[#0A3977] text-white shadow-2xs font-semibold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
              activeFilter === tab.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input Bar & Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977]"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {filteredApplicants.length} applicant(s)
        </span>
      </div>

      {/* Main Table */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5">APPLICANT</th>
                <th className="p-3.5">OTP</th>
                <th className="p-3.5">STAGE</th>
                <th className="p-3.5 w-64">PROGRESS</th>
                <th className="p-3.5">SUBMISSION</th>
                <th className="p-3.5">LAST ACTIVITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* APPLICANT */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
                          {item.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.mobile}</div>
                        </div>
                      </div>
                    </td>

                    {/* OTP */}
                    <td className="p-3.5">
                      {item.otp === 'Verified' ? (
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600">
                          Not verified
                        </span>
                      )}
                    </td>

                    {/* STAGE */}
                    <td className="p-3.5">
                      {item.stage === 'Submitted' && (
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-[#0A3977]">
                          Submitted
                        </span>
                      )}
                      {item.stage === 'OTP not verified' && (
                        <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600">
                          OTP not verified
                        </span>
                      )}
                      {item.stage === 'References' && (
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800">
                          References
                        </span>
                      )}
                      {item.stage === 'Employment' && (
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800">
                          Employment
                        </span>
                      )}
                    </td>

                    {/* PROGRESS */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#4F46E5] h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.progressText}
                        </span>
                      </div>
                    </td>

                    {/* SUBMISSION */}
                    <td className="p-3.5">
                      {item.submission === 'Application received' ? (
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-[#0A3977]">
                          Application received
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          Not submitted
                        </span>
                      )}
                    </td>

                    {/* LAST ACTIVITY */}
                    <td className="p-3.5 text-xs text-slate-500 font-mono">
                      {item.lastActivity}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-slate-400 text-xs font-medium">
                    No self-service applications found.
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
