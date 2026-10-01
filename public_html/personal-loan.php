<?php
/**
 * Instant Personal Loan Online - Flagship Hub Page
 * 100% YMYL & E-E-A-T Compliant, Rich Contextual Internal Linking & Structured Data
 */

$canonical_url = "https://paisainminutes.com/personal-loan";
$page_title = "Instant Personal Loan Online @10.49% | Paisa in Minutes";
$page_description = "Apply for instant personal loan up to ₹50 Lakh starting @10.49% p.a. 100% digital KYC, 2-hour disbursal, zero collateral & flexible tenures up to 5 years.";
$page_keywords = "personal loan online, instant personal loan, instant cash loan, apply personal loan, personal loan interest rates, quick personal loan 2 hour disbursal";

// Page Specific FAQs - Synchronized with FAQPage JSON-LD Schema
$page_faqs = [
    [
        "question" => "What is the maximum loan amount and interest rate for a personal loan?",
        "answer" => "Through Paisa in Minutes, you can apply for instant personal loans ranging from ₹10,000 up to ₹50 Lakh. Interest rates start from 10.49% p.a. from our network of RBI-registered banks and NBFCs, depending on your credit score, monthly income, and employment stability."
    ],
    [
        "question" => "How fast will the personal loan amount be disbursed into my bank account?",
        "answer" => "Once your paperless KYC is verified via Aadhaar OTP and you digitally sign the loan agreement, funds are disbursed directly to your verified bank account within 2 hours."
    ],
    [
        "question" => "What is the minimum monthly salary required to qualify?",
        "answer" => "Salaried applicants need a minimum net in-hand monthly salary of ₹20,000 (metro cities) or ₹15,000 (non-metro cities). Self-employed individuals need a minimum annual turnover or gross income of ₹2.5 Lakh supported by recent ITR filings."
    ],
    [
        "question" => "What minimum CIBIL score is required for personal loan approval?",
        "answer" => "A CIBIL credit score of 700 and above ensures immediate pre-approved offers at the lowest interest rates starting @10.49% p.a. However, our partner NBFCs also evaluate applicants with CIBIL scores between 650 and 699 based on bank statement cash-flows."
    ],
    [
        "question" => "What documents are required for 100% digital approval?",
        "answer" => "No physical paperwork is needed. You only require your PAN card, Aadhaar card (linked with active mobile for OTP), last 3 months salary slips, and 3 to 6 months bank statement authenticated via Account Aggregator or net banking."
    ],
    [
        "question" => "Can I foreclose or prepay my personal loan before the tenure ends?",
        "answer" => "Yes. Most partner lenders permit loan foreclosure or partial prepayments after 6 to 12 successfully paid EMIs. Foreclosure charges typically range from 0% to 3% (+ GST) depending on lender terms."
    ],
    [
        "question" => "Are there any hidden charges or upfront processing fees?",
        "answer" => "No. Paisa in Minutes charges zero upfront fees to borrowers. Processing fees (1% to 3% + GST) are clearly stated upfront in the sanction letter and deducted only at the time of net loan disbursal."
    ]
];

include 'includes/header.php';
?>

