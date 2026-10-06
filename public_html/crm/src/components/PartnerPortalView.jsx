import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Filter, 
  Phone, 
  MapPin, 
  CreditCard, 
  UserCheck, 
  AlertCircle,
  FileText,
  XCircle,
  ChevronRight,
  TrendingUp,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { cleanLoanAmount } from '../utils/amountHelpers';
import { updateLoanApplication } from '../utils/apiConfig';
import { exportPartnerLeadsCsv } from '../utils/crmApi';

// UI labels <-> server `partnerStatus` (the CRM workflow `status` is never touched by a partner)
const FILTER_TO_PARTNER_STATUS = {
  Fresh: ['NONE', 'ASSIGNED'],
  Redirected: ['REDIRECTED'],
  Contacted: ['CONTACTED'],
  Approved: ['APPROVED'],
  Disbursed: ['DISBURSED'],
  Rejected: ['REJECTED']
};
const FORM_TO_PARTNER_STATUS = { Contacted: 'CONTACTED', Approved: 'APPROVED', Rejected: 'REJECTED', Disbursed: 'DISBURSED' };
const PARTNER_STATUS_TO_FORM = { CONTACTED: 'Contacted', APPROVED: 'Approved', REJECTED: 'Rejected', DISBURSED: 'Disbursed' };
const partnerStatusLabel = (lead) => {
  const key = String(lead.partnerStatus || 'NONE').toUpperCase();
  return { NONE: 'Fresh', ASSIGNED: 'Fresh', REDIRECTED: 'Redirected', CONTACTED: 'Contacted', APPROVED: 'Approved', DISBURSED: 'Disbursed', REJECTED: 'Rejected' }[key] || 'Fresh';
};

