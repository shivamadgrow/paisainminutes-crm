import React from 'react';
import { ListFilter } from 'lucide-react';
import { normalizeStatus } from '../utils/apiConfig';

export default function PipelineView({ onSwitchToList, leads = [] }) {
  const columns = [
    {
      title: 'Fresh',
      subtext: 'Fresh, not yet contacted',
      dotColor: 'bg-sky-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'FRESH').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'FRESH')
    },
    {
      title: 'Callback',
      subtext: 'Callback scheduled / follow-up',
      dotColor: 'bg-amber-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'CALLBACK').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'CALLBACK')
    },
    {
      title: 'Interested',
      subtext: 'Interested, discussing loan offers',
      dotColor: 'bg-purple-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'INTERESTED').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'INTERESTED')
    },
    {
      title: 'Docs Received',
      subtext: 'Docs received & in verification',
      dotColor: 'bg-indigo-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'DOCS_RECEIVED').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'DOCS_RECEIVED')
    },
    {
      title: 'Approved',
      subtext: 'Credit approved, pending disbursal',
      dotColor: 'bg-emerald-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'APPROVED').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'APPROVED')
    },
    {
      title: 'Disbursed',
      subtext: 'Funded & disbursed to borrower',
      dotColor: 'bg-teal-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'DISBURSED').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'DISBURSED')
    },
    {
      title: 'Rejected',
      subtext: 'Application rejected / declined',
      dotColor: 'bg-rose-500',
      count: leads.filter(l => normalizeStatus(l.status) === 'REJECTED').length,
      leads: leads.filter(l => normalizeStatus(l.status) === 'REJECTED')
    }
  ];

  const totalLeadsCount = columns.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {totalLeadsCount} leads across {columns.length} stages
          </p>
        </div>

        <button
          onClick={onSwitchToList}
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>List view</span>
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4 items-start">
        {columns.map(col => (
          <div key={col.title} className="w-72 shrink-0 space-y-3">
            
            {/* Column Header Box */}
            <div className="crm-card p-3 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                  <h3 className="text-xs font-bold text-slate-800">{col.title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {col.count}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {col.subtext}
              </p>
            </div>

            {/* Column Cards */}
            <div className="space-y-3">
              {col.leads.length > 0 ? (
                col.leads.map((item, idx) => (
                  <div key={item.id || idx} className="crm-card p-3.5 bg-white space-y-2 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.applicantName || item.name || 'Applicant'}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {item.displayId || item.loanNo || (item.id ? String(item.id).slice(0, 8) : 'PIM')}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-[#0A3977]">
                      {item.applied || (item.amount ? `₹${Number(item.amount).toLocaleString('en-IN')}` : '—')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                      <span className="font-mono">{item.phone || item.mobile || '—'}</span>
                      <span className="truncate max-w-[100px] text-right">{item.location || 'Online'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-300 font-medium italic">
                  No leads
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