<!-- Page Specific CSS -->
<style>
.pl-hero {
    background: linear-gradient(135deg, #1B2A6B 0%, #0B132B 50%, #0F172A 100%);
    padding: 8.5rem 0 2.25rem 0;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
}
.pl-hero::before {
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
.pl-hero::after {
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
.pl-hero-content {
    max-width: 780px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
}
.pl-badge {
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
.pl-hero-title {
    font-size: 1.75rem;
    font-family: var(--font-heading);
    font-weight: 800;
    line-height: 1.25;
    margin-bottom: 0.5rem;
    letter-spacing: -0.015em;
    color: #FFFFFF !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.pl-hero-desc {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.88) !important;
    margin-bottom: 1.15rem;
    line-height: 1.55;
    max-width: 620px;
    margin-left: auto;
    margin-right: auto;
}
.hero-cta-group {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
}
.hero-btn-primary {
    background: #FFFFFF !important;
    color: #1B2A6B !important;
    font-weight: 700;
    padding: 0.55rem 1.4rem;
    font-size: 0.84rem;
    border-radius: 50px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    border: 1.5px solid #FFFFFF;
    cursor: pointer;
    transition: all 0.25s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}
.hero-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    background: #F8FAFC !important;
}
.hero-btn-secondary {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #FFFFFF !important;
    font-weight: 600;
    padding: 0.55rem 1.35rem;
    font-size: 0.84rem;
    border-radius: 50px;
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(8px);
    text-decoration: none;
    transition: all 0.25s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}
.hero-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.22) !important;
    border-color: rgba(255, 255, 255, 0.7);
    transform: translateY(-2px);
    color: #FFFFFF !important;
}
.specs-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.65rem;
    margin-top: 0.25rem;
    margin-bottom: 0.85rem;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
}
@media (max-width: 991px) {
    .pl-hero {
        padding: 7rem 0 2rem 0;
    }
}
@media (max-width: 768px) {
    .pl-hero {
        padding: 6.25rem 0 1.75rem 0;
    }
    .specs-bar {
        grid-template-columns: repeat(2, 1fr);
    }
    .pl-hero-title {
        font-size: 1.45rem;
    }
}
@media (max-width: 480px) {
    .pl-hero {
        padding: 5.75rem 0 1.5rem 0;
    }
    .specs-bar {
        grid-template-columns: 1fr;
    }
    .pl-hero-title {
        font-size: 1.25rem;
    }
}
.spec-item {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    padding: 0.5rem 0.55rem;
    text-align: center;
    transition: transform 0.25s ease, background 0.25s ease;
}
.spec-item:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.13);
    border-color: rgba(147, 197, 253, 0.45);
}
.spec-value {
    font-size: 1.05rem;
    font-weight: 700;
    color: #60A5FA;
    margin-bottom: 0.15rem;
    letter-spacing: -0.01em;
    line-height: 1.2;
}
.spec-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
}
.content-section {
    padding: 3.5rem 0;
}
.content-section-alt {
    background: #F8FAFC;
    padding: 3.5rem 0;
}
.sec-heading-wrapper {
    text-align: center;
    max-width: 820px;
    margin: 0 auto 3rem auto;
}
.sec-tag {
    display: inline-block;
    background: rgba(37, 99, 235, 0.1);
    color: #2563EB;
    padding: 0.35rem 1rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.sec-title {
    font-size: 2.25rem;
    color: #0F172A;
    font-weight: 800;
    margin-bottom: 0.85rem;
    line-height: 1.3;
}
.sec-subtitle {
    font-size: 1.05rem;
    color: #64748B;
    line-height: 1.6;
}
.table-responsive {
    overflow-x: auto;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    margin-bottom: 2rem;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
}
.data-table th {
    background: #1B2A6B;
    color: #FFFFFF;
    padding: 1.1rem 1.25rem;
    font-weight: 600;
}
.data-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #E2E8F0;
    color: #334155;
}
.data-table tr:last-child td {
    border-bottom: none;
}
.data-table tr:hover td {
    background: #F8FAFC;
}
.highlight-pill {
    background: #ECFDF5;
    color: #065F46;
    font-weight: 700;
    padding: 0.25rem 0.65rem;
    border-radius: 20px;
    display: inline-block;
    font-size: 0.85rem;
}
.two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
}
@media (max-width: 900px) {
    .two-col-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}
.card-box {
    background: #FFFFFF;
    border-radius: 16px;
    border: 1px solid #E2E8F0;
    padding: 2.25rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
}
.card-box-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.65rem;
}
.card-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.card-list-item {
    display: flex;
    justify-content: space-between;
    padding: 0.85rem 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 0.95rem;
}
.card-list-item:last-child {
    border-bottom: none;
}
.card-list-label {
    color: #64748B;
    font-weight: 500;
}
.card-list-val {
    color: #0F172A;
    font-weight: 600;
    text-align: right;
}
.step-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}
.step-item {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 2rem 1.5rem;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.step-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}
.step-badge {
    width: 44px;
    height: 44px;
    background: #2563EB;
    color: #FFFFFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
}
.step-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.5rem;
}
.step-desc {
    font-size: 0.92rem;
    color: #64748B;
    line-height: 1.6;
    margin: 0;
}
.faq-accordion {
    max-width: 850px;
    margin: 0 auto;
}
.faq-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: border-color 0.2s ease;
}
.faq-q {
    padding: 1.25rem 1.5rem;
    font-weight: 700;
    color: #0F172A;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.05rem;
}
.faq-a {
    padding: 0 1.5rem 1.25rem 1.5rem;
    color: #475569;
    line-height: 1.7;
    font-size: 0.95rem;
}
.eeat-strip {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 16px;
    padding: 2rem;
    margin-top: 3rem;
    font-size: 0.92rem;
    color: #1E3A8A;
    line-height: 1.7;
}
</style>

