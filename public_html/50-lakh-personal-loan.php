<?php
$canonical_url = "https://paisainminutes.com/50-lakh-personal-loan";
/**
 * 50 Lakh Personal Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹50 Lakh Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹50 Lakh Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹1,07,445/mo, min salary of ₹1,80,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "50 lakh personal loan, 50 lakh personal loan emi, 50 lakh loan eligibility, 50 lakh instant personal loan, maximum personal loan online";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹50 Lakh personal loan?",
        "answer" => "At an interest rate of 10.49% p.a., the monthly EMI for a ₹50 Lakh personal loan is approximately ₹4,40,720 for 1 year, ₹2,31,857 for 2 years, ₹1,62,489 for 3 years, ₹1,27,993 for 4 years, and ₹1,07,445 for a 5-year tenure."
    ],
    [
        "question" => "What is the maximum unsecured personal loan amount available in India?",
        "answer" => "₹50 Lakh is generally the maximum unsecured personal loan limit offered by leading private banks and NBFCs without requiring physical collateral or asset mortgaging."
    ],
    [
        "question" => "What salary is required to qualify for a ₹50 Lakh personal loan?",
        "answer" => "Applicants need a minimum net monthly in-hand salary of ₹1,80,000 to ₹2,00,000 (or verifiable annual net profit of ₹25+ Lakh for professionals and business owners) to ensure the FOIR remains within acceptable 50%-60% limits."
    ],
    [
        "question" => "Can I co-apply with my spouse for a ₹50 Lakh loan?",
        "answer" => "Yes. Adding an earning co-applicant is highly encouraged for ₹50 Lakh loans as it combines your monthly cash flows, improves your debt-to-income ratio, and speeds up institutional sanction."
    ],
    [
        "question" => "How fast can a ₹50 Lakh loan be disbursed?",
        "answer" => "With 100% digital verification via Account Aggregator and Aadhaar e-KYC, ₹50 Lakh funds are processed and disbursed directly to your bank account within 2 to 4 business hours."
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
                Maximum Unsecured Credit • High-Net-Worth Tier
            </div>
            <h1 class="variant-hero-title">₹50 Lakh Personal Loan Online</h1>
            <p class="variant-hero-desc">Secure the maximum allowable unsecured personal loan of ₹50,00,000 starting @<strong>10.49% p.a.</strong> with monthly EMIs from <strong>₹1,07,445</strong>. Premium paperless sanction, zero collateral pledge, and direct disbursal within 2 to 4 hours.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹50 Lakh Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Interest Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹1,07,445 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">1 to 5 Years</div>
                    <div class="quick-spec-lbl">Repayment Tenure</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹1,80,000 / mo</div>
                    <div class="quick-spec-lbl">Min In-Hand Salary</div>
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
            <h2 class="v-title">₹50 Lakh Personal Loan EMI Table</h2>
            <p class="v-subtitle">Complete amortization breakdown and monthly payout matrix calculated at 10.49% p.a.</p>
        </div>

        <div class="table-responsive-card">
            <div style="overflow-x: auto;">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Tenure Period</th>
                            <th>Monthly EMI</th>
                            <th>Total Interest Incurred</th>
                            <th>Total Repayment (P + I)</th>
                            <th>Strategic Suitability</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1 Year (12 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹4,40,720</td>
                            <td>₹2,88,640</td>
                            <td>₹52,88,640</td>
                            <td><span class="badge-rec badge-rec-success">Maximum Interest Savings</span></td>
                        </tr>
                        <tr>
                            <td><strong>2 Years (24 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹2,31,857</td>
                            <td>₹5,64,568</td>
                            <td>₹55,64,568</td>
                            <td><span class="badge-rec badge-rec-primary">Aggressive 24M Payoff</span></td>
                        </tr>
                        <tr>
                            <td><strong>3 Years (36 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,62,489</td>
                            <td>₹8,49,604</td>
                            <td>₹58,49,604</td>
                            <td><span class="badge-rec badge-rec-primary">Balanced Executive Plan</span></td>
                        </tr>
                        <tr>
                            <td><strong>4 Years (48 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,27,993</td>
                            <td>₹11,43,664</td>
                            <td>₹61,43,664</td>
                            <td><span class="badge-rec badge-rec-primary">Controlled Monthly Outflow</span></td>
                        </tr>
                        <tr>
                            <td><strong>5 Years (60 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,07,445</td>
                            <td>₹14,46,700</td>
                            <td>₹64,46,700</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Monthly Installment</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
                <strong>Interest Savings Insight:</strong> Choosing a 3-year term over a 5-year term saves you <strong>₹5,97,096</strong> in cumulative interest payments.
            </div>
        </div>
    </div>
</section>

<!-- USE CASES -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Strategic Purposes</span>
            <h2 class="v-title">Why Avail a ₹50 Lakh Personal Loan?</h2>
            <p class="v-subtitle">High-limit unsecured liquidity tailored for corporate executives, enterprise founders, and high-net-worth borrowers.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2H-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 class="usecase-title">Major Enterprise Liquidity</h3>
                <p class="usecase-desc">Finance substantial inventory build-ups, expand into international markets, or bridge cashflow gaps without diluting company ownership.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <h3 class="usecase-title">Luxury Real Estate Fitouts</h3>
                <p class="usecase-desc">Furnish penthouses, custom country estates, and multi-storey family bungalows with bespoke global architectural interior architecture.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                </div>
                <h3 class="usecase-title">Dual Executive Degrees Abroad</h3>
                <p class="usecase-desc">Full funding coverage for Stanford/Harvard executive programs, private flight aviation licenses, and multi-year foreign specialist degrees.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h3 class="usecase-title">Consolidating High-Value Debt</h3>
                <p class="usecase-desc">Refinance scattered loans, business overdraft lines, and credit products into a single low-interest, streamlined institutional facility.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT MATRIX -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Sanction Criteria</span>
            <h2 class="v-title">₹50 Lakh Loan Eligibility & Documents</h2>
            <p class="v-subtitle">High-bracket qualification guidelines to ensure seamless institutional clearance.</p>
        </div>

        <div class="eligibility-container">
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Benchmark for ₹50 Lakh</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Applicant Age</span>
                        <span class="matrix-value">25 to 60 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Salary</span>
                        <span class="matrix-value">₹1,80,000 / month (Net In-Hand)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">CIBIL Score Requirement</span>
                        <span class="matrix-value">750+ (Prime Category)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Stability</span>
                        <span class="matrix-value">Min 3 Years Total (1 Year Current Org)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Maximum Allowable FOIR</span>
                        <span class="matrix-value">60% of Net Monthly Salary</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Co-Applicant Support</span>
                        <span class="matrix-value">Accepted (Spouse/Parent)</span>
                    </li>
                </ul>
            </div>

            <div class="matrix-card">
                <h3 class="matrix-title">100% Digital Document Checklist</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity Proof</span>
                        <span class="matrix-value">PAN Card (Mandatory)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Address Verification</span>
                        <span class="matrix-value">Aadhaar Card with linked Mobile</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Salary Slips</span>
                        <span class="matrix-value">Last 3 Months Salary Slips & Form 16</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Bank Statement</span>
                        <span class="matrix-value">6 Months Salary Account Statement</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Business Tax Returns (Self-Employed)</span>
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
            <span class="v-badge">Fast Process</span>
            <h2 class="v-title">Get ₹50 Lakh in 4 Straightforward Steps</h2>
            <p class="v-subtitle">100% digital, paperless process from application to bank disbursal.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Online Application</h3>
                <p class="step-desc">Enter your professional details, income, and PAN in 60 seconds.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Institutional Match</h3>
                <p class="step-desc">Our algorithms match you with premier lenders offering the lowest rates.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Digital E-KYC</h3>
                <p class="step-desc">Verify Aadhaar via OTP and connect bank statement digitally.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">2-Hour Disbursal</h3>
                <p class="step-desc">E-sign the digital agreement and receive ₹50,00,000 in your bank account.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Help & FAQs</span>
            <h2 class="v-title">Questions About ₹50 Lakh Personal Loan</h2>
            <p class="v-subtitle">Expert answers regarding ₹50 Lakh maximum credit approvals.</p>
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
</section>

<!-- CTA SECTION -->
<section class="variant-cta">
    <div class="container">
        <h2>Apply for ₹50 Lakh Personal Loan Online</h2>
        <p>Compare pre-approved institutional rates starting at 10.49% p.a. with zero collateral and fast 2-hour transfer.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
