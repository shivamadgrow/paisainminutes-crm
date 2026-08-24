import React, { useState } from 'react';
import { FileSpreadsheet, RefreshCw, Landmark, Search, Calendar, Inbox } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function DisbursalView({ leads, type }) {
  const isDisbursed = type === 'disbursed';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const list = isDisbursed 
    ? leads.filter(l => l.status === 'Disbursed')
    : leads.filter(l => l.status === 'DisbursedQueue');

  if (isDisbursed) {
    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Disbursed Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
              Disbursed
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Money that has left the account, newest first.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const headers = ['Loan No', 'Applicant', 'Mobile', 'Amount', 'Disbursed On', 'Bank Name', 'Status'];
                const rows = (list || []).map(l => [l.loanNo || l.id, l.name, l.mobile, l.loanAmount || l.applied || 0, l.created || l.date || '', 'HDFC Bank', l.status]);
                exportToCsv(`paisa-crm-disbursed-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
              }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              title="Export Disbursed Loans to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => alert("Refreshed Disbursed Loans.")}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 3 Top Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: LOANS DISBURSED */}
          <div className="crm-card p-4 bg-white space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              LOANS DISBURSED
            </span>
            <div className="text-xl font-bold text-slate-900">0</div>
            <p className="text-[11px] text-slate-400">
              of 0 all time · {selectedMonth}
            </p>
          </div>

          {/* Card 2: NET PAID OUT */}
          <div className="crm-card p-4 bg-white space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              NET PAID OUT
            </span>
            <div className="text-xl font-bold text-slate-900">₹0</div>
            <p className="text-[11px] text-slate-400">
              reached borrower accounts
            </p>
          </div>

          {/* Card 3: FEES & GST */}
          <div className="crm-card p-4 bg-white space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              FEES & GST
            </span>
            <div className="text-xl font-bold text-slate-900">₹0</div>
            <p className="text-[11px] text-slate-400">
              withheld from ₹0 sanctioned
            </p>
          </div>

        </div>

        {/* Filter Bar: Search Input, Month Picker, Clear Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search name, mobile, loan no, or UTR"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
              />
            </div>

            {/* Month Select */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Disbursed:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-[#0A3977] focus:outline-none cursor-pointer"
              >
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="June 2026">June 2026</option>
                <option value="All time">All time</option>
              </select>
            </div>

          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMonth('August 2026');
            }}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>

        {/* Main Disbursed Table */}
        <div className="crm-card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                  <th className="p-3.5">APPLICANT</th>
                  <th className="p-3.5">LOAN NO.</th>
                  <th className="p-3.5">PRINCIPAL</th>
                  <th className="p-3.5">NET DISBURSED</th>
                  <th className="p-3.5">BANK REFERENCE</th>
                  <th className="p-3.5">DISBURSED ON</th>
                  <th className="p-3.5">BENEFICIARY</th>
                  <th className="p-3.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {list.length > 0 ? (
                  list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5 font-mono text-[#0A3977] font-semibold">{item.loanNo}</td>
                      <td className="p-3.5 font-bold text-slate-900">₹{item.applied.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-bold text-slate-900">₹{item.applied.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-mono text-slate-500">UTR129847192</td>
                      <td className="p-3.5 text-slate-500">{item.created}</td>
                      <td className="p-3.5 text-slate-600">SBI · 8492</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800">
                          Disbursed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="font-bold text-slate-800 text-xs">No disbursed loans yet</div>
                        <div className="text-[11px] text-slate-400">
                          Loans appear here once the disbursal team records the transfer.
                        </div>
                      </div>
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

  // Disbursal Queue (Default)
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Disbursal queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            0 loan(s) ready to disburse — approved, signed & mandate active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert("Bank Disbursal NACH/NEFT Batch File exported.")}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank file</span>
          </button>
          <button 
            onClick={() => {
              const headers = ['Loan No', 'Applicant', 'Mobile', 'Approved Principal', 'Disbursal Amount', 'Terms', 'Repay Date', 'Bank Name', 'Status'];
              exportToCsv(`paisa-crm-disbursal-queue-${new Date().toISOString().slice(0, 10)}.csv`, headers, []);
            }}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
            title="Export Disbursal Queue to Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => alert("Refreshed Disbursal Queue.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Disbursal Queue Table Box */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="p-3.5">APPLICANT</th>
                <th className="p-3.5">LOAN NO.</th>
                <th className="p-3.5">APPROVED</th>
                <th className="p-3.5">NET PAYABLE</th>
                <th className="p-3.5">TERMS</th>
                <th className="p-3.5">REPAY DATE</th>
                <th className="p-3.5">BENEFICIARY</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td colSpan="9" className="p-16 text-center text-slate-400 text-xs font-medium">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <span>Nothing ready to disburse</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
