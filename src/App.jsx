import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import PartnerHubView from './components/PartnerHubView';
import CompanyLeadsView from './components/CompanyLeadsView';
import LeadsView from './components/LeadsView';
import ApplicationTracker from './components/ApplicationTracker';
import PipelineView from './components/PipelineView';
import KPISummary from './components/KPISummary';
import PartnerAnalyticsKPISummary from './components/PartnerAnalyticsKPISummary';
import StaffView from './components/StaffView';
import AuditLogView from './components/AuditLogView';
import MyProfileView from './components/MyProfileView';
import LoginModal from './components/LoginModal';

// New Affiliate CRM Components
import PartnerOnboardingModal from './components/PartnerOnboardingModal';
import PartnerAgreementsView from './components/PartnerAgreementsView';
import CommissionSummaryView from './components/CommissionSummaryView';
import PayoutRequestsView from './components/PayoutRequestsView';
import SettlementsView from './components/SettlementsView';
import InvoicesRaisedView from './components/InvoicesRaisedView';
import CommissionRateCardsView from './components/CommissionRateCardsView';
import RolesPermissionsView from './components/RolesPermissionsView';
import IntegrationSettingsView from './components/IntegrationSettingsView';
import NotificationsView from './components/NotificationsView';
import GeneralSettingsView from './components/GeneralSettingsView';
import ReportsView from './components/ReportsView';

