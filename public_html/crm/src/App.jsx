import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import PartnerHubView from './components/PartnerHubView';
import CompanyLeadsView from './components/CompanyLeadsView';
import LeadsView from './components/LeadsView';
import ApplicationTracker from './components/ApplicationTracker';
import PipelineView from './components/PipelineView';
import PartnerAnalyticsKPISummary from './components/PartnerAnalyticsKPISummary';
import StaffView from './components/StaffView';
import AuditLogView from './components/AuditLogView';
import MyProfileView from './components/MyProfileView';
import LoginModal from './components/LoginModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import PartnerPortalView from './components/PartnerPortalView';
import DeliveryLogView from './components/DeliveryLogView';

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

import { sanitizeLead } from './utils/amountHelpers';
import { getLeadsFromBackend, normalizeStatus } from './utils/apiConfig';
import { SESSION_EVENT, SESSION_EXPIRED_EVENT } from './utils/apiClient';
import {
  getCurrentUser,
  setCurrentUserSession,
  restoreSession,
  logoutStaff
} from './utils/authService';
import { getFinanceCounts } from './utils/crmApi';
import { canViewTab, hasPermission } from './utils/permissions';
import { AFFILIATE_PARTNERS } from './data/affiliatePartners';

// Leads refresh interval (the old 3 second polling hammered the server). Paused while the tab is hidden.
const LEADS_REFRESH_MS = 30000;

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const user = getCurrentUser();
    if (user && user.role === 'Partner') return 'partner-leads';
    try {
      const saved = localStorage.getItem('paisa_crm_active_tab');
      if (saved) return saved;
    } catch (e) {
      // storage unavailable: use the default tab
    }
    return 'executive';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('paisa_crm_active_tab', tab);
    } catch (e) {
      // UI preference only
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  // Leads come only from the Node server (no browser cache of personal data).
  const [leads, setLeads] = useState([]);
  const [leadsError, setLeadsError] = useState('');
  const [leadsLoaded, setLeadsLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  const [partnerPreview, setPartnerPreview] = useState(null);

  const [commissionCounts, setCommissionCounts] = useState({ payoutRequests: 0, settlements: 0, invoices: 0 });
  const refreshCommissionCounts = useCallback(async () => {
    try {
      setCommissionCounts(await getFinanceCounts());
    } catch (e) {
      // counts are cosmetic
    }
  }, []);

  // Authenticated user session (null when locked/logged out)
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionNotice, setSessionNotice] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // On page load, confirm the stored session with the server (a revoked or expired session returns to login).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getCurrentUser()) {
        const user = await restoreSession();
        if (!cancelled) {
          if (user) setCurrentUser(user);
          else {
            setCurrentUserSession(null);
            setCurrentUser(null);
          }
        }
      }
      if (!cancelled) setSessionChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen to session changes (login, logout, token refresh failure)
  useEffect(() => {
    const handleSessionChange = (e) => {
      const user = e.detail || null;
      setCurrentUser(user);
      if (!user) {
        setLeads([]);
        setLeadsLoaded(false);
        setPartnerPreview(null);
      }
      if (user && user.role === 'Partner') {
        setActiveTab('partner-leads');
      }
    };
    const handleExpired = () => setSessionNotice('Your session has expired. Please sign in again.');
    window.addEventListener(SESSION_EVENT, handleSessionChange);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => {
      window.removeEventListener(SESSION_EVENT, handleSessionChange);
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setSessionNotice('');
    setCurrentUser(user);
    setCurrentUserSession(user);
    setIsLoginModalOpen(false);
    if (user && user.role === 'Partner') setActiveTab('partner-leads');
  };

  // Used when the signed-in user's own profile changed (e.g. edited in Staff).
  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    setCurrentUserSession(user);
  };

  // The server revokes every session when a password changes, so the user signs in again.
  const handlePasswordChanged = () => {
    setCurrentUserSession(null);
    setCurrentUser(null);
    setSessionNotice('Password changed. Please sign in with your new password.');
  };

  const handleLogout = async () => {
    await logoutStaff();
    setCurrentUser(null);
    setIsLoginModalOpen(false);
    setSessionNotice('');
  };

  const partnerScope = currentUser?.role === 'Partner' ? undefined : partnerPreview?.partnerId;

  const refreshLeads = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const result = await getLeadsFromBackend({ partnerId: partnerScope });
      if (result && result.success && Array.isArray(result.leads)) {
        setLeads(result.leads.map(sanitizeLead));
        setLeadsError('');
        setLeadsLoaded(true);
      } else if (result && result.status !== 401) {
        setLeadsError(result?.error || 'Could not load leads from the server.');
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [partnerScope]);

  // Server sync: load once, then refresh every 30s while the tab is visible.
  useEffect(() => {
    if (!currentUser || currentUser.mustChangePassword) return undefined;
    let timer = null;
    const canSeeFinance = hasPermission(currentUser, 'finance.read');

    const tick = async () => {
      await refreshLeads();
      if (canSeeFinance) {
        try {
          setCommissionCounts(await getFinanceCounts());
        } catch (e) {
          // counts are cosmetic; the finance screens report their own errors
        }
      }
    };

    const schedule = () => {
      timer = setTimeout(async () => {
        if (!document.hidden) await tick();
        schedule();
      }, LEADS_REFRESH_MS);
    };

    const onVisible = () => {
      if (!document.hidden) tick();
    };

    tick();
    schedule();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [currentUser, refreshLeads]);

  // Compute live counts and stats dynamically from leads array
  const leadCounts = useMemo(() => {
    const fresh = leads.filter(l => normalizeStatus(l.status) === 'FRESH').length;
    const callback = leads.filter(l => normalizeStatus(l.status) === 'CALLBACK').length;
    const interested = leads.filter(l => normalizeStatus(l.status) === 'INTERESTED').length;
    const docsReceived = leads.filter(l => normalizeStatus(l.status) === 'DOCS_RECEIVED').length;
    const approved = leads.filter(l => {
      const s = normalizeStatus(l.status);
      return s === 'APPROVED' || s === 'DISBURSED';
    }).length;
    const rejected = leads.filter(l => normalizeStatus(l.status) === 'REJECTED').length;

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

  // Compute partner-wise counts (by the partner each lead is really assigned to)
  const partnerCounts = useMemo(() => {
    const counts = {};
    AFFILIATE_PARTNERS.forEach(p => {
      counts[p.id] = leads.filter(l => l.assignedPartnerSlug === p.id).length;
    });
    return counts;
  }, [leads]);

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const approvedList = leads.filter(l => {
      const s = normalizeStatus(l.status);
      return s === 'APPROVED' || s === 'DISBURSED';
    });
    const freshList = leads.filter(l => normalizeStatus(l.status) === 'FRESH');
    const callbackList = leads.filter(l => normalizeStatus(l.status) === 'CALLBACK');
    const docsList = leads.filter(l => normalizeStatus(l.status) === 'DOCS_RECEIVED');

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

  // Wait for the server to confirm a stored session before showing anything (avoids a login flash).
  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F4F7FC] text-slate-500 text-sm">Loading…</div>;
  }

  // 🔒 IF NOT LOGGED IN: SHOW FULL-SCREEN LOGIN LOCK SCREEN
  if (!currentUser) {
    return (
      <LoginModal 
        isFullScreen={true}
        isOpen={true}
        onLogin={handleLoginSuccess}
        currentUser={null}
        notice={sessionNotice}
      />
    );
  }

  // Render main content area according to activeTab
  const renderMainContent = () => {
    // 🛡️ STRICT ROLE-BASED ACCESS CONTROL FOR PARTNER USERS
    if (currentUser?.role === 'Partner') {
      if (activeTab === 'profile') {
        return <MyProfileView currentUser={currentUser} onPasswordChanged={handlePasswordChanged} />;
      }
      return (
        <PartnerPortalView 
          currentUser={currentUser} 
          leads={leads} 
          setLeads={setLeads} 
          onRefresh={refreshLeads}
        />
      );
    }

    // Menu hiding is convenience only (the server re-checks every call); a hidden tab falls back to a safe page.
    if (!canViewTab(currentUser, activeTab)) {
      return (
        <div className="crm-card bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-600">
          You do not have permission to view this page.
        </div>
      );
    }

    switch (activeTab) {
      case 'partner-preview':
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
              <span>
                Read-only preview of the <strong>{partnerPreview?.partnerName}</strong> partner portal. Partner actions are
                only available when the partner signs in with their own account.
              </span>
              <button
                onClick={() => { setPartnerPreview(null); setActiveTab('admin-staff'); }}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-bold cursor-pointer"
              >
                Exit preview
              </button>
            </div>
            <PartnerPortalView
              currentUser={{ ...currentUser, role: 'Partner', partnerId: partnerPreview?.partnerId, partnerName: partnerPreview?.partnerName }}
              leads={leads}
              setLeads={setLeads}
              onRefresh={refreshLeads}
              readOnly
            />
          </div>
        );

      case 'partner-leads':
        return (
          <PartnerPortalView 
            currentUser={currentUser} 
            leads={leads} 
            setLeads={setLeads} 
            onRefresh={refreshLeads}
            readOnly
          />
        );

      case 'delivery-logs':
        return (
          <DeliveryLogView />
        );

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
          <PayoutRequestsView onChanged={refreshCommissionCounts} />
        );

      case 'settlements':
        return (
          <SettlementsView onChanged={refreshCommissionCounts} />
        );

      case 'invoices-raised':
        return (
          <InvoicesRaisedView onChanged={refreshCommissionCounts} />
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
          <PipelineView leads={leads} onSwitchToList={() => setActiveTab('all-leads')} />
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
            onPreviewPartner={(account) => {
              setPartnerPreview({ partnerId: account.partnerId, partnerName: account.partnerName });
              setActiveTab('partner-preview');
            }}
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
            onPasswordChanged={handlePasswordChanged}
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
        currentUser={currentUser}
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
            {leadsError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-3">
                <span>Could not load leads from the server: {leadsError}{leadsLoaded ? ' (showing the last loaded data)' : ''}</span>
                <button onClick={refreshLeads} className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 font-bold cursor-pointer">Retry</button>
              </div>
            )}
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

      {/* Temporary password must be replaced before using the CRM */}
      {currentUser.mustChangePassword && (
        <ChangePasswordModal forced onChanged={handlePasswordChanged} />
      )}

      {/* Onboard Partner Modal */}
      <PartnerOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onAddPartner={(newPartner) => {
          setActiveTab(`company-${newPartner.id}`);
        }}
      />

    </div>
  );
}
