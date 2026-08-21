import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import SalesDashboard from './components/SalesDashboard';
import CollectionDashboard from './components/CollectionDashboard';
import LeadsView from './components/LeadsView';
import ApplicationTracker from './components/ApplicationTracker';
import PipelineView from './components/PipelineView';
import DisbursalView from './components/DisbursalView';

import KPISummary from './components/KPISummary';
import ReloanOpportunities from './components/ReloanOpportunities';
import ReportsView from './components/ReportsView';
import LoansView from './components/LoansView';
import CollectionsView from './components/CollectionsView';
import NotificationsView from './components/NotificationsView';
import StaffView from './components/StaffView';
import AuditLogView from './components/AuditLogView';
import MyProfileView from './components/MyProfileView';





// Clean slate initial leads array (Zero state for go-live)
const INITIAL_LEADS = [];

export default function App() {
  const [activeTab, setActiveTab] = useState('executive');
  const [activeFilter, setActiveFilter] = useState('all-leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [leads, setLeads] = useState(INITIAL_LEADS);

  // Compute live counts and stats dynamically from leads array
  const leadCounts = useMemo(() => {
    const fresh = leads.filter(l => l.status === 'Fresh').length;
    const callback = leads.filter(l => l.status === 'Callback').length;
    const docsReceived = leads.filter(l => l.status === 'Docs received').length;
    const approved = leads.filter(l => l.status === 'Approved').length;
    const rejected = leads.filter(l => l.status === 'Rejected').length;
    const disbursed = leads.filter(l => l.status === 'Disbursed').length;

    return {
      total: leads.length,
      fresh,
      callback,
      docsReceived,
      approved,
      rejected,
      disbursed
    };
  }, [leads]);

  // Dashboard Stats calculation
  const stats = useMemo(() => {
    const disbursedList = leads.filter(l => l.status === 'Disbursed');
    const approvedList = leads.filter(l => l.status === 'Approved');
    const freshList = leads.filter(l => l.status === 'Fresh');
    const callbackList = leads.filter(l => l.status === 'Callback');
    const docsList = leads.filter(l => l.status === 'Docs received');

    const disbursedAmount = disbursedList.reduce((sum, item) => sum + item.loanAmount, 0);

    return {
      totalLeads: leads.length,
      freshCount: freshList.length,
      callbackCount: callbackList.length,
      docsCount: docsList.length,
      approvedCount: approvedList.length,
      disbursedCount: disbursedList.length,
      repayingCount: 0,
      disbursedAmount,
      collectedAmount: 0,
      outstandingAmount: 0,
      dueTodayAmount: 0,
      overdueAmount: 0,
      overdueCount: 0,
      conversionRate: leads.length > 0 ? ((disbursedList.length / leads.length) * 100).toFixed(0) : 0,
      activeLoans: disbursedList.length,
      closedLoans: 0,
      portalLeads: leads.filter(l => l.source === 'portal').length
    };
  }, [leads]);

  // Render main content area according to activeTab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'executive':
        return (
          <ExecutiveDashboard 
            stats={stats} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
          />
        );
      case 'sales':
        return (
          <SalesDashboard 
            stats={stats} 
          />
        );
      case 'collections':
        return (
          <CollectionDashboard 
            stats={stats} 
          />
        );
      case 'kpi':
        return (
          <KPISummary 
            stats={stats} 
          />
        );
      case 'reloan':
        return (
          <ReloanOpportunities />
        );
      case 'reports':
        return (
          <ReportsView 
            stats={stats} 
          />
        );

      case 'all-leads':
      case 'fresh':
      case 'callback':
      case 'no-answer':
      case 'interested':
      case 'not-interested':
      case 'docs-received':
      case 'incomplete-docs':
      case 'approved':
      case 'ready-to-disburse':
      case 'lead-disbursed':
      case 'rejected':
      case 'dead-leads':
        return (
          <LeadsView 
            leads={leads} 
            setLeads={setLeads} 
            activeFilterTab={activeTab} 
            setActiveFilterTab={setActiveTab} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
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

      case 'ready-disburse':
        return (
          <DisbursalView 
            leads={leads} 
            type="ready" 
          />
        );
      case 'disbursed':
        return (
          <DisbursalView 
            leads={leads} 
            type="disbursed" 
          />
        );
      case 'loans-active':
      case 'loans-overdue':
      case 'loans-part':
      case 'loans-settlement':
      case 'loans-closed':
      case 'loans-preclosed':
      case 'loans-all':
        return (
          <LoansView type={activeTab} />
        );
      case 'collections-workspace':
      case 'collections-followups':
      case 'collections-queue':
        return (
          <CollectionsView type={activeTab} />
        );
      case 'notifications-send':
        return (
          <NotificationsView />
        );
      case 'admin-staff':
        return (
          <StaffView />
        );
      case 'admin-audit':
        return (
          <AuditLogView />
        );
      case 'profile':
        return (
          <MyProfileView />
        );




      default:
        return (
          <ExecutiveDashboard 
            stats={stats} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
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
        />


        {/* Page Content View - Full Width Layout */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full">
            {renderMainContent()}
          </div>
        </main>


      </div>

    </div>
  );
}
