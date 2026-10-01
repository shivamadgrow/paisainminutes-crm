import React, { useState, useEffect } from 'react';
import paisaLogo from '../assets/paisa-logo.png';
import { 
  LayoutDashboard, 
  BarChart3, 
  Building2, 
  Layers, 
  UserPlus, 
  FileText, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  Receipt, 
  Sliders, 
  Users, 
  Smartphone, 
  Sparkles, 
  GitMerge, 
  Compass, 
  PhoneCall, 
  Heart, 
  FileCheck, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  Link as LinkIcon, 
  Bell, 
  Settings, 
  ChevronDown,
  FileSpreadsheet,
  UserCheck,
  FileDown
} from 'lucide-react';
import { AFFILIATE_PARTNERS } from '../data/affiliatePartners';
import { canViewTab } from '../utils/permissions';
import { exportPartnerLeadsCsv } from '../utils/crmApi';

const STORAGE_KEY = 'paisa_crm_sidebar_sections';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  leadCounts = {}, 
  partnerCounts = {}, 
  commissionCounts = {},
  onOpenOnboarding,
  isMobileOpen, 
  setIsMobileOpen,
  currentUser = null
}) {
  const [collapsedSections, setCollapsedSections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      dashboards: false,
      partners: false,
      commissions: false,
      leads: false,
      administration: false,
      reports: false
    };
  });

  const toggleSection = (key) => {
    setCollapsedSections(prev => {
      const updated = {
        ...prev,
        [key]: !prev[key]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleNavClick = (tabId) => {
    if (tabId === 'partner-onboarding' && onOpenOnboarding) {
      onOpenOnboarding();
      if (setIsMobileOpen) setIsMobileOpen(false);
      return;
    }
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const isSelected = (id) => activeTab === id;
  // Hide menu entries the account has no permission for (the server still enforces permissions on every call).
  const show = (id) => canViewTab(currentUser, id);

  const [isExporting, setIsExporting] = useState(false);
  const handleExportPartnerCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    // Authenticated download of the server-generated CSV (partner users can only export their own partner).
    const res = await exportPartnerLeadsCsv(currentUser?.serverPartnerId || currentUser?.partnerId);
    setIsExporting(false);
    if (!res.ok) window.alert(`Could not export leads: ${res.error}`);
  };

  const getNavItemClass = (id) => {
    const selected = isSelected(id);
    return `group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all duration-150 cursor-pointer ${
      selected 
        ? 'bg-[#EEF4FF] text-[#0A3977] font-bold border-l-4 border-[#0A3977] shadow-xs' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  // 🛡️ ROLE ISOLATION: Dedicated scoped navigation for Partner role
  if (currentUser && currentUser.role === 'Partner') {
    const partnerId = currentUser.partnerId || '';
    const partnerName = currentUser.partnerName || 'Partner Portal';
    const myLeadCount = partnerCounts[partnerId] ?? (leadCounts?.total ?? 0);

    return (
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col h-screen overflow-hidden shadow-sm select-none`}>
        
        {/* Brand Header with Partner badge */}
        <div className="flex flex-col justify-center px-5 h-20 border-b border-slate-100 bg-white shrink-0">
          <img 
            src={paisaLogo} 
            alt="Paisa in Minutes" 
            className="h-8 w-auto max-w-[160px] object-contain cursor-pointer"
            onClick={() => handleNavClick('partner-leads')}
          />
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate">
              {partnerName} Portal
            </span>
          </div>
        </div>

        {/* Scoped Partner Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-slate-700 text-xs">
          <div className="px-2 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Partner Workspace
          </div>

          <button 
            onClick={() => handleNavClick('partner-leads')}
            className={getNavItemClass('partner-leads')}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${isSelected('partner-leads') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="font-bold">My Leads</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-100 text-[#0A3977]">
              {myLeadCount}
            </span>
          </button>

          <button 
            type="button"
            onClick={handleExportPartnerCsv}
            disabled={isExporting}
            className="group w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 transition-all cursor-pointer"
            title="Export all assigned and redirected leads as CSV"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Export Leads CSV</span>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-800">
              CSV
            </span>
          </button>

          <div className="pt-4 px-2 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Account & Security
          </div>

          <button 
            onClick={() => handleNavClick('profile')}
            className={getNavItemClass('profile')}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className={`w-4 h-4 ${isSelected('profile') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>Partner Profile</span>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center shrink-0">
          <p className="font-medium text-slate-600">Paisa in Minutes</p>
          <p className="text-[10px] text-slate-400">Scoped Partner API Gateway</p>
        </div>

      </aside>
    );
  }

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
        {(show('executive') || show('kpi')) && (
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
              {show('executive') && (
              <button 
                onClick={() => handleNavClick('executive')} 
                className={getNavItemClass('executive')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${isSelected('executive') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Executive Overview</span>
                </div>
              </button>
              )}

              {show('kpi') && (
              <button 
                onClick={() => handleNavClick('kpi')} 
                className={getNavItemClass('kpi')}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className={`w-4 h-4 ${isSelected('kpi') ? 'text-[#0A3977]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Partner Analytics</span>
                </div>
              </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 2. Section: AFFILIATE PARTNERS */}
        {(show('partner-hub') || show('partner-agreements') || show('delivery-logs')) && (
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
              {show('partner-hub') && (
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
              )}

              {/* All 8 Affiliate Partners */}
              {AFFILIATE_PARTNERS.map(partner => (
                <button 
                  key={partner.id}
                  onClick={() => handleNavClick(`company-${partner.id}`)} 
                  className={getNavItemClass(`company-${partner.id}`)}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: partner.accentColor || '#4F46E5' }}
                    ></span>
                    <span className="truncate">{partner.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                    {partnerCounts[partner.id] ?? 0}
                  </span>
                </button>
              ))}

              {/* [NEW] Add New Partner */}
              {show('partner-onboarding') && (
              <button 
                onClick={() => handleNavClick('partner-onboarding')} 
                className={getNavItemClass('partner-onboarding')}
              >
                <div className="flex items-center gap-2.5 text-indigo-700 font-semibold">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Add New Partner</span>
                </div>
              </button>
              )}

              {/* [NEW] Partner Agreements */}
              {show('partner-agreements') && (
              <button 
                onClick={() => handleNavClick('partner-agreements')} 
                className={getNavItemClass('partner-agreements')}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Partner Agreements</span>
                </div>
              </button>
              )}

              {/* [NEW] API Delivery Logs */}
              {show('delivery-logs') && (
              <button 
                onClick={() => handleNavClick('delivery-logs')} 
                className={getNavItemClass('delivery-logs')}
              >
                <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                  <Send className={`w-4 h-4 ${isSelected('delivery-logs') ? 'text-emerald-700' : 'text-emerald-600'}`} />
                  <span>API Delivery Logs</span>
                </div>
              </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 3. Section: COMMISSIONS & PAYOUTS (NEW SECTION) */}
        {(show('commission-summary') || show('payout-requests') || show('settlements') || show('invoices-raised') || show('rate-cards')) && (
        <div>
          <button
            type="button"
            onClick={() => toggleSection('commissions')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-emerald-950 uppercase cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-emerald-900">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>COMMISSIONS & PAYOUTS</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.commissions ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.commissions && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              {show('commission-summary') && (
              <button onClick={() => handleNavClick('commission-summary')} className={getNavItemClass('commission-summary')}>
                <div className="flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  <span>Commission Summary</span>
                </div>
              </button>
              )}

              {show('payout-requests') && (
              <button onClick={() => handleNavClick('payout-requests')} className={getNavItemClass('payout-requests')}>
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Payout Requests</span>
                </div>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full transition ${
                  (commissionCounts?.payoutRequests || 0) > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {commissionCounts?.payoutRequests ?? 0}
                </span>
              </button>
              )}

              {show('settlements') && (
              <button onClick={() => handleNavClick('settlements')} className={getNavItemClass('settlements')}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  <span>Settlements</span>
                </div>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full transition ${
                  (commissionCounts?.settlements || 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {commissionCounts?.settlements ?? 0}
                </span>
              </button>
              )}

              {show('invoices-raised') && (
              <button onClick={() => handleNavClick('invoices-raised')} className={getNavItemClass('invoices-raised')}>
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Invoices Raised</span>
                </div>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full transition ${
                  (commissionCounts?.invoices || 0) > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {commissionCounts?.invoices ?? 0}
                </span>
              </button>
              )}

              {show('rate-cards') && (
              <button onClick={() => handleNavClick('rate-cards')} className={getNavItemClass('rate-cards')}>
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Commission Rate Cards</span>
                </div>
              </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 4. Section: LEAD MANAGEMENT */}
        {(show('all-leads') || show('pipeline') || show('tracker')) && (
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
              {/* All Leads */}
              {show('all-leads') && (
              <button onClick={() => handleNavClick('all-leads')} className={getNavItemClass('all-leads')}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>All Leads</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#0A3977]">
                  {leadCounts?.total ?? 0}
                </span>
              </button>
              )}

              {/* [NEW] Mobile-only Leads */}
              {show('mobile-only') && (
              <button onClick={() => handleNavClick('mobile-only')} className={getNavItemClass('mobile-only')}>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  <span>Mobile-only Leads</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                  {leadCounts?.mobileOnly ?? 0}
                </span>
              </button>
              )}

              {/* Fresh Applications */}
              {show('fresh') && (
              <button onClick={() => handleNavClick('fresh')} className={getNavItemClass('fresh')}>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Fresh Applications</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                  {leadCounts?.fresh ?? 0}
                </span>
              </button>
              )}

              {/* Pipeline Flow */}
              {show('pipeline') && (
              <button onClick={() => handleNavClick('pipeline')} className={getNavItemClass('pipeline')}>
                <div className="flex items-center gap-2.5">
                  <GitMerge className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Pipeline Flow</span>
                </div>
              </button>
              )}

              {/* Application Tracker */}
              {show('tracker') && (
              <button onClick={() => handleNavClick('tracker')} className={getNavItemClass('tracker')}>
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Application Tracker</span>
                </div>
              </button>
              )}

              {/* Callback */}
              {show('callback') && (
              <button onClick={() => handleNavClick('callback')} className={getNavItemClass('callback')}>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Callback</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700">
                  {leadCounts?.callback ?? 0}
                </span>
              </button>
              )}

              {/* Interested */}
              {show('interested') && (
              <button onClick={() => handleNavClick('interested')} className={getNavItemClass('interested')}>
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Interested</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-700">
                  {leadCounts?.interested ?? 0}
                </span>
              </button>
              )}

              {/* Docs Received */}
              {show('docs-received') && (
              <button onClick={() => handleNavClick('docs-received')} className={getNavItemClass('docs-received')}>
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-[#0A3977]" />
                  <span>Docs Received</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-700">
                  {leadCounts?.docsReceived ?? 0}
                </span>
              </button>
              )}

              {/* Approved & Converted */}
              {show('approved') && (
              <button onClick={() => handleNavClick('approved')} className={getNavItemClass('approved')}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Approved & Converted</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">
                  {leadCounts?.approved ?? 0}
                </span>
              </button>
              )}

              {/* Rejected / Drop-off */}
              {show('rejected') && (
              <button onClick={() => handleNavClick('rejected')} className={getNavItemClass('rejected')}>
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Rejected / Drop-off</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700">
                  {leadCounts?.rejected ?? 0}
                </span>
              </button>
              )}

              {/* [NEW] Duplicate Leads */}
              {show('duplicate-leads') && (
              <button onClick={() => handleNavClick('duplicate-leads')} className={getNavItemClass('duplicate-leads')}>
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  <span>Duplicate Leads</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800">
                  {leadCounts?.duplicateLeads ?? 0}
                </span>
              </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 5. Section: ADMINISTRATION */}
        {(show('admin-staff') || show('admin-roles') || show('admin-audit') || show('admin-integrations') || show('admin-notifications') || show('admin-settings')) && (
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
              {show('admin-staff') && (
              <button onClick={() => handleNavClick('admin-staff')} className={getNavItemClass('admin-staff')}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  <span>Staff & Telecallers</span>
                </div>
              </button>
              )}

              {/* [NEW] Roles & Permissions */}
              {show('admin-roles') && (
              <button onClick={() => handleNavClick('admin-roles')} className={getNavItemClass('admin-roles')}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Roles & Permissions</span>
                </div>
              </button>
              )}

              {/* [NEW] Activity Log */}
              {show('admin-audit') && (
              <button onClick={() => handleNavClick('admin-audit')} className={getNavItemClass('admin-audit')}>
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Activity Log</span>
                </div>
              </button>
              )}

              {/* [NEW] Integration Settings */}
              {show('admin-integrations') && (
              <button onClick={() => handleNavClick('admin-integrations')} className={getNavItemClass('admin-integrations')}>
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Integration Settings</span>
                </div>
              </button>
              )}

              {/* [NEW] Notification Settings */}
              {show('admin-notifications') && (
              <button onClick={() => handleNavClick('admin-notifications')} className={getNavItemClass('admin-notifications')}>
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Notification Settings</span>
                </div>
              </button>
              )}

              {/* [NEW] General Settings */}
              {show('admin-settings') && (
              <button onClick={() => handleNavClick('admin-settings')} className={getNavItemClass('admin-settings')}>
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>General Settings</span>
                </div>
              </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 6. Section: REPORTS (NEW SECTION AT BOTTOM) */}
        {(show('reports')) && (
        <div>
          <button
            type="button"
            onClick={() => toggleSection('reports')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100/80 transition text-[11px] font-extrabold tracking-wider text-indigo-950 uppercase cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-indigo-900">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>REPORTS</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              collapsedSections.reports ? '-rotate-90' : 'rotate-0'
            }`} />
          </button>
          
          {!collapsedSections.reports && (
            <div className="space-y-0.5 mt-1 animate-fade-in">
              {show('reports') && (
              <button onClick={() => handleNavClick('reports')} className={getNavItemClass('reports')}>
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <span>Custom Reports</span>
                </div>
              </button>
              )}
            </div>
          )}
        </div>
        )}

      </div>

      {/* Footer Branding subtle note */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center shrink-0">
        Paisa in Minutes Affiliate CRM
      </div>

    </aside>
  );
}
