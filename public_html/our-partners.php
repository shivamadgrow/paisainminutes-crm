<?php
/**
 * Our Lending Partners Page
 * Regulatory compliance, Onboarded Partners showcase & LSP disclosure under RBI Digital Lending Framework
 */

$page_title = "Lending Partners | Paisa in Minutes";
$page_description = "Explore RBI-regulated lending partners connected with Paisa in Minutes. Learn about our Lending Service Provider (LSP) model and regulatory disclosures.";
$page_keywords = "lending partners, nbfc partners, loan facilitation lsp, rbi digital lending guidelines, paisa in minutes partners, jhatpat loans, borrowera, insta rupees, shubh cash, ticket 2 loan, easy fincare, loan within, rupay91, udhaar now";

include 'includes/header.php';

// List of Onboarded Partners
$onboardedPartners = [
    [
        'name' => 'Jhatpat Loans',
        'slug' => 'jhatpatloans',
        'logo' => '/assets/jhatpatloans.png',
        'badge' => 'Instant Fast Approval',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 0.8% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.jhatpatloans.com/terms-and-conditions.aspx',
        'features' => [
            'Hassle-Free Easy Process',
            'Direct Bank Disbursal in 2 Mins',
            '100% Digital & Paperless'
        ]
    ],
    [
        'name' => 'Borrowera',
        'slug' => 'borrowera',
        'logo' => '/assets/borrowera.png',
        'badge' => 'Fast Track Disbursal',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.borrowera.com/terms-and-conditions',
        'features' => [
            '100% Paperless Application',
            'Speedy Digital Verification',
            'Direct Account Credit in Minutes'
        ]
    ],
    [
        'name' => 'Insta Rupees',
        'slug' => 'instarupees',
        'logo' => '/assets/instarupees.png',
        'badge' => 'Instant Cash Online',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.8',
        'terms_url' => 'https://www.instarupees.com/terms-and-conditions',
        'features' => [
            'Paperless Instant Sanction',
            'High Eligibility Match Rate',
            'Zero Preclosure Hidden Fees'
        ]
    ],
    [
        'name' => 'Shubh Cash',
        'slug' => 'shubhcash',
        'logo' => '/assets/shubhcash.png',
        'badge' => 'Quick Disbursal Partner',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.shubhcash.com/terms-and-conditions',
        'features' => [
            '100% Online Application',
            'Same Day Direct Bank Credit',
            'Zero Prepayment Penalty'
        ]
    ],
    [
        'name' => 'Ticket 2 Loan',
        'slug' => 'ticket2loan',
        'logo' => '/assets/ticket2loan.png',
        'badge' => 'Smart & Simple',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.ticket2loan.com/terms-and-conditions.aspx',
        'features' => [
            'Smart, Simple & Secure Process',
            'Direct Bank Credit in Minutes',
            '100% Paperless with Minimal KYC'
        ]
    ],
    [
        'name' => 'Easy Fincare',
        'slug' => 'easyfincare',
        'logo' => '/assets/easyfincare.png',
        'badge' => 'Simplifying Finance',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.8',
        'terms_url' => 'https://www.easyfincare.com/terms-and-conditions',
        'features' => [
            'Minimal Documentation Required',
            'Fast Loan Approval Process',
            'Zero Prepayment Hidden Charges'
        ]
    ],
    [
        'name' => 'Loan Within',
        'slug' => 'loanwithin',
        'logo' => '/assets/loanwithin.png',
        'badge' => 'Verified Lending Partner',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.loanwithin.com/terms-and-conditions',
        'features' => [
            'Paperless Fast Track Disbursal',
            'Zero Collateral Required',
            '100% Data Encrypted & Safe'
        ]
    ],
    [
        'name' => 'Rupay91',
        'slug' => 'rupay91',
        'logo' => '/assets/rupay91.png',
        'badge' => 'Exclusive Partner',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.9',
        'terms_url' => 'https://www.rupay91.com/terms-conditions.php',
        'features' => [
            '100% Instant Online Approval',
            'Direct Bank Account Disbursal',
            'Zero Physical Paperwork'
        ]
    ],
    [
        'name' => 'Udhaar Now',
        'slug' => 'udhaarnow',
        'logo' => '/assets/udhaarnow.png',
        'badge' => 'Flexible Credit Line',
        'max_amount' => '₹1,00,000',
        'interest_rate' => 'Up to 1% per day',
        'tenure' => '30 - 45 Days',
        'disbursal' => 'Direct Bank Credit',
        'rating' => '4.8',
        'terms_url' => 'https://www.udhaarnow.com/terms-and-conditions.aspx',
        'features' => [
            'Instant Pre-Matched Limit',
            'Minimal KYC Verification',
            '24/7 Digital Application Processing'
        ]
    ]
];
?>

