import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Building2,
  Search,
  X,
  FileSpreadsheet,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronDown,
  UserCheck,
  ArrowRightLeft,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Calendar,
  Check,
  ChevronRight
} from 'lucide-react';
import {
  getPartnerMeta,
  AFFILIATE_PARTNERS,
  getPartnerTrackingUrl,
  trackPartnerClick,
  getPartnerDirectUtmUrl
} from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';
import { cleanLoanAmount, cleanSalary, formatToIST, isDateInRange, DATE_RANGE_PRESETS } from '../utils/amountHelpers';
import { updateLoanApplication, normalizeStatus, formatStatusLabel } from '../utils/apiConfig';

export default function CompanyLeadsView({
  companyId,
  leads = [],
  setLeads,
  onBackToHub
}) {
  const partner = getPartnerMeta(companyId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDatePreset, setSelectedDatePreset] = useState('ALL');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [reassigningLeadId, setReassigningLeadId] = useState(null);
  const [reassignAnchor, setReassignAnchor] = useState(null);
  const [reassignFilterQuery, setReassignFilterQuery] = useState('');

  // Close reassign popover on click outside, background scroll, resize, or Escape
  useEffect(() => {
    if (!reassigningLeadId) return;

    const handleScroll = (e) => {
      if (e && e.target && typeof e.target.closest === 'function' && e.target.closest('[data-popover-portal]')) {
        return;
      }
      setReassigningLeadId(null);
      setReassignAnchor(null);
    };

    const handleResize = () => {
      setReassigningLeadId(null);
      setReassignAnchor(null);
    };

    const handleClickOutside = (e) => {
      if (e.target && typeof e.target.closest === 'function' && (e.target.closest('[data-popover-portal]') || e.target.closest('[data-popover-trigger]'))) {
        return;
      }
      setReassigningLeadId(null);
      setReassignAnchor(null);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setReassigningLeadId(null);
        setReassignAnchor(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [reassigningLeadId]);

  // Filter leads assigned to this company
  const companyLeads = useMemo(() => {
    return leads.filter(l => {
      const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
      const sel = String(l.selectedLenderId || '').trim().toLowerCase();
      const pId = partner.id.toLowerCase();
      const pName = partner.name.toLowerCase().replace(/[\s\-_]/g, '');
      const pCode = (partner.code || '').toLowerCase();
      return c === pId ||
        c === pName ||
        c === pCode ||
        sel === pId ||
        (l.assignedCompany && l.assignedCompany.toLowerCase().includes(partner.name.toLowerCase()));
    });
  }, [leads, partner]);

  // Apply search, status, and date range filter
  const filteredLeads = useMemo(() => {
    return companyLeads.filter(l => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = (l.name || '').toLowerCase().includes(q);
        const matchesMobile = (l.mobile || '').includes(q);
        const matchesId = (l.id || l.loanNo || '').toLowerCase().includes(q);
        const matchesEmail = (l.email || '').toLowerCase().includes(q);
        const matchesCity = (l.city || '').toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesId && !matchesEmail && !matchesCity) return false;
      }

      // Status
      if (statusFilter !== 'all') {
        const leadStatus = normalizeStatus(l.status);
        if (leadStatus !== statusFilter) return false;
      }

      // Date Range
      if (selectedDatePreset !== 'ALL') {
        const leadDate = l.created_at || l.createdAt || l.created || l.date;
        if (!isDateInRange(leadDate, selectedDatePreset, customStartDate, customEndDate)) return false;
      }

      return true;
    });
  }, [companyLeads, searchQuery, statusFilter, selectedDatePreset, customStartDate, customEndDate]);

  // Partner specific statistics
  const stats = useMemo(() => {
    const total = companyLeads.length;
    const fresh = companyLeads.filter(l => normalizeStatus(l.status) === 'FRESH').length;
    const callback = companyLeads.filter(l => normalizeStatus(l.status) === 'CALLBACK').length;
    const approved = companyLeads.filter(l => {
      const s = normalizeStatus(l.status);
      return s === 'APPROVED' || s === 'DISBURSED';
    }).length;
    const rejected = companyLeads.filter(l => normalizeStatus(l.status) === 'REJECTED').length;
    const volume = companyLeads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied || l.amount), 0);
    const avgTicket = total > 0 ? Math.round(volume / total) : 0;

    return { total, fresh, callback, approved, rejected, volume, avgTicket };
  }, [companyLeads]);

  // Export CSV
  const handleExport = () => {
    if (filteredLeads.length === 0) {
      alert('No leads available to export.');
      return;
    }
    const headers = [
      'Lead ID',
      'Assigned Company',
      'Eligibility Status',
      'Customer Name',
      'Mobile Number',
      'Email',
      'Loan Amount (₹)',
      'Monthly Salary (₹)',
      'CIBIL Score',
      'Employment Type',
      'City',
      'State',
      'Pincode',
      'Source / Form',
      'Status',
      'Created Date'
    ];
    const rows = filteredLeads.map(l => [
      l.id || l.loanNo || '',
      l.assignedCompany || partner.name,
      l.eligibilityStatus || 'Eligible',
      l.name || 'Applicant',
      l.mobile || '',
      l.email || '',
      cleanLoanAmount(l.loanAmount || l.applied),
      cleanSalary(l.salary, l.sal_val, l.salary_range),
      l.cibil || '—',
      l.employmentType || 'Salaried',
      l.city || '',
      l.state || 'India',
      l.pincode || '',
      l.source || 'Website',
      l.status || 'Fresh',
      l.created || l.date || ''
    ]);
    const dateStr = new Date().toISOString().slice(0, 10);
    exportToCsv(`${partner.name.toLowerCase()}-assigned-leads-${dateStr}.csv`, headers, rows);
  };

  // Re-assign lead to another partner
  const handleReassign = async (leadId, newCompany) => {
    try {
      if (setLeads) {
        setLeads(prev => prev.map(l => {
          if (l.id === leadId || l.loanNo === leadId) {
            return { ...l, assignedCompany: newCompany, partner_name: newCompany, selectedLenderId: newCompany };
          }
          return l;
        }));
      }

      await updateLoanApplication(leadId, { selectedLenderId: newCompany });
      setReassigningLeadId(null);
    } catch (e) {
      setReassigningLeadId(null);
    }
  };

  // Update lead status
  const handleStatusChange = async (leadId, newStatus) => {
    const canonicalStatus = normalizeStatus(newStatus);
    const displayLabel = formatStatusLabel(newStatus);
    try {
      if (setLeads) {
        setLeads(prev => prev.map(l => {
          if (l.id === leadId || l.loanNo === leadId) {
            return { ...l, status: canonicalStatus, statusLabel: displayLabel };
          }
          return l;
        }));
      }

      await updateLoanApplication(leadId, { status: canonicalStatus });
    } catch (e) { }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* Top Header with Back Button & Partner Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
            title="Back to All Partners Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${partner.badgeClass}`}>
                {partner.name} Section
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-slate-700">{companyLeads.length} Total Leads Assigned</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
              {partner.name} Assigned Leads
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {partner && (
            <a
              href={getPartnerTrackingUrl(partner, { source: 'crm_partner_view', term: `${partner.id}_header` })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPartnerClick(partner, { source: 'crm_partner_view', term: `${partner.id}_header` })}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-[#0A3977] border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group cursor-pointer active:scale-95"
              title={`Visit ${partner.name} portal with live affiliate tracking & UTM tags`}
            >
              <span>Visit {partner.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A3977] transition-colors" />
            </a>
          )}

          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export {partner.name} CSV</span>
          </button>
        </div>
      </div>

      {/* Partner Info & KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Leads</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{stats.fresh} fresh pending action</div>
        </div>

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Loan Volume</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{Number(stats.volume || 0).toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg: ₹{Number(stats.avgTicket || 0).toLocaleString('en-IN')} per lead</div>
        </div>

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved / Disbursed</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.approved}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% Conversion rate</div>
        </div>

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Partner Criteria</span>
          <div className="text-xs font-bold text-slate-800 mt-1">CIBIL: {partner.minCibil}+</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Min Salary: ₹{Number(partner.minSalary || 0).toLocaleString('en-IN')}</div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${partner.name} leads by name, phone, city...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
          />
        </div>

        {/* Date Range Filter Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Date:</span>
          </span>
          {DATE_RANGE_PRESETS.map(preset => {
            const isSel = selectedDatePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedDatePreset(preset.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition cursor-pointer shrink-0 ${isSel
                    ? 'bg-[#0A3977] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {preset.label}
              </button>
            );
          })}
          {selectedDatePreset === 'CUSTOM' && (
            <div className="flex items-center gap-1 bg-blue-50/70 p-1 rounded-xl border border-blue-200 shrink-0">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
              />
              <span className="text-[10px] text-slate-400 font-bold">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
              />
            </div>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Status (${companyLeads.length})` },
            { id: 'FRESH', label: `Fresh (${stats.fresh})` },
            { id: 'CALLBACK', label: `Callback (${stats.callback})` },
            { id: 'INTERESTED', label: 'Interested' },
            { id: 'DOCS_RECEIVED', label: 'Docs Received' },
            { id: 'APPROVED', label: `Approved (${stats.approved})` },
            { id: 'DISBURSED', label: 'Disbursed' },
            { id: 'REJECTED', label: `Rejected (${stats.rejected})` },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer shrink-0 ${statusFilter === btn.id
                  ? 'bg-[#0A3977] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

      </div>

      {/* Leads Table */}
      <div className="crm-card bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 min-w-[220px]">APPLICANT DETAILS</th>
                <th className="p-3.5">ELIGIBILITY & CIBIL</th>
                <th className="p-3.5">APPLIED AMOUNT</th>
                <th className="p-3.5">SALARY / CITY</th>
                <th className="p-3.5">SOURCE</th>
                <th className="p-3.5">ASSIGNED PARTNER</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">CREATED AT</th>
                <th className="p-3.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((item, idx) => {
                  const itemId = item.id || item.loanNo || `lead-${idx}`;
                  const isReassignOpen = reassigningLeadId === itemId;

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/80 transition">

                      {/* Applicant */}
                      <td className="p-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${item.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                            {item.initials || 'AP'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{item.applicantName || item.name || 'Applicant'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.displayId || item.loanNo || itemId}</div>
                            <div className="text-[11px] text-blue-900 font-mono font-semibold mt-0.5">
                              {item.mobile || item.phone}
                            </div>
                            {item.email && <div className="text-[10px] text-slate-400">{item.email}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Eligibility & CIBIL */}
                      <td className="p-3.5">
                        <div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.eligibilityStatus || 'Eligible'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          CIBIL: <span className="font-bold text-slate-700">
                            {(item.cibilScore && Number(item.cibilScore) > 0)
                              ? item.cibilScore
                              : (item.cibil && !item.cibil.includes('Estimated') && !item.cibil.includes('300') ? item.cibil : 'Not Available')}
                          </span>
                        </div>
                      </td>

                      {/* Applied Amount */}
                      <td className="p-3.5 font-bold text-slate-900">
                        ₹{Number(cleanLoanAmount(item.applied || item.loanAmount || item.amount) || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Salary / City */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">
                          ₹{Number(cleanSalary(item.salary, item.sal_val, item.salary_range, item.monthlyIncome) || 0).toLocaleString('en-IN')}/mo
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.location || (item.city ? `${item.city}${item.pincode ? ` · ${item.pincode}` : ''}` : 'Online')}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="p-3.5">
                        {((item.source && item.source.toLowerCase().includes('whatsapp')) ||
                          (item.utm_source && item.utm_source.toLowerCase().includes('whatsapp')) ||
                          (item.lead_source && item.lead_source.toLowerCase().includes('whatsapp'))) ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {item.source || item.utm_source || 'WhatsApp'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            {item.source || 'Website Application'}
                          </span>
                        )}
                      </td>

                      {/* Assigned Partner (with Quick Reassign) */}
                      <td className="p-3.5">
                        <div className="relative">
                          <button
                            type="button"
                            data-popover-trigger="reassign"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (reassigningLeadId === itemId) {
                                setReassigningLeadId(null);
                                setReassignAnchor(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setReassignAnchor({ rect, itemId, item });
                                setReassignFilterQuery('');
                                setReassigningLeadId(itemId);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${partner.badgeClass} hover:ring-2 hover:ring-indigo-300 shadow-2xs hover:shadow-sm`}
                            title="Click to re-assign to another affiliate partner"
                          >
                            <span>{item.assignedCompany || partner.name}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${reassigningLeadId === itemId ? 'rotate-180' : 'opacity-60'}`} />
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={normalizeStatus(item.status) || 'FRESH'}
                          onChange={(e) => handleStatusChange(itemId, e.target.value)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer"
                        >
                          <option value="FRESH">Fresh</option>
                          <option value="CALLBACK">Callback</option>
                          <option value="INTERESTED">Interested</option>
                          <option value="DOCS_RECEIVED">Docs Received</option>
                          <option value="APPROVED">Approved</option>
                          <option value="DISBURSED">Disbursed</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>

                      {/* Created */}
                      <td className="p-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                        {formatToIST(item.created || item.created_at || item.createdAt || item.date).full}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.mobile && (
                            <a
                              href={`tel:${item.mobile.replace(/\D/g, '')}`}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                              title="Call Applicant"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {item.mobile && (
                            <a
                              href={`https://wa.me/${item.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(item.name || 'Applicant')},%20we%20reviewed%20your%20loan%20eligibility%20for%20${encodeURIComponent(partner.name)}%20via%20Paisa%20in%20Minutes.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition"
                              title="WhatsApp Message"
                            >
                              <span className="font-bold text-[10px]">WA</span>
                            </a>
                          )}
                          <a
                            href={getPartnerTrackingUrl(partner, {
                              leadId: itemId,
                              phone: item.mobile || item.phone,
                              source: 'crm_lead_row'
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackPartnerClick(partner, {
                              leadId: itemId,
                              phone: item.mobile || item.phone,
                              source: 'crm_lead_row'
                            })}
                            className="p-1.5 bg-blue-50 text-[#0A3977] hover:bg-blue-100 rounded-lg transition"
                            title={`Open ${partner.name} Portal with Lead ID ${itemId} & UTM tracking`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-10 text-center">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">
                      No leads currently found for {partner.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      When users apply on <span className="text-[#0A3977] font-semibold">paisainminutes.com</span> matching {partner.name} criteria, they will show up here automatically.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Reassign Portal */}
      {reassigningLeadId && reassignAnchor && createPortal(
        (() => {
          const { rect, itemId, item } = reassignAnchor;
          const currentLead = leads.find((l, i) => (l.id || `lead-${i}`) === itemId) || item;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const openUp = spaceBelow < 340 && spaceAbove > spaceBelow;
          const width = 300;
          const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 16));
          const availableSpace = openUp ? Math.max(260, spaceAbove - 20) : Math.max(260, spaceBelow - 20);
          const maxHeight = Math.min(480, availableSpace);

          const q = (reassignFilterQuery || '').toLowerCase().trim();
          const filteredPartners = AFFILIATE_PARTNERS.filter(p => {
            if (!q) return true;
            return (p.name || '').toLowerCase().includes(q) ||
              (p.tagline || '').toLowerCase().includes(q) ||
              (p.description || '').toLowerCase().includes(q);
          });

          return (
            <div
              data-popover-portal="reassign"
              style={{
                position: 'fixed',
                left: `${left}px`,
                ...(openUp
                  ? { bottom: `${window.innerHeight - rect.top + 6}px` }
                  : { top: `${rect.bottom + 6}px` }),
                maxHeight: `${maxHeight}px`,
                zIndex: 99999
              }}
              className="w-[300px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 animate-fade-in flex flex-col overflow-hidden ring-1 ring-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0A3977]" />
                  <span className="text-slate-700 font-extrabold">Re-assign Lending Partner</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {AFFILIATE_PARTNERS.length} Partners
                </span>
              </div>

              {/* Quick Partner Search */}
              <div className="pt-2 pb-1.5 px-0.5 shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={reassignFilterQuery}
                    onChange={(e) => setReassignFilterQuery(e.target.value)}
                    placeholder="Search partner or scroll..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A3977] focus:bg-white text-slate-800 placeholder:text-slate-400 font-medium transition"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  {reassignFilterQuery && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReassignFilterQuery('');
                      }}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/60"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list container */}
              <div
                className="pt-1.5 space-y-1 overflow-y-auto flex-1 min-h-[140px] pr-1 dropdown-scrollbar"
                style={{
                  maxHeight: `${Math.min(320, Math.max(160, maxHeight - 95))}px`,
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch'
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {filteredPartners.map(p => {
                  const isCurrent = (currentLead.assignedCompany || partner.name) === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReassign(itemId, p.name);
                        setReassigningLeadId(null);
                        setReassignAnchor(null);
                        setReassignFilterQuery('');
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer group ${isCurrent
                          ? 'bg-blue-50/90 text-[#0A3977] font-black ring-1 ring-blue-300 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700 font-bold'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs text-white"
                          style={{ backgroundColor: p.accentColor || '#0A3977' }}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate text-left">
                          <div className="font-extrabold text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{p.tagline || p.description || 'Lending Partner'}</div>
                        </div>
                      </div>
                      {isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-[#0A3977] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filteredPartners.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No lending partner matches "{reassignFilterQuery}"
                  </div>
                )}
              </div>

              {/* Micro-footer tip */}
              <div className="px-2 pt-2 pb-0.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium select-none shrink-0">
                <span>Scroll or type to search</span>
                <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ESC</span>
              </div>
            </div>
          );
        })(),
        document.body
      )}

    </div>
  );
}
