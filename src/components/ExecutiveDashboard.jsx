import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Building2, 
  IndianRupee, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Layers, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  RefreshCw,
  ChevronDown,
  Filter,
  CheckCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid,
  Legend 
} from 'recharts';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { cleanLoanAmount, formatToIST } from '../utils/amountHelpers';

export default function ExecutiveDashboard({ stats, leads = [], onSelectCompany, onOpenPartnerHub }) {
  // Period filter state: 'this_month' | 'last_month' | 'this_fy' | 'custom'
  const [period, setPeriod] = useState('this_month');
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [customEnd, setCustomEnd] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [showCustomRangeInputs, setShowCustomRangeInputs] = useState(false);

  // Line chart visibility toggle for Approved line
  const [showApprovedLine, setShowApprovedLine] = useState(true);

  // API State
  const [apiData, setApiData] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to parse lead timestamps
  const getLeadDate = useCallback((lead) => {
    const raw = lead?.created_at || lead?.createdAt || lead?.created || lead?.date;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }, []);

  // Compute period start, end dates and period label
  const { periodStart, periodEnd, periodLabel, priorStart, priorEnd, priorPeriodName } = useMemo(() => {
    const now = new Date();
    let start, end, label, priorPeriodName = 'last month';

    if (period === 'last_month') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      label = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      priorPeriodName = 'prior month';
    } else if (period === 'this_fy') {
      const curYear = now.getFullYear();
      const fyStartYear = now.getMonth() >= 3 ? curYear : curYear - 1;
      start = new Date(fyStartYear, 3, 1, 0, 0, 0, 0);
      end = new Date(now.getTime());
      label = `FY ${fyStartYear}-${String(fyStartYear + 1).slice(-2)}`;
      priorPeriodName = 'last FY';
    } else if (period === 'custom') {
      start = customStart ? new Date(`${customStart}T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), 1);
      end = customEnd ? new Date(`${customEnd}T23:59:59`) : new Date();
      label = `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      priorPeriodName = 'prior period';
    } else {
      // this_month
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getTime());
      label = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      priorPeriodName = 'last month';
    }

    const durationMs = end.getTime() - start.getTime();
    const pEnd = new Date(start.getTime() - 1);
    const pStart = new Date(pEnd.getTime() - durationMs);

    return {
      periodStart: start,
      periodEnd: end,
      periodLabel: label,
      priorStart: pStart,
      priorEnd: pEnd,
      priorPeriodName
    };
  }, [period, customStart, customEnd]);

  // Fetch from backend API
  const fetchExecutiveData = useCallback(async () => {
    try {
      setIsLoadingApi(true);
      const endpoints = [
        `/api/dashboard/executive-overview?period=${period}&startDate=${customStart}&endDate=${customEnd}`,
        `/crm/api/executive-overview.php?period=${period}&startDate=${customStart}&endDate=${customEnd}`,
        `/admin/api/executive-overview.php?period=${period}&startDate=${customStart}&endDate=${customEnd}`
      ];

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json && json.success) {
              setApiData(json);
              return;
            }
          }
        } catch (e) {
          // try next endpoint
        }
      }
    } catch (err) {
      console.warn('Executive API fetch failed, falling back to local calculation:', err);
    } finally {
      setIsLoadingApi(false);
      setIsRefreshing(false);
    }
  }, [period, customStart, customEnd]);

  useEffect(() => {
    fetchExecutiveData();
  }, [fetchExecutiveData]);

  // Auto-refresh timer every 30 seconds for recent activity
  useEffect(() => {
    const timer = setInterval(() => {
      fetchExecutiveData();
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchExecutiveData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchExecutiveData();
  };

  // Local calculation engine for instant zero-lag rendering
  const computedMetrics = useMemo(() => {
    // Partition leads into current period and prior period
    const currentPeriodLeads = [];
    const priorPeriodLeads = [];

    leads.forEach(l => {
      const dt = getLeadDate(l);
      if (!dt) {
        currentPeriodLeads.push(l);
        return;
      }
      if (dt >= periodStart && dt <= periodEnd) {
        currentPeriodLeads.push(l);
      } else if (dt >= priorStart && dt <= priorEnd) {
        priorPeriodLeads.push(l);
      }
    });

    // Partner breakdown
    const partnerBreakdown = AFFILIATE_PARTNERS.map(partner => {
      const pLeads = currentPeriodLeads.filter(l => {
        const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        return c === partner.id || c === partner.name.toLowerCase().replace(/[\s\-_]/g, '') || c.includes(partner.id);
      });

      const count = pLeads.length;
      const volume = pLeads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied), 0);

      const approvedLeads = pLeads.filter(l => {
        const st = (l.status || '').toLowerCase();
        return st === 'approved' || st === 'disbursed';
      });
      const approvedCount = approvedLeads.length;

      const ratePct = partner.commissionPct || 0.025;
      const commission = Math.round(volume * ratePct);

      return {
        ...partner,
        count,
        volume,
        approved: approvedCount,
        commission
      };
    });

    const totalLeads = currentPeriodLeads.length;
    const freshCount = currentPeriodLeads.filter(l => (l.status || '').toLowerCase() === 'fresh').length;
    const totalApproved = currentPeriodLeads.filter(l => {
      const st = (l.status || '').toLowerCase();
      return st === 'approved' || st === 'disbursed';
    }).length;

    const totalVolume = currentPeriodLeads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied), 0);
    const totalCommissionEarned = partnerBreakdown.reduce((sum, p) => sum + p.commission, 0);

    // Prior period calculations for trends
    const priorTotalLeads = priorPeriodLeads.length;
    const priorApproved = priorPeriodLeads.filter(l => {
      const st = (l.status || '').toLowerCase();
      return st === 'approved' || st === 'disbursed';
    }).length;
    const priorVolume = priorPeriodLeads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied), 0);
    const priorCommission = Math.round(priorVolume * 0.025);

    const calcTrend = (curr, prior) => {
      if (prior <= 0) return null;
      const diff = ((curr - prior) / prior) * 100;
      return Math.round(diff * 10) / 10;
    };

    // Leads over time (daily or weekly points)
    const periodDays = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 3600 * 24)));
    const isDaily = periodDays <= 62;

    const dateBuckets = {};
    const cursor = new Date(periodStart);
    while (cursor <= periodEnd) {
      const key = isDaily 
        ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
        : `${cursor.getFullYear()}-W${Math.ceil(cursor.getDate() / 7)}`;
      const label = isDaily 
        ? cursor.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
        : `Wk ${Math.ceil(cursor.getDate() / 7)} ${cursor.toLocaleDateString('en-IN', { month: 'short' })}`;

      if (!dateBuckets[key]) {
        dateBuckets[key] = { date: label, totalLeads: 0, approved: 0 };
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    currentPeriodLeads.forEach(l => {
      const dt = getLeadDate(l) || periodEnd;
      const key = isDaily 
        ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
        : `${dt.getFullYear()}-W${Math.ceil(dt.getDate() / 7)}`;
      if (dateBuckets[key]) {
        dateBuckets[key].totalLeads++;
        const st = (l.status || '').toLowerCase();
        if (st === 'approved' || st === 'disbursed') {
          dateBuckets[key].approved++;
        }
      }
    });

    const leadsOverTime = Object.values(dateBuckets);

    // Recent activity list (last 10 items)
    const sorted = [...leads].sort((a, b) => {
      const da = getLeadDate(a)?.getTime() || 0;
      const db = getLeadDate(b)?.getTime() || 0;
      return db - da;
    });

    const recentActivity = sorted.slice(0, 10).map((l, idx) => {
      const st = (l.status || 'Fresh').toLowerCase();
      let eventType = 'New Lead';
      let eventColor = 'bg-blue-500';
      if (st === 'approved') {
        eventType = 'Status Change → Approved';
        eventColor = 'bg-emerald-500';
      } else if (st === 'disbursed') {
        eventType = 'Loan Disbursed';
        eventColor = 'bg-purple-600';
      } else if (st.includes('doc')) {
        eventType = 'Documents Submitted';
        eventColor = 'bg-amber-500';
      } else if (st === 'interested') {
        eventType = 'Customer Interested';
        eventColor = 'bg-cyan-500';
      }

      return {
        id: l.id || `lead-${idx}`,
        timestamp: l.created_at || l.createdAt || l.created || new Date().toISOString(),
        leadRef: l.id ? String(l.id) : `L-${1020 + idx}`,
        leadName: l.name || 'Applicant',
        partner: l.assignedCompany || 'Rupay91',
        eventType,
        eventColor,
        amount: cleanLoanAmount(l.loanAmount || l.applied)
      };
    });

    return {
      partnerBreakdown,
      totalLeads,
      freshCount,
      totalApproved,
      appliedVolume: totalVolume,
      totalVolume,
      totalCommissionEarned,
      leadsOverTime,
      recentActivity,
      trends: {
        totalLeads: calcTrend(totalLeads, priorTotalLeads),
        totalApproved: calcTrend(totalApproved, priorApproved),
        appliedVolume: calcTrend(totalVolume, priorVolume),
        totalCommissionEarned: calcTrend(totalCommissionEarned, priorCommission)
      }
    };
  }, [leads, periodStart, periodEnd, priorStart, priorEnd, getLeadDate]);

  // Use API data if available, with computed metrics as dependable real-time source
  const totalLeads = (apiData?.totalLeads ?? computedMetrics?.totalLeads) || 0;
  const totalApproved = (apiData?.totalApproved ?? computedMetrics?.totalApproved) || 0;
  const appliedVolume = (apiData?.appliedVolume ?? computedMetrics?.appliedVolume) || 0;
  const totalCommissionEarned = (apiData?.totalCommissionEarned ?? computedMetrics?.totalCommissionEarned) || 0;
  const partnerBreakdown = apiData?.partners ?? computedMetrics?.partnerBreakdown ?? [];
  const leadsOverTime = (apiData?.leadsOverTime && apiData.leadsOverTime.length > 0) ? apiData.leadsOverTime : (computedMetrics?.leadsOverTime || []);
  const recentActivity = (apiData?.recentActivity && apiData.recentActivity.length > 0) ? apiData.recentActivity : (computedMetrics?.recentActivity || []);

  const trends = {
    totalLeads: apiData?.totalLeadsTrend ?? computedMetrics?.trends?.totalLeads ?? null,
    totalApproved: apiData?.totalApprovedTrend ?? computedMetrics?.trends?.totalApproved ?? null,
    appliedVolume: apiData?.appliedVolumeTrend ?? computedMetrics?.trends?.appliedVolume ?? null,
    totalCommissionEarned: apiData?.totalCommissionTrend ?? computedMetrics?.trends?.totalCommissionEarned ?? null
  };

  // Bar and Pie chart data
  const barData = partnerBreakdown.map(p => ({
    name: p.name,
    leads: p.leads ?? p.count ?? 0,
    color: p.accentColor || '#0A3977'
  }));

  const pieData = partnerBreakdown.map(p => ({
    name: p.name,
    value: p.leads ?? p.count ?? 0,
    color: p.accentColor || '#0A3977'
  }));

  if (pieData.every(d => d.value === 0)) {
    pieData.push({ name: 'Awaiting Leads', value: 1, color: '#E2E8F0' });
  }

  // Trend indicator component
  const TrendBadge = ({ value, label = priorPeriodName }) => {
    if (value === null || value === undefined || isNaN(value) || value === 0) {
      return null;
    }
    const isPositive = value > 0;
    return (
      <span 
        className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
          isPositive 
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/80' 
            : 'text-rose-600 bg-rose-50 border border-rose-200/80'
        }`}
        title={`${isPositive ? '+' : ''}${value}% vs ${label}`}
      >
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{isPositive ? `↑${value}%` : `↓${Math.abs(value)}%`}</span>
        <span className="text-[10px] font-normal text-slate-400 hidden sm:inline ml-0.5">vs {label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Dashboard Title & Overview Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-[#0A3977]">
              Executive Overview & Partner Distribution
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0A3977] border border-blue-200 hidden sm:inline">
              LIVE PORTFOLIO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time affiliate traffic analytics for <span className="font-semibold text-slate-800">paisainminutes.com</span> · <span className="font-bold text-[#0A3977]">{periodLabel}</span>
          </p>
        </div>

        {/* Action Controls: Period Dropdown & Open Partner Hub */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Period Filter Dropdown */}
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="executive-period-filter"
                value={period}
                onChange={(e) => {
                  const val = e.target.value;
                  setPeriod(val);
                  setShowCustomRangeInputs(val === 'custom');
                }}
                className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer text-xs pr-1"
              >
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_fy">This FY</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Pickers if Custom Range is Selected */}
          {showCustomRangeInputs && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
              <input 
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold outline-none"
              />
              <span className="text-slate-400 font-bold">to</span>
              <input 
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold outline-none"
              />
            </div>
          )}

          {/* Open Partner Hub Button */}
          <button
            id="executive-open-partner-hub-btn"
            onClick={onOpenPartnerHub}
            className="px-3.5 py-1.5 bg-[#0A3977] hover:bg-[#082a57] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Open Partner Hub</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Card 1: TOTAL WEBSITE LEADS (Existing) */}
        <div className="crm-card p-4 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                TOTAL WEBSITE LEADS
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0A3977] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-slate-900">
                {totalLeads}
              </div>
              <TrendBadge value={trends.totalLeads} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span className="text-blue-700 font-bold">{computedMetrics.freshCount} Fresh</span>
            <span>·</span>
            <span className="text-emerald-600 font-bold">{totalApproved} Approved</span>
          </div>
        </div>

        {/* Card 2: [NEW] TOTAL APPROVED */}
        <div className="crm-card p-4 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                TOTAL APPROVED
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-slate-900">
                {totalApproved}
              </div>
              <TrendBadge value={trends.totalApproved} />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 border-t border-slate-100 pt-2 truncate">
            <span className="font-semibold text-emerald-700">{totalApproved}</span> of <span className="font-semibold">{totalLeads}</span> applied
          </div>
        </div>

        {/* Card 3: APPLIED VOLUME (Existing) */}
        <div className="crm-card p-4 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                APPLIED VOLUME
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-slate-900 truncate">
                ₹{appliedVolume >= 10000000 
                  ? `${(appliedVolume / 10000000).toFixed(2)} Cr` 
                  : (appliedVolume >= 100000 
                    ? `${(appliedVolume / 100000).toFixed(2)} L` 
                    : appliedVolume.toLocaleString('en-IN'))}
              </div>
              <TrendBadge value={trends.appliedVolume} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 border-t border-slate-100 pt-2 truncate">
            Customer requested loan volume
          </div>
        </div>

        {/* Card 4: [NEW] TOTAL COMMISSION EARNED (Visually Emphasized) */}
        <div className="crm-card p-4 rounded-2xl shadow-sm border-2 border-emerald-400 bg-linear-to-br from-emerald-50/90 via-white to-emerald-50/40 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-emerald-200/40 rounded-full blur-sm pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-wider text-emerald-800 uppercase flex items-center gap-1">
                TOTAL COMMISSION EARNED
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-emerald-950">
                ₹{totalCommissionEarned.toLocaleString('en-IN')}
              </div>
              <TrendBadge value={trends.totalCommissionEarned} />
            </div>
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-2 border-t border-emerald-100 pt-2 truncate">
            {periodLabel} · across {AFFILIATE_PARTNERS.length} partners
          </div>
        </div>

        {/* Card 5: AFFILIATE PARTNERS (Existing) */}
        <div className="crm-card p-4 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                AFFILIATE PARTNERS
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {AFFILIATE_PARTNERS.length}
            </div>
          </div>
          <div className="text-[11px] text-purple-700 font-bold mt-2 border-t border-slate-100 pt-2 truncate">
            Active Lending Partners
          </div>
        </div>

        {/* Card 6: MATCH & ROUTING RATE (Existing) */}
        <div className="crm-card p-4 bg-white rounded-2xl shadow-2xs border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                MATCH & ROUTING RATE
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              100%
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-2 border-t border-slate-100 pt-2 truncate">
            Automated instant matching
          </div>
        </div>

      </div>

      {/* Partner Company Allocation Cards (8 Partners with Approved & Commission fields) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#0A3977] uppercase tracking-wider">
              Partner Company Allocation
            </h2>
            <span className="text-xs text-slate-400">({periodLabel})</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Click any partner card to view dedicated portal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {partnerBreakdown.map(p => {
            const leadsCount = p.leads ?? p.count ?? 0;
            const volumeAmt = p.volume ?? 0;
            const approvedCount = p.approved ?? 0;
            const commissionAmt = p.commission ?? 0;

            return (
              <div
                key={p.id}
                onClick={() => onSelectCompany && onSelectCompany(p.id)}
                className="crm-card bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#0A3977] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${p.badgeClass}`}>
                    {p.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A3977] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <div className="text-xl font-black text-slate-900 mt-2">
                  {leadsCount} <span className="text-xs font-medium text-slate-400">Leads</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Volume: <span className="font-bold text-slate-800">₹{volumeAmt.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Approved: <span className="font-bold text-emerald-700">{approvedCount}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Commission: <span className="font-bold text-slate-800">₹{commissionAmt.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW Chart: "Leads Over Time" Line Chart */}
      <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Leads Over Time</span>
              <span className="text-xs font-normal text-slate-400">· {periodLabel}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Daily application volume vs approved conversions</p>
          </div>

          {/* Toggle Button for Approved Line */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApprovedLine(!showApprovedLine)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                showApprovedLine 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
              title="Toggle Approved leads line"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${showApprovedLine ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              <span>Approved Trend {showApprovedLine ? '(Visible)' : '(Hidden)'}</span>
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsOverTime} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '10px', 
                  border: 'none', 
                  color: '#FFF', 
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }} 
              />
              <Legend 
                onClick={(e) => {
                  if (e.dataKey === 'approved') {
                    setShowApprovedLine(!showApprovedLine);
                  }
                }}
                wrapperStyle={{ cursor: 'pointer', fontSize: '11px', paddingTop: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="totalLeads" 
                name="Total Leads" 
                stroke="#0A3977" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#0A3977' }} 
                activeDot={{ r: 5 }} 
              />
              {showApprovedLine && (
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  name="Approved" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4" 
                  dot={{ r: 3, fill: '#10B981' }} 
                  activeDot={{ r: 5 }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Charts Grid: Partner Distribution Bar + Share Split Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lead Allocation Chart (Bar) */}
        <div className="lg:col-span-2 crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Partner Lead Distribution
              </h3>
              <p className="text-xs text-slate-400">Applications routed per lending company ({periodLabel})</p>
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
            <p className="text-xs text-slate-400 mb-2">Traffic allocation percentage</p>
            
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

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs max-h-36 overflow-y-auto pr-1">
            {partnerBreakdown.map(p => (
              <div key={p.id} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor || '#0A3977' }}></span>
                  <span className="font-medium text-slate-700">{p.name}</span>
                </div>
                <span className="font-bold text-slate-900">{p.leads ?? p.count ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* NEW Section: "Recent Activity" (Bottom of Page, Auto-refresh + Manual Refresh) */}
      <div className="crm-card bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Activity
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest lead submissions, routing actions, and partner status updates
            </p>
          </div>

          {/* Refresh Button with Spinner Animation */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Auto-refreshes every 30s</span>
            <button
              id="executive-activity-refresh-btn"
              onClick={handleManualRefresh}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh recent activity feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0A3977] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Activity Items List */}
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No activity records found for this period.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((act) => {
              const dt = formatToIST(act.timestamp);
              return (
                <div key={act.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50/60 px-2 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    {/* Event Color Dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" style={{
                      backgroundColor: act.eventColor === 'bg-emerald-500' ? '#10B981' : (act.eventColor === 'bg-purple-600' ? '#9333EA' : (act.eventColor === 'bg-amber-500' ? '#F59E0B' : '#2563EB'))
                    }} />

                    {/* Lead Ref & Name */}
                    <div>
                      <span className="font-mono text-slate-400 text-[11px] mr-1.5">{act.leadRef}</span>
                      <span className="font-bold text-slate-900">{act.leadName}</span>
                    </div>

                    {/* Event Badge */}
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                      {act.eventType}
                    </span>
                  </div>

                  {/* Partner, Amount & Timestamp */}
                  <div className="flex items-center gap-3 ml-5 sm:ml-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {act.partner}
                    </span>
                    <span className="font-bold text-slate-800">
                      ₹{act.amount ? act.amount.toLocaleString('en-IN') : '50,000'}
                    </span>
                    <span className="text-slate-400 text-[10px] whitespace-nowrap">
                      {dt.full}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