<!-- HERO SECTION -->
<section class="pl-hero">
    <div class="container">
        <div class="pl-hero-content">
            <div class="pl-badge">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                RBI-Registered NBFC &amp; Bank Network
            </div>
            <h1 class="pl-hero-title">Instant Personal Loan Online <span style="background: linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Up to ₹50 Lakh</span></h1>
            <p class="pl-hero-desc">Access fast, paperless unsecured personal loans starting @10.49% p.a. Compare real-time pre-approved offers with flexible tenures from 3 to 60 months and 2-hour direct bank disbursal.</p>
            
            <div class="hero-cta-group">
                <button type="button" class="hero-btn-primary open-apply-modal">
                    Apply for Personal Loan ⚡
                </button>
                <a href="/personal-loan-emi-calculator" class="hero-btn-secondary">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.375c0-.966-.784-1.75-1.75-1.75s-1.75.784-1.75 1.75.784 1.75 1.75 1.75-1.75-.784 1.75-1.75zm-12 12c0-.966-.784-1.75-1.75-1.75S1.5 22.034 1.5 23s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75z"/></svg>
                    Calculate Monthly EMI
                </a>
            </div>

            <!-- KEY FINANCIAL SPECS BAR (4-Column Symmetric Grid) -->
            <div class="specs-bar">
                <div class="spec-item">
                    <div class="spec-value">₹10K - ₹50 Lakh</div>
                    <div class="spec-label">Loan Amount</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">10.49% p.a.</div>
                    <div class="spec-label">Starting Interest</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">3 to 60 Months</div>
                    <div class="spec-label">Flexible Tenure</div>
                </div>
                <div class="spec-item">
                    <div class="spec-value">Under 2 Hours</div>
                    <div class="spec-label">Direct Disbursal</div>
                </div>
            </div>

            <!-- Trust Strip Below Specs -->
            <div style="display: flex; justify-content: center; gap: 1.25rem; flex-wrap: wrap; margin-top: 0.75rem; font-size: 0.74rem; color: rgba(255, 255, 255, 0.75);">
                <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <svg width="13" height="13" fill="#10B981" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                    30+ RBI-Registered NBFCs &amp; Banks
                </span>
                <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <svg width="13" height="13" fill="#10B981" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                    100% Paperless Digital KYC
                </span>
                <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <svg width="13" height="13" fill="#10B981" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                    Zero Upfront Processing Fees
                </span>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 1: WHAT IS A PERSONAL LOAN & KEY ADVANTAGES -->
