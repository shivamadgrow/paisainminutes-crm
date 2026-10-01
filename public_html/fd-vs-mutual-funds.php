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
.badge-fixed { background: #E0F2FE; color: #0369A1; }
.badge-market { background: #FEF3C7; color: #D97706; }

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
            <span class="section-tag">Investment Strategy</span>
            <h1 class="sec-hero-title">Fixed Deposit vs Mutual Funds</h1>
            <p class="sec-hero-desc">Choose the right path for your money. Compare return stability, risk management profiles, and taxation rules between secure FDs and high-growth Mutual Funds.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Compare Investments</button>
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
                <h2 class="feature-title">Guaranteed vs Variable</h2>
                <p class="feature-desc">FDs secure pre-determined interest returns. Mutual Funds yield market-linked profits depending on market shifts.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 class="feature-title">Tax Efficiency Metrics</h2>
                <p class="feature-desc">Compare slab-based tax allocations on FDs against lower capital gains structures active on Mutual Funds.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 class="feature-title">Liquidity comparison</h2>
                <p class="feature-desc">Mutual funds allow exit without break charges (except exit loads), while breaking FDs incurs interest penalty cuts.</p>
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
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">Key Differences: FD vs Mutual Funds</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Choose the right asset mix based on your risk tolerance and holding duration guidelines:</p>
                
                <div class="table-wrapper">
                    <table class="comp-table">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Fixed Deposit (FD)</th>
                                <th>Mutual Funds (MF)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Returns</strong></td>
                                <td><span class="comp-badge badge-fixed">Guaranteed</span> (6.5% - 8% p.a.)</td>
                                <td><span class="comp-badge badge-market">Market-Linked</span> (12% - 15% historical equity avg)</td>
                            </tr>
                            <tr>
                                <td><strong>Risk Profile</strong></td>
                                <td>Zero risk (Insured up to ₹5 Lakhs by DICGC)</td>
                                <td>Market risk depending on schemes (Equity/Debt)</td>
                            </tr>
                            <tr>
                                <td><strong>Tax Treatment</strong></td>
                                <td>Fully taxable according to income tax slab rate</td>
                                <td>LTCG taxed at 12.5% (Equity) after ₹1.25 Lakh profit</td>
                            </tr>
                            <tr>
                                <td><strong>Premature Exit</strong></td>
                                <td>Penalties apply (typically 0.50% to 1.00%)</td>
                                <td>Exit loads apply (0% to 1%) if redeemed within 1 year</td>
                            </tr>
                            <tr>
                                <td><strong>Inflation Hedge</strong></td>
                                <td>Low (Does not beat high inflation indices)</td>
                                <td>High (Equity funds excel in outperforming inflation)</td>
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
            <p class="section-subtitle">Find immediate answers regarding FD vs Mutual Funds comparison.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Fixed Deposit vs Mutual Funds: Which is better?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        It depends on your investment goals and risk tolerance. If you want 100% capital safety and guaranteed returns for short-term goals, a **Fixed Deposit** is better. If you have a long-term investment horizon (3+ years) and want to grow wealth by beating inflation, **Mutual Funds** are generally superior.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How is taxation different between FDs and Mutual Funds?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Interest earned on Fixed Deposits is taxed annually according to your individual income tax slab rates. In contrast, Mutual Funds are taxed only when you redeem/sell your units. For equity funds, Long-Term Capital Gains (LTCG) are taxed at 12.5% (exemption up to ₹1.25 Lakh profit per year), which makes mutual funds more tax-efficient for high-slab taxpayers.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Can I lose my principal amount in FDs or Mutual Funds?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        In a bank Fixed Deposit, your principal is completely safe and backed by bank solvency (insured up to ₹5 Lakhs by DICGC). In Mutual Funds, your principal is invested in equity or debt markets, meaning it is subject to market fluctuations, and there is a possibility of capital drop during market downswings.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Optimize Your Wealth Allocation Today</h2>
        <p>Compare pre-approved bank fixed deposits and top-performing mutual funds online in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Get Expert Consultation</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
