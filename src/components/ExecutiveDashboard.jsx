import React from 'react';
import { 
  Building2, 
  IndianRupee, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  Globe,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { cleanLoanAmount } from '../utils/amountHelpers';

export default function ExecutiveDashboard({ stats, leads = [], onSelectCompany, onOpenPartnerHub }) {
  // Aggregate partner metrics
  const partnerBreakdown = AFFILIATE_PARTNERS.map(partner => {
    const count = leads.filter(l => {
      const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
      return c === partner.id || c === partner.name.toLowerCase().replace(/[\s\-_]/g, '');
    }).length;

    const volume = leads
      .filter(l => {
        const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        return c === partner.id || c === partner.name.toLowerCase().replace(/[\s\-_]/g, '');
      })
      .reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied), 0);

    return {
      ...partner,
      count,
      volume
    };
  });

  const totalVolume = leads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied), 0);
  const eligibilityLeads = leads.filter(l => (l.source || '').toLowerCase().includes('eligibility')).length;
  const applyNowLeads = leads.filter(l => (l.source || '').toLowerCase().includes('apply')).length;

  const barData = partnerBreakdown.map(p => ({
    name: p.name,
    leads: p.count,
    color: p.accentColor
  }));

  const pieData = partnerBreakdown.map(p => ({
    name: p.name,
    value: p.count,
    color: p.accentColor
  }));

  if (leads.length === 0) {
    pieData.push({ name: 'Awaiting Leads', value: 1, color: '#E2E8F0' });
  }

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Dashboard Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0A3977]">
            Executive Overview & Partner Distribution
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time affiliate traffic analytics for <span className="font-semibold text-slate-800">paisainminutes.com</span>
          </p>
        </div>

        <button
          onClick={onOpenPartnerHub}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-[#0A3977] border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-[#0A3977]" />
          <span>Open Partner Hub</span>
        </button>
      </div>

      {/* Top 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: TOTAL LEADS INGESTED */}
        <div className="crm-card p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TOTAL WEBSITE LEADS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0A3977] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {leads.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-blue-700 font-semibold">{stats?.freshCount || 0} Fresh</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">{stats?.approvedCount || 0} Approved</span>
          </div>
        </div>

        {/* Card 2: TOTAL APPLIED VALUE */}
        <div className="crm-card p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              APPLIED VOLUME
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Customer requested loan volume
          </div>
        </div>

        {/* Card 3: ACTIVE PARTNERS */}
        <div className="crm-card p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              AFFILIATE PARTNERS
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {AFFILIATE_PARTNERS.length}
          </div>
          <div className="text-xs text-indigo-700 font-semibold mt-1">
            Rupay91, Adgrow, AGDM, Rupaysure
          </div>
        </div>

        {/* Card 4: ELIGIBILITY ROUTING RATE */}
        <div className="crm-card p-5 bg-white rounded-2xl shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              MATCH & ROUTING RATE
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            100%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Automated instant matching
          </div>
        </div>

      </div>

      {/* 4 Partner Company Sections Quick Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#0A3977] uppercase tracking-wider">
            Partner Company Allocation
          </h2>
          <span className="text-xs text-slate-400">Click any partner to open section</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {partnerBreakdown.map(p => (
            <div
              key={p.id}
              onClick={() => onSelectCompany && onSelectCompany(p.id)}
              className="crm-card bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition cursor-pointer group hover:border-[#0A3977]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${p.badgeClass}`}>
                  {p.name}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A3977] transition" />
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">
                {p.count} <span className="text-xs font-medium text-slate-400">Leads</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Volume: <span className="font-bold text-slate-800">₹{p.volume.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lead Allocation Chart */}
        <div className="lg:col-span-2 crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Partner Lead Distribution
              </h3>
              <p className="text-xs text-slate-400">Applications routed per lending company</p>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#FFF', fontSize: '11px' }}
                />
                <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Affiliate Allocation Share Donut */}
        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Affiliate Share Split
            </h3>
            <p className="text-xs text-slate-400 mb-2">Traffic allocation</p>
            
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

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {partnerBreakdown.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                  <span className="font-medium text-slate-700">{p.name}</span>
                </div>
                <span className="font-bold text-slate-900">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Lead Inflow Feed */}
      {recentLeads.length > 0 && (
        <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Recent Ingested Leads
          </h3>
          <div className="divide-y divide-slate-100">
            {recentLeads.map((l, idx) => (
              <div key={l.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {l.initials || 'AP'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{l.name || 'Applicant'}</span>
                    <span className="text-slate-400 font-mono ml-2">{l.mobile}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {l.assignedCompany || 'Unassigned'}
                  </span>
                  <span className="font-bold text-slate-800">₹{cleanLoanAmount(l.applied || l.loanAmount).toLocaleString('en-IN')}</span>
                  <span className="text-slate-400 text-[10px]">{l.created || 'Today'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
