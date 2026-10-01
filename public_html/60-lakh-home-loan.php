<?php
$canonical_url = "https://paisainminutes.com/60-lakh-home-loan";
/**
 * 60 Lakh Home Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹60 Lakh Home Loan Online @8.50% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹60 Lakh Home Loan online starting @8.50% p.a. Check monthly EMI from ₹46,135/mo, min salary of ₹1,20,000, 30-year flexible tenure & quick disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "60 lakh home loan, 60 lakh home loan emi, 60 lakh home loan eligibility, luxury apartment loan, 3bhk 4bhk home loan online";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹60 Lakh home loan?",
        "answer" => "At an interest rate of 8.50% p.a., the monthly EMI for a ₹60 Lakh home loan is approximately ₹74,391 for 10 years, ₹59,084 for 15 years, ₹52,069 for 20 years, ₹48,314 for 25 years, and ₹46,135 for a 30-year tenure."
    ],
    [
        "question" => "What salary is required to qualify for a ₹60 Lakh home loan?",
        "answer" => "Applicants typically need a minimum net monthly in-hand salary of ₹1,20,000 to ₹1,40,000. Alternatively, adding a working spouse or family member as a co-applicant allows combining household incomes to meet the debt-to-income (FOIR) criteria."
    ],
    [
        "question" => "What is the maximum LTV ratio for ₹60 Lakh home loans?",
        "answer" => "For loan amounts between ₹30 Lakh and ₹75 Lakh, RBI regulations allow financing up to 80% of the total registered property value, requiring a 20% down payment from the buyer."
    ],
    [
        "question" => "How much interest do I save by prepaying a ₹60 Lakh home loan?",
        "answer" => "Making a 5% partial prepayment each year on a 30-year ₹60 Lakh home loan can reduce your total interest outgo by over ₹38 Lakh and shave more than 10 years off your loan tenure."
    ],
    [
        "question" => "What tax benefits can joint borrowers claim on a ₹60 Lakh home loan?",
        "answer" => "For joint borrowers who are co-owners, each applicant can separately claim up to ₹2 Lakh interest deduction under Section 24(b) (total ₹4 Lakh) and up to ₹1.5 Lakh principal deduction under Section 80C (total ₹3 Lakh) annually."
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
                Luxury Housing Finance • Up to 30 Years
            </div>
            <h1 class="variant-hero-title">₹60 Lakh Home Loan Online</h1>
            <p class="variant-hero-desc">Finance luxury 3BHK & 4BHK apartments, custom builder floors, or private villas with a ₹60,00,000 home loan starting @<strong>8.50% p.a.</strong> with monthly EMIs from <strong>₹46,135</strong>. Fast multi-bank digital sanction with zero hidden fees.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹60 Lakh Home Loan
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">8.50% p.a.</div>
                    <div class="quick-spec-lbl">Starting Interest Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹46,135 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">Up to 30 Years</div>
                    <div class="quick-spec-lbl">Maximum Tenure</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹1,20,000 / mo</div>
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
            <span class="v-badge">Amortization Table</span>
            <h2 class="v-title">₹60 Lakh Home Loan EMI Breakdown</h2>
            <p class="v-subtitle">Amortization schedule across flexible repayment durations calculated at 8.50% p.a.</p>
        </div>

        <div class="table-responsive-card">
            <div style="overflow-x: auto;">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Repayment Tenure</th>
                            <th>Monthly EMI</th>
                            <th>Total Interest Payable</th>
                            <th>Total Repayment (P + I)</th>
                            <th>Financial Fit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>10 Years (120 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹74,391</td>
                            <td>₹29,26,920</td>
                            <td>₹89,26,920</td>
                            <td><span class="badge-rec badge-rec-success">Maximum Interest Savings</span></td>
                        </tr>
                        <tr>
                            <td><strong>15 Years (180 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹59,084</td>
                            <td>₹46,35,120</td>
                            <td>₹1,06,35,120</td>
                            <td><span class="badge-rec badge-rec-primary">Fast 15-Year Payoff</span></td>
                        </tr>
                        <tr>
                            <td><strong>20 Years (240 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹52,069</td>
                            <td>₹64,96,560</td>
                            <td>₹1,24,96,560</td>
                            <td><span class="badge-rec badge-rec-primary">Optimal Executive Balance</span></td>
                        </tr>
                        <tr>
                            <td><strong>25 Years (300 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹48,314</td>
                            <td>₹84,94,200</td>
                            <td>₹1,44,94,200</td>
                            <td><span class="badge-rec badge-rec-primary">Comfortable Monthly Cashflow</span></td>
                        </tr>
                        <tr>
                            <td><strong>30 Years (360 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹46,135</td>
                            <td>₹1,06,08,600</td>
                            <td>₹1,66,08,600</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Monthly Installment</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
                <strong>Smart Tip:</strong> Opting for a 20-year term (EMI ₹52,069) instead of 30 years (EMI ₹46,135) costs only ₹5,934 extra per month, but saves you over <strong>₹41,12,040</strong> in cumulative interest!
            </div>
        </div>
    </div>
</section>

<!-- USE CASES -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Housing Scenarios</span>
            <h2 class="v-title">Who is a ₹60 Lakh Home Loan Ideal For?</h2>
            <p class="v-subtitle">High-value residential funding tailored for premium metropolitan real estate and luxury estates.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <h3 class="usecase-title">Luxury 3BHK & 4BHK Urban Condos</h3>
                <p class="usecase-desc">Acquire prime residential properties from Grade-A developers with premium lifestyle amenities, clubhouses, and green landscape views.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <h3 class="usecase-title">Independent Gated Community Villas</h3>
                <p class="usecase-desc">Finance expansive multi-level villas on private residential plots with private pools, terraces, and dedicated landscaped gardens.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="usecase-title">High-Value Balance Transfer + Top-Up</h3>
                <p class="usecase-desc">Transfer your existing high-cost home loan to our partner lenders to lower your interest rate while receiving a ₹15 Lakh top-up facility.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 class="usecase-title">Builder Floors in Central Metro Zones</h3>
                <p class="usecase-desc">Acquire exclusive independent builder floor residences with lift access, dedicated car stilt parking, and freehold ownership.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT MATRIX -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Approval Requirements</span>
            <h2 class="v-title">₹60 Lakh Home Loan Eligibility & Documents</h2>
            <p class="v-subtitle">Clear benchmarks to ensure instant digital in-principle sanction.</p>
        </div>

        <div class="eligibility-container">
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Criteria for ₹60 Lakh</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Applicant Age</span>
                        <span class="matrix-value">21 to 65 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Income</span>
                        <span class="matrix-value">₹1,20,000 / month (Net In-Hand)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">CIBIL Score Requirement</span>
                        <span class="matrix-value">750+ Recommended (720+ Considered)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Loan-to-Value (LTV) Ratio</span>
                        <span class="matrix-value">Up to 80% of Registered Property Cost</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Co-Applicant Support</span>
                        <span class="matrix-value">Accepted (Spouse/Parents/Children)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Stability</span>
                        <span class="matrix-value">Min 3 Years Total (1 Year Current Org)</span>
                    </li>
                </ul>
            </div>

            <div class="matrix-card">
                <h3 class="matrix-title">Required Documents Checklist</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity & Address Proof</span>
                        <span class="matrix-value">PAN Card & Aadhaar via DigiLocker</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Proof (Salaried)</span>
                        <span class="matrix-value">3 Months Salary Slips & Form 16</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Banking Proof</span>
                        <span class="matrix-value">Last 6 Months Salary Bank Statement</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Property Documents</span>
                        <span class="matrix-value">Sale Agreement, RERA Approval, Title Chain</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Self-Employed Financials</span>
                        <span class="matrix-value">2 Years Audited ITR & Balance Sheets</span>
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
            <span class="v-badge">Simple Steps</span>
            <h2 class="v-title">How to Get ₹60 Lakh Home Loan in 4 Steps</h2>
            <p class="v-subtitle">Streamlined digital processing from inquiry to property sanction.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Online Application</h3>
                <p class="step-desc">Enter your monthly income, property location, and loan requirements.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Instant Eligibility Check</h3>
                <p class="step-desc">Get pre-approved home loan offers from 30+ leading housing finance institutions.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Digital Document Upload</h3>
                <p class="step-desc">Upload property documents and salary slips securely online.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">Direct Disbursal</h3>
                <p class="step-desc">Receive digital sanction and fast disbursal directly to builder or constructor.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Help & FAQs</span>
            <h2 class="v-title">Questions About ₹60 Lakh Home Loan</h2>
            <p class="v-subtitle">Clear answers to help you navigate your housing finance.</p>
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
        <h2>Apply for ₹60 Lakh Home Loan Online</h2>
        <p>Compare pre-approved housing finance rates starting at 8.50% p.a. with minimal paperwork and flexible 30-year tenure.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Home Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
