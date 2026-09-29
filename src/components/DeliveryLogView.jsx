import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  Search, 
  Filter, 
  ExternalLink, 
  Code, 
  Clock, 
  Building2, 
  AlertCircle,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';

export default function DeliveryLogView() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, failed: 0, success_rate: 100 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [retryingIds, setRetryingIds] = useState(new Set());
  const [inspectModalLog, setInspectModalLog] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchDeliveryLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/crm/api/delivery-logs.php?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setLogs(data.logs || []);
          if (data.stats) setStats(data.stats);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch delivery logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryLogs();
  }, [statusFilter]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRetryPush = async (log) => {
    const logId = log.id;
    setRetryingIds(prev => new Set(prev).add(logId));

    try {
      const res = await fetch('/crm/api/delivery-logs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'retry',
          log_id: logId,
          lead_id: log.lead_id,
          partner_id: log.partner_id
        })
      });

      const data = await res.json();
      if (data && data.success) {
        showToast(`Lead ${log.lead_id} successfully re-delivered to ${log.partner_name}!`);
        await fetchDeliveryLogs();
      } else {
        showToast(data.error || data.message || 'Retry delivery failed', true);
        await fetchDeliveryLogs();
      }
    } catch (e) {
      showToast('Error connecting to server for retry', true);
    } finally {
      setRetryingIds(prev => {
        const next = new Set(prev);
        next.delete(logId);
        return next;
      });
    }
  };

  const filteredLogs = logs.filter(l => {
    if (statusFilter !== 'all' && l.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (partnerFilter !== 'all' && l.partner_id !== partnerFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = String(l.lead_id || '').toLowerCase().includes(q);
      const matchPartner = String(l.partner_name || '').toLowerCase().includes(q);
      const matchUrl = String(l.endpoint || '').toLowerCase().includes(q);
      return matchId || matchPartner || matchUrl;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
          toastMessage.isError 
            ? 'bg-rose-50 text-rose-800 border-rose-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toastMessage.isError ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0A3977]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Partner API Delivery Logs</h1>
              <p className="text-xs text-slate-500 font-medium">Real-time webhook and API dispatch tracking across all affiliate partners</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDeliveryLogs}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total API Pushes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total || logs.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Attempted lead deliveries</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Delivered (Success)</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.delivered}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">HTTP 200..299 OK</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Failed (Action Needed)</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats.failed}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">Eligible for 1-click retry</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Success Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.success_rate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Delivery reliability index</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Lead ID or partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white transition"
            />
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'delivered' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'failed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Failed
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> log records
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">LEAD ID</th>
                <th className="py-3.5 px-4">PARTNER</th>
                <th className="py-3.5 px-4">ENDPOINT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-center">ATTEMPTS</th>
                <th className="py-3.5 px-4 text-center">HTTP CODE</th>
                <th className="py-3.5 px-4">DATE & TIME</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isDelivered = log.status === 'delivered';
                  const isRetrying = retryingIds.has(log.id);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition">
                      {/* Lead ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {log.lead_id}
                      </td>

                      {/* Partner */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.partner_name || log.partner_id}</span>
                        </div>
                      </td>

                      {/* Endpoint */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-slate-600 truncate max-w-xs" title={log.endpoint}>
                          {log.endpoint || '—'}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Delivered</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>

                      {/* Attempts */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700">
                          {log.attempts || 1}/3
                        </span>
                      </td>

                      {/* HTTP Code */}
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          log.response_code >= 200 && log.response_code < 300
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {log.response_code || 0}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {log.created_at || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setInspectModalLog(log)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                            title="Inspect payload & response"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {!isDelivered && (
                            <button
                              onClick={() => handleRetryPush(log)}
                              disabled={isRetrying}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#0A3977] font-bold text-[11px] rounded-lg transition cursor-pointer"
                              title="Retry lead push now"
                            >
                              <RotateCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                              <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Send className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No delivery logs found</p>
                    <p className="text-xs">API pushes will show up here automatically when partner leads are pushed.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload & Response Inspection Modal */}
      {inspectModalLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">API Delivery Inspection</h3>
                <p className="text-xs text-slate-500 font-mono">Lead: {inspectModalLog.lead_id} • Partner: {inspectModalLog.partner_name}</p>
              </div>
              <button
                onClick={() => setInspectModalLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <div className="font-bold text-slate-700 mb-1">Target Endpoint:</div>
                <div className="p-2.5 rounded-xl bg-slate-100 font-mono text-[11px] text-slate-800 break-all select-all">
                  {inspectModalLog.endpoint}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-1">Request Payload Sent (JSON):</div>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto select-all max-h-48">
                  {JSON.stringify(inspectModalLog.request_payload, null, 2)}
                </pre>
              </div>

              <div>
                <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Partner Response:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    inspectModalLog.response_code >= 200 && inspectModalLog.response_code < 300
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    HTTP {inspectModalLog.response_code}
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto select-all max-h-48">
                  {inspectModalLog.response_body || 'No response body returned'}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{inspectModalLog.created_at}</span>
              <button
                onClick={() => setInspectModalLog(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