<!-- Page Specific CSS -->
<style>
.partner-hero {
    background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%);
    padding: 9rem 1.25rem 4rem 1.25rem;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
    text-align: center;
}
@media (max-width: 768px) {
    .partner-hero {
        padding: 7.75rem 1rem 3rem 1rem;
    }
}
.partner-hero::before {
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
.partner-badge {
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
.partner-hero h1 {
    color: #FFFFFF !important;
    font-size: clamp(2rem, 4vw, 3rem);
    font-family: var(--font-heading);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}
.partner-hero p {
    font-size: 1.1rem;
    color: #E2E8F0 !important;
    max-width: 780px;
    margin: 0 auto;
    line-height: 1.7;
    font-weight: 400;
}

.partner-sec {
    padding: 3.5rem 0 5rem 0;
    background-color: #F8FAFC;
}

.lsp-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 2.5rem;
    box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.05);
    margin-bottom: 3.5rem;
    border-left: 5px solid #2563EB;
}
.lsp-card h2 {
    font-size: 1.75rem;
    color: #1B2A6B;
    font-family: var(--font-heading);
    font-weight: 800;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.lsp-card h2 svg {
    color: #2563EB;
    flex-shrink: 0;
}
.lsp-card p {
    color: #475569;
    font-size: 1.02rem;
    line-height: 1.75;
    margin-bottom: 1rem;
}
.lsp-card p:last-child {
    margin-bottom: 0;
}

/* Onboarded Partners Section */
.onboarded-header {
    text-align: center;
    max-width: 820px;
    margin: 0 auto 2.75rem auto;
}
.onboarded-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1D4ED8;
    padding: 0.35rem 1rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.85rem;
}
.onboarded-header h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.4rem);
    font-family: var(--font-heading);
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 0.75rem;
    letter-spacing: -0.015em;
}
.onboarded-header p {
    color: #64748B;
    font-size: 1.05rem;
    line-height: 1.65;
}

.onboarded-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.65rem;
    margin-bottom: 4rem;
}

@media (max-width: 1080px) {
    .onboarded-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.4rem;
    }
}

@media (max-width: 680px) {
    .onboarded-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }
}

/* Individual Partner Card */
.partner-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    position: relative;
    overflow: hidden;
}

.partner-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px -6px rgba(15, 23, 42, 0.1);
    border-color: #93C5FD;
}

.partner-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #F1F5F9;
}

.partner-card-logo-box {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.partner-card-logo-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}

.partner-card-title-group {
    flex-grow: 1;
}

.partner-card-name {
    font-size: 1.22rem;
    font-weight: 800;
    color: #0F172A;
    font-family: var(--font-heading);
    margin: 0 0 0.3rem 0;
    line-height: 1.3;
}

.partner-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #047857;
    background: #ECFDF5;
    border: 1px solid #A7F3D0;
    padding: 0.2rem 0.65rem;
    border-radius: 50px;
}

/* Key Metrics Box */
.partner-metrics-box {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 0.95rem 1rem;
    margin-bottom: 1.25rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
}

.partner-metrics-box > div {
    min-width: 0;
}

