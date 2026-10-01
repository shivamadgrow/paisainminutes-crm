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

.table-wrapper {
    margin-top: 2rem;
    overflow-x: auto;
}
.score-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}
.score-table th, .score-table td {
    padding: 0.85rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}
.score-table th {
    background-color: var(--light-gray);
    color: var(--primary-color);
    font-weight: 700;
}
.score-badge-status {
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
}
.status-excellent { background: #DCFCE7; color: #15803D; }
.status-good { background: #FEF9C3; color: #854D0E; }
.status-fair { background: #FFEDD5; color: #C2410C; }
.status-poor { background: #FEE2E2; color: #B91C1C; }

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
            <span class="section-tag">Top Card Choices</span>
            <h1 class="sec-hero-title">Best Credit Cards in India</h1>
            <p class="sec-hero-desc">Discover the top credit cards in India. Find the perfect card suited for your lifestyle, whether you prioritize cashback, travel reward miles, or zero annual fees.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Cards Eligibility</button>
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
                <h3 class="feature-title">Maximized Rewards</h3>
                <p class="feature-desc">Earn points worth up to 5-10% of transaction values on shopping, dining, online portals, and utility bills.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 class="feature-title">Lounge Access</h3>
                <p class="feature-desc">Enjoy complimentary luxury domestic and international airport lounge entries on co-branded travel cards.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 class="feature-title">No Annual Fees</h3>
                <p class="feature-desc">Apply for lifetime-free credit cards that charge zero onboarding or recurring fee, while retaining rewards.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Curated Picks</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">India's Top Credit Cards</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Review the leading credit cards in India based on annual savings, reward rates, and premium user benefits:</p>
                
                <div class="table-wrapper">
                    <table class="score-table">
                        <thead>
                            <tr>
                                <th>Credit Card</th>
                                <th>Utility Focus</th>
                                <th>Primary Benefit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>SBI CashBack Card</td>
                                <td><span class="score-badge-status status-excellent">Cashback</span></td>
                                <td>5% cashback on online spends</td>
                            </tr>
                            <tr>
                                <td>Amazon Pay ICICI Card</td>
                                <td><span class="score-badge-status status-good">Shopping</span></td>
                                <td>5% reward points for Prime members, Lifetime Free</td>
                            </tr>
                            <tr>
                                <td>HDFC Millennia Card</td>
                                <td><span class="score-badge-status status-fair">All-rounder</span></td>
                                <td>5% cashback on partner sites, Lounge entries</td>
                            </tr>
                            <tr>
                                <td>Axis Bank Atlas Card</td>
                                <td><span class="score-badge-status status-excellent">Travel</span></td>
                                <td>Accelerated miles, premium airport benefits</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="info-img-wrapper">
                <div class="info-img-card" style="background: linear-gradient(135deg, #4A8DFF 0%, #1B2A6B 100%);">
                    <div class="score-badge">750+ CIBIL</div>
                    <h3>Qualify for Premium Cards</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">Lenders verify credit rating to issue premium cards. Maintaining a CIBIL score above 750 improves chances of secured card limits up to ₹5 Lakhs, low interest APRs, and waived annual card fees.</p>
                    <ul style="margin-top: 1.5rem; list-style-type: none; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;">✔ Quick e-approvals</li>
                        <li style="margin-bottom: 0.5rem;">✔ Higher pre-approved limits</li>
                        <li>✔ Access to premium lifestyle rewards</li>
                    </ul>
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
            <p class="section-subtitle">Read standard queries concerning the top credit cards in India.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Which is the best credit card for cashback?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        The SBI CashBack Card is currently considered one of the best cashback cards. It offers a flat 5% cashback on almost all online transactions without merchant restrictions, capped at ₹5,000 per billing month.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is a lifetime-free credit card?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A lifetime-free (LTF) credit card is a card that has no joining fees when you sign up, and no annual renewal fees for life. Top examples in India include the Amazon Pay ICICI Credit Card and HSBC Unique Card.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How many credit cards should I ideally have?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        There is no perfect number, but holding 2 to 3 credit cards allows you to maximize rewards across different spending categories (e.g., one card for travel, one for online shopping, one for utility bills). Make sure you pay all statements in full and track payments diligently.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Apply for Your Ideal Credit Card Today</h2>
        <p>Get pre-approved card eligibility checking online in less than 2 minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>

