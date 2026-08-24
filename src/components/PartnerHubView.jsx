import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  ArrowUpRight, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  IndianRupee, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

export default function PartnerHubView({ leads = [], onSelectCompany, onOpenTestModal }) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  // Compute metrics per affiliate partner
  const partnerStats = AFFILIATE_PARTNERS.map(partner => {
    const partnerLeads = leads.filter(l => {
      const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
      return c === partner.id || c === partner.name.toLowerCase().replace(/[\s\-_]/g, '') || c === partner.code.toLowerCase();
    });

    const totalCount = partnerLeads.length;
    const totalVolume = partnerLeads.reduce((sum, l) => sum + (Number(l.loanAmount || l.applied) || 0), 0);
    const freshCount = partnerLeads.filter(l => l.status === 'Fresh').length;
    const approvedCount = partnerLeads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
    const avgTicket = totalCount > 0 ? Math.round(totalVolume / totalCount) : 0;
    const conversionRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

    return {
      ...partner,
      leads: partnerLeads,
      totalCount,
      totalVolume,
      freshCount,
      approvedCount,
      avgTicket,
      conversionRate
    };
  });

  const totalAssigned = partnerStats.reduce((sum, p) => sum + p.totalCount, 0);
  const unassignedCount = leads.filter(l => !l.assignedCompany || l.assignedCompany === '—' || l.assignedCompany === 'Unassigned').length;
  const totalVolumeAll = leads.reduce((sum, l) => sum + (Number(l.loanAmount || l.applied) || 0), 0);

  // Chart data
  const chartData = partnerStats.map(p => ({
    name: p.name,
    leads: p.totalCount,
    volumeLakhs: (p.totalVolume / 100000).toFixed(1),
    color: p.accentColor
  }));

  const pieData = partnerStats.map(p => ({
    name: p.name,
    value: p.totalCount || 0,
    color: p.accentColor
  }));

  if (totalAssigned === 0 && unassignedCount === 0) {
    pieData.push({ name: 'No Leads Yet', value: 1, color: '#E2E8F0' });
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Top Banner: Affiliate Program Hub */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3977] via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3 border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Affiliate Partner Aggregation & Routing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Partner Distribution Hub
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Real-time routing overview for <span className="text-white font-bold">Rupay91, Adgrow, AGDM & Rupaysure</span>. All website applications and eligibility checks from <span className="text-amber-300 font-bold">paisainminutes.com</span> are categorized by lending partner.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenTestModal}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Website Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Distributed Leads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0A3977] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {leads.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{totalAssigned} assigned</span>
            <span>·</span>
            <span className="text-slate-400">{unassignedCount} unassigned</span>
          </div>
        </div>

        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Partners</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {AFFILIATE_PARTNERS.length}
          </div>
          <div className="text-xs text-indigo-600 font-semibold mt-1">
            Rupay91, Adgrow, AGDM, Rupaysure
          </div>
        </div>

        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Applied Volume</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalVolumeAll.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Across all affiliate lender pipelines
          </div>
        </div>

        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Eligibility Routing Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {leads.length > 0 ? Math.round((totalAssigned / leads.length) * 100) : 100}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Automated instant matching
          </div>
        </div>

      </div>

      {/* Partner Companies Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0A3977] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0A3977]" />
              <span>Affiliate Partner Companies</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any company to open its dedicated leads workspace & filters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {partnerStats.map(partner => (
            <div 
              key={partner.id}
              onClick={() => onSelectCompany && onSelectCompany(partner.id)}
              className="crm-card bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-200/80 p-5 flex flex-col justify-between cursor-pointer group hover:border-[#0A3977]/40"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wider uppercase ${partner.badgeClass}`}>
                    {partner.name}
                  </div>
                  <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#0A3977] group-hover:text-white text-slate-500 flex items-center justify-center transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 min-h-[32px]">
                  {partner.tagline}
                </p>

                {/* Primary Stats */}
                <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Assigned Leads</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {partner.totalCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Applied Volume</span>
                    <span className="font-bold text-slate-800">
                      ₹{partner.totalVolume.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Fresh / Review</span>
                    <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                      {partner.freshCount} Fresh
                    </span>
                  </div>
                </div>

                {/* Rules & Eligibility criteria pill */}
                <div className="text-[10px] text-slate-500 space-y-1 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Min CIBIL:</span>
                    <span className="font-bold text-slate-700">{partner.minCibil}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Min Salary:</span>
                    <span className="font-bold text-slate-700">₹{partner.minSalary.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                className="w-full py-2 bg-slate-100 group-hover:bg-[#0A3977] text-slate-700 group-hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>View {partner.name} Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Leads by Company */}
        <div className="lg:col-span-2 crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Lead Distribution by Partner Company
              </h3>
              <p className="text-xs text-slate-400">Total volume of customer applications routed</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                  formatter={(value, name) => [value, name === 'leads' ? 'Total Leads' : 'Volume']}
                />
                <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Allocation Share */}
        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Affiliate Share Split
            </h3>
            <p className="text-xs text-slate-400 mb-4">Traffic allocation percentage</p>
            
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {partnerStats.map(p => {
              const pct = totalAssigned > 0 ? Math.round((p.totalCount / totalAssigned) * 100) : 0;
              return (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                    <span className="font-medium text-slate-700">{p.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{p.totalCount} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