import { isOffHours, isUserExempt, logSecurityIncident } from './utils/shiftSecurity';
import { getLiveSecurityDetails } from './utils/geoService';
import { sanitizeLead } from './utils/amountHelpers';
import { getLeadsFromBackend } from './utils/apiConfig';
import { 
  getCurrentUser, 
  setCurrentUserSession, 
  clearCurrentUserSession 
} from './utils/authService';
import { AFFILIATE_PARTNERS } from './data/affiliatePartners';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Authenticated user session (null when locked/logged out)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSecurityRestricted, setIsSecurityRestricted] = useState(false);

  // Listen to session changes
  useEffect(() => {
    const handleSessionChange = (e) => {
      setCurrentUser(e.detail || getCurrentUser());
    };
    window.addEventListener('paisa_session_changed', handleSessionChange);
    return () => window.removeEventListener('paisa_session_changed', handleSessionChange);
  }, []);

  // Shift & Timing Security Check (9:27 AM - 6:35 PM IST for non-exempt staff)
  useEffect(() => {
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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentUserSession(user);
    setIsLoginModalOpen(false);
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    setCurrentUserSession(user);
  };

  const handleLogout = () => {
    clearCurrentUserSession();
    setCurrentUser(null);
    setIsLoginModalOpen(false);
  };

  // Real-time API Sync: Fetch incoming leads every 3 seconds
  useEffect(() => {
    if (!currentUser) return; // Don't fetch if locked
    let isMounted = true;
    const fetchLeadsFromApi = async () => {
      try {
        const result = await getLeadsFromBackend();
        if (isMounted && result.success && Array.isArray(result.leads)) {
          const cleanLeads = result.leads.map(sanitizeLead);
          setLeads(cleanLeads);
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
  }, [currentUser]);

  // Compute live counts and stats dynamically from leads array
  const leadCounts = useMemo(() => {
    const fresh = leads.filter(l => l.status === 'Fresh').length;
    const callback = leads.filter(l => l.status === 'Callback').length;
    const interested = leads.filter(l => l.status === 'Interested').length;
    const docsReceived = leads.filter(l => l.status === 'Docs received' || l.status === 'Docs Received').length;
    const approved = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
    const rejected = leads.filter(l => l.status === 'Rejected').length;

    // Mobile-only mini-form dropoffs
    const mobileOnly = leads.filter(l => 
      l.isPhoneOnly || 
      (l.eligibilityStatus && l.eligibilityStatus.includes('Phone Only')) || 
      ((!l.name || l.name === 'Applicant') && (!l.loanAmount || Number(l.loanAmount) === 0))
    ).length;

    // Duplicate leads count based on phone or PAN
    const phoneCounts = {};
    const panCounts = {};
    leads.forEach(l => {
      const p = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
      if (p.length === 10) phoneCounts[p] = (phoneCounts[p] || 0) + 1;
      const pan = String(l.pan || '').trim().toUpperCase();
      if (pan && pan !== '—' && pan.length >= 10) panCounts[pan] = (panCounts[pan] || 0) + 1;
    });

    const duplicateLeads = leads.filter(l => {
      const p = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
      const pan = String(l.pan || '').trim().toUpperCase();
      return (p && phoneCounts[p] > 1) || (pan && pan !== '—' && panCounts[pan] > 1);
    }).length;

    return {
      total: leads.length,
      mobileOnly,
      fresh,
      callback,
      interested,
      docsReceived,
      approved,
      rejected,
      duplicateLeads
    };
  }, [leads]);

  // Counts for commissions & payouts
  const commissionCounts = useMemo(() => ({
    payoutRequests: 3,
    settlements: 5,
    invoices: 5
  }), []);

  // Compute partner-wise counts
  const partnerCounts = useMemo(() => {
    const normalize = (name) => (name || '').toLowerCase().replace(/[\s\-_]/g, '');
    const counts = {};
    AFFILIATE_PARTNERS.forEach(p => {
      counts[p.id] = leads.filter(l => {
        const c = normalize(l.assignedCompany);
        return c === p.id || c === normalize(p.name) || (c && c.includes(p.id));
      }).length;
    });
    return counts;
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

  // 🔒 IF NOT LOGGED IN: SHOW FULL-SCREEN LOGIN LOCK SCREEN
  if (!currentUser) {
    return (
      <LoginModal 
        isFullScreen={true}
        isOpen={true}
        onLogin={handleLoginSuccess}
        currentUser={null}
      />
    );
  }

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

      // Affiliate Partners new routes
      case 'partner-agreements':
        return (
          <PartnerAgreementsView onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        );

      case 'partner-onboarding':
        return (
          <PartnerAgreementsView onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        );

      // Commissions & Payouts routes
      case 'commission-summary':
        return (
          <CommissionSummaryView 
            leads={leads} 
            onSelectCompany={(companyId) => setActiveTab(`company-${companyId}`)} 
          />
        );

      case 'payout-requests':
        return (
          <PayoutRequestsView />
        );

      case 'settlements':
        return (
          <SettlementsView />
        );

      case 'invoices-raised':
        return (
          <InvoicesRaisedView />
        );

      case 'rate-cards':
        return (
          <CommissionRateCardsView />
        );

      // Lead Management routes (including mobile-only and duplicate-leads)
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
      case 'mobile-only':
      case 'duplicate-leads':
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
          <PartnerAnalyticsKPISummary 
            leads={leads} 
            onSelectCompany={(companyId) => setActiveTab(`company-${companyId}`)}
          />
        );

      case 'admin-staff':
        return (
          <StaffView 
            onSwitchUser={handleSwitchUser} 
            currentUser={currentUser} 
          />
        );

      case 'admin-roles':
        return (
          <RolesPermissionsView />
        );

      case 'admin-audit':
        return (
          <AuditLogView />
        );

      case 'admin-integrations':
        return (
          <IntegrationSettingsView />
        );

      case 'admin-notifications':
        return (
          <NotificationsView />
        );

      case 'admin-settings':
        return (
          <GeneralSettingsView />
        );

      case 'reports':
        return (
          <ReportsView leads={leads} />
        );

      case 'profile':
        return (
          <MyProfileView 
            currentUser={currentUser} 
          />
        );

      default:
        if (activeTab && activeTab.startsWith('company-')) {
          const companyId = activeTab.replace('company-', '');
          return (
            <CompanyLeadsView 
              companyId={companyId} 
              leads={leads} 
              setLeads={setLeads} 
              onBackToHub={() => setActiveTab('partner-hub')} 
            />
          );
        }
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

  // Strict Mandatory Login Gate: If user is not authenticated, lock CRM completely!
  if (!currentUser) {
    return (
      <LoginModal 
        isFullScreen={true}
        isOpen={true} 
        onClose={() => {}} 
        onLogin={handleLoginSuccess}
        currentUser={null}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F4F7FC] overflow-hidden text-slate-800">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        leadCounts={leadCounts} 
        partnerCounts={partnerCounts}
        commissionCounts={commissionCounts}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
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
          onLogout={handleLogout}
        />

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full">
            {renderMainContent()}
          </div>
        </main>

      </div>

      {/* Switch User Modal (when opened from dropdown) */}
      <LoginModal 
        isFullScreen={false}
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLoginSuccess}
        currentUser={currentUser}
      />

      {/* Onboard Partner Modal */}
      <PartnerOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onAddPartner={(newPartner) => {
          AFFILIATE_PARTNERS.push(newPartner);
          setActiveTab(`company-${newPartner.id}`);
        }}
      />

    </div>
  );
}
