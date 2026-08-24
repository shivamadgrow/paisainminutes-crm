import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Mail, Send, FileText, History, Smartphone, CheckCircle2, Eye, Copy, Check, Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { NOTIFICATION_TEMPLATES } from '../data/notificationTemplates';

// Official Original WhatsApp Vector Icon
const WhatsAppOriginalIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.031 2c-5.516 0-9.99 4.474-9.99 9.99 0 1.763.458 3.486 1.33 5.002L2 22l5.176-1.356a9.948 9.948 0 0 0 4.855 1.258h.004c5.515 0 9.989-4.474 9.989-9.99 0-2.668-1.039-5.176-2.925-7.062A9.923 9.923 0 0 0 12.031 2zm0 1.688c2.217 0 4.302.864 5.87 2.432a8.243 8.243 0 0 1 2.43 5.87c0 4.582-3.719 8.302-8.301 8.302a8.27 8.27 0 0 1-4.22-1.151l-.303-.18-3.132.821.837-3.053-.197-.315a8.24 8.24 0 0 1-1.256-4.425c0-4.582 3.72-8.302 8.302-8.302zm-3.555 3.75c-.194 0-.422.073-.643.312-.221.24-.843.824-.843 2.01 0 1.185.864 2.33 0.985 2.492.12.163 1.685 2.628 4.12 3.659.58.245 1.033.391 1.387.503.583.185 1.114.159 1.534.096.468-.07 1.442-.59 1.644-1.16.202-.57.202-1.06.142-1.16-.06-.1-.22-.16-.463-.281-.243-.122-1.442-.711-1.666-.793-.223-.081-.386-.122-.548.122-.162.244-.627.793-.77.955-.141.163-.283.183-.526.061-.243-.122-1.026-.378-1.954-1.205-.722-.644-1.21-1.44-1.352-1.683-.142-.244-.015-.375.107-.496.11-.11.243-.284.365-.426.121-.142.162-.244.243-.406.081-.163.04-.305-.02-.427-.061-.122-.548-1.32-.751-1.809-.197-.476-.398-.411-.548-.419-.141-.008-.304-.01-.466-.01z"/>
  </svg>
);

