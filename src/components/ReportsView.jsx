import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Calendar, 
  Download, 
  Filter, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Play,
  BarChart3,
  DollarSign,
  Users
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';
import { cleanLoanAmount, cleanSalary } from '../utils/amountHelpers';

export default function ReportsView({ leads = [] }) {
  const [partnerFilter, setPartnerFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [commissionStatusFilter, setCommissionStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset
  const filteredData = useMemo(() => {
    return leads.filter(l => {
      // Partner filter
      if (partnerFilter !== 'All') {
        const assigned = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        const target = partnerFilter.toLowerCase().replace(/[\s\-_]/g, '');
        if (assigned !== target && !assigned.includes(target)) return false;
      }

      // Stage filter
      if (stageFilter !== 'All') {
        const s = String(l.status || 'Fresh').toLowerCase().replace(/\s+/g, '-');
        if (s !== stageFilter.toLowerCase().replace(/\s+/g, '-')) return false;
      }

      // Commission status filter
      if (commissionStatusFilter !== 'All') {
        const partner = AFFILIATE_PARTNERS.find(p => {
          const assigned = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
          return assigned === p.id.toLowerCase() || assigned === p.name.toLowerCase().replace(/[\s\-_]/g, '');
        });
        const pStatus = partner?.paymentStatus || 'Pending';
        if (pStatus !== commissionStatusFilter) return false;
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = String(l.name || '').toLowerCase().includes(q);
        const matchPhone = String(l.mobile || l.phone || '').includes(q);
        const matchId = String(l.id || l.loanNo || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchId) return false;
      }

      return true;
    });
  }, [leads, partnerFilter, stageFilter, commissionStatusFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalCount = filteredData.length;
    const totalApplied = filteredData.reduce((s, l) => s + cleanLoanAmount(l.loanAmount || l.applied || 0), 0);
    const approvedCount = filteredData.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
    const approvedVolume = filteredData
      .filter(l => l.status === 'Approved' || l.status === 'Disbursed')
      .reduce((s, l) => s + cleanLoanAmount(l.loanAmount || l.applied || 50000), 0);
    const estimatedCommission = Math.round(approvedVolume * 0.025);

    return { totalCount, totalApplied, approvedCount, approvedVolume, estimatedCommission };
  }, [filteredData]);

  const handleExportCsv = () => {
    const headers = [
      'Lead ID',
      'Applicant Name',
      'Mobile Phone',
      'Assigned Partner',
      'Lead Stage',
      'Loan Amount (INR)',
      'Monthly Salary (INR)',
      'CIBIL Score',
      'Partner Payment Status',
      'City'
    ];

    const rows = filteredData.map(l => {
      const partner = AFFILIATE_PARTNERS.find(p => {
        const assigned = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        return assigned === p.id.toLowerCase() || assigned === p.name.toLowerCase().replace(/[\s\-_]/g, '');
      });

      return [
        l.id || l.loanNo || '—',
        l.name || 'Applicant',
        l.mobile || l.phone || '—',
        l.assignedCompany || partner?.name || 'Unassigned',
        l.status || 'Fresh',
        cleanLoanAmount(l.loanAmount || l.applied || 0),
        cleanSalary(l.salary || l.monthlySalary || 0),
        l.cibil || l.cibilScore || '—',
        partner?.paymentStatus || 'Pending',
        l.city || '—'
      ];
    });

    exportToCsv(`paisa-affiliate-custom-report-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Custom Reports & Data Builder</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Query Builder
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Build, filter, and export customized multi-dimensional datasets across partners, lead stages, and commission status
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel / CSV ({filteredData.length})</span>
        </button>
      </div>

      {/* Query Filter Builder Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Report Filter Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Partner Filter */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Affiliate Partner</label>
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="All">All 8 Partners</option>
              {AFFILIATE_PARTNERS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Lead Stage */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Lead Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="All">All Lead Stages</option>
              <option value="fresh">Fresh Applications</option>
              <option value="callback">Callback</option>
              <option value="docs-received">Docs Received</option>
              <option value="approved">Approved & Converted</option>
              <option value="rejected">Rejected / Drop-off</option>
            </select>
          </div>

          {/* 3. Commission / Payment Status */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Commission Status</label>
            <select
              value={commissionStatusFilter}
              onChange={(e) => setCommissionStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid / Settled</option>
              <option value="Pending">Pending Settlement</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* 4. Keyword Search */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Applicant Search</label>
            <input
              type="text"
              placeholder="Name, mobile number, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-mono">
            Displaying <strong>{filteredData.length}</strong> matching records out of <strong>{leads.length}</strong> total leads.
          </span>
          <button
            onClick={() => {
              setPartnerFilter('All');
              setStageFilter('All');
              setCommissionStatusFilter('All');
              setSearchQuery('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Filtered Leads</div>
          <div className="text-2xl font-black text-[#0A3977] mt-1">{metrics.totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Approved Disbursals</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{metrics.approvedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Funded Loan Volume</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{(metrics.approvedVolume / 100000).toFixed(2)} L</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Accrued Commission</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{metrics.estimatedCommission.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Lead ID</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Loan Amount</th>
                <th className="py-3 px-4">Salary</th>
                <th className="py-3 px-4">CIBIL</th>
                <th className="py-3 px-4">City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No leads match your selected report filter criteria.
                  </td>
                </tr>
              ) : (
                filteredData.slice(0, 100).map((l, idx) => (
                  <tr key={l.id || idx} className="hover:bg-slate-50/80 transition-colors font-sans">
                    <td className="py-3 px-4 font-mono font-bold text-[#0A3977]">
                      {l.id || l.loanNo || `PIM-${1000 + idx}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{l.name || 'Applicant'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{l.mobile || l.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-900">
                      {l.assignedCompany || 'Rupay91'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {l.status || 'Fresh'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      ₹{cleanLoanAmount(l.loanAmount || l.applied || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      ₹{cleanSalary(l.salary || l.monthlySalary || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {l.cibil || l.cibilScore || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {l.city || '—'}
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
