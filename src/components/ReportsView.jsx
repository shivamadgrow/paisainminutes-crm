import React, { useState } from 'react';
import { Calendar, Play, FileText, Download } from 'lucide-react';

export default function ReportsView({ stats }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Custom');
  const [activeTab, setActiveTab] = useState('Overview');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Portfolio, credit and bureau MIS for the selected period
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="crm-card p-4 bg-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Period Selector Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {['Weekly', 'Half month', 'Monthly', 'Quarterly', 'Custom'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedPeriod === period 
                    ? 'bg-[#0A3977] text-white shadow-2xs' 
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Date Picker Range Inputs & Run Button */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400">FROM</span>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none text-xs" 
              />
            </div>

            <span className="text-slate-400 font-bold">— TO</span>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent text-slate-700 focus:outline-none text-xs" 
              />
            </div>

            <button 
              onClick={() => alert(`Running report for period: ${selectedPeriod}`)}
              className="px-4 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition"
            >
              <span>Run</span>
            </button>

            <select className="ml-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none">
              <option value="all">All time</option>
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
            </select>
          </div>

        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
        {[
          { id: 'Overview', label: 'Overview' },
          { id: 'Disbursal', label: `Disbursal ${stats?.disbursedCount || 0}` },
          { id: 'Collections', label: `Collections ${stats?.collectedCount || 0}` },
          { id: 'Credit team', label: 'Credit team' },
          { id: 'Salary bands', label: 'Salary bands' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 transition border-b-2 ${
              activeTab === tab.id
                ? 'border-[#0A3977] text-[#0A3977] font-bold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 4 Small Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: LOANS DISBURSED */}
        <div className="crm-card p-4 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0A3977] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              LOANS DISBURSED
            </span>
            <div className="text-base font-bold text-slate-900">
              {stats?.disbursedCount || 0}
            </div>
            <div className="text-xs text-slate-400">
              ₹{stats?.disbursedAmount || 0}
            </div>
          </div>
        </div>

        {/* Card 2: COLLECTED */}
        <div className="crm-card p-4 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              COLLECTED
            </span>
            <div className="text-base font-bold text-slate-900">
              ₹{stats?.collectedAmount || 0}
            </div>
            <div className="text-xs text-slate-400">
              0 payments
            </div>
          </div>
        </div>

        {/* Card 3: ASSESSMENTS */}
        <div className="crm-card p-4 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            📋
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              ASSESSMENTS
            </span>
            <div className="text-base font-bold text-slate-900">
              —
            </div>
          </div>
        </div>

        {/* Card 4: BUREAU ROWS */}
        <div className="crm-card p-4 bg-white flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            📊
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              BUREAU ROWS
            </span>
            <div className="text-base font-bold text-slate-900">
              —
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Latest Disbursals & Collections by Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Disbursals Table Box */}
        <div className="crm-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Latest disbursals
              </h3>
              <p className="text-xs text-slate-400">
                0 loans · ₹0
              </p>
            </div>
            <button className="text-xs font-semibold text-[#0A3977] hover:underline">
              View all →
            </button>
          </div>

          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                  <th className="py-2">LOAN NO.</th>
                  <th className="py-2">PRINCIPAL</th>
                  <th className="py-2">ON</th>
                  <th className="py-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-slate-400">
                    No disbursals in this period.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Collections by Mode Table Box */}
        <div className="crm-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Collections by mode
              </h3>
              <p className="text-xs text-slate-400">
                0 payments · ₹0
              </p>
            </div>
            <button className="text-xs font-semibold text-[#0A3977] hover:underline">
              Details →
            </button>
          </div>

          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                  <th className="py-2">MODE</th>
                  <th className="py-2">AMOUNT</th>
                  <th className="py-2">COUNT</th>
                  <th className="py-2">SHARE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-slate-400">
                    No collections in this period.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
