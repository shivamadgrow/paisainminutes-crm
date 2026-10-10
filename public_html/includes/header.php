<?php
// Set HTTP Security & Encoding Headers
if (!headers_sent()) {
    header("Content-Type: text/html; charset=utf-8");
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: SAMEORIGIN");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
}

require_once __DIR__ . '/affiliate_tracker.php';
require_once __DIR__ . '/../config/financials.php';
require_once __DIR__ . '/../config/env.php';
// Node server base URL (single backend). Pages call it directly from the browser or server-side with a short timeout.
$pim_node_api_url = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');

// Always use root-relative base path '/' for sitewide consistency across all URL depths
$base_path = '/';
$site_url = "https://paisainminutes.com";

// Determine current page slug and canonical URL dynamically
$current_script = $_SERVER['PHP_SELF'] ?? '';
$current_page = basename($current_script);

if ($current_page === 'index.php' || empty($current_page)) {
    $page_slug = "";
    if (!isset($canonical_url) || empty($canonical_url)) {
        $canonical_url = $site_url . "/";
    }
} else {
    $page_slug = str_replace('.php', '', $current_page);
    if (!isset($canonical_url) || empty($canonical_url)) {
        $canonical_url = $site_url . "/" . $page_slug;
    }
}

// Generate dynamic title, description, and keywords if not explicitly provided by page
$human_name = ucwords(str_replace(['-', '_'], ' ', $page_slug));
$acronyms = [
    '/\bEmi\b/i' => 'EMI',
    '/\bCibil\b/i' => 'CIBIL',
    '/\bSip\b/i' => 'SIP',
    '/\bFd\b/i' => 'FD',
    '/\bRd\b/i' => 'RD',
    '/\bNps\b/i' => 'NPS',
    '/\bGst\b/i' => 'GST',
    '/\bElss\b/i' => 'ELSS',
    '/\bMsme\b/i' => 'MSME',
    '/\bPmegp\b/i' => 'PMEGP',
    '/\bCrif\b/i' => 'CRIF',
    '/\bPan\b/i' => 'PAN',
    '/\bApp\b/i' => 'APP',
    '/\bCa\b/i' => 'CA',
    '/\bSbi\b/i' => 'SBI'
];
foreach ($acronyms as $pattern => $replacement) {
    $human_name = preg_replace($pattern, $replacement, $human_name);
}

// Determine Breadcrumb Category Hierarchy
$breadcrumb_parent = null;
if (!empty($page_slug)) {
    if (strpos($page_slug, 'calculator') !== false && $page_slug !== 'personal-loan-emi-calculator') {
        $breadcrumb_parent = ['name' => 'Calculators', 'url' => '/personal-loan-emi-calculator'];
    } elseif (preg_match('/-(thousand|lakh)-personal-loan$/', $page_slug) || (strpos($page_slug, 'personal-loan') === 0 && $page_slug !== 'personal-loan')) {
        $breadcrumb_parent = ['name' => 'Personal Loan', 'url' => '/personal-loan'];
    } elseif ((strpos($page_slug, 'cibil') !== false || strpos($page_slug, 'score') !== false) && $page_slug !== 'credit-score-free') {
        $breadcrumb_parent = ['name' => 'Credit Score', 'url' => '/credit-score-free'];
    } elseif (strpos($page_slug, 'bond') !== false && $page_slug !== 'bonds') {
        $breadcrumb_parent = ['name' => 'Bonds', 'url' => '/bonds'];
    } elseif (strpos($page_slug, 'mutual-fund') !== false && $page_slug !== 'mutual-funds') {
        $breadcrumb_parent = ['name' => 'Mutual Funds', 'url' => '/mutual-funds'];
    } elseif ((strpos($page_slug, 'fixed-deposit') !== false || strpos($page_slug, '-fd-') !== false) && $page_slug !== 'fixed-deposit-interest-rates') {
        $breadcrumb_parent = ['name' => 'Fixed Deposit', 'url' => '/fixed-deposit-interest-rates'];
    }
}


