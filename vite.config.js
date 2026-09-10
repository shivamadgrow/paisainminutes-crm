import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LEADS_FILE = path.resolve(__dirname, 'leads_store.json')
const DELETED_FILE = path.resolve(__dirname, 'deleted_leads.json')

function getStoredLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8').replace(/^\uFEFF/, '').trim()
      return JSON.parse(data || '[]')
    }
  } catch (err) {
    console.error('Error reading leads_store.json:', err)
  }
  return []
}

function saveStoredLeads(leads) {
  try {
    const newContent = JSON.stringify(leads || [], null, 2);
    if (fs.existsSync(LEADS_FILE)) {
      const existing = fs.readFileSync(LEADS_FILE, 'utf-8').replace(/^\uFEFF/, '').trim();
      if (existing === newContent) return;
    }
    fs.writeFileSync(LEADS_FILE, newContent, 'utf-8');
  } catch (err) {
    console.error('Error writing leads_store.json:', err);
  }
}

function getDeletedIds() {
  try {
    if (fs.existsSync(DELETED_FILE)) {
      const data = fs.readFileSync(DELETED_FILE, 'utf-8').replace(/^\uFEFF/, '').trim();
      return new Set(JSON.parse(data || '[]').map(String));
    }
  } catch (e) { }
  return new Set();
}

function addDeletedIds(ids) {
  try {
    const current = getDeletedIds();
    for (const id of ids) {
      if (id) current.add(String(id));
    }
    fs.writeFileSync(DELETED_FILE, JSON.stringify([...current], null, 2), 'utf-8');
  } catch (e) { }
}

function cleanLoanAmount(raw) {
  if (raw === null || raw === undefined || raw === '') return 50000;
  if (typeof raw === 'string') {
    const parts = raw.replace(/,/g, '').split(/[-–—to]/i).map(s => s.replace(/\D/g, '')).filter(Boolean);
    if (parts.length >= 2) {
      const n1 = Number(parts[0]);
      const n2 = Number(parts[1]);
      if (!isNaN(n2) && n2 > 0) return n2;
      if (!isNaN(n1) && n1 > 0) return n1;
    }
  }
  let num = Number(String(raw).replace(/[^\d.]/g, ''));
  if (isNaN(num) || num <= 0) return 50000;
  if (num > 500000) {
    const s = String(Math.floor(num));
    for (let i = 3; i <= 6; i++) {
      if (i < s.length) {
        const p1 = Number(s.slice(0, i));
        const p2 = Number(s.slice(i));
        if (p1 >= 1000 && p1 <= 500000 && p2 >= 1000 && p2 <= 1000000 && p2 >= p1) {
          return p2;
        }
      }
    }
    if (num > 1000000) return 50000;
  }
  return num;
}

function cleanSalary(raw, salVal, salRange) {
  if (salVal !== null && salVal !== undefined && salVal !== '') {
    const sv = Number(salVal);
    if (!isNaN(sv) && sv >= 5000 && sv <= 500000) {
      return sv;
    }
  }
  const textToCheck = String(salRange || raw || '');
  if (
    textToCheck.includes('-') ||
    textToCheck.includes('–') ||
    textToCheck.includes('—') ||
    textToCheck.toLowerCase().includes('to')
  ) {
    const parts = textToCheck.replace(/,/g, '').split(/[-–—to]/i).map(s => s.replace(/\D/g, '')).filter(Boolean);
    if (parts.length >= 2) {
      const n1 = Number(parts[0]);
      const n2 = Number(parts[1]);
      if (!isNaN(n1) && !isNaN(n2) && n1 > 0 && n2 > 0) {
        return Math.round((n1 + n2) / 2);
      }
      if (!isNaN(n1) && n1 > 0) return n1;
    }
  }
  let num = Number(String(raw || '').replace(/[^\d.]/g, ''));
  if (isNaN(num) || num <= 0) return 30000;
  if (num > 500000) {
    const s = String(Math.floor(num));
    if (s.length === 10) {
      const p1 = Number(s.slice(0, 5));
      const p2 = Number(s.slice(5));
      if (p1 >= 10000 && p1 <= 300000 && p2 >= 10000 && p2 <= 300000) {
        return Math.round((p1 + p2) / 2);
      }
    }
    for (let i = 4; i <= 6; i++) {
      if (i < s.length) {
        const p1 = Number(s.slice(0, i));
        const p2 = Number(s.slice(i));
        if (p1 >= 10000 && p1 <= 300000 && p2 >= 10000 && p2 <= 300000) {
          return Math.round((p1 + p2) / 2);
        }
      }
    }
    if (num > 500000) return 35000;
  }
  return num;
}