<section class="content-section">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">Digital Lending Overview</span>
            <h2 class="sec-title">What is an Instant Personal Loan?</h2>
            <p class="sec-subtitle">An instant personal loan is an unsecured credit facility designed to meet immediate personal or business liquidity needs without pledging collateral such as gold, property, or investments.</p>
        </div>

        <div class="two-col-grid">
            <div>
                <h3 style="font-size: 1.5rem; font-weight: 700; color: #0F172A; margin-bottom: 1rem;">Why Choose Paisa in Minutes for Personal Loans?</h3>
                <p style="color: #475569; line-height: 1.8; margin-bottom: 1.25rem;">
                    Unlike traditional branch-led borrowing processes that take 7 to 10 days of physical paperwork, Paisa in Minutes digitizes the entire application lifecycle. By collaborating with leading RBI-registered non-banking financial companies (NBFCs) and scheduled commercial banks, our algorithmic platform matches your credit profile with the lender offering the highest probability of approval and lowest interest rate.
                </p>
                <ul style="color: #334155; line-height: 1.9; padding-left: 1.25rem;">
                    <li><strong>No End-Use Restrictions:</strong> Utilize funds for medical emergencies, home renovation, wedding costs, or debt consolidation.</li>
                    <li><strong>100% Paperless KYC:</strong> Complete identity verification in 60 seconds using DigiLocker and Aadhaar OTP authentication.</li>
                    <li><strong>Pre-Approved Rate Engine:</strong> Compare live interest rates starting from 10.49% p.a. without hurting your credit score.</li>
                    <li><strong>Transparent Fee Structure:</strong> No hidden processing charges, surprise broker commissions, or advance payment demands.</li>
                </ul>
            </div>

            <div class="card-box" style="background: #F8FAFC;">
                <div class="card-box-title">
                    <svg width="24" height="24" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Personal Loan Benchmark Overview
                </div>
                <div class="card-list">
                    <div class="card-list-item">
                        <span class="card-list-label">Borrowing Range</span>
                        <span class="card-list-val">₹10,000 to ₹50,00,000</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Interest Rates</span>
                        <span class="card-list-val">10.49% to 24.00% p.a.</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Repayment Tenure</span>
                        <span class="card-list-val">3 Months to 5 Years (60 Months)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Processing Fees</span>
                        <span class="card-list-val">1.00% to 3.00% + applicable GST</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Prepayment / Foreclosure</span>
                        <span class="card-list-val">Allowed after 6 EMIs (0% to 3% fee)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Collateral / Security</span>
                        <span class="card-list-val"><span class="highlight-pill">Zero Collateral Required</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 2: REPRESENTATIVE EMI BREAKDOWN TABLE -->
<section class="content-section content-section-alt">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">EMI Planning Matrix</span>
            <h2 class="sec-title">Monthly EMI Estimates at 10.49% p.a.</h2>
            <p class="sec-subtitle">Understand your monthly commitment across popular loan amounts and tenures before applying.</p>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Loan Amount</th>
                        <th>1-Year Tenure (12 Mo)</th>
                        <th>2-Year Tenure (24 Mo)</th>
                        <th>3-Year Tenure (36 Mo)</th>
                        <th>5-Year Tenure (60 Mo)</th>
                        <th>Dedicated Amount Guide</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>₹1,00,000</strong></td>
                        <td>₹8,815 / mo</td>
                        <td>₹4,637 / mo</td>
                        <td>₹3,250 / mo</td>
                        <td>₹2,149 / mo</td>
                        <td><a href="/check-eligibility" style="color: #2563EB; font-weight: 600;">Check ₹1L Eligibility</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹3,00,000</strong></td>
                        <td>₹26,444 / mo</td>
                        <td>₹13,912 / mo</td>
                        <td>₹9,750 / mo</td>
                        <td>₹6,447 / mo</td>
                        <td><a href="/personal-loan-emi-calculator" style="color: #2563EB; font-weight: 600;">Calculate ₹3L EMI</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹5,00,000</strong></td>
                        <td>₹44,072 / mo</td>
                        <td>₹23,186 / mo</td>
                        <td>₹16,249 / mo</td>
                        <td>₹10,744 / mo</td>
                        <td><a href="/5-lakh-personal-loan" style="color: #2563EB; font-weight: 600;">₹5 Lakh Loan Guide &rarr;</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹10,00,000</strong></td>
                        <td>₹88,145 / mo</td>
                        <td>₹46,373 / mo</td>
                        <td>₹32,499 / mo</td>
                        <td>₹21,488 / mo</td>
                        <td><a href="/10-lakh-personal-loan" style="color: #2563EB; font-weight: 600;">₹10 Lakh Loan Guide &rarr;</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹20,00,000</strong></td>
                        <td>₹1,76,290 / mo</td>
                        <td>₹92,746 / mo</td>
                        <td>₹64,997 / mo</td>
                        <td>₹42,976 / mo</td>
                        <td><a href="/20-lakh-personal-loan" style="color: #2563EB; font-weight: 600;">₹20 Lakh Loan Guide &rarr;</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹30,00,000</strong></td>
                        <td>₹2,64,435 / mo</td>
                        <td>₹1,39,119 / mo</td>
                        <td>₹97,496 / mo</td>
                        <td>₹64,464 / mo</td>
                        <td><a href="/30-lakh-personal-loan" style="color: #2563EB; font-weight: 600;">₹30 Lakh Loan Guide &rarr;</a></td>
                    </tr>
                    <tr>
                        <td><strong>₹50,00,000</strong></td>
                        <td>₹4,40,724 / mo</td>
                        <td>₹2,31,865 / mo</td>
                        <td>₹1,62,493 / mo</td>
                        <td>₹1,07,440 / mo</td>
                        <td><a href="/50-lakh-personal-loan" style="color: #2563EB; font-weight: 600;">₹50 Lakh Loan Guide &rarr;</a></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 1.25rem 1.5rem; color: #1E40AF; font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
                <strong>Want exact customized calculations?</strong> Use our interactive tool with real-time interest sliders:
            </div>
            <a href="/personal-loan-emi-calculator" class="btn btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.9rem;">
                Open Personal Loan EMI Calculator
            </a>
        </div>
    </div>
