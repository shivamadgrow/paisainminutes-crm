import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import PartnerHubView from './components/PartnerHubView';
import CompanyLeadsView from './components/CompanyLeadsView';
import LeadsView from './components/LeadsView';
import ApplicationTracker from './components/ApplicationTracker';
import PipelineView from './components/PipelineView';
import KPISummary from './components/KPISummary';
import StaffView from './components/StaffView';
import AuditLogView from './components/AuditLogView';
import MyProfileView from './components/MyProfileView';
import LoginModal from './components/LoginModal';
import { INITIAL_STAFF_MEMBERS } from './data/staffData';
import { isOffHours, isUserExempt, logSecurityIncident } from './utils/shiftSecurity';
import { getLiveSecurityDetails } from './utils/geoService';
import { sanitizeLead } from './utils/amountHelpers';
import { getLeadsFromBackend } from './utils/apiConfig';

// Initial clean slate leads array
const INITIAL_LEADS = [];

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const saved = localStorage.getItem('paisa_crm_active_tab');
      if (saved) return saved;
    } catch (e) {}
    return 'executive';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('paisa_crm_active_tab', tab);
    } catch (e) {}
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Current logged in user / creator session state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('paisa_crm_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Shivam',
      role: 'Super Admin',
      email: 'shivam@adgrowmedia.com',
      avatar: 'SH',
      avatarBg: 'bg-[#0A3977]'
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSecurityRestricted, setIsSecurityRestricted] = useState(false);

  // Shift & Timing Security Check (9:27 AM - 6:35 PM IST for non-exempt staff)
  React.useEffect(() => {
    const checkSecurity = async () => {
      if (!currentUser) return;
      const exempt = isUserExempt(currentUser);
      if (exempt) {
        setIsSecurityRestricted(false);
        return;
      }

      if (isOffHours()) {
        setIsSecurityRestricted(true);
        const geo = await getLiveSecurityDetails();
        logSecurityIncident(currentUser, geo);
      } else {
        setIsSecurityRestricted(false);
      }
    };

    checkSecurity();
    const timer = setInterval(checkSecurity, 30000);
    return () => clearInterval(timer);
  }, [currentUser]);

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('paisa_crm_user', JSON.stringify(user));
    } catch (e) {}
  };

  // Real-time API Sync: Fetch incoming leads every 3 seconds
  React.useEffect(() => {
    let isMounted = true;
    const fetchLeadsFromApi = async () => {
      try {
        const result = await getLeadsFromBackend();
        if (isMounted && result.success && Array.isArray(result.leads)) {
          const cleanLeads = result.leads.map(sanitizeLead);
          console.log(
            `%c[CRM LIVE STATE SYNC] 📊 Synced %c${cleanLeads.length}%c leads | Endpoint: %c${result.sourceUrl || 'API'}`,
            'color: #0284c7; font-weight: bold;',
            'color: #dc2626; font-weight: bold;',
            'color: #0284c7; font-weight: bold;',
            'color: #059669; font-weight: bold;'
          );
          setLeads(cleanLeads);
        } else if (isMounted && !result.success) {
          console.log('%c[CRM LIVE STATE SYNC] ℹ️ Backend responded with 0 leads or empty array [].', 'color: #64748b;');
        }
      } catch (e) {
        console.warn('[CRM LIVE STATE SYNC] ⚠️ Fetch error during polling:', e);
      }
    };

    fetchLeadsFromApi();
    const timer = setInterval(fetchLeadsFromApi, 3000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Compute live counts and stats dynamically from leads array
  const leadCounts = useMemo(() => {
    const fresh = leads.filter(l => l.status === 'Fresh').length;
    const callback = leads.filter(l => l.status === 'Callback').length;
    const docsReceived = leads.filter(l => l.status === 'Docs received').length;
    const approved = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
    const rejected = leads.filter(l => l.status === 'Rejected').length;

    return {
      total: leads.length,
      fresh,
      callback,
      docsReceived,
      approved,
      rejected
    };
  }, [leads]);

  // Compute partner-wise counts
  const partnerCounts = useMemo(() => {
    const normalize = (name) => (name || '').toLowerCase().replace(/[\s\-_]/g, '');
    const rupay91 = leads.filter(l => normalize(l.assignedCompany) === 'rupay91').length;
    const adgrow = leads.filter(l => normalize(l.assignedCompany) === 'adgrow').length;
    const agdm = leads.filter(l => normalize(l.assignedCompany) === 'agdm').length;
    const rupaysure = leads.filter(l => normalize(l.assignedCompany) === 'rupaysure').length;

    return { rupay91, adgrow, agdm, rupaysure };
  }, [leads]);

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const approvedList = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed');
    const freshList = leads.filter(l => l.status === 'Fresh');
    const callbackList = leads.filter(l => l.status === 'Callback');
    const docsList = leads.filter(l => l.status === 'Docs received');

    const totalApplied = leads.reduce((sum, item) => sum + (Number(item.loanAmount || item.applied) || 0), 0);
    const approvedAmount = approvedList.reduce((sum, item) => sum + (Number(item.loanAmount || item.applied) || 0), 0);

    return {
      totalLeads: leads.length,
      freshCount: freshList.length,
      callbackCount: callbackList.length,
      docsCount: docsList.length,
      approvedCount: approvedList.length,
      disbursedCount: approvedList.length,
      disbursedAmount: approvedAmount,
      totalVolume: totalApplied,
      conversionRate: leads.length > 0 ? ((approvedList.length / leads.length) * 100).toFixed(0) : 0
    };
  }, [leads]);

  // Render main content area according to activeTab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'executive':
        return (
          <ExecutiveDashboard 
            stats={stats} 
            leads={leads}
            onSelectCompany={(companyId) => setActiveTab(`company-${companyId}`)}
            onOpenPartnerHub={() => setActiveTab('partner-hub')}
          />
        );

      case 'partner-hub':
        return (
          <PartnerHubView 
            leads={leads} 
            onSelectCompany={(companyId) => setActiveTab(`company-${companyId}`)}
            onOpenTestModal={() => setActiveTab('all-leads')}
          />
        );

      case 'company-rupay91':
        return (
          <CompanyLeadsView 
            companyId="rupay91" 
            leads={leads} 
            setLeads={setLeads} 
            onBackToHub={() => setActiveTab('partner-hub')} 
          />
        );

      case 'company-adgrow':
        return (
          <CompanyLeadsView 
            companyId="adgrow" 
            leads={leads} 
            setLeads={setLeads} 
            onBackToHub={() => setActiveTab('partner-hub')} 
          />
        );

      case 'company-agdm':
        return (
          <CompanyLeadsView 
            companyId="agdm" 
            leads={leads} 
            setLeads={setLeads} 
            onBackToHub={() => setActiveTab('partner-hub')} 
          />
        );

      case 'company-rupaysure':
        return (
          <CompanyLeadsView 
            companyId="rupaysure" 
            leads={leads} 
            setLeads={setLeads} 
            onBackToHub={() => setActiveTab('partner-hub')} 
          />
        );

      case 'all-leads':
      case 'fresh':
      case 'callback':
      case 'no-answer':
      case 'interested':
      case 'not-interested':
      case 'docs-received':
      case 'approved':
      case 'rejected':
      case 'rupay91':
      case 'adgrow':
      case 'agdm':
      case 'rupaysure':
        return (
          <LeadsView 
            leads={leads} 
            setLeads={setLeads} 
            activeFilterTab={activeTab} 
            setActiveFilterTab={setActiveTab} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            currentUser={currentUser}
          />
        );

      case 'tracker':
        return (
          <ApplicationTracker 
            leads={leads} 
          />
        );

      case 'pipeline':
        return (
          <PipelineView onSwitchToList={() => setActiveTab('all-leads')} />
        );

      case 'kpi':
        return (
          <KPISummary 
            stats={stats} 
          />
        );

      case 'admin-staff':
        return (
          <StaffView 
            onSwitchUser={handleSwitchUser} 
            currentUser={currentUser} 
          />
        );

      case 'admin-audit':
        return (
          <AuditLogView />
        );

      case 'profile':
        return (
          <MyProfileView 
            currentUser={currentUser} 
          />
        );

      default:
        return (
          <ExecutiveDashboard 
            stats={stats} 
            leads={leads}
            onSelectCompany={(companyId) => setActiveTab(`company-${companyId}`)}
            onOpenPartnerHub={() => setActiveTab('partner-hub')}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FC] overflow-hidden text-slate-800">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        leadCounts={leadCounts} 
        partnerCounts={partnerCounts}
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navbar */}
        <Navbar 
          searchQuery={searchQuery} 
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'all-leads') setActiveTab('all-leads');
          }} 
          setIsMobileOpen={setIsMobileOpen} 
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onSwitchUser={handleSwitchUser}
        />

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full">
            {renderMainContent()}
          </div>
        </main>

      </div>

      {/* Login & Creator Switcher Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleSwitchUser}
        currentUser={currentUser}
      />

    </div>
  );
}
