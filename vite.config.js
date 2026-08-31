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
const MIN_DATE = '2026-08-25'; // STRICTLY ONLY LEADS FROM TODAY ONWARDS

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

          // Merge without duplicate IDs
          const liveMap = new Map(liveLeads.map(l => [String(l.id), l]));
          for (const loc of localLeads) {
            if (!liveMap.has(String(loc.id)) && !deletedSet.has(String(loc.id)) && !deletedSet.has(String(loc.loanNo))) {
              liveLeads.push(loc);
            }
          }
          saveStoredLeads(liveLeads);
          return liveLeads;
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
    if (clean.includes('adgrow')) return 'Adgrow';
    if (clean.includes('agdm')) return 'AGDM';
    if (clean.includes('rupaysure')) return 'Rupaysure';
    return explicitCompany.trim();
  }

  let cibilNum = 0;
  if (cibilStr) {
    const match = String(cibilStr).match(/\d{3}/);
    if (match) cibilNum = parseInt(match[0], 10);
    else if (cibilStr.includes('750') || cibilStr.includes('excellent')) cibilNum = 780;
    else if (cibilStr.includes('700') || cibilStr.includes('good')) cibilNum = 720;
    else if (cibilStr.includes('650') || cibilStr.includes('average')) cibilNum = 660;
    else if (cibilStr.includes('600') || cibilStr.includes('poor')) cibilNum = 610;
  }

  if (cibilNum >= 720 || salaryNum >= 40000) return 'Rupay91';
  if (amountNum >= 150000 || (salaryNum >= 25000 && cibilNum >= 650)) return 'Adgrow';
  if (cibilNum >= 670 || salaryNum >= 20000) return 'Rupaysure';
  return 'AGDM';
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

        if (url === '/' || url === '') {
          res.writeHead(302, { Location: '/admin/' })
          res.end()
          return
        }

        // 1. GET ALL LEADS (Today Onwards Only)
        if (url.endsWith('/api/get-leads')) {
          const leads = await getOrSyncLeads()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, count: leads.length, leads }))
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
                name: name,
                initials: initials,
                avatarBg: 'bg-blue-600',
                mobile: formattedMobile,
                email: (parsed.email || parsed.email_address || parsed.emailAddress || `${digitsOnly || 'lead'}@paisainminutes.com`).trim(),
                creditManager: 'Unassigned',
                pan: (parsed.pan || '—').toUpperCase(),
                cibil: cibil,
                applied: loanNum,
                loanAmount: loanNum,
                salary: salary,
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

              const updatedLeads = [newLead, ...existingLeads]
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

        next()
      })
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), crmApiPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
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
