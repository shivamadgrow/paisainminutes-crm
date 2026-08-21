import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, GitMerge, User, X, Search } from 'lucide-react';


const INITIAL_FULL_LEADS = [];

const mapTabToFilterName = (tab) => {
  if (!tab || tab === 'all-leads' || tab === 'all') return 'All Leads';
  const clean = tab.toLowerCase().replace(/[-_]/g, ' ');
  if (clean === 'fresh') return 'Fresh';
  if (clean === 'callback') return 'Callback';
  if (clean === 'interested') return 'Interested';
  if (clean === 'docs received') return 'Docs Received';
  if (clean === 'approved') return 'Approved';
  if (clean === 'rejected') return 'Rejected';
  if (clean === 'no answer') return 'No Answer';
  if (clean === 'not interested') return 'Not Interested';
  if (clean === 'incomplete docs') return 'Incomplete Docs';
  if (clean === 'ready to disburse') return 'Ready to Disburse';
  if (clean === 'disbursed') return 'Disbursed';
  if (clean === 'dead leads') return 'Dead Leads';
  return tab;
};

export default function LeadsView({ leads: propLeads, activeFilterTab, setActiveFilterTab }) {
  const leads = propLeads || INITIAL_FULL_LEADS;
  const [localFilter, setLocalFilter] = useState(() => mapTabToFilterName(activeFilterTab));
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (activeFilterTab) {
      setLocalFilter(mapTabToFilterName(activeFilterTab));
    }
  }, [activeFilterTab]);

  const activeFilter = localFilter;

  const handleFilterClick = (filterId) => {
    setLocalFilter(filterId);
    if (setActiveFilterTab) {
      setActiveFilterTab(filterId.toLowerCase().replace(/\s+/g, '-'));
    }
  };


  const filterPills = [
    { id: 'All Leads', label: 'All Leads', count: leads.length },
    { id: 'Fresh', label: 'Fresh', count: leads.filter(l => l.status === 'Fresh').length },
    { id: 'Callback', label: 'Callback', count: leads.filter(l => l.status === 'Callback').length },
    { id: 'No Answer', label: 'No Answer', count: 0 },
    { id: 'Interested', label: 'Interested', count: 0 },
    { id: 'Not Interested', label: 'Not Interested', count: 0 },
    { id: 'Docs Received', label: 'Docs Received', count: leads.filter(l => l.status === 'Docs Received').length },
    { id: 'Incomplete Docs', label: 'Incomplete Docs', count: 0 },
    { id: 'Approved', label: 'Approved', count: leads.filter(l => l.status === 'Approved').length },
    { id: 'Ready to Disburse', label: 'Ready to Disburse', count: 0 },
    { id: 'Disbursed', label: 'Disbursed', count: 0 },
    { id: 'Rejected', label: 'Rejected', count: 0 },
    { id: 'Dead Leads', label: 'Dead Leads', count: 0 },
  ];

  const filteredLeads = leads.filter(item => {
    const normActive = activeFilter.toLowerCase().replace(/\s+/g, ' ');
    const isAll = normActive === 'all leads' || normActive === 'all';
    
    const matchesFilter = isAll || item.status.toLowerCase().replace(/\s+/g, ' ') === normActive;

    const matchesSearch = 
      !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.mobile.includes(searchQuery) ||
      item.loanNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fresh':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-[#0A3977]">Fresh</span>;
      case 'Callback':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800">Callback</span>;
      case 'Docs Received':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-100 text-purple-800">Docs Received</span>;
      case 'Approved':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-100 text-emerald-800">Approved</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-100 text-rose-800">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Leads
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredLeads.length} matching · {leads.length} total in pipeline
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>My Leads</span>
          </button>
          <button 
            onClick={() => setActiveFilterTab && setActiveFilterTab('pipeline')}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
          >
            <GitMerge className="w-3.5 h-3.5 text-slate-400" />
            <span>Pipeline view</span>
          </button>
          <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ New lead</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search name, mobile or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] placeholder-slate-400"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {filterPills.map(pill => {
          const isSelected = activeFilter.toLowerCase().replace(/\s+/g, ' ') === pill.id.toLowerCase().replace(/\s+/g, ' ');
          return (
            <button
              key={pill.id}
              onClick={() => handleFilterClick(pill.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#0A3977] text-white shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{pill.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                isSelected ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Box */}
      <div className="crm-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                <th className="p-3.5 w-8">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="p-3.5 min-w-[240px]">APPLICANT</th>
                <th className="p-3.5">TELE CALLER</th>
                <th className="p-3.5">CREDIT MANAGER</th>
                <th className="p-3.5">COLLECTION MANAGER</th>
                <th className="p-3.5">PAN</th>
                <th className="p-3.5">APPLIED</th>
                <th className="p-3.5">SANCTIONED</th>
                <th className="p-3.5">MONTHLY SALARY</th>
                <th className="p-3.5">CITY</th>
                <th className="p-3.5">STATE</th>
                <th className="p-3.5">PINCODE</th>
                <th className="p-3.5">SOURCE</th>
                <th className="p-3.5">PURPOSE</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">CREATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Checkbox */}
                    <td className="p-3.5">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>

                    {/* APPLICANT */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5`}>
                          {item.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.loanNo}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{item.mobile}</span>
                            <span>{item.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* TELE CALLER */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">Unassigned</span>
                        <button className="text-[10px] font-semibold text-[#0A3977] hover:underline px-1.5 py-0.5 border border-slate-200 rounded bg-white">
                          Assign
                        </button>
                      </div>
                    </td>

                    {/* CREDIT MANAGER */}
                    <td className="p-3.5 text-center">
                      {item.creditManager !== '—' ? (
                        <span className="text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          {item.creditManager}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* COLLECTION MANAGER */}
                    <td className="p-3.5 text-slate-400 text-center">—</td>

                    {/* PAN */}
                    <td className="p-3.5 font-mono text-slate-700 text-xs">
                      {item.pan}
                    </td>

                    {/* APPLIED */}
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{item.applied.toLocaleString('en-IN')}
                    </td>

                    {/* SANCTIONED */}
                    <td className="p-3.5 text-slate-400 text-center">—</td>

                    {/* MONTHLY SALARY */}
                    <td className="p-3.5 font-semibold text-slate-800">
                      ₹{item.salary.toLocaleString('en-IN')}
                    </td>

                    {/* CITY */}
                    <td className="p-3.5 text-slate-700">{item.city}</td>

                    {/* STATE */}
                    <td className="p-3.5 text-slate-700">{item.state}</td>

                    {/* PINCODE */}
                    <td className="p-3.5 font-mono text-slate-600">{item.pincode}</td>

                    {/* SOURCE */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-600">
                        {item.source}
                      </span>
                    </td>

                    {/* PURPOSE */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700">
                        {item.purpose}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-3.5">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* CREATED */}
                    <td className="p-3.5 text-xs text-slate-500 font-mono">
                      {item.created}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="p-12 text-center text-slate-400 text-xs">
                    No leads match this filter.
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