</section>

<!-- SECTION 3: PARTNER BANK & NBFC COMPARISON TABLE -->
<section class="content-section">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">Lender Comparison</span>
            <h2 class="sec-title">Personal Loan Interest Rates by Top Banks &amp; NBFCs (2026)</h2>
            <p class="sec-subtitle">Compare indicative starting interest rates and processing fees from leading lenders across India.</p>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Lending Partner</th>
                        <th>Interest Rate (p.a.)</th>
                        <th>Loan Amount Limit</th>
                        <th>Processing Fee</th>
                        <th>Approval Speed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>HDFC Bank</strong></td>
                        <td>10.50% - 21.00%</td>
                        <td>Up to ₹40 Lakh</td>
                        <td>Up to 2.50%</td>
                        <td>Instant to 4 Hours</td>
                    </tr>
                    <tr>
                        <td><strong>ICICI Bank</strong></td>
                        <td>10.65% - 16.00%</td>
                        <td>Up to ₹50 Lakh</td>
                        <td>Up to 2.00%</td>
                        <td>Under 2 Hours</td>
                    </tr>
                    <tr>
                        <td><strong>State Bank of India (SBI)</strong></td>
                        <td>11.00% - 14.50%</td>
                        <td>Up to ₹20 Lakh</td>
                        <td>0.50% to 1.50%</td>
                        <td>1 to 2 Working Days</td>
                    </tr>
                    <tr>
                        <td><strong>Axis Bank</strong></td>
                        <td>10.49% - 22.00%</td>
                        <td>Up to ₹40 Lakh</td>
                        <td>1.00% to 2.00%</td>
                        <td>Instant Digital Approval</td>
                    </tr>
                    <tr>
                        <td><strong>Bajaj Finserv</strong></td>
                        <td>11.00% - 24.00%</td>
                        <td>Up to ₹40 Lakh</td>
                        <td>Up to 3.93%</td>
                        <td>Instant Disbursal</td>
                    </tr>
                    <tr>
                        <td><strong>Tata Capital</strong></td>
                        <td>10.99% - 23.00%</td>
                        <td>Up to ₹35 Lakh</td>
                        <td>Up to 2.75%</td>
                        <td>Digital 2 Hours</td>
                    </tr>
                    <tr>
                        <td><strong>Aditya Birla Capital</strong></td>
                        <td>10.99% - 22.00%</td>
                        <td>Up to ₹50 Lakh</td>
                        <td>Up to 2.50%</td>
                        <td>Paperless 2 Hours</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="font-size: 0.85rem; color: #64748B; text-align: center; margin-top: 0.5rem;">
            *Disclaimer: Interest rates, loan limits, and processing charges are subject to credit assessment, income profile, and discretion of the respective partner banks and NBFCs.
        </p>
    </div>
</section>