.metric-item-label {
    font-size: 0.75rem;
    color: #64748B;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.03em;
    margin-bottom: 0.2rem;
}

.metric-item-value {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0F172A;
    font-family: var(--font-heading);
    min-width: 0;
    overflow-wrap: break-word;
    word-break: normal;
}

.metric-item-rate {
    color: #16A34A !important;
}

/* Features List */
.partner-features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.partner-features-list li {
    font-size: 0.88rem;
    color: #475569;
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    line-height: 1.45;
}

.partner-features-list li svg {
    color: #10B981;
    flex-shrink: 0;
    margin-top: 2px;
}

/* Card Actions */
.partner-card-actions {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding-top: 1.1rem;
    border-top: 1px solid #F1F5F9;
}

.btn-partner-apply {
    background: #1B2A6B;
    color: #FFFFFF !important;
    font-weight: 700;
    font-size: 0.92rem;
    padding: 0.7rem 1.25rem;
    border-radius: 10px;
    text-decoration: none;
    flex: 1;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(27, 42, 107, 0.2);
}

.btn-partner-apply:hover {
    background: #2563EB;
    color: #FFFFFF !important;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
}

.partner-terms-anchor {
    color: #2563EB;
    font-size: 0.84rem;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
    padding: 0.6rem 0.4rem;
    transition: color 0.18s ease;
}

.partner-terms-anchor:hover {
    color: #1D4ED8;
    text-decoration: underline;
}

.partner-terms-anchor svg {
    transition: transform 0.18s ease;
}

.partner-terms-anchor:hover svg {
    transform: translate(2px, -2px);
}

/* Grievance Redressal Panel */
.grievance-panel {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 16px;
    padding: 2.5rem;
    margin-top: 1.5rem;
}
.grievance-panel h3 {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1E40AF;
    font-family: var(--font-heading);
    margin-bottom: 0.85rem;
}
.grievance-panel p {
    color: #334155;
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
}
</style>

<!-- HERO SECTION -->
<section class="partner-hero">
    <div class="container">
        <div class="partner-badge">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Lending Service Provider (LSP) Disclosure
        </div>
        <h1>Our Lending Partners &amp; Compliance</h1>
        <p>In accordance with the Reserve Bank of India’s Digital Lending Guidelines, <a href="/" style="color: #93C5FD; text-decoration: underline;">Paisa in Minutes</a> operates strictly as an authorized digital technology facilitator connecting prospective borrowers with regulated financial partners.</p>
    </div>
</section>

