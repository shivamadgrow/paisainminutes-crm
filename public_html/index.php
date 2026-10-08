<?php
/**
 * Paisa in Minutes - Official Homepage
 * Brand Entity & Digital Lending Service Provider (LSP) Marketplace
 */
$page_title = "Paisa in Minutes | Instant Personal Loans Online";
$page_description = "Paisa in Minutes helps you explore personal loan offers online from RBI-regulated lending partners. Check eligibility and compare available loan options digitally.";
$page_keywords = "Paisa in Minutes, paisa in minutes loan, personal loans, instant personal loan online, loan offers online, digital loan marketplace";

$page_faqs = [
    [
        'question' => 'What is Paisa in Minutes and how does it work?',
        'answer' => 'Paisa in Minutes (paisainminutes.com) is an authorized digital loan facilitation marketplace operated by AdGrow Media Services. We connect borrowers with RBI-registered NBFCs and banks for instant personal loans up to ₹50 Lakh with 100% paperless digital verification and quick bank disbursal upon lender approval.'
    ],
    [
        'question' => 'What documents do I need to apply for a loan?',
        'answer' => 'Since we operate a 100% paperless digital system, you only need: 1. PAN Card, 2. Aadhaar Card (linked to your mobile number for e-signing), and 3. Latest 3 months\' Bank Statements via secure net banking login or PDF upload.'
    ],
    [
        'question' => 'How much time does it take for loan disbursal?',
        'answer' => 'Our automated engine evaluates your application in minutes. Once you review, accept your offer, and complete digital KYC, funds are transferred directly into your bank account by the respective lending partner upon sanction.'
    ],
    [
        'question' => 'What are the interest rates, tenure, and fees?',
        'answer' => 'Interest rates start from 10.49% per annum with flexible repayment tenures from 3 to 60 months. Processing fees range from 1% to 3% (+ applicable GST). All charges are disclosed upfront before loan agreement execution, with zero advance fees.'
    ],
    [
        'question' => 'Is my personal and financial data secure?',
        'answer' => 'Yes, absolutely. All customer information is protected with bank-grade 256-bit SSL encryption. We comply with RBI Digital Lending Guidelines and never sell or share user data with unauthorized third parties.'
    ],
    [
        'question' => 'What happens if I miss my monthly repayment schedule?',
        'answer' => 'We encourage timely repayments to maintain a healthy CIBIL score. If an EMI is missed, standard late-payment fees and penal interest may apply as detailed in your loan agreement with the lending partner.'
    ]
];