if (!isset($page_title) || empty($page_title)) {
    if (empty($page_slug)) {
        $page_title = "Paisa in Minutes | Instant Personal Loans Online";
    } else {
        $page_title = $human_name . " | Paisa in Minutes";
        if (mb_strlen($human_name) <= 22) {
            $page_title = $human_name . " Online | Paisa in Minutes";
        }
    }
}

if (!isset($page_description) || empty($page_description)) {
    if (empty($page_slug)) {
        $page_description = "Paisa in Minutes helps you explore personal loan offers online from RBI-regulated lending partners. Check eligibility and compare available loan options digitally.";
    } else {
        $clean_name = strtolower($human_name);
        $page_description = "Apply for " . $clean_name . " online starting @10.49% p.a. 100% digital approval, 2-hour disbursal & minimal paperwork. Trusted by 25,000+ happy borrowers.";
        if (mb_strlen($page_description) > 160) {
            $page_description = "Apply for " . $clean_name . " online @10.49% p.a. Fast 2-hour disbursal, 100% paperless KYC & instant digital approval via Paisa in Minutes.";
        }
    }
}

if (!isset($page_keywords) || empty($page_keywords)) {
    if (empty($page_slug)) {
        $page_keywords = "Paisa in Minutes, paisa in minutes loan, instant personal loan online, personal loan online, digital loan marketplace india, quick cash loan";
    } else {
        $page_keywords = strtolower($human_name) . ", instant loan, personal loan online, paisa in minutes, low interest loan, quick disbursal";
    }
}

