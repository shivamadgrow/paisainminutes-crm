import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  ChevronLeft,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  MessageCircle,
  IndianRupee,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  Lock,
  Send,
  Activity,
  RotateCw
} from 'lucide-react';
import {
  AFFILIATE_PARTNERS,
  getPartnerMeta,
  getEligibilityMatrix,
  getPartnerTrackingUrl,
  trackPartnerClick,
  getSalaryMatchedOffers
} from '../data/affiliatePartners';
import { downloadFile, api as crmApi } from '../utils/apiClient';
import {
  cleanLoanAmount,
  cleanSalary,
  formatToIST,
  isDateInRange,
  DATE_RANGE_PRESETS,
  dateRangeKeys,
  getISTDateKey
} from '../utils/amountHelpers';
import {
  deleteLeadsApi,
  updateLoanApplication,
  refreshLeadScore,
  submitLoanApplication,
  buildLeadPayload,
  getLendersFromBackend,
  maskPan,
  normalizeStatus,
  formatStatusLabel,
  CRM_STATUS_MAP,
  CRM_STATUS_STAGES,
  getLeadsFromBackend, isMobileOnlyLead } from '../utils/apiConfig';
import { listPartnerEvents, pushLeadToPartnerApi } from '../utils/crmApi';
import { getServerPartnerId } from '../data/affiliatePartners';
import { hasPermission } from '../utils/permissions';

const INITIAL_FULL_LEADS = [];

const mapTabToFilterName = (tab) => {
  if (!tab || tab === 'all-leads' || tab === 'all') return 'All Leads';
  const clean = tab.toLowerCase().replace(/[-_]/g, ' ');
  if (clean === 'fresh') return 'Fresh';
  if (clean === 'callback') return 'Callback';
  if (clean === 'interested') return 'Interested';
  if (clean === 'approved') return 'Approved';
  if (clean === 'rejected') return 'Rejected';
  if (clean === 'no answer') return 'No Answer';
  if (clean === 'not interested') return 'Not Interested';
  if (clean === 'rupay91') return 'Rupay91';
  if (clean === 'mobile only') return 'Mobile-only';
  if (clean === 'duplicate leads' || clean === 'duplicates') return 'Duplicate Leads';
  if (clean === 'whatsapp') return 'WhatsApp';
  if (clean === 'direct website' || clean === 'direct' || clean === 'website') return 'Direct Website';
  return tab;
};

// Modern workflow status styling helper using canonical CRM status stages
const getStatusBadge = (status) => {
  const norm = normalizeStatus(status);
  const cfg = CRM_STATUS_MAP[norm];
  if (cfg) {
    return {
      label: cfg.label,
      classes: cfg.classes,
      dot: cfg.dot
    };
  }
  return {
    label: formatStatusLabel(status) || 'Fresh',
    classes: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    dot: 'bg-slate-400'
  };
};

// Modern partner company styling helper supporting all 9 onboarded partners + Pending Selection
const getCompanyBadge = (company) => {
  const clean = String(company || '').toLowerCase().replace(/[\s\-_]/g, '');
  if (clean.includes('rupay91') || clean.includes('rupay')) {
    return {
      name: 'Rupay91',
      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/80',
      dot: 'bg-indigo-600'
    };
  }
  if (clean.includes('jhatpat')) {
    return {
      name: 'Jhatpat Loans',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80',
      dot: 'bg-emerald-500'
    };
  }
  if (clean.includes('borrowera')) {
    return {
      name: 'Borrowera',
      classes: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80',
      dot: 'bg-purple-500'
    };
  }
  if (clean.includes('easyfin') || clean.includes('fincare')) {
    return {
      name: 'Easy Fincare',
      classes: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 hover:bg-cyan-100/80',
      dot: 'bg-cyan-500'
    };
  }
  if (clean.includes('loanwithin')) {
    return {
      name: 'LoanWithin',
      classes: 'bg-teal-50 text-teal-700 border-teal-200/80 hover:bg-teal-100/80',
      dot: 'bg-teal-500'
    };
  }
  if (clean.includes('instarupees') || clean.includes('insta')) {
    return {
      name: 'Insta Rupees',
      classes: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/80',
      dot: 'bg-amber-500'
    };
  }
  if (clean.includes('shubh')) {
    return {
      name: 'ShubhCash',
      classes: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/80',
      dot: 'bg-rose-500'
    };
  }
  if (clean.includes('udhaar')) {
    return {
      name: 'UdhaarNow',
      classes: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100/80',
      dot: 'bg-blue-500'
    };
  }
  if (clean.includes('ticket') || clean.includes('ticket2loan')) {
    return {
      name: 'Ticket 2 Loan',
      classes: 'bg-violet-50 text-violet-700 border-violet-200/80 hover:bg-violet-100/80',
      dot: 'bg-violet-500'
    };
  }
  if (!company || clean === 'pendingselection' || clean === 'pending' || clean === 'unassigned' || clean === 'pendingdetails' || clean === 'auto' || clean === '') {
    return {
      name: clean === 'pendingdetails' ? 'Pending Details' : 'Pending Selection',
      classes: 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200',
      dot: 'bg-slate-400'
    };
  }
  return {
    name: company,
    classes: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100/80',
    dot: 'bg-purple-500'
  };
};

// Eligibility and CIBIL display helper
const getEligibilityInfo = (item) => {
  if (!item) {
    return {
      label: 'Eligible',
      isPhoneOnly: false,
      cibilDisplay: 'Not Available',
      partner: 'Pending Selection',
      slab: 0
    };
  }

  if (item.eligibilityStatus === 'Incomplete / Phone Only') {
    return {
      label: 'Incomplete / Phone Only',
      isPhoneOnly: true,
      cibilDisplay: 'Not Available',
      partner: 'Pending Selection',
      slab: 0
    };
  }

  // CIBIL Score display: only display when valid number > 0, never guess from salary
  let cibilDisplay = 'Not Available';
  if (item.cibilScore !== null && item.cibilScore !== undefined && Number(item.cibilScore) > 0) {
    cibilDisplay = String(item.cibilScore);
  } else if (item.cibil && item.cibil !== '—' && item.cibil !== 'Not Available' && !isNaN(Number(item.cibil)) && Number(item.cibil) > 0) {
    cibilDisplay = String(item.cibil);
  }

  // Assigned partner determination: Show Pending Selection when selectedLenderId is null. Otherwise show selected lender.
  const assignedPartner = item.selectedLenderId || item.assignedCompany || 'Pending Selection';

  return {
    label: item.eligibilityStatus || 'Eligible',
    isPhoneOnly: Boolean(item.isPhoneOnly),
    cibilDisplay,
    partner: assignedPartner,
    slab: 0
  };
};

// ---- Marketing channel (set by the server from UTM / click id / referrer; old leads have none) ----
const CHANNEL_TABS = ['Google Ads', 'Meta', 'SMS', 'RCS', 'WhatsApp', 'AI', 'Email', 'Organic Search', 'Referral', 'Website', 'Manual', 'Other', 'Legacy'];
const CHANNEL_BADGE = {
  'Google Ads': 'bg-amber-50 text-amber-800 border-amber-300',
  Meta: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  SMS: 'bg-sky-50 text-sky-800 border-sky-300',
  RCS: 'bg-cyan-50 text-cyan-800 border-cyan-300',
  WhatsApp: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  AI: 'bg-violet-50 text-violet-800 border-violet-300',
  Email: 'bg-rose-50 text-rose-800 border-rose-300',
  'Organic Search': 'bg-lime-50 text-lime-800 border-lime-300',
  Referral: 'bg-orange-50 text-orange-800 border-orange-300',
  Website: 'bg-blue-50 text-blue-800 border-blue-200',
  Manual: 'bg-teal-50 text-teal-800 border-teal-300',
  Other: 'bg-slate-100 text-slate-700 border-slate-300',
  Legacy: 'bg-slate-50 text-slate-500 border-slate-200',
};
const channelOf = (lead) => (lead && lead.channel) || 'Legacy';

