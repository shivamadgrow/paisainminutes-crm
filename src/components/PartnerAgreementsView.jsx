import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink,
  Building2,
  Filter,
  Plus
} from 'lucide-react';
import { INITIAL_AGREEMENTS } from '../data/agreementsData';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';

export default function PartnerAgreementsView({ onOpenOnboarding }) {
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newAgr, setNewAgr] = useState({
    partnerId: 'rupay91',
    agreementNumber: '',
    signedDate: new Date().toISOString().slice(0, 10),
    validUntil: '2027-03-31',
    rateSheet: '2.5% Flat',
    paymentTerms: 'Bi-monthly',
    fileName: ''
  });

  const filtered = agreements.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.partnerName.toLowerCase().includes(q);
      const matchNum = item.agreementNumber.toLowerCase().includes(q);
      const matchPerson = (item.contactPerson || '').toLowerCase().includes(q);
      if (!matchName && !matchNum && !matchPerson) return false;
    }

    if (statusFilter !== 'All' && item.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleCreateAgreement = (e) => {
    e.preventDefault();
    const partner = AFFILIATE_PARTNERS.find(p => p.id === newAgr.partnerId) || { name: 'Partner' };
    const created = {
      id: `agr-${Date.now()}`,
      partnerId: newAgr.partnerId,
      partnerName: partner.name,
      agreementNumber: newAgr.agreementNumber || `PIM-AGR-2026-${Math.floor(100 + Math.random() * 900)}`,
      signedDate: newAgr.signedDate,
      validUntil: newAgr.validUntil,
      status: 'Active',
      rateSheet: newAgr.rateSheet,
      paymentTerms: newAgr.paymentTerms,
      agreementFile: newAgr.fileName || `${partner.id}_contract_${new Date().getFullYear()}.pdf`,
      fileSize: '2.1 MB',
      contactPerson: 'Authorized Signatory'
    };

    setAgreements(prev => [created, ...prev]);
    setUploadModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active</span>
          </span>
        );
      case 'Expiring Soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Expiring Soon</span>
          </span>
        );
      case 'Expired':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Expired</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Partner Agreements</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {agreements.length} Contracts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master service level agreements, commission rate schedules & contract renewal tracking per lending partner
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-3.5 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Agreement</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Contracts</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {agreements.filter(a => a.status === 'Active').length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Compliant & operational</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Expiring in 60 Days</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {agreements.filter(a => a.status === 'Expiring Soon').length}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Renewal review required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Contract Term</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">24 Months</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fixed commercial period</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search agreement by partner, contract #..." 
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
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Agreements Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Partner & Agreement #</th>
                <th className="py-3 px-4">Rate Sheet & Slabs</th>
                <th className="py-3 px-4">Signed Date</th>
                <th className="py-3 px-4">Renewal / Expiry</th>
                <th className="py-3 px-4">Payment Cycle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No agreements found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map(agr => (
                  <tr key={agr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0A3977]">{agr.partnerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{agr.agreementNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{agr.contactPerson}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-indigo-900 bg-indigo-50/80 border border-indigo-200/60 px-2 py-0.5 rounded text-[11px]">
                        {agr.rateSheet}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {agr.signedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">{agr.validUntil}</div>
                      {agr.status === 'Expiring Soon' && (
                        <div className="text-[10px] text-amber-600 font-semibold">Renews in &lt; 60 days</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {agr.paymentTerms}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(agr.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => alert(`Viewing document: ${agr.agreementFile}`)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          title="Download Agreement PDF"
                        >
                          <Download className="w-3 h-3 text-slate-500" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Agreement Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-base font-bold text-[#0A3977] mb-1">Upload Partner Agreement</h3>
            <p className="text-xs text-slate-500 mb-4">Attach executed contract deed or updated commission rate schedule</p>
            
            <form onSubmit={handleCreateAgreement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Lending Partner</label>
                <select
                  value={newAgr.partnerId}
                  onChange={(e) => setNewAgr(p => ({ ...p, partnerId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {AFFILIATE_PARTNERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agreement Number / Deed Ref</label>
                <input 
                  type="text" 
                  placeholder="e.g. PIM-AGR-2026-088" 
                  value={newAgr.agreementNumber}
                  onChange={(e) => setNewAgr(p => ({ ...p, agreementNumber: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Signed Date</label>
                  <input 
                    type="date" 
                    value={newAgr.signedDate}
                    onChange={(e) => setNewAgr(p => ({ ...p, signedDate: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Renewal / Expiry Date</label>
                  <input 
                    type="date" 
                    value={newAgr.validUntil}
                    onChange={(e) => setNewAgr(p => ({ ...p, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract File Upload (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNewAgr(p => ({ ...p, fileName: e.target.files?.[0]?.name || '' }))}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A3977] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
