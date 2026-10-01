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
            <span class="section-tag">Improve Your Rating</span>
            <h1 class="sec-hero-title">How to Increase CIBIL Score</h1>
            <p class="sec-hero-desc">Struggling with a low credit score? Explore simple habits, actionable repayment strategies, and direct advice to rebuild your credit rating above 750 safely.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Your Eligibility</button>
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
                <h3 class="feature-title">Smart Habits</h3>
                <p class="feature-desc">Small changes in how you spend and pay back bills can lead to major increases in your long-term score.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="feature-title">Clear Timelines</h3>
                <p class="feature-desc">Credit bureau databases recalculate scores monthly. Learn how long each repair action takes to update.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <h3 class="feature-title">Pitfalls to Avoid</h3>
                <p class="feature-desc">Understand key credit traps like settling loan accounts or closing old credit cards which hurt your rating.</p>
            </div>
        </div>
    </div>
</section>

<!-- MAIN INFO SECTION -->
<section class="info-section section-bg">
    <div class="container">
        <div class="info-grid">
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Actionable Tips</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">6 Steps to Boost CIBIL Fast</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">To recover from a poor score and unlock the best loan offers, implement these credit management practices consistently:</p>
                
                <ol style="padding-left: 1.25rem; color: var(--text-dark); line-height: 1.8;">
                    <li style="margin-bottom: 1rem;"><strong>Automate Bill Payments:</strong> Set up auto-debits for credit cards and EMIs. Repayment history constitutes 35% of your score; keeping it 100% clean is vital.</li>
                    <li style="margin-bottom: 1rem;"><strong>Maintain Credit Utilization Below 30%:</strong> Avoid spending up to your card limits. High balances indicate cash dependency, triggering negative flags.</li>
                    <li style="margin-bottom: 1rem;"><strong>Avoid Closing Old Cards:</strong> Keep unused cards active. Deleting them shrinks your credit history age (15% weight) and lowers your overall limit.</li>
                    <li style="margin-bottom: 1rem;"><strong>Resolve Discrepancies Immediately:</strong> Inspect your credit reports monthly for wrong entries. Disputing data errors can raise scores in 30 days.</li>
                    <li style="margin-bottom: 1rem;"><strong>Space Out Applications:</strong> Avoid requesting multiple loans in a short window. It triggers repeated hard inquiries, pulling down your rating.</li>
                    <li style="margin-bottom: 1rem;"><strong>Keep a Balanced Credit Mix:</strong> A blend of secure assets (car/home loans) and unsecured lines (personal loans/cards) demonstrates diverse repayment skills.</li>
                </ol>
            </div>
            <div class="info-img-wrapper">
                <div class="info-img-card" style="background: linear-gradient(135deg, #1B2A6B 0%, #4A8DFF 100%);">
                    <div class="score-badge">3 - 6 Months</div>
                    <h3>Timeline for Score Recovery</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">There are no short-cuts or hacks to instantly boost credit scores. Bureaus require stable history to rewrite ratings. Consistent on-time payments will typically reflect positive changes in your score within 3 to 6 months.</p>
                    <ul style="margin-top: 1.5rem; list-style-type: none; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;">✔ 30 days: Dispute resolution updates</li>
                        <li style="margin-bottom: 0.5rem;">✔ 90 days: Reduced card balance impacts</li>
                        <li>✔ 180 days: Rebuilt credit history benefits</li>
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
            <p class="section-subtitle">Find immediate answers regarding credit score improvement strategies.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Can I pay a agency to instantly increase my CIBIL score?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        No. Beware of fraudulent agencies promising instant score hikes. Only credit bureaus (like TransUnion CIBIL) calculate scores based on financial data reported directly by banks. The only way to increase it is through disciplined financial behavior.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Does closing my credit card account increase my score?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Actually, no. Closing an old card decreases your total available credit limit (which increases your credit utilization ratio) and shortens your average credit history length. It is usually wiser to keep old cards open but utilize them minimally.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How does a "Settled" status affect my CIBIL rating?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A "Settled" status means the bank agreed to accept a lower repayment than the actual dues to close a defaulting account. While this stops legal actions, it leaves a negative remark on your CIBIL profile for 7 years, significantly hindering future loan applications. It is always better to pay off dues in full.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Ready to Explore Better Loan Options?</h2>
        <p>Check your pre-approved loans up to ₹1 Lakh with minimum paperwork and secure disbursals.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Check Eligibility Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>

