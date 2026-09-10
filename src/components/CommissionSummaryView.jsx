import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  IndianRupee, 
  Search, 
  FileSpreadsheet, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  ExternalLink,
  Layers,
  Calendar,
  Building2
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';
import { cleanLoanAmount } from '../utils/amountHelpers';

export default function CommissionSummaryView({ leads = [], onSelectCompany }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('commissionEarned');
  const [sortDirection, setSortDirection] = useState('desc');

  // Compute live partner commission breakdown
  const partnerData = useMemo(() => {
    return AFFILIATE_PARTNERS.map(partner => {
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
  }, [leads]);

  // Overall totals
  const totals = useMemo(() => {
    const leadsSent = partnerData.reduce((s, p) => s + p.leadsSent, 0);
    const approved = partnerData.reduce((s, p) => s + p.approved, 0);
    const disbursal = partnerData.reduce((s, p) => s + p.disbursal, 0);
    const commissionEarned = partnerData.reduce((s, p) => s + p.commissionEarned, 0);
    const received = partnerData.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + p.commissionEarned, 0);
    const pending = partnerData.filter(p => p.paymentStatus !== 'Paid').reduce((s, p) => s + p.commissionEarned, 0);

    return { leadsSent, approved, disbursal, commissionEarned, received, pending };
  }, [partnerData]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let list = partnerData.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'All' && p.paymentStatus !== statusFilter) return false;
      return true;
    });

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
  }, [partnerData, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCsv = () => {
    const headers = ['Partner Name', 'Code', 'Leads Sent', 'Approved Leads', 'Conversion Rate %', 'Total Disbursal (INR)', 'Commission Rate', 'Commission Earned (INR)', 'Payment Status'];
    const rows = filteredAndSorted.map(p => [
      p.name,
      p.code,
      p.leadsSent,
      p.approved,
      `${p.conversionRate}%`,
      p.disbursal,
      p.commissionRate,
      p.commissionEarned,
      p.paymentStatus
    ]);
    exportToCsv(`paisa-affiliate-commission-summary-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const renderStatusBadge = (status) => {
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
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>Commission Summary</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Affiliate Revenue
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Partner-wise approved disbursals, earned commission slabs & reconciliation status for FY 2026-27
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Leads Sent</div>
          <div className="text-2xl font-black text-[#0A3977] mt-1">{totals.leadsSent.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across 8 active partners</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Disbursal Volume</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{(totals.disbursal / 100000).toFixed(2)} L</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Approved & funded loans</div>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Commission Earned</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹{totals.commissionEarned.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Net affiliate revenue accrued</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Received vs Pending</div>
          <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-2">
            <span className="text-emerald-600">₹{totals.received.toLocaleString('en-IN')}</span>
            <span className="text-slate-300">/</span>
            <span className="text-amber-600">₹{totals.pending.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Paid vs Pending Settlement</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by partner name or code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Payment Status:</span>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Partner Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('leadsSent')}>
                  <div className="flex items-center gap-1">
                    <span>Leads Sent</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('approved')}>
                  <div className="flex items-center gap-1">
                    <span>Approved</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('conversionRate')}>
                  <div className="flex items-center gap-1">
                    <span>Conv. Rate %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('disbursal')}>
                  <div className="flex items-center gap-1">
                    <span>Total Disbursal</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Commission Rate</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort('commissionEarned')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Commission Earned</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No partner records found.
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map(partner => (
                  <tr 
                    key={partner.id} 
                    onClick={() => onSelectCompany && onSelectCompany(partner.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: partner.accentColor || '#4F46E5' }}
                        ></span>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{partner.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{partner.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {partner.leadsSent > 0 ? partner.leadsSent : '0'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {partner.approved > 0 ? partner.approved : '0'}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {partner.leadsSent > 0 ? `${partner.conversionRate}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {partner.disbursal > 0 ? `₹${partner.disbursal.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded text-[11px]">
                        {partner.commissionRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      {partner.commissionEarned > 0 ? `₹${partner.commissionEarned.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {renderStatusBadge(partner.paymentStatus)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
