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
            <span class="section-tag">Experian India</span>
            <h1 class="sec-hero-title">FREE Experian Score</h1>
            <p class="sec-hero-desc">Check your Experian credit score for free. Experian is globally recognized and highly trusted by private banks and financial companies across India to verify credit reports instantly.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Experian Score Now</button>
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
                <h3 class="feature-title">Soft Inquiry</h3>
                <p class="feature-desc">Checking your score with Experian through our portal will not trigger a hard pull. Your rating remains 100% unaffected.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </div>
                <h3 class="feature-title">Full Summary</h3>
                <p class="feature-desc">Get a detailed breakdown of credit cards, auto loans, personal loans, active loan accounts, and negative entries.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <h3 class="feature-title">Monthly Alerts</h3>
                <p class="feature-desc">Opt-in to get free monthly reminders and notifications whenever your Experian rating updates or changes.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div class="info-img-wrapper">
                <div class="info-img-card" style="background: linear-gradient(135deg, #4A8DFF 0%, #111942 100%);">
                    <div class="score-badge">800+</div>
                    <h3>Experian Excellent Standard</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">Experian scores typically range from 300 to 900. Lenders view an Experian score of 700+ as good, and 800+ as exceptional, matching premium loan categories.</p>
                    <div class="table-wrapper" style="margin-top: 1.5rem;">
                        <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse; color: white;">
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
                                <td style="padding: 0.5rem 0;">Experian Range</td>
                                <td style="padding: 0.5rem 0; text-align: right; font-weight: 700;">Classification</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 0.5rem 0;">800 - 900</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #A7F3D0; font-weight: bold;">Excellent</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <td style="padding: 0.5rem 0;">700 - 799</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #FEF08A; font-weight: bold;">Good</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.5rem 0;">Below 700</td>
                                <td style="padding: 0.5rem 0; text-align: right; color: #FECACA; font-weight: bold;">Needs Focus</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Comparison Guide</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">Experian Score vs. CIBIL Score</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">While both credit bureaus are licensed by the Reserve Bank of India (RBI) and use details like past repayments to determine credit history, they differ on proprietary parameters:</p>
                
                <ul style="padding-left: 1.25rem; color: var(--text-dark); line-height: 1.8;">
                    <li style="margin-bottom: 1rem;"><strong>Bureau System:</strong> CIBIL (TransUnion) is the oldest bureau in India, whereas Experian is globally recognized and widely integrated into fintech apps.</li>
                    <li style="margin-bottom: 1rem;"><strong>Scoring Models:</strong> Each company uses slightly different mathematical algorithms to weight recent inquiries and credit history. Hence, your scores from CIBIL and Experian may vary by 10-50 points.</li>
                    <li style="margin-bottom: 1rem;"><strong>Turnaround Time:</strong> Experian is highly responsive in processing digital dispute updates and credit information corrections online.</li>
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
            <p class="section-subtitle">Find immediate answers regarding Experian credit reports and score details.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Why is my Experian score different from CIBIL?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        This difference is completely normal. Experian and TransUnion CIBIL are two independent credit bureaus. They employ different formulas, update reports on different schedules, and weigh parameters (like recent enquiries) differently.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Do banks check Experian scores for personal loans?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes, many commercial banks, NBFCs, and digital lending platforms in India check Experian credit scores and histories to assess eligibility for loans and credit card limits.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How can I clear wrong entries in my Experian report?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        You can raise a dispute directly on Experian India's online dispute resolution portal. Provide details of the incorrect account or entry, and Experian will verify it with the lender within 30 days.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Unlock Instant Loans Up to ₹1 Lakh</h2>
        <p>Whether you have a CIBIL or Experian score, our lending partners offer the best rates in minutes.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Eligibility Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>

