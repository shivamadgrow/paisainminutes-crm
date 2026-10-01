<?php
$canonical_url = "https://paisainminutes.com/5-lakh-personal-loan";
/**
 * 5 Lakh Personal Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹5 Lakh Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹5 Lakh Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹10,744/mo, min salary of ₹25,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "5 lakh personal loan, 5 lakh personal loan emi, 5 lakh loan eligibility, 5 lakh instant personal loan, low interest 5 lakh loan";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹5 Lakh personal loan?",
        "answer" => "At an interest rate of 10.49% p.a., the monthly EMI for a ₹5 Lakh personal loan is approximately ₹44,072 for a 1-year tenure, ₹23,186 for 2 years, ₹16,249 for 3 years, ₹12,799 for 4 years, and ₹10,744 for a 5-year tenure."
    ],
    [
        "question" => "What is the minimum salary required to qualify for a ₹5 Lakh personal loan?",
        "answer" => "Applicants typically need a minimum net monthly in-hand salary of ₹25,000 to ₹30,000. Lenders require your existing monthly EMIs (including the new loan) not to exceed 40% to 50% of your net monthly income."
    ],
    [
        "question" => "What CIBIL score is needed for ₹5 Lakh personal loan approval?",
        "answer" => "A CIBIL credit score of 700 or above is ideal for securing the lowest interest rates starting from 10.49% p.a. However, select NBFC partners on Paisa in Minutes also consider applicants with scores between 650 and 699 with stable income proof."
    ],
    [
        "question" => "How fast will the ₹5 Lakh loan amount be disbursed?",
        "answer" => "Once your digital KYC is verified and loan agreement is signed online, the ₹5 Lakh funds are directly credited to your verified bank account within 2 hours."
    ],
    [
        "question" => "Can I prepay or foreclose my ₹5 Lakh personal loan early?",
        "answer" => "Yes, most of our RBI-registered lending partners allow partial prepayment or full loan foreclosure after 6 to 12 completed EMI payments. Foreclosure charges range from 0% to 3% depending on the specific lender."
    ]
];

include 'includes/header.php';
?>

<!-- Page Specific CSS -->
<style>
.variant-hero {
    background: linear-gradient(135deg, #1B2A6B 0%, #0B132B 50%, #0F172A 100%);
    padding: 8.5rem 0 2.25rem 0;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
}
.variant-hero::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(74, 141, 255, 0.18) 0%, rgba(27, 42, 107, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
}
.variant-hero::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, rgba(15, 23, 42, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
}
.variant-hero-content {
    max-width: 780px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
}
.variant-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(59, 130, 246, 0.18);
    border: 1px solid rgba(147, 197, 253, 0.35);
    color: #93C5FD;
    padding: 0.25rem 0.85rem;
    border-radius: 50px;
    font-size: 0.74rem;
    font-weight: 600;
    margin-bottom: 0.65rem;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.15);
}
.variant-hero-title {
    font-size: 1.85rem;
    font-family: var(--font-heading);
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 0.5rem;
    letter-spacing: -0.015em;
    color: #FFFFFF !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.variant-hero-desc {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.88) !important;
    margin-bottom: 1.15rem;
    line-height: 1.55;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
}
.variant-hero-desc strong {
    color: #FFFFFF;
    font-weight: 700;
}
.variant-hero .open-apply-modal {
    background: #FFFFFF !important;
    color: #1B2A6B !important;
    font-weight: 700 !important;
    padding: 0.55rem 1.4rem !important;
    font-size: 0.84rem !important;
    border-radius: 50px !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2) !important;
    border: 1.5px solid #FFFFFF !important;
    cursor: pointer !important;
    transition: all 0.25s ease !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.35rem !important;
}
.variant-hero .open-apply-modal:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3) !important;
    background: #F8FAFC !important;
}
.quick-specs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.65rem;
    margin-top: 1.15rem;
    margin-bottom: 0.5rem;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
}
@media (max-width: 991px) {
    .variant-hero {
        padding: 7rem 0 2rem 0;
    }
}
@media (max-width: 768px) {
    .variant-hero {
        padding: 6.25rem 0 1.75rem 0;
    }
    .quick-specs-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .variant-hero-title {
        font-size: 1.5rem;
    }
}
@media (max-width: 480px) {
    .variant-hero {
        padding: 5.75rem 0 1.5rem 0;
    }
    .quick-specs-grid {
        grid-template-columns: 1fr;
    }
    .variant-hero-title {
        font-size: 1.3rem;
    }
}
.quick-spec-card {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    padding: 0.5rem 0.55rem;
    text-align: center;
    transition: transform 0.25s ease, background 0.25s ease;
}
.quick-spec-card:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.13);
    border-color: rgba(147, 197, 253, 0.45);
}
.quick-spec-val {
    font-size: 1.05rem;
    font-weight: 700;
    color: #60A5FA;
    margin-bottom: 0.15rem;
    letter-spacing: -0.01em;
    line-height: 1.2;
}
.quick-spec-lbl {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
}

.v-section {
    padding: 3.5rem 0;
}/* Sections */
.v-section {
    padding: 5rem 0;
}
.v-section-alt {
    background-color: #F8FAFC;
}
.v-heading-wrapper {
    text-align: center;
    max-width: 750px;
    margin: 0 auto 3.5rem auto;
}
.v-badge {
    display: inline-block;
    background: #EBF3FF;
    color: #1B2A6B;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 0.35rem 1rem;
    border-radius: 50px;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.v-title {
    font-size: 2.25rem;
    font-family: var(--font-heading);
    font-weight: 800;
    color: #0F172A;
    line-height: 1.3;
    margin-bottom: 1rem;
}
.v-subtitle {
    font-size: 1.05rem;
    color: #64748B;
    line-height: 1.6;
}

/* Table Styling */
.table-responsive-card {
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
    border: 1px solid #E2E8F0;
    overflow: hidden;
    margin-bottom: 2rem;
}
.financial-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}
.financial-table th {
    background: #F1F5F9;
    color: #1E293B;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 2px solid #CBD5E1;
}
.financial-table td {
    padding: 1.2rem 1.5rem;
    color: #334155;
    font-size: 0.95rem;
    border-bottom: 1px solid #E2E8F0;
}
.financial-table tr:hover td {
    background-color: #F8FAFC;
}
.badge-rec {
    display: inline-block;
    padding: 0.3rem 0.75rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
}
.badge-rec-primary {
    background: #DBEAFE;
    color: #1E40AF;
}
.badge-rec-success {
    background: #DCFCE7;
    color: #166534;
}

