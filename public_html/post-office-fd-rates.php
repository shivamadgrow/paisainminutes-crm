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
.po-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}
.po-table th, .po-table td {
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}
.po-table th {
    background-color: var(--light-gray);
    color: var(--primary-color);
    font-weight: 700;
}
.po-badge {
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
            <span class="section-tag">India Post Savings</span>
            <h1 class="sec-hero-title">Post Office Fixed Deposit Rates</h1>
            <p class="sec-hero-desc">Enjoy absolute capital security. Discover the latest India Post Time Deposit rates compounding quarterly with full sovereign protection.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Browse Post Office Rates</button>
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
                <h2 class="feature-title">Sovereign Guarantee</h2>
                <p class="feature-desc">Backed by the Ministry of Communications, ensuring absolute safety for your hard-earned funds.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h2 class="feature-title">Tax Saving Benefits</h2>
                <p class="feature-desc">Save taxes up to ₹1.5 Lakhs under Section 80C by investing in the 5-Year Time Deposit variant.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h2 class="feature-title">Quarterly Compounding</h2>
                <p class="feature-desc">Interest is calculated and compounded quarterly but paid out annually to maximize final maturity returns.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Interest Rates Chart</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">Post Office Time Deposit rates</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Review current rates set by the Ministry of Finance for POTD accounts:</p>
                
                <div class="table-wrapper">
                    <table class="po-table">
                        <thead>
                            <tr>
                                <th>Deposit Tenure</th>
                                <th>Interest Rate (Compounded Quarterly)</th>
                                <th>Section 80C Exemption</th>
                                <th>Minimum Deposit Limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1 Year Time Deposit (POTD)</td>
                                <td><span class="po-badge">6.90% p.a.</span></td>
                                <td>Not Available</td>
                                <td>₹1,000 (No maximum limit)</td>
                            </tr>
                            <tr>
                                <td>2 Year Time Deposit (POTD)</td>
                                <td><span class="po-badge">7.00% p.a.</span></td>
                                <td>Not Available</td>
                                <td>₹1,000 (No maximum limit)</td>
                            </tr>
                            <tr>
                                <td>3 Year Time Deposit (POTD)</td>
                                <td><span class="po-badge">7.10% p.a.</span></td>
                                <td>Not Available</td>
                                <td>₹1,000 (No maximum limit)</td>
                            </tr>
                            <tr>
                                <td>5 Year Time Deposit (POTD)</td>
                                <td><span class="po-badge">7.50% p.a.</span></td>
                                <td>Eligible for 80C deductions</td>
                                <td>₹1,000 (No maximum limit)</td>
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
            <p class="section-subtitle">Find immediate answers regarding Post Office Fixed Deposits.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is a Post Office Time Deposit (POTD)?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A Post Office Time Deposit (POTD) is a secure fixed savings scheme managed directly by India Post. It functions exactly like a bank Fixed Deposit, allowing investors to lock in cash for 1, 2, 3, or 5 years at a fixed interest rate.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Are Post Office Fixed Deposits safer than commercial bank FDs?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes. Bank deposits are insured only up to ₹5 Lakhs by the DICGC. Post Office savings schemes carry a sovereign guarantee from the Government of India, meaning there is zero credit default risk on any amount of capital deposited.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Is interest earned on Post Office FDs tax-free?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        No. The interest earned on Post Office Time Deposits is fully taxable according to your applicable personal income tax slabs. However, there is zero TDS deducted by the Post Office on interest payouts.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Start Your Safe Savings Today</h2>
        <p>Apply for Post Office Time Deposits and enjoy the security of sovereign returns online.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Post Office Rates</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
