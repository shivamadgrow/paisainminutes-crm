<?php
$canonical_url = "https://paisainminutes.com/20-lakh-personal-loan";
/**
 * 20 Lakh Personal Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹20 Lakh Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹20 Lakh Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹42,978/mo, min salary of ₹75,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "20 lakh personal loan, 20 lakh personal loan emi, 20 lakh loan eligibility, 20 lakh instant personal loan, low interest 20 lakh loan";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹20 Lakh personal loan?",
        "answer" => "At an interest rate of 10.49% p.a., the monthly EMI for a ₹20 Lakh personal loan is approximately ₹1,76,288 for 1 year, ₹92,743 for 2 years, ₹64,995 for 3 years, ₹51,197 for 4 years, and ₹42,978 for a 5-year tenure."
    ],
    [
        "question" => "What is the minimum monthly income needed for a ₹20 Lakh personal loan?",
        "answer" => "Applicants generally require a minimum net monthly salary of ₹75,000 to ₹85,000 (or verifiable business profit for self-employed professionals) to ensure the ₹42,978 monthly EMI falls within the 50% FOIR limit."
    ],
    [
        "question" => "Can I add a co-applicant to increase eligibility for ₹20 Lakh?",
        "answer" => "Yes. If your individual income falls short of the ₹75,000 monthly threshold, you can add an earning spouse, parent, or sibling as a co-applicant to pool incomes and easily qualify for ₹20 Lakh."
    ],
    [
        "question" => "Is collateral or property mortgage required for ₹20 Lakh?",
        "answer" => "No, our personal loans up to ₹20 Lakh are completely unsecured. No physical property, gold, or shares need to be pledged as security."
    ],
    [
        "question" => "How long does verification take for a ₹20 Lakh loan?",
        "answer" => "Through our automated digital Account Aggregator integration and e-KYC flow, approval is determined within minutes and funds are transferred within 2 to 4 hours."
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
                Premium Credit Tier • Unsecured Instant Transfer
            </div>
            <h1 class="variant-hero-title">₹20 Lakh Personal Loan Online</h1>
            <p class="variant-hero-desc">Acquire an unsecured ₹20,00,000 personal loan starting @<strong>10.49% p.a.</strong> with monthly EMIs starting at <strong>₹42,978</strong>. Complete paperless KYC, zero physical branch visits, and direct bank disbursal within 2 hours.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹20 Lakh Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Interest Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹42,978 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">Up to 5 Years</div>
                    <div class="quick-spec-lbl">Repayment Tenure</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹75,000 / mo</div>
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
            <span class="v-badge">Repayment Schedule</span>
            <h2 class="v-title">₹20 Lakh Personal Loan EMI Table</h2>
            <p class="v-subtitle">Understand your monthly obligation and total interest outlay for a ₹20 Lakh loan calculated at 10.49% p.a.</p>
        </div>

        <div class="table-responsive-card">
            <div style="overflow-x: auto;">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Tenure Period</th>
                            <th>Monthly EMI</th>
                            <th>Total Interest Charged</th>
                            <th>Total Repayment (P + I)</th>
                            <th>Strategic Suitability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1 Year (12 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,76,288</td>
                            <td>₹1,15,456</td>
                            <td>₹21,15,456</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Lifetime Interest</span></td>
                        </tr>
                        <tr>
                            <td><strong>2 Years (24 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹92,743</td>
                            <td>₹2,25,832</td>
                            <td>₹22,25,832</td>
                            <td><span class="badge-rec badge-rec-primary">Rapid Liquidation</span></td>
                        </tr>
                        <tr>
                            <td><strong>3 Years (36 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹64,995</td>
                            <td>₹3,39,820</td>
                            <td>₹23,39,820</td>
                            <td><span class="badge-rec badge-rec-primary">Balanced Cashflow</span></td>
                        </tr>
                        <tr>
                            <td><strong>4 Years (48 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹51,197</td>
                            <td>₹4,57,456</td>
                            <td>₹24,57,456</td>
                            <td><span class="badge-rec badge-rec-primary">Low Monthly Impact</span></td>
                        </tr>
                        <tr>
                            <td><strong>5 Years (60 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹42,978</td>
                            <td>₹5,78,680</td>
                            <td>₹25,78,680</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Monthly EMI</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
                <strong>Smart Planning:</strong> Prepaying just 5% of your principal every year can cut your 5-year total interest by over <strong>₹1.45 Lakh</strong>.
            </div>
        </div>
    </div>
</section>

<!-- USE CASES -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Key Use Cases</span>
            <h2 class="v-title">When to Avail a ₹20 Lakh Personal Loan?</h2>
            <p class="v-subtitle">High-value funding for executive capital needs, commercial investments, and premium life moments.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 class="usecase-title">Business Scaling & Capital Asset Purchase</h3>
                <p class="usecase-desc">Procure heavy industrial equipment, launch new retail store outlets, or finance seasonal inventory stockpiles without pledging real estate.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <h3 class="usecase-title">Complete Architectural Renovation</h3>
                <p class="usecase-desc">Undertake structural transformations, premium Italian marble flooring, central air-conditioning, and custom interior landscaping.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="usecase-title">Multi-Loan Debt Consolidation</h3>
                <p class="usecase-desc">Consolidate multiple personal loans, vehicle loans, and credit cards into one structured ₹20 Lakh low-interest loan to dramatically reduce FOIR.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                <h3 class="usecase-title">Destination Weddings & Celebrations</h3>
                <p class="usecase-desc">Organize landmark destination weddings, grand family celebrations, and luxury milestone experiences without breaking your long-term mutual fund SIPs.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT MATRIX -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Approval Requirements</span>
            <h2 class="v-title">₹20 Lakh Loan Eligibility & Documents</h2>
            <p class="v-subtitle">Clear benchmarks to guarantee instant digital sanction from partner NBFCs.</p>
        </div>

        <div class="eligibility-container">
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Benchmark for ₹20 Lakh</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Applicant Age</span>
                        <span class="matrix-value">23 to 60 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Net Salary</span>
                        <span class="matrix-value">₹75,000 / month</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">CIBIL Score Requirement</span>
                        <span class="matrix-value">730+ for Lowest 10.49% Rates</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Stability</span>
                        <span class="matrix-value">Min 2 Years Total (1 Year Current)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Maximum Allowable FOIR</span>
                        <span class="matrix-value">50% of Net Monthly Salary</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Co-Applicant Support</span>
                        <span class="matrix-value">Allowed (Spouse/Parent) to Boost Income</span>
                    </li>
                </ul>
            </div>

            <div class="matrix-card">
                <h3 class="matrix-title">100% Digital Document Checklist</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity Verification</span>
                        <span class="matrix-value">PAN Card (Mandatory)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Address Verification</span>
                        <span class="matrix-value">Aadhaar Card with linked Mobile</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Proof (Salaried)</span>
                        <span class="matrix-value">Last 3 Months Salary Slips & Form 16</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Bank Records</span>
                        <span class="matrix-value">6 Months Bank Statement via E-Aggregator</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Self-Employed Proof</span>
                        <span class="matrix-value">Last 2 Years ITR with Audit Report</span>
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
            <h2 class="v-title">Get ₹20 Lakh in 4 Straightforward Steps</h2>
            <p class="v-subtitle">100% digital, paperless process from application to bank disbursal.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Online Application</h3>
                <p class="step-desc">Enter your employment profile, PAN details, and desired tenure in 60 seconds.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Algorithm Match</h3>
                <p class="step-desc">Our engine evaluates offers from 30+ top tier NBFCs and nationalized banks.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Digital E-KYC</h3>
                <p class="step-desc">Authenticate your KYC digitally through OTP and link salary account securely.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">2-Hour Disbursal</h3>
                <p class="step-desc">E-sign the digital sanction letter and receive ₹20,00,000 directly into your bank account.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Help & FAQs</span>
            <h2 class="v-title">Questions About ₹20 Lakh Personal Loan</h2>
            <p class="v-subtitle">Expert clarity on high-ticket unsecured personal loans.</p>
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
            <a href="/10-lakh-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹10 Lakh Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹21,488/mo, eligibility, and 2-hour digital disbursal.</p>
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
        <h2>Apply for ₹20 Lakh Personal Loan Online</h2>
        <p>Get pre-approved rates starting at 10.49% p.a. with zero paperwork, zero collateral, and 2-hour transfer.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