export default function NotificationsView() {
  const [activeTab, setActiveTab] = useState('Send');
  const [channelFilter, setChannelFilter] = useState('All channels');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('Any time');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const dropdownRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTemplate = NOTIFICATION_TEMPLATES.find(t => t.id === selectedTemplateId);

  // Group templates by channel
  const emailTemplates = NOTIFICATION_TEMPLATES.filter(t => t.channel === 'Email');
  const smsTemplates = NOTIFICATION_TEMPLATES.filter(t => t.channel === 'SMS');
  const whatsappTemplates = NOTIFICATION_TEMPLATES.filter(t => t.channel === 'WhatsApp');

  // Channel badge styling matching Screenshot 1 with Original WhatsApp SVG
  const renderChannelBadge = (channel) => {
    switch (channel) {
      case 'Email':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50/90 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Email</span>
          </span>
        );
      case 'SMS':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-700" />
            <span>SMS</span>
          </span>
        );
      case 'WhatsApp':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
            <WhatsAppOriginalIcon className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </span>
        );
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{channel}</span>;
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0A3977] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          <div className="crm-card p-3 bg-white px-4 text-center border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="text-lg font-bold text-slate-900">8</div>
            <div className="text-[10px] text-slate-400 font-medium">Templates</div>
          </div>
          <div className="crm-card p-3 bg-white px-4 text-center border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="text-lg font-bold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Disbursed borrowers</div>
          </div>
          <div className="crm-card p-3 bg-white px-4 text-center border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="text-lg font-bold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Messages sent</div>
          </div>
        </div>
      </div>

      {/* Main Sub-tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('Send')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'Send' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
        <button
          onClick={() => setActiveTab('Templates')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'Templates' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Templates <strong className="text-slate-700">8</strong></span>
        </button>
        <button
          onClick={() => setActiveTab('History')}
          className={`pb-3 transition flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'History' ? 'border-[#0A3977] text-[#0A3977] font-bold' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* TAB 1: SEND NOTIFICATIONS */}
      {activeTab === 'Send' && (
        <div className="space-y-6">
          
          {/* Step 1: Choose a template */}
          <div className="crm-card p-5 bg-white space-y-4 border border-slate-200/80 rounded-2xl shadow-2xs">
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

            {/* Channel Filter Pills (With Original WhatsApp Vector Icon) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              {[
                { id: 'All channels', label: 'All channels', icon: null },
                { id: 'Email', label: 'Email', icon: <Mail className="w-3.5 h-3.5 text-blue-600" /> },
                { id: 'SMS', label: 'SMS', icon: <Smartphone className="w-3.5 h-3.5 text-amber-700" /> },
                { id: 'WhatsApp', label: 'WhatsApp', icon: <WhatsAppOriginalIcon className="w-3.5 h-3.5 text-[#25D366]" /> },
              ].map(ch => {
                const isSelected = channelFilter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setChannelFilter(ch.id);
                      if (selectedTemplate && ch.id !== 'All channels' && selectedTemplate.channel !== ch.id) {
                        setSelectedTemplateId('');
                      }
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-indigo-500 bg-indigo-50/80 text-indigo-700 font-bold shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ch.icon}
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Fully Interactive Clickable Dropdown (Matching Screenshot 2) */}
            <div className="max-w-md pt-1 relative" ref={dropdownRef}>
              
              {/* Trigger Input Box */}
              <div 
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl flex items-center justify-between transition cursor-pointer shadow-2xs select-none ${
                  isDropdownOpen 
                    ? 'border-indigo-600 ring-2 ring-indigo-200' 
                    : 'border-indigo-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {selectedTemplate ? (
                    <>
                      {renderChannelBadge(selectedTemplate.channel)}
                      <span className="font-bold text-slate-900 truncate">{selectedTemplate.name}</span>
                    </>
                  ) : (
                    <span className="text-slate-500 font-medium">— choose a template —</span>
                  )}
                </div>

                <div className="text-slate-400 pl-2 shrink-0">
                  {isDropdownOpen ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Dropdown Menu Items Popup */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 max-h-72 overflow-y-auto animate-fade-in text-xs">
                  
                  {/* Default None option */}
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate('')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-500 font-medium transition cursor-pointer"
                  >
                    — choose a template —
                  </button>

                  {/* Email Templates Group */}
                  {(channelFilter === 'All channels' || channelFilter === 'Email') && (
                    <div className="py-1 border-t border-slate-100">
                      <div className="px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/70 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-blue-600" />
                        <span>Email</span>
                      </div>
                      {emailTemplates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className={`w-full text-left px-6 py-2 transition cursor-pointer flex items-center justify-between ${
                            selectedTemplateId === tmpl.id 
                              ? 'bg-blue-50 text-indigo-700 font-bold' 
                              : 'hover:bg-slate-50 text-slate-800 font-medium'
                          }`}
                        >
                          <span>{tmpl.name}</span>
                          {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* SMS Templates Group */}
                  {(channelFilter === 'All channels' || channelFilter === 'SMS') && (
                    <div className="py-1 border-t border-slate-100">
                      <div className="px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/70 flex items-center gap-1.5">
                        <Smartphone className="w-3 h-3 text-amber-700" />
                        <span>SMS</span>
                      </div>
                      {smsTemplates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className={`w-full text-left px-6 py-2 transition cursor-pointer flex items-center justify-between ${
                            selectedTemplateId === tmpl.id 
                              ? 'bg-amber-50 text-amber-900 font-bold' 
                              : 'hover:bg-slate-50 text-slate-800 font-medium'
                          }`}
                        >
                          <span>{tmpl.name}</span>
                          {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* WhatsApp Templates Group */}
                  {(channelFilter === 'All channels' || channelFilter === 'WhatsApp') && (
                    <div className="py-1 border-t border-slate-100">
                      <div className="px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/70 flex items-center gap-1.5">
                        <WhatsAppOriginalIcon className="w-3 h-3 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </div>
                      {whatsappTemplates.map(tmpl => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className={`w-full text-left px-6 py-2 transition cursor-pointer flex items-center justify-between ${
                            selectedTemplateId === tmpl.id 
                              ? 'bg-emerald-50 text-emerald-900 font-bold' 
                              : 'hover:bg-slate-50 text-slate-800 font-medium'
                          }`}
                        >
                          <span>{tmpl.name}</span>
                          {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Selected Template Live Preview Card */}
            {selectedTemplate && (
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs space-y-2.5 animate-fade-in mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderChannelBadge(selectedTemplate.channel)}
                    <span className="font-bold text-slate-900 text-xs">{selectedTemplate.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Tokens: {selectedTemplate.tokens.join(', ')}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-[11px] font-sans text-slate-700 whitespace-pre-line leading-relaxed">
                  <div className="font-bold text-slate-900 pb-1 border-b border-slate-100 mb-1.5">
                    Subject: {selectedTemplate.subject}
                  </div>
                  {selectedTemplate.body}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Pick recipients */}
          <div className="crm-card p-5 bg-white space-y-4 border border-slate-200/80 rounded-2xl shadow-2xs">
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
                onClick={() => showToast("Refreshed recipients list.")}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Filter Bar & Disbursed Date Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="Search name, mobile, email or loan no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3977]"
                />
              </div>

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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
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
      )}

      {/* TAB 2: TEMPLATES (Matching Screenshot 1 for all 8 templates) */}
      {activeTab === 'Templates' && (
        <div className="space-y-4">
          <div className="crm-card bg-white overflow-hidden border border-slate-200/80 rounded-2xl shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200">
                    <th className="p-3.5 w-32">CHANNEL</th>
                    <th className="p-3.5 min-w-[200px]">TEMPLATE NAME</th>
                    <th className="p-3.5 min-w-[250px]">SUBJECT / PREVIEW</th>
                    <th className="p-3.5">TOKENS</th>
                    <th className="p-3.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {NOTIFICATION_TEMPLATES.map((tmpl) => (
                    <tr 
                      key={tmpl.id} 
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setActiveTab('Send');
                        showToast(`Selected "${tmpl.name}" template!`);
                      }}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      {/* Channel Pill (Matching Screenshot 1) */}
                      <td className="p-3.5">
                        {renderChannelBadge(tmpl.channel)}
                      </td>

                      {/* Template Name */}
                      <td className="p-3.5 font-bold text-slate-900">
                        {tmpl.name}
                      </td>

                      {/* Subject / Body Preview */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 text-xs truncate max-w-sm">
                          {tmpl.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                          {tmpl.body.replace(/\n/g, ' ')}
                        </div>
                      </td>

                      {/* Tokens */}
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {tmpl.tokens.map((token, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                              {token}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setPreviewTemplate(tmpl)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTemplateId(tmpl.id);
                            setActiveTab('Send');
                          }}
                          className="px-3 py-1 bg-blue-50 text-[#0A3977] hover:bg-[#0A3977] hover:text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'History' && (
        <div className="crm-card bg-white p-12 text-center border border-slate-200/80 rounded-2xl shadow-2xs text-slate-400 space-y-2">
          <History className="w-8 h-8 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-800 text-xs">No Notification Dispatch Logs</h3>
          <p className="text-[11px] text-slate-400">All sent emails, SMS and WhatsApp logs with delivery receipts will appear here.</p>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {renderChannelBadge(previewTemplate.channel)}
                <h3 className="font-bold text-slate-900 text-sm">{previewTemplate.name}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700">
                Subject: <strong className="text-slate-900">{previewTemplate.subject}</strong>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 whitespace-pre-line leading-relaxed text-xs">
                {previewTemplate.body}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedTemplateId(previewTemplate.id);
                  setPreviewTemplate(null);
                  setActiveTab('Send');
                }}
                className="px-4 py-2 bg-[#0A3977] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:bg-blue-900"
              >
                Use in Send Tab
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200"
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