export default function PartnerPortalView({ currentUser, leads = [], setLeads, onRefresh, readOnly = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeadForUpdate, setSelectedLeadForUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('Contacted');
  const [disbursedAmount, setDisbursedAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const partnerId = currentUser?.partnerId || '';
  const partnerName = currentUser?.partnerName || currentUser?.name || 'Partner Portal';
  const serverPartnerId = currentUser?.serverPartnerId || currentUser?.partnerIds?.[0] || '';

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // The server only returns leads assigned to this partner; the slug match is a second safeguard
  const scopedLeads = useMemo(() => {
    return leads.filter(l => !l.assignedPartnerSlug || l.assignedPartnerSlug === partnerId);
  }, [leads, partnerId]);

  // Statistics
  const stats = useMemo(() => {
    const total = scopedLeads.length;
    const clickedCount = scopedLeads.filter(l => ['REDIRECTED', 'CONTACTED', 'APPROVED', 'DISBURSED', 'REJECTED'].includes(l.partnerStatus)).length;
    const contactedCount = scopedLeads.filter(l => l.partnerStatus === 'CONTACTED').length;
    const approvedCount = scopedLeads.filter(l => l.partnerStatus === 'APPROVED').length;
    const disbursedLeads = scopedLeads.filter(l => l.partnerStatus === 'DISBURSED');
    const disbursedCount = disbursedLeads.length;
    const totalDisbursedAmount = disbursedLeads.reduce((acc, l) => acc + (Number(l.disbursedAmountRupees) || cleanLoanAmount(l.loanAmount || l.applied || 0)), 0);
    const conversionRate = total > 0 ? ((disbursedCount / total) * 100).toFixed(1) : 0;
    return { total, clickedCount, contactedCount, approvedCount, disbursedCount, totalDisbursedAmount, conversionRate };
  }, [scopedLeads]);

  // Search and status filtering
  const filteredLeads = useMemo(() => {
    return scopedLeads.filter(l => {
      if (statusFilter !== 'all') {
        const allowed = FILTER_TO_PARTNER_STATUS[statusFilter] || [];
        if (!allowed.includes(String(l.partnerStatus || 'NONE').toUpperCase())) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = String(l.name || l.fullName || '').toLowerCase().includes(q);
        const matchId = String(l.id || l.loanNo || '').toLowerCase().includes(q);
        const matchCity = String(l.city || '').toLowerCase().includes(q);
        return matchName || matchId || matchCity;
      }
      return true;
    });
  }, [scopedLeads, statusFilter, searchQuery]);

  // Handle Status & Remarks Update
  const handleOpenStatusModal = (lead) => {
    setSelectedLeadForUpdate(lead);
    setNewStatus(PARTNER_STATUS_TO_FORM[lead.partnerStatus] || 'Contacted');
    setDisbursedAmount(lead.disbursedAmountRupees || lead.loanAmount || '');
    setRemarks(lead.partnerRemarks || '');
  };

  const handleSaveStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLeadForUpdate || readOnly) return;

    setIsSubmitting(true);
    const target = selectedLeadForUpdate;
    // Only the shared partner allowlist is sent; the server takes the actor from the token.
    const updates = {
      partnerStatus: FORM_TO_PARTNER_STATUS[newStatus],
      partnerRemarks: remarks
    };
    if (newStatus === 'Disbursed') {
      updates.disbursedAmountRupees = Math.round(Number(disbursedAmount) || 0);
    }

    const res = await updateLoanApplication(target.id, updates, { role: 'partner' });
    setIsSubmitting(false);

    if (res.success && res.lead) {
      if (setLeads) setLeads(prev => prev.map(l => (l.id === target.id ? res.lead : l)));
      showToast(`Lead ${target.leadCode || target.id} status updated to "${newStatus}"!`);
      setSelectedLeadForUpdate(null);
      if (onRefresh) onRefresh();
    } else {
      showToast(res.error || 'Could not update the lead. Nothing was changed.', true);
    }
  };

  const getCibilBadge = (cibil) => {
    const num = Number(String(cibil).replace(/\D/g, ''));
    if (num >= 750 || String(cibil).includes('750')) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{cibil}</span>;
    }
    if (num >= 650) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{cibil}</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{cibil || '—'}</span>;
  };

  const getStatusBadge = (lead) => {
    const s = partnerStatusLabel(lead);
    if (s.includes('Disbursed')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Disbursed</span>;
    }
    if (s.includes('Approved')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Approved</span>;
    }
    if (s.includes('Redirected')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">Applied (Redirected)</span>;
    }
    if (s.includes('Contacted')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Contacted</span>;
    }
    if (s.includes('Rejected')) {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Rejected</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">{s}</span>;
  };

  // Authenticated download of the server-generated CSV (no bare link; PAN is never included)
  const handleDownloadCsv = async () => {
    const res = await exportPartnerLeadsCsv(serverPartnerId || partnerId);
    if (!res.ok) showToast(res.error || 'Could not export your leads.', true);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
          toastMessage.isError ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toastMessage.isError ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A3977] via-[#104b99] to-[#0A3977] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 text-white font-black text-xl shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">{partnerName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-900">
                Partner Portal
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium mt-1">
              Authorized Partner Workspace • Scoped Lead Pipeline & Direct Application Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 text-[#0A3977] font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export My Leads (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Scoped Leads</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Assigned to {partnerName}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100 bg-purple-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Applied (Clicked)</div>
          <div className="text-2xl font-black text-purple-700 mt-1">{stats.clickedCount}</div>
          <div className="text-[11px] text-purple-600 mt-0.5">Redirected to your landing page</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-100 bg-blue-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Approved</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{stats.approvedCount}</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Verified applications</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Disbursed Count</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.disbursedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Disbursal: ₹{stats.totalDisbursedAmount.toLocaleString('en-IN')}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Conversion Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.conversionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Approved / Total leads</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicant name, ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white transition"
            />
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold flex-wrap">
            {['all', 'Fresh', 'Redirected', 'Contacted', 'Approved', 'Disbursed', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredLeads.length}</span> leads
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 min-w-[180px]">APPLICANT NAME</th>
                <th className="py-3.5 px-4 min-w-[140px]">PHONE (MASKED)</th>
                <th className="py-3.5 px-4 min-w-[120px]">APPLIED AMOUNT</th>
                <th className="py-3.5 px-4 min-w-[120px]">MONTHLY SALARY</th>
                <th className="py-3.5 px-4 min-w-[140px]">CITY / PINCODE</th>
                <th className="py-3.5 px-4 min-w-[100px]">CIBIL</th>
                <th className="py-3.5 px-4 min-w-[140px]">STATUS</th>
                <th className="py-3.5 px-4 min-w-[120px]">DATE</th>
                <th className="py-3.5 px-4 min-w-[130px] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((item, idx) => {
                  const itemId = item.id || item.lead_id || `PIM-${idx}`;
                  const rawPhone = String(item.phone || item.mobile || '').replace(/\D/g, '').slice(-10);
                  
                  // Phone shown once the applicant has been redirected to / worked by this partner
                  const isApplied = ['REDIRECTED', 'CONTACTED', 'APPROVED', 'DISBURSED', 'REJECTED'].includes(item.partnerStatus);

                  const maskedPhone = item.phoneMasked
                    ? item.phone
                    : (isApplied
                      ? (rawPhone ? `+91 ${rawPhone}` : '—')
                      : (rawPhone.length >= 4 ? `XXXXXX${rawPhone.slice(-4)}` : 'XXXXXXXXXX'));

                  const loanAmt = cleanLoanAmount(item.loanAmount || item.applied || 0);
                  const salaryAmt = Number(item.salary || item.monthlySalary || 0);

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/70 transition">
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{item.name || item.fullName || 'Applicant'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{item.loanNo || itemId}</div>
                      </td>

                      {/* Phone (Masked) */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{maskedPhone}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {isApplied ? 'Applied / Clicked' : 'Masked until apply'}
                        </div>
                      </td>

                      {/* Applied Amount */}
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 text-xs">₹{loanAmt.toLocaleString('en-IN')}</span>
                      </td>

                      {/* Salary */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700 text-xs">₹{salaryAmt.toLocaleString('en-IN')}</span>
                      </td>

                      {/* City / Pincode */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{item.city || '—'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono ml-4">{item.pincode || '—'}</div>
                      </td>

                      {/* CIBIL */}
                      <td className="py-3 px-4">
                        {getCibilBadge(item.cibilScore || item.cibil)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(item)}
                        {item.partnerRemarks && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-[120px]" title={item.partnerRemarks}>
                            "{item.partnerRemarks}"
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.created || item.created_at || item.date || '—'}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        {!readOnly && (
                        <button
                          onClick={() => handleOpenStatusModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0A3977] font-bold text-[11px] rounded-xl transition cursor-pointer"
                        >
                          <span>Update</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No leads found for {partnerName}</p>
                    <p className="text-xs">Incoming leads routed to your company will show up here in real time.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedLeadForUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Update Lead Disposition</h3>
                <p className="text-xs text-slate-500">Applicant: {selectedLeadForUpdate.name || 'Applicant'} • ID: {selectedLeadForUpdate.id}</p>
              </div>
              <button
                onClick={() => setSelectedLeadForUpdate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">New Lead Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white"
                >
                  <option value="Contacted">Contacted (In Discussion)</option>
                  <option value="Approved">Approved (Underwriting Passed)</option>
                  <option value="Rejected">Rejected (Ineligible)</option>
                  <option value="Disbursed">Disbursed (Loan Credited)</option>
                </select>
              </div>

              {newStatus === 'Disbursed' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Disbursed Amount (₹)</label>
                  <input
                    type="number"
                    value={disbursedAmount}
                    onChange={(e) => setDisbursedAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Partner Remarks / Notes</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter verification notes, reason for rejection or approval details..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForUpdate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0A3977] hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Updating...' : 'Save & Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
