import React from 'react';

export default function SalesDashboard({ stats }) {
  const totalLeads = stats?.totalLeads ?? 0;
  const freshCount = stats?.freshCount ?? 0;
  const approvedCount = stats?.approvedCount ?? 0;
  const callbackCount = stats?.callbackCount ?? 0;
  const docsCount = stats?.docsCount ?? 0;

  const portalLeads = stats?.portalLeads ?? 0;

  const getWidthPct = (count) => (totalLeads > 0 ? (count / totalLeads) * 100 : 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
          Sales dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Lead funnel & sources
        </p>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: LEADS */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
            LEADS
          </span>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {totalLeads}
          </div>
        </div>

        {/* Card 2: DISBURSED */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
            DISBURSED
          </span>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {stats?.disbursedCount || 0}
          </div>
        </div>

        {/* Card 3: CONVERSION */}
        <div className="crm-card p-5 bg-white">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
            CONVERSION
          </span>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {stats?.conversionRate || 0}%
          </div>
        </div>

      </div>

      {/* Main Section: Leads by status & Leads by source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leads by status */}
        <div className="crm-card p-5 bg-white">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Leads by status
          </h3>

          <div className="space-y-4">
            
            {/* Fresh */}
            <div className="flex items-center gap-4 text-xs">
              <span className="w-32 font-medium text-slate-600">Fresh</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWidthPct(freshCount)}%` }}
                ></div>
              </div>
              <span className="w-6 text-right font-bold text-slate-800">{freshCount}</span>
            </div>

            {/* Approved */}
            <div className="flex items-center gap-4 text-xs">
              <span className="w-32 font-medium text-slate-600">Approved</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWidthPct(approvedCount)}%` }}
                ></div>
              </div>
              <span className="w-6 text-right font-bold text-slate-800">{approvedCount}</span>
            </div>

            {/* Callback */}
            <div className="flex items-center gap-4 text-xs">
              <span className="w-32 font-medium text-slate-600">Callback</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWidthPct(callbackCount)}%` }}
                ></div>
              </div>
              <span className="w-6 text-right font-bold text-slate-800">{callbackCount}</span>
            </div>

            {/* DocumentReceived */}
            <div className="flex items-center gap-4 text-xs">
              <span className="w-32 font-medium text-slate-600">DocumentReceived</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#4F46E5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWidthPct(docsCount)}%` }}
                ></div>
              </div>
              <span className="w-6 text-right font-bold text-slate-800">{docsCount}</span>
            </div>

          </div>
        </div>

        {/* Leads by source */}
        <div className="crm-card p-5 bg-white">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Leads by source
          </h3>

          <div className="space-y-4">
            
            {/* portal */}
            <div className="flex items-center gap-4 text-xs">
              <span className="w-24 font-medium text-slate-600">portal</span>
              <div className="flex-1 bg-slate-100 h-6 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-[#00A3E0] h-full rounded-full transition-all duration-500"
                  style={{ width: `${getWidthPct(portalLeads)}%` }}
                ></div>
              </div>
              <span className="w-6 text-right font-bold text-slate-800">{portalLeads}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