<!-- SECTION 4: ELIGIBILITY CRITERIA & DOCUMENTS REQUIRED -->
<section class="content-section content-section-alt">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">Approval Parameters</span>
            <h2 class="sec-title">Eligibility Criteria &amp; Digital Document Checklist</h2>
            <p class="sec-subtitle">Ensure your application is approved seamlessly within minutes by meeting these straightforward requirements.</p>
        </div>

        <div class="two-col-grid">
            <!-- Card 1: Eligibility -->
            <div class="card-box">
                <div class="card-box-title">
                    <svg width="22" height="22" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Borrower Eligibility Benchmark
                </div>
                <div class="card-list">
                    <div class="card-list-item">
                        <span class="card-list-label">Applicant Age</span>
                        <span class="card-list-val">21 to 60 Years</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Employment Type</span>
                        <span class="card-list-val"><a href="/loan-for-salaried-employees" style="color: #2563EB;">Salaried</a> or <a href="/loan-for-self-employed" style="color: #2563EB;">Self-Employed</a></span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Minimum Monthly Salary</span>
                        <span class="card-list-val">₹20,000 / mo (Net In-Hand)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">CIBIL Score Benchmark</span>
                        <span class="card-list-val">700+ (<a href="/personal-loan-low-cibil-score" style="color: #2563EB;">650+ for Select NBFCs</a>)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Work Experience</span>
                        <span class="card-list-val">Min 6 Months in Current Job</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Debt-to-Income (FOIR)</span>
                        <span class="card-list-val">Existing EMIs under 50% of income</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Citizenship</span>
                        <span class="card-list-val">Resident Citizen of India</span>
                    </div>
                </div>
            </div>

            <!-- Card 2: Documents Checklist -->
            <div class="card-box">
                <div class="card-box-title">
                    <svg width="22" height="22" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    100% Digital Document Checklist
                </div>
                <div class="card-list">
                    <div class="card-list-item">
                        <span class="card-list-label">Identity Proof (Mandatory)</span>
                        <span class="card-list-val">PAN Card</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Address Proof</span>
                        <span class="card-list-val">Aadhaar Card (OTP verification)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Income Proof (Salaried)</span>
                        <span class="card-list-val">Last 3 Months Salary Slips</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Bank Records</span>
                        <span class="card-list-val">3 to 6 Months Salary Account Statement</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Income Proof (Self-Employed)</span>
                        <span class="card-list-val">Last 2 Years ITR with Computation</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Auto-Debit Setup</span>
                        <span class="card-list-val">Net Banking or Debit Card (e-NACH)</span>
                    </div>
                    <div class="card-list-item">
                        <span class="card-list-label">Physical Documentation</span>
                        <span class="card-list-val"><span class="highlight-pill">Zero Physical Visits</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 5: STEP-BY-STEP APPLICATION JOURNEY -->
<section class="content-section">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">How It Works</span>
            <h2 class="sec-title">4 Simple Steps to Disbursal</h2>
            <p class="sec-subtitle">Experience a streamlined, fully automated digital borrowing journey from approval to bank transfer.</p>
        </div>

        <div class="step-grid">
            <div class="step-item">
                <div class="step-badge">1</div>
                <h3 class="step-title">Enter Basic Details</h3>
                <p class="step-desc">Fill out your mobile number, PAN, and basic employment parameters in our secure 60-second digital application form.</p>
            </div>
            <div class="step-item">
                <div class="step-badge">2</div>
                <h3 class="step-title">Instant Lender Match</h3>
                <p class="step-desc">Our intelligent algorithm checks real-time pre-approved offers across 30+ RBI-registered lenders without triggering hard credit inquiries.</p>
            </div>
            <div class="step-item">
                <div class="step-badge">3</div>
                <h3 class="step-title">Paperless Digital KYC</h3>
                <p class="step-desc">Complete instant Aadhaar authentication via OTP and verify bank cash flows securely through the RBI Account Aggregator network.</p>
            </div>
            <div class="step-item">
                <div class="step-badge">4</div>
                <h3 class="step-title">2-Hour Disbursal</h3>
                <p class="step-desc">Review your sanction letter, e-sign the loan contract digitally, and receive funds deposited directly into your bank account.</p>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 6: CONTEXTUAL AMOUNT TIERS & RELATED PRODUCTS -->