/* Cards Grid */
.usecase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.75rem;
}
.usecase-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 2rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
}
.usecase-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -5px rgba(27, 42, 107, 0.1);
    border-color: #93C5FD;
}
.usecase-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: linear-gradient(135deg, #EBF3FF 0%, #DBEAFE 100%);
    color: #1B2A6B;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
}
.usecase-icon-box svg {
    width: 26px;
    height: 26px;
}
.usecase-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.5rem;
}
.usecase-desc {
    color: #64748B;
    font-size: 0.95rem;
    line-height: 1.6;
}

/* Eligibility & Document Grid */
.eligibility-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: stretch;
}
@media (max-width: 850px) {
    .eligibility-container {
        grid-template-columns: 1fr;
    }
}
.matrix-card {
    background: #FFFFFF;
    border-radius: 16px;
    border: 1px solid #E2E8F0;
    padding: 2.5rem;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}
.matrix-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1B2A6B;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #EBF3FF;
}
.matrix-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.matrix-item {
    display: flex;
    justify-content: space-between;
    padding: 0.9rem 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 0.95rem;
}
.matrix-item:last-child {
    border-bottom: none;
}
.matrix-label {
    color: #64748B;
    font-weight: 500;
}
.matrix-value {
    color: #0F172A;
    font-weight: 700;
    text-align: right;
}

/* Process Steps */
.step-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.5rem;
}
.step-box {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 2rem 1.5rem;
    position: relative;
    text-align: center;
}
.step-num {
    width: 38px;
    height: 38px;
    background: #1B2A6B;
    color: #FFFFFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
    margin: 0 auto 1.25rem auto;
}
.step-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.5rem;
}
.step-desc {
    color: #64748B;
    font-size: 0.9rem;
    line-height: 1.5;
}

/* FAQs */
.faq-box {
    max-width: 850px;
    margin: 0 auto;
}
.faq-row {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
}
.faq-header-btn {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.25rem 1.5rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0F172A;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}
.faq-header-btn:hover {
    color: #4A8DFF;
}
.faq-answer-body {
    padding: 0 1.5rem 1.25rem 1.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.7;
}

