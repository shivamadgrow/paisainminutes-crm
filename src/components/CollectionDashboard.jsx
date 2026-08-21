import React from 'react';

export default function CollectionDashboard({ stats }) {
  const outstanding = stats?.outstandingAmount || 0;
  const dueToday = stats?.dueTodayAmount || 0;
  const collectedMonth = stats?.collectedAmount || 0;
  const overdueCount = stats?.overdueCount || 0;
  const overdueAmount = stats?.overdueAmount || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
          Collection dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Outstanding & overdue
        </p>
      </div>

      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* OUTSTANDING */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-3">
            OUTSTANDING
          </span>
          <div className="text-2xl font-bold text-slate-900">
            ₹{outstanding.toLocaleString('en-IN')}
          </div>
        </div>

        {/* DUE TODAY */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-3">
            DUE TODAY
          </span>
          <div className="text-2xl font-bold text-slate-900">
            ₹{dueToday.toLocaleString('en-IN')}
          </div>
        </div>

        {/* COLLECTED (MONTH) */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-3">
            COLLECTED (MONTH)
          </span>
          <div className="text-2xl font-bold text-slate-900">
            ₹{collectedMonth.toLocaleString('en-IN')}
          </div>
        </div>

        {/* OVERDUE */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-3">
            OVERDUE
          </span>
          <div className="text-2xl font-bold text-slate-900">
            {overdueCount} · ₹{overdueAmount.toLocaleString('en-IN')}
          </div>
        </div>

      </div>

      {/* Overdue Buckets Section */}
      <div className="crm-card p-5 bg-white">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Overdue buckets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Bucket 1: 0-30 DAYS */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              0-30 DAYS
            </span>
            <div className="text-xl font-bold text-slate-900">
              ₹0
            </div>
            <div className="text-xs text-slate-500 mt-1">
              0 EMIs
            </div>
          </div>

          {/* Bucket 2: 31-60 DAYS */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              31-60 DAYS
            </span>
            <div className="text-xl font-bold text-slate-900">
              ₹0
            </div>
            <div className="text-xs text-slate-500 mt-1">
              0 EMIs
            </div>
          </div>

          {/* Bucket 3: 60+ DAYS */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
              60+ DAYS
            </span>
            <div className="text-xl font-bold text-slate-900">
              ₹0
            </div>
            <div className="text-xs text-slate-500 mt-1">
              0 EMIs
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
