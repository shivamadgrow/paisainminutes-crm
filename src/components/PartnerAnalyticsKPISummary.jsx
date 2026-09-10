import React, { useState, useEffect, useMemo } from 'react';
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  ArrowUpRight, 
  ArrowUpDown, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Layers,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { AFFILIATE_PARTNERS, getPartnerMeta } from '../data/affiliatePartners';
import { cleanLoanAmount } from '../utils/amountHelpers';

export default function PartnerAnalyticsKPISummary({ leads = [], onSelectCompany }) {
  const [expandedAll, setExpandedAll] = useState(false);
  const [openCard, setOpenCard] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState('commissionEarned');
  const [sortDirection, setSortDirection] = useState('desc');
  const [apiData, setApiData] = useState(null);

  // Compute or fetch partner metrics
  const fetchKPIData = async (isManualRefresh = false) => {
    setIsLoading(true);
    const endpoints = [
      '/api/partner-analytics/kpi-summary?period=FY2026-27&asOf=2026-08-20',
      'api/partner-analytics-kpi.php?period=FY2026-27&asOf=2026-08-20',
      '/api/partner-analytics-kpi.php?period=FY2026-27&asOf=2026-08-20'
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.partners) {
            setApiData(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to next endpoint
      }
    }

    // Client computation fallback based on live leads
    setTimeout(() => {
      setIsLoading(false);
    }, isManualRefresh ? 350 : 150);
  };

  useEffect(() => {
    fetchKPIData();
  }, [leads]);

  const toggleCard = (id) => {
    setOpenCard(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isCardOpen = (id) => expandedAll || !!openCard[id];

  // Derive consolidated affiliate metrics from leads & partner metadata (or API data if available)
  const affiliateMetrics = useMemo(() => {
    if (apiData && (apiData.summary || apiData.partners) && Array.isArray(apiData.partners) && apiData.partners.length > 0) {
      const partnerList = AFFILIATE_PARTNERS.map(partner => {
        const found = apiData.partners.find(p => p.id === partner.id || (p.name && p.name.toLowerCase() === partner.name.toLowerCase()));
        if (found) {
          return {
            ...partner,
            ...found,
            leadsSent: Number(found.leadsSent) || 0,
            approved: Number(found.approved) || 0,
            conversionRate: Number(found.conversionRate) || 0,
            disbursal: Number(found.disbursal) || 0,
            commissionEarned: Number(found.commissionEarned) || 0,
            paymentStatus: found.paymentStatus || partner.paymentStatus || 'Pending'
          };
        }
        return {
          ...partner,
          leadsSent: 0,
          approved: 0,
          conversionRate: 0,
          disbursal: 0,
          commissionEarned: 0,
          commissionRate: partner.commissionRate,
          paymentStatus: partner.paymentStatus
        };
      });

      const s = apiData.summary || apiData;
      const sortedByCommission = [...partnerList].sort((a, b) => b.commissionEarned - a.commissionEarned || b.disbursal - a.disbursal);
      const topPartner = (sortedByCommission.length > 0 && sortedByCommission[0].commissionEarned > 0)
        ? { name: sortedByCommission[0].name, amount: sortedByCommission[0].commissionEarned }
        : { name: partnerList[0]?.name || 'Rupay91', amount: 0 };

      return {
        totalLeadsSent: Number(s.totalLeadsSent) || partnerList.reduce((sum, p) => sum + p.leadsSent, 0),
        totalApproved: Number(s.totalApproved) || partnerList.reduce((sum, p) => sum + p.approved, 0),
        totalDisbursal: Number(s.totalDisbursal) || partnerList.reduce((sum, p) => sum + p.disbursal, 0),
        totalCommissionEarned: Number(s.totalCommissionEarned) || partnerList.reduce((sum, p) => sum + p.commissionEarned, 0),
        conversionRate: Number(s.conversionRate) || 0,
        avgCommissionPerLead: Number(s.avgCommissionPerLead) || 0,
        commissionReceived: Number(s.commissionReceived) || 0,
        commissionPending: Number(s.commissionPending) || 0,
        settlementsCount: partnerList.filter(p => p.paymentStatus === 'Paid' && p.commissionEarned > 0).length,
        pendingItemsCount: partnerList.filter(p => p.paymentStatus !== 'Paid' && p.commissionEarned > 0).length,
        topPartner,
        partners: partnerList
      };
    }

    const partnerList = AFFILIATE_PARTNERS.map(partner => {
      // Match leads assigned to this partner
      const pLeads = leads.filter(l => {
        const assigned = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        const partnerNameClean = partner.name.toLowerCase().replace(/[\s\-_]/g, '');
        const partnerIdClean = partner.id.toLowerCase().replace(/[\s\-_]/g, '');
        return assigned === partnerIdClean || assigned === partnerNameClean || (assigned && assigned.includes(partnerIdClean));
      });

      const leadsSent = pLeads.length;
      const approvedLeads = pLeads.filter(l => l.status === 'Approved' || l.status === 'Disbursed');
      const approved = approvedLeads.length;
      const conversionRate = leadsSent > 0 ? Number(((approved / leadsSent) * 100).toFixed(1)) : 0;
      
      const disbursal = approvedLeads.reduce((sum, l) => {
        return sum + cleanLoanAmount(l.loanAmount || l.applied || 50000);
      }, 0);

      const ratePct = partner.commissionPct || 0.025;
      const commissionEarned = Math.round(disbursal * ratePct);

      return {
        ...partner,
        leadsSent,
        approved,
        conversionRate,
        disbursal,
        commissionEarned,
        commissionRate: partner.commissionRate || `${(ratePct * 100).toFixed(1)}%`,
        paymentStatus: partner.paymentStatus || 'Pending'
      };
    });

    const totalLeadsSent = partnerList.reduce((sum, p) => sum + p.leadsSent, 0);
    const totalApproved = partnerList.reduce((sum, p) => sum + p.approved, 0);
    const totalDisbursal = partnerList.reduce((sum, p) => sum + p.disbursal, 0);
    const totalCommissionEarned = partnerList.reduce((sum, p) => sum + p.commissionEarned, 0);
    const conversionRate = totalLeadsSent > 0 ? Number(((totalApproved / totalLeadsSent) * 100).toFixed(1)) : 0;
    const avgCommissionPerLead = totalApproved > 0 ? Math.round(totalCommissionEarned / totalApproved) : 0;

    const commissionReceived = partnerList
      .filter(p => p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + p.commissionEarned, 0);

    const commissionPending = partnerList
      .filter(p => p.paymentStatus !== 'Paid')
      .reduce((sum, p) => sum + p.commissionEarned, 0);

    const settlementsCount = partnerList.filter(p => p.paymentStatus === 'Paid' && p.commissionEarned > 0).length;
    const pendingItemsCount = partnerList.filter(p => p.paymentStatus !== 'Paid' && p.commissionEarned > 0).length;

    const sortedByCommission = [...partnerList].sort((a, b) => b.commissionEarned - a.commissionEarned || b.disbursal - a.disbursal);
    const topPartner = (sortedByCommission.length > 0 && sortedByCommission[0].commissionEarned > 0)
      ? { name: sortedByCommission[0].name, amount: sortedByCommission[0].commissionEarned }
      : { name: partnerList[0]?.name || 'Rupay91', amount: 0 };

    return {
      totalLeadsSent,
      totalApproved,
      totalDisbursal,
      totalCommissionEarned,
      conversionRate,
      avgCommissionPerLead,
      commissionReceived,
      commissionPending,
      settlementsCount,
      pendingItemsCount,
      topPartner,
      partners: partnerList
    };
  }, [leads]);

  // Handle table sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedPartners = useMemo(() => {
    const list = [...affiliateMetrics.partners];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [affiliateMetrics.partners, sortField, sortDirection]);

  // Payment status badge renderer
  const renderPaymentStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Overdue</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 1. Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <span>KPI summary</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Affiliate Analytics
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            <span className="text-purple-600 font-semibold">FY 2026-27</span> as at 20/08/2026 — every figure is an IST calendar period
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpandedAll(!expandedAll)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            {expandedAll ? 'Collapse all' : 'Expand all'}
          </button>
          <button
            type="button"
            onClick={() => fetchKPIData(true)}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0A3977]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Row 1 — Primary KPI Cards (4 Large Cards, Equal Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: TOTAL LEADS SENT */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-l-blue-600 flex flex-col justify-between">
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              TOTAL LEADS SENT
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                Number(affiliateMetrics.totalLeadsSent || 0).toLocaleString('en-IN')
              )}
            </div>
            <div className="text-xs text-slate-500">
              {affiliateMetrics.totalLeadsSent} leads · August 2026
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-slate-100 bg-slate-50/60">
            <button
              type="button"
              onClick={() => toggleCard('leads-sent')}
              className="w-full py-2 px-5 text-center text-xs font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('leads-sent') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('leads-sent') && (
              <div className="p-3 border-t border-slate-100 bg-white text-xs space-y-1.5 text-slate-600 animate-fade-in">
                {affiliateMetrics.partners.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                      {p.name}:
                    </span>
                    <strong className="text-slate-900 font-mono">{p.leadsSent}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: TOTAL APPROVED / CONVERTED */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-l-emerald-600 flex flex-col justify-between">
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              TOTAL APPROVED / CONVERTED
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                Number(affiliateMetrics.totalApproved || 0).toLocaleString('en-IN')
              )}
            </div>
            <div className="text-xs text-slate-500">
              {affiliateMetrics.totalApproved} of {affiliateMetrics.totalLeadsSent} · {affiliateMetrics.conversionRate}%
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-slate-100 bg-slate-50/60">
            <button
              type="button"
              onClick={() => toggleCard('approved')}
              className="w-full py-2 px-5 text-center text-xs font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('approved') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('approved') && (
              <div className="p-3 border-t border-slate-100 bg-white text-xs space-y-1.5 text-slate-600 animate-fade-in">
                {affiliateMetrics.partners.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                      {p.name}:
                    </span>
                    <span className="text-slate-900 font-mono text-[11px]">
                      <strong>{p.approved}</strong> ({p.conversionRate}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: TOTAL DISBURSAL */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-l-purple-600 flex flex-col justify-between">
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              TOTAL DISBURSAL
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-8 w-28 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                `₹${Number(affiliateMetrics.totalDisbursal || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <div className="text-xs text-slate-500">
              {affiliateMetrics.totalApproved} cases · August 2026
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-slate-100 bg-slate-50/60">
            <button
              type="button"
              onClick={() => toggleCard('disbursal')}
              className="w-full py-2 px-5 text-center text-xs font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('disbursal') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('disbursal') && (
              <div className="p-3 border-t border-slate-100 bg-white text-xs space-y-1.5 text-slate-600 animate-fade-in">
                {affiliateMetrics.partners.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                      {p.name}:
                    </span>
                    <strong className="text-slate-900 font-mono">₹{Number(p.disbursal || 0).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: TOTAL COMMISSION EARNED (Visually Emphasized Card) */}
        <div className="crm-card bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 overflow-hidden rounded-2xl border-2 border-amber-400 shadow-md flex flex-col justify-between relative">
          <div className="absolute top-2.5 right-3">
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-2xs">
              Primary KPI
            </span>
          </div>

          <div className="p-5">
            <span className="text-[11px] font-extrabold tracking-wider text-amber-800 uppercase block mb-1">
              TOTAL COMMISSION EARNED
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 mb-1 flex items-baseline gap-1">
              {isLoading ? (
                <div className="h-8 w-28 bg-amber-200 rounded-md animate-pulse"></div>
              ) : (
                `₹${Number(affiliateMetrics.totalCommissionEarned || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <div className="text-xs text-amber-700/80 font-medium">
              August 2026 · <span className="italic">excludes TDS</span>
            </div>
          </div>

          {/* Breakdown Toggle */}
          <div className="border-t border-amber-200/70 bg-amber-100/40">
            <button
              type="button"
              onClick={() => toggleCard('commission-earned')}
              className="w-full py-2 px-5 text-center text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('commission-earned') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {isCardOpen('commission-earned') && (
              <div className="p-3 border-t border-amber-200/70 bg-white text-xs space-y-1.5 text-slate-700 animate-fade-in">
                {affiliateMetrics.partners.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-0.5">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                      {p.name} ({p.commissionRate}):
                    </span>
                    <strong className="text-amber-900 font-mono">₹{Number(p.commissionEarned || 0).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Row 2 — Secondary KPI Cards (5 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* CARD 1: CONVERSION RATE % */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-t-4 border-t-emerald-500 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              CONVERSION RATE %
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-6 w-16 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                `${affiliateMetrics.conversionRate}%`
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {affiliateMetrics.totalApproved} of {affiliateMetrics.totalLeadsSent} leads
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleCard('rate-breakdown')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('rate-breakdown') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isCardOpen('rate-breakdown') && (
              <div className="p-2.5 border-t border-slate-100 bg-white text-[11px] space-y-1 text-slate-600">
                {affiliateMetrics.partners.map(p => (
                  <div key={p.id} className="flex justify-between">
                    <span className="truncate max-w-[100px]">{p.name}:</span>
                    <strong className="text-slate-900">{p.conversionRate}%</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: AVG COMMISSION / LEAD */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-t-4 border-t-blue-500 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              AVG COMMISSION / LEAD
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-6 w-16 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                `₹${Number(affiliateMetrics.avgCommissionPerLead || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleCard('avg-comm-breakdown')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('avg-comm-breakdown') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isCardOpen('avg-comm-breakdown') && (
              <div className="p-2.5 border-t border-slate-100 bg-white text-[11px] space-y-1 text-slate-600">
                {affiliateMetrics.partners.map(p => {
                  const avg = p.approved > 0 ? Math.round(p.commissionEarned / p.approved) : 0;
                  return (
                    <div key={p.id} className="flex justify-between">
                      <span className="truncate max-w-[100px]">{p.name}:</span>
                      <strong className="text-slate-900">₹{Number(avg || 0).toLocaleString('en-IN')}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: COMMISSION RECEIVED */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-t-4 border-t-emerald-600 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              COMMISSION RECEIVED
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                `₹${Number(affiliateMetrics.commissionReceived || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {affiliateMetrics.settlementsCount} settlements · August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleCard('comm-received-breakdown')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('comm-received-breakdown') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isCardOpen('comm-received-breakdown') && (
              <div className="p-2.5 border-t border-slate-100 bg-white text-[11px] space-y-1 text-slate-600">
                {affiliateMetrics.partners.filter(p => p.paymentStatus === 'Paid').map(p => (
                  <div key={p.id} className="flex justify-between">
                    <span className="truncate max-w-[100px]">{p.name}:</span>
                    <strong className="text-emerald-700">₹{Number(p.commissionEarned || 0).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: COMMISSION PENDING */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-t-4 border-t-amber-500 flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              COMMISSION PENDING
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {isLoading ? (
                <div className="h-6 w-20 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                `₹${Number(affiliateMetrics.commissionPending || 0).toLocaleString('en-IN')}`
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {affiliateMetrics.pendingItemsCount} pending items · <span className="italic text-[10px]">scheduled, not outstanding</span>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleCard('comm-pending-breakdown')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('comm-pending-breakdown') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isCardOpen('comm-pending-breakdown') && (
              <div className="p-2.5 border-t border-slate-100 bg-white text-[11px] space-y-1 text-slate-600">
                {affiliateMetrics.partners.filter(p => p.paymentStatus !== 'Paid').map(p => (
                  <div key={p.id} className="flex justify-between">
                    <span className="truncate max-w-[100px]">{p.name}:</span>
                    <strong className="text-amber-700">₹{Number(p.commissionEarned || 0).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 5: TOP PERFORMING PARTNER */}
        <div className="crm-card bg-white overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs border-t-4 border-t-[#0A3977] flex flex-col justify-between">
          <div className="p-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              TOP PERFORMING PARTNER
            </span>
            <div className="text-lg font-extrabold text-[#0A3977] mb-1 truncate" title={affiliateMetrics.topPartner.name}>
              {isLoading ? (
                <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse"></div>
              ) : (
                affiliateMetrics.topPartner.name
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              ₹{Number(affiliateMetrics?.topPartner?.amount || 0).toLocaleString('en-IN')} · August 2026
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => toggleCard('top-partner-breakdown')}
              className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-[#0A3977] flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <span>Breakdown</span>
              {isCardOpen('top-partner-breakdown') ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {isCardOpen('top-partner-breakdown') && (
              <div className="p-2.5 border-t border-slate-100 bg-white text-[11px] space-y-1 text-slate-600">
                {[...affiliateMetrics.partners]
                  .sort((a, b) => b.commissionEarned - a.commissionEarned)
                  .map((p, rank) => (
                    <div key={p.id} className="flex justify-between">
                      <span className="truncate max-w-[100px]">#{rank + 1} {p.name}:</span>
                      <strong className="text-slate-900">₹{Number(p.commissionEarned || 0).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Row 3 — Partner-wise Breakdown Table */}
      <div className="crm-card bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0A3977]" />
              <span>Partner-wise performance</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative traffic, conversion rates, and revenue metrics across all 8 active lending partners
            </p>
          </div>

          <span className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg w-fit">
            {affiliateMetrics.partners.length} Active Partners
          </span>
        </div>

        {/* Table Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th 
                  onClick={() => handleSort('name')}
                  className="p-3.5 cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Partner</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('leadsSent')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Leads Sent</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('approved')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Approved</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('conversionRate')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Conversion %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('disbursal')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Disbursal (₹)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('commissionEarned')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Commission Earned (₹)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('commissionRate')}
                  className="p-3.5 text-center cursor-pointer hover:text-slate-800 transition"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Commission Rate</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 text-center">
                  <span>Payment Status</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3.5"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-12 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-12 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-14 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-3.5 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td>
                    <td className="p-3.5 text-center"><div className="h-4 w-12 bg-slate-200 rounded mx-auto"></div></td>
                    <td className="p-3.5 text-center"><div className="h-5 w-16 bg-slate-200 rounded-full mx-auto"></div></td>
                  </tr>
                ))
              ) : (
                sortedPartners.map((partner) => (
                  <tr 
                    key={partner.id}
                    onClick={() => onSelectCompany && onSelectCompany(partner.id)}
                    className="hover:bg-blue-50/40 transition cursor-pointer group"
                    title={`Click to view ${partner.name} detail dashboard`}
                  >
                    {/* Partner Name & Branding */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: partner.accentColor }}
                        ></span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#0A3977] transition flex items-center gap-1">
                            <span>{partner.name}</span>
                            <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-[#0A3977] transition" />
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {partner.tagline || partner.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leads Sent */}
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-800">
                      {partner.leadsSent > 0 ? Number(partner.leadsSent || 0).toLocaleString('en-IN') : '0'}
                    </td>

                    {/* Approved */}
                    <td className="p-3.5 text-right font-mono font-semibold text-emerald-700">
                      {partner.approved > 0 ? Number(partner.approved || 0).toLocaleString('en-IN') : '0'}
                    </td>

                    {/* Conversion % */}
                    <td className="p-3.5 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        partner.conversionRate >= 20 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : partner.conversionRate > 0 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {partner.conversionRate > 0 ? `${partner.conversionRate}%` : '0%'}
                      </span>
                    </td>

                    {/* Disbursal (₹) */}
                    <td className="p-3.5 text-right font-mono text-slate-800">
                      {partner.disbursal > 0 ? `₹${Number(partner.disbursal || 0).toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    {/* Commission Earned (₹) */}
                    <td className="p-3.5 text-right font-mono font-bold text-amber-900">
                      {partner.commissionEarned > 0 ? `₹${Number(partner.commissionEarned || 0).toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    {/* Commission Rate */}
                    <td className="p-3.5 text-center font-mono text-[11px] text-slate-600">
                      {partner.commissionRate}
                    </td>

                    {/* Payment Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {renderPaymentStatusBadge(partner.paymentStatus)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Row */}
        {!isLoading && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 flex items-center gap-2">
              <span>💡 Tip: Click any row to view full applicant tracking and distribution list for that partner.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-semibold font-mono">
              <div>Total Disbursed: <strong className="text-slate-900">₹{Number(affiliateMetrics.totalDisbursal || 0).toLocaleString('en-IN')}</strong></div>
              <div className="text-amber-800">Total Accrued: <strong className="text-amber-950">₹{Number(affiliateMetrics.totalCommissionEarned || 0).toLocaleString('en-IN')}</strong></div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