/* CTA */
.variant-cta {
    background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%);
    color: #FFFFFF;
    padding: 5rem 0;
    text-align: center;
}
.variant-cta h2 {
    color: #FFFFFF;
    font-size: 2.4rem;
    font-weight: 800;
    margin-bottom: 1rem;
}
.variant-cta p {
    color: rgba(255,255,255,0.85);
    max-width: 650px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
}
</style>

<!-- HERO SECTION -->
<section class="variant-hero">
    <div class="container">
        <div class="variant-hero-content">
            <div class="variant-hero-tag">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Instant Disbursal in 2 Hours • 100% Paperless
            </div>
            <h1 class="variant-hero-title">₹5 Lakh Personal Loan Online</h1>
            <p class="variant-hero-desc">Access an instant ₹5,00,000 personal loan with competitive interest rates starting at <strong>10.49% p.a.</strong> and EMIs from just <strong>₹10,744/month</strong>. Fast 100% digital KYC approval from 30+ RBI-registered lenders with zero collateral.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹5 Lakh Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Interest Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹10,744 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">1 to 5 Years</div>
                    <div class="quick-spec-lbl">Flexible Loan Tenure</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">2 Hours</div>
                    <div class="quick-spec-lbl">Direct Disbursal Speed</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- EMI CALCULATION BREAKDOWN -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Financial Planning</span>
            <h2 class="v-title">₹5 Lakh Personal Loan EMI Breakdown</h2>
            <p class="v-subtitle">Calculate your exact monthly payments across various repayment tenures computed at our baseline rate of 10.49% p.a.</p>
        </div>

        <div class="table-responsive-card">
            <div style="overflow-x: auto;">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Loan Tenure</th>
                            <th>Monthly EMI</th>
                            <th>Total Interest Payable</th>
                            <th>Total Repayment Amount</th>
                            <th>Tenure Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1 Year (12 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹44,072</td>
                            <td>₹28,864</td>
                            <td>₹5,28,864</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Total Interest</span></td>
                        </tr>
                        <tr>
                            <td><strong>2 Years (24 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹23,186</td>
                            <td>₹56,464</td>
                            <td>₹5,56,464</td>
                            <td><span class="badge-rec badge-rec-primary">Fast Debt Clearance</span></td>
                        </tr>
                        <tr>
                            <td><strong>3 Years (36 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹16,249</td>
                            <td>₹84,964</td>
                            <td>₹5,84,964</td>
                            <td><span class="badge-rec badge-rec-primary">Most Popular Balance</span></td>
                        </tr>
                        <tr>
                            <td><strong>4 Years (48 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹12,799</td>
                            <td>₹1,14,352</td>
                            <td>₹6,14,352</td>
                            <td><span class="badge-rec badge-rec-primary">Comfortable Cashflow</span></td>
                        </tr>
                        <tr>
                            <td><strong>5 Years (60 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹10,744</td>
                            <td>₹1,44,640</td>
                            <td>₹6,44,640</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Monthly Outflow</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
                <strong>Smart Tip:</strong> Opting for a 3-year tenure (EMI ₹16,249) instead of 5 years saves you over <strong>₹59,676</strong> in total interest costs while maintaining a comfortable monthly budget.
            </div>
        </div>
    </div>
</section>

<!-- WHO NEEDS A 5 LAKH LOAN -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Purpose & Uses</span>
            <h2 class="v-title">When is a ₹5 Lakh Loan Right for You?</h2>
            <p class="v-subtitle">A ₹5 Lakh unsecured personal loan provides the sweet spot for medium-scale lifestyle and emergency liquidity needs without pledging collateral.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                <h3 class="usecase-title">Medical Emergencies</h3>
                <p class="usecase-desc">Cover urgent hospital treatments, unplanned surgical expenses, and post-operative recovery costs when insurance falls short.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <h3 class="usecase-title">Home Renovation</h3>
                <p class="usecase-desc">Upgrade your kitchen, renovate bathrooms, install solar panels, or add modular furniture to elevate your living comfort.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="usecase-title">High-Cost Debt Consolidation</h3>
                <p class="usecase-desc">Consolidate multiple revolving credit card balances and short-term micro-loans into a single, manageable 10.49% p.a. EMI.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 class="usecase-title">Weddings & Travel</h3>
                <p class="usecase-desc">Fund wedding banquet bookings, jewellery purchases, honeymoon travel, or dream family vacations without liquidating long-term FDs.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT MATRIX -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Approval Requirements</span>
            <h2 class="v-title">Eligibility Criteria & Documents for ₹5 Lakh</h2>
            <p class="v-subtitle">Transparent approval parameters to ensure your application gets approved within 2 minutes.</p>
        </div>

        <div class="eligibility-container">
            <!-- Matrix Card 1 -->
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Benchmark</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Applicant Age</span>
                        <span class="matrix-value">21 to 60 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Salary</span>
                        <span class="matrix-value">₹25,000 / month (Net In-Hand)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">CIBIL Credit Score</span>
                        <span class="matrix-value">700+ (650+ for Select Partners)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Experience</span>
                        <span class="matrix-value">Min 6 Months in Current Job</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Max Debt-to-Income (FOIR)</span>
                        <span class="matrix-value">Up to 50% of Net Income</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Nationality</span>
                        <span class="matrix-value">Indian Citizen</span>
                    </li>
                </ul>
            </div>

            <!-- Matrix Card 2 -->
            <div class="matrix-card">
                <h3 class="matrix-title">100% Digital Document Checklist</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity Proof</span>
                        <span class="matrix-value">PAN Card (Mandatory)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Address Proof</span>
                        <span class="matrix-value">Aadhaar Card / Passport / Voter ID</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Proof (Salaried)</span>
                        <span class="matrix-value">Last 3 Months Salary Slips + Bank Statement</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Proof (Self-Employed)</span>
                        <span class="matrix-value">Last 2 Years ITR with Computation</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Banking Setup</span>
                        <span class="matrix-value">Active Net Banking for Auto-Debit (NACH)</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- STEP BY STEP PROCESS -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">How It Works</span>
            <h2 class="v-title">How to Get ₹5 Lakh Loan in 4 Easy Steps</h2>
            <p class="v-subtitle">Complete 100% digital journey without stepping into a bank branch.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Enter Profile</h3>
                <p class="step-desc">Fill in your basic personal details, PAN number, and employment status in our 60-second form.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Instant Matching</h3>
                <p class="step-desc">Our intelligent algorithm checks real-time approval offers from 30+ RBI-registered lenders.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Digital KYC</h3>
                <p class="step-desc">Verify your Aadhaar via secure OTP and authenticate bank statements through Account Aggregator.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">Instant Disbursal</h3>
                <p class="step-desc">E-sign the loan contract online. Funds of ₹5,00,000 are transferred to your account within 2 hours.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Frequently Asked Questions</span>
            <h2 class="v-title">Questions About ₹5 Lakh Personal Loan</h2>
            <p class="v-subtitle">Clear answers to help you make an informed borrowing choice.</p>
        </div>

        <div class="faq-box">
            <?php foreach ($page_faqs as $faq): ?>
            <div class="faq-row">
                <div class="faq-header-btn">
                    <span><?php echo htmlspecialchars($faq['question']); ?></span>
                </div>
                <div class="faq-answer-body">
                    <?php echo htmlspecialchars($faq['answer']); ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
<!-- RELATED LOANS & TIER CLUSTER (Contextual Internal Linking) -->
<section class="v-section" style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 4rem 0;">
    <div class="container">
        <div class="v-heading-wrapper text-center">
            <span class="v-badge">Explore Other Options</span>
            <h2 class="v-title">Related Personal Loan Amounts &amp; Planning Tools</h2>
            <p class="v-subtitle">Need a different borrowing limit? Compare loan amounts or calculate monthly installments.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 2rem;">
            <a href="/personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1E40AF; font-size: 1.1rem; margin-bottom: 0.35rem;">Personal Loan Online</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">The complete guide to instant personal loans up to ₹50 Lakh @10.49% p.a.</p>
            </a>
            <a href="/10-lakh-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹10 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹21,488/mo, eligibility, and 2-hour digital disbursal.</p>
            </a>
            <a href="/20-lakh-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹20 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">High-limit funding with tenures up to 5 years and zero collateral.</p>
            </a>
            <a href="/personal-loan-emi-calculator" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">Personal Loan EMI Calculator</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Calculate monthly repayments and total interest across custom tenures.</p>
            </a>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="variant-cta">
    <div class="container">
        <h2>Get Your ₹5 Lakh Personal Loan Approved Today</h2>
        <p>Compare pre-approved rates starting at 10.49% p.a. with zero paperwork and zero physical visits.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
