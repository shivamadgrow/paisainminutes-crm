import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Search, 
  Plus, 
  AlertCircle, 
  FileSpreadsheet, 
  TrendingUp, 
  Building2,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';
import { INITIAL_SETTLEMENTS } from '../data/settlementsData';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';

export default function SettlementsView({ settlements: propSettlements, setSettlements: propSetSettlements }) {
  const [localSettlements, setLocalSettlements] = useState(INITIAL_SETTLEMENTS);
  const settlements = propSettlements !== undefined ? propSettlements : localSettlements;
  const setSettlements = propSetSettlements !== undefined ? propSetSettlements : setLocalSettlements;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [newSet, setNewSet] = useState({
    partnerId: 'rupay91',
    expectedAmount: '',
    receivedAmount: '',
    bankRef: '',
    period: '01/08/2026 - 15/08/2026',
    notes: ''
  });

  const filtered = settlements.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!s.partnerName.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.bankRef.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'All' && s.reconciledStatus !== statusFilter) return false;
    return true;
  });

  const handleRecordSettlement = (e) => {
    e.preventDefault();
    const partner = AFFILIATE_PARTNERS.find(p => p.id === newSet.partnerId) || { name: 'Partner' };
    const exp = Number(newSet.expectedAmount) || 0;
    const rec = Number(newSet.receivedAmount) || 0;
    const variance = rec - exp;

    let reconciledStatus = 'Matched';
    if (variance < 0) reconciledStatus = 'Variance Flagged';
    else if (variance > 0) reconciledStatus = 'Surplus';

    const created = {
      id: `SET-2026-${Math.floor(100 + Math.random() * 900)}`,
      partnerId: newSet.partnerId,
      partnerName: partner.name,
      settlementDate: new Date().toISOString().slice(0, 10),
      expectedAmount: exp,
      receivedAmount: rec,
      variance,
      bankRef: newSet.bankRef || `NEFT-${Math.floor(100000000 + Math.random() * 900000000)}`,
      reconciledStatus,
      period: newSet.period,
      notes: newSet.notes || 'Reconciled in CRM'
    };

    setSettlements(prev => [created, ...prev]);
    setIsRecordOpen(false);
    setNewSet({ partnerId: 'rupay91', expectedAmount: '', receivedAmount: '', bankRef: '', period: '01/08/2026 - 15/08/2026', notes: '' });
  };

  const handleExportCsv = () => {
    const headers = ['Settlement ID', 'Partner Name', 'Settlement Date', 'Expected (INR)', 'Received (INR)', 'Variance (INR)', 'Status', 'Bank Ref', 'Period', 'Notes'];
    const rows = filtered.map(s => [
      s.id,
      s.partnerName,
      s.settlementDate,
      s.expectedAmount,
      s.receivedAmount,
      s.variance,
      s.reconciledStatus,
      s.bankRef,
      s.period,
      s.notes
    ]);
    exportToCsv(`paisa-settlements-log-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Settlements & Reconciliation</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {settlements.length} Settlements
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Bank credit logs reconciled against expected commission with automatic variance & shortfall alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsRecordOpen(true)}
            className="px-3.5 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Settlement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Received Funds</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{Number(settlements.reduce((s, item) => s + (item.receivedAmount || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Credited to operating account</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Shortfalls / Variances</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {settlements.filter(s => s.variance < 0).length} Disputed
          </div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">Under-deduction or TDS mismatch</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reconciliation Match Rate</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {settlements.length > 0 ? `${((settlements.filter(s => s.reconciledStatus === 'Matched').length / settlements.length) * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Perfect match against invoice MIS</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by ID, partner, UTR number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Reconciliation:</span>
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Matched">Matched</option>
            <option value="Variance Flagged">Variance Flagged</option>
            <option value="Surplus">Surplus</option>
          </select>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Settlement Ref</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Expected (INR)</th>
                <th className="py-3 px-4">Received (INR)</th>
                <th className="py-3 px-4">Variance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Bank Ref / UTR</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No settlement records found.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A3977]">
                      {item.id}
                      <div className="text-[10px] text-slate-400 font-normal">{item.period}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.partnerName}</div>
                      <div className="text-[10px] text-slate-500">{item.notes}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      ₹{Number(item.expectedAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{Number(item.receivedAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {item.variance === 0 && (
                        <span className="text-slate-500 font-medium">₹0 (Matched)</span>
                      )}
                      {item.variance < 0 && (
                        <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                          -₹{Number(Math.abs(item.variance || 0)).toLocaleString('en-IN')} (Shortfall)
                        </span>
                      )}
                      {item.variance > 0 && (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          +₹{Number(item.variance || 0).toLocaleString('en-IN')} (Bonus)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.reconciledStatus === 'Matched' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Matched</span>
                        </span>
                      )}
                      {item.reconciledStatus === 'Variance Flagged' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Variance</span>
                        </span>
                      )}
                      {item.reconciledStatus === 'Surplus' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span>Surplus</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {item.bankRef}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.settlementDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Settlement Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-base font-bold text-[#0A3977] mb-1">Record Settlement Payment</h3>
            <p className="text-xs text-slate-500 mb-4">Log received bank credit and compare against expected commission</p>

            <form onSubmit={handleRecordSettlement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Partner</label>
                <select
                  value={newSet.partnerId}
                  onChange={(e) => setNewSet(p => ({ ...p, partnerId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {AFFILIATE_PARTNERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Amount (₹)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={newSet.expectedAmount}
                    onChange={(e) => setNewSet(p => ({ ...p, expectedAmount: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Received (₹)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 48000"
                    value={newSet.receivedAmount}
                    onChange={(e) => setNewSet(p => ({ ...p, receivedAmount: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank UTR / Transaction Reference</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. NEFT-HDFC009281726"
                  value={newSet.bankRef}
                  onChange={(e) => setNewSet(p => ({ ...p, bankRef: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursal Period</label>
                <input 
                  type="text"
                  placeholder="e.g. 01/08/2026 - 15/08/2026"
                  value={newSet.period}
                  onChange={(e) => setNewSet(p => ({ ...p, period: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A3977] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition"
                >
                  Save Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