function ChannelBadge({ lead, showCampaign = false }) {
  const channel = channelOf(lead);
  const title = [channel, lead.utmMedium, lead.utmCampaign, lead.entryPoint && `via ${lead.entryPoint}`].filter(Boolean).join(' · ');
  return (
    <span className="inline-flex flex-col items-start gap-0.5" title={title}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold rounded-xl border shadow-2xs ${CHANNEL_BADGE[channel] || CHANNEL_BADGE.Other}`}>
        {channel === 'WhatsApp' ? <MessageCircle className="w-3.5 h-3.5 shrink-0" /> : <ExternalLink className="w-3 h-3 shrink-0" />}
        <span className="truncate max-w-[130px]">{channel}</span>
      </span>
      {showCampaign && (lead.utmCampaign || lead.utmMedium) && (
        <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">{[lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')}</span>
      )}
    </span>
  );
}

export default function LeadsView({
  leads: propLeads,
  setLeads,
  activeFilterTab,
  setActiveFilterTab,
  currentUser
}) {
  const leads = (Array.isArray(propLeads) && propLeads.length > 0) ? propLeads : (propLeads || []);
  const [localFilter, setLocalFilter] = useState(() => mapTabToFilterName(activeFilterTab));
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState('ALL');
  const [isMyLeadsOnly, setIsMyLeadsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [openPartnerDropdownId, setOpenPartnerDropdownId] = useState(null);
  const [partnerDropdownAnchor, setPartnerDropdownAnchor] = useState(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [statusDropdownAnchor, setStatusDropdownAnchor] = useState(null);
  const [selectedLeadForOverview, setSelectedLeadForOverview] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [selectedDatePreset, setSelectedDatePreset] = useState('ALL');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [partnerFilterQuery, setPartnerFilterQuery] = useState('');
  const [leadEvents, setLeadEvents] = useState([]);
  const [isPushingApi, setIsPushingApi] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [, setIsCustomDatePickerOpen] = useState(false);
  const canDeleteLeads = hasPermission(currentUser, 'leads.delete') && ['SUPER_ADMIN', 'ADMIN'].includes(currentUser?.serverRole);
  const canEditLeads = hasPermission(currentUser, 'leads.update');
  const canExportLeads = hasPermission(currentUser, 'leads.export');
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const LEADS_PER_PAGE = 10;

  // Real Lender rows from the server (a lender id is never a partner slug or name)
  useEffect(() => {
    let alive = true;
    getLendersFromBackend().then((list) => {
      if (alive) setLenders(list);
    });
    return () => { alive = false; };
  }, []);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    if (isManualSyncing) return;
    setIsManualSyncing(true);
    try {
      const res = await getLeadsFromBackend({});
      if (res && res.success && Array.isArray(res.leads)) {
        if (setLeads) setLeads(res.leads);
        showToast(`Sync complete! Fetched ${res.leads.length} live leads.`);
      } else {
        showToast((res && res.error) || 'Could not sync leads from the server.', true);
      }
    } catch (e) {
      showToast('Error syncing leads: ' + e.message, true);
    } finally {
      setIsManualSyncing(false);
    }
  };

  // Partner timeline for the open lead, from the server (append-only partner events)
  const fetchLeadEvents = async (applicationId) => {
    if (!applicationId) return;
    const res = await listPartnerEvents({ applicationId: String(applicationId).trim(), limit: 100 });
    if (res.success) {
      setLeadEvents(res.events.map((ev) => ({
        id: ev.id,
        event_type: ev.eventType,
        status: ev.status,
        partner_id: ev.partnerSlug || ev.partnerId,
        partner_name: ev.partnerName,
        created_at: ev.createdAt ? new Date(ev.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
        ip: ev.metadata && ev.metadata.ip,
        details: {
          remarks: ev.remarks,
          status: ev.status,
          target_url: ev.metadata && ev.metadata.target_url
        }
      })));
    } else {
      setLeadEvents([]);
      showToast(`Could not load partner events: ${res.error}`, true);
    }
  };

  useEffect(() => {
    if (!selectedLeadForOverview) {
      setLeadEvents([]);
      return;
    }
    fetchLeadEvents(selectedLeadForOverview.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeadForOverview && selectedLeadForOverview.id]);

  const handleManualApiPush = async (lead) => {
    if (!lead) return;
    if (!lead.assignedPartnerId) {
      showToast('Assign this lead to a partner before pushing it to the partner API.', true);
      return;
    }
    setIsPushingApi(true);
    const res = await pushLeadToPartnerApi({ applicationId: lead.id, partnerId: lead.assignedPartnerId });
    setIsPushingApi(false);
    if (res.success) {
      showToast(`Lead successfully pushed to ${lead.assignedCompany} API!`);
    } else {
      showToast(res.error || 'API push failed. Logged in Delivery Logs.', true);
    }
    fetchLeadEvents(lead.id);
  };

  // Close custom popovers when clicking outside, background scrolling, window resizing, or pressing Escape
  useEffect(() => {
    if (!openPartnerDropdownId && !openStatusDropdownId) return;

    const handleScroll = (e) => {
      // If the scroll happened INSIDE any popover portal, allow smooth scrolling and DO NOT close!
      if (e && e.target && typeof e.target.closest === 'function' && e.target.closest('[data-popover-portal]')) {
        return;
      }
      setOpenPartnerDropdownId(null);
      setPartnerDropdownAnchor(null);
      setOpenStatusDropdownId(null);
      setStatusDropdownAnchor(null);
    };

    const handleResize = () => {
      setOpenPartnerDropdownId(null);
      setPartnerDropdownAnchor(null);
      setOpenStatusDropdownId(null);
      setStatusDropdownAnchor(null);
    };

    const handleClickOutside = (e) => {
      if (e.target && typeof e.target.closest === 'function' && (e.target.closest('[data-popover-portal]') || e.target.closest('[data-popover-trigger]'))) {
        return;
      }
      setOpenPartnerDropdownId(null);
      setPartnerDropdownAnchor(null);
      setOpenStatusDropdownId(null);
      setStatusDropdownAnchor(null);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenPartnerDropdownId(null);
        setPartnerDropdownAnchor(null);
        setOpenStatusDropdownId(null);
        setStatusDropdownAnchor(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPartnerDropdownId, openStatusDropdownId]);

  // Compute live stats for top KPI cards
  const leadStats = useMemo(() => {
    const total = leads.length;
    const fresh = leads.filter(l => normalizeStatus(l.status) === 'FRESH').length;
    const callbacks = leads.filter(l => normalizeStatus(l.status) === 'CALLBACK').length;
    const approved = leads.filter(l => {
      const s = normalizeStatus(l.status);
      return s === 'APPROVED' || s === 'DISBURSED';
    }).length;
    const highCibil = leads.filter(l => {
      const c = String(l.cibil || '');
      const num = parseInt(c.replace(/\D/g, '').slice(0, 3), 10);
      return (num && num >= 700) || c.includes('750') || c.includes('800') || c.includes('850');
    }).length;
    const totalApplied = leads.reduce((acc, l) => acc + cleanLoanAmount(l.applied || l.loanAmount), 0);

    return { total, fresh, callbacks, approved, highCibil, totalApplied };
  }, [leads]);

  const handleCopy = (text, field) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(String(text));
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) { }
  };
  const [testMobile, setTestMobile] = useState('');
  const [testName, setTestName] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testAmount, setTestAmount] = useState('50000');
  const [testSalary, setTestSalary] = useState('35000');
  const [testTenure, setTestTenure] = useState('12');
  const [testPurpose, setTestPurpose] = useState('Personal Loan');
  const [testEmploymentType, setTestEmploymentType] = useState('Salaried');
  const [testCompanyName, setTestCompanyName] = useState('');
  const [testSalaryMode, setTestSalaryMode] = useState('Bank');
  const [testCity, setTestCity] = useState('');
  const [testState, setTestState] = useState('');
  const [testPincode, setTestPincode] = useState('');
  const [testDob, setTestDob] = useState('');
  const [testGender, setTestGender] = useState('Male');
  const [testHaveCreditCard, setTestHaveCreditCard] = useState('No');
  const [testCreditCardLimit, setTestCreditCardLimit] = useState('');
  const [testPan, setTestPan] = useState('');
  const [testCibil, setTestCibil] = useState('720');
  const [testSelectedLenderId, setTestSelectedLenderId] = useState('');
  const [testLenderApplicationId, setTestLenderApplicationId] = useState('');
  const [testSource, setTestSource] = useState('website');
  const [testAssignedCompany, setTestAssignedCompany] = useState('AUTO');
  const [testShowFullFields, setTestShowFullFields] = useState(false);
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
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualFeedback, setManualFeedback] = useState(null);

  useEffect(() => {
    if (activeFilterTab) {
      setLocalFilter(mapTabToFilterName(activeFilterTab));
    }
  }, [activeFilterTab]);

  const activeFilter = localFilter;

  const handleFilterClick = (filterId) => {
    setLocalFilter(filterId);
    // Channel tabs only filter this screen. The app-level tab key decides which SCREEN is shown (App.jsx renders the
    // lead list only for its known keys), so writing "google-ads" there threw the user to the dashboard (F-19).
    if (setActiveFilterTab && !CHANNEL_TABS.includes(filterId)) {
      setActiveFilterTab(filterId.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  const getLeadId = (item, idx) => String(item?.id || item?.loanNo || item?.lead_id || `lead-${idx}`).trim();

  // Pagination: 10 leads per page. Any change to the filters sends the list back to page 1.
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // Multi-lead duplicate occurrence detection maps
  const phoneCounts = useMemo(() => {
    const counts = {};
    leads.forEach(l => {
      const p = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
      if (p.length === 10) counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const panCounts = useMemo(() => {
    const counts = {};
    leads.forEach(l => {
      const pan = String(l.pan || '').trim().toUpperCase();
      if (pan && pan !== '—' && pan.length >= 10) counts[pan] = (counts[pan] || 0) + 1;
    });
    return counts;
  }, [leads]);

  // Multi-lead date counts across presets
  const dateCounts = useMemo(() => {
    const counts = {
      ALL: leads.length,
      TODAY: 0,
      YESTERDAY: 0,
      LAST_7_DAYS: 0,
      THIS_MONTH: 0,
      LAST_MONTH: 0,
      CUSTOM: 0
    };

    leads.forEach(l => {
      const d = l.created_at || l.createdAt || l.created || l.date;
      if (isDateInRange(d, 'TODAY')) counts.TODAY++;
      if (isDateInRange(d, 'YESTERDAY')) counts.YESTERDAY++;
      if (isDateInRange(d, 'LAST_7_DAYS')) counts.LAST_7_DAYS++;
      if (isDateInRange(d, 'THIS_MONTH')) counts.THIS_MONTH++;
      if (isDateInRange(d, 'LAST_MONTH')) counts.LAST_MONTH++;
    });

    if (customStartDate || customEndDate) {
      counts.CUSTOM = leads.filter(l => {
        const d = l.created_at || l.createdAt || l.created || l.date;
        return isDateInRange(d, 'CUSTOM', customStartDate, customEndDate);
      }).length;
    }

    return counts;
  }, [leads, customStartDate, customEndDate]);

  // Filter Leads based on Search, Status, Partner Company, Date Range & My Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item, idx) => {
      if (!item) return false;

      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (item.name || '').toLowerCase().includes(q);
        const matchesMobile = (item.mobile || '').includes(q);
        const matchesEmail = (item.email || '').toLowerCase().includes(q);
        const matchesId = getLeadId(item, idx).toLowerCase().includes(q) || String(item.leadCode || item.displayId || '').toLowerCase().includes(q);
        const matchesCity = (item.city || '').toLowerCase().includes(q);
        const matchesCompany = (item.assignedCompany || '').toLowerCase().includes(q);
        const matchesSource = (item.source || '').toLowerCase().includes(q) ||
          (item.utm_source || '').toLowerCase().includes(q) ||
          (item.lead_source || '').toLowerCase().includes(q) ||
          channelOf(item).toLowerCase().includes(q) ||
          (item.utmCampaign || '').toLowerCase().includes(q);
        if (!matchesName && !matchesMobile && !matchesEmail && !matchesId && !matchesCity && !matchesCompany && !matchesSource) {
          return false;
        }
      }

      // 2. Partner Filter
      if (selectedPartnerFilter && selectedPartnerFilter !== 'ALL') {
        const targetClean = selectedPartnerFilter.toLowerCase().replace(/[\s\-_]/g, '');
        const c = (item.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
        if (c !== targetClean && !c.includes(targetClean) && !targetClean.includes(c)) {
          return false;
        }
      }

      // Mobile-only leads (phone verified, form not filled) live in their own tab; a search still finds them.
      if (activeFilter.toLowerCase().replace(/[-_]/g, ' ') !== 'mobile only' && !searchQuery.trim() && isMobileOnlyLead(item)) return false;

      // 3. Status Tab Filter
      if (activeFilter !== 'All Leads') {
        const normStatus = normalizeStatus(item.status);
        const filterKey = activeFilter.toLowerCase().replace(/[-_]/g, ' ');

        // Check if filter is a partner name
        const isPartnerName = AFFILIATE_PARTNERS.some(p => p.name.toLowerCase() === filterKey);
        if (isPartnerName) {
          const c = (item.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
          if (c !== filterKey.replace(/[\s\-_]/g, '')) return false;
        } else if (filterKey === 'fresh' && normStatus !== 'FRESH') {
          return false;
        } else if (filterKey === 'callback' && normStatus !== 'CALLBACK') {
          return false;
        } else if (filterKey === 'interested' && normStatus !== 'INTERESTED') {
          return false;
        } else if (filterKey === 'approved' && normStatus !== 'APPROVED' && normStatus !== 'DISBURSED') {
          return false;
        } else if (filterKey === 'disbursed' && normStatus !== 'DISBURSED') {
          return false;
        } else if (filterKey === 'rejected' && normStatus !== 'REJECTED') {
          return false;
        } else if (filterKey === 'mobile only') {
          if (!isMobileOnlyLead(item)) return false;
        } else if (filterKey === 'duplicate leads') {
          const phone = String(item.phone || item.mobile || '').replace(/\D/g, '').slice(-10);
          const pan = String(item.pan || '').trim().toUpperCase();
          const isDup = (phone && phoneCounts[phone] > 1) || (pan && pan !== '—' && panCounts[pan] > 1);
          if (!isDup) return false;
        } else if (CHANNEL_TABS.some(c => c.toLowerCase() === filterKey)) {
          if (channelOf(item).toLowerCase() !== filterKey) return false;
        }
      }

      // 4. My Leads Only Filter
      if (isMyLeadsOnly && currentUser) {
        const tele = (item.teleCaller || '').toLowerCase();
        const cred = (item.creditManager || '').toLowerCase();
        const me = (currentUser.name || '').toLowerCase();
        if (!tele.includes(me) && !cred.includes(me)) return false;
      }

      // 5. Date Range Filter
      if (selectedDatePreset !== 'ALL') {
        const leadDate = item.created_at || item.createdAt || item.created || item.date;
        if (!isDateInRange(leadDate, selectedDatePreset, customStartDate, customEndDate)) {
          return false;
        }
      }

      return true;
    });
  }, [leads, searchQuery, selectedPartnerFilter, activeFilter, isMyLeadsOnly, currentUser, phoneCounts, panCounts, selectedDatePreset, customStartDate, customEndDate]);

  const pageCount = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedLeads = filteredLeads.slice(pageStart, pageStart + PAGE_SIZE);
  useEffect(() => { setPage(1); }, [searchQuery, selectedPartnerFilter, activeFilter, isMyLeadsOnly, selectedDatePreset, customStartDate, customEndDate]);
  const pageNumbers = (() => {
    const nums = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
    return [...nums].filter(n => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  })();

  // Export is built by the server (F-21, F-22): it needs leads.export, never includes the PAN and neutralises formulas.
  const [isExporting, setIsExporting] = useState(false);
  const handleExportExcel = async () => {
    if (isExporting) return;
    const query = { ...dateRangeKeys(selectedDatePreset, customStartDate, customEndDate) };
    if (CHANNEL_TABS.includes(activeFilter)) query.channel = activeFilter;
    else if (activeFilter !== 'All Leads') {
      const status = normalizeStatus(activeFilter);
      if (['FRESH', 'CALLBACK', 'INTERESTED', 'APPROVED', 'DISBURSED', 'REJECTED'].includes(status)) query.status = status;
    }
    if (searchQuery && searchQuery.trim().length >= 2) query.q = searchQuery.trim();
    setIsExporting(true);
    const res = await downloadFile('/api/loan-applications/export', query, `paisainminutes-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    setIsExporting(false);
    if (!res.ok) showToast(res.status === 403 ? 'You do not have permission to export leads.' : (res.error || 'Could not export leads.'), true);
  };

  const handleSelectAll = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const shouldSelect = typeof e?.target?.checked === 'boolean' ? e.target.checked : !isAllSelected;
    if (shouldSelect) {
      const allIds = filteredLeads.map((item, idx) => getLeadId(item, idx));
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectRow = (itemId) => {
    const targetId = String(itemId).trim();
    setSelectedLeadIds(prev =>
      prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]
    );
  };
  const handleSelectOne = handleSelectRow;

  const handleDeleteSingle = async (item, idx) => {
    const itemId = getLeadId(item, idx);
    if (!canDeleteLeads) return;
    if (!confirm(`Are you sure you want to delete lead ${item.name || itemId}?`)) return;
    const res = await deleteLeadsApi({ id: item.id });
    if (res.success) {
      if (setLeads) setLeads(prev => prev.filter(l => l.id !== item.id));
      setSelectedLeadIds(prev => prev.filter(id => id !== itemId));
      showToast('Lead deleted.');
    } else {
      showToast(res.error || 'Could not delete the lead.', true);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedLeadIds.length === 0 || !canDeleteLeads) return;
    if (!confirm(`Delete ${selectedLeadIds.length} selected lead(s)?`)) return;
    const res = await deleteLeadsApi({ ids: [...selectedLeadIds] });
    if (res.success) {
      const gone = new Set([...(res.deletedIds || []), ...(res.notFound || [])]);
      if (setLeads) setLeads(prev => prev.filter(l => !gone.has(l.id)));
      setSelectedLeadIds([]);
      showToast(`${(res.deletedIds || []).length} lead(s) deleted.`);
    } else {
      showToast(res.error || 'Could not delete the selected leads.', true);
    }
  };

  const handleClearAllLeads = async () => {
    if (!canDeleteLeads) return;
    if (leads.length === 0) {
      alert('No leads to delete! The list is already empty.');
      return;
    }
    if (!confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE ALL leads? This cannot be undone.`)) return;
    const typed = window.prompt('Type DELETE ALL LEADS to confirm');
    if (typed !== 'DELETE ALL LEADS') {
      showToast('Delete all cancelled.', true);
      return;
    }
    const res = await deleteLeadsApi({ clear_all: true });
    if (res.success) {
      if (setLeads) setLeads([]);
      setSelectedLeadIds([]);
      showToast(`All leads deleted (${res.deletedCount ?? 'all'}).`);
    } else {
      showToast(res.error || 'Could not delete all leads.', true);
    }
  };

  const applyUpdatedLead = (backendId, updated) => {
    if (updated && setLeads) setLeads(prev => prev.map(l => (l.id === backendId ? updated : l)));
  };

  // Assign (or un-assign) the partner a lead is routed to. Only the server decides; state changes after success.
  const handleReassignCompany = async (leadId, newCompany) => {
    const targetLead = leads.find((l, i) => getLeadId(l, i) === leadId);
    if (!targetLead) return;
    const isUnassigning = !newCompany || newCompany === 'Pending Selection';
    let serverPartnerId = null;
    if (!isUnassigning) {
      const meta = AFFILIATE_PARTNERS.find(p => p.name === newCompany || p.id === newCompany);
      serverPartnerId = meta ? getServerPartnerId(meta.id) : null;
      if (!serverPartnerId) {
        showToast(`"${newCompany}" is not registered on the server yet.`, true);
        return;
      }
    }
    const patchRes = await updateLoanApplication(targetLead.id, { assignedPartnerId: serverPartnerId });
    if (patchRes.success && patchRes.lead) {
      applyUpdatedLead(targetLead.id, patchRes.lead);
      showToast(isUnassigning ? 'Partner assignment removed.' : `Lead assigned to ${newCompany}.`);
      if (selectedLeadForOverview && selectedLeadForOverview.id === targetLead.id) fetchLeadEvents(targetLead.id);
    } else {
      showToast(patchRes.error || 'Could not update the partner assignment.', true);
    }
  };

  // Choose the real lender (Lender table id) for a lead
  const handleLenderChange = async (leadId, lenderId) => {
    const targetLead = leads.find((l, i) => getLeadId(l, i) === leadId);
    if (!targetLead) return;
    const selectedLenderId = !lenderId || lenderId === 'Pending Selection' ? null : lenderId;
    const patchRes = await updateLoanApplication(targetLead.id, { selectedLenderId });
    if (patchRes.success && patchRes.lead) {
      applyUpdatedLead(targetLead.id, patchRes.lead);
      showToast('Lender updated.');
    } else {
      showToast(patchRes.error || 'Could not update the lender.', true);
    }
  };

  // Escape closes the lead panel (F-20).
  useEffect(() => {
    if (!selectedLeadForOverview) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedLeadForOverview(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedLeadForOverview]);

  // End every device login of this lead's customer (lost phone, re-assigned number): their next visit needs a new OTP.
  const handleSignOutCustomer = async (lead) => {
    if (!lead) return;
    if (!window.confirm('Sign this customer out of every device? They will need a new OTP next time they open their application.')) return;
    const res = await crmApi(`/api/loan-applications/${encodeURIComponent(lead.id)}/sign-out-customer`, { method: 'POST', body: {} });
    if (res.ok) showToast(`Customer signed out (${res.data?.devicesEnded ?? 0} device login(s) ended).`);
    else showToast(res.error || 'Could not sign the customer out.', true);
  };

  // Manual override of the stored bureau result: one new paid call (a phone is normally checked once, reused 30 days).
  const [refreshingScoreId, setRefreshingScoreId] = useState(null);
  const handleRefreshScore = async (lead) => {
    if (!lead || refreshingScoreId) return;
    if (!window.confirm('Fetch a new credit score from the bureau? This is a paid call. The stored score is normally reused for 30 days.')) return;
    setRefreshingScoreId(lead.id);
    const res = await refreshLeadScore(lead.id);
    setRefreshingScoreId(null);
    if (res.success && res.lead) {
      applyUpdatedLead(lead.id, res.lead);
      showToast(res.bureau?.found ? `Score refreshed: ${res.bureau.score}.` : 'Bureau has no credit record for this number.');
    } else {
      showToast(res.error || 'Could not refresh the score.', true);
    }
  };

  // Quick status change (the seven canonical CRM statuses only)
  const handleStatusChange = async (leadId, newStatus) => {
    const canonicalStatus = normalizeStatus(newStatus);
    const targetLead = leads.find((l, i) => getLeadId(l, i) === leadId);
    if (!targetLead) return;
    const patchRes = await updateLoanApplication(targetLead.id, { status: canonicalStatus });
    if (patchRes.success && patchRes.lead) {
      applyUpdatedLead(targetLead.id, patchRes.lead);
      showToast(`Status changed to ${formatStatusLabel(canonicalStatus)}.`);
    } else {
      showToast(patchRes.error || 'Could not update the status.', true);
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

  const overviewElig = useMemo(() => {
    return activeOverviewLead ? getEligibilityInfo(activeOverviewLead) : null;
  }, [activeOverviewLead]);

  const handleReassignCompanyInModal = (leadId, newCompany) => handleReassignCompany(leadId, newCompany);

  const handleStatusChangeInModal = (leadId, newStatus) => handleStatusChange(leadId, newStatus);

  // Test Website Lead Submit Handler (Supports minimal and complete canonical payloads)
  const handleTestApplySubmit = async (e) => {
    e.preventDefault();
    if (!testMobile) return;
    setIsSubmittingTest(true);
    setTestFeedback(null);

    const rawInput = {
      applicantName: testName || 'Test Applicant',
      phone: testMobile,
      email: testEmail || undefined,
      amount: testAmount || 50000,
      tenureMonths: testTenure || 12,
      purpose: testPurpose || 'Personal Loan',
      monthlyIncome: testSalary || 35000,
      employmentType: testEmploymentType || undefined,
      companyName: testCompanyName || undefined,
      salaryMode: testSalaryMode || undefined,
      city: testCity || undefined,
      state: testState || undefined,
      pincode: testPincode || undefined,
      dob: testDob || undefined,
      gender: testGender || undefined,
      haveCreditCard: testHaveCreditCard === 'Yes' ? true : (testHaveCreditCard === 'No' ? false : undefined),
      creditCardLimit: testCreditCardLimit || undefined,
      utmSource: 'website',
      leadSource: testSource || 'website',
      pan: testPan || undefined,
      cibilScore: testCibil,
      selectedLenderId: testSelectedLenderId || (testAssignedCompany !== 'AUTO' ? testAssignedCompany : undefined),
      lenderApplicationId: testLenderApplicationId || undefined
    };

    const payload = buildLeadPayload(rawInput);
    // Secure logging: never log raw PAN
    const logSafe = { ...payload };
    if (logSafe.pan) logSafe.pan = maskPan(logSafe.pan);
    console.log('%c[CRM TEST SUBMIT] 🚀 Submitting Test Lead with canonical payload:', 'color: #0284c7; font-weight: bold;', logSafe);

    try {
      const result = await submitLoanApplication(rawInput);
      setIsSubmittingTest(false);

      if (result && result.success && result.lead) {
        let createdLead = result.lead;
        if ((testSelectedLenderId || testLenderApplicationId) && canEditLeads) {
          const upd = await updateLoanApplication(createdLead.id, {
            ...(testSelectedLenderId ? { selectedLenderId: testSelectedLenderId } : {}),
            ...(testLenderApplicationId ? { lenderApplicationId: testLenderApplicationId } : {})
          });
          if (upd.success && upd.lead) createdLead = upd.lead;
        }
        if (setLeads) {
          setLeads(prev => [createdLead, ...prev.filter(l => l.id !== createdLead.id)]);
        }
        setTestFeedback({
          type: 'success',
          message: `Lead created successfully! ID: ${result.lead.displayId || result.lead.id}`
        });
        setTimeout(() => {
          setIsTestModalOpen(false);
          setTestFeedback(null);
          setTestMobile('');
          setTestName('');
          setTestEmail('');
          setTestPan('');
        }, 1800);
      } else {
        setTestFeedback({
          type: 'error',
          message: (result && result.error) || 'Submission failed'
        });
      }
    } catch (err) {
      console.error('[CRM TEST SUBMIT] ❌ Error:', err);
      setIsSubmittingTest(false);
      setTestFeedback({
        type: 'error',
        message: err.message || 'Could not connect to API server'
      });
    }
  };

  // Manual New Lead Form Submit
  const handleManualLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newMobile) return;
    setIsSubmittingManual(true);
    setManualFeedback(null);

    const rawInput = {
      applicantName: newName || 'Manual Lead',
      phone: newMobile,
      amount: newAmount || 50000,
      monthlyIncome: newSalary || 30000,
      city: newCity || undefined,
      leadSource: newSource || 'Direct Manual Entry',
      utmSource: 'crm_manual'
    };

    const payload = buildLeadPayload(rawInput);
    const logSafe = { ...payload };
    if (logSafe.pan) logSafe.pan = maskPan(logSafe.pan);
    console.log('%c[CRM MANUAL SUBMIT] 📝 Creating Manual Lead with canonical payload:', 'color: #0d9488; font-weight: bold;', logSafe);

    try {
      const result = await submitLoanApplication(rawInput);
      setIsSubmittingManual(false);
      if (result && result.success && result.lead) {
        let createdLead = result.lead;
        // Optional partner choice from the form: applied through the real assignment field
        const chosen = AFFILIATE_PARTNERS.find(p => p.name === newCompany || p.id === newCompany);
        const chosenServerId = chosen ? getServerPartnerId(chosen.id) : null;
        if (chosenServerId && canEditLeads) {
          const assignRes = await updateLoanApplication(createdLead.id, { assignedPartnerId: chosenServerId });
          if (assignRes.success && assignRes.lead) createdLead = assignRes.lead;
        }
        if (setLeads) {
          setLeads(prev => [createdLead, ...prev.filter(l => l.id !== createdLead.id)]);
        }
        setManualFeedback({
          type: 'success',
          message: `Lead created successfully! ID: ${result.lead.displayId || result.lead.id}`
        });
        setTimeout(() => {
          setIsAddModalOpen(false);
          setManualFeedback(null);
          setNewMobile('');
          setNewName('');
        }, 1500);
      } else {
        setManualFeedback({
          type: 'error',
          message: (result && result.error) || 'Submission failed'
        });
      }
    } catch (e) {
      console.error('[CRM MANUAL SUBMIT] ❌ Error:', e);
      setIsSubmittingManual(false);
      setManualFeedback({
        type: 'error',
        message: e.message || 'Could not connect to API server'
      });
    }
  };

  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every((item, idx) => selectedLeadIds.includes(getLeadId(item, idx)));

  return (
    <div className="space-y-6 animate-fade-in pb-16">

      {toastMessage && (
        <div className={`fixed top-20 right-6 z-[80] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold border ${toastMessage.isError ? 'bg-rose-600 text-white border-rose-300' : 'bg-[#0A3977] text-white border-blue-400'}`}>
          {toastMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top FinTech Command Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0A3977] to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-blue-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-md shadow-emerald-500/50"></span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black tracking-wider uppercase text-blue-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Live Lending Operations & Routing Engine</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Live from server
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Real-time website applications from <span className="text-amber-300 font-bold">paisainminutes.com</span> routed to the partner you assign.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Simulate Lead</span>
          </button>

          {canExportLeads && (
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExporting ? 'Exporting…' : 'Export CSV'}</span>
          </button>
          )}

          {canDeleteLeads && (
          <button
            onClick={handleClearAllLeads}
            className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Permanently delete all leads"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear All</span>
          </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* 4 Luxury KPI Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Metric 1: Total Leads */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Leads</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0A3977] flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{leadStats.total}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              Live Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">All incoming applicant submissions</p>
        </div>

        {/* Metric 2: Allocated to Partners */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Partner Allocated</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {leads.filter(l => l.assignedPartnerId).length}
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
              Assigned
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Leads with a partner assigned</p>
        </div>

        {/* Metric 3: Prime CIBIL */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">High Intent & Prime</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{leadStats.highCibil}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              CIBIL 700+
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Fast-track pre-approved borrowers</p>
        </div>

        {/* Metric 4: Follow-up Queue */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Follow-up Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{leadStats.fresh + leadStats.callbacks}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
              Fresh + Calls
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Awaiting telecaller / partner connect</p>
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
              <span className="text-[11px] text-rose-100">Perform bulk operations on selected records</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {canDeleteLeads && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-1.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Selected ({selectedLeadIds.length})</span>
            </button>
            )}
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-3 py-1.5 bg-rose-800/80 hover:bg-rose-900 text-white border border-rose-400/50 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Unified Smart Control Center */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-3.5">

        {/* Row 1: Workflow Status Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

          {/* Status Workflow Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'All Leads', label: 'All Status', count: leads.filter(l => !isMobileOnlyLead(l)).length },
              {
                id: 'Mobile-only',
                label: 'Mobile leads',
                count: leads.filter(isMobileOnlyLead).length
              },
              { id: 'Fresh', label: 'Fresh', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'FRESH').length },
              { id: 'Callback', label: 'Callback', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'CALLBACK').length },
              { id: 'Interested', label: 'Interested', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'INTERESTED').length },
              { id: 'Approved', label: 'Approved', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'APPROVED').length },
              { id: 'Disbursed', label: 'Disbursed', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'DISBURSED').length },
              { id: 'Rejected', label: 'Rejected', count: leads.filter(l => !isMobileOnlyLead(l) && normalizeStatus(l.status) === 'REJECTED').length },
              {
                id: 'Duplicate Leads',
                label: 'Duplicate Leads',
                count: leads.filter(l => {
                  const phone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
                  const pan = String(l.pan || '').trim().toUpperCase();
                  return (phone && phoneCounts[phone] > 1) || (pan && pan !== '—' && panCounts[pan] > 1);
                }).length
              },
              ...CHANNEL_TABS.map(ch => ({ id: ch, label: ch, count: leads.filter(l => channelOf(l) === ch).length })).filter(t => t.count > 0),
            ].map(tab => {
              const isSelected = activeFilter.toLowerCase().replace(/\s+/g, ' ') === tab.id.toLowerCase().replace(/\s+/g, ' ');
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterClick(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${isSelected
                    ? 'bg-[#0A3977] text-white shadow-md shadow-blue-950/20 ring-2 ring-blue-400/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Quick Date Selector & Search Bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            {/* Quick Date Dropdown */}
            <div className="relative flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition shrink-0">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={selectedDatePreset}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedDatePreset(val);
                  if (val === 'CUSTOM') {
                    setIsCustomDatePickerOpen(true);
                  }
                }}
                className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer text-xs pr-1"
                title="Quick Date Range Selector"
              >
                {DATE_RANGE_PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search applicant, phone, ID, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0A3977] focus:bg-white transition-all placeholder-slate-400 font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Live Sync / Refresh Button */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isManualSyncing}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0A3977] border border-blue-200/80 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
              title="Click to instantly fetch new leads from server"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin text-blue-600' : 'text-[#0A3977]'}`} />
              <span>{isManualSyncing ? 'Fetching...' : 'Sync Leads'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Dedicated Date Range Filter Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 px-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Date Range:</span>
            </span>

            {DATE_RANGE_PRESETS.map(preset => {
              const isSel = selectedDatePreset === preset.id;
              const count = dateCounts[preset.id] ?? 0;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedDatePreset(preset.id);
                    if (preset.id === 'CUSTOM') {
                      setIsCustomDatePickerOpen(true);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${isSel
                    ? 'bg-[#0A3977] text-white shadow-sm ring-2 ring-blue-400/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                    }`}
                >
                  <span>{preset.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition ${isSel ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Custom Range Date Pickers */}
            {selectedDatePreset === 'CUSTOM' && (
              <div className="flex items-center gap-2 bg-blue-50/80 p-1.5 rounded-2xl border border-blue-200/90 shadow-2xs shrink-0 animate-fade-in">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">From:</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">To:</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer"
                  />
                </div>
                {(customStartDate || customEndDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer"
                    title="Clear Custom Date Range"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Date Tag */}
          {selectedDatePreset !== 'ALL' && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50/80 px-3 py-1 rounded-xl border border-blue-200 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Filtered by: {DATE_RANGE_PRESETS.find(p => p.id === selectedDatePreset)?.label}
                {selectedDatePreset === 'CUSTOM' && (customStartDate || customEndDate) && (
                  ` (${customStartDate || 'Start'} to ${customEndDate || 'Today'})`
                )}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDatePreset('ALL');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-blue-500 hover:text-blue-900 ml-1 cursor-pointer font-extrabold"
                title="Reset Date Filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Lending Partner Badges & Realtime Summary */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 px-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Partner Filter:</span>
            </span>

            <button
              onClick={() => setSelectedPartnerFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${selectedPartnerFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400/40'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <span>All Partners</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono font-bold">
                {leads.length}
              </span>
            </button>

            {AFFILIATE_PARTNERS.map(p => {
              const count = leads.filter(l => {
                const c = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
                return c === p.id || c === p.name.toLowerCase().replace(/[\s\-_]/g, '');
              }).length;

              const cleanSelected = (selectedPartnerFilter || '').toLowerCase().replace(/[\s\-_]/g, '');
              const cleanId = (p.id || '').toLowerCase().replace(/[\s\-_]/g, '');
              const cleanName = (p.name || '').toLowerCase().replace(/[\s\-_]/g, '');
              const isSel = (cleanSelected !== 'all') && (cleanSelected === cleanId || cleanSelected === cleanName);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPartnerFilter(isSel ? 'ALL' : p.name)}
                  style={isSel ? {
                    backgroundColor: p.accentColor || '#4F46E5',
                    borderColor: p.accentColor || '#4F46E5',
                    boxShadow: `0 4px 14px -1px ${p.accentColor || '#4F46E5'}66`
                  } : {}}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer border ${isSel
                    ? 'text-white border-transparent'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all shrink-0 ${isSel ? 'bg-white/30 shadow-2xs' : ''}`}
                    style={isSel ? {} : { backgroundColor: p.accentColor }}
                  ></span>
                  <span className={`font-bold ${isSel ? 'text-white' : 'text-slate-800'}`}>{p.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${isSel ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Showing <strong className="text-slate-900 font-extrabold">{filteredLeads.length}</strong> of {leads.length} leads</span>
          </div>
        </div>
      </div>

      {/* Contextual Queue Banners for Mobile-only and Duplicate Leads */}
      {activeFilter === 'Mobile-only' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-blue-950">Mobile-only Abandoned Incomplete Leads</div>
              <div className="text-[11px] text-blue-700">These applicants submitted their mobile number on the website mini-form but dropped off before entering PAN, salary, or loan amount. Follow up to complete the application.</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-white text-blue-700 border border-blue-200 rounded-xl text-xs font-bold shrink-0">
            {filteredLeads.length} Incomplete Leads
          </span>
        </div>
      )}

      {activeFilter === 'Duplicate Leads' && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-950">Duplicate Records Flagged</div>
              <div className="text-[11px] text-amber-800">These leads share an identical mobile number or PAN with existing records in the database. Verify before re-dispatching to another lending partner.</div>
            </div>
          </div>
          <span className="px-3 py-1 bg-white text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shrink-0">
            {filteredLeads.length} Matches Flagged
          </span>
        </div>
      )}

      {/* Floating Luxury SaaS Data Grid */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 overflow-auto max-h-[70vh]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-600 font-black tracking-wider text-[11px] uppercase border-b border-slate-200/90 sticky top-0 z-20 backdrop-blur-md">
              <th
                className="py-4 px-4 w-12 cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
                title={isAllSelected ? "Deselect All" : "Select All Leads"}
              >
                <div className="flex items-center justify-center pointer-events-none">
                  <input
                    type="checkbox"
                    checked={Boolean(isAllSelected)}
                    readOnly
                    tabIndex={-1}
                    className="rounded-md border-slate-300 text-[#0A3977] focus:ring-[#0A3977] cursor-pointer w-4 h-4 transition"
                  />
                </div>
              </th>
              <th className="py-4 px-4 min-w-[260px]">APPLICANT DETAILS</th>
              <th className="py-4 px-4 min-w-[190px]">ASSIGNED PARTNER</th>
              <th className="py-4 px-4 min-w-[170px]">APPLIED TO</th>
              <th className="py-4 px-4 min-w-[170px]">ELIGIBILITY & CIBIL</th>
              <th className="py-4 px-4 min-w-[140px]">APPLIED AMOUNT</th>
              <th className="py-4 px-4 min-w-[170px]">SALARY / LOCATION</th>
              <th className="py-4 px-4 min-w-[150px]">SOURCE</th>
              <th className="py-4 px-4 min-w-[160px]">STATUS</th>
              <th className="py-4 px-4 min-w-[150px]">DATE</th>
              <th className="py-4 px-4 min-w-[140px] text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredLeads.length > 0 ? (
              pagedLeads.map((item, pageIdx) => {
                if (!item) return null;
                const idx = pageStart + pageIdx;
                const itemId = getLeadId(item, idx);
                const isSelected = selectedLeadIds.includes(itemId);
                const eligInfo = getEligibilityInfo(item);
                const currentPartner = item.assignedCompany || eligInfo.partner || 'Pending Details';
                const companyBadge = getCompanyBadge(currentPartner);
                const statusBadge = getStatusBadge(item.status || 'Fresh');

                return (
                  <tr
                    key={itemId}
                    className={`transition-colors duration-150 relative ${isSelected
                      ? 'bg-blue-50/80 border-l-4 border-l-[#0A3977]'
                      : 'hover:bg-slate-50/80'
                      }`}
                  >

                    {/* Checkbox (Full Cell Clickable) */}
                    <td
                      className="py-4 px-4 cursor-pointer hover:bg-slate-100/50 transition-colors select-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRow(itemId);
                      }}
                      title={isSelected ? "Deselect row" : "Select row"}
                    >
                      <div className="flex items-center justify-center pointer-events-none">
                        <input
                          type="checkbox"
                          checked={Boolean(isSelected)}
                          readOnly
                          tabIndex={-1}
                          className="rounded-md border-slate-300 text-[#0A3977] focus:ring-[#0A3977] cursor-pointer w-4 h-4 transition"
                        />
                      </div>
                    </td>

                    {/* APPLICANT DETAILS (Clickable Overview Trigger) */}
                    <td className="py-4 px-4">
                      <div
                        onClick={() => setSelectedLeadForOverview(item)}
                        className="flex items-start gap-3.5 cursor-pointer group"
                        title="Click to view full lead overview & application dossier"
                      >
                        <div className={`w-10 h-10 rounded-2xl ${item.avatarBg || 'bg-[#0A3977]'} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all mt-0.5 relative`}>
                          <span>{item.initials || 'AP'}</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-slate-900 text-sm group-hover:text-[#0A3977] group-hover:underline transition-colors flex items-center gap-1.5 truncate">
                            <span className="truncate">{item.applicantName || item.name || 'Applicant'}</span>
                            <Eye className="w-3.5 h-3.5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200" title={`ID: ${item.id}`}>
                              {item.displayId || item.loanNo || itemId}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{item.mobile || (item.phone ? `+91 ${item.phone}` : '—')}</span>
                          </div>
                          {item.email && item.email !== '—' && !item.email.includes('@paisainminutes.com') && (
                            <a
                              href={`mailto:${item.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-slate-500 hover:text-blue-600 truncate max-w-[180px] flex items-center gap-1 mt-0.5 transition-colors"
                              title={`Send email to ${item.email}`}
                            >
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNED LENDING PARTNER (Premium Custom SaaS Dropdown Trigger) */}
                    <td className="py-4 px-4">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          data-popover-trigger="partner"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenStatusDropdownId(null);
                            setStatusDropdownAnchor(null);
                            if (openPartnerDropdownId === itemId) {
                              setOpenPartnerDropdownId(null);
                              setPartnerDropdownAnchor(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setPartnerDropdownAnchor({ rect, itemId, item });
                              setPartnerFilterQuery('');
                              setOpenPartnerDropdownId(itemId);
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-black border transition-all cursor-pointer shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${companyBadge.classes} ${openPartnerDropdownId === itemId ? 'ring-2 ring-[#0A3977] shadow-sm' : ''}`}
                          title="Click to assign lead to any lending partner"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${companyBadge.dot} shadow-2xs`}></span>
                          <span className="truncate max-w-[145px]">{companyBadge.name}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${openPartnerDropdownId === itemId ? 'rotate-180 text-slate-800' : 'opacity-60'}`} />
                        </button>
                      </div>
                    </td>

                    {/* APPLIED TO */}
                    <td className="py-4 px-4">
                      {item.appliedTo && item.appliedTo !== 'Not Applied Yet' && item.appliedTo !== 'Pending Details' && item.appliedTo !== 'Pending Selection' ? (
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                            <span className="truncate max-w-[130px]">{item.appliedTo}</span>
                          </div>
                          {item.delivery_status && item.delivery_status !== 'none' && (
                            <div className="mt-1 flex items-center gap-1 text-[10px]">
                              {item.delivery_status === 'delivered' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  API Pushed
                                </span>
                              ) : item.delivery_status === 'failed' ? (
                                <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  Push Failed
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>Not Applied</span>
                        </span>
                      )}
                    </td>

                    {/* ELIGIBILITY & CIBIL */}
                    <td className="py-4 px-4">
                      <div>
                        {eligInfo.isPhoneOnly ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Phone Verified Only</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>{eligInfo.label}</span>
                          </span>
                        )}
                      </div>
                      {item.cibilScore && Number(item.cibilScore) > 0 ? (
                        <div className="text-[10px] font-black text-indigo-700 bg-indigo-50/90 px-2.5 py-1 rounded-xl border border-indigo-200/80 mt-1.5 inline-flex items-center gap-1.5 shadow-2xs">
                          <CreditCard className="w-3 h-3 text-indigo-500" />
                          <span>CIBIL: {item.cibilScore}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-medium mt-1">
                          CIBIL: Not Available
                        </div>
                      )}
                    </td>

                    {/* APPLIED AMOUNT */}
                    <td className="py-4 px-4">
                      {cleanLoanAmount(item.applied || item.loanAmount) > 0 ? (
                        <div>
                          <span className="text-sm font-black text-slate-900 tracking-tight flex items-center">
                            <IndianRupee className="w-3.5 h-3.5 text-slate-600 inline" />
                            {Number(cleanLoanAmount(item.applied || item.loanAmount) || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5">Applied Amount</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold text-xs">—</span>
                      )}
                    </td>

                    {/* SALARY / LOCATION */}
                    <td className="py-4 px-4">
                      {cleanSalary(item.salary, item.sal_val, item.salary_range) > 0 ? (
                        <div className="font-extrabold text-slate-800 text-xs flex items-center">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-500 inline" />
                          {Number(cleanSalary(item.salary, item.sal_val, item.salary_range) || 0).toLocaleString('en-IN')}/mo
                        </div>
                      ) : (
                        <div className="text-slate-400 font-bold text-xs">—</div>
                      )}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.location || (item.city && item.city !== '—' ? item.city : 'Online')}</span>
                      </div>
                    </td>

                    {/* SOURCE / CHANNEL */}
                    <td className="py-4 px-4">
                      <ChannelBadge lead={item} showCampaign />
                    </td>

                    {/* STATUS (Custom React Popover Portal - ZERO clipping!) */}
                    <td className="py-4 px-4">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          data-popover-trigger="status"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPartnerDropdownId(null);
                            setPartnerDropdownAnchor(null);
                            if (openStatusDropdownId === itemId) {
                              setOpenStatusDropdownId(null);
                              setStatusDropdownAnchor(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setStatusDropdownAnchor({ rect, itemId, item });
                              setOpenStatusDropdownId(itemId);
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-black border transition-all ${statusBadge.classes} shadow-2xs hover:shadow-sm cursor-pointer`}
                          title="Click to update workflow status"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusBadge.dot} animate-pulse`}></span>
                          <span>{formatStatusLabel(item.status) || statusBadge.label || 'Fresh'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openStatusDropdownId === itemId ? 'rotate-180 text-slate-800' : 'opacity-60'}`} />
                        </button>
                      </div>
                    </td>

                    {/* CREATED */}
                    <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {(() => {
                        const ist = formatToIST(item.created || item.created_at || item.createdAt || item.date);
                        return (
                          <>
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{ist.date}</span>
                            </div>
                            {ist.time && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5 pl-4">
                                {ist.time}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Overview Trigger */}
                        <button
                          onClick={() => setSelectedLeadForOverview(item)}
                          className="p-2 bg-blue-50 text-[#0A3977] hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-2xs hover:shadow cursor-pointer"
                          title="View Full Lead Overview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.mobile && (
                          <a
                            href={`tel:${item.mobile.replace(/\D/g, '')}`}
                            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-2xs hover:shadow"
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
                            className="p-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-2xs hover:shadow"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {canDeleteLeads && (
                        <button
                          onClick={() => handleDeleteSingle(item, idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">No leads matching current filters</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      New applications from <span className="text-[#0A3977] font-bold">paisainminutes.com</span> will appear here automatically.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedPartnerFilter('ALL');
                        handleFilterClick('All Leads');
                        setSearchQuery('');
                        setSelectedDatePreset('ALL');
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      className="mt-4 px-4 py-2 text-xs font-extrabold bg-[#0A3977] hover:bg-blue-900 text-white rounded-2xl shadow transition cursor-pointer"
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

      {filteredLeads.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-600">
          <span>Showing {pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length} leads (10 per page)</span>
          <div className="flex items-center gap-1.5">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Previous</button>
            {pageNumbers.map((n, i) => (
              <React.Fragment key={n}>
                {i > 0 && n - pageNumbers[i - 1] > 1 && <span className="px-1">…</span>}
                <button type="button" onClick={() => setPage(n)} className={`min-w-8 px-2.5 py-1.5 rounded-lg border cursor-pointer ${n === currentPage ? 'bg-[#0A3977] text-white border-[#0A3977]' : 'bg-white border-slate-300 hover:bg-slate-50'}`}>{n}</button>
              </React.Fragment>
            ))}
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}

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
              <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${testFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                {testFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleTestApplySubmit} className="space-y-4">
              {/* Payload Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setTestShowFullFields(false)}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${!testShowFullFields ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Minimal Payload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTestShowFullFields(true);
                    if (!testEmail) setTestEmail('test.applicant@example.com');
                    if (!testCompanyName) setTestCompanyName('Test Corp Ltd');
                    if (!testCity) setTestCity('Delhi');
                    if (!testState) setTestState('Delhi');
                    if (!testPincode) setTestPincode('110001');
                    if (!testDob) setTestDob('2000-01-01');
                    if (!testCreditCardLimit) setTestCreditCardLimit('100000');
                    if (!testPan) setTestPan('ABCDE1234F');
                    if (!testSelectedLenderId) setTestSelectedLenderId('1');
                    if (!testLenderApplicationId) setTestLenderApplicationId('PARTNER-APP-7890');
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${testShowFullFields ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Complete Canonical Payload
                </button>
              </div>

              {/* Core / Minimal Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary / Income (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 55000"
                    value={testSalary}
                    onChange={(e) => setTestSalary(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    value={testTenure}
                    onChange={(e) => setTestTenure(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                  />
                </div>
              </div>

              {/* Extended Fields in Complete Payload Mode */}
              {testShowFullFields && (
                <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                    Additional Lead Data Fields
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                      <select
                        value={testEmploymentType}
                        onChange={(e) => setTestEmploymentType(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white"
                      >
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Business">Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Test Corp Ltd"
                        value={testCompanyName}
                        onChange={(e) => setTestCompanyName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Salary Mode</label>
                      <select
                        value={testSalaryMode}
                        onChange={(e) => setTestSalaryMode(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white"
                      >
                        <option value="Bank">Bank</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card (Secure)</label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="e.g. ABCDE1234F"
                        value={testPan}
                        onChange={(e) => setTestPan(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="Delhi"
                        value={testCity}
                        onChange={(e) => setTestCity(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="Delhi"
                        value={testState}
                        onChange={(e) => setTestState(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="110001"
                        value={testPincode}
                        onChange={(e) => setTestPincode(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        value={testDob}
                        onChange={(e) => setTestDob(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={testGender}
                        onChange={(e) => setTestGender(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Has Credit Card?</label>
                      <select
                        value={testHaveCreditCard}
                        onChange={(e) => setTestHaveCreditCard(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white font-bold"
                      >
                        <option value="Yes">Yes (Has Card)</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Credit Card Limit (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 100000"
                        value={testCreditCardLimit}
                        onChange={(e) => setTestCreditCardLimit(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Selected Lender (Backend ID)</label>
                      <select
                        value={testSelectedLenderId}
                        onChange={(e) => setTestSelectedLenderId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none bg-white font-bold"
                      >
                        <option value="">None / Pending Selection</option>
                        {lenders.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.name} (ID: {l.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lender Application ID</label>
                      <input
                        type="text"
                        placeholder="e.g. PARTNER-APP-7890"
                        value={testLenderApplicationId}
                        onChange={(e) => setTestLenderApplicationId(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CIBIL Score (300–900)</label>
                <input
                  type="number"
                  min="300"
                  max="900"
                  placeholder="e.g. 720"
                  value={testCibil}
                  onChange={(e) => setTestCibil(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A3977] focus:outline-none font-bold"
                />
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
                  <span>{isSubmittingTest ? 'Submitting...' : 'Submit Test Lead'}</span>
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

            {manualFeedback && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-3 ${manualFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {manualFeedback.message}
              </div>
            )}

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
                  <option value="AUTO">✨ Auto (750+ Rupay91, &lt;750 Jhatpat Loans)</option>
                  <option value="Rupay91">💳 Rupay91</option>
                  <option value="Jhatpat Loans">⚡ Jhatpat Loans</option>
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
                  disabled={isSubmittingManual}
                  className="px-4 py-2 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow disabled:opacity-50"
                >
                  {isSubmittingManual ? 'Creating...' : 'Create Lead'}
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
                        {activeOverviewLead.applicantName || activeOverviewLead.name || 'Applicant'}
                      </h2>
                      <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/20 text-blue-100 border border-white/20">
                        {formatStatusLabel(activeOverviewLead.status) || activeOverviewLead.statusLabel || 'Fresh'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-blue-100/80 font-mono">
                      <span>ID: {activeOverviewLead.displayId || activeOverviewLead.loanNo || activeOverviewLead.id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeOverviewLead.displayId || activeOverviewLead.loanNo || activeOverviewLead.id, 'id')}
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
                      ? `₹${Number(cleanLoanAmount(activeOverviewLead.applied || activeOverviewLead.loanAmount)).toLocaleString('en-IN')}`
                      : '—'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Monthly Salary</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-slate-900">
                    {cleanSalary(activeOverviewLead.salary, activeOverviewLead.sal_val, activeOverviewLead.salary_range) > 0
                      ? `₹${Number(cleanSalary(activeOverviewLead.salary, activeOverviewLead.sal_val, activeOverviewLead.salary_range)).toLocaleString('en-IN')}/mo`
                      : '—'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CIBIL Score</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-700">
                    {activeOverviewLead.cibilScore && Number(activeOverviewLead.cibilScore) > 0 ? activeOverviewLead.cibilScore : 'Not Available'}
                  </div>
                  {activeOverviewLead.bureauCheckedAt && (
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Checked {new Date(activeOverviewLead.bureauCheckedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  {canEditLeads && (
                    <button
                      type="button"
                      onClick={() => handleRefreshScore(activeOverviewLead)}
                      disabled={refreshingScoreId === activeOverviewLead.id}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 disabled:opacity-50 cursor-pointer"
                      title="Fetch a new score from the bureau (paid call)"
                    >
                      <RotateCw className={`w-3 h-3 ${refreshingScoreId === activeOverviewLead.id ? 'animate-spin' : ''}`} />
                      {refreshingScoreId === activeOverviewLead.id ? 'Refreshing…' : 'Refresh score'}
                    </button>
                  )}
                  {/after 3 attempts|in progress/i.test(activeOverviewLead.cibilStatus || '') && (
                    <div className="text-[10px] text-amber-700 font-medium mt-0.5">{/after 3 attempts/i.test(activeOverviewLead.cibilStatus) ? 'Score pending: the bureau could not be reached 3 times. Use Refresh score.' : 'Score is being fetched…'}</div>
                  )}
                  {canEditLeads && (
                    <button
                      type="button"
                      onClick={() => handleSignOutCustomer(activeOverviewLead)}
                      className="mt-1 block text-[11px] font-bold text-slate-500 hover:text-rose-700 cursor-pointer"
                      title="End every device login of this customer"
                    >
                      Sign customer out everywhere
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Company</span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#0A3977]">
                    {activeOverviewLead.selectedLenderId || activeOverviewLead.assignedCompany || 'Pending Selection'}
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
                      <span className="font-bold text-slate-900">{activeOverviewLead.applicantName || activeOverviewLead.name || 'Applicant'}</span>
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
                      <span className="text-slate-400 font-medium">Date of Birth:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.dob || activeOverviewLead.dateOfBirth || activeOverviewLead.date_of_birth || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Gender:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.gender || activeOverviewLead.sex || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">PAN Card:</span>
                      <span className="font-bold font-mono text-slate-900">
                        {activeOverviewLead.panMasked || (activeOverviewLead.pan && activeOverviewLead.pan !== '—' ? maskPan(activeOverviewLead.pan) : '—')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Address Type:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.addressType || activeOverviewLead.address_type || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">City / State:</span>
                      <span className="font-bold text-slate-900">
                        {activeOverviewLead.city || activeOverviewLead.state ? `${activeOverviewLead.city || ''}${activeOverviewLead.city && activeOverviewLead.state ? ', ' : ''}${activeOverviewLead.state || ''}` : 'Online'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Pincode:</span>
                      <span className="font-bold font-mono text-slate-900">{activeOverviewLead.pincode && activeOverviewLead.pincode !== '—' ? activeOverviewLead.pincode : '—'}</span>
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
                      <span className="text-slate-400 font-medium">Salary Mode:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.salaryMode || activeOverviewLead.modeOfSalary || activeOverviewLead.mode_of_salary || activeOverviewLead.salary_mode || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Company Name:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.companyName || activeOverviewLead.company_name || activeOverviewLead.employer || '—'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Has Credit Card:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${String(activeOverviewLead.haveCreditCard || activeOverviewLead.have_credit_card).toLowerCase() === 'yes'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700'
                        }`}>
                        {activeOverviewLead.haveCreditCard || activeOverviewLead.have_credit_card || 'No'}
                      </span>
                    </div>

                    {String(activeOverviewLead.haveCreditCard || activeOverviewLead.have_credit_card).toLowerCase() === 'yes' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Credit Card Limit:</span>
                        <span className="font-bold text-slate-900">
                          {(activeOverviewLead.creditCardLimit || activeOverviewLead.credit_card_limit)
                            ? `₹${Number(activeOverviewLead.creditCardLimit || activeOverviewLead.credit_card_limit).toLocaleString('en-IN')}`
                            : '—'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Loan Purpose:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.purpose || 'Personal Loan'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Source / Channel:</span>
                      <ChannelBadge lead={activeOverviewLead} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Eligibility:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/50">
                        {overviewElig?.label || activeOverviewLead.eligibilityStatus || 'Eligible'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Credit Manager:</span>
                      <span className="font-bold text-slate-900">{activeOverviewLead.creditManager || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Submission Date:</span>
                      <span className="font-bold text-slate-700">
                        {formatToIST(activeOverviewLead.created || activeOverviewLead.created_at || activeOverviewLead.createdAt || activeOverviewLead.date).full}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Salary-Based Matched Loan Offers Section */}
              {(() => {
                const salaryOffers = getSalaryMatchedOffers(
                  activeOverviewLead.salary || activeOverviewLead.monthlySalary || activeOverviewLead.monthly_salary || activeOverviewLead.sal_val
                );
                return (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <h4 className="text-xs font-extrabold text-[#0A3977] uppercase tracking-wider">
                            Matched Lending Offers by Monthly Salary
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Based on applicant monthly income of <strong className="text-slate-800">₹{Number(salaryOffers.salary || 0).toLocaleString('en-IN')}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {salaryOffers.eligible.length} Eligible
                        </span>
                        {salaryOffers.ineligible.length > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {salaryOffers.ineligible.length} Locked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Eligible Lending Partners Grid */}
                    <div>
                      <div className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1.5 mb-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Eligible Pre-Approved Lenders ({salaryOffers.eligible.length})</span>
                      </div>

                      {salaryOffers.eligible.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {salaryOffers.eligible.map(p => {
                            const isAssigned = (activeOverviewLead.assignedCompany === p.name);
                            return (
                              <div
                                key={p.id}
                                className={`p-3 rounded-xl border transition flex flex-col justify-between ${isAssigned
                                  ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                                  : 'bg-emerald-50/30 border-emerald-200/80 hover:bg-emerald-50/70'
                                  }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <span className="font-extrabold text-xs text-slate-900">{p.name}</span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      Min ₹{(p.minSalary / 1000).toFixed(0)}k
                                    </span>
                                  </div>
                                  <div className="text-[10.5px] text-slate-600 space-y-0.5 mb-2">
                                    <div>Interest: <strong className="text-emerald-700">{p.interestRate || 'Up to 1.0% / day'}</strong></div>
                                    <div>Tenure: <span className="font-medium text-slate-700">{p.tenure || '30 - 45 Days'}</span></div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 pt-2 border-t border-emerald-200/60">
                                  <button
                                    type="button"
                                    onClick={() => handleReassignCompanyInModal(getLeadId(activeOverviewLead), p.name)}
                                    className={`text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer grow text-center ${isAssigned
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : 'bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-300'
                                      }`}
                                  >
                                    {isAssigned ? '✓ Assigned' : 'Assign to this'}
                                  </button>
                                  <a
                                    href={getPartnerTrackingUrl(p, { leadId: getLeadId(activeOverviewLead), phone: activeOverviewLead.phone })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 cursor-pointer"
                                    title={`Open ${p.name} application`}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                          No lenders matched for current salary. Minimum requirement across all partners is ₹25,000/month.
                        </div>
                      )}
                    </div>

                    {/* Ineligible / Locked Lenders */}
                    {salaryOffers.ineligible.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1.5 mb-2.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Ineligible Lending Partners ({salaryOffers.ineligible.length} • Higher Income Required)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {salaryOffers.ineligible.map(p => {
                            const shortfall = Math.max(0, p.minSalary - (salaryOffers.salary || 0));
                            return (
                              <div
                                key={p.id}
                                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 text-slate-500 opacity-85 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <span className="font-bold text-xs text-slate-700">{p.name}</span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                      Min ₹{(p.minSalary / 1000).toFixed(0)}k Req.
                                    </span>
                                  </div>
                                  <div className="text-[10.5px] text-slate-500 space-y-0.5 mb-2">
                                    <div className="text-rose-600 font-semibold">Shortfall: -₹{shortfall.toLocaleString('en-IN')}/mo</div>
                                    <div>Rate: {p.interestRate || 'Up to 1.0% / day'} • {p.tenure || '30 - 45 Days'}</div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200 text-center">
                                  <span className="text-[10.5px] font-bold text-slate-400 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Income criteria not met</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Interactive Assignment & Status Control Card */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Lead Workflow & Partner Management</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Selected Lender (Backend Lenders Table) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Selected Lender:
                    </label>
                    <select
                      value={activeOverviewLead.selectedLenderId || 'Pending Selection'}
                      onChange={(e) => handleLenderChange(getLeadId(activeOverviewLead), e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer shadow-2xs"
                    >
                      <option value="Pending Selection">Pending Selection</option>
                      {lenders.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name} (ID: {l.id})
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
                      value={normalizeStatus(activeOverviewLead.status) || 'FRESH'}
                      onChange={(e) => handleStatusChangeInModal(getLeadId(activeOverviewLead), e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3977] cursor-pointer shadow-2xs"
                    >
                      <option value="FRESH">Fresh</option>
                      <option value="CALLBACK">Callback</option>
                      <option value="INTERESTED">Interested</option>
                      <option value="APPROVED">Approved</option>
                      <option value="DISBURSED">Disbursed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  {/* Lender Application ID */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Lender Application ID:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PARTNER-APP-12345"
                      defaultValue={activeOverviewLead.lenderApplicationId || ''}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val !== (activeOverviewLead.lenderApplicationId || '')) {
                          updateLoanApplication(getLeadId(activeOverviewLead), { lenderApplicationId: val });
                          if (setLeads) {
                            setLeads(prev => prev.map(l => getLeadId(l) === getLeadId(activeOverviewLead) ? { ...l, lenderApplicationId: val || null } : l));
                          }
                        }
                      }}
                      className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3977] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Outbound Partner Portal Action with UTM Tracking */}
                <div className="pt-2.5 border-t border-blue-200/50 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Outbound Partner Portal (Attribution & UTM Tracked):
                  </span>
                  {activeOverviewLead.assignedCompany && activeOverviewLead.assignedCompany !== 'Pending Selection' && activeOverviewLead.assignedCompany !== 'Pending Details' ? (
                    <a
                      href={getPartnerTrackingUrl(
                        activeOverviewLead.assignedCompany,
                        {
                          leadId: getLeadId(activeOverviewLead),
                          phone: activeOverviewLead.mobile || activeOverviewLead.phone,
                          source: 'crm_lead_overview'
                        }
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackPartnerClick(
                        activeOverviewLead.assignedCompany,
                        {
                          leadId: getLeadId(activeOverviewLead),
                          phone: activeOverviewLead.mobile || activeOverviewLead.phone,
                          source: 'crm_lead_overview'
                        }
                      )}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A3977] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                      title="Open Partner Application with Lead ID & UTMs Tracked"
                    >
                      <span>Visit {activeOverviewLead.assignedCompany}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 cursor-not-allowed">
                      <span>No Partner Selected Yet</span>
                    </span>
                  )}
                </div>

              </div>

              {/* Event Timeline & Partner Delivery Tracking */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Partner Lead Tracking & Event Timeline</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleManualApiPush(activeOverviewLead)}
                    disabled={isPushingApi}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition cursor-pointer border border-indigo-200"
                  >
                    <Send className={`w-3.5 h-3.5 ${isPushingApi ? 'animate-pulse text-indigo-500' : ''}`} />
                    <span>{isPushingApi ? 'Pushing Lead...' : 'Push to Partner API'}</span>
                  </button>
                </div>

                <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2 pt-1 pb-1">
                  {/* Node 1: Lead Assigned */}
                  <div className="relative">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute -left-[31px] top-0.5 shadow-xs ${
                      activeOverviewLead.assignedCompany && activeOverviewLead.assignedCompany !== 'Pending Selection'
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}></span>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 text-xs">
                        {activeOverviewLead.assignedCompany && activeOverviewLead.assignedCompany !== 'Pending Selection'
                          ? `Assigned to ${activeOverviewLead.assignedCompany}`
                          : 'Pending Partner Selection'}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeOverviewLead.created || activeOverviewLead.created_at || 'Lead Created'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {activeOverviewLead.assignedCompany && activeOverviewLead.assignedCompany !== 'Pending Selection'
                        ? `Lead assigned to ${activeOverviewLead.assignedCompany}. Partner status: ${activeOverviewLead.partnerStatusLabel || 'Assigned'}. Outbound clicks and API routing are tracked.`
                        : 'No partner assigned yet. Status is Pending Selection.'}
                    </div>
                  </div>

                  {/* Node 2: Outbound Clicked / Applied */}
                  {activeOverviewLead.appliedTo && activeOverviewLead.appliedTo !== 'Not Applied Yet' && activeOverviewLead.appliedTo !== 'Pending Details' && activeOverviewLead.appliedTo !== 'Pending Selection' ? (
                    <div className="relative">
                      <span className="w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white absolute -left-[31px] top-0.5 shadow-xs animate-pulse"></span>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-purple-800 text-xs flex items-center gap-1.5">
                          <span>User Clicked "Apply Now" → Redirected to {activeOverviewLead.appliedTo}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeOverviewLead.applied_at || 'Clicked'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Internal route <code className="bg-slate-100 px-1 rounded text-purple-700 font-mono">/api/public/redirect/{activeOverviewLead.assignedPartnerSlug || 'partner'}</code> triggered 302 redirect with <code className="bg-slate-100 px-1 rounded font-mono">sub_id={getLeadId(activeOverviewLead)}</code>.
                      </div>
                    </div>
                  ) : (
                    <div className="relative opacity-60">
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white absolute -left-[31px] top-0.5"></span>
                      <div className="font-bold text-slate-600 text-xs">
                        Awaiting Applicant Click on Partner Offer
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Applicant has not yet clicked / applied to any partner on the website.
                      </div>
                    </div>
                  )}

                  {/* Node 3: API / Webhook Push */}
                  {activeOverviewLead.delivery_status && activeOverviewLead.delivery_status !== 'none' ? (
                    <div className="relative">
                      <span className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute -left-[31px] top-0.5 shadow-xs ${activeOverviewLead.delivery_status === 'delivered' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></span>
                      <div className="flex items-center justify-between">
                        <div className={`font-bold text-xs ${activeOverviewLead.delivery_status === 'delivered' ? 'text-emerald-800' : 'text-rose-800'
                          }`}>
                          API Delivery: {activeOverviewLead.delivery_status === 'delivered' ? 'Successfully Delivered' : 'Delivery Failed'}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeOverviewLead.delivery_at || 'API Pushed'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Target: {activeOverviewLead.delivery_partner || activeOverviewLead.assignedCompany || 'Partner API'}
                      </div>
                    </div>
                  ) : null}

                  {/* Node 4: Dynamic Events from lead_partner_events */}
                  {leadEvents.length > 0 && leadEvents.map((evt, eIdx) => {
                    const isPostback = evt.event_type === 'postback';
                    const isClick = evt.event_type === 'clicked';
                    const isPush = evt.event_type === 'api_pushed';
                    const isStatus = evt.event_type === 'status_updated';

                    let dotColor = 'bg-blue-500';
                    let title = `Event: ${evt.event_type}`;
                    if (isPostback) {
                      dotColor = 'bg-emerald-600';
                      title = `Postback Received: ${evt.status || 'Converted'}`;
                    } else if (isClick) {
                      dotColor = 'bg-purple-600';
                      title = `Outbound Click Tracked (${evt.partner_name || evt.partner_id})`;
                    } else if (isPush) {
                      dotColor = evt.status === 'delivered' ? 'bg-emerald-500' : 'bg-rose-500';
                      title = `API Push ${evt.status === 'delivered' ? 'Delivered' : 'Failed'}`;
                    } else if (isStatus) {
                      dotColor = 'bg-amber-500';
                      title = `Status Updated to "${evt.details?.status || evt.status}"`;
                    }

                    return (
                      <div key={evt.id || eIdx} className="relative">
                        <span className={`w-3.5 h-3.5 rounded-full border-2 border-white absolute -left-[31px] top-0.5 shadow-xs ${dotColor}`}></span>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-800 text-xs">{title}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{evt.created_at}</span>
                        </div>
                        {evt.ip && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            IP: {evt.ip} {evt.details?.target_url ? `• Destination: ${evt.details.target_url.slice(0, 45)}...` : ''}
                          </div>
                        )}
                        {evt.details?.remarks && (
                          <div className="text-[11px] text-slate-600 italic mt-0.5">
                            "{evt.details.remarks}"
                          </div>
                        )}
                      </div>
                    );
                  })}
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

      {/* Floating Portal: Partner Popover (Completely escapes table overflow and header) */}
      {openPartnerDropdownId && partnerDropdownAnchor && createPortal(
        (() => {
          const { rect, itemId, item } = partnerDropdownAnchor;
          const currentLead = leads.find((l, i) => getLeadId(l, i) === itemId) || item;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const openUp = spaceBelow < 340 && spaceAbove > spaceBelow;
          const width = 310;
          const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 16));
          const eligInfo = getEligibilityInfo(currentLead);
          const currentPartner = currentLead.assignedCompany || eligInfo.partner || 'Pending Details';
          const companyBadge = getCompanyBadge(currentPartner);
          const availableSpace = openUp ? Math.max(260, spaceAbove - 20) : Math.max(260, spaceBelow - 20);
          const maxHeight = Math.min(480, availableSpace);

          const q = (partnerFilterQuery || '').toLowerCase().trim();
          const filteredPartners = AFFILIATE_PARTNERS.filter(p => {
            if (!q) return true;
            return (p.name || '').toLowerCase().includes(q) ||
              (p.tagline || '').toLowerCase().includes(q) ||
              (p.description || '').toLowerCase().includes(q);
          });
          const showPendingSelection = !q || 'pending selection'.includes(q) || 'awaiting'.includes(q) || 'choice'.includes(q) || 'pending'.includes(q);

          return (
            <div
              data-popover-portal="partner"
              style={{
                position: 'fixed',
                left: `${left}px`,
                ...(openUp
                  ? { bottom: `${window.innerHeight - rect.top + 6}px` }
                  : { top: `${rect.bottom + 6}px` }),
                maxHeight: `${maxHeight}px`,
                zIndex: 99999
              }}
              className="w-[310px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 animate-fade-in flex flex-col overflow-hidden ring-1 ring-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0A3977]" />
                  <span className="text-slate-700 font-extrabold">Assign Lending Partner</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {AFFILIATE_PARTNERS.length + 1} Options
                </span>
              </div>

              {/* Quick Filter Partner Input */}
              <div className="pt-2 pb-1.5 px-0.5 shrink-0">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={partnerFilterQuery}
                    onChange={(e) => setPartnerFilterQuery(e.target.value)}
                    placeholder="Search partner or scroll..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A3977] focus:bg-white text-slate-800 placeholder:text-slate-400 font-medium transition"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  {partnerFilterQuery && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPartnerFilterQuery('');
                      }}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/60"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list container */}
              <div
                className="pt-1.5 space-y-1 overflow-y-auto flex-1 min-h-[140px] pr-1 dropdown-scrollbar"
                style={{
                  maxHeight: `${Math.min(320, Math.max(160, maxHeight - 95))}px`,
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch'
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {/* Pending Selection Option */}
                {showPendingSelection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReassignCompany(itemId, 'Pending Selection');
                      setOpenPartnerDropdownId(null);
                      setPartnerDropdownAnchor(null);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer group ${companyBadge.name === 'Pending Selection'
                      ? 'bg-amber-50 text-amber-900 font-black ring-1 ring-amber-300 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-600 font-bold'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      </div>
                      <div className="truncate text-left">
                        <div className="font-extrabold leading-tight text-slate-800 group-hover:text-amber-900">Pending Selection</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">Awaiting applicant choice</div>
                      </div>
                    </div>
                    {companyBadge.name === 'Pending Selection' && (
                      <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                )}

                {/* All Partners */}
                {filteredPartners.map(p => {
                  const isCurrent = (companyBadge.name || '').toLowerCase() === p.name.toLowerCase();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReassignCompany(itemId, p.name);
                        setOpenPartnerDropdownId(null);
                        setPartnerDropdownAnchor(null);
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer group ${isCurrent
                        ? 'bg-blue-50/90 text-[#0A3977] font-black ring-1 ring-blue-300 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs text-white"
                          style={{ backgroundColor: p.accentColor || '#0A3977' }}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate text-left">
                          <div className="font-extrabold text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{p.tagline || p.description || 'Lending Partner'}</div>
                        </div>
                      </div>
                      {isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-[#0A3977] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      )}
                    </button>
                  );
                })}

                {!showPendingSelection && filteredPartners.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No lending partner matches "{partnerFilterQuery}"
                  </div>
                )}
              </div>

              {/* Micro-footer tip */}
              <div className="px-2 pt-2 pb-0.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium select-none shrink-0">
                <span>Scroll or type to search</span>
                <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">ESC</span>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* Floating Portal: Status Popover (Completely escapes table overflow and header) */}
      {openStatusDropdownId && statusDropdownAnchor && createPortal(
        (() => {
          const { rect, itemId, item } = statusDropdownAnchor;
          const currentLead = leads.find((l, i) => getLeadId(l, i) === itemId) || item;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const openUp = spaceBelow < 300 && spaceAbove > spaceBelow;
          const width = 224;
          const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 16));
          const availableSpace = openUp ? Math.max(180, spaceAbove - 20) : Math.max(180, spaceBelow - 20);
          const maxHeight = Math.min(460, availableSpace);

          const statusOptions = [
            { id: 'FRESH', label: 'Fresh', dot: 'bg-sky-500', bg: 'hover:bg-sky-50 text-sky-800' },
            { id: 'CALLBACK', label: 'Callback', dot: 'bg-amber-500', bg: 'hover:bg-amber-50 text-amber-800' },
            { id: 'INTERESTED', label: 'Interested', dot: 'bg-purple-500', bg: 'hover:bg-purple-50 text-purple-800' },
            { id: 'APPROVED', label: 'Approved', dot: 'bg-emerald-500', bg: 'hover:bg-emerald-50 text-emerald-800' },
            { id: 'DISBURSED', label: 'Disbursed', dot: 'bg-teal-500', bg: 'hover:bg-teal-50 text-teal-800' },
            { id: 'REJECTED', label: 'Rejected', dot: 'bg-rose-500', bg: 'hover:bg-rose-50 text-rose-800' },
          ];

          return (
            <div
              data-popover-portal="status"
              style={{
                position: 'fixed',
                left: `${left}px`,
                ...(openUp
                  ? { bottom: `${window.innerHeight - rect.top + 6}px` }
                  : { top: `${rect.bottom + 6}px` }),
                maxHeight: `${maxHeight}px`,
                zIndex: 99999
              }}
              className="w-56 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-2 animate-fade-in flex flex-col overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 shrink-0 select-none">
                <span>Update Status</span>
                <GitMerge className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div
                className="pt-1.5 space-y-1 overflow-y-auto flex-1 min-h-0 pr-1 select-none dropdown-scrollbar"
                style={{
                  maxHeight: `${Math.min(320, Math.max(180, maxHeight - 50))}px`,
                  overscrollBehavior: 'contain'
                }}
              >
                {statusOptions.map(st => {
                  const isCurrent = normalizeStatus(currentLead.status) === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(itemId, st.id);
                        setOpenStatusDropdownId(null);
                        setStatusDropdownAnchor(null);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all cursor-pointer ${isCurrent
                        ? 'bg-slate-100 text-slate-900 font-black ring-1 ring-slate-300 shadow-2xs'
                        : `${st.bg} font-bold`
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${st.dot}`}></span>
                        <span>{st.label}</span>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-slate-700 shrink-0 font-bold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })(),
        document.body
      )}

    </div>
  );
}
