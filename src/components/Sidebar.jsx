import React, { useState } from 'react';
import paisaLogo from '../assets/paisa-logo.png';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Users, 
  GitMerge, 
  Compass, 
  Sparkles, 
  PhoneCall, 
  Heart, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  ChevronDown,
  Building2,
  Code2,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  leadCounts, 
  partnerCounts = {}, 
  isMobileOpen, 
  setIsMobileOpen 
}) {
  const [collapsedSections, setCollapsedSections] = useState({
    dashboards: false,
    partners: false,
    leads: false,
    integration: false,
    administration: false
  });

  const toggleSection = (key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isSelected = (id) => activeTab === id;

  const getNavItemClass = (id) => {
    const selected = isSelected(id);
    return `group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 cursor-pointer ${
      selected 
        ? 'bg-[#EEF4FF] text-[#0A3977] font-bold border-l-4 border-[#0A3977] shadow-xs' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    } flex flex-col h-screen overflow-hidden shadow-sm select-none`}>
      
      {/* Brand Header with Paisa in Minutes Logo */}
      <div className="flex items-center px-5 h-16 border-b border-slate-100 bg-white shrink-0">
        <img 
          src={paisaLogo} 
          alt="Paisa in Minutes" 
          className="h-11 w-auto max-w-[190px] object-contain cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleNavClick('executive')}
        />
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-slate-700 text-xs scrollbar-thin">
        
        {/* 1. Section: DASHBOARDS */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('dashboards')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-blue-950 uppercase cursor-pointer"
          >
            <span>DASHBOARDS</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.dashboards ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.dashboards && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              <button 
                onClick={() => handleNavClick('executive')} 
                className={getNavItemClass('executive')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${isSelected('executive') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Executive Overview</span>
                </div>
              </button>

              <button 
                onClick={() => handleNavClick('kpi')} 
                className={getNavItemClass('kpi')}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 ${isSelected('kpi') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Partner Analytics</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 2. Section: AFFILIATE PARTNERS (Company Sections) */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('partners')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-indigo-950 uppercase cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-indigo-900">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>AFFILIATE PARTNERS</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.partners ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.partners && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              {/* Partner Hub (All Companies) */}
              <button 
                onClick={() => handleNavClick('partner-hub')} 
                className={getNavItemClass('partner-hub')}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className={`w-4 h-4 ${isSelected('partner-hub') ? 'text-[#0A3977]' : 'text-indigo-500'}`} />
                  <span className="font-bold">Partner Hub (All)</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800">
                  {AFFILIATE_PARTNERS.length}
                </span>
              </button>

              {/* 1. Rupay91 */}
              <button 
                onClick={() => handleNavClick('company-rupay91')} 
                className={getNavItemClass('company-rupay91')}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>Rupay91</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700">
                  {partnerCounts.rupay91 ?? 0}
                </span>
              </button>

              {/* 2. Adgrow */}
              <button 
                onClick={() => handleNavClick('company-adgrow')} 
                className={getNavItemClass('company-adgrow')}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Adgrow</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">
                  {partnerCounts.adgrow ?? 0}
                </span>
              </button>

              {/* 3. AGDM */}
              <button 
                onClick={() => handleNavClick('company-agdm')} 
                className={getNavItemClass('company-agdm')}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>AGDM</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                  {partnerCounts.agdm ?? 0}
                </span>
              </button>

              {/* 4. Rupaysure */}
              <button 
                onClick={() => handleNavClick('company-rupaysure')} 
                className={getNavItemClass('company-rupaysure')}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Rupaysure</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800">
                  {partnerCounts.rupaysure ?? 0}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Section: LEAD MANAGEMENT */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('leads')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-blue-950 uppercase cursor-pointer"
          >
            <span>LEAD MANAGEMENT</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.leads ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.leads && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              <button onClick={() => handleNavClick('all-leads')} className={getNavItemClass('all-leads')}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>All Leads</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#0A3977]">
                  {leadCounts?.total ?? 0}
                </span>
              </button>

              <button onClick={() => handleNavClick('fresh')} className={getNavItemClass('fresh')}>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Fresh Applications</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                  {leadCounts?.fresh ?? 0}
                </span>
              </button>

              <button onClick={() => handleNavClick('pipeline')} className={getNavItemClass('pipeline')}>
                <div className="flex items-center gap-2.5">
                  <GitMerge className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Pipeline Flow</span>
                </div>
              </button>

              <button onClick={() => handleNavClick('tracker')} className={getNavItemClass('tracker')}>
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Application Tracker</span>
                </div>
              </button>

              <button onClick={() => handleNavClick('callback')} className={getNavItemClass('callback')}>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Callback</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700">
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
                  <span>Docs Received</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-700">
                  {leadCounts?.docsReceived ?? 0}
                </span>
              </button>

              <button onClick={() => handleNavClick('approved')} className={getNavItemClass('approved')}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Approved & Converted</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">
                  {leadCounts?.approved ?? 0}
                </span>
              </button>

              <button onClick={() => handleNavClick('rejected')} className={getNavItemClass('rejected')}>
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Rejected / Drop-off</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 4. Section: WEBSITE INTEGRATION & TOOLS */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('integration')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-blue-950 uppercase cursor-pointer"
          >
            <span>INTEGRATION & TOOLS</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.integration ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.integration && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              <button onClick={() => handleNavClick('api-integration')} className={getNavItemClass('api-integration')}>
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Website API & Form Code</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 5. Section: ADMINISTRATION */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('administration')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-blue-950 uppercase cursor-pointer"
          >
            <span>ADMINISTRATION</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.administration ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.administration && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              <button onClick={() => handleNavClick('admin-staff')} className={getNavItemClass('admin-staff')}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Staff & Telecallers</span>
                </div>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Footer Branding subtle note */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center shrink-0">
        Paisa in Minutes Affiliate CRM
      </div>

    </aside>
  );
}
