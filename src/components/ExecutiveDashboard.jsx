import React from 'react';
import { ChevronLeft, ChevronRight, IndianRupee, Layers, Coins, Equal, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function ExecutiveDashboard({ stats, selectedMonth, setSelectedMonth }) {
  // Mock monthly disbursal trend data
  const trendData = [
    { month: 'Sep 25', amount: 0 },
    { month: 'Nov 25', amount: 0 },
    { month: 'Jan 26', amount: 0 },
    { month: 'Mar 26', amount: 0 },
    { month: 'May 26', amount: 0 },
    { month: 'Jul 26', amount: 0 },
    { month: 'Aug 26', amount: stats?.disbursedAmount || 0 },
  ];

  // Portfolio pie data
  const portfolioData = [
    { name: 'Active', value: stats?.activeLoans || 0, color: '#0A3977' },
    { name: 'Closed', value: stats?.closedLoans || 0, color: '#0084FF' },
  ];
  if (stats?.activeLoans === 0 && stats?.closedLoans === 0) {
    portfolioData[0].value = 1; // placeholder for empty donut chart visually
    portfolioData[0].color = '#E2E8F0';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dashboard Title & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Executive dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {selectedMonth} - compared with July 2026
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-700 px-2">
            {selectedMonth}
          </span>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: DISBURSED */}
        <div className="crm-card p-5 relative overflow-hidden bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0A3977] flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              DISBURSED
            </span>
          </div>

          <div className="text-2xl font-bold text-slate-900 mb-1">
            ₹{stats?.disbursedAmount?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-xs text-slate-400 mb-3">
            {stats?.disbursedCount || 0} Loans - {selectedMonth}
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
            No change
          </span>
        </div>

        {/* Card 2: COLLECTED */}
        <div className="crm-card p-5 relative overflow-hidden bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              COLLECTED
            </span>
          </div>

          <div className="text-2xl font-bold text-slate-900 mb-1">
            ₹{stats?.collectedAmount?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-xs text-slate-400 mb-3">
            {selectedMonth}
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
            No change
          </span>
        </div>

        {/* Card 3: OUTSTANDING */}
        <div className="crm-card p-5 relative overflow-hidden bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              CD
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              OUTSTANDING
            </span>
          </div>

          <div className="text-2xl font-bold text-slate-900 mb-1">
            ₹{stats?.outstandingAmount?.toLocaleString('en-IN') || 0}
          </div>
          <div className="text-xs text-slate-400 mb-3">
            0 active - +0 opened
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
            No movement in {selectedMonth}
          </span>
        </div>

        {/* Card 4: LEADS */}
        <div className="crm-card p-5 relative overflow-hidden bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0A3977] flex items-center justify-center font-bold text-xs">
              =
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              LEADS
            </span>
          </div>

          <div className="text-2xl font-bold text-slate-900 mb-1">
            {stats?.totalLeads ?? 0}
          </div>
          <div className="text-xs text-slate-400 mb-3">
            {stats?.conversionRate || 0}% converted - {selectedMonth}
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
            ▲ {stats?.totalLeads ?? 0}
          </span>
        </div>

      </div>

      {/* Middle Section: Disbursal Trend & Portfolio Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Disbursal Trend Chart (2 cols) */}
        <div className="lg:col-span-2 crm-card p-5 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Disbursal trend
            </h3>
            <span className="text-xs text-slate-400">
              last 12 months
            </span>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A3977', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`₹${value}`, 'Disbursed']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4F46E5' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Donut Chart (1 col) */}
        <div className="crm-card p-5 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Portfolio
            </h3>
            <span className="text-xs text-slate-400">
              live
            </span>
          </div>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">
                {stats?.activeLoans || 0}
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                LOANS
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A3977]"></span>
              <span>Active <strong className="text-slate-800">{stats?.activeLoans || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0084FF]"></span>
              <span>Closed <strong className="text-slate-800">{stats?.closedLoans || 0}</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Conversion Funnel */}
      <div className="crm-card p-5 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-800">
            Conversion funnel
          </h3>
          <span className="text-xs text-slate-400">
            {selectedMonth}
          </span>
        </div>

        <div className="space-y-4">
          
          {/* Funnel Row: Leads */}
          <div className="flex items-center gap-4 text-xs">
            <span className="w-24 font-medium text-slate-600">Leads</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats?.totalLeads ?? 0) > 0 ? 100 : 0}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-bold text-slate-800">{stats?.totalLeads ?? 0}</span>
          </div>

          {/* Funnel Row: Approved */}
          <div className="flex items-center gap-4 text-xs">
            <span className="w-24 font-medium text-slate-600">Approved</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats?.totalLeads ?? 0) > 0 ? ((stats?.approvedCount ?? 0) / stats.totalLeads) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-bold text-slate-800">{stats?.approvedCount ?? 0}</span>
          </div>

          {/* Funnel Row: Disbursed */}
          <div className="flex items-center gap-4 text-xs">
            <span className="w-24 font-medium text-slate-600">Disbursed</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats?.totalLeads ?? 0) > 0 ? ((stats?.disbursedCount ?? 0) / stats.totalLeads) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-bold text-slate-800">{stats?.disbursedCount ?? 0}</span>
          </div>

          {/* Funnel Row: Repaying */}
          <div className="flex items-center gap-4 text-xs">
            <span className="w-24 font-medium text-slate-600">Repaying</span>
            <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats?.totalLeads ?? 0) > 0 ? ((stats?.repayingCount ?? 0) / stats.totalLeads) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-bold text-slate-800">{stats?.repayingCount ?? 0}</span>
          </div>

        </div>
      </div>

    </div>
  );
}
