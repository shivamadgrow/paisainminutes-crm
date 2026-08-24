import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
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
  Calendar
} from 'lucide-react';
import { getPartnerMeta, AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';

export default function CompanyLeadsView({ 
  companyId, 
  leads = [], 
  setLeads, 
  onBackToHub 
}) {
  const partner = getPartnerMeta(companyId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [reassigningLeadId, setReassigningLeadId] = useState(null);

  // Filter leads assigned to this company
  const companyLeads = useMemo(() => {
    return leads.filter(l => {
      const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
      return c === partner.id.toLowerCase() || 
             c === partner.name.toLowerCase().replace(/[\s\-_]/g, '') ||
             c === (partner.code || '').toLowerCase();
    });
  }, [leads, partner]);

  // Apply search and status filter
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
        const leadStatus = (l.status || 'Fresh').toLowerCase().replace(/\s+/g, '-');
        if (leadStatus !== statusFilter) return false;
      }

      return true;
    });
  }, [companyLeads, searchQuery, statusFilter]);

  // Partner specific statistics
  const stats = useMemo(() => {
    const total = companyLeads.length;
    const fresh = companyLeads.filter(l => l.status === 'Fresh').length;
    const approved = companyLeads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
    const rejected = companyLeads.filter(l => l.status === 'Rejected').length;
    const volume = companyLeads.reduce((sum, l) => sum + (Number(l.loanAmount || l.applied) || 0), 0);
    const avgTicket = total > 0 ? Math.round(volume / total) : 0;

    return { total, fresh, approved, rejected, volume, avgTicket };
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
      l.loanAmount || l.applied || 0,
      l.salary || 0,
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
            return { ...l, assignedCompany: newCompany };
          }
          return l;
        }));
      }

      await fetch('/admin/api/update-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          updates: { assignedCompany: newCompany }
        })
      });
      setReassigningLeadId(null);
    } catch (e) {
      setReassigningLeadId(null);
    }
  };

  // Update lead status
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      if (setLeads) {
        setLeads(prev => prev.map(l => {
          if (l.id === leadId || l.loanNo === leadId) {
            return { ...l, status: newStatus };
          }
          return l;
        }));
      }

      await fetch('/admin/api/update-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          updates: { status: newStatus }
        })
      });
    } catch (e) {}
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
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>Visit {partner.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
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
          <div className="text-2xl font-black text-slate-900 mt-1">₹{stats.volume.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg: ₹{stats.avgTicket.toLocaleString('en-IN')} per lead</div>
        </div>

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved / Disbursed</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.approved}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% Conversion rate</div>
        </div>

        <div className="crm-card bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Partner Criteria</span>
          <div className="text-xs font-bold text-slate-800 mt-1">CIBIL: {partner.minCibil}+</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Min Salary: ₹{partner.minSalary?.toLocaleString('en-IN')}</div>
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

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${companyLeads.length})` },
            { id: 'fresh', label: `Fresh (${stats.fresh})` },
            { id: 'callback', label: 'Callback' },
            { id: 'docs-received', label: 'Docs Received' },
            { id: 'approved', label: `Approved (${stats.approved})` },
            { id: 'rejected', label: `Rejected (${stats.rejected})` },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer shrink-0 ${
                statusFilter === btn.id
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
                            <div className="font-bold text-slate-900 text-xs">{item.name || 'Applicant'}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.loanNo || itemId}</div>
                            <div className="text-[11px] text-blue-900 font-mono font-semibold mt-0.5">
                              {item.mobile}
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
                          CIBIL: <span className="font-bold text-slate-700">{item.cibil || '—'}</span>
                        </div>
                      </td>

                      {/* Applied Amount */}
                      <td className="p-3.5 font-bold text-slate-900">
                        ₹{(Number(item.applied || item.loanAmount) || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Salary / City */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">
                          ₹{(Number(item.salary) || 0).toLocaleString('en-IN')}/mo
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.city || 'Online'} · {item.pincode || '110001'}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200/60">
                          {item.source || 'Apply Now Website'}
                        </span>
                      </td>

                      {/* Assigned Partner (with Quick Reassign) */}
                      <td className="p-3.5">
                        <div className="relative">
                          <button
                            onClick={() => setReassigningLeadId(isReassignOpen ? null : itemId)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${partner.badgeClass} hover:ring-2 hover:ring-indigo-300`}
                            title="Click to re-assign to another affiliate partner"
                          >
                            <span>{item.assignedCompany || partner.name}</span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                          </button>

                          {/* Reassign Dropdown Popover */}
                          {isReassignOpen && (
                            <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fade-in">
                              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Re-assign Partner:
                              </div>
                              {AFFILIATE_PARTNERS.map(p => (
                                <button
                                  key={p.id}
                                  onClick={() => handleReassign(itemId, p.name)}
                                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                                    (item.assignedCompany || partner.name) === p.name ? 'text-[#0A3977] font-bold bg-blue-50' : 'text-slate-700'
                                  }`}
                                >
                                  <span>{p.name}</span>
                                  {(item.assignedCompany || partner.name) === p.name && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0A3977]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={item.status || 'Fresh'}
                          onChange={(e) => handleStatusChange(itemId, e.target.value)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer"
                        >
                          <option value="Fresh">Fresh</option>
                          <option value="Callback">Callback</option>
                          <option value="Interested">Interested</option>
                          <option value="Docs received">Docs Received</option>
                          <option value="Approved">Approved</option>
                          <option value="Disbursed">Disbursed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Created */}
                      <td className="p-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.created || item.date || 'Today'}
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

    </div>
  );
}