if (!isset($page_og_image) || empty($page_og_image)) {
    $page_og_image = $site_url . "/assets/og-image.png";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?></title>
    
    <!-- SEO & Indexing Directives -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($page_keywords); ?>">
    <meta name="author" content="Paisa in Minutes">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="theme-color" content="#1B2A6B">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="google-site-verification" content="xfRUx1qKKF_kj4lGmFKPk16FiBt3ZwWtoqSgtaptE9M">
    
    <!-- Canonical & Alternate Localization -->
    <link rel="canonical" href="<?php echo $canonical_url; ?>">
    <link rel="alternate" hreflang="en-IN" href="<?php echo $canonical_url; ?>">
    <link rel="alternate" hreflang="x-default" href="<?php echo $canonical_url; ?>">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Paisa in Minutes">
    <meta property="og:url" content="<?php echo $canonical_url; ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($page_title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta property="og:image" content="<?php echo $page_og_image; ?>">
    <meta property="og:image:secure_url" content="<?php echo $page_og_image; ?>">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Paisa in Minutes - Instant Personal & Home Loans Online">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo $canonical_url; ?>">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($page_title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta name="twitter:image" content="<?php echo $page_og_image; ?>">
    <meta name="twitter:image:alt" content="Paisa in Minutes - Instant Personal & Home Loans Online">

    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2">
    <link rel="shortcut icon" type="image/png" href="/assets/logo.png?v=2">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png?v=2">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/logo.png?v=2">
    <link rel="apple-touch-icon" href="/assets/logo.png?v=2">

    <!-- High Priority Preloads & Resource Hints -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="/assets/logo_transparent.webp" as="image" type="image/webp" fetchpriority="high">
    <link rel="preload" href="<?php echo file_exists(__DIR__ . '/../css/style.min.css') ? '/css/style.min.css?v=' . filemtime(__DIR__ . '/../css/style.min.css') : '/css/style.css'; ?>" as="style">

    <!-- Zero-Render-Blocking Google Fonts (Inter & Poppins) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap">
    </noscript>

    <!-- Stylesheets (Minified Production Bundle with cache busting) -->
    <link rel="stylesheet" href="<?php echo file_exists(__DIR__ . '/../css/style.min.css') ? '/css/style.min.css?v=' . filemtime(__DIR__ . '/../css/style.min.css') : '/css/style.css?v=' . (file_exists(__DIR__ . '/../css/style.css') ? filemtime(__DIR__ . '/../css/style.css') : '1'); ?>">
    
    <!-- Google Tag Manager (Optimized User-Interaction Execution) -->
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    (function(){
        var gtmLoaded = false;
        var events = ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'];
        function loadGTM(){
            if (gtmLoaded) return;
            gtmLoaded = true;
            events.forEach(function(e){
                window.removeEventListener(e, loadGTM, { passive: true });
            });
            dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            var f = document.getElementsByTagName('script')[0];
            var j = document.createElement('script');
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-P8QSMXHR';
            f.parentNode.insertBefore(j, f);
        }
        events.forEach(function(e){
            window.addEventListener(e, loadGTM, { once: true, passive: true });
        });
        // 10s fallback for users who remain completely idle without interacting
        if ('requestIdleCallback' in window) {
            requestIdleCallback(function(){ setTimeout(loadGTM, 8000); });
        } else {
            setTimeout(loadGTM, 10000);
        }
    })();
    </script>
    <!-- End Google Tag Manager -->

    <script>
        window.site_base_path = "/";
        window.api_base_url = "/api";
        window.backend_server_url = <?php echo json_encode($pim_node_api_url); ?>;
        // OTP routes are served by the Node server directly (/api/auth/send-otp, /api/auth/verify-otp)
        window.otp_api_base_url = window.backend_server_url;
    </script>
    <!-- Marketing attribution (UTM, gclid/fbclid, referrer) - adds channel data to lead submissions -->
    <script src="/js/attribution.js?v=<?php echo @filemtime(__DIR__ . '/../js/attribution.js') ?: 1; ?>"></script>
    <!-- Device login for verified customers (OTP once per device; see js/pim-auth.js) -->
    <script src="/js/pim-auth.js?v=<?php echo @filemtime(__DIR__ . '/../js/pim-auth.js') ?: 1; ?>"></script>

    <!-- Comprehensive Agentic & SEO Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "additionalType": "https://schema.org/FinancialService",
          "@id": "https://paisainminutes.com/#organization",
          "name": "Paisa in Minutes",
          "alternateName": ["PaisaInMinutes", "paisainminutes.com", "Paisa In Minutes"],
          "legalName": "AdGrow Media Services",
          "url": "https://paisainminutes.com/",
          "logo": "https://paisainminutes.com/assets/logo.png",
          "image": "https://paisainminutes.com/assets/og-image.png",
          "description": "Paisa in Minutes is an authorized digital loan facilitation platform connecting borrowers with RBI-registered NBFCs and banks for personal loans and loan offers online.",
          "telephone": "+91-9990666578",
          "email": "info@paisainminutes.com",
          "priceRange": "₹",
          "currenciesAccepted": "INR",
          "paymentAccepted": "Cash, Credit Card, Bank Transfer, Net Banking, UPI",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Delhi",
            "addressCountry": "IN"
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+91-9990666578",
              "contactType": "customer support",
              "email": "info@paisainminutes.com",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            }
          ],
          "sameAs": [
            "https://adgrowmedia.in/",
            "https://www.facebook.com/profile.php?id=61594139144227",
            "https://www.instagram.com/paisainminutes",
            "https://www.linkedin.com/company/145200180/"
          ],
          "knowsAbout": [
            "Personal Loans",
            "Instant Cash Loans",
            "Credit Score",
            "CIBIL Score",
            "EMI Calculators",
            "Loan Eligibility"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://paisainminutes.com/#website",
          "url": "https://paisainminutes.com/",
          "name": "Paisa in Minutes",
          "alternateName": ["PaisaInMinutes", "paisainminutes.com"],
          "description": "Paisa in Minutes helps you explore personal loan offers online from RBI-regulated lending partners.",
          "publisher": {
            "@id": "https://paisainminutes.com/#organization"
          },
          "inLanguage": "en-IN"
        },
        {
          "@type": "WebPage",
          "@id": "<?php echo $canonical_url; ?>#webpage",
          "url": "<?php echo $canonical_url; ?>",
          "name": <?php echo json_encode($page_title); ?>,
          "description": <?php echo json_encode($page_description); ?>,
          "isPartOf": {
            "@id": "https://paisainminutes.com/#website"
          },
          "about": {
            "@id": "https://paisainminutes.com/#organization"
          },
          "inLanguage": "en-IN"
        },
        {
          "@type": "LoanOrCredit",
          "@id": "https://paisainminutes.com/#loanProduct",
          "name": "Instant Personal Loan Online",
          "description": "Instant digital personal loan approval up to ₹1 Lakh with minimal paperwork and 2-hour bank disbursal.",
          "provider": {
            "@id": "https://paisainminutes.com/#organization"
          },
          "annualPercentageRate": "10.49",
          "loanTerm": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 60,
            "unitCode": "MON"
          },
          "amount": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "minValue": 10000,
            "maxValue": 100000
          },
          "currency": "INR",
          "url": "https://paisainminutes.com/personal-loan"
        }
        <?php if (!empty($page_slug)): ?>,
        {
          "@type": "BreadcrumbList",
          "@id": "<?php echo $canonical_url; ?>#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://paisainminutes.com/"
            }
            <?php if (!empty($breadcrumb_parent)): ?>,
            {
              "@type": "ListItem",
              "position": 2,
              "name": "<?php echo htmlspecialchars($breadcrumb_parent['name']); ?>",
              "item": "https://paisainminutes.com<?php echo htmlspecialchars($breadcrumb_parent['url']); ?>"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "<?php echo htmlspecialchars($human_name); ?>",
              "item": "<?php echo $canonical_url; ?>"
            }
            <?php else: ?>,
            {
              "@type": "ListItem",
              "position": 2,
              "name": "<?php echo htmlspecialchars($human_name); ?>",
              "item": "<?php echo $canonical_url; ?>"
            }
            <?php endif; ?>
          ]
        }
        <?php endif; ?>
        <?php if (isset($page_faqs) && is_array($page_faqs) && count($page_faqs) > 0): ?>,
        {
          "@type": "FAQPage",
          "@id": "<?php echo $canonical_url; ?>#faq",
          "mainEntity": [
            <?php 
            $faq_items = [];
            foreach ($page_faqs as $faq) {
                $faq_items[] = '{
                  "@type": "Question",
                  "name": ' . json_encode($faq['question']) . ',
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": ' . json_encode($faq['answer']) . '
                  }
                }';
            }
            echo implode(',', $faq_items);
            ?>
          ]
        }
        <?php elseif (empty($page_slug)): ?>,
        {
          "@type": "FAQPage",
          "@id": "https://paisainminutes.com/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Paisa in Minutes?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Paisa in Minutes is an online financial marketplace connecting eligible borrowers with RBI-registered lenders for instant personal loans up to ₹1 Lakh with 100% paperless approval."
              }
            },
            {
              "@type": "Question",
              "name": "How fast will I receive loan disbursal?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Upon approval, the loan amount is directly disbursed into your bank account within 2 hours."
              }
            },
            {
              "@type": "Question",
              "name": "What documents are required for an instant loan?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Basic KYC documentation including your PAN Card, Aadhaar Card, and recent 3-month bank statement."
              }
            },
            {
              "@type": "Question",
              "name": "Is my personal & financial data safe?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, 100% of data is encrypted with 256-bit SSL bank-grade security and processed only with RBI-registered lenders."
              }
            }
          ]
        }
        <?php endif; ?>
      ]
    }
    </script>
