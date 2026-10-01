<?php
/**
 * Partner Terms & Conditions Page
 * Compliance and regulatory consent disclosures for all partnered lending institutions
 */

$page_title = "Partner Terms & Conditions | Paisa in Minutes";
$page_description = "Review terms, conditions, and consent disclosures for each of our partnered RBI-registered NBFCs and lending institutions at Paisa in Minutes.";
$page_keywords = "partner terms and conditions, lender t&c, nbfc consent, digital lending terms, paisa in minutes partners";

include 'includes/header.php';

// Partner configurations with official URLs & regulatory consent copy
$partnerTerms = [
    [
        'name' => 'Jhatpat Loans',
        'logo' => '/assets/jhatpatloans.png',
        'url' => 'https://www.jhatpatloans.com/terms-and-conditions.aspx',
        'consent' => 'I hereby give my explicit consent to Jhatpat Loans and its partner lending institutions to collect, store, and verify my credit report from Credit Information Bureaus (CIBIL/Experian/Equifax/CRIF) and KYC details for assessing my loan eligibility, underwriting, and processing my loan application. I also consent to receive status notifications, transactional updates, and promotional communications via SMS, WhatsApp, Email, and Phone calls.'
    ],
    [
        'name' => 'Insta Rupees',
        'logo' => '/assets/instarupees.png',
        'url' => 'https://www.instarupees.com/terms-and-conditions',
        'consent' => 'By continuing, I agree to CIBIL Terms and Conditions and authorize Insta Rupees and its associated lending partners to fetch and verify my KYC documents, PAN, employment details, and credit bureau records. I agree to Insta Rupees\'s Privacy Policy and Terms & Conditions and consent to receive communications from Insta Rupees via SMS, Email, and WhatsApp.'
    ],
    [
        'name' => 'Udhaar Now',
        'logo' => '/assets/udhaarnow.png',
        'url' => 'https://www.udhaarnow.com/terms-and-conditions.aspx',
        'consent' => 'I hereby authorize UdhaarNow and its affiliated lending partners as lenders to obtain, verify, and store my credit history from RBI-authorized Credit Bureaus and validate my identity and financial credentials for sanctioning digital personal loans. I confirm having read and agreed to the Terms & Conditions and give permission for transactional and informational alerts via SMS, WhatsApp, and phone calls.'
    ],
    [
        'name' => 'Loan Within',
        'logo' => '/assets/loanwithin.png',
        'url' => 'https://www.loanwithin.com/terms-and-conditions',
        'consent' => 'I hereby grant consent in favor of LoanWithin and its lending partners to securely collect, verify, and process my personal data, identity documents, bank statements, and credit bureau score for digital loan evaluation and credit appraisal. I agree to be bound by the Terms and Conditions and Privacy Policy of LoanWithin and agree to receive updates and promotional notices through SMS, WhatsApp, and Phone calls.'
    ],
    [
        'name' => 'Shubh Cash',
        'logo' => '/assets/shubhcash.png',
        'url' => 'https://www.shubhcash.com/terms-and-conditions',
        'consent' => 'I declare that the details provided are true and correct, and I authorize ShubhCash and its partnered NBFCs to access my credit score, verify my employment and address information, and perform underwriting assessments. I hereby accept ShubhCash\'s Terms & Conditions and consent to receiving communications related to loan sanction, disbursal, and service offerings via Call, SMS, WhatsApp, and Email.'
    ],
    [
        'name' => 'Borrowera',
        'logo' => '/assets/borrowera.png',
        'url' => 'https://www.borrowera.com/terms-and-conditions',
        'consent' => 'I hereby give consent to Borrowera and its regulated lending partners to access my credit profile from authorized Credit Bureaus, authenticate my identity and KYC records, and share necessary information with financial partners for loan disbursal purposes. I have reviewed and accepted Borrowera\'s Terms and Conditions and agree to receive transactional and operational messages over SMS, Email, and WhatsApp.'
    ],
    [
        'name' => 'Easy Fincare',
        'logo' => '/assets/easyfincare.png',
        'url' => 'https://www.easyfincare.com/terms-and-conditions',
        'consent' => 'I hereby authorize Easy Fincare and its registered NBFC partners to collect, store, and process my personal data and KYC records, run credit inquiries with credit information companies, and assess my loan eligibility. I agree to adhere to the Terms & Conditions and Privacy Policy of Easy Fincare and give consent to contact me via Telephone, SMS, WhatsApp, or Electronic Mail.'
    ],
    [
        'name' => 'Ticket 2 Loan',
        'logo' => '/assets/ticket2loan.png',
        'url' => 'https://www.ticket2loan.com/terms-and-conditions.aspx',
        'consent' => 'I hereby authorize Ticket 2 Loan and its lending partners to verify my credit information, evaluate my eligibility, and process my loan request in accordance with RBI digital lending guidelines. I agree to Ticket 2 Loan\'s Terms & Conditions and Privacy Policy, and provide consent to receive communications, offers, and loan status notifications via SMS, WhatsApp, Email, and telephone calls.'
    ],
    [
        'name' => 'Rupay 91',
        'logo' => '/assets/rupay91.png',
        'url' => 'https://www.rupay91.com/terms-conditions.php',
        'consent' => 'I hereby give my consent to Rupay91 and its partnered NBFCs as lenders to collect, store, and verify my credit score and KYC credentials for processing and underwriting my personal loan request. I confirm having read and agreed to Rupay91\'s Terms & Conditions and Privacy Policy, and consent to receive loan updates, servicing alerts, and promotional messages through SMS, WhatsApp, and Call.'
    ]
];
?>

