<?php
$page_title = "Check FREE CIBIL Score Online by PAN | Paisa in Minutes";
$page_description = "Check your free CIBIL credit score online instantly using PAN card number without affecting your credit rating.";
$page_keywords = "free cibil score, cibil score check, check credit score, free crif score";
include 'includes/header.php'; 
?>

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
            <span class="section-tag">TransUnion CIBIL</span>
            <h1 class="sec-hero-title">FREE CIBIL Score</h1>
            <p class="sec-hero-desc">Check your official TransUnion CIBIL score for free in minutes. Review key parameters like repayment history, credit mix, and query counts to qualify for instant personal loan approvals.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Your CIBIL Score</button>
        </div>
    </div>
</section>

<!-- FEATURE CARDS -->
<section style="padding-bottom: 4rem;">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="feature-title">Instant Results</h3>
                <p class="feature-desc">Input basic details to pull your official credit score immediately. Zero wait time, 100% digital check.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 class="feature-title">Soft Inquiry Only</h3>
                <p class="feature-desc">This query behaves as a soft pull, meaning it does not penalize your score or appear as a credit query to other banks.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <h3 class="feature-title">Growth Recommendations</h3>
                <p class="feature-desc">Access direct tips on fixing negative factors, paying down credit card balances, and building your score above 750.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Core Factors</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">What Determines Your CIBIL Score?</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">TransUnion CIBIL evaluates your credit history based on five main pillars. Keeping track of these can help you maintain an active CIBIL score of 750 or above.</p>
                
                <ul style="padding-left: 1.25rem; color: var(--text-dark); line-height: 1.8;">
                    <li style="margin-bottom: 1rem;"><strong>Repayment History (35% Weight):</strong> On-time payments of EMIs and credit card bills are crucial. A single late payment can pull down your score.</li>
                    <li style="margin-bottom: 1rem;"><strong>Credit Utilization Ratio (30% Weight):</strong> Limit your credit usage to under 30% of your credit limit. Spending up to your limit signals credit hunger.</li>
                    <li style="margin-bottom: 1rem;"><strong>Credit Age (15% Weight):</strong> Longer credit history indicates better repayment maturity. Keep older credit card accounts open.</li>
                    <li style="margin-bottom: 1rem;"><strong>Credit Mix (10% Weight):</strong> A healthy blend of secured loans (home, auto) and unsecured loans (personal, credit cards) is ideal.</li>
                    <li style="margin-bottom: 1rem;"><strong>Recent Hard Inquiries (10% Weight):</strong> Multiple credit applications in a short window triggers hard inquiries, reducing your score temporarily.</li>
                </ul>
            </div>
            <div class="info-img-wrapper">
                <div class="info-img-card" style="background: linear-gradient(135deg, #1B2A6B 0%, #4A8DFF 100%);">
                    <div class="score-badge">750+</div>
                    <h3>The Golden Standard</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">Over 90% of loan approvals in India are granted to candidates with a CIBIL score greater than 750. Lenders consider them highly reliable, minimizing the risk of defaults.</p>
                    <div class="table-wrapper" style="margin-top: 1.5rem;">
                        <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; color: white;">
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                                <td style="padding: 0.5rem 0;">CIBIL Range</td>
                                <td style="padding: 0.5rem 0; text-align: right; font-weight: 700;">Status</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 0.5rem 0;">750 - 900</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #A7F3D0; font-weight: bold;">Excellent</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 0.5rem 0;">700 - 749</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #FEF08A; font-weight: bold;">Good</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;">Below 700</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #FECACA; font-weight: bold;">Needs Improvement</td>
                            </tr>
                        </table>
                    </div>
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
            <p class="section-subtitle">Check our list of standard questions regarding TransUnion CIBIL score metrics.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is the difference between CIBIL Score and Credit Score?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A credit score is a generic term representing credit health. CIBIL is one of the four credit information companies (bureaus) licensed by the RBI in India. Thus, your score generated by CIBIL is called your CIBIL score.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Why is 750 considered a good CIBIL score?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Lenders evaluate a score of 750 or above as an indicator of low-risk default behavior. With this score, you have an established pattern of on-time loan repayments.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Can I increase my CIBIL score instantly?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        No. Building a credit score is a gradual process requiring regular, disciplined repayments over 3-6 months. Pay off outstanding credit card balances immediately to see a faster bump in your score.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Fulfill Your Dreams with Paisa in Minutes</h2>
        <p>Apply for a personal loan today up to ₹1 Lakh with minimum CIBIL score criteria.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Eligibility Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>

