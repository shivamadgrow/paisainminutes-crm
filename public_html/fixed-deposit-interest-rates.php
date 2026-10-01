<?php include 'includes/header.php'; ?>

<!-- Custom Styles for Page -->
<style>
.sec-hero {
    background: var(--gradient-primary);
    padding: 7.5rem 0 5.5rem 0;
    position: relative;
    overflow: hidden;
    color: var(--white);
    text-align: center;
}
.sec-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(74, 141, 255, 0.15) 0%, rgba(27, 42, 107, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
}
.sec-hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}
.sec-hero-title {
    font-size: 3rem;
    color: var(--white);
    margin: 1.5rem 0;
    font-family: var(--font-heading);
    font-weight: 800;
}
.sec-hero-desc {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 2rem;
    line-height: 1.7;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: -3rem;
    position: relative;
    z-index: 10;
}
.feature-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: 2.5rem 2rem;
    box-shadow: var(--shadow-lg);
    text-align: center;
    border: 1px solid var(--border-color);
    transition: var(--transition-smooth);
}
.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
}
.feature-icon {
    width: 60px;
    height: 60px;
    background: var(--accent-light);
    color: var(--accent-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem auto;
}
.feature-icon svg {
    width: 28px;
    height: 28px;
}
.feature-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
}
.feature-desc {
    color: var(--text-muted);
    font-size: 0.95rem;
}

.info-section {
    padding: 6rem 0;
}
.info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
}
@media (max-width: 768px) {
    .sec-hero-title {
        font-size: 2.25rem;
    }
}

.table-wrapper {
    overflow-x: auto;
    margin-top: 2rem;
}
.fd-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}
.fd-table th, .fd-table td {
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}
.fd-table th {
    background-color: var(--light-gray);
    color: var(--primary-color);
    font-weight: 700;
}
.fd-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    background: var(--accent-light);
    color: var(--accent-color);
}

.cta-banner {
    background: var(--gradient-accent);
    color: var(--white);
    padding: 5rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.cta-banner h2 {
    color: var(--white);
    font-size: 2.25rem;
    margin-bottom: 1rem;
}
.cta-banner p {
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
}
</style>

<!-- HERO SECTION -->
<section class="sec-hero">
    <div class="container">
        <div class="sec-hero-content">
            <span class="section-tag">Guaranteed Wealth Growth</span>
            <h1 class="sec-hero-title">Fixed Deposit Interest Rates</h1>
            <p class="sec-hero-desc">Lock in high guaranteed returns. Compare current Fixed Deposit (FD) rates across public sector, private sector, and Small Finance Banks online.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check FD Offers</button>
        </div>
    </div>
</section>

<!-- FEATURE CARDS -->
<section style="padding-bottom: 4rem;">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h2 class="feature-title">Guaranteed Returns</h2>
                <p class="feature-desc">Fulfill savings goals with fixed interest margins that stay completely unaffected by stock market drops.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 class="feature-title">DICGC Insurance Cover</h2>
                <p class="feature-desc">Deposits are insured up to ₹5 Lakhs per bank (including principal & interest) under RBI's DICGC policy.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 class="feature-title">Flexible Tenures</h2>
                <p class="feature-desc">Choose deposit tenures ranging from 7 days up to 10 years matching your exact financial requirements.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Interest Rate Comparison</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">FD Interest Rates Across Banks</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Review the approximate interest rates offered by top banking institutes for deposits under ₹2 Crores:</p>
                
                <div class="table-wrapper">
                    <table class="fd-table">
                        <thead>
                            <tr>
                                <th>Bank Category</th>
                                <th>Top Regular FD Rate</th>
                                <th>Senior Citizen FD Rate</th>
                                <th>Best Safe Tenure</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>State Bank of India (SBI)</td>
                                <td><span class="fd-badge">6.80% - 7.10%</span></td>
                                <td>7.30% - 7.60%</td>
                                <td>1 Year - 400 Days</td>
                            </tr>
                            <tr>
                                <td>HDFC Bank / ICICI Bank</td>
                                <td><span class="fd-badge">7.10% - 7.25%</span></td>
                                <td>7.60% - 7.75%</td>
                                <td>15 Months - 18 Months</td>
                            </tr>
                            <tr>
                                <td>IDFC First Bank / IndusInd Bank</td>
                                <td><span class="fd-badge">7.75% - 8.00%</span></td>
                                <td>8.25% - 8.50%</td>
                                <td>1 Year - 2 Years</td>
                            </tr>
                            <tr>
                                <td>Small Finance Banks (SFBs)</td>
                                <td><span class="fd-badge">8.25% - 8.60%</span></td>
                                <td>8.75% - 9.10%</td>
                                <td>500 Days - 3 Years</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ SECTION -->
<section class="section" id="faqs">
    <div class="container">
        <div class="section-title-wrapper text-center">
            <span class="section-tag">FAQs</span>
            <h2 class="section-title"><?php echo htmlspecialchars($human_name); ?> FAQs</h2>
            <p class="section-subtitle">Find immediate answers regarding Fixed Deposit interest rates.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is a Fixed Deposit (FD)?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A Fixed Deposit (FD) is a secure investment instrument offered by banks and Non-Banking Financial Companies (NBFCs). You lock in a lump-sum amount of money for a specific maturity period at a guaranteed interest rate that does not change until maturity.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Are deposits in Small Finance Banks safe?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes. Small Finance Banks are fully regulated by the Reserve Bank of India (RBI). Under the Deposit Insurance and Credit Guarantee Corporation (DICGC) Act, deposits up to ₹5 Lakhs (inclusive of principal and accrued interest) per depositor are 100% insured, matching the safety level of large commercial banks.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does TDS work on Fixed Deposits?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        If the total interest earned across all your FDs in a bank exceeds ₹40,000 in a financial year (or ₹50,000 for senior citizens), the bank will deduct 10% TDS (Tax Deducted at Source) automatically. If your net income is below the taxable threshold, you can submit Form 15G or 15H to prevent this TDS deduction.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Lock in Your Fixed Deposit Today</h2>
        <p>Compare pre-approved bank fixed deposits online and complete your digital account activation in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check FD Offers</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
