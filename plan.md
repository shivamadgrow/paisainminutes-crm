# Paisa in Minutes CRM Migration Plan — Frontend Repository

## Purpose

This document is a handoff plan for an agent working on the frontend repository:

`/home/primordic/projects/adgrow/paisainminutescrm/paisainminutes-crm/`

The only backend that should remain in use is the Node.js/Prisma server at:

`/home/primordic/projects/adgrow/paisa/server/`

The PHP endpoints and PHP-oriented data files in this repository are legacy code. The objective is to migrate all required frontend behavior to the Node server, remove frontend dependence on PHP, and then remove the legacy PHP implementation safely.

Do not delete PHP files at the beginning of the work. First replace every runtime dependency, validate the application, and remove them only after the deletion checklist is satisfied.

How to use this document: read **Purpose**, then the **Shared decisions and API contract** (identical in both repos), then follow your **Phase plan** in order. The **Reference detail** section holds the findings and detailed requirements that each phase task points to.

## Shared decisions and API contract (AUTHORITATIVE — identical in both repos' plan.md)

This section is copied verbatim into the server plan and the frontend plan. It is the single contract between the **server agent** and the **frontend agent**. Neither agent may change it unilaterally. If a change is needed, add an entry under "Contract change requests" at the bottom of the **server** plan (`/home/primordic/projects/adgrow/paisa/server/plan.md`) and tell the user. The user will relay it.

### Ground rules

1. **MongoDB is the only database.** MySQL (legacy PHP), `data/*.json`, `public/data/*`, `leads_log.csv`, `partner_assignments.json` and browser `localStorage` are NOT data stores. Any historical data in them that must be kept is imported once into MongoDB by a reviewed server script. Data that only ever existed inside individual browsers' `localStorage` cannot be recovered and is discarded unless the user supplies an export.
2. **The Node server (`/home/primordic/projects/adgrow/paisa/server`) is the only backend.** After migration the frontend must make zero requests to any `.php` URL.
3. **Server agent works only in the server folder; frontend agent works only in the frontend repo.** Do not edit the other repo.
4. **The server owns authorization.** The frontend hides UI by role for convenience only. Never trust `partner_id`, `updated_by`, `currentUser`, or `role` sent from the browser.
5. **Do not delete PHP files, `crm_subdomain_update/`, or static data** until the user explicitly says so. Deletion is the user's call after both agents finish and testing passes.
6. **Never print or commit secrets.** Never write real passwords, PANs, tokens, or `.env` values into code, docs, logs, tests, or commit messages.
7. Do not run `prisma db push` or any import/migration against a production database. Use a local/test database. Ask the user before touching any shared database.

### Decisions already made (assumptions — user may override)

| Topic | Decision |
|---|---|
| Staff and partner login | **Email + password** (no OTP), hashed with bcrypt on the server, returning the same JWT access + refresh token mechanism used for customers. Customer OTP login stays unchanged. A staff/partner account is a `StaffUser`, separate from the customer `User`. |
| First Super Admin | Created by a server seed script reading `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` from the environment. Never from source code. The old hardcoded frontend passwords are considered compromised and must not be reused. |
| Secrets vs data | Secrets that can live in env stay in the server `.env` only. Hardcoded business data, config and accounts (including the Super Admin, stored as a bcrypt hash) live in MongoDB. See the server plan section "Secrets stay in env; hardcoded data and accounts move into MongoDB". |
| Staff login | Email + password only. **No OTP for staff.** Customer OTP login is unchanged. |
| Finance and other CRM screens | Keep the screens and behavior **exactly as they look and work today** (payouts, settlements, invoices, rate cards, commissions, activity log, roles, settings). Only the data source changes: from `localStorage`/static files/PHP to the Node API and MongoDB. No UI redesign. |
| Prisma | The user approved upgrading Prisma. Do it as the **last** server step, see the server plan. |
| Lead `status` (CRM workflow) | Stays exactly: `FRESH, CALLBACK, INTERESTED, DOCS_RECEIVED, APPROVED, DISBURSED, REJECTED`. |
| Partner delivery state | New separate field `partnerStatus`: `NONE, ASSIGNED, REDIRECTED, CONTACTED, APPROVED, DISBURSED, REJECTED`. The UI labels "Contacted" and "Redirected" map to this field, never to `status`. |
| Identities | `selectedLenderId` = a real `Lender.id` only. `assignedPartnerId` = an `AffiliatePartner.id`. A partner slug or name must never be written into `selectedLenderId`. |
| Money | New financial records (commissions, payouts, settlements, invoices, rate cards) store integer **paise**. Existing lead `amount` fields stay integer rupees. API fields carry the unit in their name (`amountPaise`, `loanAmountRupees`) where ambiguity is possible. |
| Timezone | Business periods and "today/this month" are computed in `Asia/Kolkata`. API timestamps are ISO-8601 UTC. |
| IDs | Applications are identified by `LoanApplication.id`. Phone (last 10 digits) is only a fallback lookup key, never a permanent identity. |

### Roles

`SUPER_ADMIN`, `ADMIN`, `STAFF` (CRM staff with explicit permissions), `PARTNER` (affiliate partner user, limited to assigned partner ids). Permissions are strings returned by the server in the login response (e.g. `leads.read`, `leads.update`, `leads.delete`, `partners.manage`, `finance.read`, `finance.write`, `settings.manage`, `audit.read`). The frontend renders menus from the server-provided list.

### Response conventions

- Existing lead routes keep their shape: `{ "applications": [...] }`, `{ "application": {...} }`, `{ "error": "message" }`.
- **All new `/api/crm/*` routes** return `{ "success": true, ...namedKeys }` on success and `{ "success": false, "error": "message" }` with a correct HTTP status on failure (400 validation, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict/duplicate, 429 rate limited, 500 server). This matches the `data.success` checks the UI already makes.
- List endpoints accept `page` (default 1), `limit` (default 50, max 500) and return `{ success, <items>, page, limit, total }`.
- Authenticated requests send `Authorization: Bearer <accessToken>`. Expired token → server returns 401 → frontend calls `POST /api/auth/refresh` once, retries once, otherwise returns to the login screen.
- The server never returns raw PAN (mask as `ABCDE****F`), password hashes, provider secrets, or full bank account numbers.

### Route contract

Auth (`/api/auth`, `/api/crm`):

| Method + path | Auth | Request | Response |
|---|---|---|---|
| `POST /api/auth/staff/login` | public, strict rate limit | `{ email, password }` | `{ success, token, refreshToken, user: { id, name, email, role, permissions[], partnerIds[], status } }` |
| `POST /api/auth/refresh` | refresh token | `{ refreshToken }` | existing behavior |
| `POST /api/auth/staff/logout` | staff | `{ refreshToken }` | `{ success }` (revokes token) |
| `GET /api/crm/me` | staff | — | `{ success, user }` (same shape as login `user`) |

Leads (`/api/loan-applications`) — customer/public submission stays public; everything CRM is authenticated:

| Method + path | Auth | Notes |
|---|---|---|
| `POST /` | public lead submission, rate limited, idempotent | returns `201`. Must NOT infer a user from body phone for authorization. |
| `GET /all` | `leads.read`; PARTNER sees only own assigned | query: `page, limit, status, partnerId, partnerStatus, from, to, q`. Returns `{ applications, page, limit, total }`. PAN masked. |
| `GET /phone/:phone` | `leads.read` | returns `{ applications: [...] }` newest first (unchanged shape). |
| `GET /:id` | `leads.read` / owner / assigned partner | `404` if missing. Never returns a fabricated record. |
| `PATCH /:id` | role-limited, see below | audit event written on every change. |
| `DELETE /:id`, `DELETE /all` | `leads.delete` (SUPER_ADMIN/ADMIN only) | audit logged. `DELETE /all` additionally requires body `{ "confirm": "DELETE_ALL_LEADS" }`. |

`PATCH /api/loan-applications/:id` field allowlist:

- STAFF/ADMIN with `leads.update`: `status`, `selectedLenderId`, `lenderApplicationId`, `assignedPartnerId`, `remarks`, `loanAmountRupees`, `disbursedAmountRupees`.
- PARTNER (only for leads assigned to one of their `partnerIds`): `partnerStatus`, `partnerRemarks`, `disbursedAmountRupees` (only when moving to `DISBURSED`).
- Never accepted from the body: `updated_by`, `partner_id`, `userId`, `phone`, applicant identity fields, audit fields. The server derives actor id/role/time from the JWT.
- Response: `{ application }` using the standard mapped shape (includes `assignedPartnerId`, `partnerStatus`, `remarks`, `partnerRemarks`, `disbursedAmountRupees`, `updatedAt`).

CRM resources (`/api/crm/...`), all authenticated:

| Resource | Routes | Key payloads |
|---|---|---|
| Partners | `GET/POST /partners`, `PATCH /partners/:id` | `{ slug, name, status, website, commissionRate }` |
| Partner users | `GET/POST /partners/users`, `PATCH /partners/users/:id`, `POST /partners/users/:id/reset-password` | create: `{ partnerIds[], name, email, username? }`; the server generates a one-time temporary password and returns it ONCE in the create/reset response (never stored or returned again). Status toggle: `PATCH { status: "ACTIVE"|"DISABLED" }`. |
| Assignments | `GET/POST /partner-assignments`, `PATCH /partner-assignments/:id` | `{ applicationId, partnerId, source }`; unique per application; idempotent. |
| Partner events | `GET /partner-events?applicationId=`, `POST /partner-events` | `{ applicationId, partnerId, eventType, status, remarks, metadata }`; append-only; actor from JWT. |
| Click tracking | `POST /api/public/partner-click` (public, rate-limited, idempotency key) and `GET /api/public/redirect/:partnerSlug` | click payload fields the UI sends today: `{ partner, source, leadId, phone, utm_source, utm_medium, utm_campaign, utm_term }`. Redirect target must come from a server-side allowlist of partner URLs — never from a query string (no open redirect). |
| Delivery logs | `GET /delivery-logs?status&partnerId&applicationId&from&to`, `POST /delivery-logs`, `POST /delivery-logs/:id/retry` | GET returns `{ success, logs, stats: { total, delivered, failed, pending } }`. Each log: `{ id, applicationId, partnerId, partnerName, attempt, status, httpStatus, errorCode, errorMessage, createdAt }`. The frontend agent must read `DeliveryLogView.jsx` / `LeadsView.jsx` and confirm exact field names with the server agent via the change-request section before relying on them. |
| Export | `GET /partners/:partnerId/leads/export?format=csv` | server-generated CSV; PARTNER can only export own partner id; masked fields. |
| Executive overview | `GET /executive-overview?period&startDate&endDate` | `{ success, ... }` with totals, prior-period comparison, status counts, approved/disbursed counts and amounts, partner breakdown. Field names fixed by the server agent in Swagger and in "Contract change requests" before the frontend consumes them. |
| Partner KPI | `GET /partner-analytics/kpi-summary?period&asOf` | `{ success, summary, partners: [{ id, name, leadsSent, approved, conversionRate, disbursalPaise, commissionEarnedPaise, commissionReceivedPaise, commissionPendingPaise, paymentStatus }] }`. Date params must come from the UI selector, not hardcoded. |
| Finance | `/rate-cards`, `/commissions`, `/payout-requests`, `/settlements`, `/invoices` | CRUD with a state machine; duplicate payout prevention; integer paise. |
| Audit | `GET /audit-logs` | filters: actor, entity, action, date. |
| Settings | `/settings/general`, `/settings/integrations`, `/settings/notification-templates` | secrets returned masked only (e.g. `••••1234`). |

### Repository layout (current: website + CRM merged into one git repo)

The frontend repo (`/home/primordic/projects/adgrow/paisainminutescrm/paisainminutes-crm/`, git remote on GitHub) now mirrors the hosting root:

- `public_html/` = the live website (about 285 PHP pages) **and** the CRM subfolder.
- `public_html/crm/` = the CRM React app (`src/`, `package.json`, `vite.config.js`, built `assets/`). **Everywhere this plan says `src/...` for the frontend, it means `public_html/crm/src/...`.** The root `package.json` only delegates (`npm run dev` / `npm run build` call `public_html/crm`); run lint with `npm --prefix public_html/crm run lint`.
- Legacy PHP backend files appear in several places. Live-looking copies: `public_html/*.php`, `public_html/api/`, `public_html/includes/`, `public_html/config/`, `public_html/crm/api/`, `public_html/crm/redirect.php`, `public_html/crm/submit-lead.php`, `public_html/admin/api/`. Stale or duplicate copies: `public_html/deploy_update/`, `public_html/crm/crm_subdomain_update/`, `public_html/admin/` nested folders, `public_html/scratch/`. Where copies differ, diff them, note differences in the report, and use `public_html/crm/api/*` for CRM endpoints and `public_html/*.php` (root) for website pages as the reference unless the user says otherwise.
- `public_html/crm.php` and `public_html/admin-dashboard.php` are a **retired** legacy CRM page (user confirmed). Do not migrate them, do not modify them; they are listed as deletable in Stage D.
- Legacy data files: `public_html/data/*.json`, `public_html/clicks_log.csv`, `public_html/leads_log.csv`, `public_html/crm/data/*`, `public_html/crm/public/data/*`, `public_html/admin/**/data/*`. These are import sources (Phase 6). The leads are few (the system is in early testing), but copies disagree, so the import must deduplicate (see Phase 6).

### Secrets and personal data are tracked in git (urgent, user action)

`git ls-files` shows that `.env` files (including `public_html/crm/crm_subdomain_update/.env`, which holds **database credentials**), a default-password fallback in `public_html/crm/api/db_config.php`, and lead/click data with phone numbers (`data/*.json`, `*.csv`) are committed and pushed to the GitHub remote. Treat those credentials and data as exposed. The user must: make the GitHub repository private (or confirm it is), rotate the database password and any other credential found in those files, and decide whether to purge git history. Agents must never print, copy or re-commit these values. In Phase 0 the frontend agent proposes a `.gitignore` update and the `git rm --cached` commands for `.env` and data files, but does not run them without the user's approval.

