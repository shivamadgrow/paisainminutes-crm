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
.comp-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}
.comp-table th, .comp-table td {
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}
.comp-table th {
    background-color: var(--light-gray);
    color: var(--primary-color);
    font-weight: 700;
}
.comp-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
}
.badge-lump { background: #DCFCE7; color: #166534; }
.badge-inst { background: #FCE7F3; color: #9D174D; }

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
            <span class="section-tag">Savings Comparison</span>
            <h1 class="sec-hero-title">Fixed Deposit vs Recurring Deposit</h1>
            <p class="sec-hero-desc">Lump-sum compounding vs disciplined monthly savings. Compare tenures, interest yield dynamics, and taxation models to select the right deposit structure.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Compare Deposit Rates</button>
        </div>
    </div>
</section>

<!-- FEATURE CARDS -->
<section style="padding-bottom: 4rem;">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 class="feature-title">Lump-Sum vs Installment</h2>
                <p class="feature-desc">Lock in large lump-sums at once using Fixed Deposits, or build up capital progressively with Recurring Deposits.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h2 class="feature-title">Interest Yield Differences</h2>
                <p class="feature-desc">FDs yield slightly higher overall interest since the entire principal earns compounding margins from the start date.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 class="feature-title">Identical Tax Rules</h2>
                <p class="feature-desc">Interest earnings on both FD and RD accounts are fully taxed according to your individual income tax slab rates.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Side-By-Side Comparison</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">Fixed Deposit vs Recurring Deposit</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Review the structural differences between these secure bank deposit products:</p>
                
                <div class="table-wrapper">
                    <table class="comp-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Fixed Deposit (FD)</th>
                                <th>Recurring Deposit (RD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Deposit Type</strong></td>
                                <td><span class="comp-badge badge-lump">Lump-Sum</span> (One-time payment)</td>
                                <td><span class="comp-badge badge-inst">Installment</span> (Regular monthly payouts)</td>
                            </tr>
                            <tr>
                                <td><strong>Minimum Investment</strong></td>
                                <td>Usually starts at ₹1,000 to ₹10,000</td>
                                <td>Starts very low (typically ₹100 or ₹500/month)</td>
                            </tr>
                            <tr>
                                <td><strong>Tenure Structure</strong></td>
                                <td>Ranges from 7 days up to 10 years</td>
                                <td>Ranges from 6 months up to 10 years</td>
                            </tr>
                            <tr>
                                <td><strong>Interest Payout</strong></td>
                                <td>Paid out monthly, quarterly, or accumulated at maturity</td>
                                <td>Paid out only as accumulated total at maturity</td>
                            </tr>
                            <tr>
                                <td><strong>TDS Threshold</strong></td>
                                <td>Exempt below ₹40,000 p.a. (₹50,000 for senior citizens)</td>
                                <td>Identical threshold of ₹40,000/₹50,000 p.a.</td>
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
            <p class="section-subtitle">Find immediate answers regarding FD vs RD deposits.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is the difference between FD and RD?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        In a **Fixed Deposit (FD)**, you invest a lump-sum amount of money once for a fixed tenure. In a **Recurring Deposit (RD)**, you commit to depositing a fixed, smaller amount of money every month for a pre-determined tenure.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Which yields more interest: FD or RD?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        If the interest rate is identical, a **Fixed Deposit (FD)** yields higher absolute returns because the entire principal amount earns compounding interest from day one. In a **Recurring Deposit (RD)**, the first installment earns interest for the full tenure, while subsequent monthly deposits earn interest for progressively shorter periods.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Is TDS applicable on Recurring Deposits?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes, TDS guidelines for RDs are identical to FDs. Banks are mandated to deduct 10% TDS if the total interest earned on RDs and FDs combined in a bank exceeds ₹40,000 in a financial year (or ₹50,000 for senior citizens).
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Start Your Savings Account Today</h2>
        <p>Compare and open high-yield Fixed Deposits or Recurring Deposits online in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Open Account Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
