import React, { useState } from 'react';
import { RefreshCw, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';

export default function KPISummary({ stats }) {
  const [expandedAll, setExpandedAll] = useState(false);
  const [openCard, setOpenCard] = useState({});

  const toggleCard = (id) => {
    setOpenCard(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isCardOpen = (id) => expandedAll || openCard[id];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            KPI summary
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            <span className="text-purple-600 font-semibold">FY 2026-27</span> as at 20/08/2026 - every figure is an IST calendar period
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedAll(!expandedAll)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            {expandedAll ? 'Collapse all' : 'Expand all'}
          </button>
          <button
            onClick={() => alert("Refreshed KPI summary data.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Row: Total Disbursal & Total Collections (2 Wide Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TOTAL DISBURSAL */}
        <div className="crm-card bg-white overflow-hidden border-l-4 border-l-blue-600 flex flex-col justify-between">
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              TOTAL DISBURSAL
            </span>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ₹{stats?.disbursedAmount?.toLocaleString('en-IN') || 0}
            </div>
            <div className="text-xs text-slate-500">
              {stats?.disbursedCount || 0} cases · August 2026
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('total-disbursal')}
              className="w-full py-2.5 px-5 text-center text-xs font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              {isCardOpen('total-disbursal') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('total-disbursal') && (
              <div className="p-4 border-t border-slate-100 bg-white text-xs space-y-2 text-slate-600">
                <div className="flex justify-between"><span>Fresh Cases:</span> <strong className="text-slate-900">{stats?.freshCount || 0}</strong></div>
                <div className="flex justify-between"><span>Repeat Cases:</span> <strong className="text-slate-900">0</strong></div>
                <div className="flex justify-between"><span>Avg Ticket Size:</span> <strong className="text-slate-900">₹0</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* TOTAL COLLECTIONS */}
        <div className="crm-card bg-white overflow-hidden border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              TOTAL COLLECTIONS
            </span>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ₹{stats?.collectedAmount?.toLocaleString('en-IN') || 0}
            </div>
            <div className="text-xs text-slate-500">
              0 receipts · August 2026 <span className="text-slate-400 italic">excludes refunds</span>
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('total-collections')}
              className="w-full py-2.5 px-5 text-center text-xs font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              {isCardOpen('total-collections') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('total-collections') && (
              <div className="p-4 border-t border-slate-100 bg-white text-xs space-y-2 text-slate-600">
                <div className="flex justify-between"><span>Principal Collected:</span> <strong className="text-slate-900">₹0</strong></div>
                <div className="flex justify-between"><span>Interest Collected:</span> <strong className="text-slate-900">₹0</strong></div>
                <div className="flex justify-between"><span>Penalties Collected:</span> <strong className="text-slate-900">₹0</strong></div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: 5 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* FRESH DISBURSAL */}
        <div className="crm-card bg-white overflow-hidden border-t-2 border-t-blue-600 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              FRESH DISBURSAL
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              ₹0
            </div>
            <div className="text-[11px] text-slate-400">
              0 cases · August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('fresh-disbursal')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RE-LOAN DISBURSAL */}
        <div className="crm-card bg-white overflow-hidden border-t-2 border-t-purple-600 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              RE-LOAN DISBURSAL
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              ₹0
            </div>
            <div className="text-[11px] text-slate-400">
              0 cases · August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('reloan-disbursal')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* FEES */}
        <div className="crm-card bg-white overflow-hidden border-t-2 border-t-amber-600 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              FEES
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              ₹0
            </div>
            <div className="text-[11px] text-slate-400">
              0 cases · August 2026 <span className="italic text-[10px]">excludes GST</span>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('fees')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* GST */}
        <div className="crm-card bg-white overflow-hidden border-t-2 border-t-yellow-600 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              GST
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              ₹0
            </div>
            <div className="text-[11px] text-slate-400">
              0 cases · August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('gst')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* DUE COLLECTIONS */}
        <div className="crm-card bg-white overflow-hidden border-t-2 border-t-[#0A3977] flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              DUE COLLECTIONS
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              ₹0
            </div>
            <div className="text-[11px] text-slate-400">
              0 instalments · August 2026 <span className="italic text-[10px]">scheduled, not outstanding</span>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleCard('due-collections')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1"
            >
              <span>Breakdown</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
