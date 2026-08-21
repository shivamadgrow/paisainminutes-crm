import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Receipt, 
  BarChart3, 
  RefreshCw, 
  FileText, 
  Users, 
  GitMerge, 
  Compass, 
  Sparkles, 
  PhoneCall, 
  Heart, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, leadCounts, isMobileOpen, setIsMobileOpen }) {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isSelected = (id) => activeTab === id;

  const getNavItemClass = (id) => {
    const selected = isSelected(id);
    return `group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer ${
      selected 
        ? 'bg-[#EEF4FF] text-[#0A3977] font-semibold border-l-4 border-[#0A3977] shadow-xs' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    } flex flex-col h-screen overflow-hidden shadow-sm`}>
      
      {/* Brand Header with Paisa in Minutes Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <img 
          src="/paisa-logo.png" 
          alt="Paisa in Minutes" 
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-slate-700 text-xs">
        
        {/* Section: DASHBOARDS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>DASHBOARDS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => handleNavClick('executive')} 
              className={getNavItemClass('executive')}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${isSelected('executive') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Executive</span>
              </div>
            </button>

            <button 
              onClick={() => handleNavClick('sales')} 
              className={getNavItemClass('sales')}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className={`w-4 h-4 ${isSelected('sales') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Sales</span>
              </div>
            </button>

            <button 
              onClick={() => handleNavClick('collections')} 
              className={getNavItemClass('collections')}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className={`w-4 h-4 ${isSelected('collections') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>Collections</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: INSIGHTS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>INSIGHTS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('kpi')} className={getNavItemClass('kpi')}>
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>KPI summary</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('reloan')} className={getNavItemClass('reloan')}>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Re-loan opportunities</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('reports')} className={getNavItemClass('reports')}>
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Reports</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: LEADS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>LEADS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('all-leads')} className={getNavItemClass('all-leads')}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>All Leads</span>
              </div>
              <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#0A3977]">
                {leadCounts?.total ?? 0}
              </span>
            </button>

            <button onClick={() => handleNavClick('pipeline')} className={getNavItemClass('pipeline')}>
              <div className="flex items-center gap-2.5">
                <GitMerge className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Pipeline</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('tracker')} className={getNavItemClass('tracker')}>
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Application Tracker</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('fresh')} className={getNavItemClass('fresh')}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Fresh</span>
              </div>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                {leadCounts?.fresh ?? 0}
              </span>
            </button>

            <button onClick={() => handleNavClick('callback')} className={getNavItemClass('callback')}>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Callback</span>
              </div>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                {leadCounts?.callback ?? 0}
              </span>
            </button>

            <button onClick={() => handleNavClick('interested')} className={getNavItemClass('interested')}>
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Interested</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('docs-received')} className={getNavItemClass('docs-received')}>
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-[#0A3977]" />
                <span>Docs received</span>
              </div>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                {leadCounts?.docsReceived ?? 0}
              </span>
            </button>

            <button onClick={() => handleNavClick('approved')} className={getNavItemClass('approved')}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Approved</span>
              </div>
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                {leadCounts?.approved ?? 0}
              </span>
            </button>

            <button onClick={() => handleNavClick('rejected')} className={getNavItemClass('rejected')}>
              <div className="flex items-center gap-2.5">
                <XCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Rejected</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: DISBURSAL */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>DISBURSAL</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('ready-disburse')} className={getNavItemClass('ready-disburse')}>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Ready to disburse</span>
              </div>
            </button>

            <button onClick={() => handleNavClick('disbursed')} className={getNavItemClass('disbursed')}>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Disbursed</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: LOANS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>LOANS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('loans-active')} className={getNavItemClass('loans-active')}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Active</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-overdue')} className={getNavItemClass('loans-overdue')}>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Overdue</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-part')} className={getNavItemClass('loans-part')}>
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Part-payment</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-settlement')} className={getNavItemClass('loans-settlement')}>
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Settlement</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-closed')} className={getNavItemClass('loans-closed')}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Closed</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-preclosed')} className={getNavItemClass('loans-preclosed')}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Pre-closed</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('loans-all')} className={getNavItemClass('loans-all')}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>All loans</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: COLLECTIONS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>COLLECTIONS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('collections-workspace')} className={getNavItemClass('collections-workspace')}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Workspace</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('collections-followups')} className={getNavItemClass('collections-followups')}>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Follow-ups</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('collections-queue')} className={getNavItemClass('collections-queue')}>
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Queue</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: NOTIFICATIONS */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>NOTIFICATIONS</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('notifications-send')} className={getNavItemClass('notifications-send')}>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Send messages</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: ADMINISTRATION */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[11px] font-bold tracking-wider text-blue-950 uppercase">
            <span>ADMINISTRATION</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <button onClick={() => handleNavClick('admin-staff')} className={getNavItemClass('admin-staff')}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Staff</span>
              </div>
            </button>
            <button onClick={() => handleNavClick('admin-audit')} className={getNavItemClass('admin-audit')}>
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                <span>Audit log</span>
              </div>
            </button>
          </div>
        </div>



      </div>

      {/* Footer Branding subtle note */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
        Paisa in Minutes CRM v2.0
      </div>

    </aside>
  );
}