let lastLiveFetch = 0;
const MIN_DATE = '2026-09-01'; // STRICTLY ONLY LEADS FROM TODAY ONWARDS

async function getOrSyncLeads() {
  const deletedSet = getDeletedIds();
  // Filter local store by deleted and date
  let localLeads = getStoredLeads().filter(l => {
    const isDeleted = deletedSet.has(String(l.id)) || deletedSet.has(String(l.loanNo));
    if (isDeleted) return false;
    const lDate = l.date || (l.created_at ? l.created_at.split(' ')[0] : (l.created ? l.created.split(' ')[0] : ''));
    if (lDate && lDate < MIN_DATE) return false;
    return true;
  }).map(l => {
    const cleanedLoan = cleanLoanAmount(l.loanAmount || l.applied || l.loan_amount || l.amount);
    const cleanedSalary = cleanSalary(l.salary || l.monthlySalary || l.monthly_salary || l.income, l.sal_val, l.salary_range);
    return {
      ...l,
      applied: cleanedLoan,
      loanAmount: cleanedLoan,
      salary: cleanedSalary,
      monthlySalary: cleanedSalary
    };
  });

  const now = Date.now();
  // Sync from live server every 2 seconds
  if (now - lastLiveFetch > 2000 || localLeads.length === 0) {
    lastLiveFetch = now;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://paisainminutes.com/admin/api/get-leads', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.leads) && data.leads.length > 0) {
          const liveLeads = data.leads
            .filter(l => {
              // 1. Check Deleted / Blacklisted
              const id1 = String(l.id || '');
              const id2 = String(l.lead_id || '');
              const id3 = String(l.loanNo || '');
              if (deletedSet.has(id1) || deletedSet.has(id2) || deletedSet.has(id3)) return false;

              // 2. PURGE ALL OLD HISTORICAL LEADS (Prior to 25 Aug 2026)
              const leadDate = l.date || (l.created_at ? l.created_at.split(' ')[0] : (l.created ? l.created.split(' ')[0] : ''));
              if (leadDate && leadDate < MIN_DATE) return false;

              return true;
            })
            .map(l => {
              const rawName = (l.name || l.fullName || 'Applicant').trim();
              const initials = l.initials || rawName.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2) || 'AL';
              const rawPhone = String(l.mobile || l.phone || l.phoneNumber || '');
              const digitsOnly = rawPhone.replace(/\D/g, '').slice(-10);
              const formattedMobile = digitsOnly ? (digitsOnly.length === 10 ? `+91 ${digitsOnly}` : digitsOnly) : '—';

              const rawLoan = l.loanAmount || l.applied || l.loan_amount || l.amount;
              const loanNum = cleanLoanAmount(rawLoan);

              const rawSalary = l.salary || l.monthlySalary || l.monthly_salary || l.income;
              const salary = cleanSalary(rawSalary, l.sal_val, l.salary_range);

              const cibil = String(l.cibil || l.cibilScore || l.cibil_score || '—').trim();
              const assignedCompany = l.assignedCompany || determineAssignedCompany(cibil, salary, loanNum, l.company || l.partner || '');

              return {
                id: l.id || l.lead_id || l.loanNo,
                loanNo: l.loanNo || l.lead_id || l.id,
                name: rawName,
                initials: initials,
                avatarBg: l.avatarBg || 'bg-blue-600',
                mobile: formattedMobile,
                email: l.email || l.emailAddress || '—',
                creditManager: l.creditManager || 'Unassigned',
                pan: l.pan || '—',
                cibil: cibil,
                applied: loanNum,
                loanAmount: loanNum,
                salary: salary,
                city: l.city || 'Delhi NCR',
                state: l.state || 'India',
                pincode: l.pincode || '110001',
                employmentType: l.employmentType || 'Salaried',
                assignedCompany: assignedCompany,
                eligibilityStatus: l.eligibilityStatus || 'Eligible',
                source: l.source || 'Check Eligibility Website',
                purpose: l.purpose || 'Personal Loan',
                status: l.status || 'Fresh',
                created: l.created || l.created_at || new Date().toISOString(),
                date: l.date || (l.created_at ? l.created_at.split(' ')[0] : new Date().toISOString().split('T')[0])
              };
            });

          // Merge by 10-digit Phone Number (1 Lead Per Applicant)
          const leadsByPhone = new Map();
          for (const l of liveLeads) {
            const rawPhone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
            const key = (rawPhone && rawPhone.length === 10) ? rawPhone : String(l.id);
            if (!leadsByPhone.has(key)) {
              leadsByPhone.set(key, l);
            }
          }
          for (const loc of localLeads) {
            const rawPhone = String(loc.phone || loc.mobile || '').replace(/\D/g, '').slice(-10);
            const key = (rawPhone && rawPhone.length === 10) ? rawPhone : String(loc.id);
            if (!leadsByPhone.has(key) && !deletedSet.has(String(loc.id)) && !deletedSet.has(String(loc.loanNo))) {
              leadsByPhone.set(key, loc);
            }
          }
          const uniqueLeads = Array.from(leadsByPhone.values());
          saveStoredLeads(uniqueLeads);
          return uniqueLeads;
        }
      }
    } catch (e) {}
  }
  return localLeads;
}

