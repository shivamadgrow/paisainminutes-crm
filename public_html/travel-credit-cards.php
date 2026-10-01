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
            <span class="section-tag">Travel Privileges</span>
            <h1 class="sec-hero-title">Travel Credit Cards</h1>
            <p class="sec-hero-desc">Elevate your journeys. Earn loyalty air miles, redeem points for free airline tickets, and access premium airport lounge privileges across international destinations.</p>
            <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Travel Card</button>
        </div>
    </div>
</section>

<!-- FEATURE CARDS -->
<section style="padding-bottom: 4rem;">
    <div class="container">
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </div>
                <h2 class="feature-title">Air Miles Rewards</h2>
                <p class="feature-desc">Convert credit points directly to airline partner programs (Vistara, Air India, Indigo) to book free flights.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                </div>
                <h2 class="feature-title">Lounge Access</h2>
                <p class="feature-desc">Enjoy complimentary Priority Pass and domestic lounge access programs to relax comfortably during layovers.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h2 class="feature-title">Hotel Vouchers</h2>
                <p class="feature-desc">Unlock luxury hotel vouchers and accelerated loyalty points at Marriott, Taj, and premium hotel networks.</p>
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
                    <div class="score-badge">Free Flights</div>
                    <h3>Milestone Vouchers</h3>
                    <p style="margin-top: 1rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.6;">Travel credit cards are optimized for high-value milestone rewards. Reaching spending thresholds (e.g. ₹2 Lakhs to ₹5 Lakhs a year) frequently unlocks free companion tickets or points worth up to ₹15,000, easily offsetting annual card fees.</p>
                    <ul style="margin-top: 1.5rem; list-style-type: none; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;">✔ Welcome ticket vouchers included</li>
                        <li style="margin-bottom: 0.5rem;">✔ Complimentary lounge entry perks</li>
                        <li>✔ Secure travel insurance protection</li>
                    </ul>
                </div>
            </div>
            <div>
                <span class="section-tag" style="margin-bottom: 1rem;">Frequent Flyer</span>
                <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem;">Maximize Air Miles Accumulation</h2>
                <p class="section-subtitle" style="margin-bottom: 1.5rem;">Co-branded travel credit cards are highly lucrative if you travel at least two to three times a year. Learn how they add value:</p>
                
                <ul style="padding-left: 1.25rem; color: var(--text-dark); line-height: 1.8;">
                    <li style="margin-bottom: 1rem;"><strong>Joining Vouchers:</strong> Standard travel cards offer a complimentary domestic flight ticket or hotel gift voucher upon payment of joining fees, restoring immediate value.</li>
                    <li style="margin-bottom: 1rem;"><strong>Reward conversion ratios:</strong> High-tier rewards cards allow you to transfer points to airlines (such as Club Vistara or Air India) at a 1:1 value ratio, making air travel highly discounted.</li>
                    <li style="margin-bottom: 1rem;"><strong>Priority Airport Services:</strong> Enjoy dedicated customer queues, excess baggage allowances, and fast-track check-in processes on select co-branded airline cards.</li>
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
            <p class="section-subtitle">Find immediate answers regarding travel credit cards and air miles.</p>
        </div>

        <div class="faq-container" style="max-width: 800px; margin: 0 auto;">
            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">What is a travel credit card?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        A travel credit card is a card co-branded with airlines, hotel chains, or travel booking portals. It rewards your purchases with loyalty points, air miles, or travel vouchers that can be redeemed for flight tickets or hotel stays.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">How do I redeem credit card air miles?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Log in to your bank's reward portal, link your airline frequent flyer membership ID (like Club Vistara or Flying Returns), and request a transfer of points. Once converted to air miles, you can book flight tickets directly on the airline's website.
                    </div>
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-header">
                    <h3 class="faq-question">Are co-branded airline cards worth the high annual fee?</h3>
                    <div class="faq-icon-wrapper">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                <div class="faq-body">
                    <div class="faq-content">
                        Yes, provided you travel frequently. If you take at least 2 to 3 flights a year, the value of complimentary tickets (often gifted upon paying joining/annual fees), lounge entries, and checked baggage waivers easily outweighs the annual fee.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section class="cta-banner">
    <div class="container">
        <h2>Upgrade Your Travel Experience Today</h2>
        <p>Apply for premium co-branded travel credit cards online with instant digital processing.</p>
        <button class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);">Apply Now</button>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