</head>

<body>
    <!-- Accessibility Skip Link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8QSMXHR"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- STICKY HEADER -->
    <header class="header">
        <!-- Top Bar -->
        <div class="header-top">
            <div class="container">
                <div class="header-top-right">
                    <a href="tel:+919990666578" class="header-top-link" aria-label="Call Paisa in Minutes at +91 9990 666578">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.104-6.926-6.927l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.75z"/></svg>
                        +91 9990 666578
                    </a>
                    <span class="header-top-divider" aria-hidden="true">|</span>
                    <a href="mailto:info@paisainminutes.com" class="header-top-link" aria-label="Email Paisa in Minutes at info@paisainminutes.com">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                        info@paisainminutes.com
                    </a>
                </div>
            </div>
        </div>

        <!-- Main Bar -->
        <div class="header-main">
            <div class="container">
                <a href="/" class="logo" aria-label="Paisa in Minutes Home">
                    <img src="/assets/logo_transparent.webp" alt="Paisa in Minutes" width="110" height="110" fetchpriority="high" decoding="async">
                </a>

                <!-- Desktop Menu -->
                <nav class="nav" id="mainNav" aria-label="Main Navigation">
                    <!-- Credit Score Dropdown -->
                    <div class="nav-item dropdown">
                        <a href="javascript:void(0)" class="nav-link" role="button" aria-haspopup="true" aria-expanded="false" tabindex="0">Credit Score <span class="arrow-down" aria-hidden="true"></span></a>
                        <div class="dropdown-menu">
                            <div class="dropdown-menu-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 0115-6.708l-3.3 3.3a4.5 4.5 0 10-5.4 0L6 5.292A9 9 0 013 12zm9-4.5V12l3 3"/></svg>
                                Know Your Score
                            </div>
                            <a href="/credit-score-free">Credit Score FREE</a>
                            <a href="/free-cibil-score">FREE CIBIL Score</a>
                            <a href="/free-experian-score">FREE Experian Score</a>
                            <a href="/free-equifax-score">FREE Equifax Score</a>
                            <a href="/free-crif-score">FREE CRIF Score</a>
                            <a href="/cibil-score-check-by-pan-number">CIBIL Score Check by PAN Number</a>
                            <a href="/sbi-cibil-score">SBI CIBIL Score</a>
                            <a href="/how-to-increase-cibil-score">How to Increase CIBIL Score</a>
                            <a href="/cibil-score-for-personal-loan">CIBIL Score for Personal Loan</a>
                            <a href="/how-to-raise-and-resolve-cibil-dispute">How to Raise &amp; Resolve CIBIL Dispute</a>
                        </div>
                    </div>

                    <!-- Loans Dropdown -->
                    <div class="nav-item dropdown">
                        <a href="javascript:void(0)" class="nav-link" role="button" aria-haspopup="true" aria-expanded="false" tabindex="0">Loans <span class="arrow-down" aria-hidden="true"></span></a>
                        <div class="dropdown-menu dropdown-grid-3">
                            <!-- Col 1: Overview -->
                            <div class="dropdown-grid-col">
                                <div class="dropdown-grid-col-title">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    Personal Loan Overview
                                </div>
                                <a href="/personal-loan" class="dropdown-grid-link">Personal Loan</a>
                                <a href="/check-eligibility" class="dropdown-grid-link" style="color: #10B981 !important; font-weight: 700;">Check Loan Eligibility ⚡</a>
                                <a href="/pre-approved-personal-loan" class="dropdown-grid-link">Pre Approved Personal Loan</a>
                                <a href="/personal-loan-interest-rates" class="dropdown-grid-link">Personal Loan Interest Rates</a>
                                <a href="/personal-loan-app" class="dropdown-grid-link">Personal Loan APP</a>
                                <a href="/personal-loan-low-cibil-score" class="dropdown-grid-link">Personal Loan Low CIBIL Score</a>
                                <a href="/personal-loan-balance-transfer" class="dropdown-grid-link">Personal Loan Balance Transfer</a>
                                <a href="/instant-cash-loan" class="dropdown-grid-link">Instant Cash Loan</a>
                            </div>

                            <!-- Col 2: By Amount (Up to ₹1 Lakh) -->
                            <div class="dropdown-grid-col">
                                <div class="dropdown-grid-col-title">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 8h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    By Amount (Up to ₹1 Lakh)
                                </div>
                                <a href="/10-thousand-personal-loan" class="dropdown-grid-link">₹10,000 Personal Loan</a>
                                <a href="/25-thousand-personal-loan" class="dropdown-grid-link">₹25,000 Personal Loan</a>
                                <a href="/50-thousand-personal-loan" class="dropdown-grid-link">₹50,000 Personal Loan</a>
                                <a href="/75-thousand-personal-loan" class="dropdown-grid-link">₹75,000 Personal Loan</a>
                                <a href="/1-lakh-personal-loan" class="dropdown-grid-link">₹1,00,000 Personal Loan</a>
                            </div>

                            <!-- Col 3: By Type & Need -->
                            <div class="dropdown-grid-col">
                                <div class="dropdown-grid-col-title">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    By Type &amp; Need
                                </div>
                                <a href="/loan-for-salaried-employees" class="dropdown-grid-link">Loan for Salaried Employees</a>
                                <a href="/loan-for-self-employed" class="dropdown-grid-link">Loan for Self Employed</a>
                                <a href="/loan-for-senior-citizens" class="dropdown-grid-link">Loan For Senior Citizens</a>
                                <a href="/loan-for-students" class="dropdown-grid-link">Loan for Students</a>
                                <a href="/medical-loan" class="dropdown-grid-link">Medical Loan</a>
                                <a href="/wedding-loan" class="dropdown-grid-link">Wedding Loan</a>
                                <a href="/travel-loan" class="dropdown-grid-link">Travel Loan</a>
                                <a href="/overdraft-loan" class="dropdown-grid-link">Overdraft Loan</a>
                            </div>
                        </div>
                    </div>

                    <!-- Calculators Dropdown -->
                    <div class="nav-item dropdown">
                        <a href="javascript:void(0)" class="nav-link" role="button" aria-haspopup="true" aria-expanded="false" tabindex="0">Calculators <span class="arrow-down" aria-hidden="true"></span></a>
                        <div class="dropdown-menu dropdown-grid-2" style="min-width: 480px;">
                            <div class="dropdown-grid-col">
                                <div class="dropdown-grid-col-title">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.375c0-.966-.784-1.75-1.75-1.75s-1.75.784-1.75 1.75.784 1.75 1.75 1.75 1.75-.784 1.75-1.75zm-12 12c0-.966-.784-1.75-1.75-1.75S1.5 22.034 1.5 23s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75z"/></svg>
                                    Loan Calculators
                                </div>
                                <a href="/personal-loan-emi-calculator" class="dropdown-grid-link">Personal Loan EMI Calculator</a>
                                <a href="/personal-loan-eligibility-calculator" class="dropdown-grid-link">Personal Loan Eligibility</a>
                                <a href="/personal-loan-prepayment-calculator" class="dropdown-grid-link">Personal Loan Prepayment</a>
                            </div>
                            <div class="dropdown-grid-col">
                                <div class="dropdown-grid-col-title">
                                    <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Financial Planning Tools
                                </div>
                                <a href="/sip-calculator" class="dropdown-grid-link">SIP Calculator</a>
                                <a href="/fixed-deposit-calculator" class="dropdown-grid-link">Fixed Deposit Calculator</a>
                                <a href="/mutual-fund-calculator" class="dropdown-grid-link">Mutual Fund Calculator</a>
                                <a href="/nps-calculator" class="dropdown-grid-link">NPS Calculator</a>
                                <a href="/gst-calculator" class="dropdown-grid-link">GST Calculator</a>
                            </div>
                        </div>
                    </div>

                    <!-- Mobile only buttons -->
                    <div class="mobile-nav-buttons">
                        <a href="/apply-now" class="btn-accent" aria-label="Apply Now for Instant Loan">Apply Now</a>
                    </div>
                </nav>

                <div class="header-cta">
                    <a href="/apply-now" class="btn-accent" aria-label="Apply Now for Instant Loan">Apply Now</a>
                    <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu" aria-expanded="false" type="button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- VISIBLE BREADCRUMB BAR (Deep Pages Only) -->
    <?php if (!empty($page_slug)): ?>
    <nav class="site-breadcrumb-bar" aria-label="Breadcrumb">
        <div class="container">
            <ol class="site-breadcrumb-list">
                <li class="bc-item">
                    <a href="/"><svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="vertical-align: -2px; margin-right: 4px;" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>Home</a>
                </li>
                <li class="bc-sep" aria-hidden="true">/</li>
                <?php if (!empty($breadcrumb_parent)): ?>
                <li class="bc-item"><a href="<?php echo htmlspecialchars($breadcrumb_parent['url']); ?>"><?php echo htmlspecialchars($breadcrumb_parent['name']); ?></a></li>
                <li class="bc-sep" aria-hidden="true">/</li>
                <?php endif; ?>
                <li class="bc-item bc-active" aria-current="page"><?php echo htmlspecialchars($human_name); ?></li>
            </ol>
        </div>
    </nav>
    <?php endif; ?>

    <!-- MAIN LANDMARK (Semantic Wrapper for Sitewide Accessibility) -->
    <main id="main-content">