// Smart Auto-Assign rule engine for affiliate distribution
function determineAssignedCompany(cibilStr, salaryNum, amountNum, explicitCompany) {
  if (explicitCompany && explicitCompany.trim() && explicitCompany !== '—') {
    const clean = explicitCompany.trim().toLowerCase();
    if (clean.includes('rupay91')) return 'Rupay91';
    return explicitCompany.trim();
  }
  return 'Rupay91';
}

function crmApiPlugin() {
  return {
    name: 'crm-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        const url = req.url ? req.url.split('?')[0] : ''

        if (url === '/admin' || url === '/admin/') {
          req.url = '/';
        }

        // 1. GET ALL LEADS (Today Onwards Only)
        if (url.endsWith('/api/get-leads')) {
          const leads = await getOrSyncLeads()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, count: leads.length, leads }))
          return
        }

        // 1.1 GET PARTNER ANALYTICS KPI SUMMARY
        if (url.endsWith('/api/partner-analytics/kpi-summary')) {
          const leads = await getOrSyncLeads()
          const PARTNERS_CONFIG = [
            { id: 'rupay91', name: 'Rupay91', rateStr: '2.8%', ratePct: 0.028, status: 'Paid' },
            { id: 'jhatpatloans', name: 'Jhatpat Loans', rateStr: '2.4%', ratePct: 0.024, status: 'Paid' },
            { id: 'instarupees', name: 'Insta Rupees', rateStr: '2.5%', ratePct: 0.025, status: 'Pending' },
            { id: 'udhaarnow', name: 'UdhaarNow', rateStr: '2.2%', ratePct: 0.022, status: 'Paid' },
            { id: 'loanwithin', name: 'LoanWithin', rateStr: '2.6%', ratePct: 0.026, status: 'Pending' },
            { id: 'shubhcash', name: 'ShubhCash', rateStr: '2.3%', ratePct: 0.023, status: 'Paid' },
            { id: 'borrowera', name: 'Borrowera', rateStr: '2.7%', ratePct: 0.027, status: 'Pending' },
            { id: 'easyfincare', name: 'Easy Fincare', rateStr: '2.4%', ratePct: 0.024, status: 'Paid' }
          ];

          const partnerStats = PARTNERS_CONFIG.map(p => {
            const pLeads = leads.filter(l => {
              const c = String(l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
              return c === p.id || c === p.name.toLowerCase().replace(/[\s\-_]/g, '') || c.includes(p.id);
            });
            const leadsSent = pLeads.length;
            const approvedLeads = pLeads.filter(l => l.status === 'Approved' || l.status === 'Disbursed');
            const approved = approvedLeads.length;
            const conversionRate = leadsSent > 0 ? Number(((approved / leadsSent) * 100).toFixed(1)) : 0;
            const disbursal = approvedLeads.reduce((sum, l) => sum + cleanLoanAmount(l.loanAmount || l.applied || 50000), 0);
            const commissionEarned = Math.round(disbursal * p.ratePct);

            return {
              id: p.id,
              name: p.name,
              leadsSent,
              approved,
              conversionRate,
              disbursal,
              commissionEarned,
              commissionRate: p.rateStr,
              paymentStatus: p.status
            };
          });

          const totalLeadsSent = partnerStats.reduce((s, p) => s + p.leadsSent, 0);
          const totalApproved = partnerStats.reduce((s, p) => s + p.approved, 0);
          const totalDisbursal = partnerStats.reduce((s, p) => s + p.disbursal, 0);
          const totalCommissionEarned = partnerStats.reduce((s, p) => s + p.commissionEarned, 0);
          const conversionRate = totalLeadsSent > 0 ? Number(((totalApproved / totalLeadsSent) * 100).toFixed(1)) : 0;
          const avgCommissionPerLead = totalApproved > 0 ? Math.round(totalCommissionEarned / totalApproved) : 0;

          const commissionReceived = partnerStats
            .filter(p => p.paymentStatus === 'Paid')
            .reduce((s, p) => s + p.commissionEarned, 0);

          const commissionPending = partnerStats
            .filter(p => p.paymentStatus !== 'Paid')
            .reduce((s, p) => s + p.commissionEarned, 0);

          const sortedByEarnings = [...partnerStats].sort((a, b) => b.commissionEarned - a.commissionEarned || b.disbursal - a.disbursal);
          const topPartner = sortedByEarnings.length > 0 && sortedByEarnings[0].commissionEarned > 0
            ? { name: sortedByEarnings[0].name, amount: sortedByEarnings[0].commissionEarned }
            : { name: partnerStats[0]?.name || 'Rupay91', amount: 0 };

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            totalLeadsSent,
            totalApproved,
            totalDisbursal,
            totalCommissionEarned,
            conversionRate,
            avgCommissionPerLead,
            commissionReceived,
            commissionPending,
            topPartner,
            partners: partnerStats
          }))
          return
        }

        // 2. SUBMIT LEAD (Website Apply Now & Eligibility Check Form)
        if (url.endsWith('/api/submit-lead')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              let parsed = {}
              if (body) {
                try {
                  parsed = JSON.parse(body)
                } catch (e) {
                  const params = new URLSearchParams(body)
                  parsed = Object.fromEntries(params.entries())
                }
              }

              const existingLeads = getStoredLeads()
              const leadId = parsed.id || parsed.lead_id || parsed.leadNo || `PIM-${Math.floor(100000 + Math.random() * 900000)}`

              const rawPhone = String(parsed.phone || parsed.mobile || parsed.phoneNumber || '')
              const digitsOnly = rawPhone.replace(/\D/g, '').slice(-10)
              const formattedMobile = digitsOnly ? digitsOnly : '9876543210'

              const now = new Date()
              const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()

              const name = (parsed.name || parsed.fullName || parsed.full_name || 'Applicant').trim()
              const initials = name.split(' ').filter(Boolean).map(n => n[0].toUpperCase()).join('').slice(0, 2) || 'AL'

              const rawLoan = parsed.loanAmount || parsed.applied || parsed.loan_amount || parsed.amount
              const loanNum = cleanLoanAmount(rawLoan)

              const rawSalary = parsed.salary || parsed.monthly_salary || parsed.income || parsed.monthlySalary
              const salary = cleanSalary(rawSalary, parsed.sal_val, parsed.salary_range)
              const cibil = (parsed.cibil || parsed.cibil_score || parsed.cibilScore || parsed.estimated_cibil || parsed.cibil_range || '—').trim()
              const defaultSource = cibil !== '—' ? 'Check Eligibility Website' : 'Apply Now Website'
              const source = (parsed.source || parsed.form_type || parsed.page_source || defaultSource).trim()

              const explicitCompany = (parsed.assignedCompany || parsed.company || parsed.partner || parsed.assignedPartner || parsed.selected_company || '').trim()
              const assignedCompany = determineAssignedCompany(cibil, salary, loanNum, explicitCompany)

              const eligibilityStatus = (parsed.eligibilityStatus || parsed.eligibility_status || (cibil !== '—' ? 'Eligible' : 'Fresh Review')).trim()

              const newLead = {
                id: leadId,
                loanNo: leadId,
                lead_id: leadId,
                name: name,
                fullName: name,
                initials: initials,
                avatarBg: 'bg-blue-600',
                mobile: formattedMobile ? (formattedMobile.startsWith('+91') ? formattedMobile : `+91 ${formattedMobile}`) : '—',
                phone: digitsOnly || formattedMobile,
                phoneNumber: digitsOnly || formattedMobile,
                email: (parsed.email || parsed.email_address || parsed.emailAddress || `${digitsOnly || 'lead'}@paisainminutes.com`).trim(),
                creditManager: 'Unassigned',
                pan: (parsed.pan || '—').toUpperCase(),
                cibil: cibil,
                applied: loanNum,
                loanAmount: loanNum,
                salary: salary,
                monthlySalary: salary,
                city: (parsed.city || 'Online Apply').trim(),
                state: (parsed.state || 'India').trim(),
                pincode: (parsed.pincode || parsed.pin_code || parsed.pin || parsed.zipcode || '110001').trim(),
                employmentType: (parsed.employmentType || parsed.employment_type || parsed.occupation || 'Salaried').trim(),
                assignedCompany: assignedCompany,
                eligibilityStatus: eligibilityStatus,
                source: source,
                purpose: (parsed.purpose || 'Personal Loan').trim(),
                status: 'Fresh',
                created: `${dateStr}, ${timeStr}`,
                date: now.toISOString().split('T')[0]
              }

              // Upsert by 10-digit Phone Number (1 Lead Per Applicant)
              const existingIdx = existingLeads.findIndex(l => {
                const lp = String(l.phone || l.mobile || l.phoneNumber || '').replace(/\D/g, '').slice(-10);
                return digitsOnly && lp && digitsOnly === lp;
              });

              let updatedLeads = [];
              if (existingIdx >= 0) {
                const old = existingLeads[existingIdx];
                newLead.id = old.id || newLead.id;
                newLead.loanNo = old.loanNo || newLead.loanNo;
                newLead.lead_id = old.lead_id || newLead.lead_id;
                if ((newLead.name === 'Applicant' || !newLead.name) && old.name && old.name !== 'Applicant') {
                  newLead.name = old.name;
                  newLead.fullName = old.fullName || old.name;
                  newLead.initials = old.initials || 'AP';
                }
                const filtered = existingLeads.filter((_, i) => i !== existingIdx);
                updatedLeads = [newLead, ...filtered];
              } else {
                updatedLeads = [newLead, ...existingLeads];
              }

              saveStoredLeads(updatedLeads)

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: true,
                message: `Lead received and assigned to ${assignedCompany} successfully!`,
                lead: newLead
              }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        // 3. UPDATE LEAD (e.g. Reassign Company, Change Status)
        if (url.endsWith('/api/update-lead')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const { id, updates } = parsed
              if (!id || !updates) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: 'Lead ID and updates required' }))
                return
              }

              const existingLeads = getStoredLeads()
              let updatedLead = null
              const updatedList = existingLeads.map(lead => {
                if (lead.id === id || lead.loanNo === id) {
                  updatedLead = { ...lead, ...updates }
                  return updatedLead
                }
                return lead
              })

              if (!updatedLead) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: 'Lead not found' }))
                return
              }

              saveStoredLeads(updatedList)
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, lead: updatedLead }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        // 4. DELETE LEAD
        if (url.endsWith('/api/delete-lead')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              let parsed = {}
              if (body) {
                try {
                  parsed = JSON.parse(body)
                } catch (e) {
                  const params = new URLSearchParams(body)
                  parsed = Object.fromEntries(params.entries())
                }
              }
              const existingLeads = getStoredLeads()
              let toDeleteIds = []

              if (parsed.action === 'single' && parsed.id) {
                toDeleteIds = [String(parsed.id)]
              } else if (parsed.action === 'selected' && Array.isArray(parsed.ids)) {
                toDeleteIds = parsed.ids.map(String)
              } else if (parsed.id) {
                toDeleteIds = [String(parsed.id)]
              } else if (Array.isArray(parsed.ids)) {
                toDeleteIds = parsed.ids.map(String)
              } else if (parsed.action === 'reset_all') {
                toDeleteIds = existingLeads.map(l => String(l.id))
              }

              addDeletedIds(toDeleteIds)
              const deleteSet = new Set(toDeleteIds)

              let updatedLeads = []
              if (parsed.action === 'reset_all') {
                updatedLeads = []
              } else {
                updatedLeads = existingLeads.filter(l => !deleteSet.has(String(l.id)) && !deleteSet.has(String(l.loanNo)))
              }
              saveStoredLeads(updatedLeads)

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, count: updatedLeads.length }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        // 8. GET/POST /api/rate-cards
        if (req.url && req.url.startsWith('/api/rate-cards')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Rate cards API operational' }));
          return;
        }

        // 9. GET/POST /api/payout-requests
        if (req.url && req.url.startsWith('/api/payout-requests')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Payout requests API operational' }));
          return;
        }

        // 10. GET/POST /api/settlements
        if (req.url && req.url.startsWith('/api/settlements')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Settlements API operational' }));
          return;
        }

        // 11. GET/POST /api/invoices
        if (req.url && req.url.startsWith('/api/invoices')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Invoices API operational' }));
          return;
        }

        // 12. GET/POST /api/activity-log
        if (req.url && req.url.startsWith('/api/activity-log')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Activity log API operational' }));
          return;
        }

        // 13. GET/POST /api/integrations
        if (req.url && req.url.startsWith('/api/integrations')) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Integrations API operational' }));
          return;
        }

        // 14. GET /api/dashboard/executive-overview
        if (req.url && req.url.startsWith('/api/dashboard/executive-overview')) {
          try {
            const parsedUrl = new URL(req.url, 'http://localhost');
            const periodParam = parsedUrl.searchParams.get('period') || 'this_month';
            const allLeads = getStoredLeads() || [];

            const PARTNERS_CONFIG = [
              { id: 'rupay91', name: 'Rupay91', rateStr: '2.8%', ratePct: 0.028, badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
              { id: 'jhatpatloans', name: 'Jhatpat Loans', rateStr: '2.4%', ratePct: 0.024, badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { id: 'instarupees', name: 'Insta Rupees', rateStr: '2.5%', ratePct: 0.025, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
              { id: 'udhaarnow', name: 'UdhaarNow', rateStr: '2.2%', ratePct: 0.022, badgeClass: 'bg-purple-50 text-purple-700 border-purple-200' },
              { id: 'loanwithin', name: 'LoanWithin', rateStr: '2.6%', ratePct: 0.026, badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
              { id: 'shubhcash', name: 'ShubhCash', rateStr: '2.3%', ratePct: 0.023, badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
              { id: 'borrowera', name: 'Borrowera', rateStr: '2.7%', ratePct: 0.027, badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
              { id: 'easyfincare', name: 'Easy Fincare', rateStr: '2.4%', ratePct: 0.024, badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' }
            ];

            const partnerMap = {};
            PARTNERS_CONFIG.forEach(p => {
              partnerMap[p.id] = { ...p, leads: 0, volume: 0, approved: 0, commission: 0 };
            });

            let totalVolume = 0;
            let totalApproved = 0;
            let totalCommissionEarned = 0;

            allLeads.forEach(l => {
              const amt = cleanLoanAmount(l.loanAmount || l.applied || 50000);
              totalVolume += amt;
              const st = (l.status || '').toLowerCase();
              const isApp = (st === 'approved' || st === 'disbursed');
              if (isApp) totalApproved++;

              const assigned = (l.assignedCompany || '').toLowerCase().replace(/[\s\-_]/g, '');
              let matched = PARTNERS_CONFIG.find(p => assigned === p.id || assigned === p.name.toLowerCase().replace(/[\s\-_]/g, '') || assigned.includes(p.id));
              const pId = matched ? matched.id : 'rupay91';

              partnerMap[pId].leads++;
              partnerMap[pId].volume += amt;
              if (isApp) {
                partnerMap[pId].approved++;
                const comm = Math.round(amt * partnerMap[pId].ratePct);
                partnerMap[pId].commission += comm;
                totalCommissionEarned += comm;
              }
            });

            const recentActivity = allLeads.slice(0, 10).map((l, idx) => {
              const st = (l.status || 'Fresh').toLowerCase();
              let eventType = 'New Lead';
              let eventCode = 'new_lead';
              if (st === 'approved') {
                eventType = 'Status Change → Approved';
                eventCode = 'approved';
              } else if (st === 'disbursed') {
                eventType = 'Loan Disbursed';
                eventCode = 'disbursed';
              } else if (st.includes('doc')) {
                eventType = 'Documents Submitted';
                eventCode = 'docs';
              }
              return {
                id: 'act-' + idx,
                timestamp: l.created_at || l.createdAt || l.created || new Date().toISOString(),
                leadRef: String(l.id || ('L-' + (1000 + idx))),
                leadName: l.name || 'Applicant',
                partner: l.assignedCompany || 'Rupay91',
                eventType,
                eventCode,
                amount: cleanLoanAmount(l.loanAmount || l.applied || 50000)
              };
            });

            const leadsOverTime = [
              { date: '01 Sep', totalLeads: Math.max(1, Math.round(allLeads.length * 0.15)), approved: Math.round(totalApproved * 0.1) },
              { date: '03 Sep', totalLeads: Math.max(2, Math.round(allLeads.length * 0.25)), approved: Math.round(totalApproved * 0.2) },
              { date: '05 Sep', totalLeads: Math.max(3, Math.round(allLeads.length * 0.45)), approved: Math.round(totalApproved * 0.4) },
              { date: '07 Sep', totalLeads: Math.max(4, Math.round(allLeads.length * 0.70)), approved: Math.round(totalApproved * 0.65) },
              { date: '10 Sep', totalLeads: allLeads.length, approved: totalApproved }
            ];

            const data = {
              success: true,
              period: {
                type: periodParam,
                label: periodParam === 'last_month' ? 'August 2026' : (periodParam === 'this_fy' ? 'FY 2026-27' : 'September 2026'),
                start: '2026-09-01',
                end: '2026-09-10'
              },
              totalLeads: allLeads.length,
              totalLeadsTrend: 14.2,
              totalApproved: totalApproved,
              totalApprovedTrend: 8.5,
              appliedVolume: totalVolume,
              appliedVolumeTrend: 12.0,
              totalCommissionEarned: totalCommissionEarned,
              totalCommissionTrend: 15.8,
              affiliatePartnerCount: PARTNERS_CONFIG.length,
              matchRoutingRate: 100.0,
              partners: Object.values(partnerMap),
              leadsOverTime,
              recentActivity
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return;
          } catch (err) {
            console.error('Error handling executive overview API:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }
        }

        next()
      })
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), crmApiPlugin()],
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/index.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/index.css';
          }
          if (assetInfo.name && assetInfo.name.includes('logo')) {
            return 'assets/paisa-logo.png';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    watch: {
      ignored: ['**/leads_store.json', '**/*.json', '**/leads_store*.json', '**/deleted_leads*.json']
    }
  },
})
