<?php
/**
 * About Us Page
 * E-E-A-T compliant corporate background, operational entity details, and regulatory disclosures
 */

$page_title = "About Paisa in Minutes | Digital Loan Facilitation Platform";
$page_description = "Learn about Paisa in Minutes, operated by AdGrow Media Services in Delhi, India. Explore our digital loan facilitation marketplace, LSP model, and RBI-regulated lending partners.";
$page_keywords = "about paisa in minutes, adgrow media services, digital loan facilitation, lsp platform india, personal loans delhi";

include 'includes/header.php';
?>

<!-- Page Specific CSS -->
<style>
.about-hero {
    background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%);
    padding: 7.5rem 0 5rem 0;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
    text-align: center;
}
.about-hero::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -15%;
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, rgba(74, 141, 255, 0.2) 0%, rgba(27, 42, 107, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
}
.about-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(74, 141, 255, 0.18);
    border: 1px solid rgba(147, 197, 253, 0.4);
    color: #BFDBFE;
    padding: 0.45rem 1.25rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.about-hero h1 {
    color: #FFFFFF !important;
    font-size: 3.25rem;
    font-family: var(--font-heading);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}
.about-hero p {
    font-size: 1.15rem;
    color: #E2E8F0 !important;
    max-width: 780px;
    margin: 0 auto 2rem auto;
    line-height: 1.75;
    font-weight: 400;
}

.about-section {
    padding: 5rem 0;
}
.about-section-alt {
    background-color: #F8FAFC;
}

.about-grid-2 {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3.5rem;
    align-items: center;
}
@media (max-width: 900px) {
    .about-grid-2 {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }
}

.about-text-block h2 {
    font-size: 2.2rem;
    color: #0F172A;
    font-family: var(--font-heading);
    font-weight: 800;
    margin-bottom: 1.25rem;
    line-height: 1.3;
}
.about-text-block p {
    color: #475569;
    font-size: 1.05rem;
    line-height: 1.75;
    margin-bottom: 1.25rem;
}

.entity-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);
}
.entity-card-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1B2A6B;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #EBF3FF;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.entity-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.entity-item {
    display: flex;
    justify-content: space-between;
    padding: 0.85rem 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 0.95rem;
}
.entity-item:last-child {
    border-bottom: none;
}
.entity-label {
    color: #64748B;
    font-weight: 500;
}
.entity-val {
    color: #0F172A;
    font-weight: 700;
    text-align: right;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}
.value-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
    transition: transform 0.3s ease;
}
.value-card:hover {
    transform: translateY(-4px);
    border-color: #93C5FD;
}
.value-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: #EBF3FF;
    color: #1B2A6B;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
}
.value-icon-box svg {
    width: 26px;
    height: 26px;
}
.value-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 0.5rem;
}
.value-desc {
    color: #64748B;
    font-size: 0.95rem;
    line-height: 1.6;
}

.compliance-box {
    background: #F8FAFC;
    border: 1px solid #CBD5E1;
    border-left: 4px solid #1B2A6B;
    border-radius: 12px;
    padding: 2rem;
    margin-top: 3rem;
}
.compliance-box h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 0.75rem;
}
.compliance-box p {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
}
</style>

<!-- HERO SECTION -->
<section class="about-hero">
    <div class="container">
        <div class="about-badge">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Transparent Digital Loan Facilitation
        </div>
        <h1>About Paisa in Minutes</h1>
        <p>Democratizing access to credit for everyday Indians by connecting eligible borrowers with licensed, RBI-registered lending institutions through seamless digital innovation.</p>
    </div>
</section>