<!-- MAIN CONTENT SECTION -->
<section class="partner-sec">
    <div class="container">
        
        <!-- LSP DETAILS -->
        <div class="lsp-card">
            <h2>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
                Lending Service Provider (LSP) Framework
            </h2>
            <p><strong>Paisa in Minutes</strong> (operated by <strong>AdGrow Media Services</strong>) functions as an online technology intermediary and digital lead generator. We provide borrower sourcing, initial qualification screening, and technological application routing for regulated commercial banks and Reserve Bank of India (RBI) registered Non-Banking Financial Companies (NBFCs).</p>
            <p>All loan sanctions, credit risk underwriting, interest rate determinations, and disbursals are executed directly by the respective partner institutions into the borrower’s verified bank account. Paisa in Minutes does not handle loan capital directly, does not pool funds, and does not charge any upfront loan guarantee fees.</p>
        </div>

        <!-- ONBOARDED PARTNERS SECTION -->
        <div class="onboarded-header">
            <div class="onboarded-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Regulated Digital Lending
            </div>
            <h2>Our Onboarded Lending Partners</h2>
            <p>We work with trusted, licensed financial partners to bring you 100% paperless personal loans with lightning-fast approval and direct bank transfers.</p>
        </div>

        <!-- 9 ONBOARDED PARTNERS GRID -->
        <div class="onboarded-grid">
            <?php foreach ($onboardedPartners as $partner): ?>
                <div class="partner-card">
                    <div>
                        <!-- Header: Logo & Company Name -->
                        <div class="partner-card-header">
                            <div class="partner-card-logo-box">
                                <img src="<?php echo htmlspecialchars($partner['logo']); ?>" 
                                     alt="<?php echo htmlspecialchars($partner['name']); ?> Logo" 
                                     loading="lazy"
                                     onerror="this.style.display='none'; this.parentElement.innerHTML='<b style=\'color:#1B2A6B; font-size:1.15rem;\'><?php echo strtoupper(substr($partner['name'], 0, 1)); ?></b>';">
                            </div>
                            <div class="partner-card-title-group">
                                <h3 class="partner-card-name"><?php echo htmlspecialchars($partner['name']); ?></h3>
                                <span class="partner-card-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <?php echo htmlspecialchars($partner['badge']); ?>
                                </span>
                            </div>
                        </div>

                        <!-- Key Loan Specifications -->
                        <div class="partner-metrics-box">
                            <div>
                                <div class="metric-item-label">Max Loan</div>
                                <div class="metric-item-value"><?php echo htmlspecialchars($partner['max_amount']); ?></div>
                            </div>
                            <div>
                                <div class="metric-item-label">Interest Rate</div>
                                <div class="metric-item-value metric-item-rate"><?php echo htmlspecialchars($partner['interest_rate']); ?></div>
                            </div>
                            <div>
                                <div class="metric-item-label">Tenure</div>
                                <div class="metric-item-value"><?php echo htmlspecialchars($partner['tenure']); ?></div>
                            </div>
                            <div>
                                <div class="metric-item-label">Disbursal</div>
                                <div class="metric-item-value" style="font-size: 0.95rem; color: #1E40AF;"><?php echo htmlspecialchars($partner['disbursal']); ?></div>
                            </div>
                        </div>

                        <!-- Key Features Checklist -->
                        <ul class="partner-features-list">
                            <?php foreach ($partner['features'] as $feature): ?>
                                <li>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span><?php echo htmlspecialchars($feature); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <!-- Actions: Apply Now & Official T&C -->
                    <div class="partner-card-actions">
                        <a href="/apply-now" class="btn-partner-apply">Apply Now</a>
                        <a href="/partner-terms" class="partner-terms-anchor" title="View Partner Terms &amp; Conditions">
                            <span>T&amp;C Details</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- GRIEVANCE REDRESSAL -->
        <div class="grievance-panel">
            <h3>Customer Care &amp; Grievance Redressal Mechanism</h3>
            <p>Borrowers with queries regarding partner disclosures, loan applications, or digital KYC may reach our dedicated compliance officer. In accordance with RBI Fair Practices guidelines, all borrower grievances receive an initial response within 48 business hours.</p>
            <div style="display: flex; gap: 2rem; flex-wrap: wrap; font-size: 0.95rem; color: #1E3A8A; font-weight: 600;">
                <div>📧 Compliance Email: <a href="mailto:info@paisainminutes.com" style="color: #1E40AF; text-decoration: underline;">info@paisainminutes.com</a></div>
                <div>📞 Grievance Phone: <a href="tel:+919990666578" style="color: #1E40AF; text-decoration: underline;">+91 9990 666578</a></div>
                <div>🏢 Corporate Office: Delhi, India</div>
            </div>
        </div>

    </div>
</section>

<!-- CTA -->
<section style="background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%); color: #FFFFFF; padding: 4.5rem 0; text-align: center;">
    <div class="container">
        <h2 style="color: #FFFFFF; font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem;">Ready to Compare Regulated Loan Offers?</h2>
        <p style="color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 2rem auto; font-size: 1.05rem;">Check your loan eligibility across partner banks and NBFCs in under 60 seconds with zero paperwork.</p>
        <a href="/apply-now" class="btn btn-primary" style="background: #FFFFFF; color: #1B2A6B; font-weight: 700; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; text-decoration: none; display: inline-block;">
            Apply Now
        </a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
