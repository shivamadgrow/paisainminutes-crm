import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  Building2, 
  ArrowUpDown,
  Filter,
  Check
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';
import { fetchAllPages, apiPost, apiPatch } from '../utils/crmApi';
import { payoutFromServer, toPaise, serverPartnerId } from '../utils/financeMappers';
import { getCurrentUser } from '../utils/authService';
import { isSuperAdmin } from '../utils/permissions';

export default function PayoutRequestsView({ onChanged }) {
  const currentUser = getCurrentUser();
  const canExportData = isSuperAdmin(currentUser);
  const [requests, setRequests] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newRequest, setNewRequest] = useState({
    partnerId: (AFFILIATE_PARTNERS[0] && AFFILIATE_PARTNERS[0].id) || '',
    amount: '',
    period: '',
    notes: ''
  });

  // Payout requests live in MongoDB (via the Node server); nothing is kept in this browser
  const loadRequests = async () => {
    setIsLoading(true);
    const res = await fetchAllPages('/api/crm/payout-requests', 'payoutRequests');
    if (res.success) {
      setRequests(res.items.map(payoutFromServer));
      setLoadError('');
    } else {
      setLoadError(res.error || 'Could not load payout requests.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter(r => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.partnerName.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !(r.invoiceNo || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    return true;
  });

  // The server enforces the state machine (Requested -> Acknowledged -> Paid); the list updates after success
  const handleStatusChange = async (request, newStatus) => {
    setActionError('');
    const res = await apiPatch(`/api/crm/payout-requests/${encodeURIComponent(request.serverId)}`, {
      status: newStatus.toUpperCase(),
      ...(newStatus === 'Paid' ? { paidDate: new Date().toISOString().slice(0, 10) } : {})
    });
    if (res.ok && res.data && res.data.payoutRequest) {
      const updated = payoutFromServer(res.data.payoutRequest);
      setRequests(prev => prev.map(r => (r.serverId === updated.serverId ? updated : r)));
      if (onChanged) onChanged();
    } else {
      setActionError(res.error || 'The payout request could not be updated.');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setActionError('');
    const partnerServerId = serverPartnerId(newRequest.partnerId);
    if (!partnerServerId) {
      setActionError('This partner is not registered on the server yet.');
      return;
    }
    setIsSaving(true);
    const res = await apiPost('/api/crm/payout-requests', {
      partnerId: partnerServerId,
      amountPaise: toPaise(newRequest.amount),
      disbursalPeriod: newRequest.period,
      notes: newRequest.notes || undefined
    });
    setIsSaving(false);
    if (res.ok && res.data && res.data.payoutRequest) {
      await loadRequests();
      setIsCreateOpen(false);
      setNewRequest({ partnerId: newRequest.partnerId, amount: '', period: '', notes: '' });
      if (onChanged) onChanged();
    } else {
      setActionError(res.error || 'The payout request could not be created.');
    }
  };

  const handleExportCsv = () => {
    if (!canExportData) {
      alert('403 Forbidden: Data export is strictly restricted to Super Admin only.');
      return;
    }
    const headers = ['Request ID', 'Partner Name', 'Amount (INR)', 'Requested Date', 'Status', 'Period', 'Invoice No', 'Paid Date'];
    const rows = filtered.map(r => [
      r.id,
      r.partnerName,
      r.amount,
      r.requestedDate,
      r.status,
      r.disbursalPeriod,
      r.invoiceNo || '—',
      r.paidDate || '—'
    ]);
    exportToCsv(`paisa-payout-requests-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // Average days from request to payment, from real records
  const paidRequests = requests.filter(r => r.status === 'Paid' && r.paidDate && r.requestedDate);
  const avgCycleDays = paidRequests.length > 0
    ? (paidRequests.reduce((sum, r) => sum + Math.max(0, (new Date(r.paidDate) - new Date(r.requestedDate)) / 86400000), 0) / paidRequests.length).toFixed(1)
    : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case 'Acknowledged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Acknowledged</span>
          </span>
        );
      case 'Requested':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Send className="w-3 h-3 text-amber-600" />
            <span>Requested</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {(loadError || actionError) && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-3">
          <span>{loadError || actionError}</span>
          <button onClick={loadError ? loadRequests : () => setActionError('')} className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 font-bold cursor-pointer">{loadError ? 'Retry' : 'Dismiss'}</button>
        </div>
      )}
      {isLoading && <div className="text-xs text-slate-500">Loading payout requests from the server…</div>}
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <Send className="w-6 h-6 text-indigo-600" />
            <span>Payout Requests</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {requests.length} Requests
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Outgoing claims sent to affiliate lending partners for earned lead disbursal commission
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canExportData && (
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export</span>
            </button>
          )}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Payout Request</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Requests</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{Number(requests.filter(r => r.status !== 'Paid').reduce((s, r) => s + (r.amount || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {requests.filter(r => r.status !== 'Paid').length} request(s) awaiting partner release
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cleared & Paid (This FY)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{Number(requests.filter(r => r.status === 'Paid').reduce((s, r) => s + (r.amount || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Confirmed received in bank</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Settlement Cycle</div>
          <div className="text-2xl font-black text-[#0A3977] mt-1">
            {avgCycleDays !== null ? `${avgCycleDays} Days` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">From request submission to bank credit</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search request by ID, partner, invoice..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Requested">Requested</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request Ref</th>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Claim Amount</th>
                <th className="py-3 px-4">Disbursal Period</th>
                <th className="py-3 px-4">Requested On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No payout requests found.
                  </td>
                </tr>
              ) : (
                filtered.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A3977]">
                      {req.id}
                      <div className="text-[10px] text-slate-400 font-normal">{req.invoiceNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{req.partnerName}</div>
                      <div className="text-[10px] text-slate-400">{req.contactEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{Number(req.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {req.disbursalPeriod}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {req.requestedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {req.status === 'Requested' && (
                          <button
                            onClick={() => handleStatusChange(req, 'Acknowledged')}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-[11px] transition cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        {req.status !== 'Paid' && (
                          <button
                            onClick={() => handleStatusChange(req, 'Paid')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-semibold text-[11px] transition cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        {req.status === 'Paid' && (
                          <span className="text-[11px] text-slate-400 font-mono">Paid on {req.paidDate}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Payout Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-base font-bold text-[#0A3977] mb-1">Create Payout Request</h3>
            <p className="text-xs text-slate-500 mb-4">Generate and dispatch a commission payout claim to the partner finance desk</p>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              {actionError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">{actionError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Partner</label>
                <select
                  value={newRequest.partnerId}
                  onChange={(e) => setNewRequest(p => ({ ...p, partnerId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {AFFILIATE_PARTNERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Claim Amount (₹)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  placeholder="e.g. 75000"
                  value={newRequest.amount}
                  onChange={(e) => setNewRequest(p => ({ ...p, amount: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursal Period</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 01/10/2026 - 15/10/2026"
                  value={newRequest.period}
                  onChange={(e) => setNewRequest(p => ({ ...p, period: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Remarks</label>
                <textarea 
                  rows="2"
                  placeholder="Additional notes for partner finance team..."
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-[#0A3977] disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition"
                >
                  {isSaving ? 'Sending…' : 'Send Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
