<?php
$canonical_url = "https://paisainminutes.com/1-lakh-personal-loan";
/**
 * 1 Lakh Personal Loan Page (Maximum Limit Showcase)
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹1 Lakh Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹1 Lakh Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹2,560/mo, min salary of ₹20,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "1 lakh personal loan, 1 lakh personal loan emi, 1 lakh loan eligibility, instant 1 lakh loan, low interest 1 lakh loan, 100000 personal loan";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹1 Lakh personal loan?",
        "answer" => "At an interest rate of 10.49% p.a., the monthly EMI for a ₹1,00,000 personal loan is approximately ₹8,814 for a 1-year (12-month) tenure, ₹6,028 for 18 months, ₹4,637 for 24 months (2 years), ₹3,250 for 36 months (3 years), and ₹2,560 for a 48-month tenure."
    ],
    [
        "question" => "What is the minimum monthly salary needed for a ₹1 Lakh personal loan?",
        "answer" => "Applicants typically need a minimum net monthly in-hand salary of ₹20,000. Lenders evaluate your debt-to-income ratio to ensure all combined EMIs do not exceed 40% to 50% of your net monthly earnings."
    ],
    [
        "question" => "What CIBIL score is required for ₹1 Lakh personal loan approval?",
        "answer" => "A CIBIL credit score of 700 or above is ideal for securing the lowest interest rates starting from 10.49% p.a. However, our partner NBFCs also approve applicants with scores between 650 and 699 based on steady cash flows."
    ],
    [
        "question" => "How fast will the ₹1 Lakh loan be disbursed into my bank account?",
        "answer" => "Once your paperless KYC is verified via Aadhaar OTP and you digitally sign the loan agreement, the ₹1,00,000 is directly credited to your verified bank account within 2 hours."
    ],
    [
        "question" => "Can I prepay or foreclose my ₹1 Lakh personal loan early?",
        "answer" => "Yes, our RBI-registered lending partners allow partial prepayments or full loan foreclosure after completing 6 scheduled EMIs. Foreclosure charges range from 0% to 3% as per lender policy."
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
    padding: 4.5rem 0;
}
.v-section-alt {
    background-color: #F8FAFC;
}
.v-heading-wrapper {
    text-align: center;
    max-width: 750px;
    margin: 0 auto 3rem auto;
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
    font-size: 2.1rem;
    font-family: var(--font-heading);
    font-weight: 800;
    color: #0F172A;
    line-height: 1.3;
    margin-bottom: 0.75rem;
}
.v-subtitle {
    font-size: 1.02rem;
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
    padding: 1.2rem 1.5rem;
    border-bottom: 2px solid #CBD5E1;
}
.financial-table td {
    padding: 1.15rem 1.5rem;
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
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
}
.step-box {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 2rem 1.5rem;
    text-align: center;
    position: relative;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
}
.step-num {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #1B2A6B;
    color: #FFFFFF;
    font-weight: 800;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem auto;
}
.step-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.5rem;
}
.step-desc {
    color: #64748B;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
}
.faq-box {
    max-width: 820px;
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
    padding: 1.25rem 1.5rem;
    font-weight: 700;
    color: #1B2A6B;
    font-size: 1.05rem;
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
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 1rem;
}
.variant-cta p {
    color: rgba(255,255,255,0.85);
    max-width: 650px;
    margin: 0 auto 2rem auto;
    font-size: 1.05rem;
}
</style>

<!-- HERO SECTION -->
<section class="variant-hero">
    <div class="container">
        <div class="variant-hero-content">
            <div class="variant-hero-tag">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Maximum Limit • Disbursal in 2 Hours • 100% Digital
            </div>
            <h1 class="variant-hero-title">₹1 Lakh Personal Loan Online</h1>
            <p class="variant-hero-desc">Apply for our maximum loan limit of ₹1,00,000 personal loan starting @<strong>10.49% p.a.</strong> with monthly EMIs from just <strong>₹2,560/month</strong>. Fast 100% digital KYC approval from RBI-registered lenders with zero collateral.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹1 Lakh Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹2,560 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">12 to 48 Months</div>
                    <div class="quick-spec-lbl">Tenure Range</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">2 Hours</div>
                    <div class="quick-spec-lbl">Disbursal Speed</div>
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
            <h2 class="v-title">₹1 Lakh Personal Loan EMI Breakdown</h2>
            <p class="v-subtitle">Calculate exact monthly installments across repayment tenures computed at our baseline rate of 10.49% p.a.</p>
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
                            <th>Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1 Year (12 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹8,814</td>
                            <td>₹5,773</td>
                            <td>₹1,05,773</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Total Interest</span></td>
                        </tr>
                        <tr>
                            <td><strong>18 Months</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹6,028</td>
                            <td>₹8,504</td>
                            <td>₹1,08,504</td>
                            <td><span class="badge-rec">Short-Term Flexibility</span></td>
                        </tr>
                        <tr>
                            <td><strong>2 Years (24 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹4,637</td>
                            <td>₹11,293</td>
                            <td>₹1,11,293</td>
                            <td><span class="badge-rec badge-rec-primary">Most Popular</span></td>
                        </tr>
                        <tr>
                            <td><strong>3 Years (36 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹3,250</td>
                            <td>₹16,993</td>
                            <td>₹1,16,993</td>
                            <td><span class="badge-rec">Budget-Friendly</span></td>
                        </tr>
                        <tr>
                            <td><strong>4 Years (48 Mos)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹2,560</td>
                            <td>₹22,870</td>
                            <td>₹1,22,870</td>
                            <td><span class="badge-rec badge-rec-primary">Lowest Monthly EMI</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<!-- COMMON USE CASES -->
<section class="v-section">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Purpose</span>
            <h2 class="v-title">Popular Uses for ₹1,00,000 Loan</h2>
            <p class="v-subtitle">Convenient financial power for life events, medical security, or debt consolidation.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <h3 class="usecase-title">Medical Treatments</h3>
                <p class="usecase-desc">Secure emergency medical treatment, hospital deposits, or specialized elective surgeries with instant cash.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </div>
                <h3 class="usecase-title">Wedding &amp; Celebrations</h3>
                <p class="usecase-desc">Cover catering, venue booking deposits, jewelry, or bridal wardrobe purchases comfortably.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <h3 class="usecase-title">Debt Consolidation</h3>
                <p class="usecase-desc">Consolidate multiple small debts or high-interest credit card balances into one predictable monthly EMI.</p>
            </div>
        </div>
    </div>
</section>

<!-- ELIGIBILITY & DOCUMENT CRITERIA -->
<section class="v-section v-section-alt">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Eligibility</span>
            <h2 class="v-title">Eligibility &amp; Documentation</h2>
            <p class="v-subtitle">Straightforward criteria for rapid digital verification and 2-hour disbursal.</p>
        </div>

        <div class="eligibility-container">
            <div class="matrix-card">
                <h3 class="matrix-title">Eligibility Criteria</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Age Requirement</span>
                        <span class="matrix-value">21 to 58 Years</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Employment Type</span>
                        <span class="matrix-value">Salaried / Self-Employed</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum Monthly Income</span>
                        <span class="matrix-value">₹20,000 / month</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum CIBIL Score</span>
                        <span class="matrix-value">650+ (700+ for best rates)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Citizenship</span>
                        <span class="matrix-value">Indian Citizen</span>
                    </li>
                </ul>
            </div>

            <div class="matrix-card">
                <h3 class="matrix-title">Required Documents</h3>
                <ul class="matrix-list">
                    <li class="matrix-item">
                        <span class="matrix-label">Identity Proof</span>
                        <span class="matrix-value">PAN Card (Mandatory)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Address Proof</span>
                        <span class="matrix-value">Aadhaar Card (OTP verified)</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Income Proof</span>
                        <span class="matrix-value">Recent 3-Month Bank Statement</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Bank Mandate</span>
                        <span class="matrix-value">Active Net Banking or Debit Card</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Physical Paperwork</span>
                        <span class="matrix-value">Zero (100% Digital)</span>
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
            <h2 class="v-title">Get ₹1 Lakh in 4 Simple Steps</h2>
            <p class="v-subtitle">Entirely online application journey without bank queues or paperwork.</p>
        </div>

        <div class="step-grid">
            <div class="step-box">
                <div class="step-num">1</div>
                <h3 class="step-title">Enter Profile</h3>
                <p class="step-desc">Provide your mobile number and basic employment details in our 60-second digital form.</p>
            </div>

            <div class="step-box">
                <div class="step-num">2</div>
                <h3 class="step-title">Instant Matching</h3>
                <p class="step-desc">Our intelligent algorithm checks real-time approval offers from RBI-registered lenders.</p>
            </div>

            <div class="step-box">
                <div class="step-num">3</div>
                <h3 class="step-title">Digital KYC</h3>
                <p class="step-desc">Verify your Aadhaar via secure OTP and authenticate recent bank cash-flow securely.</p>
            </div>

            <div class="step-box">
                <div class="step-num">4</div>
                <h3 class="step-title">Instant Disbursal</h3>
                <p class="step-desc">E-sign the loan contract. ₹1,00,000 is credited straight into your bank account in 2 hours.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Frequently Asked Questions</span>
            <h2 class="v-title">Questions About ₹1 Lakh Personal Loan</h2>
            <p class="v-subtitle">Clear answers to help you choose the right repayment plan.</p>
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

<!-- RELATED AMOUNTS CLUSTER -->
<section class="v-section" style="background: #FFFFFF; border-top: 1px solid #E2E8F0; padding: 4rem 0;">
    <div class="container">
        <div class="v-heading-wrapper text-center">
            <span class="v-badge">Explore Other Options</span>
            <h2 class="v-title">Related Personal Loan Amounts &amp; Planning Tools</h2>
            <p class="v-subtitle">Compare other personal loan amounts within our ₹1,00,000 borrowing limit.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 2rem;">
            <a href="/personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1E40AF; font-size: 1.1rem; margin-bottom: 0.35rem;">Personal Loan Online</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">The complete guide to instant personal loans up to ₹1,00,000 @10.49% p.a.</p>
            </a>
            <a href="/25-thousand-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹25,000 Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹2,204/mo for 12 months with 2-hour digital disbursal.</p>
            </a>
            <a href="/50-thousand-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹50,000 Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹4,407/mo with flexible tenure and zero paperwork.</p>
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
        <h2>Get Your ₹1 Lakh Personal Loan Approved Today</h2>
        <p>Compare pre-approved rates starting at 10.49% p.a. with zero paperwork and zero physical visits.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