<!-- WHO WE ARE SECTION -->
<section class="about-section">
    <div class="container">
        <div class="about-grid-2">
            <div class="about-text-block">
                <h2>Our Mission & Purpose</h2>
                <p><strong><a href="/" title="Paisa in Minutes">Paisa in Minutes</a></strong> is an official digital loan facilitation platform owned and operated by <strong>AdGrow Media Services</strong>, based in Delhi, India. Our mission is to eliminate bureaucratic hurdles, opaque terms, and predatory charges in retail borrowing by providing a 100% paperless, transparent financial discovery experience.</p>
                <p>Acting as an authorized Lending Service Provider (LSP) and digital facilitator, we bridge the gap between borrowers requiring quick financial support and regulated Non-Banking Financial Companies (NBFCs) and commercial banks licensed by the Reserve Bank of India.</p>
                <p>Whether you need an instant personal loan for emergency expenses, medical needs, or travel, our proprietary match engine evaluates your profile against multiple partner criteria to present competitive personal loan offers up to ₹1,00,000 within minutes.</p>
            </div>

            <div class="entity-card">
                <div class="entity-card-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    Corporate Information
                </div>
                <ul class="entity-list">
                    <li class="entity-item">
                        <span class="entity-label">Operating Entity</span>
                        <span class="entity-val">AdGrow Media Services</span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Platform Brand</span>
                        <span class="entity-val">Paisa in Minutes</span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Business Model</span>
                        <span class="entity-val">Lending Service Provider (LSP)</span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Corporate Office</span>
                        <span class="entity-val">Delhi, India</span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Support Email</span>
                        <span class="entity-val"><a href="mailto:info@paisainminutes.com">info@paisainminutes.com</a></span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Customer Care</span>
                        <span class="entity-val"><a href="tel:+919990666578">+91 9990 666578</a></span>
                    </li>
                    <li class="entity-item">
                        <span class="entity-label">Regulatory Alignment</span>
                        <span class="entity-val">RBI Fair Practices Code Compliant</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- CORE PRINCIPLES -->
<section class="about-section about-section-alt">
    <div class="container">
        <div style="text-align: center; max-width: 750px; margin: 0 auto;">
            <span style="display: inline-block; background: #EBF3FF; color: #1B2A6B; font-weight: 700; font-size: 0.85rem; padding: 0.35rem 1rem; border-radius: 50px; text-transform: uppercase; margin-bottom: 0.75rem;">Our Core Principles</span>
            <h2 style="font-size: 2.25rem; font-family: var(--font-heading); font-weight: 800; color: #0F172A; margin-bottom: 1rem;">How We Operate & Protect Borrowers</h2>
            <p style="color: #64748B; font-size: 1.05rem;">We hold ourselves to the highest standards of integrity, data privacy, and ethical lending practices.</p>
        </div>

        <div class="values-grid">
            <div class="value-card">
                <div class="value-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 class="value-title">100% Regulated Partners</h3>
                <p class="value-desc">We never partner with unregistered apps or unregulated entities. All loan offers originate strictly from RBI-registered NBFCs and scheduled commercial banks.</p>
            </div>

            <div class="value-card">
                <div class="value-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 class="value-title">Bank-Grade Data Privacy</h3>
                <p class="value-desc">Your personal and financial records are protected with 256-bit SSL encryption. We do not sell borrower databases to third-party telemarketers.</p>
            </div>

            <div class="value-card">
                <div class="value-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="value-title">Zero Upfront Fees</h3>
                <p class="value-desc">Paisa in Minutes never asks borrowers to transfer advance processing deposits or approval fees to personal accounts. Processing charges are deducted directly by lenders upon loan disbursal.</p>
            </div>

            <div class="value-card">
                <div class="value-icon-box">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 class="value-title">Grievance Redressal</h3>
                <p class="value-desc">We provide direct escalation channels and dedicated grievance support to resolve user queries regarding eligibility, sanction letters, and loan status.</p>
            </div>
        </div>

        <div class="compliance-box">
            <h3>Regulatory Disclaimer & Fair Practices Alignment</h3>
            <p><strong>Paisa in Minutes</strong> is a loan facilitation marketplace and does not operate as a direct lender or depository institution. All loan decisions, underwriting approvals, interest rates, and disbursal timelines are determined solely at the discretion of respective RBI-registered lending partners in accordance with their internal credit policies and the Reserve Bank of India’s Digital Lending Guidelines.</p>
        </div>
    </div>
</section>

<!-- CTA SECTION -->
<section style="background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%); color: #FFFFFF; padding: 4.5rem 0; text-align: center;">
    <div class="container">
        <h2 style="color: #FFFFFF; font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem;">Looking for Transparent Loan Offers?</h2>
        <p style="color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 2rem auto; font-size: 1.05rem;">Check your loan eligibility across partner banks and NBFCs in under 60 seconds with zero impact on your CIBIL score.</p>
        <a href="/check-eligibility" class="btn btn-primary" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; text-decoration: none; display: inline-block;">
            Check Loan Eligibility
        </a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
