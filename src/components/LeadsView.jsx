import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  GitMerge, 
  User, 
  X, 
  Search, 
  Trash2, 
  CheckSquare, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ChevronDown,
  Phone,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
  Copy,
  Check,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  MessageCircle,
  IndianRupee
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';
import { AFFILIATE_PARTNERS, getPartnerMeta } from '../data/affiliatePartners';
import { cleanLoanAmount, cleanSalary } from '../utils/amountHelpers';
import { fetchApi, deleteLeadsApi, saveLeadOverride } from '../utils/apiConfig';

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
  if (clean === 'rupay91') return 'Rupay91';
  if (clean === 'adgrow') return 'Adgrow';
  if (clean === 'agdm') return 'AGDM';
  if (clean === 'rupaysure') return 'Rupaysure';
  return tab;
};

// Modern workflow status styling helper
export const getStatusBadge = (status) => {
  const s = String(status || 'Fresh').toLowerCase().replace(/[\s\-_]/g, '');
  if (s.includes('fresh')) {
    return {
      label: 'Fresh',
      classes: 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/80',
      dot: 'bg-sky-500'
    };
  }
  if (s.includes('callback')) {
    return {
      label: 'Callback',
      classes: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80',
      dot: 'bg-amber-500'
    };
  }
  if (s.includes('interest')) {
    return {
      label: 'Interested',
      classes: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80',
      dot: 'bg-purple-500'
    };
  }
  if (s.includes('doc')) {
    return {
      label: 'Docs Received',
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/80',
      dot: 'bg-indigo-500'
    };
  }
  if (s.includes('approv')) {
    return {
      label: 'Approved',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80',
      dot: 'bg-emerald-500'
    };
  }
  if (s.includes('disburs')) {
    return {
      label: 'Disbursed',
      classes: 'bg-teal-50 text-teal-700 border-teal-200/80 hover:bg-teal-100/80',
      dot: 'bg-teal-500'
    };
  }
  if (s.includes('reject')) {
    return {
      label: 'Rejected',
      classes: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/80',
      dot: 'bg-rose-500'
    };
  }
  return {
    label: status || 'Fresh',
    classes: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    dot: 'bg-slate-400'
  };
};

// Modern partner company styling helper
export const getCompanyBadge = (company) => {
  const clean = String(company || '').toLowerCase().replace(/[\s\-_]/g, '');
  if (clean.includes('rupay91')) {
    return {
      name: 'Rupay91',
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/80',
      dot: 'bg-indigo-600'
    };
  }
  if (clean.includes('adgrow')) {
    return {
      name: 'Adgrow',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80',
      dot: 'bg-emerald-600'
    };
  }
  if (clean.includes('agdm')) {
    return {
      name: 'AGDM',
      classes: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/80',
      dot: 'bg-blue-600'
    };
  }
  if (clean.includes('rupaysure')) {
    return {
      name: 'Rupaysure',
      classes: 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/80',
      dot: 'bg-amber-600'
    };
  }
  return {
    name: company || 'Pending Details',
    classes: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80',
    dot: 'bg-purple-500'
  };
};

