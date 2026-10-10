<?php
$canonical_url = "https://paisainminutes.com/25-thousand-personal-loan";
/**
 * 25 Thousand Personal Loan Page
 * Dynamic SEO optimized variant page with rich content and verified financial calculations
 */

$page_title = "₹25,000 Personal Loan Online @10.49% - Check EMI & Apply | Paisa in Minutes";
$page_description = "Apply for ₹25,000 Personal Loan online starting @10.49% p.a. Check monthly EMI from ₹1,159/mo, min salary of ₹15,000, 100% digital KYC & 2-hour disbursal. Trusted by 25,000+ borrowers.";
$page_keywords = "25000 personal loan, 25 thousand personal loan emi, 25000 loan eligibility, instant 25000 loan online, low interest 25000 loan";

$page_faqs = [
    [
        "question" => "What is the monthly EMI for a ₹25,000 personal loan?",
        "answer" => "At an interest rate of 10.49% p.a., the monthly EMI for a ₹25,000 personal loan is approximately ₹4,295 for a 6-month tenure, ₹2,204 for 12 months (1 year), ₹1,507 for 18 months, and ₹1,159 for a 24-month (2-year) tenure."
    ],
    [
        "question" => "What is the minimum monthly salary needed for a ₹25,000 loan?",
        "answer" => "Applicants typically need a minimum net monthly in-hand salary of ₹15,000. Lenders verify that your existing monthly commitments do not exceed 50% of your net monthly income."
    ],
    [
        "question" => "What CIBIL score is required for ₹25,000 loan approval?",
        "answer" => "A CIBIL credit score of 650 or higher is recommended for the fastest approval. Applicants with scores between 600 and 650 can also qualify with steady bank income verification."
    ],
    [
        "question" => "How fast is the ₹25,000 loan disbursed?",
        "answer" => "Once your Aadhaar digital KYC is completed and online mandate authenticated, the ₹25,000 is directly disbursed into your bank account within 2 hours."
    ],
    [
        "question" => "Can I foreclose my ₹25,000 loan early?",
        "answer" => "Yes, our RBI-registered lending partners allow partial prepayment or full foreclosure. Foreclosure charges range from 0% to 3% depending on lender policies."
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
                Instant Disbursal in 2 Hours • 100% Paperless
            </div>
            <h1 class="variant-hero-title">₹25,000 Personal Loan Online</h1>
            <p class="variant-hero-desc">Access an instant ₹25,000 personal loan starting @<strong>10.49% p.a.</strong> with monthly EMIs from just <strong>₹1,159/month</strong>. Fast 100% digital KYC approval from RBI-registered lenders with zero collateral.</p>
            
            <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                Apply For ₹25,000 Loan Now
            </button>

            <!-- Quick Specs Overview -->
            <div class="quick-specs-grid">
                <div class="quick-spec-card">
                    <div class="quick-spec-val">10.49% p.a.</div>
                    <div class="quick-spec-lbl">Starting Rate</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">₹1,159 / mo</div>
                    <div class="quick-spec-lbl">Lowest Monthly EMI</div>
                </div>
                <div class="quick-spec-card">
                    <div class="quick-spec-val">6 to 24 Months</div>
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
            <h2 class="v-title">₹25,000 Personal Loan EMI Breakdown</h2>
            <p class="v-subtitle">Calculate monthly payments and total interest payable at our starting interest rate of 10.49% p.a.</p>
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
                            <td><strong>6 Months</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹4,295</td>
                            <td>₹770</td>
                            <td>₹25,770</td>
                            <td><span class="badge-rec badge-rec-success">Lowest Total Interest</span></td>
                        </tr>
                        <tr>
                            <td><strong>12 Months (1 Year)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹2,204</td>
                            <td>₹1,443</td>
                            <td>₹26,443</td>
                            <td><span class="badge-rec badge-rec-primary">Most Balanced</span></td>
                        </tr>
                        <tr>
                            <td><strong>18 Months</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,507</td>
                            <td>₹2,126</td>
                            <td>₹27,126</td>
                            <td><span class="badge-rec">Comfortable EMI</span></td>
                        </tr>
                        <tr>
                            <td><strong>24 Months (2 Years)</strong></td>
                            <td style="color: #1B2A6B; font-weight: 700;">₹1,159</td>
                            <td>₹2,823</td>
                            <td>₹27,823</td>
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
            <span class="v-badge">Use Cases</span>
            <h2 class="v-title">Common Uses for ₹25,000 Loan</h2>
            <p class="v-subtitle">Convenient borrowing for planned expenses or unexpected family needs.</p>
        </div>

        <div class="usecase-grid">
            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <h3 class="usecase-title">Education &amp; Exam Fees</h3>
                <p class="usecase-desc">Pay semester fees, professional certification tests, or course study materials without delay.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <h3 class="usecase-title">Home Maintenance</h3>
                <p class="usecase-desc">Fund painting touch-ups, plumbing repairs, or home fixture upgrades before special occasions.</p>
            </div>

            <div class="usecase-card">
                <div class="usecase-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <h3 class="usecase-title">Festive &amp; Family Shopping</h3>
                <p class="usecase-desc">Shop for festive essentials, gifts, or travel tickets during festival and holiday periods.</p>
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
            <p class="v-subtitle">Clear requirements to ensure instant processing and swift bank disbursal.</p>
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
                        <span class="matrix-value">₹15,000 / month</span>
                    </li>
                    <li class="matrix-item">
                        <span class="matrix-label">Minimum CIBIL Score</span>
                        <span class="matrix-value">650+ (600+ with good cash flow)</span>
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
                        <span class="matrix-value">Aadhaar Card (Linked Mobile)</span>
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
            <h2 class="v-title">Get ₹25,000 in 4 Simple Steps</h2>
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
                <p class="step-desc">E-sign the loan contract. ₹25,000 is credited straight into your bank account in 2 hours.</p>
            </div>
        </div>
    </div>
</section>

<!-- FAQS -->
<section class="v-section v-section-alt" id="faqs">
    <div class="container">
        <div class="v-heading-wrapper">
            <span class="v-badge">Frequently Asked Questions</span>
            <h2 class="v-title">Questions About ₹25,000 Personal Loan</h2>
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
            <a href="/10-thousand-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹10,000 Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹881/mo with minimal income requirements.</p>
            </a>
            <a href="/50-thousand-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1B2A6B; font-size: 1.1rem; margin-bottom: 0.35rem;">₹50,000 Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Check EMI from ₹4,407/mo with flexible tenure and zero paperwork.</p>
            </a>
            <a href="/1-lakh-personal-loan" style="display: block; background: #FFFFFF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s ease;">
                <div style="font-weight: 700; color: #1E40AF; font-size: 1.1rem; margin-bottom: 0.35rem;">₹1,00,000 Personal Loan</div>
                <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.5;">Our maximum personal loan offer with tenures up to 48 months.</p>
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
        <h2>Get Your ₹25,000 Personal Loan Approved Today</h2>
        <p>Compare pre-approved rates starting at 10.49% p.a. with zero paperwork and zero physical visits.</p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.1rem 3rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