include 'includes/header.php'; 
?>

    <!-- HERO SECTION -->
    <section class="hero" id="hero">
        <!-- Background Glowing Blobs -->
        <div class="hero-glow-1"></div>
        <div class="hero-glow-2"></div>

        <div class="container">
            <div class="hero-grid">
                <div class="hero-content">
                    <div class="hero-badge">
                        <span class="pulse-dot"></span>
                        <span class="badge-text">Paisa Milega, Minutes Mein</span>
                    </div>
                    <h1 class="hero-title">Paisa in Minutes – <span class="gradient-text">Instant Personal Loans Online</span></h1>
                    <p class="hero-desc">Paisa in Minutes is a digital loan facilitation platform that helps eligible borrowers discover personal loan options online from RBI-regulated lending partners. Compare available loan options and check eligibility digitally through a 100% paperless, secure application.</p>
                    <div class="hero-actions">
                        <button type="button" class="btn btn-primary open-apply-modal" aria-label="Apply Now for Instant Personal Loan">Apply Now</button>
                        <a href="#calculator" class="hero-sec-link" aria-label="Check Loan Eligibility and Calculate EMI">
                            Check Eligibility
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
                        </a>
                    </div>
                    
                    <!-- Trust Strip -->
                    <div class="trust-strip">
                        <div class="trust-title">Our Trust Partners &amp; Credibility</div>
                        <div class="trust-items">
                            <div class="trust-item">
                                <!-- Shield SVG -->
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                <span>RBI Registered NBFCs</span>
                            </div>
                            <div class="trust-item">
                                <!-- Lock SVG -->
                                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                <span>Bank-Grade Security</span>
                            </div>
                            <div class="trust-item">
                                <div class="rating-stars" aria-label="5 out of 5 stars">★★★★★</div>
                                <span><strong>4.8★</strong> (20K+ Reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Hero Column: Globe Orbiting Illustration -->
                <div class="hero-image-wrapper">
                    <div class="globe-orbit-wrapper">
                        <!-- Globe Grid lines wireframe -->
                        <svg class="globe-grid-svg" viewBox="0 0 500 500" fill="none" stroke="rgba(27, 42, 107, 0.08)" stroke-width="1.2" aria-hidden="true">
                            <!-- Latitude lines -->
                            <circle cx="250" cy="250" r="240" />
                            <circle cx="250" cy="250" r="170" />
                            <circle cx="250" cy="250" r="100" />
                            <!-- Vertical/Horizontal Ellipses representing 3D sphere lines -->
                            <ellipse cx="250" cy="250" rx="240" ry="75" />
                            <ellipse cx="250" cy="250" rx="240" ry="155" />
                            <ellipse cx="250" cy="250" rx="75" ry="240" />
                            <ellipse cx="250" cy="250" rx="155" ry="240" />
                            <!-- Horizontal and vertical straight cross lines -->
                            <line x1="250" y1="10" x2="250" y2="490" />
                            <line x1="10" y1="250" x2="490" y2="250" />
                        </svg>

                        <!-- Connecting Pulse Lines -->
                        <svg class="connecting-lines-svg" viewBox="0 0 500 500" fill="none" aria-hidden="true">
                            <!-- Line to Top-Left (Home Loan) -->
                            <path d="M250,250 L115,115" stroke="rgba(234, 179, 8, 0.15)" stroke-width="2" />
                            <path class="pulse-active active-tl" d="M250,250 L115,115" stroke="#EAB308" stroke-width="3" stroke-linecap="round" />

                            <!-- Line to Top-Right (Personal Loan) -->
                            <path d="M250,250 L385,115" stroke="rgba(34, 197, 94, 0.15)" stroke-width="2" />
                            <path class="pulse-active active-tr" d="M250,250 L385,115" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />

                            <!-- Line to Bottom-Left (Business Loan) -->
                            <path d="M250,250 L115,385" stroke="rgba(37, 99, 235, 0.15)" stroke-width="2" />
                            <path class="pulse-active active-bl" d="M250,250 L115,385" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />

                            <!-- Line to Bottom-Right (More Services) -->
                            <path d="M250,250 L385,385" stroke="rgba(139, 92, 246, 0.15)" stroke-width="2" />
                            <path class="pulse-active active-br" d="M250,250 L385,385" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round" />
                        </svg>

                        <!-- Central Stopwatch Circle -->
                        <div class="center-circle" style="border: 2px solid #EF4444; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.35);">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;" aria-hidden="true">
                                <!-- Speed lines on the left -->
                                <path d="M2 9h3" />
                                <path d="M1 13h5" />
                                <path d="M2 17h3" />
                                <!-- Stopwatch body -->
                                <circle cx="14" cy="13" r="7.5" fill="rgba(239, 68, 68, 0.05)" />
                                <!-- Stopwatch top buttons -->
                                <path d="M14 5.5V3" />
                                <path d="M11.5 3h5" />
                                <path d="M19.5 5.5l-1.5 1.5" />
                                <!-- Clock hands -->
                                <path d="M14 9.5v3.5l2 1.5" />
                            </svg>
                        </div>

                        <!-- Satellite 1: Home Loan (Yellow) -->
                        <a href="/home-loan" class="satellite-wrapper sat-wrapper-tl" aria-label="View Home Loan options">
                            <div class="satellite-circle sat-yellow">
                                <span class="sat-dot sat-dot-yellow"></span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 36px; height: 36px;" aria-hidden="true">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="rgba(234, 179, 8, 0.08)" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <div class="sat-label label-yellow">Home Loan</div>
                        </a>

                        <!-- Satellite 2: Personal Loan (Green) -->
                        <a href="/personal-loan" class="satellite-wrapper sat-wrapper-tr" aria-label="View Personal Loan options">
                            <div class="satellite-circle sat-green">
                                <span class="sat-dot sat-dot-green"></span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 36px; height: 36px;" aria-hidden="true">
                                    <circle cx="10" cy="7" r="4" fill="rgba(34, 197, 94, 0.08)" />
                                    <path d="M10 14c-4.42 0-8 2.24-8 5v2h12v-2c0-2.76-3.58-5-8-5z" />
                                    <path d="M16 11l2 2 4-4" stroke-width="2.5" />
                                </svg>
                            </div>
                            <div class="sat-label label-green">Personal Loan</div>
                        </a>

                        <!-- Satellite 3: Business Loan (Blue) -->
                        <a href="/business-loan" class="satellite-wrapper sat-wrapper-bl" aria-label="View Business Loan options">
                            <div class="satellite-circle sat-blue">
                                <span class="sat-dot sat-dot-blue"></span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 36px; height: 36px;" aria-hidden="true">
                                    <rect x="3" y="6" width="18" height="14" rx="2" fill="rgba(37, 99, 235, 0.08)" />
                                    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                    <path d="M3 11h18" />
                                    <path d="M12 11v4" />
                                </svg>
                            </div>
                            <div class="sat-label label-blue">Business Loan</div>
                        </a>

                        <!-- Satellite 4: More Services (Purple) -->
                        <a href="#products" class="satellite-wrapper sat-wrapper-br" aria-label="View All Loan Offerings">
                            <div class="satellite-circle sat-purple">
                                <span class="sat-dot sat-dot-purple"></span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 36px; height: 36px;" aria-hidden="true">
                                    <rect x="3" y="3" width="7" height="7" rx="1" fill="rgba(139, 92, 246, 0.08)" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" fill="rgba(139, 92, 246, 0.08)" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" fill="rgba(139, 92, 246, 0.08)" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" fill="rgba(139, 92, 246, 0.08)" />
                                </svg>
                            </div>
                            <div class="sat-label label-purple">All Services</div>
                        </a>
                    </div>
                </div>
            </div>
    </section>

    <!-- LIVE STATS TICKER BAR -->
    <section class="stats-ticker" id="stats-ticker">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card reveal">
                    <div class="stat-icon">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div class="stat-value" data-target="500">₹<span class="counter">500</span> Cr+</div>
                    <div class="stat-label">Loans Disbursed</div>
                </div>
                <div class="stat-card reveal delay-1">
                    <div class="stat-icon">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <div class="stat-value" data-target="100000"><span class="counter">100,000</span>+</div>
                    <div class="stat-label">Happy Customers</div>
                </div>
                <div class="stat-card reveal delay-2">
                    <div class="stat-icon">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                    </div>
                    <div class="stat-value">4.8<span style="color: #FFB800;">★</span></div>
                    <div class="stat-label">Average Rating</div>
                </div>
                <div class="stat-card reveal delay-3">
                    <div class="stat-icon">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div class="stat-value"><span class="counter" data-target="2">2</span> Mins</div>
                    <div class="stat-label">Average Disbursal</div>
                </div>
            </div>
        </div>
    </section>

    <!-- LOAN PRODUCTS GRID -->
    <section class="section" id="products">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Loan Offerings</span>
                <h2 class="section-title">Designed for Your Every Financial Need</h2>
                <p class="section-subtitle">Choose the perfect loan program tailored with low interest rates and dynamic features.</p>
            </div>
            
            <div class="products-grid">
                <!-- Product Card 1 -->
                <div class="product-card reveal delay-1">
                    <div class="product-badge-popular">🔥 Popular</div>
                    <div class="product-icon-wrapper">
                        <!-- Person Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <h3 class="product-title">Personal Loan</h3>
                    <p class="product-desc">Flexible cash solution for wedding, travel, home renovation, or medical emergency expenses.</p>
                    <div class="product-rate-wrapper">
                        <span class="product-rate-label">Interest Rate</span>
                        <span class="product-rate-val">From 10.49% p.a.</span>
                    </div>
                    <a href="/personal-loan" class="product-link" aria-label="Apply for Personal Loan">
                        Apply Now
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>

                <!-- Product Card 2 -->
                <div class="product-card reveal delay-2">
                    <div class="product-icon-wrapper">
                        <!-- Bolt/Instant Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 class="product-title">Instant Cash</h3>
                    <p class="product-desc">Small ticket instant credits to manage utility bills, grocery payments, or sudden salary delays.</p>
                    <div class="product-rate-wrapper">
                        <span class="product-rate-label">Interest Rate</span>
                        <span class="product-rate-val">From 1.5% / month</span>
                    </div>
                    <a href="/micro-loan" class="product-link" aria-label="Apply for Instant Cash Micro Loan">
                        Apply Now
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>

                <!-- Product Card 3 -->
                <div class="product-card reveal delay-3">
                    <div class="product-icon-wrapper">
                        <!-- Briefcase Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <h3 class="product-title">Business Loan</h3>
                    <p class="product-desc">Fulfill business working capital requirements, inventory purchase, or workspace scaling requirements.</p>
                    <div class="product-rate-wrapper">
                        <span class="product-rate-label">Interest Rate</span>
                        <span class="product-rate-val">From 14.99% p.a.</span>
                    </div>
                    <a href="/business-loan" class="product-link" aria-label="Apply for Business Loan">
                        Apply Now
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>

                <!-- Product Card 4 -->
                <div class="product-card reveal delay-4">
                    <div class="product-icon-wrapper">
                        <!-- Credit Card Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    </div>
                    <h3 class="product-title">Credit Line</h3>
                    <p class="product-desc">Get an approved limit. Withdraw money as you go and pay interest strictly on the utilized amount.</p>
                    <div class="product-rate-wrapper">
                        <span class="product-rate-label">Interest Rate</span>
                        <span class="product-rate-val">From 12.50% p.a.</span>
                    </div>
                    <a href="/overdraft-loan" class="product-link" aria-label="Apply for Credit Line Overdraft Loan">
                        Apply Now
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section section-bg" id="how-it-works">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Seamless Process</span>
                <h2 class="section-title">4 Simple Steps to Get Cash</h2>
                <p class="section-subtitle">Experience a completely digitised workflow designed to get you funded as quickly as possible.</p>
            </div>

            <div class="steps-container">
                <div class="steps-line">
                    <div class="steps-line-progress"></div>
                </div>

                <!-- Step 1 -->
                <div class="step-card">
                    <div class="step-number-wrapper">1</div>
                    <h3 class="step-title">Apply Online</h3>
                    <p class="step-desc">Fill out a simple 2-minute digital form with basic details.</p>
                </div>

                <!-- Step 2 -->
                <div class="step-card">
                    <div class="step-number-wrapper">2</div>
                    <h3 class="step-title">Verify Details</h3>
                    <p class="step-desc">Upload KYC papers and bank statements securely.</p>
                </div>

                <!-- Step 3 -->
                <div class="step-card">
                    <div class="step-number-wrapper">3</div>
                    <h3 class="step-title">Instant Approval</h3>
                    <p class="step-desc">Our automated engine approves your loan limit instantly.</p>
                </div>

                <!-- Step 4 -->
                <div class="step-card">
                    <div class="step-number-wrapper">4</div>
                    <h3 class="step-title">Get Disbursed</h3>
                    <p class="step-desc">Funds are transferred to your bank account within 2 hours.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="section" id="why-us">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Our Advantages</span>
                <h2 class="section-title">Why Indian Borrowers Choose Us</h2>
                <p class="section-subtitle">Say goodbye to complex bank processes, lengthy documentation queues, and surprises.</p>
            </div>

            <div class="features-grid">
                <!-- Tile 1 -->
                <div class="feature-tile reveal delay-1">
                    <div class="feature-icon">
                        <!-- Clock/Timer Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 class="feature-title">Fast Disbursal</h3>
                    <p class="feature-desc">Get your loan amount credited straight into your bank account within 2 hours of final approval.</p>
                </div>

                <!-- Tile 2 -->
                <div class="feature-tile reveal delay-2">
                    <div class="feature-icon">
                        <!-- Document Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <h3 class="feature-title">Minimal Documents</h3>
                    <p class="feature-desc">Forget long application queues. Complete verification using just your Aadhaar and PAN details.</p>
                </div>

                <!-- Tile 3 -->
                <div class="feature-tile reveal delay-3">
                    <div class="feature-icon">
                        <!-- Calender Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <h3 class="feature-title">Flexible Tenure</h3>
                    <p class="feature-desc">Choose comfortable repayments. Repayment schedules range flexibly from 3 to 60 months.</p>
                </div>

                <!-- Tile 4 -->
                <div class="feature-tile reveal delay-1">
                    <div class="feature-icon">
                        <!-- Cloud/Digital Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    </div>
                    <h3 class="feature-title">100% Digital Process</h3>
                    <p class="feature-desc">Submit your application, verify logs, and track payouts completely online without physical interactions.</p>
                </div>

                <!-- Tile 5 -->
                <div class="feature-tile reveal delay-2">
                    <div class="feature-icon">
                        <!-- Tag/No hidden charges Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16l6-6M9 10l6 6"/></svg>
                    </div>
                    <h3 class="feature-title">No Hidden Charges</h3>
                    <p class="feature-desc">Full transparency is guaranteed. We maintain absolute zero upfront processing fees or hidden pricing.</p>
                </div>

                <!-- Tile 6 -->
                <div class="feature-tile reveal delay-3">
                    <div class="feature-icon">
                        <!-- Shield/Compliant Icon -->
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h3 class="feature-title">Secure &amp; RBI Compliant</h3>
                    <p class="feature-desc">Your profile data is fully encrypted. We act in association with RBI-registered lending NBFCs.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ABOUT PAISA IN MINUTES & REGULATORY LENDING DISCLOSURE -->
    <section class="section about-brand-section" id="about-brand" style="background: #FFFFFF; padding: 4.5rem 0; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">About Our Platform</span>
                <h2 class="section-title">What is Paisa in Minutes?</h2>
                <p class="section-subtitle">A transparent, customer-first fintech marketplace operated by AdGrow Media Services in compliance with RBI Digital Lending Guidelines.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 2.5rem;">
                <!-- Column 1: Platform Overview -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 18px; padding: 2rem;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: #EFF6FF; color: #2563EB; margin-bottom: 1.25rem;">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #0F172A; margin-bottom: 0.75rem;">Digital Lending Service Provider (LSP)</h3>
                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1rem;">
                        <strong>Paisa in Minutes</strong> (paisainminutes.com) is an authorized digital loan facilitation platform and Lending Service Provider (LSP) operated by <strong>AdGrow Media Services</strong>, based in Delhi, India. We connect salaried individuals, self-employed professionals, and small business owners directly with RBI-registered Non-Banking Financial Companies (NBFCs) and commercial banks.
                    </p>
                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1rem;">
                        We are not a direct lender; instead, our algorithmic match engine evaluates customer eligibility criteria and pairs borrowers with the most suitable, transparent lending partner in minutes.
                    </p>
                    <p style="margin-top: 1rem; margin-bottom: 0;">
                        <a href="/about-us" style="color: #2563EB; font-weight: 700; text-decoration: underline; display: inline-flex; align-items: center; gap: 0.35rem;">
                            Learn more about Paisa in Minutes <span aria-hidden="true">&rarr;</span>
                        </a>
                    </p>
                </div>

                <!-- Column 2: Who is it for & Products -->
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 18px; padding: 2rem;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: #ECFDF5; color: #10B981; margin-bottom: 1.25rem;">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #0F172A; margin-bottom: 0.75rem;">Who is Paisa in Minutes For?</h3>
                    <p style="color: #475569; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1rem;">
                        Whether you need immediate cash for medical emergencies, home repairs, wedding expenses, education fees, or working capital for your business, Paisa in Minutes provides seamless access:
                    </p>
                    <ul style="color: #475569; font-size: 0.93rem; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 0;">
                        <li><strong>Personal Loans:</strong> ₹10,000 to ₹50 Lakh with 3 to 60-month tenures.</li>
                        <li><strong>Salaried Employees:</strong> Monthly income ₹20,000+ (metro) or ₹15,000+ (non-metro).</li>
                        <li><strong>Self-Employed:</strong> Small business owners and freelancers with digital bank records.</li>
                        <li><strong>100% Digital KYC:</strong> Paperless PAN &amp; Aadhaar verification with fast bank disbursal upon approval.</li>
                    </ul>
                </div>
            </div>

            <!-- Representative APR Worked Example (Google Financial Services Policy Compliant) -->
            <div style="margin-top: 2rem; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 18px; padding: 2rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #2563EB; color: #fff; font-weight: 800; font-size: 0.85rem;">ℹ</span>
                    <h3 style="font-size: 1.2rem; font-weight: 800; color: #1E3A8A; margin: 0;">Representative APR Example &amp; Transparent Terms</h3>
                </div>
                <p style="color: #1E40AF; font-size: 0.93rem; line-height: 1.7; margin-bottom: 1.25rem;">
                    In compliance with the Reserve Bank of India (RBI) Fair Practices Code and Google Financial Services Lending Policies, here are our standard loan parameters and a representative cost breakdown:
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
                    <div style="background: #ffffff; border: 1px solid #DBEAFE; border-radius: 12px; padding: 1rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Repayment Tenure</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">3 to 60 Months</div>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #DBEAFE; border-radius: 12px; padding: 1rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Annual Percentage Rate (APR)</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">10.49% to 24% p.a.</div>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #DBEAFE; border-radius: 12px; padding: 1rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Processing Fee</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-top: 0.25rem;">1% to 3% (+ GST)</div>
                    </div>
                    <div style="background: #ffffff; border: 1px solid #DBEAFE; border-radius: 12px; padding: 1rem;">
                        <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Upfront Fee Policy</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #16A34A; margin-top: 0.25rem;">₹0 (Zero Advance Fees)</div>
                    </div>
                </div>
                <div style="background: #ffffff; border: 1px solid #DBEAFE; border-radius: 12px; padding: 1.25rem; font-size: 0.9rem; color: #334155; line-height: 1.7;">
                    <strong>Representative Calculation:</strong> For a personal loan of <strong>₹1,00,000</strong> borrowed at <strong>10.49% p.a.</strong> for a tenure of <strong>12 months</strong>, with a processing fee of 2.0% (₹2,000 + ₹360 GST = ₹2,360 deducted upfront), the net disbursed amount is <strong>₹97,640</strong>. The monthly EMI is <strong>₹8,815</strong>, total interest payable is <strong>₹5,780</strong>, and the total repayable amount over 12 months is <strong>₹1,05,780</strong>.
                </div>
                <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-size: 0.88rem; color: #475569;">
                    <span>Regulated Partners:</span>
                    <a href="/our-partners" style="color: #2563EB; font-weight: 700; text-decoration: underline;">View RBI-Registered Partners</a>
                    <span>•</span>
                    <a href="/partner-terms" style="color: #2563EB; font-weight: 700; text-decoration: underline;">Partner Terms &amp; Conditions</a>
                    <span>•</span>
                    <a href="/about-us" style="color: #2563EB; font-weight: 700; text-decoration: underline;">About AdGrow Media Services</a>
                </div>
            </div>
        </div>
    </section>

    <!-- ELIGIBILITY CALCULATOR -->
    <section class="section section-bg" id="calculator">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Calculate EMI</span>
                <h2 class="section-title">Check Your Loan Eligibility</h2>
                <p class="section-subtitle">Slide parameters to determine estimates for required amount, repayment EMI, and borrowing limits.</p>
            </div>

            <div class="calc-grid reveal">
                <!-- Inputs column -->
                <div class="calc-inputs">
                    <h3 class="calc-title">Loan Parameters</h3>
                    
                    <!-- Loan Amount -->
                    <div class="calc-group">
                        <div class="calc-label-wrapper">
                            <span>Required Amount</span>
                            <span class="calc-value" id="loanAmountVal">₹1,00,000</span>
                        </div>
                        <label for="loanAmount" class="sr-only">Required Loan Amount</label>
                        <input type="range" class="calc-slider" id="loanAmount" min="10000" max="1000000" step="5000" value="100000" aria-label="Required Loan Amount" aria-valuemin="10000" aria-valuemax="1000000" aria-valuenow="100000">
                    </div>

                    <!-- Tenure -->
                    <div class="calc-group">
                        <div class="calc-label-wrapper">
                            <span>Repayment Tenure</span>
                            <span class="calc-value" id="tenureVal">12 Months</span>
                        </div>
                        <label for="tenure" class="sr-only">Repayment Tenure in Months</label>
                        <input type="range" class="calc-slider" id="tenure" min="3" max="60" step="1" value="12" aria-label="Repayment Tenure in Months" aria-valuemin="3" aria-valuemax="60" aria-valuenow="12">
                    </div>

                    <!-- Income select -->
                    <div class="calc-group">
                        <span class="calc-label-wrapper" style="margin-bottom: 0.75rem;">Your Monthly Income</span>
                        <div class="calc-options-grid">
                            <button type="button" class="calc-option-btn" data-income="20000" aria-label="Monthly income under 25,000 rupees">Under ₹25k</button>
                            <button type="button" class="calc-option-btn active" data-income="35000" aria-label="Monthly income 25,000 to 50,000 rupees" aria-pressed="true">₹25k - ₹50k</button>
                            <button type="button" class="calc-option-btn" data-income="60000" aria-label="Monthly income 50,000 rupees and above">₹50k+</button>
                        </div>
                    </div>
                </div>

                <!-- Outputs column -->
                <div class="calc-outputs">
                    <h3>Your Calculation Estimates</h3>

                    <div class="calc-result-box">
                        <div class="calc-result-label">ESTIMATED EMI / MONTH</div>
                        <div class="calc-result-val" id="emiResult">₹8,885</div>
                    </div>

                    <div class="calc-result-box">
                        <div class="calc-result-label">MAX ELIGIBLE LOAN LIMIT</div>
                        <div class="calc-result-val" id="eligibilityResult">₹5,25,000</div>
                    </div>

                    <div class="calc-note">*Calculated at an estimated starting interest rate of 10.99% p.a. Actual terms differ upon final verification.</div>
                    
                    <button type="button" class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);" aria-label="Apply for Disbursal Now">Get Disbursed Now</button>
                </div>
            </div>
        </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section" id="testimonials">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Success Stories</span>
                <h2 class="section-title">What Borrowers Are Saying</h2>
                <p class="section-subtitle">Read firsthand reviews from individuals who satisfied critical cash emergencies with our system.</p>
            </div>

            <div class="testimonials-slider-wrapper reveal">
                <div class="testimonials-track">
                    <!-- Slide 1 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"Paisa in Minutes lived up to its name perfectly. I had a medical emergency late at night, applied online, and the loan amount was in my bank account by early morning. Highly recommended!"</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">RK</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Rahul Kumar</div>
                                    <div class="testimonial-job">Software Engineer, Bangalore</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"The digital KYC process was extremely smooth. I didn't have to upload piles of physical documents. Repayment options are very flexible, and their support is excellent."</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">PS</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Priya Sharma</div>
                                    <div class="testimonial-job">Business Consultant, Delhi</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 3 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"Withdrawal is very simple. I took a Credit Line limit and only paid interest on the amount I transferred. Truly transparent, with zero hidden surprises or upfront processing fees."</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">AM</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Amit Mishra</div>
                                    <div class="testimonial-job">Retail Shop Owner, Mumbai</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 4 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"As a freelancer, getting approved for loans is usually a nightmare due to standard bank documentation rules. But Paisa in Minutes processed my request based on digital statements and approved a ₹1.5 Lakh limit in minutes!"</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">SP</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Sneha Patil</div>
                                    <div class="testimonial-job">UX Designer, Pune</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 5 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"I needed urgent funds to purchase inventory for my retail store before Diwali. Standard banks were taking days. The business loan option here was fast, collateral-free, and disbursed within 4 hours. Absolute lifesaver!"</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">RP</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Rajesh Patel</div>
                                    <div class="testimonial-job">Kirana Store Owner, Ahmedabad</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 6 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"Superb interface. Very clean steps. The customer support guided me when I had a query regarding E-mandate setup. Got ₹3,00,000 disbursed directly into my salary account in 2 hours."</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">VM</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Vikram Malhotra</div>
                                    <div class="testimonial-job">Marketing Manager, Hyderabad</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Slide 7 -->
                    <div class="testimonial-slide">
                        <div class="testimonial-card">
                            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
                            <p class="testimonial-quote">"I checked my free CIBIL score here first and then applied for a home loan top-up. The interest rates were much lower than what local brokers quoted. Fast verification and friendly process."</p>
                            <div class="testimonial-author-wrapper">
                                <div class="testimonial-avatar">DN</div>
                                <div class="testimonial-author-info">
                                    <div class="testimonial-name">Divya Nair</div>
                                    <div class="testimonial-job">Bank Analyst, Kochi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="slider-controls">
                    <button type="button" class="slider-btn" id="prevTestimonial" aria-label="Previous Testimonial">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="slider-dots" id="sliderDots" role="tablist" aria-label="Testimonial Navigation Dots"></div>
                    <button type="button" class="slider-btn" id="nextTestimonial" aria-label="Next Testimonial">
                        <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- POPULAR PERSONAL LOAN AMOUNTS & EMI CALCULATORS (Contextual Link Hub) -->
    <section class="section" id="loan-amounts-hub" style="background: #FFFFFF; padding: 4.5rem 0;">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Loan Tiers &amp; Planning</span>
                <h2 class="section-title">Explore Personal Loans by Amount &amp; Calculate EMIs</h2>
                <p class="section-subtitle">Choose from verified personal loan tiers starting @10.49% p.a. with transparent monthly EMI estimates.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2.5rem;">
                <div style="border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.75rem; background: #F8FAFC; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="color: #2563EB; font-weight: 700; font-size: 1.35rem; margin-bottom: 0.35rem;">₹5 Lakh Loan</div>
                    <div style="font-size: 0.88rem; color: #64748B; margin-bottom: 1rem;">Monthly EMI from <strong>₹10,744/mo</strong> (5 yrs @10.49%)</div>
                    <p style="font-size: 0.92rem; color: #334155; line-height: 1.6; margin-bottom: 1.25rem;">Ideal for home renovation, family medical emergencies, and wedding budget top-ups with paperless KYC.</p>
                    <a href="/5-lakh-personal-loan" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #1B2A6B; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        View ₹5 Lakh Loan Details &rarr;
                    </a>
                </div>

                <div style="border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.75rem; background: #F8FAFC; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="color: #2563EB; font-weight: 700; font-size: 1.35rem; margin-bottom: 0.35rem;">₹10 Lakh Loan</div>
                    <div style="font-size: 0.88rem; color: #64748B; margin-bottom: 1rem;">Monthly EMI from <strong>₹21,488/mo</strong> (5 yrs @10.49%)</div>
                    <p style="font-size: 0.92rem; color: #334155; line-height: 1.6; margin-bottom: 1.25rem;">Consolidate high-cost card debt or finance higher education and commercial workspace expansion.</p>
                    <a href="/10-lakh-personal-loan" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #1B2A6B; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        View ₹10 Lakh Loan Details &rarr;
                    </a>
                </div>

                <div style="border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.75rem; background: #F8FAFC; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="color: #2563EB; font-weight: 700; font-size: 1.35rem; margin-bottom: 0.35rem;">₹20 Lakh Loan</div>
                    <div style="font-size: 0.88rem; color: #64748B; margin-bottom: 1rem;">Monthly EMI from <strong>₹42,976/mo</strong> (5 yrs @10.49%)</div>
                    <p style="font-size: 0.92rem; color: #334155; line-height: 1.6; margin-bottom: 1.25rem;">High-ticket liquidity with flexible 12 to 60 months tenures, direct bank disbursal, and zero prepayment lock-in after 6 EMIs.</p>
                    <a href="/20-lakh-personal-loan" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #1B2A6B; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        View ₹20 Lakh Loan Details &rarr;
                    </a>
                </div>

                <div style="border: 1px solid #BFDBFE; border-radius: 16px; padding: 1.75rem; background: #EFF6FF; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                    <div style="color: #1E40AF; font-weight: 700; font-size: 1.35rem; margin-bottom: 0.35rem;">Personal Loan Hub</div>
                    <div style="font-size: 0.88rem; color: #3B82F6; margin-bottom: 1rem;">Complete Guide • Rates From 10.49% p.a.</div>
                    <p style="font-size: 0.92rem; color: #1E3A8A; line-height: 1.6; margin-bottom: 1.25rem;">Browse full eligibility rules, required documents, bank interest comparison, and multi-tenure EMI calculations.</p>
                    <a href="/personal-loan" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #1E40AF; font-weight: 700; text-decoration: none; font-size: 0.95rem;">
                        Explore Personal Loan Online &rarr;
                    </a>
                </div>
            </div>

            <div style="margin-top: 2rem; padding: 1.25rem 1.75rem; background: #F1F5F9; border-radius: 12px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
                <div style="font-size: 0.95rem; color: #334155;">
                    Looking to calculate exact monthly EMI before applying? Use our instant calculator:
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="/personal-loan-emi-calculator" class="btn btn-secondary" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">Personal Loan EMI Calculator</a>
                    <a href="/check-eligibility" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">Check Eligibility Online</a>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ SECTION (ACCORDION STYLE) -->
    <section class="section section-bg" id="faqs">
        <div class="container">
            <div class="section-title-wrapper text-center reveal">
                <span class="section-tag">Common Inquiries</span>
                <h2 class="section-title">Paisa in Minutes — Frequently Asked Questions</h2>
                <p class="section-subtitle">Find immediate answers to questions concerning loan rates, terms, parameters, and digital safety.</p>
            </div>

            <div class="faq-container reveal">
                <?php foreach ($page_faqs as $idx => $faq): ?>
                    <div class="faq-item">
                        <div class="faq-header" role="button" tabindex="0" aria-expanded="false">
                            <h3 class="faq-question"><?php echo htmlspecialchars($faq['question']); ?></h3>
                            <div class="faq-icon-wrapper">
                                <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                        <div class="faq-body">
                            <div class="faq-content">
                                <?php echo nl2br(htmlspecialchars($faq['answer'])); ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
            </div>
        </div>
    </section>

    <!-- FINAL CTA BANNER -->
    <section class="final-cta">
        <div class="container">
            <div class="final-cta-box reveal">
                <div class="final-cta-bg"></div>
                <h2 class="final-cta-title">Ready to Get Your Loan in Minutes?</h2>
                <p class="final-cta-desc">Join over 1 Lakh+ happy customers who trusted Paisa in Minutes for their emergency credit requirements. Experience fully digital, hassle-free lending.</p>
                <button type="button" class="btn btn-primary open-apply-modal" style="background: var(--white); color: var(--primary-color);" aria-label="Apply for Instant Loan">Apply Now</button>
            </div>
        </div>
    </section>

    <!-- SOCIAL PROOF NOTIFICATION TOAST -->
    <div class="notification-toast" id="notificationToast" role="status" aria-live="polite">
        <div class="toast-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="toast-content">
            <div class="toast-message" id="toastMessage">Rahul from Delhi just got ₹2,00,000 approved!</div>
            <div class="toast-time">Just now</div>
        </div>
        <button type="button" class="toast-close" id="toastClose" aria-label="Close notification">&times;</button>
    </div>

<?php include 'includes/footer.php'; ?>