<section class="content-section content-section-alt">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">Tailored Loan Solutions</span>
            <h2 class="sec-title">Explore Personal Loans by Amount &amp; Category</h2>
            <p class="sec-subtitle">Find custom eligibility benchmarks, document checklists, and EMI estimates for your specific borrowing requirement.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">₹5 Lakh Personal Loan</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    EMI starting from ₹10,744/mo. Ideal for home renovation, urgent medical treatments, and wedding expenses.
                </p>
                <a href="/5-lakh-personal-loan" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">View ₹5 Lakh Guide &rarr;</a>
            </div>

            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">₹10 Lakh Personal Loan</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    EMI starting from ₹21,488/mo. Perfect for high-cost credit card debt consolidation and higher education funding.
                </p>
                <a href="/10-lakh-personal-loan" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">View ₹10 Lakh Guide &rarr;</a>
            </div>

            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">₹20 Lakh Personal Loan</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    EMI starting from ₹42,976/mo. High-ticket liquidity with flexible 5-year repayment and zero collateral pledge.
                </p>
                <a href="/20-lakh-personal-loan" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">View ₹20 Lakh Guide &rarr;</a>
            </div>

            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">₹50 Lakh Personal Loan</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    Maximum unsecured liquidity for business expansion, luxury milestone purchases, and commercial needs.
                </p>
                <a href="/50-lakh-personal-loan" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">View ₹50 Lakh Guide &rarr;</a>
            </div>

            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">Low CIBIL Personal Loan</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    Specialized lending options for applicants with credit scores between 650 and 699 with steady bank transactions.
                </p>
                <a href="/personal-loan-low-cibil-score" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Low CIBIL Loan Options &rarr;</a>
            </div>

            <div class="card-box">
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #1B2A6B; margin-bottom: 0.5rem;">Personal Loan Balance Transfer</h3>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 1rem;">
                    Transfer your existing high-interest loan to partner lenders starting @10.49% p.a. to reduce monthly EMI costs.
                </p>
                <a href="/personal-loan-balance-transfer" style="color: #2563EB; font-weight: 700; text-decoration: none; font-size: 0.95rem;">Balance Transfer Guide &rarr;</a>
            </div>
        </div>
    </div>
</section>

<!-- SECTION 7: FAQS ACCORDION -->
<section class="content-section" id="faqs">
    <div class="container">
        <div class="sec-heading-wrapper">
            <span class="sec-tag">Got Questions?</span>
            <h2 class="sec-title">Frequently Asked Questions on Personal Loans</h2>
            <p class="sec-subtitle">Get immediate answers to common borrowing, eligibility, and disbursal queries.</p>
        </div>

        <div class="faq-accordion">
            <?php foreach ($page_faqs as $faq): ?>
            <div class="faq-card">
                <div class="faq-q">
                    <span><?php echo htmlspecialchars($faq['question']); ?></span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="faq-a">
                    <?php echo htmlspecialchars($faq['answer']); ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- E-E-A-T REGULATORY & COMPLIANCE DISCLOSURE -->
        <div class="eeat-strip">
            <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem; color: #1E40AF;">
                Regulatory Disclosure &amp; Lending Marketplace Transparency
            </div>
            <p style="margin-bottom: 0.75rem;">
                Paisa in Minutes (operated by <strong>AdGrow Media Services</strong>, Delhi, India) functions as an authorized digital loan facilitation marketplace. We do not operate as a direct lender or deposit-taking institution. All loan sanctions, interest rates, processing fees, and disbursals are strictly governed by our partnered RBI-registered banks and non-banking financial companies (NBFCs) in accordance with the RBI Fair Practices Code.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.88rem; color: #1E3A8A; border-top: 1px solid #BFDBFE; padding-top: 0.75rem;">
                <span><strong>Corporate Entity:</strong> AdGrow Media Services</span>
                <span><strong>Grievance Email:</strong> <a href="mailto:info@paisainminutes.com" style="color: #1E40AF; text-decoration: underline;">info@paisainminutes.com</a></span>
                <span><strong>Compliance Contact:</strong> +91 9990 666578</span>
                <span><strong>Last Content Review:</strong> September 2026</span>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="variant-cta" style="background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%); color: #FFFFFF; padding: 5rem 0; text-align: center;">
    <div class="container">
        <h2 style="font-size: 2.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 1rem;">Ready to Get Funded in Minutes?</h2>
        <p style="color: rgba(255,255,255,0.85); max-width: 650px; margin: 0 auto 2rem auto; font-size: 1.15rem; line-height: 1.6;">
            Check your pre-approved personal loan offers up to ₹50 Lakh with zero paperwork and zero impact on your credit score.
        </p>
        <button class="btn btn-primary open-apply-modal" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1.15rem 3.25rem; font-size: 1.15rem; border-radius: 50px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            Check Loan Eligibility in 60 Seconds ⚡
        </button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
