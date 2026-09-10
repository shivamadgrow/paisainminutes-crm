import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Plus, 
  History, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Calendar,
  Sparkles,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_RATE_CARDS } from '../data/rateCardsData';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';

export default function CommissionRateCardsView() {
  const [rateCards, setRateCards] = useState(INITIAL_RATE_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    model: 'tiered',
    defaultRate: '2.8%',
    effectiveFrom: new Date().toISOString().slice(0, 10),
    slab1Rate: '2.5',
    slab2Rate: '2.8',
    slab3Rate: '3.2',
    perLeadFee: 1500
  });

  const filtered = rateCards.filter(rc => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!rc.partnerName.toLowerCase().includes(q) && !rc.defaultRate.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleOpenEdit = (rc) => {
    setSelectedCard(rc);
    setEditForm({
      model: rc.model,
      defaultRate: rc.defaultRate,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      slab1Rate: '2.5',
      slab2Rate: '2.8',
      slab3Rate: '3.2',
      perLeadFee: rc.perLeadFee || 1500
    });
    setIsEditOpen(true);
  };

  const handleSaveRateCard = (e) => {
    e.preventDefault();
    if (!selectedCard) return;

    const newHistoryEntry = {
      effectiveFrom: selectedCard.effectiveFrom,
      effectiveTo: editForm.effectiveFrom,
      rate: selectedCard.defaultRate,
      model: selectedCard.model,
      updatedBy: 'Super Admin'
    };

    setRateCards(prev => prev.map(rc => {
      if (rc.id === selectedCard.id) {
        return {
          ...rc,
          model: editForm.model,
          defaultRate: editForm.model === 'per_lead' 
            ? `₹${editForm.perLeadFee} / lead` 
            : `${editForm.defaultRate}`,
          effectiveFrom: editForm.effectiveFrom,
          history: [
            ...rc.history,
            newHistoryEntry,
            {
              effectiveFrom: editForm.effectiveFrom,
              effectiveTo: 'Present',
              rate: editForm.defaultRate,
              model: editForm.model,
              updatedBy: 'Super Admin'
            }
          ]
        };
      }
      return rc;
    }));

    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>Commission Rate Cards</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {rateCards.length} Partners Configured
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Per-partner commission slabs with immutable effective-date history ensuring past revenue is never recalculated
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-indigo-50/70 border border-indigo-200 p-3.5 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Effective Date Protection Enabled:</span> When updating a partner's commission slab or percentage, the changes only apply to loan disbursals after the selected effective date. All previous periods maintain historical contract rates automatically.
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full sm:w-80 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search partner rate cards..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs border-none focus:outline-none"
        />
      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(rc => (
          <div key={rc.id} className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
            {/* Card Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {rc.partnerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{rc.partnerName}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {rc.partnerId}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {rc.defaultRate}
                </span>
                <button
                  onClick={() => handleOpenEdit(rc)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition cursor-pointer"
                  title="Edit Rate Slabs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slabs Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Commercial Model:</span>
                <span className="font-mono uppercase text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {rc.model.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Effective Since:</span>
                <span className="font-mono text-slate-700">{rc.effectiveFrom}</span>
              </div>

              {/* Slabs List */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Slabs</div>
                {rc.slabs && rc.slabs.map((slab, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-slate-700">
                    <span className="font-medium text-[11px]">{slab.label}</span>
                    <span className="font-mono font-bold text-indigo-600 text-xs">
                      {slab.perLeadFee ? `₹${slab.perLeadFee}` : `${slab.ratePct}%`}
                    </span>
                  </div>
                ))}
              </div>

              {/* History Preview */}
              {rc.history && rc.history.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mb-1">
                    <History className="w-3 h-3 text-slate-400" />
                    <span>Rate History ({rc.history.length} changes)</span>
                  </div>
                  <div className="space-y-1">
                    {rc.history.slice(-2).map((h, hi) => (
                      <div key={hi} className="text-[10px] text-slate-500 flex justify-between font-mono">
                        <span>{h.effectiveFrom} → {h.effectiveTo}:</span>
                        <span className="font-semibold text-slate-700">{h.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Status: <strong className="text-emerald-600">Active & Applied</strong></span>
              <button 
                onClick={() => handleOpenEdit(rc)} 
                className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
              >
                Configure Slabs →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rate Card Modal */}
      {isEditOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-fade-in">
            <h3 className="text-base font-bold text-[#0A3977] mb-1">
              Configure Rate Card — {selectedCard.partnerName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update commission model, percentages, and select the start date for this rate schedule
            </p>

            <form onSubmit={handleSaveRateCard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Model</label>
                <select
                  value={editForm.model}
                  onChange={(e) => setEditForm(p => ({ ...p, model: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value="tiered">Tiered Volume Slabs</option>
                  <option value="flat_pct">Flat Percentage of Disbursal</option>
                  <option value="per_lead">Flat Fee per Lead</option>
                </select>
              </div>

              {editForm.model !== 'per_lead' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Commission Rate</label>
                  <input 
                    type="text"
                    value={editForm.defaultRate}
                    onChange={(e) => setEditForm(p => ({ ...p, defaultRate: e.target.value }))}
                    placeholder="e.g. 2.8%"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee per Lead (₹)</label>
                  <input 
                    type="number"
                    value={editForm.perLeadFee}
                    onChange={(e) => setEditForm(p => ({ ...p, perLeadFee: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date (Start Date)</label>
                <input 
                  type="date"
                  value={editForm.effectiveFrom}
                  onChange={(e) => setEditForm(p => ({ ...p, effectiveFrom: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Leads disbursed before this date will continue using the prior rate.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A3977] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#072956] transition"
                >
                  Apply Rate Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
