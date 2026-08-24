import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LEADS_FILE = path.resolve(__dirname, 'leads_store.json')

function getStoredLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8')
      return JSON.parse(data || '[]')
    }
  } catch (err) {
    console.error('Error reading leads_store.json:', err)
  }
  return []
}

function saveStoredLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing leads_store.json:', err)
  }
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
      server.middlewares.use((req, res, next) => {
        // Enable CORS for external website submissions (e.g. paisainminutes.com/apply-now)
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

        // 1. GET ALL LEADS
        if (url.endsWith('/api/get-leads')) {
          const leads = getStoredLeads()
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

              const mobile = (parsed.mobile || parsed.phone || parsed.mobile_number || parsed.phone_number || parsed.contact || parsed.phoneNumber || '').trim()
              if (!mobile) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: 'Mobile number is required' }))
                return
              }

              let formattedMobile = mobile
              const digitsOnly = mobile.replace(/\D/g, '')
              if (digitsOnly.length === 10) {
                formattedMobile = `+91 ${digitsOnly}`
              } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
                formattedMobile = `+91 ${digitsOnly.substring(2)}`
              }

              const existingLeads = getStoredLeads()
              const nextNum = existingLeads.length + 1
              const leadId = `PIM-2026-${String(nextNum).padStart(4, '0')}`

              const rawName = (parsed.name || parsed.fullName || parsed.full_name || parsed.applicant_name || parsed.customer_name || '').trim()
              const name = rawName ? rawName : `Applicant (${digitsOnly.slice(-4) || 'New'})`

              const initials = name
                .split(' ')
                .filter(Boolean)
                .map(n => n[0].toUpperCase())
                .join('')
                .slice(0, 2) || 'ML'

              const now = new Date()
              const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

              // Loan Amount parser
              const rawLoan = parsed.loanAmount || parsed.loan_amount || parsed.amount || parsed.applied || parsed.applied_amount || parsed.loan_range || parsed.amount_range || parsed.required_loan_amount
              let loanNum = 50000
              if (typeof rawLoan === 'number') {
                loanNum = rawLoan
              } else if (rawLoan) {
                const matches = String(rawLoan).replace(/,/g, '').match(/\d+/g)
                if (matches && matches.length > 0) {
                  const nums = matches.map(Number).filter(n => !isNaN(n))
                  if (nums.length > 0) loanNum = Math.max(...nums)
                }
              }

              const salary = Number(parsed.salary || parsed.monthly_salary || parsed.income || 30000)
              const cibil = (parsed.cibil || parsed.cibil_score || parsed.cibilScore || parsed.estimated_cibil || parsed.cibil_range || '—').trim()
              const defaultSource = cibil !== '—' ? 'Check Eligibility Website' : 'Apply Now Website'
              const source = (parsed.source || parsed.form_type || parsed.page_source || defaultSource).trim()

              // Determine Assigned Affiliate Company
              const explicitCompany = (parsed.assignedCompany || parsed.company || parsed.partner || parsed.assignedPartner || parsed.selected_company || '').trim()
              const assignedCompany = determineAssignedCompany(cibil, salary, loanNum, explicitCompany)

              // Determine Eligibility Status
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
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const existingLeads = getStoredLeads()
              let updatedLeads = []

              if (parsed.action === 'single' && parsed.id) {
                updatedLeads = existingLeads.filter(l => l.id !== parsed.id && l.loanNo !== parsed.id)
              } else if (parsed.action === 'selected' && Array.isArray(parsed.ids)) {
                const toDelete = new Set(parsed.ids)
                updatedLeads = existingLeads.filter(l => !toDelete.has(l.id) && !toDelete.has(l.loanNo))
              } else if (parsed.action === 'reset_all') {
                updatedLeads = []
              } else {
                updatedLeads = existingLeads
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
  base: '/admin/',
  plugins: [react(), tailwindcss(), crmApiPlugin()],
  build: {
    outDir: path.resolve(__dirname, '../Shivam Data/paisainminutes/admin'),
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
})