<style>
/* Page Wrapper & Spacing */
.partner-tc-page {
    background-color: #F8FAFC;
    padding-top: 115px;
    padding-bottom: 5rem;
    min-height: 80vh;
}

@media (max-width: 768px) {
    .partner-tc-page {
        padding-top: 95px;
        padding-bottom: 3.5rem;
    }
}

.partner-tc-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.25rem;
}

/* Hero Banner - Matching Reference Screenshot */
.partner-tc-hero {
    position: relative;
    background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%);
    border-radius: 20px;
    padding: 2.8rem 1.5rem 3.4rem 1.5rem;
    text-align: center;
    box-shadow: 0 12px 30px -8px rgba(37, 99, 235, 0.28);
    margin-bottom: 3.8rem;
}

.partner-tc-hero h1 {
    color: #FFFFFF !important;
    font-size: clamp(1.6rem, 3.5vw, 2.35rem);
    font-weight: 800;
    font-family: var(--font-heading, sans-serif);
    letter-spacing: -0.015em;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* Centered Shield Badge Overlapping Bottom */
.hero-shield-badge {
    position: absolute;
    bottom: -26px;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 56px;
    background: #FFFFFF;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18), 0 2px 6px rgba(0, 0, 0, 0.06);
    border: 1.5px solid #DBEAFE;
    z-index: 3;
}

.hero-shield-badge svg {
    display: block;
}

/* 3-Column Responsive Grid */
.partner-tc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
}

@media (max-width: 1024px) {
    .partner-tc-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.35rem;
    }
}

@media (max-width: 640px) {
    .partner-tc-grid {
        grid-template-columns: 1fr;
        gap: 1.15rem;
    }
}

/* Partner Card Styling */
.partner-tc-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 18px;
    padding: 1.85rem 1.65rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.partner-tc-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.09);
    border-color: #93C5FD;
}

/* Card Header: Logo & Name */
.partner-card-header {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.2rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid #F1F5F9;
}

.partner-logo-container {
    width: 44px;
    height: 44px;
    border-radius: 11px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.partner-logo-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
}

.partner-card-title {
    font-size: 1.12rem;
    font-weight: 700;
    color: #0F172A;
    font-family: var(--font-heading, sans-serif);
    line-height: 1.3;
    margin: 0;
}

/* Card Body: Consent Copy */
.partner-card-body {
    color: #475569;
    font-size: 0.915rem;
    line-height: 1.65;
    margin-bottom: 1.4rem;
    flex-grow: 1;
}

/* Card Footer: Official T&C Page Link */
.partner-card-footer {
    margin-top: auto;
    padding-top: 0.6rem;
}

.partner-tc-link {
    color: #2563EB;
    font-weight: 600;
    font-size: 0.92rem;
    text-decoration: underline;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    transition: color 0.18s ease;
}

.partner-tc-link:hover {
    color: #1D4ED8;
    text-decoration: underline;
}

.partner-tc-link svg {
    transition: transform 0.18s ease;
}

.partner-tc-link:hover svg {
    transform: translate(2px, -2px);
}
</style>

<div class="partner-tc-page">
    <div class="partner-tc-container">
        
        <!-- Gradient Hero Banner with Centered Shield Badge -->
        <div class="partner-tc-hero">
            <h1>Partner Terms &amp; Conditions</h1>
            
            <div class="hero-shield-badge" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
            </div>
        </div>

        <!-- 3-Column Responsive Grid of Partner Terms Cards -->
        <div class="partner-tc-grid">
            <?php foreach ($partnerTerms as $partner): ?>
                <div class="partner-tc-card">
                    <div>
                        <!-- Header: Logo & Name -->
                        <div class="partner-card-header">
                            <div class="partner-logo-container">
                                <img src="<?php echo htmlspecialchars($partner['logo']); ?>" 
                                     alt="<?php echo htmlspecialchars($partner['name']); ?> Logo" 
                                     loading="lazy"
                                     onerror="this.style.display='none'; this.parentElement.innerHTML='<b style=\'color:#2563eb; font-size:1.1rem;\'><?php echo strtoupper(substr($partner['name'], 0, 1)); ?></b>';">
                            </div>
                            <h2 class="partner-card-title"><?php echo htmlspecialchars($partner['name']); ?></h2>
                        </div>

                        <!-- Body: Explicit Consent Copy -->
                        <div class="partner-card-body">
                            <?php echo htmlspecialchars($partner['consent']); ?>
                        </div>
                    </div>

                    <!-- Footer: Official T&C Page Link -->
                    <div class="partner-card-footer">
                        <a href="<?php echo htmlspecialchars($partner['url']); ?>" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="partner-tc-link">
                            <span>Official T&amp;C Page</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    </div>
</div>

<?php include 'includes/footer.php'; ?>
