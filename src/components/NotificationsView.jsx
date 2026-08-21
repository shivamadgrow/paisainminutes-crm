import React, { useState } from 'react';
import { RefreshCw, Mail, Send, FileText, History } from 'lucide-react';

export default function NotificationsView() {
  const [activeTab, setActiveTab] = useState('Send');
  const [channelFilter, setChannelFilter] = useState('All channels');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateFilter, setDateFilter] = useState('Any time');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & KPI Summary Cards */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0A3977]">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send predefined Email / SMS / WhatsApp messages to borrowers of disbursed loans.
          </p>
        </div>

        {/* 3 KPI Small Cards */}
        <div className="flex items-center gap-3">
          <div className="crm-card p-3 bg-white px-4 text-center">
            <div className="text-lg font-bold text-slate-900">8</div>
            <div className="text-[10px] text-slate-400 font-medium">Templates</div>
          </div>
          <div className="crm-card p-3 bg-white px-4 text-center">
            <div className="text-lg font-bold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Disbursed borrowers</div>
          </div>
          <div className="crm-card p-3 bg-white px-4 text-center">
            <div className="text-lg font-bold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Messages sent</div>
          </div>
        </div>
      </div>

      {/* Main Sub-tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('Send')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'Send' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
        <button
          onClick={() => setActiveTab('Templates')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'Templates' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Templates <strong className="text-slate-700">8</strong></span>
        </button>
        <button
          onClick={() => setActiveTab('History')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'History' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* Step 1: Choose a template */}
      <div className="crm-card p-5 bg-white space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0A3977] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Choose a template</h3>
            <p className="text-[11px] text-slate-400">
              Tokens like <code className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[10px]">{`{CustomerName}`}</code> are filled per borrower when sending.
            </p>
          </div>
        </div>

        {/* Channel Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {[
            { id: 'All channels', label: 'All channels', count: 8 },
            { id: 'Email', label: 'Email', count: 6 },
            { id: 'SMS', label: 'SMS', count: 1 },
            { id: 'WhatsApp', label: 'WhatsApp', count: 1 },
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => setChannelFilter(ch.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition flex items-center gap-1.5 ${
                channelFilter === ch.id
                  ? 'bg-[#0A3977] text-white shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{ch.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                channelFilter === ch.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {ch.count}
              </span>
            </button>
          ))}
        </div>

        {/* Template Select Dropdown */}
        <div className="max-w-md pt-1">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977] text-slate-700 font-medium cursor-pointer"
          >
            <option value="">— choose a template —</option>
            <option value="welcome">Welcome & Loan Disbursal Confirmation (Email)</option>
            <option value="emi-reminder">Upcoming EMI Due Reminder (SMS)</option>
            <option value="overdue-notice">Overdue Payment Alert (WhatsApp)</option>
            <option value="noc">Loan Clearance Certificate & NOC (Email)</option>
          </select>
        </div>
      </div>

      {/* Step 2: Pick recipients */}
      <div className="crm-card p-5 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0A3977] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Pick recipients</h3>
              <p className="text-[11px] text-slate-400">
                Borrowers of disbursed loans — rows without the needed contact are disabled.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert("Refreshed recipients list.")}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Bar & Disbursed Date Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search name, mobile, email or loan no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977]"
          />

          <select className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
            <option value="all">Status: All</option>
            <option value="active">Status: Active</option>
            <option value="overdue">Status: Overdue</option>
          </select>

          <span className="text-[10px] uppercase font-bold text-slate-400">DISBURSED</span>

          <div className="flex flex-wrap items-center gap-1 text-xs">
            {['Any time', 'Today', 'This week', 'This month', 'This quarter', 'This year', 'Custom...'].map(d => (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  dateFilter === d
                    ? 'bg-blue-100 text-[#0A3977] font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Recipients Table */}
        <div className="overflow-x-auto border-t border-slate-100 pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-100">
                <th className="py-2.5 w-8">
                  <input type="checkbox" disabled className="rounded border-slate-300" />
                </th>
                <th className="py-2.5">APPLICANT</th>
                <th className="py-2.5">CONTACT</th>
                <th className="py-2.5">LOAN NO.</th>
                <th className="py-2.5">PRINCIPAL</th>
                <th className="py-2.5">DISBURSED ON</th>
                <th className="py-2.5">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs">No matching recipients</span>
                    <span className="text-[11px] text-slate-400">Disbursed loans will appear here.</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
