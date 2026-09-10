import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  Building2,
  Calendar,
  X,
  Eye
} from 'lucide-react';
import { INITIAL_INVOICES } from '../data/invoicesData';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { exportToCsv } from '../utils/exportCsv';

export default function InvoicesRaisedView() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  const [newInv, setNewInv] = useState({
    partnerId: 'instarupees',
    netCommission: '',
    period: '01/08/2026 - 15/08/2026',
    description: 'Affiliate commission for retail personal loans'
  });

  const filtered = invoices.filter(inv => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!inv.invoiceNo.toLowerCase().includes(q) && !inv.partnerName.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
    return true;
  });

  const handleGenerateInvoice = (e) => {
    e.preventDefault();
    const partner = AFFILIATE_PARTNERS.find(p => p.id === newInv.partnerId) || { name: 'Partner' };
    const net = Number(newInv.netCommission) || 50000;
    const gst = Math.round(net * 0.18);
    const total = net + gst;

    const created = {
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      partnerId: newInv.partnerId,
      partnerName: partner.name,
      period: newInv.period,
      dateIssued: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      netCommission: net,
      gstRate: 18,
      gstAmount: gst,
      totalPayable: total,
      status: 'Unpaid',
      sacCode: '998311',
      description: newInv.description || 'Affiliate lead distribution fee'
    };

    setInvoices(prev => [created, ...prev]);
    setIsGenerateOpen(false);
    setNewInv({ partnerId: 'instarupees', netCommission: '', period: '01/08/2026 - 15/08/2026', description: 'Affiliate commission for retail personal loans' });
  };

  const handleExportCsv = () => {
    const headers = ['Invoice No', 'Partner Name', 'Period', 'Date Issued', 'Due Date', 'Net Commission (INR)', 'GST Amount (INR)', 'Total Payable (INR)', 'Status'];
    const rows = filtered.map(inv => [
      inv.invoiceNo,
      inv.partnerName,
      inv.period,
      inv.dateIssued,
      inv.dueDate,
      inv.netCommission,
      inv.gstAmount,
      inv.totalPayable,
      inv.status
    ]);
    exportToCsv(`paisa-invoices-raised-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const getStatusBadge = (status) => {
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
      case 'Unpaid':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Unpaid</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Invoices Raised</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {invoices.length} Invoices
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Tax invoices generated with 18% GST (SAC: 998311) sent to affiliate lending partners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsGenerateOpen(true)}
            className="px-3.5 py-2 bg-[#0A3977] hover:bg-[#072956] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Billed Volume</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{Number(invoices.reduce((s, inv) => s + (inv.totalPayable || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Includes 18% GST input/output</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unpaid Invoices</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{Number(invoices.filter(i => i.status !== 'Paid').reduce((s, inv) => s + (inv.totalPayable || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {invoices.filter(i => i.status !== 'Paid').length} invoices pending settlement
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Paid & Cleared</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{Number(invoices.filter(i => i.status === 'Paid').reduce((s, inv) => s + (inv.totalPayable || 0), 0) || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Settled by lending partners</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search invoice by #, partner name..." 
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
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Net Commission</th>
                <th className="py-3 px-4">GST (18%)</th>
                <th className="py-3 px-4 font-bold text-slate-900">Total Payable</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map(inv => (
                  <tr key={inv.invoiceNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A3977]">
                      {inv.invoiceNo}
                      <div className="text-[10px] text-slate-400 font-normal">Issued: {inv.dateIssued}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.partnerName}</div>
                      <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      ₹{Number(inv.netCommission || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      ₹{Number(inv.gstAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{Number(inv.totalPayable || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          title="Preview Invoice"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
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

      {/* Generate Invoice Modal */}
      {isGenerateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-base font-bold text-[#0A3977] mb-1">Generate Tax Invoice</h3>
            <p className="text-xs text-slate-500 mb-4">Calculate net commission, auto-apply 18% GST and issue invoice</p>

            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Lending Partner</label>
                <select
                  value={newInv.partnerId}
                  onChange={(e) => setNewInv(p => ({ ...p, partnerId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {AFFILIATE_PARTNERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Net Commission Amount (₹)</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 100000"
                  value={newInv.netCommission}
                  onChange={(e) => setNewInv(p => ({ ...p, netCommission: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                {newInv.netCommission && (
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>GST (18%): ₹{Math.round(Number(newInv.netCommission || 0) * 0.18).toLocaleString('en-IN')}</span>
                    <span className="font-bold text-slate-800">Total: ₹{Math.round(Number(newInv.netCommission || 0) * 1.18).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Period</label>
                <input 
                  type="text"
                  placeholder="e.g. 01/08/2026 - 15/08/2026"
                  value={newInv.period}
                  onChange={(e) => setNewInv(p => ({ ...p, period: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / SAC 998311</label>
                <input 
                  type="text"
                  placeholder="Affiliate lead generation commission"
                  value={newInv.description}
                  onChange={(e) => setNewInv(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A3977] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Preview Dialog */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">TAX INVOICE</span>
                <h3 className="text-lg font-bold text-[#0A3977]">{previewInvoice.invoiceNo}</h3>
              </div>
              <button 
                onClick={() => setPreviewInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Billed From</div>
                  <div className="font-bold text-slate-800 mt-0.5">Paisa in Minutes</div>
                  <div className="text-slate-500 text-[11px]">Adgrow Media Technologies Pvt Ltd</div>
                  <div className="text-slate-500 text-[11px]">GSTIN: 07AAICA8910B1ZT</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Billed To</div>
                  <div className="font-bold text-slate-800 mt-0.5">{previewInvoice.partnerName}</div>
                  <div className="text-slate-500 text-[11px]">Period: {previewInvoice.period}</div>
                  <div className="text-slate-500 text-[11px]">Due Date: {previewInvoice.dueDate}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Net Commission (SAC 998311)</span>
                  <span>₹{Number(previewInvoice.netCommission || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST @ 9%</span>
                  <span>₹{Math.round(Number(previewInvoice.gstAmount || 0) / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SGST @ 9%</span>
                  <span>₹{Math.round(Number(previewInvoice.gstAmount || 0) / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-base text-[#0A3977]">
                  <span>Total Payable</span>
                  <span>₹{Number(previewInvoice.totalPayable || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Payment Status: <span className="font-bold text-slate-800">{previewInvoice.status}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => {
                  alert(`Downloading PDF for invoice ${previewInvoice.invoiceNo}`);
                  setPreviewInvoice(null);
                }}
                className="px-4 py-1.5 bg-[#0A3977] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
