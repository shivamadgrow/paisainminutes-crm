    </main>
    <style id="footer-custom-styles">
    /* --- FOOTER LOGO & GRID REFINEMENTS --- */
    .footer-logo-link {
        display: inline-flex;
        align-items: center;
        margin: 0 0 1.25rem 0;
        text-decoration: none;
        line-height: 1;
    }
    .footer-logo-link:focus-visible {
        outline: 2px solid var(--accent-color, #4A8DFF);
        outline-offset: 4px;
        border-radius: 4px;
    }
    .footer-logo-img {
        width: auto;
        height: 48px;
        max-width: 170px;
        object-fit: contain;
        display: block;
        margin: 0;
        background: #FFFFFF;
        border-radius: 8px;
        padding: 4px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .footer-logo-link:hover .footer-logo-img {
        opacity: 0.95;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }
    .footer-grid {
        display: grid;
        grid-template-columns: 1.35fr 1fr 1.15fr 1.05fr;
        gap: 2.5rem;
        margin-bottom: 2.5rem;
        align-items: start;
    }
    .footer-col h4,
    .footer h4 {
        margin-top: 0;
        margin-bottom: 1.25rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--white, #FFFFFF);
        letter-spacing: -0.01em;
    }
    .footer-contact-item a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
    }
    .footer-contact-item a:hover {
        color: var(--white, #FFFFFF);
        text-decoration: underline;
    }

    /* --- BACK TO TOP BUTTON --- */
    .back-to-top {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 1050;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        font-family: var(--font-body, 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        font-size: 0.85rem;
        font-weight: 600;
        color: #FFFFFF;
        background: linear-gradient(135deg, #1B2A6B 0%, #0E1638 100%);
        border: 1px solid rgba(74, 141, 255, 0.4);
        border-radius: 50px;
        box-shadow: 0 4px 16px rgba(14, 22, 56, 0.35);
        cursor: pointer;
        text-decoration: none;
        opacity: 0;
        visibility: hidden;
        transform: translateY(16px);
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    visibility 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    background-color 0.2s ease,
                    border-color 0.2s ease,
                    box-shadow 0.2s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    .back-to-top:hover {
        background: linear-gradient(135deg, #4A8DFF 0%, #1B2A6B 100%);
        border-color: #60A5FA;
        color: #FFFFFF;
        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
        transform: translateY(-2px);
    }
    .back-to-top:active {
        transform: translateY(0);
    }
    .back-to-top:focus-visible {
        outline: 2px solid var(--accent-color, #4A8DFF);
        outline-offset: 3px;
        box-shadow: 0 0 0 4px rgba(74, 141, 255, 0.3);
    }
    .back-to-top-icon {
        flex-shrink: 0;
        transition: transform 0.2s ease;
    }
    .back-to-top:hover .back-to-top-icon {
        transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
        .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2.25rem 2rem !important;
        }
        .footer-brand {
            grid-column: span 1 !important;
            margin-bottom: 0 !important;
        }
    }
    @media (max-width: 768px) {
        .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
        }
        .footer-logo-img {
            height: 42px;
            max-width: 150px;
            padding: 3px 6px;
        }
        .back-to-top {
            bottom: 20px;
            right: 20px;
            padding: 8px 14px;
            font-size: 0.8rem;
            gap: 6px;
        }
    }
    </style>
    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Col 1: Brand -->
                <div class="footer-brand">
                    <a href="/" class="footer-logo-link" aria-label="Paisa in Minutes Home">
                        <img src="/assets/footer-logo.webp" alt="Paisa in Minutes" class="footer-logo-img" width="941" height="440" loading="lazy" decoding="async">
                    </a>
                    <p class="footer-tagline">Making personal finance transparent, reliable, and accessible for everyday Indians.</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/profile.php?id=61594139144227" class="social-link" aria-label="Follow Paisa in Minutes on Facebook" target="_blank" rel="noopener noreferrer">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/paisainminutes" class="social-link" aria-label="Follow Paisa in Minutes on Instagram" target="_blank" rel="noopener noreferrer">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/company/145200180/" class="social-link" aria-label="Follow Paisa in Minutes on LinkedIn" target="_blank" rel="noopener noreferrer">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="/about-us">About Us</a></li>
                        <li><a href="/our-partners">Our Partners</a></li>
                        <li><a href="/partner-terms">Partner Terms &amp; Conditions</a></li>
                        <li><a href="/check-eligibility">Check Eligibility</a></li>
                        <li><a href="/#how-it-works">How It Works</a></li>
                        <li><a href="/#faqs">FAQs</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Col 3: Personal Loan Hub -->
                <div class="footer-col">
                    <h4>Personal Loan Hub</h4>
                    <ul class="footer-links">
                        <li><a href="/personal-loan">Instant Personal Loan</a></li>
                        <li><a href="/10-thousand-personal-loan">₹10,000 Personal Loan</a></li>
                        <li><a href="/25-thousand-personal-loan">₹25,000 Personal Loan</a></li>
                        <li><a href="/50-thousand-personal-loan">₹50,000 Personal Loan</a></li>
                        <li><a href="/75-thousand-personal-loan">₹75,000 Personal Loan</a></li>
                        <li><a href="/1-lakh-personal-loan">₹1 Lakh Personal Loan</a></li>
                        <li><a href="/personal-loan-low-cibil-score">Low CIBIL Personal Loan</a></li>
                        <li><a href="/personal-loan-emi-calculator">Personal Loan EMI Calculator</a></li>
                    </ul>
                </div>

                <!-- Col 4: Get in Touch -->
                <div class="footer-col">
                    <h4>Get in Touch</h4>
                    <div class="footer-contact-item">
                        <!-- Location Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <span>Delhi, India</span>
                    </div>
                    <div class="footer-contact-item">
                        <!-- Phone Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <a href="tel:+919990666578">+91 9990 666578</a>
                    </div>
                    <div class="footer-contact-item">
                        <!-- Envelope Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <a href="mailto:info@paisainminutes.com">info@paisainminutes.com</a>
                    </div>
                </div>
            </div>

            <!-- SEO Contextual Quick Links Matrix -->
            <div class="footer-quick-hub">
                <div class="footer-quick-hub-header">
                    <div class="footer-quick-hub-title">
                        <svg class="footer-quick-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <span>Popular Personal Loan Amounts &amp; Calculators</span>
                    </div>
                    <span class="footer-quick-badge">Quick Discovery</span>
                </div>

                <div class="footer-quick-grid">
                    <!-- Category 1: Loan Amounts by Ticket Size -->
                    <div class="footer-quick-category">
                        <div class="footer-quick-category-title">
                            <span class="category-indicator"></span>
                            <span>Loan Amounts</span>
                        </div>
                        <div class="footer-quick-chips">
                            <a href="/10-thousand-personal-loan" class="footer-chip">
                                <span class="footer-chip-symbol">₹</span>
                                <span class="footer-chip-text">₹10,000 Personal Loan</span>
                            </a>
                            <a href="/25-thousand-personal-loan" class="footer-chip">
                                <span class="footer-chip-symbol">₹</span>
                                <span class="footer-chip-text">₹25,000 Personal Loan</span>
                            </a>
                            <a href="/50-thousand-personal-loan" class="footer-chip">
                                <span class="footer-chip-symbol">₹</span>
                                <span class="footer-chip-text">₹50,000 Personal Loan</span>
                            </a>
                            <a href="/75-thousand-personal-loan" class="footer-chip">
                                <span class="footer-chip-symbol">₹</span>
                                <span class="footer-chip-text">₹75,000 Personal Loan</span>
                            </a>
                            <a href="/1-lakh-personal-loan" class="footer-chip">
                                <span class="footer-chip-symbol">₹</span>
                                <span class="footer-chip-text">₹1 Lakh Personal Loan</span>
                            </a>
                        </div>
                    </div>

                    <!-- Category 2: Financial Calculators -->
                    <div class="footer-quick-category">
                        <div class="footer-quick-category-title">
                            <span class="category-indicator"></span>
                            <span>Calculators &amp; Tools</span>
                        </div>
                        <div class="footer-quick-chips">
                            <a href="/personal-loan-emi-calculator" class="footer-chip footer-chip-highlight">
                                <svg class="footer-chip-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
                                <span class="footer-chip-text">Personal Loan EMI Calculator</span>
                            </a>
                            <a href="/personal-loan-eligibility-calculator" class="footer-chip footer-chip-highlight">
                                <svg class="footer-chip-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span class="footer-chip-text">Loan Eligibility Calculator</span>
                            </a>
                        </div>
                    </div>

                    <!-- Category 3: Key Loan Solutions -->
                    <div class="footer-quick-category">
                        <div class="footer-quick-category-title">
                            <span class="category-indicator"></span>
                            <span>Loan Solutions</span>
                        </div>
                        <div class="footer-quick-chips">
                            <a href="/personal-loan" class="footer-chip">
                                <span class="footer-chip-text">Personal Loan Online</span>
                            </a>
                            <a href="/personal-loan-low-cibil-score" class="footer-chip">
                                <span class="footer-chip-text">Low CIBIL Personal Loan</span>
                            </a>
                            <a href="/personal-loan-interest-rates" class="footer-chip">
                                <span class="footer-chip-text">Personal Loan Interest Rates</span>
                            </a>
                            <a href="/personal-loan-balance-transfer" class="footer-chip">
                                <span class="footer-chip-text">Personal Loan Balance Transfer</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compliance Disclaimer Section -->
            <div class="footer-compliance footer-compliance-card">
                <div class="footer-compliance-header">
                    <div class="compliance-badge">
                        <svg class="compliance-shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="m9 12 2 2 4-4"/>
                        </svg>
                        <span>Disclaimer &amp; NBFC Compliance Information</span>
                    </div>
                    <div class="compliance-tags-row">
                        <span class="compliance-trust-pill">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
                            RBI Registered Partners
                        </span>
                        <span class="compliance-trust-pill">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v3H9V7z"/></svg>
                            256-Bit SSL Secured
                        </span>
                    </div>
                </div>
                <div class="footer-compliance-body">
                    <p style="margin-bottom: 0.75rem;">
                        <strong>Regulatory &amp; Lending Disclosure:</strong> Paisa in Minutes is a digital loan facilitation platform (Lending Service Provider - LSP) operated by AdGrow Media Services. We do not directly lend money or act as an NBFC/Bank. We connect prospective borrowers with RBI-regulated Non-Banking Financial Companies (NBFCs) and Scheduled Commercial Banks. All loan terms, approvals, credit sanction limits, and disbursals are strictly governed by our RBI-registered lending partners at their sole discretion.
                    </p>
                    <p style="margin-bottom: 0.75rem;">
                        <strong>Loan Terms &amp; Google Financial Services Policy Compliance:</strong>
                        <br>&bull; <strong>Repayment Tenure:</strong> Minimum tenure is 3 months (90 days) and maximum tenure is up to 60 months (5 years). We do not offer or promote short-term payday loans with repayment periods under 60 days.
                        <br>&bull; <strong>Annual Percentage Rate (APR):</strong> Minimum APR starts at 10.49% p.a., with a maximum APR capped at 24% p.a., depending on borrower creditworthiness and partner risk profiling.
                        <br>&bull; <strong>Processing Fees:</strong> 1% to 3% of the sanctioned loan amount (+ applicable 18% GST). No upfront or advance security deposit is collected before disbursal.
                    </p>
                    <p style="margin-bottom: 0;">
                        <strong>Representative APR Worked Example:</strong> For a personal loan of ₹1,00,000 disbursed over a 12-month tenure at an interest rate of 10.49% p.a.:
                        Monthly EMI = ₹8,815 | Processing Fee (2%) = ₹2,000 | GST on Processing Fee (18%) = ₹360 | Net Amount Disbursed = ₹97,640 | Total Interest Payable = ₹5,780 | Total Amount Repayable = ₹1,05,780 | Representative Maximum APR = 14.8% p.a.
                    </p>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-copyright">
                    &copy; <?php echo date('Y'); ?> Paisa in Minutes. All rights reserved by <a href="https://adgrowmedia.in/" target="_blank" rel="noopener noreferrer">ADSGROW DIGITAL MEDIA SERVICES PRIVATE LIMITED</a>.
                </div>
                <div class="footer-policies">
                    <a href="/about-us">About Us</a>
                    <a href="/our-partners">Our Partners</a> 
                    <a href="/terms-and-conditions">Terms &amp; Conditions</a>
                    <a href="/partner-terms">Partner T&amp;C</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/contact-us">Contact Us</a>
                </div>
                <div class="footer-powered">
                    Powered by <a href="https://adgrowmedia.in/" target="_blank" rel="noopener noreferrer">Ad Grow Media</a>
                </div>
            </div>

        </div>
    </footer>

    <!-- BACK TO TOP BUTTON -->
    <button type="button" class="back-to-top" id="backToTop" aria-label="Back to Top" title="Back to Top">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="back-to-top-icon">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
        <span class="back-to-top-text">Back to Top</span>
    </button>

    <!-- LEAD APPLICATION MODAL -->
    <div class="modal" id="applyModal" role="dialog" aria-modal="true" aria-labelledby="applyModalTitle">
        <div class="modal-overlay" tabindex="-1"></div>
        <div class="modal-container">
            <button class="modal-close" id="closeModal" aria-label="Close application modal" type="button">
                <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <!-- Modal Logo Container -->
            <div class="modal-logo-container" style="text-align: center; margin-bottom: 1.25rem;">
                <img src="/assets/logo.webp" alt="Paisa in Minutes" style="height: 48px; width: auto; margin: 0 auto; display: block;" loading="lazy" decoding="async" width="48" height="48">
            </div>

            <!-- Modal Tabs Headers (Hidden since Sign In / Tracking removed) -->
            <div class="modal-tabs" style="display: none;">
                <button type="button" class="modal-tab-btn active" id="btnTabApply">Apply Now</button>
            </div>

            <!-- Apply Tab Content -->
            <div class="modal-tab-content active" id="contentTabApply">
                <h3 class="modal-title" id="applyModalTitle" style="text-align: center; font-size: 1.45rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.35rem;">Get Started &amp; Apply for Instant Loans</h3>
                <p class="modal-subtitle" style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Get Instant Loan up to <?php echo defined('FINANCIAL_MAX_LOAN_AMOUNT') ? FINANCIAL_MAX_LOAN_AMOUNT : '₹1 Lakh'; ?>/-</p>
                
                <form id="leadForm">
                    <!-- Phone input group -->
                    <div class="form-group">
                        <label for="phone" class="sr-only">Enter Mobile Number</label>
                        <div class="phone-input-group">
                            <span class="phone-prefix" aria-hidden="true">+91</span>
                            <input type="tel" id="phone" name="phone" placeholder="Enter Mobile Number" maxlength="10" autocomplete="tel" inputmode="numeric" aria-required="true" required>
                        </div>
                    </div>

                    <!-- Green Tick Disclaimer -->
                    <div class="form-disclaimer">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="disclaimer-icon" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clip-rule="evenodd"/></svg>
                        <span>Your data is safe with us and governed by Paisa in Minutes's <a href="/privacy-policy" target="_blank" style="color: #10B981; text-decoration: underline;">Privacy Policy</a>.</span>
                    </div>

                    <!-- Consent checkbox 1 -->
                    <div class="form-group" style="margin-top: 1.25rem;">
                        <label class="form-checkbox-label" style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" name="agreeTerms" value="yes" required style="margin-top: 3px;">
                            <span style="font-size: 0.72rem; line-height: 1.4; color: var(--text-muted); display: block;">I hereby declare to authorize Paisa in Minutes and its lending partners to receive my credit information from Credit Reporting Agencies for the purpose of credit profiling and facilitating financial products.</span>
                        </label>
                    </div>

                    <!-- Consent checkbox 2 -->
                    <div class="form-group" style="margin-top: 0.75rem;">
                        <label class="form-checkbox-label" style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" name="agreeTerms2" value="yes" required style="margin-top: 3px;">
                            <span style="font-size: 0.72rem; line-height: 1.4; color: var(--text-muted); display: block;">I agree to share my details, which shall be governed by Paisa in Minutes's <a href="/privacy-policy" target="_blank" style="color: var(--accent-color); text-decoration: underline;">Privacy Policy</a> and <a href="/terms-and-conditions" target="_blank" style="color: var(--accent-color); text-decoration: underline;">T&C</a>.</span>
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary form-btn" style="width: 100%; border-radius: var(--border-radius-pill); background: var(--accent-color); padding: 0.75rem; font-size: 1rem; color: #fff; font-weight: 600; cursor: pointer; border: none; margin-top: 1.5rem; transition: var(--transition-smooth);">Continue &amp; Apply Now</button>

                    <!-- Status Message -->
                    <div class="form-status" id="formStatus" aria-live="polite"></div>
                </form>
            </div>
        </div>
    </div>

    <!-- OTP Verification Modal (Modular Mock 111111 / API Ready) -->
    <?php include_once __DIR__ . '/otp-modal.php'; ?>

    <!-- JavaScripts (Minified with fallback) -->
    <script src="/js/calc-clamp.js?v=<?php echo @filemtime(__DIR__ . '/../js/calc-clamp.js') ?: 1; ?>" defer></script>
    <script src="<?php echo file_exists(__DIR__ . '/../js/main.min.js') ? '/js/main.min.js?v=' . filemtime(__DIR__ . '/../js/main.min.js') : '/js/main.js?v=' . (file_exists(__DIR__ . '/../js/main.js') ? filemtime(__DIR__ . '/../js/main.js') : '1'); ?>" defer></script>

    <!-- Back to Top Scroll Controller -->
    <script>
    (function() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;

        var isTicking = false;
        function checkScroll() {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
            isTicking = false;
        }

        window.addEventListener('scroll', function() {
            if (!isTicking) {
                window.requestAnimationFrame(checkScroll);
                isTicking = true;
            }
        }, { passive: true });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            try {
                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            } catch (err) {
                window.scrollTo(0, 0);
            }
        });

        checkScroll();
    })();
    </script>
</body>
</html>
