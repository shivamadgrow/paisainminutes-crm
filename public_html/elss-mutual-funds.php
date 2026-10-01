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
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    .sec-hero-title {
        font-size: 2.25rem;
    }
}
.info-img-wrapper {
    position: relative;
}
.info-img-card {
    background: var(--gradient-accent);
    color: var(--white);
    border-radius: var(--border-radius-lg);
    padding: 3rem;
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
}
.info-img-card::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
}
.score-badge {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-pill);
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
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
            <span class="section-tag">Section 80C Tax Saving</span>
            <h1 class="sec-hero-title">ELSS Mutual Funds</h1>
            <p class="sec-hero-desc">Save taxes and grow wealth. Invest in Equity Linked Savings Schemes (ELSS) online to claim tax deductions up to ₹1.5 Lakhs under Section 80C rules.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Invest in ELSS Online</button>
        </div>
    </div>
</section>

<!-- FEATURE CARDS -->
<section style="padding-bottom: 4rem;">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h2 class="feature-title">Save Up to ₹46,800 Tax</h2>
                <p class="feature-desc">Claim tax deductions up to ₹1.5 Lakhs under Section 80C, saving up to ₹46,800 annually for high taxpayers.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h2 class="feature-title">Shortest 3-Year Lock-In</h2>
                <p class="feature-desc">Shortest lock-in among all 80C options (PPF is 15 years, Tax-Saving bank FDs are fixed at 5 years).</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h2 class="feature-title">Inflation-Beating Growth</h2>
                <p class="feature-desc">Portfolio is invested directly in stock markets, delivering superior compounding yields compared to debt tools.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div class="info-img-wrapper">
                <div class="info-img-card" style="background: linear-gradient(135deg, #1B2A6B 0%, #111942 100%);">
                    <div class="score-badge">3-Year Lock-In</div>
                    <h3>Shortest 80C Lock-In</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">ELSS carries a mandatory lock-in period of 3 years from the deposit date. While you cannot withdraw capital, this lock-in allows fund managers to hold long-term stock allocations without short-term redemption pressures.</p>
                    <ul style="margin-top: 1.5rem; list-style-type: none; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;">✔ 80C deduction limit: ₹1.5 Lakhs</li>
                        <li style="margin-bottom: 0.5rem;">✔ Historical returns average: 14-16% p.a.</li>
                        <li>✔ Automated monthly SIP options online</li>
                    </ul>
                </div>
            </div>
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Comparison</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">ELSS vs PPF vs Tax-Saving FDs</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Understand how ELSS schemes perform against traditional tax-saving instruments under Section 80C:</p>
                
                <ul style="padding-left: 1.25rem; color: var(--text-dark); line-height: 1.8;">
                    <li style="margin-bottom: 1rem;"><strong>Equity Linked Savings Scheme (ELSS):</strong> 3-year lock-in period. High equity risk but yields inflation-beating historical average returns of 14-16%.</li>
                    <li style="margin-bottom: 1rem;"><strong>Public Provident Fund (PPF):</strong> 15-year lock-in period. Government-backed safe returns (currently 7.10% tax-free p.a.), carrying zero market volatility.</li>
                    <li style="margin-bottom: 1rem;"><strong>Tax-Saving Fixed Deposits:</strong> 5-year lock-in period. Guaranteed returns set by individual banks, with interest fully taxable under your slab.</li>
                </ul>
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
            <p class="section-subtitle">Find immediate answers regarding ELSS tax saving mutual funds.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What are ELSS mutual funds?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        ELSS (Equity Linked Savings Schemes) are diversified equity mutual funds that invest at least 80% of their total assets in equity and equity-related securities. They are the only mutual funds that qualify for tax deductions of up to ₹1.5 Lakhs under Section 80C.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does the 3-year lock-in apply to monthly SIPs in ELSS?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        The 3-year lock-in period applies to **each individual transaction/installment** separately. For example, a monthly SIP installment deposited on January 1st, 2026 will lock in and become eligible for withdrawal only after January 1st, 2029. Subsequent installments will unlock progressively month-by-month.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How is profit taxed on ELSS redemptions?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Since ELSS units can only be redeemed after a 3-year lock-in, all redemptions automatically trigger Long-Term Capital Gains (LTCG) tax. Under current rules, LTCG is taxed at 12.5% on net capital profits exceeding ₹1.25 Lakhs per financial year.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Start Saving Tax and Growing Wealth Today</h2>
        <p>Compare top-rated ELSS tax-saving mutual funds and set up your monthly SIP online in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Open ELSS SIP</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
