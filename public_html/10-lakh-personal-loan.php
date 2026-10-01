<?php
$canonical_url = "https://paisainminutes.com/10-lakh-personal-loan";
/**
 * 10 Lakh Personal Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹10 Lakh Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹10 Lakh Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹21,489/mo, min salary of ₹45,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "10 lakh personal loan, 10 lakh personal loan emi, 10 lakh loan eligibility, 10 lakh instant personal loan, low interest 10 lakh loan";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹10 Lakh personal loan?",
        "answer" => "At a competitive interest rate of 10.49% p.a., the monthly EMI for a ₹10 Lakh personal loan is approximately ₹88,144 for 1 year, ₹46,371 for 2 years, ₹32,498 for 3 years, ₹25,599 for 4 years, and ₹21,489 for a 5-year tenure."
    ],
    [
        "question" => "What is the minimum in-hand salary required for a ₹10 Lakh personal loan?",
        "answer" => "To qualify for a ₹10 Lakh unsecured personal loan, lenders typically look for a minimum net monthly in-hand salary of ₹45,000 to ₹50,000 with a clean banking record and manageable existing debt obligations (FOIR below 50%)."
    ],
    [
        "question" => "Can I get a ₹10 Lakh personal loan without submitting physical collateral?",
        "answer" => "Yes. A ₹10 Lakh personal loan through Paisa in Minutes is 100% collateral-free and unsecured. Approval is based strictly on your monthly income proof, employment profile, and CIBIL credit track record."
    ],
    [
        "question" => "How does a ₹10 Lakh debt consolidation loan save money?",
        "answer" => "If you are servicing multiple credit cards (charging 36%-42% p.a.) and consumer loans, consolidating them into a single ₹10 Lakh loan at 10.49% p.a. can reduce your total monthly interest outflow by up to 60%."
    ],
    [
        "question" => "What documents are required to approve a ₹10 Lakh loan online?",
        "answer" => "You only need your PAN Card, Aadhaar Card for digital e-KYC, last 3 months salary slips, and 6 months bank statements with verified salary credits."
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
}.v-section {
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
}
.faq-answer-body {
    padding: 0 1.5rem 1.25rem 1.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.7;
}

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
                High-Value Approval • 100% Unsecured
            </div>
            <h1 class="variant-hero-title">₹10 Lakh Personal Loan Online</h1>
            <p class="variant-hero-desc">Secure a high-ticket ₹10,00,000 personal loan starting at <strong>10.49% p.a.</strong> with affordable EMIs from <strong>₹21,489/month</strong>. 100% digital paperwork, zero collateral, and instant direct transfer within 2 hours.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹10 Lakh Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Interest Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹21,489 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">1 to 5 Years</div>
                    <div class="quick-spec-lbl">Repayment Tenure</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹45,000 / mo</div>
                    <div class="quick-spec-lbl">Minimum Net Salary</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- EMI CALCULATION BREAKDOWN -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Calculated Estimates</span>
            <h2 class="v-title">₹10 Lakh Personal Loan EMI Matrix</h2>
            <p class="v-subtitle">Compare realistic monthly installments and total interest payments calculated at 10.49% p.a. across standard loan durations.</p>
        </div>

        <div class="table-responsive-card">
            <div style="overflow-x: auto;">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Tenure Period</th>
                            <th>Monthly EMI</th>
                            <th>Total Interest Charged</th>
                            <th>Total Payable Amount</th>
                            <th>Financial Fit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1 Year (12 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹88,144</td>
                            <td>₹57,728</td>
                            <td>₹10,57,728</td>
                            <td><span class="badge-rec badge-rec-success">Maximum Interest Savings</span></td>
                        </tr>
                        <tr>
                            <td><strong>2 Years (24 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹46,371</td>
                            <td>₹1,12,904</td>
                            <td>₹11,12,904</td>
                            <td><span class="badge-rec badge-rec-primary">Fast 24-Month Payoff</span></td>
                        </tr>
                        <tr>
                            <td><strong>3 Years (36 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹32,498</td>
                            <td>₹1,69,928</td>
                            <td>₹11,69,928</td>
                            <td><span class="badge-rec badge-rec-primary">Optimal Budget Balance</span></td>
                        </tr>
                        <tr>
                            <td><strong>4 Years (48 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹25,599</td>
                            <td>₹2,28,752</td>
                            <td>₹12,28,752</td>
                            <td><span class="badge-rec badge-rec-primary">Low Monthly Pressure</span></td>
                        </tr>
                        <tr>
                            <td><strong>5 Years (60 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹21,489</td>
                            <td>₹2,89,340</td>
                            <td>₹12,89,340</td>
                            <td><span class="badge-rec badge-rec-success">Most Affordable EMI</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
                <strong>Interest Savings Tip:</strong> Choosing a 3-year plan (EMI ₹32,498) over a 5-year plan saves you <strong>₹1,19,412</strong> in total interest payout!
            </div>
        </div>
    </div>
</section>

<!-- USE CASES -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Target Use Cases</span>
            <h2 class="v-title">Why Choose a ₹10 Lakh Personal Loan?</h2>
            <p class="v-subtitle">₹10 Lakh provides substantial liquid capital to fund major life milestones and strategic financial moves without mortgaging assets.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                </div>
                <h3 class="usecase-title">Higher Education & Overseas Tuition</h3>
                <p class="usecase-desc">Finance university semester fees, admission deposits, accommodation, and living costs in India or abroad for yourself or your children.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <h3 class="usecase-title">Comprehensive Home Remodelling</h3>
                <p class="usecase-desc">Undertake complete architectural redesign, building an extra floor, premium interior work, and luxury smart home electrical installations.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h3 class="usecase-title">Debt Restructuring & Credit Repair</h3>
                <p class="usecase-desc">Pay off multiple high-interest retail loans and credit card roll-overs to boost your CIBIL score and cut your monthly interest burden significantly.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 class="usecase-title">Working Capital & Business Inventory</h3>
                <p class="usecase-desc">Fuel small business inventory purchases before festival seasons, purchase machinery, or hire skilled talent without diluting equity.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT MATRIX -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Approval Requirements</span>
            <h2 class="v-title">₹10 Lakh Loan Eligibility & Documents</h2>
            <p class="v-subtitle">Check your qualification profile before applying for fast-track 2-hour approval.</p>
        </div>

        <div class="eligibility-container">
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Criteria for ₹10 Lakh</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Applicant Age</span>
                        <span class="matrix-value">21 to 60 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Salary</span>
                        <span class="matrix-value">₹45,000 / month (Net In-Hand)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum CIBIL Score</span>
                        <span class="matrix-value">720+ (700+ for Select Lenders)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Total Work Experience</span>
                        <span class="matrix-value">Min 1 Year (6 Mos Current Org)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Max Debt-to-Income (FOIR)</span>
                        <span class="matrix-value">Up to 50% of Net Monthly Pay</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Classification</span>
                        <span class="matrix-value">Salaried (Pvt/Govt) or Self-Employed</span>
                    </li>
                </ul>
            </div>

            <div class="matrix-card">
                <h3 class="matrix-title">Digital Document Checklist</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity Proof</span>
                        <span class="matrix-value">PAN Card (Mandatory for KYC)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Address Verification</span>
                        <span class="matrix-value">Aadhaar / Passport / Utility Bill</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Salary Slips</span>
                        <span class="matrix-value">Last 3 Months Salary Slips (PDF)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Bank Account Statement</span>
                        <span class="matrix-value">Last 6 Months Bank Statement</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Tax Returns (Self-Employed)</span>
                        <span class="matrix-value">Last 2 Years ITR with Computation</span>
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
            <span class="v-badge">Simple Workflow</span>
            <h2 class="v-title">Get ₹10 Lakh in 4 Straightforward Steps</h2>
            <p class="v-subtitle">100% digital, paperless process from application to bank disbursal.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Online Application</h3>
                <p class="step-desc">Enter your name, PAN, mobile number, and salary in our encrypted portal.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Multi-Lender Match</h3>
                <p class="step-desc">Our fintech platform matches you with top NBFCs offering lowest interest rates.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Instant E-KYC</h3>
                <p class="step-desc">Verify Aadhaar via OTP and connect your bank statement digitally in seconds.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">2-Hour Disbursal</h3>
                <p class="step-desc">Sign the digital agreement and receive ₹10,00,000 directly into your bank account.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Help & FAQs</span>
            <h2 class="v-title">Questions About ₹10 Lakh Personal Loan</h2>
            <p class="v-subtitle">Expert answers regarding ₹10 Lakh credit approvals and repayment.</p>
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
            <a href="/5-lakh-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹5 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹10,744/mo, eligibility, and 2-hour digital disbursal.</p>
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
        <h2>Apply for ₹10 Lakh Personal Loan Online</h2>
        <p>Get immediate pre-approved offers starting at 10.49% p.a. with zero collateral and fast 2-hour disbursal.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