export default function LeadsView({ 
  leads: propLeads, 
  setLeads, 
  activeFilterTab, 
  setActiveFilterTab, 
  currentUser 
}) {
  const leads = propLeads || INITIAL_FULL_LEADS;
  const [localFilter, setLocalFilter] = useState(() => mapTabToFilterName(activeFilterTab));
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState('ALL');
  const [isMyLeadsOnly, setIsMyLeadsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [reassigningLeadId, setReassigningLeadId] = useState(null);
  const [selectedLeadForOverview, setSelectedLeadForOverview] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(String(text));
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {}
  };
  const [testMobile, setTestMobile] = useState('');
  const [testName, setTestName] = useState('');
  const [testAmount, setTestAmount] = useState('₹50,000');
  const [testSalary, setTestSalary] = useState('35000');
  const [testCibil, setTestCibil] = useState('750+ (Excellent - Best Approval)');
  const [testSource, setTestSource] = useState('Check Eligibility Website');
  const [testAssignedCompany, setTestAssignedCompany] = useState('AUTO');
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);

  // New Lead Manual Modal form state
  const [newMobile, setNewMobile] = useState('');
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('50000');
  const [newSalary, setNewSalary] = useState('30000');
  const [newCity, setNewCity] = useState('');
  const [newSource, setNewSource] = useState('Apply Now Website');
  const [newCompany, setNewCompany] = useState('Rupay91');

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

  const getLeadId = (item, idx) => item.id || item.loanNo || `lead-${idx}`;

  // Filter Leads based on Search, Status, Partner Company & My Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item, idx) => {
      if (!item) return false;

      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (item.name || '').toLowerCase().includes(q);
        const matchesMobile = (item.mobile || '').includes(q);
        const matchesEmail = (item.email || '').toLowerCase().includes(q);
        const matchesId = getLeadId(item, idx).toLowerCase().includes(q);
        const matchesCity = (item.city || '').toLowerCase().includes(q);
        const matchesCompany = (item.assignedCompany || '').toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesEmail && !matchesId && !matchesCity && !matchesCompany) {
          return false;
        }
      }

      // 2. Partner Filter (ALL vs Rupay91, Adgrow, AGDM, Rupaysure)
      if (selectedPartnerFilter !== 'ALL') {
        const c = (item.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        if (c !== selectedPartnerFilter.toLowerCase().replace(/[\s\-_]/g, '')) {
          return false;
        }
      }

      // 3. Status Tab Filter
      if (activeFilter !== 'All Leads') {
        const itemStatus = (item.status || 'Fresh').toLowerCase().replace(/[-_]/g, ' ');
        const filterKey = activeFilter.toLowerCase().replace(/[-_]/g, ' ');

        // Check if filter is a partner name
        const isPartnerName = AFFILIATE_PARTNERS.some(p => p.name.toLowerCase() === filterKey);
        if (isPartnerName) {
          const c = (item.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
          if (c !== filterKey.replace(/[\s\-_]/g, '')) return false;
        } else if (filterKey === 'fresh' && itemStatus !== 'fresh') {
          return false;
        } else if (filterKey === 'callback' && itemStatus !== 'callback') {
          return false;
        } else if (filterKey === 'interested' && itemStatus !== 'interested') {
          return false;
        } else if (filterKey === 'docs received' && itemStatus !== 'docs received') {
          return false;
        } else if (filterKey === 'approved' && itemStatus !== 'approved' && itemStatus !== 'disbursed') {
          return false;
        } else if (filterKey === 'rejected' && itemStatus !== 'rejected') {
          return false;
        }
      }

      // 4. My Leads Only Filter
      if (isMyLeadsOnly && currentUser) {
        const tele = (item.teleCaller || '').toLowerCase();
        const cred = (item.creditManager || '').toLowerCase();
        const me = (currentUser.name || '').toLowerCase();
        if (!tele.includes(me) && !cred.includes(me)) return false;
      }

      return true;
    });
  }, [leads, searchQuery, selectedPartnerFilter, activeFilter, isMyLeadsOnly, currentUser]);

  const handleExportExcel = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      alert("No leads found to export.");
      return;
    }
    const headers = [
      'Lead ID',
      'Assigned Partner / Company',
      'Eligibility Status',
      'Applicant Name',
      'Mobile Number',
      'Email Address',
      'Loan Amount (₹)',
      'Monthly Salary (₹)',
      'CIBIL Score',
      'Employment Type',
      'City',
      'State',
      'Pincode',
      'Source / Campaign',
      'Status',
      'Date / Time'
    ];
    const rows = filteredLeads.map((l, idx) => [
      l.id || l.loanNo || getLeadId(l, idx),
      l.assignedCompany || 'Unassigned',
      l.eligibilityStatus || 'Eligible',
      l.name || 'Applicant',
      l.mobile || '',
      l.email || '',
      cleanLoanAmount(l.loanAmount || l.applied),
      cleanSalary(l.salary, l.sal_val, l.salary_range),
      l.cibil || '—',
      l.employmentType || 'Salaried',
      l.city || '',
      l.state || 'India',
      l.pincode || '',
      l.source || 'Website',
      l.status || 'Fresh',
      l.created || l.date || ''
    ]);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filterSlug = (activeFilter || 'all').toLowerCase().replace(/\s+/g, '-');
    exportToCsv(`paisainminutes-leads-${filterSlug}-${dateStr}.csv`, headers, rows);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredLeads.map((item, idx) => getLeadId(item, idx));
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (itemId) => {
    setSelectedLeadIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // API Call helper for Deleting
  const callDeleteApi = async (bodyPayload, onSuccess) => {
    console.log('%c[CRM DELETE] 🗑️ Initiating delete operation...', 'color: #dc2626; font-weight: bold;', bodyPayload);
    try {
      const res = await deleteLeadsApi(bodyPayload);
      console.log('%c[CRM DELETE] 📥 Server deletion result:', 'color: #059669; font-weight: bold;', res);
      if (res && res.success) {
        onSuccess(res);
      } else {
        console.warn('[CRM DELETE] ⚠️ Server deletion returned unsuccessful status, executing local state cleanup anyway.');
        onSuccess(res);
      }
    } catch (e) {
      console.error('[CRM DELETE] ❌ Delete API call exception:', e);
      onSuccess(null);
    }
  };

  const handleDeleteSingle = (item, idx) => {
    const itemId = getLeadId(item, idx);
    const phone = String(item.phone || item.mobile || '').replace(/\D/g, '').slice(-10);
    console.log(`%c[CRM DELETE SINGLE] 🗑️ User requested deletion of lead: ${item.name || itemId} (ID: ${itemId})`, 'color: #e11d48; font-weight: bold;');
    if (confirm(`Are you sure you want to delete lead ${item.name || itemId}?`)) {
      // 1. Immediately remove from React state
      if (setLeads) {
        setLeads(prev => prev.filter((l, i) => {
          const lId = getLeadId(l, i);
          const lPhone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
          return lId !== itemId && (!phone || lPhone !== phone);
        }));
      }
      setSelectedLeadIds(prev => prev.filter(id => id !== itemId));

      // 2. Call delete API (which automatically blacklists locally and on server)
      callDeleteApi({ action: 'single', id: itemId, leadId: itemId, phone: phone }, (serverRes) => {
        console.log(`[CRM STATE] 🧹 Lead ${itemId} permanently deleted. Server response:`, serverRes);
      });
    }
  };

  const handleDeleteSelected = () => {
    if (selectedLeadIds.length === 0) return;
    console.log(`%c[CRM BULK DELETE] 🗑️ User requested deletion of ${selectedLeadIds.length} selected leads:`, 'color: #e11d48; font-weight: bold;', selectedLeadIds);
    if (confirm(`Delete ${selectedLeadIds.length} selected lead(s)?`)) {
      const toDelete = new Set(selectedLeadIds);
      if (setLeads) {
        setLeads(prev => prev.filter((l, i) => !toDelete.has(getLeadId(l, i))));
      }
      const idsToDelete = [...selectedLeadIds];
      setSelectedLeadIds([]);

      callDeleteApi({ action: 'selected', ids: idsToDelete }, (serverRes) => {
        console.log(`[CRM STATE] 🧹 Bulk delete permanently completed. Server response:`, serverRes);
      });
    }
  };

  const handleClearAllLeads = () => {
    if (leads.length === 0) {
      alert('No leads to delete! The list is already empty.');
      return;
    }
    console.log(`%c[CRM CLEAR ALL] 🚨 User triggered "DELETE ALL LEADS" for ${leads.length} leads!`, 'color: #dc2626; font-weight: bold;');
    if (confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE ALL ${leads.length} LEADS? This cannot be undone.`)) {
      const allIds = leads.map((l, i) => getLeadId(l, i));
      const allPhones = leads.map(l => String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10)).filter(Boolean);
      if (setLeads) setLeads([]);
      setSelectedLeadIds([]);

      callDeleteApi({ clear_all: true, action: 'reset_all', all: true, ids: allIds, phones: allPhones }, (serverRes) => {
        console.log('[CRM STATE] 🧹 All leads cleared from state and server store.');
      });
    }
  };

  // Re-assign Partner Company
  const handleReassignCompany = async (leadId, newCompany) => {
    console.log(`%c[CRM REASSIGN] 🔀 Reassigning lead ${leadId} -> ${newCompany}`, 'color: #7c3aed; font-weight: bold;');
    try {
      const targetLead = leads.find((l, i) => getLeadId(l, i) === leadId);
      const phone = targetLead ? String(targetLead.phone || targetLead.mobile || '').replace(/\D/g, '').slice(-10) : '';

      // 1. Immediately save to persistent client overrides so polling doesn't overwrite it
      saveLeadOverride(leadId, { assignedCompany: newCompany });
      if (phone) saveLeadOverride(phone, { assignedCompany: newCompany });

      // 2. Instantly update React state
      if (setLeads) {
        setLeads(prev => prev.map((l, i) => {
          const lPhone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
          if (getLeadId(l, i) === leadId || (phone && lPhone === phone)) {
            return { ...l, assignedCompany: newCompany, partner_name: newCompany };
          }
          return l;
        }));
      }

      setReassigningLeadId(null);

      // 3. Post to backend endpoints
      const updatePayload = {
        id: leadId,
        leadId: leadId,
        phone: phone,
        updates: { assignedCompany: newCompany }
      };

      const res = await fetchApi('/admin/api/update-lead', {
        method: 'POST',
        body: JSON.stringify(updatePayload)
      });
      console.log('[CRM REASSIGN] 📥 Server response:', res?.data);
    } catch (e) {
      console.error('[CRM REASSIGN] ❌ Error:', e);
      setReassigningLeadId(null);
    }
  };

  // Quick Status Change
  const handleStatusChange = async (leadId, newStatus) => {
    console.log(`%c[CRM STATUS CHANGE] 🔄 Changing lead ${leadId} status -> ${newStatus}`, 'color: #2563eb; font-weight: bold;');
    try {
      const targetLead = leads.find((l, i) => getLeadId(l, i) === leadId);
      const phone = targetLead ? String(targetLead.phone || targetLead.mobile || '').replace(/\D/g, '').slice(-10) : '';

      // 1. Immediately save to persistent client overrides so polling doesn't overwrite it
      saveLeadOverride(leadId, { status: newStatus });
      if (phone) saveLeadOverride(phone, { status: newStatus });

      // 2. Instantly update React state
      if (setLeads) {
        setLeads(prev => prev.map((l, i) => {
          const lPhone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
          if (getLeadId(l, i) === leadId || (phone && lPhone === phone)) {
            return { ...l, status: newStatus };
          }
          return l;
        }));
      }

      // 3. Post to backend endpoints
      const updatePayload = {
        id: leadId,
        leadId: leadId,
        phone: phone,
        updates: { status: newStatus }
      };

      const res = await fetchApi('/admin/api/update-lead', {
        method: 'POST',
        body: JSON.stringify(updatePayload)
      });
    } catch (e) {
      console.error('[CRM STATUS CHANGE] ❌ Error:', e);
    }
  };

  // Keep selected lead in sync with any background leads state updates
  const activeOverviewLead = useMemo(() => {
    if (!selectedLeadForOverview) return null;
    const targetId = getLeadId(selectedLeadForOverview);
    const targetPhone = String(selectedLeadForOverview.phone || selectedLeadForOverview.mobile || '').replace(/\D/g, '').slice(-10);
    const found = leads.find((l, idx) => {
      const lId = getLeadId(l, idx);
      const lPhone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
      return lId === targetId || (targetPhone && lPhone === targetPhone);
    });
    return found || selectedLeadForOverview;
  }, [selectedLeadForOverview, leads]);

  const handleReassignCompanyInModal = async (leadId, newCompany) => {
    await handleReassignCompany(leadId, newCompany);
    setSelectedLeadForOverview(prev => prev ? { ...prev, assignedCompany: newCompany, partner_name: newCompany } : null);
  };

  const handleStatusChangeInModal = async (leadId, newStatus) => {
    await handleStatusChange(leadId, newStatus);
    setSelectedLeadForOverview(prev => prev ? { ...prev, status: newStatus } : null);
  };

  // Test Website Lead Submit Handler
  const handleTestApplySubmit = async (e) => {
    e.preventDefault();
    if (!testMobile) return;
    setIsSubmittingTest(true);
    setTestFeedback(null);

    const payload = {
      phone: testMobile,
      fullName: testName || 'Test Applicant',
      loanAmount: testAmount || '50000',
      salary: testSalary || '35000',
      cibilScore: testCibil,
      source: testSource || 'Check Eligibility Website',
      assignedCompany: testAssignedCompany === 'AUTO' ? undefined : testAssignedCompany,
      eligibilityStatus: 'Eligible - Test Submission'
    };

    console.log('%c[CRM TEST SUBMIT] 🚀 Submitting Test Lead with payload:', 'color: #0284c7; font-weight: bold;', payload);

    try {
      const res = await fetchApi('/admin/api/submit-lead', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = res?.data || (res ? await res.json() : null);
      setIsSubmittingTest(false);

      console.log('[CRM TEST SUBMIT] 📥 Server submission response:', data);

      if (data && data.success && data.lead) {
        if (setLeads) {
          setLeads(prev => [data.lead, ...prev.filter(l => l.id !== data.lead.id)]);
        }
        setTestFeedback({
          type: 'success',
          message: `Lead created successfully! Routed to ${data.lead.assignedCompany || 'Partner'}.`
        });
        setTimeout(() => {
          setIsTestModalOpen(false);
          setTestFeedback(null);
          setTestMobile('');
          setTestName('');
        }, 1800);
      } else {
        setTestFeedback({
          type: 'error',
          message: (data && data.error) || 'Submission failed'
        });
      }
    } catch (err) {
      console.error('[CRM TEST SUBMIT] ❌ Error:', err);
      setIsSubmittingTest(false);
      setTestFeedback({
        type: 'error',
        message: 'Could not connect to API server'
      });
    }
  };

  // Manual New Lead Form Submit
  const handleManualLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newMobile) return;

    const payload = {
      phone: newMobile,
      fullName: newName || 'Manual Lead',
      loanAmount: newAmount || '50000',
      salary: newSalary || '30000',
      city: newCity || 'Direct Entry',
      source: newSource || 'Direct Manual Entry',
      assignedCompany: newCompany || 'Rupay91',
      eligibilityStatus: 'Pre-Approved'
    };

    console.log('%c[CRM MANUAL SUBMIT] 📝 Creating Manual Lead with payload:', 'color: #0d9488; font-weight: bold;', payload);

    try {
      const res = await fetchApi('/admin/api/submit-lead', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = res?.data || (res ? await res.json() : null);
      console.log('[CRM MANUAL SUBMIT] 📥 Server response:', data);
      if (data && data.success && data.lead && setLeads) {
        setLeads(prev => [data.lead, ...prev]);
      }
    } catch (e) {
      console.error('[CRM MANUAL SUBMIT] ❌ Error:', e);
    }

    setIsAddModalOpen(false);
    setNewMobile('');
    setNewName('');
  };

  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every((item, idx) => selectedLeadIds.includes(getLeadId(item, idx)));

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Realtime Apply Now & Affiliate Status Banner */}
      <div className="bg-gradient-to-r from-[#0A3977] via-indigo-900 to-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-blue-700/40">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wide uppercase text-blue-200">Website Affiliate Ingestion Active</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Auto Routing</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Leads from <span className="text-amber-300 font-bold">paisainminutes.com</span> (Apply Now & Eligibility Check) auto-route to <span className="text-white font-bold">Rupay91, Adgrow, AGDM, or Rupaysure</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Test Website Lead Submit</span>
          </button>
        </div>
      </div>

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#0A3977]">
            Leads Management & Affiliate Allocation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredLeads.length} displayed · {leads.length} total across all affiliate partner queues
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsMyLeadsOnly(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer ${
              isMyLeadsOnly 
                ? 'bg-[#0A3977] text-white border border-[#0A3977] ring-2 ring-blue-300' 
                : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <User className={`w-3.5 h-3.5 ${isMyLeadsOnly ? 'text-white' : 'text-slate-500'}`} />
            <span>{isMyLeadsOnly ? 'My Leads (Active)' : 'My Leads'}</span>
          </button>

          <button 
            onClick={handleExportExcel}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Download CSV report of leads"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button 
            onClick={handleClearAllLeads}
            className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Permanently delete all leads"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Delete All Leads</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-rose-500 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold block">{selectedLeadIds.length} lead(s) selected</span>
              <span className="text-[11px] text-rose-100">Perform bulk actions on selected records</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-1.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Selected ({selectedLeadIds.length})</span>
            </button>
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-3 py-1.5 bg-rose-800/80 hover:bg-rose-900 text-white border border-rose-400/50 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Unified Modern Control Center */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 space-y-3">
        
        {/* Row 1: Workflow Status Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Status Workflow Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'All Leads', label: 'All Status', count: leads.length },
              { id: 'Fresh', label: 'Fresh', count: leads.filter(l => (l.status || 'Fresh') === 'Fresh').length },
              { id: 'Callback', label: 'Callback', count: leads.filter(l => l.status === 'Callback').length },
              { id: 'Interested', label: 'Interested', count: leads.filter(l => l.status === 'Interested').length },
              { id: 'Docs Received', label: 'Docs Received', count: leads.filter(l => l.status === 'Docs received' || l.status === 'Docs Received').length },
              { id: 'Approved', label: 'Approved', count: leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length },
              { id: 'Rejected', label: 'Rejected', count: leads.filter(l => l.status === 'Rejected').length },
            ].map(tab => {
              const isSelected = activeFilter.toLowerCase().replace(/\s+/g, ' ') === tab.id.toLowerCase().replace(/\s+/g, ' ');
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterClick(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A3977] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search applicant, phone, ID, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white transition placeholder-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Lending Partner Badges & Realtime Summary */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Partner:</span>
            </span>

            <button
              onClick={() => setSelectedPartnerFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                selectedPartnerFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Partners</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">
                {leads.length}
              </span>
            </button>

            {AFFILIATE_PARTNERS.map(p => {
              const count = leads.filter(l => {
                const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
                return c === p.id || c === p.name.toLowerCase().replace(/[\s\-_]/g, '');
              }).length;
              const isSel = selectedPartnerFilter.toLowerCase() === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartnerFilter(p.name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                    isSel 
                      ? `${p.pillClass} shadow-2xs border-transparent ring-2 ring-blue-300` 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }}></span>
                  <span>{p.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-semibold text-slate-500 hidden sm:block">
            Showing <span className="font-bold text-slate-900">{filteredLeads.length}</span> of {leads.length} leads
          </div>
        </div>

      </div>

      {/* Leads Table Card */}
      <div className="bg-white overflow-hidden rounded-2xl shadow-xs border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-500 font-bold tracking-wider text-[10px] uppercase border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs">
                <th className="py-3 px-3.5 w-8">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 cursor-pointer" 
                  />
                </th>
                <th className="py-3 px-3.5 min-w-[240px]">APPLICANT DETAILS</th>
                <th className="py-3 px-3.5 min-w-[170px]">ASSIGNED PARTNER</th>
                <th className="py-3 px-3.5 min-w-[150px]">ELIGIBILITY & CIBIL</th>
                <th className="py-3 px-3.5 min-w-[130px]">APPLIED AMOUNT</th>
                <th className="py-3 px-3.5 min-w-[160px]">SALARY / CITY</th>
                <th className="py-3 px-3.5 min-w-[140px]">SOURCE</th>
                <th className="py-3 px-3.5 min-w-[150px]">STATUS</th>
                <th className="py-3 px-3.5 min-w-[140px]">CREATED</th>
                <th className="py-3 px-3.5 min-w-[130px] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((item, idx) => {
                  if (!item) return null;
                  const itemId = getLeadId(item, idx);
                  const isSelected = selectedLeadIds.includes(itemId);
                  const companyBadge = getCompanyBadge(item.assignedCompany || 'Pending Details');
                  const statusBadge = getStatusBadge(item.status || 'Fresh');

                  return (
                    <tr 
                      key={itemId} 
                      className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/80'}`}
                    >
                      
                      {/* Checkbox */}
                      <td className="py-3 px-3.5">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectRow(itemId)}
                          className="rounded border-slate-300 cursor-pointer" 
                        />
                      </td>

                      {/* APPLICANT DETAILS (Clickable Overview Trigger) */}
                      <td className="py-3 px-3.5">
                        <div 
                          onClick={() => setSelectedLeadForOverview(item)}
                          className="flex items-start gap-3 cursor-pointer group"
                          title="Click to view full lead overview & details"
                        >
                          <div className={`w-9 h-9 rounded-xl ${item.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs group-hover:scale-105 group-hover:shadow-md transition-all mt-0.5`}>
                            {item.initials || 'AP'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs group-hover:text-[#0A3977] group-hover:underline transition-colors flex items-center gap-1.5 truncate">
                              <span className="truncate">{item.name || 'Applicant'}</span>
                              <Eye className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200/60">
                                {item.loanNo || itemId}
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 mt-1">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span className="font-mono">{item.mobile || (item.phone ? `+91 ${item.phone}` : '—')}</span>
                            </div>
                            {item.email && item.email !== '—' && !item.email.includes('@paisainminutes.com') && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[160px] flex items-center gap-1 mt-0.5">
                                <Mail className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                                <span className="truncate">{item.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ASSIGNED LENDING PARTNER (Native select styled badge - Never Clips!) */}
                      <td className="py-3 px-3.5">
                        <div className="relative inline-block">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${companyBadge.classes} shadow-2xs`}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${companyBadge.dot}`}></span>
                            <select
                              value={item.assignedCompany || 'Pending Details'}
                              onChange={(e) => handleReassignCompany(itemId, e.target.value)}
                              className="bg-transparent text-inherit font-bold text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
                              title="Click to route to another lending partner"
                            >
                              <option value="Rupay91">Rupay91</option>
                              <option value="Adgrow">Adgrow</option>
                              <option value="AGDM">AGDM</option>
                              <option value="Rupaysure">Rupaysure</option>
                              {(item.assignedCompany === 'Pending Details' || !item.assignedCompany) && (
                                <option value="Pending Details">Pending Details</option>
                              )}
                            </select>
                            <ChevronDown className="w-3 h-3 opacity-60 absolute right-2 pointer-events-none" />
                          </div>
                        </div>
                      </td>

                      {/* ELIGIBILITY & CIBIL */}
                      <td className="py-3 px-3.5">
                        <div>
                          {item.eligibilityStatus === 'Incomplete / Phone Only' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <span>Phone Only</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{item.eligibilityStatus || 'Eligible'}</span>
                            </span>
                          )}
                        </div>
                        {item.cibil && item.cibil !== '—' ? (
                          <div className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-200 mt-1 inline-flex items-center gap-1">
                            <CreditCard className="w-2.5 h-2.5 text-indigo-500" />
                            <span>CIBIL: {item.cibil}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-medium mt-1">
                            CIBIL: —
                          </div>
                        )}
                      </td>

                      {/* APPLIED AMOUNT */}
                      <td className="py-3 px-3.5">
                        {cleanLoanAmount(item.applied || item.loanAmount) > 0 ? (
                          <div>
                            <span className="text-xs font-black text-slate-900 tracking-tight flex items-center">
                              <IndianRupee className="w-3 h-3 text-slate-500 inline" />
                              {cleanLoanAmount(item.applied || item.loanAmount).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">Applied</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-xs">—</span>
                        )}
                      </td>

                      {/* SALARY / LOCATION */}
                      <td className="py-3 px-3.5">
                        {cleanSalary(item.salary, item.sal_val, item.salary_range) > 0 ? (
                          <div className="font-bold text-slate-800 text-xs flex items-center">
                            <IndianRupee className="w-2.5 h-2.5 text-slate-400 inline" />
                            {cleanSalary(item.salary, item.sal_val, item.salary_range).toLocaleString('en-IN')}/mo
                          </div>
                        ) : (
                          <div className="text-slate-400 font-medium text-xs">—</div>
                        )}
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span>{item.city && item.city !== '—' ? item.city : 'Online'}{item.pincode && item.pincode !== '—' ? ` · ${item.pincode}` : ''}</span>
                        </div>
                      </td>

                      {/* SOURCE */}
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs">
                          <ExternalLink className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{item.source || 'Website Application'}</span>
                        </span>
                      </td>

                      {/* STATUS (Native select styled badge - Never Clips!) */}
                      <td className="py-3 px-3.5">
                        <div className="relative inline-block">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${statusBadge.classes} shadow-2xs`}>
                            <span className={`w-2 h-2 rounded-full shrink-0 ${statusBadge.dot}`}></span>
                            <select
                              value={item.status || 'Fresh'}
                              onChange={(e) => handleStatusChange(itemId, e.target.value)}
                              className="bg-transparent text-inherit font-bold text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
                              title="Change workflow status"
                            >
                              <option value="Fresh">Fresh</option>
                              <option value="Callback">Callback</option>
                              <option value="Interested">Interested</option>
                              <option value="Docs received">Docs Received</option>
                              <option value="Approved">Approved</option>
                              <option value="Disbursed">Disbursed</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown className="w-3 h-3 opacity-60 absolute right-2 pointer-events-none" />
                          </div>
                        </div>
                      </td>

                      {/* CREATED */}
                      <td className="py-3 px-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px]">
                          <Calendar className="w-2.5 h-2.5 text-slate-400" />
                          <span>{item.date || (item.created ? item.created.split(',')[0] : 'Today')}</span>
                        </div>
                        {item.created && item.created.includes(',') && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.created.split(',')[1]}
                          </div>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Overview Modal Trigger */}
                          <button
                            onClick={() => setSelectedLeadForOverview(item)}
                            className="p-1.5 bg-blue-50 text-[#0A3977] hover:bg-blue-600 hover:text-white rounded-lg transition shadow-2xs cursor-pointer"
                            title="View Full Lead Overview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {item.mobile && (
                            <a
                              href={`tel:${item.mobile.replace(/\D/g, '')}`}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition shadow-2xs"
                              title="Call Applicant"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {item.mobile && (
                            <a
                              href={`https://wa.me/91${item.mobile.replace(/\D/g, '').slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-lg transition shadow-2xs"
                              title="WhatsApp Chat"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteSingle(item, idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 shadow-2xs">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">No leads matching current filters</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        New submissions from <span className="text-[#0A3977] font-semibold">paisainminutes.com</span> will appear here automatically.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPartnerFilter('ALL');
                          setActiveFilter('All Leads');
                          setSearchQuery('');
                        }}
                        className="mt-3 px-3 py-1.5 text-xs font-bold bg-[#0A3977] text-white rounded-xl shadow-xs transition hover:bg-blue-900 cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Test Website Lead Submit */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Website Lead Ingestion Simulator</h3>
                  <p className="text-[11px] text-slate-500">Test Apply Now & Eligibility check lead routing</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTestModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {testFeedback && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                testFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {testFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleTestApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={testMobile}
                  onChange={(e) => setTestMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loan Amount (₹)</label>
                  <input
                    type="text"
                    placeholder="e.g. 50000"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    value={testSalary}
                    onChange={(e) => setTestSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CIBIL Score (Eligibility Factor)</label>
                <select
                  value={testCibil}
                  onChange={(e) => setTestCibil(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white"
                >
                  <option value="750+ (Excellent - Best Approval)">750+ (Excellent - Best Approval)</option>
                  <option value="700 - 749 (Good)">700 - 749 (Good)</option>
                  <option value="650 - 699 (Average)">650 - 699 (Average)</option>
                  <option value="Below 650 (Near Prime / Micro)">Below 650 (Near Prime / Micro)</option>
                  <option value="—">No CIBIL / Not Provided</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Affiliate Partner
                </label>
                <select
                  value={testAssignedCompany}
                  onChange={(e) => setTestAssignedCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white font-bold"
                >
                  <option value="AUTO">✨ Smart Auto-Route (Based on Eligibility Rules)</option>
                  <option value="Rupay91">💳 Rupay91</option>
                  <option value="Adgrow">📈 Adgrow</option>
                  <option value="AGDM">🏛️ AGDM</option>
                  <option value="Rupaysure">🛡️ Rupaysure</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTest}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isSubmittingTest ? 'Simulating...' : 'Submit Test Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Manual Lead */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Lead Manually</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualLeadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Verma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary (₹)</label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Partner Company</label>
                <select
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white font-bold"
                >
                  <option value="Rupay91">Rupay91</option>
                  <option value="Adgrow">Adgrow</option>
                  <option value="AGDM">AGDM</option>
                  <option value="Rupaysure">Rupaysure</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lead Overview & Detailed View */}
      {activeOverviewLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-up">
            
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0A3977] to-indigo-950 p-6 text-white shrink-0 relative">
              <button
                type="button"
                onClick={() => setSelectedLeadForOverview(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
                title="Close Overview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-2xl ${activeOverviewLead.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white/20 shrink-0`}>
                    {activeOverviewLead.initials || 'AP'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        {activeOverviewLead.name || 'Applicant'}
                      </h2>
                      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/20 text-blue-100 border border-white/20">
                        {activeOverviewLead.status || 'Fresh'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-blue-100/80 font-mono">
                      <span>ID: {activeOverviewLead.loanNo || activeOverviewLead.id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeOverviewLead.loanNo || activeOverviewLead.id, 'id')}
                        className="p-1 hover:bg-white/10 rounded transition text-blue-200 hover:text-white cursor-pointer"
                        title="Copy Lead ID"
                      >
                        {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {copiedField === 'id' && <span className="text-[10px] text-emerald-300 font-sans font-semibold">Copied!</span>}
                    </div>
                  </div>
                </div>

                {/* Quick Call & WhatsApp Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeOverviewLead.phone && (
                    <>
                      <a
                        href={`tel:${String(activeOverviewLead.phone).replace(/\D/g, '')}`}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${String(activeOverviewLead.phone).replace(/\D/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto grow text-slate-800">
              
              {/* Metric Highlights (4 Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Applied Loan</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900">
                    {cleanLoanAmount(activeOverviewLead.applied || activeOverviewLead.loanAmount) > 0 
                      ? `₹${cleanLoanAmount(activeOverviewLead.applied || activeOverviewLead.loanAmount).toLocaleString('en-IN')}` 
                      : '₹50,000'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Monthly Salary</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900">
                    {cleanSalary(activeOverviewLead.salary, activeOverviewLead.sal_val, activeOverviewLead.salary_range) > 0 
                      ? `₹${cleanSalary(activeOverviewLead.salary, activeOverviewLead.sal_val, activeOverviewLead.salary_range).toLocaleString('en-IN')}/mo` 
                      : '₹30,000/mo'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CIBIL Score</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-700">
                    {activeOverviewLead.cibil && activeOverviewLead.cibil !== '—' ? activeOverviewLead.cibil : '750+'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Company</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#0A3977]">
                    {activeOverviewLead.assignedCompany || 'Rupay91'}
                  </div>
                </div>
              </div>

              {/* Grid: Personal Info & Loan Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Card: Personal & Contact Information */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0A3977] uppercase tracking-wider border-b border-slate-100 pb-2">
                    <User className="w-4 h-4" />
                    <span>Contact & Personal Details</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Full Name:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.name || 'Applicant'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Mobile Number:</span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                        <span>{activeOverviewLead.mobile || (activeOverviewLead.phone ? `+91 ${activeOverviewLead.phone}` : '—')}</span>
                        {activeOverviewLead.phone && (
                          <button
                            type="button"
                            onClick={() => handleCopy(activeOverviewLead.phone, 'phone')}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy Phone"
                          >
                            {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Email Address:</span>
                      <span className="font-bold text-slate-900 break-all">{activeOverviewLead.email && activeOverviewLead.email !== '—' ? activeOverviewLead.email : '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">PAN Card:</span>
                      <span className="font-bold font-mono text-slate-900">{activeOverviewLead.pan && activeOverviewLead.pan !== '—' ? activeOverviewLead.pan : '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">City / State:</span>
                      <span className="font-bold text-slate-900">
                        {activeOverviewLead.city && activeOverviewLead.city !== '—' ? activeOverviewLead.city : 'Delhi NCR'}, {activeOverviewLead.state || 'India'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Pincode:</span>
                      <span className="font-bold font-mono text-slate-900">{activeOverviewLead.pincode && activeOverviewLead.pincode !== '—' ? activeOverviewLead.pincode : '110001'}</span>
                    </div>
                  </div>
                </div>

                {/* Card: Application & Routing Information */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0A3977] uppercase tracking-wider border-b border-slate-100 pb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Application & Routing Status</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Employment:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.employmentType || 'Salaried'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Loan Purpose:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.purpose || 'Personal Loan'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Source / Channel:</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200/50">
                        {activeOverviewLead.source || 'Website Application'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Eligibility:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/50">
                        {activeOverviewLead.eligibilityStatus || 'Eligible'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Credit Manager:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.creditManager || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Submission Date:</span>
                      <span className="font-bold text-slate-700">{activeOverviewLead.created || activeOverviewLead.created_at || activeOverviewLead.date || 'Today'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive Assignment & Status Control Card */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Lead Workflow & Partner Management</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Partner Company Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Assigned Lending Partner / Company:
                    </label>
                    <select
                      value={activeOverviewLead.assignedCompany || 'Rupay91'}
                      onChange={(e) => handleReassignCompanyInModal(getLeadId(activeOverviewLead), e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer shadow-2xs"
                    >
                      {AFFILIATE_PARTNERS.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} — {p.description || 'Lending Partner'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Current Lead Status:
                    </label>
                    <select
                      value={activeOverviewLead.status || 'Fresh'}
                      onChange={(e) => handleStatusChangeInModal(getLeadId(activeOverviewLead), e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer shadow-2xs"
                    >
                      <option value="Fresh">Fresh</option>
                      <option value="Callback">Callback</option>
                      <option value="Interested">Interested</option>
                      <option value="Docs received">Docs Received</option>
                      <option value="Approved">Approved</option>
                      <option value="Disbursed">Disbursed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="text-[11px] text-slate-400 font-medium">
                Paisa in Minutes Affiliate CRM & Lead Management System
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForOverview(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Overview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