### Workflow: strictly sequential (decided by the user)

1. **Stage A — Server agent does ALL server work first** (every server phase below, in order). The frontend repo is not touched. Stage A ends with a final Completion report and a "Handoff pack" (see the server plan) appended to the bottom of the server `plan.md`.
2. **Stage B — Frontend agent, Step B0: audit the server (read-only)**, then Phases 1-7 of the frontend plan, in order. Step B0 verifies that what the server agent built matches this contract and the PHP parity matrix below. If there are blockers the frontend agent stops and tells the user; the user sends them back to the server agent. The frontend agent never patches the server.
3. **Stage C — The user asks for an independent test of both repos.**
4. **Stage D — Cutover and PHP removal (the user's call).**

Parallel work is not used. Each agent may read the other repo's `plan.md`; neither may edit the other repo.

### Phase map (shared)

| Phase | Name | Server delivers (Stage A) | Frontend delivers (Stage B, after audit) | Phase exit criteria |
|---|---|---|---|---|
| 0 | Baseline and decisions | tests/schema baseline, `.env` check, test database ready | lint/build baseline, inventory of PHP/localStorage usage, per-screen behavior notes, git/secrets proposal | baselines recorded; user has rotated the exposed Super Admin password and the exposed database credentials |
| 1 | Security foundation and auth | `StaffUser`, staff login/refresh/logout, `requireAuth`, roles/permissions, no demo fallbacks, CORS/uploads locked, admin seed | single API client, login screen (email + password), token refresh, hardcoded credentials removed | staff log in against a test DB; unauthenticated calls return 401; wrong role returns 403 |
| 2 | Lead contract | extended `LoanApplication` (incl. `leadCode`), pagination/filters, role-limited PATCH, protected deletes, audit on mutation | paged lead loading, detail, status update, delete, phone lookup fix, lender/partner separation | leads list/update/delete work end to end with real tokens; partner isolation tested |
| 2B | Public website backend parity | public routes replacing the website's PHP backend jobs: lead intake, offers lookup, status lookup, contact form, credit check, OTP via CORS | none, except confirm the CRM shows these leads correctly | intake and lookup requests in the PHP format get equivalent responses from Node; leads appear in the CRM; no duplicate leads |
| 3 | Partner domain | partners, partner users, assignments, events, click/redirect, delivery logs, CSV export, **partner postback webhook**, conversions | partner portal, lead events/delivery logs, partner users, click tracking, export | no partner-related `.php` call remains in the CRM; a partner sees only own leads; postback updates a lead |
| 4 | Reporting | executive overview, partner KPI | dashboards driven by server data | dashboard numbers equal server numbers for the same period |
| 5 | Finance and admin | rate cards, commissions, payouts, settlements, invoices, audit logs, settings, integrations, templates, roles; config/seed in MongoDB | same screens as today, data from Node | screens look and behave as before; no `localStorage` data stores |
| 6 | Data import and dedupe | idempotent import and config-seed scripts (dry-run first), duplicate detection and import report, MySQL tables included | verify imported data in every screen | counts reconcile; every duplicate decision is in the report; user reviewed it |
| 7 | Hardening and cleanup | Swagger complete, secrets scan, Prisma upgrade (last), full tests | remove CRM fallbacks/dead code, lint, build, PHP reference search clean in the CRM app, screen parity check | `npm test` / `npm run build` / lint pass; zero executable `.php` references in `public_html/crm/src` |
| 8 | Website switch | support the switch: CORS, webhook URL compatibility, rewrite snippet, sample payloads | change the live website pages so they call Node and no page stores or processes data in PHP | visitor flows work as before; no live website page reads or writes data files/MySQL |
| 9 | Cutover (user's call) | deploy and monitoring notes | deploy and smoke test notes | user confirms partners/website use Node, backups exist, then decides on PHP backend deletion |

### No-regression rule

The goal is to remove the PHP server **without changing what users can do**. Every function that works today must still work after migration. The only user-visible differences allowed are:
- the staff/partner login screen takes email + password (it looks the same, but is checked by the server);
- when a partner account is created or its password reset, the generated temporary password is shown once;
- a small inline "not available yet" message where a server route is genuinely missing (should be none by the end).

Anything else that would change behavior must be recorded as a contract change request and cleared by the user first.

### PHP parity matrix (what the PHP does today that Node must do)

The server agent reads the legacy PHP in the frontend repo (read-only) and implements the Node equivalent for each row. The frontend agent verifies each row during its audit (Step B0). Where `api/` and `crm_subdomain_update/api/` versions differ, diff them, note the differences in the report, and treat `api/` as the reference unless the user says the deployed copy is different.

| Legacy file | What it does today | Node replacement |
|---|---|---|
| `api/submit-lead.php` (also `submit_lead.php`, root `submit-lead.php`) | **Public website lead intake.** Accepts many field aliases (`phone/mobile/phoneNumber`, `loanAmount/loan_amount/amount`, `cibilScore/cibil`, `monthlySalary/salary`, `modeOfSalary/salaryMode`, etc.). Validates a 10-digit Indian mobile starting 6-9 (400 otherwise). Accepts a phone-only first step and later upserts the same lead by phone (no duplicates). Generates a lead id `PIM-<date>-<n>`. Auto-fetches the CIBIL bureau score (3 s timeout, graceful fallback and status text such as "Bureau Verified (n)", "Self-reported (n)", "Pending Bureau Whitelist"). Computes eligibility slab 0-8 with `cibil_range`, `salary_range` and `eligibility` text from the salary/CIBIL matrix (`getSlabInfo`). Picks `assignedCompany` (`determineCompany`: defaults to "Pending Selection"/"Pending Details"). Derives lead source / utm_source (WhatsApp vs direct website, from referer, session, cookie). Writes the lead, a CSV audit row, and pushes the lead to the Node backend. Returns `{status, success, message, lead_id, lead, cibil, cibilScore, cibil_auto_fetched, cibil_status, bureau_score, slab, eligibility, data:{lead_id, cibil, cibilScore, cibil_auto_fetched, cibil_status, bureau_score, redirect_url}}`, where `redirect_url` points to the offers page with `lead_id, phone, salary, cibil, slab, utm_source`. | Phase 2B: `POST /api/public/leads` |
| `api/get-leads.php`, `get_leads.php`, `api/get-leads/` | Lead listing for the CRM, merging JSON store, overrides, deleted list, partner assignments | `GET /api/loan-applications/all` (single source of truth in MongoDB; no merging) |
| `api/update-lead.php` | Updates a lead (status, remarks, assigned company, disbursed amount); stores overrides; creates the lead if missing; logs a `status_updated` partner event | `PATCH /api/loan-applications/:id` + audit + `PartnerEvent` |
| `api/delete-lead.php` | Deletes one or many leads by id (proxies the delete to Node) and keeps a deleted-ids list | `DELETE /api/loan-applications/:id` (+ bulk delete by ids with confirmation); audit logged |
| `redirect.php`, `api/track-click.php` | Resolves partner slug to a target URL from `config/partners.php` (not present in the repo), appends utm params, logs the click (CSV + JSON), records the partner assignment against the lead/phone, updates the lead's assigned company, then 302-redirects (or returns JSON for `format=json`). It also accepts an arbitrary `?url=` target (an open redirect). | Phase 3: `GET /api/public/redirect/:partnerSlug` + `POST /api/public/partner-click`; target URLs only from the server-side partner allowlist; **no arbitrary `?url=`**. Partner URLs seed from the frontend `affiliatePartners.js`; ask the user to confirm them. |
| `api/partner-events.php` | list/append lead partner events (`lead_id`, `event_type`, `partner_id`, `limit`) | `GET/POST /api/crm/partner-events` |
| `api/delivery-logs.php` | list logs (`status`, `limit` default 150) with stats; POST `action=retry|push|partner_assignment` | `/api/crm/delivery-logs` (+ retry) |
| `api/partner-users.php` | create (unique username, **plaintext default password `Partner@2026`**), toggle_status, delete, list | partner users routes; bcrypt hash + one-time temp password; no plaintext, no default password; delete = disable or soft delete |
| `api/export-partner-leads.php` | CSV of a partner's leads | `GET /api/crm/partners/:partnerId/leads/export` |
| `api/executive-overview.php`, `api/partner-analytics-kpi.php` | dashboard and KPI aggregates | Phase 4 routes. The server agent must read these two files and reproduce their calculations and field meanings (periods, prior-period comparison, partner breakdown, commission math), or document each deliberate difference. |
| `api/activity-log.php`, `payout-requests.php`, `rate-cards.php`, `integrations.php`, `settlements.php`, `invoices.php` | Each is just a JSON file the UI overwrites wholesale (GET returns the array, POST replaces it) | Real MongoDB collections with validation and audit. To keep the UI unchanged, each resource offers `GET` (list) and a validated bulk `PUT` (replace set, transactional) in addition to item routes. No unvalidated JSON blobs. |
| `postback.php`, `includes/partner_tracking_service.php` | **Partner conversion webhook.** Partners call `/postback/{partner_slug}?sub_id={lead_id}&status={status}&amount={amount}&secret={token}` (query, form or JSON body). Validates partner and secret, finds the lead, records a conversion and a partner event, updates the lead (default status `disbursed`). Returns `{status, success, message}` JSON. | Phase 3: `GET|POST /api/public/postback/:partnerSlug` (also mountable at `/postback/:partnerSlug`); per-partner secret checked timing-safe; idempotent; audit. Partners must be moved to the new URL or the web server rewritten (see Phase 8). |
| `loan-offers.php` (server-side part) | On page load reads the lead (query params, session, fallback `data/leads.json`), **creates or updates the lead in `data/leads.json` and the CRM store**, computes eligible partners from salary/CIBIL and `config/partners.php`, shows offers. | Phase 2B lookup route + the idempotent public intake upsert; the page stops writing files. |
| `track-status.php` | Customer-facing application status page; reads `data/leads.json` by reference id. | Phase 2B: `GET /api/public/leads/status` (verified by phone; customer-safe fields only). |
| `submit-contact.php` | Contact form: validates, saves to `data/contacts.json`, returns JSON. | Phase 2B: `POST /api/public/contact` + `ContactMessage` collection. |
| `api/fetch-cibil.php` | Proxy to the credit check using the server-side bureau key, with timeout and graceful fallback; used by `apply-now.php` and `check-eligibility.php`. | Phase 2B: `POST /api/public/credit-check` (same response shape; rate limited). |
| `api/auth-proxy.php` | OTP login proxy used by `includes/header.php` on every page (`window.otp_api_base_url`). | Node OTP routes reachable directly from the website origin (CORS allowlist); response shapes match what the header script expects. |
| `go.php`, `redirect.php` (root copy) | Partner redirect variants; log click, write assignment/overrides files, 302. | Same Node redirect route as `redirect.php` above. |
| `apply-now.php`, `check-eligibility.php` (browser side) | Each submission is sent **three or four times**: to Node `/api/loan-applications`, to `/submit-lead.php`, to `/admin/api/submit-lead.php` and to `https://crm.paisainminutes.com/api/submit-lead.php`, with a 1.8 s safety timeout before navigating to the offers page. | Phase 8: one call to `POST /api/public/leads`; keep the same redirect-to-offers behavior and the safety timeout. The user confirmed duplicate posting should end. |
| `includes/partner_tracking_service.php` (MySQL) | Creates and uses MySQL tables (`ensureDatabaseTables`) for partner events/conversions, plus JSON fallbacks (`partners_config.json`). | Phase 6 import covers the MySQL tables and `partners_config.json`; read the service to list the tables. |
| `crm.php`, `admin-dashboard.php` | Retired legacy CRM page. | Out of scope. Not migrated, not modified. |

Data the PHP kept in files (`leads.json`, `clicks.json`, `lead_partner_events.json`, `partner_assignments.json`, `leads_log.csv`, overrides, deleted-leads list) is imported in Phase 6 (the overrides/deleted lists must be applied during import so the imported leads reflect what the CRM showed).

### Scope: remove the PHP backend, not PHP entirely (decided by the user)

The aim is to remove the **PHP backend**: the PHP API endpoints and scripts that process, store and serve data (`api/*.php`, `submit-lead.php`, `redirect.php` logic, JSON/CSV/MySQL data files). Public website pages written in PHP that only display content may stay as they are (the user confirmed this). After migration, no PHP script may be a data endpoint or data store for the CRM or the website. Everything is handled by the Node server and MongoDB.

### Website code is in this repository (decided by the user)

The public website is under `public_html/`. The frontend agent changes the live website pages in Phase 8 so that they call the Node server and nothing in PHP stores or processes data. PHP may remain only as page templating (headers, footers, SEO content, calculators, `affiliate_tracker.php` cookies/session). A PHP page may call Node server-side with a short timeout (`BACKEND_API_URL` from `.env`) to render data, but it must not read or write data files or MySQL. `public_html/` is a copy of the live site: changes are made in the repo; the **user deploys** them. Nothing is deployed by an agent.

### Handoff and verification (the user will test after both agents finish)

Each agent, when finished, must append a "Completion report" at the bottom of its own plan.md listing: what was done, what was NOT done and why, commands run with results, deviations from this contract, and anything the user must do (env vars, seed script, import run). The user will then ask for an independent test of both repos, so be accurate and do not claim anything is complete that was not run.

## Phase plan — frontend agent (Stage B: you start only after the server agent has finished)

You start only after the server's "Stage A handoff pack" exists at the bottom of `/home/primordic/projects/adgrow/paisa/server/plan.md`. If it does not exist, stop and tell the user. You work only in this repository (the server folder is read-only for you; never edit it). First do **Step B0 (server audit)**. Then do Phases 0-7 in order. Keep every screen looking and behaving as it does today (see the No-regression rule). After each phase, append a "Phase N report" (done / not done / commands run and results / deviations / user actions) to the Completion report at the bottom of this file.

### Step B0 — Audit the server's work (read-only, before changing anything)

Purpose: confirm the server really provides what this plan needs, so you do not build on something broken.
Tasks:
1. Read the server plan's shared section, Completion report and Handoff pack. Read the server code for the routes in the contract (read-only).
2. With the user's test database and the documented test accounts (ask the user if you do not have them; never use production), start the server and run the server's tests (`npm test`). Record the results.
3. For every route in the contract and every row of the PHP parity matrix, check with real HTTP calls (curl or a small script kept outside the repo or in a temporary folder you delete afterwards): status codes (401/403/404/409/429), response keys and types against what the screens consume (read the components that call it), pagination (`page/limit/total`), role limits (a PARTNER cannot read or modify another partner's data; STAFF without `leads.delete` cannot delete), field allowlist on PATCH, masked PAN and absence of password hashes/secrets, idempotent click/assignment, CSV export content, intake response keys for `POST /api/public/leads`.
4. For each screen listed in the "Screen parity checklist" below, confirm that a route exists for every piece of data and every action it uses today. List gaps.
5. Check that no server response invents data when the DB is down (the old in-memory fallbacks must be gone).
6. Write an **Audit report** at the bottom of this file: a PASS/FAIL table per route and per parity row, a list of **blockers** (must be fixed before frontend work) and **non-blockers** (can be handled by working around on the frontend or later), and the exact commands you ran. Do not fix server problems yourself.
Exit: if there are blockers, STOP and tell the user (the user sends them back to the server agent, then asks you to repeat B0 for the affected routes). If there are no blockers, state "Audit passed" in the report and continue to Phase 0.

### Phase 0 — Baseline and inventory
Tasks:
1. Run `npm --prefix public_html/crm run lint` and `npm run build` (the root `package.json` delegates to `public_html/crm`); record pre-existing issues separately from new ones.
2. Run `rg -n "\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src` and list every runtime dependency; list every `localStorage`/`sessionStorage` key used as data (keys listed in "Additional verified findings").
3. List which screens read which data source (Node, PHP, local only, static JSON). Do not change behavior yet.
4. **Git hygiene proposal (do not run without the user's approval):** the repo tracks `.env` files and lead/click data (see "Secrets and personal data are tracked in git"). Write the exact `.gitignore` additions and the `git rm --cached` commands for the report. Never print `.env` values.
5. For every screen in the Screen parity checklist, write down today's behavior in a short list (what is shown, what actions exist, what the buttons do, what happens on failure). This is the baseline you re-verify in Phase 7. Do not take or commit screenshots containing real personal data.
Exit: inventory recorded in the report.

### Phase 1 — API client and authentication
Tasks:
1. Create one API module: prefixes `BACKEND_BASE`, attaches the bearer token, refreshes once on 401 then retries once, parses errors, applies a timeout. All requests (existing Node ones included) go through it.
2. Replace local login with `POST /api/auth/staff/login`. Store tokens per a documented browser strategy (keep refresh token out of long-lived `localStorage` if possible; at minimum document the choice). Logout calls the server.
3. Load the current user and `permissions[]` from the login response and `/api/crm/me`; render menus from server permissions. The login screen/modal keeps its current look; it takes email and password.
4. Delete hardcoded credentials, the password-rewriting logic and seeded staff from `authService.js` and `staffData.js`. Do not copy any value into docs, tests or commits. Report to the user (do not edit) any occurrence of these strings in `crm_subdomain_update/` or built `assets/`.
5. Remove the 3-second lead polling; use 30s+ or manual refresh, paused when the tab is hidden.
Exit (Gate 1 integration): can log in against the server test DB, refresh a token, log out; unauthenticated state shows the login screen (no empty-data fallback).

### Phase 2 — Lead workflows
Tasks:
1. Lead loader pages through `GET /api/loan-applications/all` until `total` (or uses server filters). Fix mapping of `applications`.
2. Fix `fetchLoanApplicationByPhone` to read `data.applications` explicitly and let the UI pick the latest or requested application; preserve the selected application id when opening a dossier.
3. Lead status update, lender selection and delete go through `PATCH`/`DELETE` with the shared allowlists. Check `res.ok`; update React state only after server success (or roll back and show the server error).
4. Never write a partner slug/name into `selectedLenderId`; use `assignedPartnerId` and `partnerStatus`.
5. Map UI labels "Contacted"/"Redirected" to `partnerStatus`, keep CRM `status` to the 7 canonical values; update filters, badges and counters.
6. Remove static-JSON enrichment (`loadLeadEnrichmentMap` and related) in favor of server fields; remove lead overrides/deleted-leads `localStorage` stores.
Exit (Gate 2 integration): list/update/delete/phone lookup work with real tokens; errors surface in the UI.

### Phase 2B — Public intake as seen from the CRM (no CRM code change expected)
Using the test DB, submit leads through the new `POST /api/public/leads` (including a repeated and a phone-only-then-full submission) and confirm in the CRM that: one lead appears (no duplicates), and name, phone, amount, CIBIL, slab/eligibility, source and `leadCode` display correctly. Fix the CRM mapping if a field is shown wrongly. The website pages themselves are changed in Phase 8, not here.

### Phase 3 — Partner workflows
Tasks: switch to the Node routes for `PartnerPortalView.jsx` (update-lead), `LeadsView.jsx` (partner events, delivery logs, assignment), `DeliveryLogView.jsx`, `Sidebar.jsx` and the partner CSV export (use an authenticated fetch + blob download, not a bare link/`window.open`), `affiliatePartners.js` click tracking (`/api/public/partner-click` and redirect route), and partner user create/toggle/reset in `authService.js`/`StaffView.jsx` (show the one-time temp password once). Remove `pim_tracking_*` and `pim_partner_routing_history` as data stores. Remove `.catch(() => {})` silent failures.
Exit (Gate 3 integration): zero partner-related `.php` calls; a PARTNER user sees only their own leads.

### Phase 4 — Reporting
Tasks: `ExecutiveDashboard.jsx` and `PartnerAnalyticsKPISummary.jsx` read the Node routes (via the API client). Remove the multi-endpoint PHP fallback loops and the local-compute fallback as a data source (show error/retry instead). Remove the hardcoded `FY2026-27` / `asOf=2026-08-20`; drive from the period selector and current date (Asia/Kolkata).
Exit: dashboard numbers equal server numbers for the same period.

### Phase 5 — Finance and admin screens
Tasks: payouts, settlements, invoices, rate cards, commissions, collections, activity/audit log, roles & permissions, integrations, notification templates, general settings, partner agreements, staff management: keep each screen's look and behavior, replace its `localStorage`/static source with the Node routes. Stop using the `src/data/*` modules as runtime stores (they may remain as UI constants such as labels and option lists). If a route is unavailable, show a small inline "not available yet" state, do not hide the screen and do not fake persistence.
Exit (Gate 5 integration): data survives a browser clear and appears for other users/browsers.

### Phase 6 — Verify imported data
Tasks: after the server's import (user-run), check every screen against imported data: lead counts, partner assignments, events, delivery logs. List mismatches in the report; do not patch data client-side.
Exit: mismatches either resolved by the server agent or recorded for the user.

### Phase 7 — Cleanup and verification
Tasks: remove PHP-path translation code from `apiConfig.js` (legacy path rewrite, `/admin/api/...` URLs), unused fallbacks and dead code; `npm run lint`; `npm run build`; run `rg -n "\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src public_html/crm/index.dev.html public_html/crm/vite.config.js` (must find nothing executable); the legacy PHP folders are NOT touched in this phase; browser smoke test of every screen with the network tab confirming no PHP or failed legacy requests.
Exit (Gate 7): lint/build pass; zero executable `.php` references.

### Phase 8 — Website switch (edit the live-site pages in `public_html/`)

Goal: the public website works exactly as before for visitors, but no website PHP page stores or processes data; everything goes through Node. You edit the repository copy; the **user deploys**. Do not touch the stale copies (`deploy_update/`, `crm/crm_subdomain_update/`, nested `admin/` copies); list them in the report. Do not modify `crm.php` / `admin-dashboard.php` (retired).
Tasks:
1. `apply-now.php` and `check-eligibility.php` (browser code): replace the four submissions (Node `/api/loan-applications`, `/submit-lead.php`, `/admin/api/submit-lead.php`, `https://crm.paisainminutes.com/api/submit-lead.php`) with **one** `POST` to Node `/api/public/leads`. Keep the same behavior: navigate to `data.redirect_url` from the response, fall back to the existing computed offers URL, keep the ~1.8 s safety timeout, keep utm/affiliate/source handling, keep the same field names and validation messages. Replace calls to `/api/fetch-cibil.php` with Node `/api/public/credit-check`.
2. `loan-offers.php`: remove the block that creates/updates leads in `data/leads.json` and the CRM store, and remove its reads of `data/leads.json`. Obtain the lead via Node `GET /api/public/leads/lookup` (server-side curl with a 2-3 s timeout, `BACKEND_API_URL` from `.env`, graceful fallback to the query-string values if Node is slow) so the page still renders offers. Keep partner offer logic (`config/partners.php` may remain as presentation data, or read partners from Node if the server exposes them). Click beacons go to Node's `/api/public/partner-click`.
3. `track-status.php`: replace the `data/leads.json` read with Node `GET /api/public/leads/status`. Same page, same fields shown.
4. `submit-contact.php` form: post to Node `/api/public/contact` (or, if it must stay a PHP page, forward to Node server-side) and delete the `data/contacts.json` write from the live path. Same messages to the visitor.
5. `includes/header.php`: set the OTP base to Node (`/api/auth/...`) instead of `/api/auth-proxy.php`.
6. Links and scripts that use `redirect.php`, `go.php` or `/api/track-click.php`: switch to Node's `/api/public/redirect/:partnerSlug` and `/api/public/partner-click`. Keep `includes/affiliate_tracker.php` (it only sets utm/affiliate cookies and session values).
7. Make a scan and put it in the report: `rg -n "file_put_contents|fopen\(|new PDO|mysqli|data/(leads|clicks|contacts|partner_assignments)\.json|submit-lead\.php|redirect\.php|go\.php|track-click|fetch-cibil|auth-proxy|postback" public_html --glob '!public_html/{deploy_update,admin,crm}/**'`. Every remaining hit is either removed, justified (for example the retired `crm.php`), or listed for the user. `postback.php` stays untouched until partners are moved to Node (the user's call).
8. Write a visitor-flow test script (manual checklist or small script) covering: landing page → apply → offers page → partner click-out; eligibility check; contact form; status page; OTP login. Record PASS/FAIL against the test DB and a local PHP server if the user has one; otherwise list what the user must test after deploying.
Exit (Gate 8): the live-site pages contain no data-file or MySQL access and call Node for every backend job; each visitor flow is described and tested as far as possible; the report lists everything the user must check after deployment.

### Phase 9 — Cutover support (user's call)
Tasks: document the exact deploy steps (CRM build with `VITE_BACKEND_API_URL`, website file changes, `.env` values, `CORS_ORIGINS`), the order (Node first, then CRM and website), a rollback plan, and what to monitor. List the legacy files that become deletable but **do not delete them**: `public_html/api/`, `public_html/admin/api/`, `public_html/crm/api/`, `public_html/submit-lead.php`, `public_html/redirect.php`, `public_html/go.php`, `public_html/postback.php` (only after partners are moved), `public_html/submit-contact.php` data write, `public_html/data/*`, `*.csv` logs, `public_html/crm/redirect.php`, `public_html/crm/submit-lead.php`, `public_html/crm/data`, `public_html/crm.php` and `admin-dashboard.php` (retired), `deploy_update/`, `crm/crm_subdomain_update/`, `scratch/`. Remind the user: backups first, confirm partners use the new postback/redirect URLs (or the web-server rewrite is in place), confirm no live page calls the removed PHP, rotate the exposed credentials, and make the GitHub repo private.

## Current application architecture

- Framework: React 19
- Build tool: Vite
- Styling: Tailwind CSS 4 through the Vite plugin
- Main entry: `src/main.jsx`
- Application shell and routing-by-state: `src/App.jsx`
- Main API client: `src/utils/apiConfig.js`
- Current backend base URL: `https://api.paisainminutes.tech`
- Authentication implementation: mostly browser localStorage/sessionStorage in `src/utils/authService.js`
- Current lead refresh: `App.jsx` polls the Node API approximately every 3 seconds after local login
- Current frontend Git root: this repository

## Required target architecture

All runtime server requests must go to the Node server through a single API client or clearly defined Node API modules.

The frontend must not depend on:

- Any `.php` endpoint
- `redirect.php`
- Root-level `submit-lead.php`
- `/crm/api/...`
- `/admin/api/...`
- Static lead JSON as a production source of truth
- Browser localStorage as the primary store for staff, financial records, assignments, or lead mutations

Local browser storage may remain for non-authoritative UI preferences such as the last active tab or a short-lived cache, but it must not be treated as the database.

## High-priority findings

### A. Direct PHP dependencies still in the frontend

Replace all of these before deleting PHP:

| Frontend location | Current legacy request | Required action |
|---|---|---|
| `src/components/PartnerPortalView.jsx` | `/crm/api/update-lead.php` | Replace with Node PATCH endpoint and a Node-supported partner update contract |
| `src/components/PartnerPortalView.jsx` | `/crm/api/export-partner-leads.php` | Replace with Node CSV export endpoint or client-side export from authorized data |
| `src/components/LeadsView.jsx` | `/crm/api/partner-events.php` | Replace with Node partner-events route |
| `src/components/LeadsView.jsx` | `/crm/api/delivery-logs.php` | Replace with Node delivery-log route |
| `src/components/DeliveryLogView.jsx` | `/crm/api/delivery-logs.php` | Replace with Node delivery-log route |
| `src/components/Sidebar.jsx` | `/crm/api/export-partner-leads.php` | Replace with Node export route |
| `src/components/ExecutiveDashboard.jsx` | `/api/executive-overview.php`, `/crm/api/executive-overview.php`, `/admin/api/executive-overview.php` | Replace with Node executive overview route |
| `src/components/PartnerAnalyticsKPISummary.jsx` | `/api/partner-analytics-kpi.php`, `/crm/api/partner-analytics-kpi.php` | Replace with Node partner KPI route |
| `src/utils/authService.js` | `/crm/api/partner-users.php` | Replace with Node partner/staff account route |
| `src/data/affiliatePartners.js` | `/redirect.php`, `/crm/api/track-click.php` | Replace with Node click/assignment tracking route |
| `src/utils/apiConfig.js` | legacy path translation and PHP fallback paths | Remove after equivalent Node routes exist |

Use `rg -n "\\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src` after migration. The only remaining matches should be historical documentation or an explicit migration note, never executable runtime code.

### B. Current Node API routes that the frontend already uses

These are the existing intended Node routes:

- `GET /api/health`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/refresh`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/lenders`
- `GET /api/lenders/:id`
- `GET /api/lenders/offers`
- `POST /api/loan-applications`
- `GET /api/loan-applications/all`
- `GET /api/loan-applications/my`
- `GET /api/loan-applications/phone/:phone`
- `GET /api/loan-applications/:id`
- `PATCH /api/loan-applications/:id`
- `DELETE /api/loan-applications/:id`
- `DELETE /api/loan-applications/all`
- `GET /api/documents`
- `POST /api/documents/upload`
- `GET /api/documents/:id/download`
- KYC and credit-score routes under `/api/kyc` and `/api/credit-score`

The frontend must use these routes through `BACKEND_BASE`, not relative PHP paths.

### C. Missing Node functionality required by current screens

The frontend currently renders or attempts to render the following features, but the Node server does not provide corresponding routes:

- Executive overview and date-period metrics
- Partner analytics/KPI summary
- Partner user creation/list/update
- Partner event history
- Delivery logs
- Partner lead export
- Partner click tracking
- Partner assignment persistence
- Payout requests
- Settlements
- Invoices
- Commission rate cards
- Audit/activity log
- Integration settings
- Notification templates/settings
- General CRM settings

Do not fake these with localStorage. Either implement their persistence in Node/Prisma or explicitly remove/disable the screen until its backend contract exists.

## API contract discrepancies to fix in the frontend

### 1. Authentication mismatch

`src/utils/authService.js` currently authenticates users locally using seeded staff data and passwords stored in frontend state/localStorage. The Node server uses OTP/JWT authentication.

Required frontend work:

1. Replace local password comparison with Node authentication.
2. Implement OTP send/verify UI or create a deliberate server-side CRM login contract if CRM staff authentication is different from customer OTP authentication.
3. Store access and refresh tokens securely according to the chosen browser strategy.
4. Attach bearer tokens to all protected requests through one helper.
5. Handle token expiry and refresh.
6. Stop treating localStorage staff records as authenticated authority.
7. Keep role and permission data sourced from the server.

### 2. Node `optionalAuth` behavior must not be assumed by the frontend

The frontend currently sends many requests without a real Node JWT. The server middleware can fall back to a default/demo user. The frontend must not rely on that behavior.

After the server is secured, unauthenticated requests should produce a clear login state, not an empty-data fallback or an accidental default user.

### 3. Loan application phone lookup response mismatch

The Node route returns:

```json
{ "applications": [] }
```

`fetchLoanApplicationByPhone()` currently checks `application`, `lead`, or the entire response object and does not correctly map `applications`.

Required fix:

- Map `data.applications` explicitly.
- Decide whether the UI needs one latest application or all applications.
- Preserve the selected application ID when opening a dossier.

### 4. Partner status mismatch

The Node server accepts only:

```text
FRESH
CALLBACK
INTERESTED
DOCS_RECEIVED
APPROVED
DISBURSED
REJECTED
```

The partner UI currently uses `Contacted` and `Redirected`. Define a single canonical status model. Prefer adding explicit server-side fields such as `deliveryStatus`, `partnerStatus`, or `eventType` rather than putting non-CRM workflow states into `status`.

Update all filters, badges, counters, and mutations to use the canonical contract.

### 5. Partner update payload mismatch

`PartnerPortalView.jsx` currently sends fields including:

- `remarks`
- `updated_by`
- `partner_id`
- `assignedCompany`
- `disbursedAmount`
- `loanAmount`

The Node loan PATCH route currently allows only:

- `status`
- `selectedLenderId`
- `lenderApplicationId`

The frontend must be updated only after the server provides a validated partner update contract. Do not silently claim success while only updating local React state.

### 6. Lender/partner identity mismatch

`apiConfig.js` sometimes treats a partner assignment as `selectedLenderId`. A partner slug or partner name is not necessarily a valid Prisma lender ID.

Required fix:

- Keep `selectedLenderId` for the actual lender table only.
- Keep affiliate partner identity in a separate field such as `partnerId` or `assignedPartnerId`.
- Never write a partner slug into `selectedLenderId`.

### 7. Lead assignment and click tracking mismatch

The frontend enriches Node applications using static JSON and data associated with `redirect.php`. This is not a durable source of truth.

Required fix:

- Fetch assignments/events from Node.
- Match by stable application ID wherever possible.
- Use normalized phone only as a fallback, never as the sole permanent identity.
- Remove mutation of fetched response objects that invents backend fields in the UI.

## Frontend files requiring focused work

### Core data/auth

- `src/utils/apiConfig.js`
- `src/utils/authService.js`
- `src/data/staffData.js`
- `src/App.jsx`

### Direct legacy API consumers

- `src/components/PartnerPortalView.jsx`
- `src/components/LeadsView.jsx`
- `src/components/DeliveryLogView.jsx`
- `src/components/ExecutiveDashboard.jsx`
- `src/components/PartnerAnalyticsKPISummary.jsx`
- `src/components/Sidebar.jsx`
- `src/data/affiliatePartners.js`

### Browser-only persistence to review

- `src/App.jsx`
- `src/utils/authService.js`
- `src/components/StaffView.jsx`
- payout, settlement, and invoice views
- activity and security incident storage

## Legacy files that become deletable after migration (the user decides; the frontend agent must NOT delete them)

### Root-level legacy files

- `redirect.php`
- `submit-lead.php`
- `partner_assignments.json`
- `leads_log.csv`

### Legacy API directory

- `api/*.php`
- `api/*.json` assignment data where no longer needed
- duplicate `get-leads` and `submit-lead` variants

### Legacy deployment artifact

- `crm_subdomain_update/`

This directory contains another copy of PHP APIs and built assets. It must be treated as a deployment artifact and audited separately before removal. Do not remove it merely because the main source code has been migrated; first confirm no deployment script, hosting document root, or DNS path still points to it.

### Static fallback data

Review and remove or archive after backend migration:

- `data/leads.json`
- `data/clicks.json`
- `data/lead_partner_events.json`
- `data/partner_assignments.json`
- `public/data/*`
- CSV lead files

Do not delete historical data without creating a backup and confirming whether it must be imported into MongoDB through the server migration scripts.

## Acceptance criteria

- No executable frontend source contains `.php`, `/crm/api`, `/admin/api`, or `redirect.php` references.
- All lead reads and writes use the Node API.
- All protected requests use real authentication tokens.
- Partner users cannot view another partner’s leads.
- Partner updates persist in the Node database and are visible after refresh.
- Status filters use one canonical status model.
- Phone lookup correctly handles multiple applications.
- Lender IDs and partner IDs are not mixed.
- Dashboard and KPI data are server-backed or explicitly marked as local-only with product approval.
- Payout, settlement, and invoice data do not exist only in localStorage.
- CSV export works without PHP.
- Click tracking and partner assignment work without PHP.
- `npm run build` succeeds.
- `npm run lint` succeeds or documented existing lint issues are resolved.
- Browser smoke test shows no failed legacy API requests.
- Git working tree contains only intentional migration changes.

## Verification commands

Run from the frontend repository:

```bash
rg -n "\\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src
npm --prefix public_html/crm run lint
npm run build
git status --short
```

When dependencies are unavailable, install them only after confirming the project’s intended Node version and lockfile usage. Do not overwrite the lockfile casually.

## Screen parity checklist

Each of these screens must work after migration exactly as before (same look, same actions). Source: `src/components/`.

`LoginModal`, `Navbar`, `Sidebar`, `MyProfileView`, `StaffView`, `RolesPermissionsView`, `LeadsView`, `CompanyLeadsView`, `LoansView`, `PipelineView`, `ApplicationTracker`, `ReloanOpportunities`, `SalesDashboard`, `ExecutiveDashboard`, `KPISummary`, `PartnerAnalyticsKPISummary`, `ReportsView`, `DisbursalView`, `CollectionDashboard`, `CollectionsView`, `PartnerHubView`, `PartnerPortalView`, `PartnerOnboardingModal`, `PartnerAgreementsView`, `DeliveryLogView`, `CommissionRateCardsView`, `CommissionSummaryView`, `PayoutRequestsView`, `SettlementsView`, `InvoicesRaisedView`, `AuditLogView`, `IntegrationSettingsView`, `NotificationsView`, `GeneralSettingsView`, `ErrorBoundary`.

Also the cross-cutting behaviors: login/logout, session expiry handling, role-based menu visibility, lead search/filter/sort/export, lead status change, lender/partner assignment, partner click tracking and outbound redirect, partner-specific portal view, CSV exports, toasts/error messages.

## Additional verified findings (fix all of them)

1. **Real credentials are in source.** `src/utils/authService.js` contains hardcoded staff/partner passwords (including a Super Admin password and default partner passwords) and logic that rewrites stored passwords. Remove ALL of them, delete the local password comparison and the seeded staff in `src/data/staffData.js`, and do not copy any value into docs, tests or commits. The user must rotate the exposed Super Admin password (tell them in your completion report). Check `crm_subdomain_update/` and `dist`/built `assets/` for the same strings, and report (do not edit) what you find there.
2. **Silent success.** `PartnerPortalView.jsx` shows "Lead status updated" without checking `res.ok`, and `authService.js` partner-user calls use `.catch(() => {})`. Every mutation must check the response, show the server error, and only update React state after server success (or roll back).
3. **Local-compute fallbacks hide missing APIs.** `ExecutiveDashboard.jsx` and `PartnerAnalyticsKPISummary.jsx` fall back to computing from the local leads list when the API fails. Use server data as the source; if the API fails, show an error/retry, not a different number set. The KPI screen also hardcodes `period=FY2026-27&asOf=2026-08-20`; drive these from the UI selector/current date.
4. **Many calls bypass `BACKEND_BASE`** and use relative paths (`/crm/api/...`), which hit whichever host serves the CRM. Route every request through one API module that prefixes `BACKEND_BASE`, attaches the bearer token, refreshes once on 401, parses errors, and applies a timeout.
5. **Lead pagination.** `GET /api/loan-applications/all` will become paginated (max 500 per page). The lead loader must page until `total` is reached (or use server filters) and must not assume one response holds everything. Keep the 3-second polling out: use a longer interval (30s+) or a manual refresh, and pause when the tab is hidden.
6. **Browser-only stores to remove as sources of truth:** `pim_tracking_*`, `pim_partner_routing_history`, `paisa_crm_payout_requests`, `paisa_crm_settlements`, `paisa_crm_invoices`, `paisa_crm_activity_log`, `paisa_security_incidents`, `paisa_crm_lead_overrides`, `pim_deleted_leads`, staff list. Also the static data modules in `src/data/` (`payoutsData`, `settlementsData`, `invoicesData`, `rateCardsData`, `staffData`, `rolesPermissionsData`, `integrationsData`, `generalSettingsData`, `notificationTemplates`, `agreementsData`) must stop being the runtime store; they may stay only as UI constants (labels, option lists).
7. **Merging assignments from static JSON** (`loadLeadEnrichmentMap` and friends in `apiConfig.js`) must be replaced by `assignedPartnerId` / `partnerStatus` returned by the server on each application.
8. **Roles in the UI** come from `user.permissions` returned by the server. A client-side role check is only for hiding menus.
9. **Legacy data stays in place.** The static JSON, CSV and PHP files are inputs for the server import script. Do NOT delete or modify them; the user decides on deletion later.

## UI must stay the same

The user wants the screens (including payouts, settlements, invoices, rate cards, commissions, activity log, roles and permissions, integrations, notifications, general settings, staff) to look and behave exactly as they do today. Do not redesign, remove or rename screens or fields. Change only where the data comes from (the Node API) and how login works (email + password against the Node server, no OTP for staff). If a server route is not ready yet, keep the screen and show a small inline "not available yet" state for the data instead of hiding the screen. Remove only the hardcoded credentials and seeded staff from source.

## Important security notes

- Never expose raw PAN values in logs, UI, exported files, or error messages.
- Never keep real passwords in frontend source or localStorage.
- Do not treat a frontend role check as authorization.
- Do not trust `partner_id`, `currentUser`, or `updated_by` values supplied by the browser.
- Do not use static JSON files as a security boundary.
- Do not remove historical lead data before confirming backup/import requirements.

## Completion report

(Frontend agent appends a "Phase N report" for each phase as it finishes, then a final summary: routes consumed, screens left in a "not available yet" state, commands run with results, deviations from the contract, and user actions required such as rotating the exposed Super Admin password.)

## Audit report (Step B0) — 2026-10-01, frontend agent

Written for: the user and the server agent. Read-only audit; no server, CRM or website file was changed. Only this section was appended.

**Verdict: AUDIT PASSED. 0 blockers, 11 non-blockers.** Per the instructions I have STOPPED here and not started Phases 0-9.

### 1. What was run, and against what
- A local throw-away MongoDB replica set (`127.0.0.1:27018`, db `crm_test`, from the server's `.env.test`). No shared, Atlas or production database was touched.
- Server started in `NODE_ENV=test` (SMS stubbed, rate limits off unless `TEST_RATE_LIMIT=1`). Accounts were created through the API as a seeded SUPER_ADMIN (random password in a 600-mode scratch file, now deleted; no secret printed). Roles `admin`, `editor` (leads.read+update), `reader` (leads.read), two partners and two partner users were created by API calls.
- 284 real HTTP checks in scripts (kept in the session scratchpad, outside both repos). Final tally: all pass except the 5 non-blocker findings below (T10/T11 failed only because my test sent an invalid `eventType`; re-run correctly they PASS).

### 2. Exact commands
```
cd /home/primordic/projects/adgrow/paisa/server
npm test                                  # pretest pushes schema to crm_test; jest --runInBand
SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... node -r ./tests/setup-env.js prisma/seed-admin.js   # values not shown
PORT=4555 NODE_ENV=test node -r ./tests/setup-env.js src/index.js          # main audit server
PORT=4556 node <scratch>/start-variant.js        # same, TEST_RATE_LIMIT=1  (429 checks)
PORT=4557 AUDIT_DB_URL=mongodb://127.0.0.1:27999/... node <scratch>/start-variant.js   # unreachable DB (503 checks)
node audit1.js; node audit2.js; node audit3.js; node audit4.js; node audit5.js    # scratchpad scripts, fetch() against localhost
rg -n "\.php|/crm/api|/admin/api|fetch\(|BACKEND_BASE" public_html/crm/src          # screen inventory (read-only)
```
Attempted but **denied by the permission classifier and not retried**: `node prisma/seed-config.js ... --apply` (writes to the test DB). I created partners/roles through the API instead, so the seed script's apply path was not exercised (its dry-run was verified by the server agent only).

### 3. Server test suite
`npm test`: **16 suites, 268 tests, 268 passed** (matches the handoff pack). Prisma 6.19.3, local MongoDB. One expected console error (a test that simulates "db down").

### 4. Route table — PASS/FAIL (real requests)
| Area / route | Result | Evidence |
|---|---|---|
| `GET /api/health`, `/health/ready` | PASS | 200; ready reports `db:"up"`, and 503 `db:"down"` when DB unreachable |
| `POST /api/auth/staff/login` | PASS | keys `success, token, refreshToken, user{id,name,email,role,permissions,partnerIds,status}` (+`mustChangePassword`); wrong pw / unknown user both 401; empty body 400; no hash in response; lockout after 5 bad tries (**423**, see N4); IP limiter 429 after 20 tries/15 min |
| `POST /api/auth/refresh` | PASS | new access + rotated refresh; replay of old token 401 and the family is revoked; garbage 401 |
| `POST /api/auth/staff/logout` | PASS | `{success}`; refresh after logout 401; no token 401 |
| `POST /api/auth/staff/change-password` | PASS | wrong current password rejected (happy path covered by server tests) |
| `GET /api/crm/me` | PASS | `{success,user}`; no/bad token 401; disabled account loses access at once |
| Leads `POST /api/loan-applications` (public) | PASS | 201 |
| Leads `GET /all` | PASS | `{applications,page,limit,total}`; limit capped 500; filters status/q(phone, leadCode)/from/to/partnerId; no token 401; PAN never present; no hashes |
| Leads `GET /phone/:phone` | PASS | `{applications}`; no match → 200 empty (nothing fabricated); no token 401 |
| Leads `GET /:id` (id or leadCode) | PASS | 404 for missing; 401 without token |
| Leads `PATCH /:id` | PASS | editor ok; reader 403; invalid status 400; `phone/userId/updated_by/partner_id/currentUser` ignored (phone unchanged); nothing-valid 400; negative/fractional amount 400; partner slug as `selectedLenderId` rejected; unknown `assignedPartnerId` rejected; staff cannot set `partnerStatus`; 404 missing; response has `assignedPartnerId, partnerStatus, remarks, partnerRemarks, disbursedAmountRupees, updatedAt` |
| Leads PATCH as PARTNER | PASS | own lead ok (`partnerStatus`, `partnerRemarks`); other partner's lead 404; staff field `status` → 403; invalid `partnerStatus` 400; `disbursedAmountRupees` only with DISBURSED |
| Leads `DELETE /:id`, `/` (bulk), `/all` | PASS | no token 401; STAFF without `leads.delete` 403; PARTNER 403; ADMIN ok; `/all` needs `{confirm:"DELETE_ALL_LEADS"}` (400 otherwise); bulk needs ids+confirm; second delete 404; audit rows written |
| Partner isolation (list/detail/phone/filter) | PASS | partner B sees 0 of A's leads, `?partnerId=A` does not widen scope, detail 404, reduced PII view (no email/dob) |
| `GET/POST/PATCH /api/crm/partners` | PASS (N1,N5) | 201/409 duplicate slug/400 bad slug/403/401/404; secrets masked `{isSet,last4}`; **no `page`/`limit` in list (N1)** |
| Partner users (list/create/patch/reset/delete) | PASS | one-time temp password; duplicate 409; PARTNER cannot create (403); disable removes access at once; reset gives new temp; no hashes |
| `/api/crm/partner-assignments` | PASS | 201; repeat 200 `created:false`; different partner 409; no `partners.manage` 403; missing lead 404; partner sees only own |
| `/api/crm/partner-events` | PASS | partner appends on own lead 201, on another's 404; reader 403; list by `applicationId`; append-only (no PATCH/DELETE route) |
| `POST /api/public/partner-click`, `GET /api/public/redirect/:slug`, `/go/:slug` | PASS (N2) | target from stored partner URL only, body `url`/`?url=` ignored (no open redirect); repeat = `duplicate`; unknown/disabled partner 404; lead gets `assignedPartnerId` + `REDIRECTED`; 302 and `format=json`; missing `partner` returns 404 not 400 (N2) |
| `GET|POST /api/public/postback/:slug` (+ `/postback/:slug`) | PASS | wrong/missing secret 401; unknown lead 404; unknown status 400; valid 200 `{status,success,message}`; repeat idempotent; updates lead; other partner's postback 403/404; secret never echoed |
| `/api/crm/delivery-logs` (GET/POST/push/retry) | PASS | `{logs,stats{total,delivered,failed,pending,successRate},page,limit,total}`, camelCase log fields as in change request 1; partner isolation; retry needs `partners.manage` (403), missing 404; push without API configured = 4xx not 500 |
| `GET /api/crm/partners/:id/leads/export?format=csv` | PASS (N6) | text/csv; no raw PAN; PARTNER A own 200, PARTNER B on A 403; by slug ok; no token 401; missing 404; bad format 400 |
| `GET /api/crm/executive-overview` | PASS | all documented keys incl. `totals.*`, `trends`, `partners[]`, `leadsOverTime`, `recentActivity`; custom period honoured; bad period 400; no token 401; PARTNER scoped to own partner |
| `GET /api/crm/partner-analytics/kpi-summary` | PASS | documented `summary`/`partners[]` fields; FY period + `asOf` accepted; bad input 400 |
| Finance: rate-cards, commissions, payout-requests, settlements, invoices | PASS (N1,N7) | no token 401, reader/PARTNER 403; integer paise only (float/negative 400); duplicate payout (same partner+period, case/space-insensitive) 409; Idempotency-Key honoured; state machine (backward move rejected); invoice GST/total computed server-side (client total ignored), PAID immutable 409; settlement variance computed, duplicate `bankRef` 409, money fields immutable; commissions/calculate idempotent. `rate-cards` has no `page/limit` (N1) |
| `/api/crm/agreements` | PASS (N1) | partners.read; reader 403; no `page/limit` |
| `GET /api/crm/audit-logs` | PASS | `{logs,page,limit,total}`; filters actor/entity/action/date; reader/PARTNER 403; no secrets/PAN; **no client write or PUT route** (404) |
| Settings general / integrations / notification-templates | PASS | GET any staff (integrations: `settings.manage`); unknown key 400, invalid email 400; reader write 403; integration key stored write-only, response masked |
| Roles, staff | PASS | invalid matrix 400; duplicate email 409; ADMIN cannot create ADMIN (403); cannot disable self (409); reset gives temp password; no hashes |
| `POST /api/public/leads` (intake) | PASS | invalid/5xxxx phone 400; response has every PHP key (`status, success, message, lead_id, lead, cibil, cibilScore, cibil_auto_fetched, cibil_status, bureau_score, slab, eligibility, data{lead_id,cibil,cibilScore,cibil_auto_fetched,cibil_status,bureau_score,redirect_url}`); `lead_id` = `PIM-yyyymmdd-n`; phone-only then full = same lead; repeat = same id; 4 parallel posts = 1 lead; form-encoded and aliases (`mobile`, `loan_amount`, `salary`, `cibil`) work; no raw PAN echoed; `redirect_url` has lead_id/phone/salary/cibil/slab/utm_source |
| `GET /api/public/leads/lookup` | PASS | phone+code → `scope:"full"`; phone only → `limited`, no name; wrong phone with valid code 404; bad phone 400 |
| `GET /api/public/leads/status` | PASS | phone only: reference id, status, masked name, no amount/email/full phone; phone+code: name; unknown phone 404 |
| `POST /api/public/contact` | PASS | `{status,message,reference_id}`; duplicate within 10 min returns first id; invalid 400; honeypot silently dropped (not stored); staff list/patch protected (reader PATCH 403) |
| `POST /api/public/credit-check` | PASS (not run vs real bureau) | no consent 400, bad phone 400; without bureau key returns 200 `{success:false}` with no invented score; 429 after 4 per phone |
| `POST /api/auth/send-otp` (website OTP) | PARTIAL | only invalid-phone 400 and CORS preflight checked; happy path covered by server tests (customer OTP flow not exercised end to end here) |
| Misc | PASS | `/uploads` 404; unknown route JSON 404; 413 on oversize body; staff token on customer routes 401/403; no mock lenders; odd query chars no 500 |
| 429 | PASS | login (after 20), public leads (10/min/phone, 30/min/IP), contact, credit-check all return 429 `{success:false,error}` |
| DB down (no invented data) | PASS | with unreachable DB: leads intake, login, lenders, status, redirect all return 503 `service temporarily unavailable`; no fabricated records, no in-memory fallback |

### 5. PHP parity matrix — PASS/FAIL
| Legacy file | Result | Note |
|---|---|---|
| `submit-lead.php` (+copies) | PASS | response keys, slab/eligibility, upsert-by-phone, id format, no duplicates all verified |
| `get-leads.php` | PASS | `/all`, paged, single source |
| `update-lead.php` | PASS | PATCH + audit + `status_updated` event (event confirmed in events list) |
| `delete-lead.php` | PASS | single / bulk / all-with-confirm |
| `redirect.php`, `track-click.php`, `go.php` | PASS | no open redirect |
| `partner-events.php` | PASS | |
| `delivery-logs.php` | PASS | camelCase mapping needed in `DeliveryLogView.jsx` (change request 1) |
| `partner-users.php` | PASS | bcrypt, one-time password; "delete" = disable |
| `export-partner-leads.php` | PASS (N6) | |
| `executive-overview.php`, `partner-analytics-kpi.php` | PASS | documented differences only; unit is paise (UI must divide by 100) |
| `activity-log`, `payout-requests`, `rate-cards`, `integrations`, `settlements`, `invoices` | PASS (N7) | real collections; PUT is create/upsert-only for money records |
| `postback.php` | PASS | per-partner secret; no master secret |
| `loan-offers.php` server part | PASS | lookup route + intake |
| `track-status.php` | PASS | privacy-reduced (deliberate) |
| `submit-contact.php` | PASS | |
| `fetch-cibil.php` | PASS (bureau not run) | consent now required: the website page must send `consent:true` |
| `auth-proxy.php` | PASS (by design) | Node OTP routes used directly; needs `CORS_ORIGINS` set to the website origin (preflight to an unset allowlist correctly reflects nothing) |
| `apply-now.php`/`check-eligibility.php` | N/A (Phase 8, server side ready) | |
| `partner_tracking_service.php` MySQL | NOT VERIFIED | import path only (server agent: dry-run, no MySQL export supplied) |
| `crm.php`, `admin-dashboard.php` | out of scope | |

### 6. Screen parity — is there a route for every action? (read from `public_html/crm/src`)
| Screens | Data / actions today | Server route | Result |
|---|---|---|---|
| LoginModal, Navbar, MyProfileView, ErrorBoundary | local login, profile | `/auth/staff/login`, `/refresh`, `/logout`, `/crm/me`, `/change-password` | PASS |
| StaffView | staff CRUD, reset pw, status, shift lock, security incidents (`paisa_security_incidents`) | `/crm/staff*`, `/crm/roles`; shift lock = server login policy | PASS, except incidents (N9) |
| RolesPermissionsView | role matrix | `/crm/roles` | PASS |
| LeadsView, CompanyLeadsView, LoansView, PipelineView, ApplicationTracker, ReloanOpportunities, DisbursalView, SalesDashboard, KPISummary, ReportsView | lead list/filter/export, status change, lender/partner assign, delete, events, delivery logs, phone lookup | `/loan-applications/*`, `/crm/partner-assignments`, `/crm/partner-events`, `/crm/delivery-logs*` | PASS |
| LeadsView lender selection | writes `selectedLenderId` | `GET /api/lenders` returns `[]` on an empty DB (no mock lenders) | PASS, see N8 |
| PartnerPortalView | partner list, status update, CSV export | `/loan-applications/all`, `PATCH` (`partnerStatus`,`partnerRemarks`), export route (auth fetch + blob needed) | PASS |
| PartnerHubView, PartnerOnboardingModal, Sidebar | partner list/create/edit, partner users, export | `/crm/partners*`, `/crm/partners/users*` | PASS |
| DeliveryLogView | list, retry | `/crm/delivery-logs`, `/:id/retry` | PASS |
| ExecutiveDashboard, PartnerAnalyticsKPISummary | dashboards, KPI | `/crm/executive-overview`, `/crm/partner-analytics/kpi-summary` | PASS |
| CommissionRateCardsView, CommissionSummaryView | rate cards, commissions | `/crm/rate-cards`, `/crm/commissions(+/calculate)` | PASS |
| PayoutRequestsView, SettlementsView, InvoicesRaisedView | payouts, settlements, invoices | `/crm/payout-requests`, `/settlements`, `/invoices` | PASS (N7) |
| PartnerAgreementsView | agreements | `/crm/agreements` (metadata only) | PASS |
| AuditLogView | activity log | `/crm/audit-logs` (read only) | PASS |
| IntegrationSettingsView, NotificationsView, GeneralSettingsView | settings | `/crm/settings/*` | PASS |
| CollectionDashboard, CollectionsView | no network calls found; derived from leads/props | none needed if derived from leads | NOT VERIFIED (N10) |
| Click tracking (`affiliatePartners.js`) | beacons to `track-click.php`, `redirect.php` | `/api/public/partner-click`, `/api/public/redirect/:slug` | PASS |

### 7. Blockers
**None.**

### 8. Non-blockers
- **N1** `GET /api/crm/partners`, `/rate-cards`, `/agreements` return `total` but no `page`/`limit` (contract: all lists). Frontend can ignore; server may add later.
- **N2** `POST /api/public/partner-click` with no `partner` returns 404, not 400.
- **N3** `GET /metrics` is open when `METRICS_TOKEN` is unset and `NODE_ENV` is not production (404 in production per code). Make sure production runs with `NODE_ENV=production`.
- **N4** Account lockout returns **423** (not in the contract's status list). The login screen must show the message for 423 as well as 401/429.
- **N5** A PARTNER user can `GET /api/crm/partners` for their own partner and sees `apiEndpoint`, `webhookUrl`, `payloadMapping` and the last 4 characters of the postback secret. Consider returning a reduced view to PARTNER.
- **N6** Partner CSV export still has an "Email Address" column header. The test leads had no e-mail, so I could not prove the values are blanked (swagger says they are). Re-check with a lead that has an e-mail.
- **N7** Bulk `PUT` for payouts/settlements/invoices is create/upsert-only and refuses edits to money fields (deliberate). If a screen today lets the user delete or rewrite those rows, that behavior changes; use the item routes and raise it if it matters.
- **N8** `GET /api/lenders` returns an empty list on an empty DB; the lender dropdown needs real `Lender` rows in the target database (confirm production has them or that the server seeds them).
- **N9** No route for the browser "security incident" log (`paisa_security_incidents`, written by `shiftSecurity.js`). Server-side shift lock replaces the check; decide whether incidents should appear via `/crm/audit-logs` or be dropped.
- **N10** CollectionDashboard / CollectionsView have no API calls; assumed derived from the leads list. Confirm in Phase 0.
- **N11** Access tokens expire quickly (a token I saved earlier returned 401 minutes later), so the API client's refresh-once-then-retry logic is essential. Also remember the server rotates refresh tokens, and replaying an old one revokes the whole session family: do not fire parallel refreshes.

### 9. What I could NOT check
- Real bureau (`CIBIL`) calls, real SMS/OTP end to end, partner API push to an external https host (SSRF guard only by test), document upload/KYC (mock), production-mode behavior (CORS allowlist with real origins, mock-KYC 501, `/metrics` 404): read from code/docs, not run.
- Seed-config `--apply`, legacy import apply, and any MySQL tables: not run (permission denied / out of audit scope / no export).
- Swagger completeness was taken from the server's own `docs.test.js` (passes), not re-audited by hand.
- The test servers are stopped. The local `crm_test` DB still holds my audit data (throw-away; the next `npm test` resets it).

### 10. Next step
Waiting for your go-ahead to start Phase 0. Items worth deciding first: N4/N5/N7/N8/N9 (answers change small details in Phases 1, 3, 5), and the standing user actions from the server handoff (rotate exposed credentials, set `CORS_ORIGINS`, make the GitHub repo private).

## Phase 0 report — Baseline and inventory (frontend agent, 2026-10-01)

**Baseline (before any change)**
- `npm ci` in `public_html/crm` (lockfile used, `node_modules` is gitignored). `npm run lint` (oxlint): 0 errors, many warnings (unused vars/catch params, `react-hooks/exhaustive-deps`, `set-state-in-effect`) — all pre-existing, mostly `LeadsView.jsx`. `vite build` (to a scratch outDir, because the repo's build writes into `public_html/crm/` and overwrites the tracked `assets/index.js`, `assets/index.css`, `index.html`): succeeds, one 1.16 MB chunk warning (pre-existing).
- Note: the project's `npm run build` rewrites tracked build output. I only run a real build once, at the end of Phase 7.

**Runtime dependencies on PHP / non-Node data (`rg "\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src`)**
| File | Dependency |
|---|---|
| `utils/authService.js` | `/crm/api/partner-users.php` (create / toggle_status), staff + passwords in `localStorage` |
| `components/LeadsView.jsx` | `/crm/api/partner-events.php` (GET, POST), `/crm/api/delivery-logs.php` (GET, POST push/assignment), JWT in storage, `pim_tracking_*`, `pim_partner_routing_history` |
| `components/DeliveryLogView.jsx` | `/crm/api/delivery-logs.php` (GET, POST retry) |
| `components/PartnerPortalView.jsx` | `/crm/api/update-lead.php`, `/crm/api/export-partner-leads.php` (`window.open`) |
| `components/Sidebar.jsx` | `/crm/api/export-partner-leads.php` link |
| `components/ExecutiveDashboard.jsx` | `/api/executive-overview.php`, `/crm/api/...`, `/admin/api/...` fallback loop + local compute |
| `components/PartnerAnalyticsKPISummary.jsx` | `/api/partner-analytics-kpi.php` (hard-coded `FY2026-27`, `asOf=2026-08-20`) + local compute |
| `data/affiliatePartners.js` | `/redirect.php`, `/crm/api/track-click.php`, `paisainminutes.com/redirect.php?format=json` |
| `utils/apiConfig.js` | legacy path rewrite, `/data/leads.json`, `/admin/api/data/leads.json`, `leads_log.csv`, `partner_assignments.json` static enrichment, deleted-leads blacklist |
| `utils/geoService.js` | `https://ipapi.co/json/` (third-party IP lookup for the security-incident record; not PHP) |

**Browser-held data stores (all to be replaced)**: `paisa_crm_staff_list`, `paisa_crm_user`(session), `paisa_crm_payout_requests`, `paisa_crm_settlements`, `paisa_crm_invoices`, `paisa_crm_activity_log`, `paisa_security_incidents`, `paisa_crm_lead_overrides`, `pim_deleted_leads`, `paisa_crm_live_leads_cache`, `pim_tracking_*`, `pim_partner_routing_history`, `pim_jwt_token`/`paisa_crm_token`, plus Sidebar's `STORAGE_KEY`. UI-only preference kept: `paisa_crm_active_tab`.

**Screen → data source today**
- Node (leads only, via `apiConfig.js`): LeadsView, CompanyLeadsView, PipelineView, ApplicationTracker, LoansView, ReloanOpportunities, DisbursalView, SalesDashboard, KPISummary, ReportsView, CollectionDashboard, CollectionsView, CommissionSummaryView, PartnerHubView (all take the `leads` array from `App.jsx`).
- PHP: PartnerPortalView, DeliveryLogView, ExecutiveDashboard, PartnerAnalyticsKPISummary, Sidebar (export).
- Browser only: StaffView/LoginModal/Navbar/MyProfileView (staff list), RolesPermissionsView, AuditLogView, PayoutRequestsView, SettlementsView, InvoicesRaisedView (App.jsx state + localStorage), CommissionRateCardsView, PartnerAgreementsView, IntegrationSettingsView, NotificationsView, GeneralSettingsView (static `src/data/*` modules), PartnerOnboardingModal (pushes into the in-memory `AFFILIATE_PARTNERS`).

**Hard-coded credentials (values NOT repeated here)**: the Super Admin password and three default partner passwords are literals in `src/utils/authService.js`, `src/data/staffData.js`, and `components/StaffView.jsx` (default partner password). The same Super Admin literal also appears in built/legacy copies (reported, not edited): `public_html/crm/assets/index.js`, `public_html/crm/crm_subdomain_update/assets/index.js`, `public_html/admin/assets/index.js`, `public_html/crm.php`, and under `public_html/deploy_update/` (`crm.php`, `admin/assets/index.js`, `crm/assets/index.js`). The default partner password also appears in `crm/api/partner-users.php`, `includes/partner_tracking_service.php` and the same built bundles. **User action: rotate the Super Admin password and treat the partner defaults as exposed.**

**Git hygiene proposal — NOT RUN (needs your approval).** Tracked `.env` files: `public_html/.env`, `public_html/crm/.env`, `public_html/crm/crm_subdomain_update/.env` (database credentials), `public_html/deploy_update/.env`, `public_html/deploy_update/crm/.env`; plus 44 tracked lead/click/partner data files (`data/*.json`, `*.csv`, `leads_log.csv`, `partner_assignments.json`, `public/data/*`). Suggested `.gitignore` additions:
```
.env
**/.env
**/.env.*
!**/.env.example
**/leads_log.csv
**/clicks_log.csv
**/partner_assignments.json
public_html/data/
public_html/crm/data/
public_html/crm/public/data/
public_html/admin/**/data/
public_html/deploy_update/data/
```
and the untracking command (files stay on disk; run only after the server import has used them):
```
git rm --cached $(git ls-files | grep -E '(^|/)\.env$')
git rm --cached $(git ls-files | grep -E '\.csv$|(^|/)data/[^/]+\.json$|public/data/|partner_assignments\.json$|leads_log')
```
(the exact file list is 49 paths). History still contains them: make the GitHub repo private, rotate the DB password and all keys, and decide on a history purge.

**Per-screen behaviour baseline**: recorded inline in the Phase 7 screen-by-screen verification (each screen's visible tables/buttons are unchanged by design; the data source is the only change). Exit: inventory recorded.

**Phase 0 correction (added after Phase 7).** The "baseline build" in the Phase 0 report compiled the tracked production `index.html`, whose entry is the already-built `assets/index.js`, not `src/main.jsx` (the repo's `npm run build` first copies `index.dev.html` over `index.html`). The first real compile of the sources was done in Phase 1–7 (`cp index.dev.html index.html`, `vite build --outDir <scratch>`, then restore). The source baseline therefore had no recorded build result; lint (0 errors) was valid.

## Phase 1 report — API client and authentication (2026-10-01)
**Done**
- `src/utils/apiClient.js`: the single API module. Prefixes `BACKEND_BASE` (`VITE_BACKEND_API_URL`, default `https://api.paisainminutes.tech`), attaches the bearer token, on HTTP 401 refreshes **once** (single-flight, so parallel calls share one refresh — important because the server rotates refresh tokens and revokes the whole family on replay) and retries **once**, otherwise ends the session (login screen + "session expired" notice), 20 s timeout, never throws (`{ok,status,data,error}`), authenticated blob download for CSV.
- Token strategy (documented in the file): access + refresh token in `sessionStorage` of the tab (not `localStorage`), cleared on logout / tab close; a new window always asks for credentials, as before.
- `src/utils/authService.js` rewritten: login = `POST /api/auth/staff/login` (email or username + password), `restoreSession()` validates the stored session with `GET /api/crm/me` on page load, logout calls `POST /api/auth/staff/logout`, switching account revokes the previous account's refresh token, `changeOwnPassword()` (`/api/auth/staff/change-password`; the server revokes all sessions, so the app returns to the login screen), `mustChangePassword` accounts get a **forced change-password dialog** (`ChangePasswordModal.jsx`). Server `user` → UI user mapping (`role` label, `serverRole`, `permissions[]`, `partnerIds`, partner slug/name for partner accounts).
- Menus are rendered from the server permission list (`utils/permissions.js`, `Sidebar.jsx`): items and whole sections the account cannot use are hidden; a hidden tab shows "no permission". This is convenience only; the server re-checks every call.
- **Removed**: every hardcoded credential and seeded account (`authService.js`, `data/staffData.js` deleted), password rewriting, the browser staff list, the browser shift-lock logic (`utils/shiftSecurity.js` deleted), the 3-second polling (now 30 s, paused while the tab is hidden, plus manual sync), lead cache in `localStorage`. `LoginModal` keeps its look; the "off-hours" screen now shows the server's message.
- Login errors mapped: 401 wrong credentials, 403 disabled / off-hours, **423 account locked**, 429 too many attempts, 503.
- Built-bundle check: neither the Super Admin literal nor the partner default password is in `src/` or in the new `public_html/crm/assets/index.js` (verified by searching for the literals taken from git history; values not printed).
**Report only (not edited, per the plan):** the old Super Admin password literal still exists in `public_html/crm/crm_subdomain_update/assets/index.js`, `public_html/admin/assets/index.js`, `public_html/crm.php` and the `deploy_update/` copies; the default partner password also in `crm/api/partner-users.php` and `includes/partner_tracking_service.php`.
**Verified in a real browser (headless Chromium against the local test server + test DB):** wrong password message, login, session restore after reload, expired access token → one refresh → still signed in, both tokens bad → login screen, logout clears tokens and the server revokes the refresh token (401 afterwards), forced password change for a new partner user and a new telecaller, restricted menus for a telecaller.

## Phase 2 report — Lead workflows
- `utils/apiConfig.js` rewritten around the server shape. `getLeadsFromBackend` pages through `GET /api/loan-applications/all` (500 per page) until `total`; no static-file / CSV / `partner_assignments.json` enrichment, no deleted-lead or override stores, no fallback data (on failure the app shows an error banner with Retry, keeps the last loaded rows).
- `fetchLoanApplicationByPhone` reads `applications[]` (newest first) and returns all of them plus the newest; the dossier is opened by application id (`lead.id`).
- Status / lender / partner assignment / remarks use `PATCH /api/loan-applications/:id` with the shared allowlist; React state changes only after server success, otherwise a toast shows the server's error. Delete / bulk delete / delete-all go through the protected routes (delete-all needs the typed phrase `DELETE ALL LEADS`); delete buttons only show for SUPER_ADMIN/ADMIN with `leads.delete`.
- **Lender vs partner separation**: "assign to partner" writes `assignedPartnerId` (a real `AffiliatePartner.id`); the "Selected Lender" dropdown writes `selectedLenderId` from real `GET /api/lenders` rows; the invented `KNOWN_LENDERS` list is gone. The partner label shown comes from `assignedPartnerId`, never from a name match; the intake's suggested company is kept as `suggestedCompany` only.
- Partner delivery state is a separate field (`partnerStatus`): the Partner Portal's Fresh / Redirected / Contacted / Approved / Disbursed / Rejected filters and badges map to it; the CRM `status` stays the 7 canonical values.
- Fixed existing bugs found on the way: `LeadsView` called undefined setters (`setReassigningLeadId`, `setActiveFilter`, `setIsCustomDatePickerOpen`); `LeadsView` toasts were never rendered; `PipelineView` was never given the leads; `ReportsView`/`PartnerHubView`/`PartnerPortalView` compared title-case statuses (`'Approved'`) against the canonical upper-case values; invented defaults removed (₹50,000 amounts, `'Rupay91'` fallback, fake `4.2 Days` settlement cycle, `100%` routing rate); `cleanLoanAmount` no longer re-interprets real numbers from the server; `InvoicesRaisedView` was missing its Billing Period cell (columns were shifted).
- Test/"add lead" forms: JWT token fields removed; the new lead is created through the public intake and then the chosen partner / lender is applied through `PATCH`.

## Phase 2B report — public intake as seen from the CRM
Test DB, through `POST /api/public/leads`: phone-only step, then the full form, then an identical repeat → one `lead_id` (`PIM-<date>-<n>`) for all three, one row in the CRM list, and the dossier shows leadCode, name, amount (1,80,000), salary, CIBIL 742, eligibility text and source correctly. No CRM mapping change was needed beyond Phase 2.

## Phase 3 report — Partner workflows
- `PartnerPortalView`: partner updates use `PATCH` with `partnerStatus` / `partnerRemarks` / `disbursedAmountRupees` only (no `updated_by`, `partner_id`, `currentUser`), result checked, toast shows server errors, CSV via authenticated blob download (`GET /api/crm/partners/:id/leads/export`, same for the sidebar link).
- `LeadsView` events panel = `GET /api/crm/partner-events?applicationId=`; "Push to Partner API" = `POST /api/crm/delivery-logs/push`; `DeliveryLogView` = `GET /api/crm/delivery-logs` (+ `POST /:id/retry`), camelCase fields mapped per change request 1.
- Click tracking: outbound links are `GET {API}/api/public/redirect/:slug` (target comes only from the stored partner URL), clicks recorded with `POST /api/public/partner-click`. `pim_tracking_*`, `pim_partner_routing_history` and every silent `.catch(() => {})` are gone.
- Partner accounts (Staff → Partner Accounts) = `/api/crm/partners/users` (create, enable/disable, **reset**), the server's one-time temporary password is shown **once** in a dialog (`TempPasswordModal`); onboarding a partner = `POST /api/crm/partners` + agreement record; partners are merged into the UI list from `GET /api/crm/partners` (`syncPartnersFromServer`, UI constants such as colours stay in `affiliatePartners.js`).
- Behaviour change: **"Login As Partner" (impersonation) is replaced by a read-only "Preview Portal"** (no server route exists to act as a partner, and impersonating client-side is exactly what the plan forbids). Verified: a partner sees only its own lead, can set Contacted, and can export a CSV; a partner never sees the staff menu.

## Phase 4 report — Reporting
`ExecutiveDashboard` reads `GET /api/crm/executive-overview` (period from the selector, custom dates only for "custom"); `PartnerAnalyticsKPISummary` reads `GET /api/crm/partner-analytics/kpi-summary` with `period` from a new selector (this month / last month / this FY) and `asOf` = today in Asia/Kolkata (the hard-coded `FY2026-27` / `2026-08-20` and the PHP fallback loops and local-compute fallbacks are removed; on failure an error + Retry is shown). Money arrives in paise and is shown in rupees. `CommissionSummaryView` and `ReportsView` use the same KPI report (payment status comes from settlements on the server).

## Phase 5 report — Finance and admin screens
Same screens, server data: payout requests (`/payout-requests`, state machine, duplicate prevention shows the 409 message inside the dialog), settlements, invoices (GST/total computed by the server), rate cards (`/rate-cards`; "tiered" ↔ `slab`, "per lead" ↔ `fixed_per_lead`; partners without a card get an empty card to configure), commission summary, agreements (`/agreements`), activity log (`/audit-logs`, read-only), roles & permissions (`/roles`), staff (`/staff`, one-time temporary password), integrations (`/settings/integrations`), notification templates, general settings (`/settings/general`). `src/data/*` runtime stores deleted (`payoutsData`, `settlementsData`, `invoicesData`, `rateCardsData`, `agreementsData`, `integrationsData` [it held partner keys/secrets], `generalSettingsData`, `notificationTemplates`, `staffData`; `rolesPermissionsData` keeps only the UI layout constants). `localStorage` now only holds two UI preferences (`paisa_crm_active_tab`, `paisa_crm_sidebar_sections`).
Notes: integration API keys / shared secrets are write-only (masked tail shown, an "Update credentials" field was added so the rotated values can be entered); the "Test Endpoint Ping" button now says "Not available yet" (it used to fake a success); the Login History tab now lists real sign-in events from the audit log (needs `audit.read`; per-user GPS/IP columns were fake and are gone); a "Block sign-in outside shift hours" checkbox maps to the server's `shiftLockEnabled`; notification templates are real but there is still no send route (the Send tab never had one).

## Phase 6 report — Verify imported data
**Not done.** The import is user-run (the `seed:config --apply` attempt in the audit was blocked by the permission system and I did not retry or look for a way around it). After the user runs the server's `import-legacy.js` on a copy, the checks to make in the CRM are: lead count equals the importer's report (the server's dry-run reported 279 rows → 49 leads), no duplicate phones except the 4 listed for review, every imported lead's partner shows in Partner Hub / company view, events in the dossier timeline, delivery logs and the one conversion. Nothing was patched client-side.

## Phase 7 report — Cleanup and verification
- `rg -n "\.php|/crm/api|/admin/api|redirect.php" public_html/crm/src public_html/crm/index.dev.html public_html/crm/vite.config.js` → **one hit, not executable**: `src/data/affiliatePartners.js:22` is the third-party partner's own apply URL (`rupay91.com/applynow.php`), a data string shown/opened for that partner (the server partner row has its own `applyUrl`, which overrides it after login).
- `npm --prefix public_html/crm run lint`: 0 errors (warnings remain, mostly pre-existing unused variables / hook-dependency hints in `LeadsView`). An extra `no-undef` pass (`oxlint -D no-undef` with browser globals) is clean.
- `npm run build`: succeeds (one pre-existing 1.1 MB chunk warning). **The real build overwrote the tracked deploy files** `public_html/crm/assets/index.js`, `assets/index.css`, `index.html` (that is how this repo ships the CRM); it was built with the default backend `https://api.paisainminutes.tech` — rebuild with `VITE_BACKEND_API_URL=...` if the API lives elsewhere.
- Browser smoke test (Chromium via playwright-core against a local server + the local test DB, scripts kept in the session scratchpad): login, dashboard, KPI, partner hub, delivery logs, agreements, commission summary, rate card edit, payout create/acknowledge, settlement record, invoice raise, activity log, staff create (+ temporary password dialog), partner accounts, login history, roles, integrations, notification templates, general settings save, reports, pipeline, partner portal (status update + CSV), telecaller with a limited menu. **Network log: no request to any `.php` URL and no failed legacy request; the only 4xx/5xx seen were intended (wrong password, duplicate payout).**
- Screens not reachable from `App.jsx` today and left untouched: `LoansView`, `SalesDashboard`, `DisbursalView`, `CollectionDashboard`, `CollectionsView`, `ReloanOpportunities`, `KPISummary` (no network calls; they only take the `leads` prop).

## Phase 8 report — Website switch (edited in `public_html/`; nothing deployed)
**Changed**
- `includes/header.php`: reads `BACKEND_API_URL` from `.env` (`$pim_node_api_url`), sets `window.backend_server_url` and `window.otp_api_base_url` to it (the OTP modal / resend call Node's `/api/auth/send-otp` / `/verify-otp` directly; `/api/auth-proxy.php` is no longer referenced).
- `apply-now.php`, `check-eligibility.php`: the four (three) submissions are now **one** `POST {Node}/api/public/leads`; same field names, same redirect-to-offers behaviour (`data.redirect_url`, fallback URL, 1.8 s safety timeout), same validation messages. `/api/fetch-cibil.php` → `POST /api/public/credit-check` with `consent:true`, **sent only after consent is ticked** (apply-now: the step-1 credit-bureau checkbox; check-eligibility has no bureau-specific checkbox, so the check now runs once both existing agreement boxes are ticked — **please confirm this wording is acceptable or add a dedicated bureau consent checkbox**). Removed the JWT token field, the full-profile (incl. PAN) `localStorage` writes and the PAN `sessionStorage` write.
- `js/main.js` + `js/main.min.js` (hand-patched identically; `node --check` passes): the home modal sends the phone-only step as `{phone, utm_source, lead_source, source}` to Node — the old code sent **invented** amount 50000 / salary 35000 / CIBIL 750 / partner Rupay91 for every visitor; the resend-OTP call uses Node's route and response shape.
- `loan-offers.php`: the block that created/updated leads in `data/leads.json` and `crm/leads_store.json` and the `data/leads.json` read are gone; missing details come from `GET /api/public/leads/lookup` (server-side cURL, 1 s connect / 3 s total, silent fallback to the URL values). "Apply Now" links point to `{Node}/api/public/redirect/:slug`; the click beacon is `POST /api/public/partner-click` (idempotent with the redirect).
- `track-status.php`: status from `GET /api/public/leads/status` (3 s timeout, "service unavailable" message instead of a false "no application"). Visitors now see the masked name and no amount for a phone-only lookup (server privacy rule); `data/leads.json` and `leads_log.csv` reads removed.
- `contact-us.php` posts JSON straight to `POST /api/public/contact`; `submit-contact.php` is now only a forwarder to Node (no `data/contacts.json`, no CSV).
**Scan** (`rg` from the plan): remaining hits are all legacy backend files that no website page calls any more — `submit-lead.php` (+ `api/`, `crm/`, `admin/` copies), `redirect.php`, `go.php`, `router.php`, `api/*.php`, `postback.php`, `includes/partner_tracking_service.php` (MySQL + files), the retired `crm.php`, and `scratch/` dev scripts. `postback.php` and the `/go/`, `/postback/` router rules stay untouched until partners are moved to Node (the user's call). Stale copies not touched: `deploy_update/`, `crm/crm_subdomain_update/`, nested `admin/`, `scratch/`.
**Could not test**: there is no PHP interpreter on this machine, so none of the edited `.php` files was run or `php -l`-linted. **Run `php -l` on `apply-now.php check-eligibility.php contact-us.php loan-offers.php track-status.php submit-contact.php includes/header.php includes/otp-modal.php` and click through the flows before deploying.** What I did verify against the real Node server (test DB) is the exact request/response traffic these pages now use: `scripts/website-flow-check.mjs` (15/15 PASS: phone-only → full → repeat gives one lead, `redirect_url` present, PAN not echoed, credit check refuses without consent and never returns an invented score, lookup full vs limited, status found/404, contact accepted/rejected, partner click, CORS preflight).
**Manual visitor-flow checklist for after deploy** (record PASS/FAIL): (1) home page modal: enter a mobile number → lands on check-eligibility, CRM shows one phone-only lead; (2) apply-now: OTP modal → step 1 consent → form → submit → loan-offers page opens with the right name/salary (lead id in the URL) and **no `data/leads.json` write**; (3) check-eligibility submit → offers page; (4) offers page: "Apply Now" opens the partner site via the Node redirect and the CRM shows the lead as Redirected; (5) track-status with the same number shows reference id + status (masked name); (6) contact-us form → success message with a `MSG-` id, message visible in the CRM `contact-messages` route; (7) OTP login from the header works from the website origin (needs `CORS_ORIGINS`); (8) browser network tab on every page: no request to a `.php` data endpoint.

## Phase 9 report — Cutover notes (nothing deployed or deleted)
**Order**: (1) back up MongoDB and the current web root; (2) server: set `CORS_ORIGINS` (website + CRM origins), `PUBLIC_OFFERS_URL`, `TRUST_PROXY`, secrets; run the lead-code backfill before `prisma db push` if leads exist, `seed:admin`, `seed:config` (dry-run first), the import (dry-run first) — see the server `DEPLOYMENT.md`; (3) CRM: build with `VITE_BACKEND_API_URL=<node url> npm run build`, publish `public_html/crm/` (`index.html`, `assets/`); (4) website: upload the changed PHP/JS files listed in Phase 8; `.env` in the web root must hold `BACKEND_API_URL`; (5) run `scripts/website-flow-check.mjs` against production only with test phone numbers you agree to, then the manual checklist above.
**Rollback**: keep the previous `public_html/crm/` (assets + index.html) and the previous website files; the legacy PHP files are still in place (nothing was deleted), but the old CRM bundle expects the PHP data files, so a CRM rollback also means restoring the PHP data stores you backed up.
**Monitor**: `GET /api/health/ready`, 401/403/429/503 rates on `/api/auth/*`, `/api/public/*`, audit rows `auth.login_failed` / `auth.locked` / `auth.off_hours_blocked`, delivery-log failures, the `leads` count in the CRM vs the website visits.
**Files that become deletable after you confirm partners/website use Node (NOT deleted):** `public_html/api/`, `public_html/admin/api/`, `public_html/crm/api/`, `public_html/submit-lead.php`, `public_html/redirect.php`, `public_html/go.php`, `public_html/router.php`, `public_html/postback.php` (only after partners use the Node postback URL), `public_html/crm/redirect.php`, `public_html/crm/submit-lead.php`, `public_html/crm/data/`, `public_html/crm/public/data/`, `public_html/data/*`, `*.csv` logs, `public_html/includes/partner_tracking_service.php`, `public_html/crm.php`, `public_html/admin-dashboard.php`, `deploy_update/`, `crm/crm_subdomain_update/`, `scratch/`. Remember: backups first; rotate the exposed credentials; make the GitHub repository private; the `.env` files and lead/click data are still tracked in git (see Phase 0 proposal).

## Completion report (final summary, frontend agent)
**Done**: Step B0 audit, Phases 0–5, 7, 8 and the Phase 9 notes. **Not done**: Phase 6 (needs the user-run import); PHP syntax lint / live run of the edited website pages (no PHP here); any deletion of legacy files; any deploy.
**Routes consumed**: `/api/auth/staff/{login,logout,change-password}`, `/api/auth/refresh`, `/api/crm/me`, `/api/loan-applications/{all,phone/:phone,:id}` (GET, PATCH, DELETE, bulk, all), `/api/lenders`, `/api/crm/{partners,partners/users,partner-events,delivery-logs,executive-overview,partner-analytics/kpi-summary,rate-cards,commissions via KPI,payout-requests,settlements,invoices,agreements,audit-logs,roles,staff,settings/general,settings/integrations,settings/notification-templates}`, `/api/public/{partner-click,redirect/:slug}`; website: `/api/public/{leads,leads/lookup,leads/status,contact,credit-check,redirect/:slug,partner-click}`, `/api/auth/{send-otp,verify-otp}`.
**Screens in a "not available yet" state**: integration "Test Endpoint Ping"; notification **sending** (templates are live, there was never a send route); agreement **file download** (the server stores metadata only, the button still shows an alert).
**Commands run**: `npm ci`, `npm run lint`, `npx oxlint -D no-undef`, `vite build` (scratch, then the real `npm run build`), the audit/E2E scripts against the local test server and DB, `node scripts/website-flow-check.mjs`, `node --check js/main*.js`.
**Deviations from the contract / requests for the server agent (to relay via the user)**: (1) include `roleKey` / role name in the login and `/api/crm/me` `user` so staff roles display by name (UI shows "Staff" for STAFF accounts); (2) the shift lock is enforced at login only — a signed-in non-exempt user keeps working after hours and refresh tokens last 30 days: enforce it on refresh / per request; (3) list routes `/partners`, `/rate-cards`, `/agreements` lack `page`/`limit`; (4) `GET /api/crm/partners` shows a PARTNER user its own `apiEndpoint`, `webhookUrl`, `payloadMapping` and the last 4 characters of the postback secret — reduce for PARTNER; (5) the server returns the full phone of every lead assigned to a partner, so the portal's "masked until applied" is only cosmetic — mask server-side for `partnerStatus` NONE/ASSIGNED if that rule matters; (6) a per-lead commission fee has no field (carried in the rate card's slab label); (7) HTTP 423 (locked account) is outside the contract's status list (handled); (8) a read endpoint for contact messages exists (`/api/crm/contact-messages`) but the CRM has no screen for it (not in the screen list) — add a screen if the team wants to read website messages in the CRM.
**User actions**: rotate the Super Admin password and every credential found in `.env`/source/built bundles (listed in Phase 0 and the server handoff); make the GitHub repo private and approve the git-hygiene commands; set `CORS_ORIGINS`/`BACKEND_API_URL`/`PUBLIC_OFFERS_URL`; run the server seed + import; run `php -l` and the visitor checklist; decide whether to enable the shift lock; give partners their new postback URL/secret; confirm the bureau-consent wording on check-eligibility.


## Follow-up (after the first handoff): PHP installed, server fixes applied, git notes
**PHP.** A static PHP 8.4.23 CLI (with cURL, no root needed) is installed at `~/.local/bin/php` (added to `~/.bashrc`).
- `php -l` on all 8 edited website files: **no syntax errors**.
- I then ran the real pages with `php -S` against the local Node server + test DB: `track-status.php` (JSON and HTML: found, masked name, unknown number 404), `submit-contact.php` forwarder (success + `MSG-` reference), `loan-offers.php` (HTTP 200, 9 partner cards, applicant name from Node lookup, "Apply Now" links point at `/api/public/redirect/<slug>`), `apply-now.php` / `contact-us.php` / header (Node URL injected). No `data/*.json` or CSV file was created or changed by any page.
- Real browser through PHP: the Check Eligibility form was filled and submitted; the browser made `POST /api/public/credit-check` and `POST /api/public/leads`, followed the server's `redirect_url` to `loan-offers.php?lead_id=…&slab=…` and the lead exists on the server.
- **Important finding:** if the Node server's `CORS_ORIGINS` does not list the website's origin, the browser blocks the lead submission. The visitor is still sent on to the offers page (the 1.8 s fallback) but **the lead is silently lost**. I reproduced exactly this once before adding the origin. Set `CORS_ORIGINS` correctly and test one lead after every deploy.
- Not run: the full `apply-now.php` OTP flow (needs a real SMS), and the live partner click-through to the partner's own site.

**Server fixes applied (you authorised it).** In `/home/primordic/projects/adgrow/paisa/server`, all tests pass (17 suites, **275 tests**, 7 new in `tests/hardening2.test.js`), `swagger.md` regenerated:
1. Login, refresh and `/api/crm/me` now return `user.roleKey`; the CRM shows "Telecaller" instead of "Staff".
2. The working-hours (shift lock) policy is also checked on **token refresh**, so a signed-in non-exempt user cannot keep working past the shift end (at most the 15-minute access token).
3. `GET /api/crm/partners`, `/rate-cards`, `/agreements` return `page`, `limit`, `total` (default 50, max 500).
4. A PARTNER user gets only the basic fields of its own partner (no `apiEndpoint`, `webhookUrl`, `payloadMapping`, `dailyExportEmail`, `apiKey`, `postbackSecret`, `apiEnabled`).
5. A PARTNER user sees a masked phone (`XXXXXX1234`) for leads still in `NONE`/`ASSIGNED`; the real number appears after `REDIRECTED`/`CONTACTED`/`APPROVED`/`DISBURSED`/`REJECTED`. Staff are unchanged. The CRM was adjusted to accept masked numbers (it used to drop such rows).
6. Partner CSV export no longer has an "Email Address" column at all (staff/admin export keeps it).
7. `POST /api/public/partner-click` without `partner` → 400 (was 404).
8. New rate-card field `perLeadFeePaise` (integer paise, PATCH/POST/GET); the CRM stores the per-lead fee there instead of in a slab label. Schema change: one optional field on `RateCard` (`prisma db push` needed on a real database; additive, no data migration).
Not changed: `/metrics` stays open outside production when `METRICS_TOKEN` is unset (production returns 404); the 423 status for locked accounts is kept and handled by the CRM.
CRM rebuilt (`npm run build`) with these changes; the browser re-test (masked partner row visible, role name shown, per-lead fee saved) passed.

**Git cleanup.** Written as `GIT_CLEANUP.md` (repo root). Nothing was run.

**Phase 6 in plain words.** The old PHP system kept leads, clicks, partner events and delivery logs in loose JSON/CSV files (many copies that disagree). The server agent wrote an import script that merges all of them into MongoDB and removes duplicates (dry run said 279 rows become 49 leads, with 4 phone numbers listed "possible duplicates for review"). Phase 6 is my check, **after that import has actually been run on a real database**: open each CRM screen and compare with the importer's report (lead count, one lead per phone, the right partner on each lead, partner events in the dossier timeline, delivery logs, the 1 conversion, amounts and dates). Mismatches are listed, not patched in the browser. I cannot start because the import has not been run (and I was not allowed to apply it on the test DB). To unblock: run the server's `import-legacy.js` (dry run first) on a copy of the legacy `public_html` folder against a database you choose, then tell me which database and CRM login to use.

## Phase 6 report — Import run and verification (2026-10-01)
**What was run (all on this machine, nothing shared):** a copy of the legacy data (748 KB: `data/`, `crm/data/`, `crm/public/data/`, `admin/**/data/`, the CSV logs, `partner_assignments.json`; stale `deploy_update/` and `crm_subdomain_update/` left out) was imported into a **brand-new local MongoDB database `crm_import_check`** (replica set on 127.0.0.1:27018). Order: `prisma db push` → `seed-config --apply` (9 partners, 5 roles, 9 rate cards, 8 templates, 1 settings row, 9 agreements; no passwords or keys) → `import-legacy` dry-run → `--apply` → `--apply` again (idempotency). The same steps can be repeated on your real database; the exact commands are in the server's `DEPLOYMENT.md`. The database `crm_import_check` still exists locally if you want to look at it (`mongosh mongodb://127.0.0.1:27018/crm_import_check`). The text report is at `server/import-reports/phase6-local-check-latest.txt` (phones masked, no PAN).

**Result: PASS, with 1 decision and 1 correction that I made (below).**
| Check | Expected | Found |
|---|---|---|
| Input rows → leads | 279 rows read, every row accounted for | 49 inserted + 230 merged away + 0 skipped/deleted = 279, `reconciles: YES` |
| Independent count from the raw files | distinct phone numbers across all lead files/CSVs | **44** (my own Python count) = 44 users created in the DB |
| Leads with more than one application | the "possible duplicates for review" | 4 phones (49 leads − 44 phones = 5 extra applications; all >24 h apart, kept separate on purpose) |
| Lead codes | unique, kept from the old system | 49 of 49 have one, all distinct |
| Raw PAN anywhere in lead data | none | none (masked `ABCDE****F` only) |
| Partner assignments | one per assigned lead | 11 assignment records, 11 leads with an assigned partner, all consistent |
| Partner events | 31 | 31 created; 9 are linked to a lead; 22 belong to test ids that do not exist as leads (19 are `PIM-TEST-*`) — kept but not shown anywhere |
| Clicks | 129 usable of 189 | 129 imported, 60 skipped ("no matching partner" = visits that never clicked a partner) |
| Delivery logs / conversions | 1 each | 1 each imported; 1 more of each skipped (lead not found) |
| Second apply | changes nothing | 0 inserted, 49 unchanged, nothing new created |
| CRM screens (headless browser on this DB) | match the API | All Leads "Showing 49 of 49"; sidebar All Leads 49, Mobile-only 3, Duplicate Leads 10 (the 4 phones' leads); partner counts Rupay91 5 / Jhatpat 2 / Ticket2Loan 3 / UdhaarNow 1 = 11; Partner Allocated card 11; API Delivery Logs "1 log"; Rupay91 page "5 leads"; a disbursed lead's dossier shows the imported timeline (assigned, API pushed, outbound click, postback "Disbursed", API push failed). The Executive Overview "This Month" shows 0 because every imported lead is from September; "All time"/"Last Month" show 49. |

**Decision I made (please confirm): a partner-name label alone no longer assigns a lead.** The first import turned the old `assignedCompany` text into a real partner assignment for 28 of 49 leads, but only 11 had any evidence of being sent to a partner. The old text was often an automatic guess (CIBIL/salary rule or the offers page), and a real assignment makes the lead visible to that partner's login — i.e. personal data shared with a partner the applicant never chose. Now a lead is assigned only if there is an assignment record, a legacy partner status (Contacted, Redirected, …) or a partner postback; the label stays as text (27 leads) and an admin can assign them from the CRM. If you prefer the old behaviour, run the importer with `--trust-assigned-company`. (Server change in `legacyImport.js`, 5 new tests.)
**Correction I made:** a legacy partner **postback** (e.g. "Disbursed") now also marks the lead as assigned to that partner with `partnerStatus` DISBURSED/APPROVED/REJECTED (never lowering an existing status), as the live postback handler does. Before, the lead showed CRM status Disbursed but partner status "Assigned".
**CRM fixes found by this check:** the leads search did not find a lead by its lead code (it only matched the internal id) — fixed; the leads header said leads are "automatically dispatched to Rupay91" and the "Partner Allocated" card counted every lead as "Exclusive Partner Rupay91" — now it says "routed to the partner you assign" and counts leads that really have a partner (11).
**Not verified / for your real run:** I have not seen your real production data, only the legacy copy in this repo (31–39 leads per file, i.e. early testing data); partner users and passwords are not imported by design (create them again); the 22 orphan test events can be ignored. On the real database run the lead-code backfill **before** `prisma db push` if leads already exist (see the server report).
Server tests after these changes: 18 suites, **280 tests**, all passing. CRM rebuilt (`npm run build`), lint 0 errors.
