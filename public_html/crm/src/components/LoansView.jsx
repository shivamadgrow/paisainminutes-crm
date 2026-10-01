import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Search, Calendar, Inbox } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function LoansView({ type }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All time');

  const getConfig = () => {
    switch (type) {
      case 'loans-active':
        return {
          title: 'Active loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No active loans',
          isOverdue: false
        };
      case 'loans-overdue':
        return {
          title: 'Overdue loans',
          subtitle: '0 loan(s), most overdue first.',
          emptyText: 'Nothing overdue',
          isOverdue: true
        };
      case 'loans-part':
        return {
          title: 'Part-payment loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No part-payment loans',
          isOverdue: false
        };
      case 'loans-settlement':
        return {
          title: 'Settlement loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No settlement loans',
          isOverdue: false
        };
      case 'loans-closed':
        return {
          title: 'Closed loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No closed loans',
          isOverdue: false
        };
      case 'loans-preclosed':
        return {
          title: 'Pre-closed loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No pre-closed loans',
          isOverdue: false
        };
      default:
        return {
          title: 'All loans',
          subtitle: '0 loan(s), newest first.',
          emptyText: 'No loan records found',
          isOverdue: false
        };
    }
  };

  const config = getConfig();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            {config.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {config.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const headers = ['Loan No', 'Applicant', 'Mobile', 'Principal', 'Disbursed Amount', 'Interest', 'Outstanding', 'Collected', 'Status'];
              exportToCsv(`paisa-crm-${type}-${new Date().toISOString().slice(0, 10)}.csv`, headers, []);
            }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
            title="Export loans to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => alert(`Refreshed ${config.title}.`)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Search Box & Disbursed Date Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, mobile or loan no...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Disbursed:</span>
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All time">All time</option>
            <option value="This month">This month</option>
            <option value="Last month">Last month</option>
            <option value="This year">This year</option>
          </select>
        </div>
      </div>

      {/* Main Table Box */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5">APPLICANT</th>
                <th className="p-3.5">LOAN NO.</th>
                <th className="p-3.5">PRINCIPAL</th>
                <th className="p-3.5">DISBURSED AMT</th>
                <th className="p-3.5">TOTAL INTEREST</th>
                <th className="p-3.5">OUTSTANDING</th>
                <th className="p-3.5">COLLECTED</th>
                <th className="p-3.5">DISBURSED</th>
                <th className="p-3.5">NEXT DUE</th>
                
                {/* Overdue Specific Columns */}
                {config.isOverdue && (
                  <>
                    <th className="p-3.5">OVERDUE</th>
                    <th className="p-3.5">DAYS</th>
                    <th className="p-3.5">PENALTY</th>
                  </>
                )}

                <th className="p-3.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td colSpan={config.isOverdue ? 13 : 10} className="p-16 text-center text-slate-400 text-xs font-medium">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <span>{config.emptyText}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
