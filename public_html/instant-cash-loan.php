<?php
/**
 * Paisa in Minutes - High-Converting Meta Ads Campaign Landing Page
 * URL: /instant-cash-loan
 * Target: Facebook & Meta Ads Traffic (Mobile-First Performance Marketing)
 * Loan Scope: Instant Cash Loans, Salary Advance, Emergency Loans up to ₹1,00,000
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/includes/affiliate_tracker.php';
require_once __DIR__ . '/config/env.php';
$partners = require __DIR__ . '/config/partners.php';

$pimNodeApi = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');
$affId = getPimAffiliateId();

// Pre-filter partners for Instant Cash / Short-Term loans up to ₹1,00,000
$campaignPartners = [];
foreach ($partners as $slug => $p) {
    // Only include partners offering loans up to ₹1 Lakh or short-term tenures
    $maxAmt = (int) preg_replace('/[^\d]/', '', $p['max_amount'] ?? '100000');
    if ($maxAmt <= 100000 || in_array($slug, ['rupay91', 'jhatpatloans', 'instarupees', 'udhaarnow', 'loanwithin', 'shubhcash', 'borrowera', 'easyfincare', 'ticket2loan'])) {
        $campaignPartners[$slug] = $p;
    }
}

// Canonical and OpenGraph URLs
$siteUrl = 'https://paisainminutes.com';
$canonicalUrl = $siteUrl . '/instant-cash-loan';
$pageTitle = 'Instant Loan Up to ₹1 Lakh | Check Loan Offers Online – Paisa in Minutes';
$pageDescription = 'Need cash for an urgent expense? Check loan offers up to ₹1 Lakh from RBI-registered lending partners. 100% digital, quick verification & secure online process.';
?>
<!DOCTYPE html>
<html lang="en-IN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($pageDescription); ?>">
    <link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl); ?>">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    
    <!-- Open Graph / Meta Ads Optimization -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($pageDescription); ?>">
    <meta property="og:image" content="<?php echo $siteUrl; ?>/assets/og-image.png">
    <meta property="og:site_name" content="Paisa in Minutes">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($pageDescription); ?>">
    <meta name="twitter:image" content="<?php echo $siteUrl; ?>/assets/og-image.png">
    
    <!-- Favicon & Brand Icons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=5">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico?v=5">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png?v=5">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png?v=5">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png?v=5">
    <link rel="shortcut icon" type="image/png" href="/assets/favicon-32x32.png?v=5">
    <meta name="theme-color" content="#1B2A6B">
    <meta name="color-scheme" content="light">

    <!-- Fonts: Inter & Poppins (Async non-blocking) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    </noscript>

    <!-- Global App & API Environment -->
    <script>
        window.site_base_path = "/";
        window.api_base_url = "/api";
        window.backend_server_url = <?php echo json_encode($pimNodeApi); ?>;
        window.otp_api_base_url = window.backend_server_url;
        window.PIM_AFFILIATE_ID = <?php echo json_encode($affId); ?>;
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
    </script>
    
    <!-- Marketing Attribution & Device Auth -->
    <script src="/js/attribution.js?v=<?php echo @filemtime(__DIR__ . '/js/attribution.js') ?: 1; ?>"></script>
    <script src="/js/pim-auth.js?v=<?php echo @filemtime(__DIR__ . '/js/pim-auth.js') ?: 1; ?>"></script>

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FinancialService",
          "@id": "https://paisainminutes.com/#organization",
          "name": "Paisa in Minutes",
          "alternateName": "PaisaInMinutes",
          "legalName": "AdGrow Media Services",
          "url": "https://paisainminutes.com/",
          "logo": "https://paisainminutes.com/assets/logo.png",
          "image": "https://paisainminutes.com/assets/og-image.png",
          "telephone": "+91-9990666578",
          "email": "info@paisainminutes.com",
          "priceRange": "₹",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Delhi",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "WebPage",
          "@id": "<?php echo $canonicalUrl; ?>#webpage",
          "url": "<?php echo $canonicalUrl; ?>",
          "name": <?php echo json_encode($pageTitle); ?>,
          "description": <?php echo json_encode($pageDescription); ?>,
          "isPartOf": { "@id": "https://paisainminutes.com/#website" }
        },
        {
          "@type": "FAQPage",
          "@id": "<?php echo $canonicalUrl; ?>#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How much loan can I apply for on this page?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "This dedicated instant loan service facilitates short-term personal and emergency loans from ₹10,000 up to ₹1,00,000 based on your income profile and credit assessment."
              }
            },
            {
              "@type": "Question",
              "name": "Does Paisa in Minutes provide loans directly?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Paisa in Minutes is an authorized digital loan facilitation platform (Lending Service Provider - LSP) operated by AdGrow Media Services. We partner exclusively with RBI-registered NBFCs and banks who disburse funds directly."
              }
            },
            {
              "@type": "Question",
              "name": "Will checking my loan offers affect my CIBIL score?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Checking preliminary eligibility through our platform does not negatively impact your credit score. Soft profile evaluations help prevent multiple hard inquiries on your bureau history."
              }
            },
            {
              "@type": "Question",
              "name": "Is loan approval 100% guaranteed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. All loan sanctions, interest rates, and disbursal decisions are subject to underwriting guidelines, KYC checks, and document verification by our regulated lending partners."
              }
            }
          ]
        }
      ]
    }
    </script>

    <style>
        /* ========================================================
           PAISA IN MINUTES - PERFORMANCE MARKETING DESIGN SYSTEM
           Clean, Trustworthy, Ultra-Fast, Mobile-First CRO Theme
           ======================================================== */
        :root {
            --pim-primary: #1B2A6B;
            --pim-primary-dark: #111A44;
            --pim-primary-light: #2A3F99;
            --pim-accent: #4A8DFF;
            --pim-accent-hover: #2970E6;
            --pim-accent-light: #EFF6FF;
            --pim-success: #10B981;
            --pim-success-dark: #059669;
            --pim-success-light: #ECFDF5;
            --pim-warning: #F59E0B;
            --pim-warning-light: #FFFBEB;
            --pim-danger: #EF4444;
            --pim-bg: #FFFFFF;
            --pim-bg-alt: #F8FAFC;
            --pim-bg-subtle: #F1F5F9;
            --pim-text-main: #0F172A;
            --pim-text-body: #334155;
            --pim-text-muted: #64748B;
            --pim-border: #E2E8F0;
            --pim-border-light: #F1F5F9;
            --pim-font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --pim-font-heading: 'Poppins', 'Inter', -apple-system, sans-serif;
            --pim-radius-sm: 8px;
            --pim-radius-md: 14px;
            --pim-radius-lg: 20px;
            --pim-radius-pill: 9999px;
            --pim-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
            --pim-shadow-md: 0 10px 25px -5px rgba(27, 42, 107, 0.08), 0 8px 10px -6px rgba(27, 42, 107, 0.04);
            --pim-shadow-lg: 0 20px 40px -10px rgba(27, 42, 107, 0.14);
            --pim-shadow-card: 0 12px 32px rgba(15, 23, 42, 0.07);
        }

        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            font-size: 16px;
            scroll-behavior: smooth;
            -webkit-text-size-adjust: 100%;
        }

        body {
            font-family: var(--pim-font-body);
            background-color: var(--pim-bg);
            color: var(--pim-text-body);
            line-height: 1.5;
            overflow-x: hidden;
            width: 100%;
        }

        .cro-container {
            width: 100%;
            max-width: 1140px;
            margin: 0 auto;
            padding: 0 1.25rem;
        }

        /* --- CRO MINIMAL HEADER --- */
        .cro-header {
            background: #FFFFFF;
            border-bottom: 1px solid var(--pim-border);
            padding: 0.85rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
        }

        .cro-header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1.25rem;
        }

        .cro-logo-link {
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            line-height: 1;
        }

        .cro-logo-img {
            height: 56px;
            width: auto;
            max-width: 220px;
            object-fit: contain;
            display: block;
            transition: transform 0.2s ease;
        }

        .cro-logo-link:hover .cro-logo-img {
            transform: scale(1.02);
        }

        .cro-header-apply-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            min-height: 44px;
            padding: 0.6rem 1.45rem;
            border-radius: var(--pim-radius-sm);
            font-family: var(--pim-font-body);
            font-size: 0.95rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            text-decoration: none;
            background: var(--pim-primary);
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(27, 42, 107, 0.18);
            border: 1px solid transparent;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }

        .cro-header-apply-btn:hover {
            background: var(--pim-primary-light);
            color: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(27, 42, 107, 0.26);
        }

        .cro-header-apply-btn:active {
            background: var(--pim-primary-dark);
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(27, 42, 107, 0.2);
        }

        .cro-header-apply-btn:focus-visible {
            outline: 2px solid var(--pim-accent);
            outline-offset: 2px;
        }

        @media (max-width: 991px) {
            .cro-logo-img {
                height: 50px;
            }
            .cro-header-apply-btn {
                min-height: 40px;
                padding: 0.5rem 1.25rem;
                font-size: 0.9rem;
            }
        }

        @media (max-width: 576px) {
            .cro-header {
                padding: 0.65rem 0;
            }
            .cro-logo-img {
                height: 44px;
            }
            .cro-header-apply-btn {
                min-height: 38px;
                padding: 0.45rem 1.15rem;
                font-size: 0.86rem;
                border-radius: 6px;
            }
        }

        @media (max-width: 360px) {
            .cro-logo-img {
                height: 38px;
            }
            .cro-header-apply-btn {
                min-height: 36px;
                padding: 0.4rem 0.95rem;
                font-size: 0.82rem;
            }
        }


        /* --- HERO SECTION --- */
        .cro-hero {
            background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);
            padding: 2.75rem 0 3.75rem 0;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid var(--pim-border-light);
        }

        .cro-hero-content {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .cro-campaign-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            background: var(--pim-accent-light);
            color: var(--pim-primary);
            border: 1px solid #BFDBFE;
            padding: 0.35rem 0.95rem;
            border-radius: var(--pim-radius-pill);
            font-size: 0.82rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            margin-bottom: 0.85rem;
        }

        .cro-hero-title {
            font-family: var(--pim-font-heading);
            font-size: clamp(2rem, 4.5vw, 3.1rem);
            font-weight: 800;
            color: var(--pim-primary);
            line-height: 1.15;
            letter-spacing: -0.025em;
            text-align: center;
            margin: 0 auto 0.75rem auto;
            max-width: 860px;
            width: 100%;
        }

        .cro-hero-title .cro-highlight {
            color: var(--pim-accent);
            display: inline;
        }

        .cro-hero-subtitle {
            font-size: clamp(0.95rem, 2vw, 1.12rem);
            color: var(--pim-text-body);
            line-height: 1.55;
            text-align: center;
            max-width: 680px;
            margin: 0 auto 1.25rem auto;
        }

        .cro-hero-bullets {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0.6rem 1.1rem;
            margin: 0 auto 1.25rem auto;
            max-width: 860px;
            padding: 0;
        }

        .cro-hero-bullet-item {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--pim-text-main);
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            padding: 0.35rem 0.85rem;
            border-radius: var(--pim-radius-pill);
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .cro-hero-bullet-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--pim-success-light);
            color: var(--pim-success-dark);
            flex-shrink: 0;
        }

        .cro-hero-trust-bar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            background: var(--pim-success-light);
            border: 1px solid #A7F3D0;
            color: #065F46;
            font-size: 0.8rem;
            font-weight: 700;
            padding: 0.45rem 1.1rem;
            border-radius: var(--pim-radius-pill);
            margin: 0 auto;
            max-width: 100%;
        }

        .cro-hero-trust-bar svg {
            flex-shrink: 0;
        }

        .cro-hero-form-wrapper {
            width: 100%;
            max-width: 520px;
            margin: 2rem auto 0 auto;
        }

        @media (max-width: 991px) {
            .cro-hero {
                padding: 2rem 0 3rem 0;
            }
            .cro-hero-title {
                font-size: clamp(1.85rem, 4vw, 2.4rem);
            }
            .cro-hero-form-wrapper {
                margin-top: 1.75rem;
            }
        }

        @media (max-width: 576px) {
            .cro-hero {
                padding: 1.5rem 0 2.25rem 0;
            }
            .cro-hero-title {
                font-size: clamp(1.65rem, 6vw, 2.1rem);
                line-height: 1.2;
            }
            .cro-hero-subtitle {
                font-size: 0.92rem;
                margin-bottom: 1rem;
            }
            .cro-hero-bullets {
                gap: 0.45rem 0.6rem;
                margin-bottom: 1rem;
            }
            .cro-hero-bullet-item {
                font-size: 0.78rem;
                padding: 0.28rem 0.65rem;
            }
            .cro-hero-trust-bar {
                font-size: 0.72rem;
                padding: 0.35rem 0.75rem;
                line-height: 1.35;
                text-align: center;
            }
            .cro-hero-form-wrapper {
                margin-top: 1.35rem;
            }
        }


        /* --- APPLICATION FORM CARD --- */
        .cro-form-card {
            background: #FFFFFF;
            border: 1px solid #D8E2EC;
            border-radius: var(--pim-radius-lg);
            padding: 2rem 1.85rem;
            box-shadow: var(--pim-shadow-card);
            position: relative;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        @media (max-width: 576px) {
            .cro-form-card {
                padding: 1.5rem 1.25rem;
                border-radius: var(--pim-radius-md);
            }
        }

        .cro-form-card-badge {
            position: absolute;
            top: -12px;
            right: 1.5rem;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: #FFFFFF;
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.25rem 0.75rem;
            border-radius: var(--pim-radius-pill);
            box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }

        .cro-form-header {
            margin-bottom: 1.25rem;
        }

        .cro-form-title {
            font-family: var(--pim-font-heading);
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--pim-primary);
            line-height: 1.25;
            margin-bottom: 0.3rem;
        }

        .cro-form-subtitle {
            font-size: 0.84rem;
            color: var(--pim-text-muted);
        }

        .cro-input-group {
            margin-bottom: 1.15rem;
        }

        .cro-input-label {
            display: block;
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--pim-text-main);
            margin-bottom: 0.4rem;
            text-transform: uppercase;
            letter-spacing: 0.02em;
        }

        .cro-phone-wrap {
            display: flex;
            align-items: center;
            border: 2px solid #CBD5E1;
            border-radius: var(--pim-radius-md);
            background: #FFFFFF;
            transition: all 0.2s ease;
            overflow: hidden;
        }

        .cro-phone-wrap:focus-within {
            border-color: var(--pim-accent);
            box-shadow: 0 0 0 4px rgba(74, 141, 255, 0.15);
        }

        .cro-phone-prefix {
            padding: 0 0.85rem;
            font-weight: 700;
            color: var(--pim-primary);
            font-size: 1.05rem;
            background: #F8FAFC;
            border-right: 1.5px solid #E2E8F0;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }

        .cro-phone-input {
            width: 100%;
            height: 52px;
            border: none;
            outline: none;
            padding: 0 0.95rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--pim-text-main);
            background: transparent;
            font-family: var(--pim-font-body);
        }

        .cro-phone-input::placeholder {
            color: #94A3B8;
            font-weight: 400;
            font-size: 0.95rem;
        }

        /* --- CONSENT CHECKBOXES --- */
        .cro-consent-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1.35rem;
        }

        .cro-consent-item {
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
            font-size: 0.76rem;
            line-height: 1.45;
            color: var(--pim-text-body);
            cursor: pointer;
            user-select: none;
        }

        .cro-checkbox {
            margin-top: 2px;
            width: 18px;
            height: 18px;
            border-radius: 4px;
            accent-color: var(--pim-primary);
            cursor: pointer;
            flex-shrink: 0;
        }

        .cro-consent-item a {
            color: var(--pim-accent);
            text-decoration: underline;
        }

        .cro-consent-item a:hover {
            color: var(--pim-primary);
        }

        .cro-bureau-consent-highlight {
            background: #F8FAFC;
            border: 1px solid var(--pim-border);
            padding: 0.65rem 0.85rem;
            border-radius: var(--pim-radius-sm);
        }

        /* --- PRIMARY CTA BUTTON --- */
        .cro-btn-primary {
            width: 100%;
            height: 54px;
            background: linear-gradient(135deg, #1B2A6B 0%, #2970E6 100%);
            color: #FFFFFF;
            border: none;
            border-radius: var(--pim-radius-pill);
            font-size: 1.05rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(27, 42, 107, 0.25);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .cro-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(27, 42, 107, 0.35);
        }

        .cro-btn-primary:active:not(:disabled) {
            transform: translateY(0);
        }

        .cro-btn-primary:disabled {
            opacity: 0.65;
            cursor: not-allowed;
            transform: none;
        }

        .cro-form-microcopy {
            margin-top: 0.95rem;
            font-size: 0.72rem;
            color: var(--pim-text-muted);
            text-align: center;
            line-height: 1.4;
        }

        .cro-form-status {
            display: none;
            margin-top: 0.75rem;
            padding: 0.65rem 0.85rem;
            border-radius: var(--pim-radius-sm);
            font-size: 0.82rem;
            font-weight: 600;
            text-align: center;
        }
        .cro-form-status.error {
            display: block;
            background: #FEF2F2;
            color: #B91C1C;
            border: 1px solid #FECACA;
        }
        .cro-form-status.info {
            display: block;
            background: #EFF6FF;
            color: #1D4ED8;
            border: 1px solid #BFDBFE;
        }

        /* --- INTERACTIVE FUNNEL STATES (Loading, Bureau, Offers) --- */
        .cro-funnel-panel {
            display: none;
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-lg);
            padding: 2.25rem 2rem;
            box-shadow: var(--pim-shadow-card);
            text-align: center;
        }

        .cro-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #E2E8F0;
            border-top: 4px solid var(--pim-accent);
            border-radius: 50%;
            animation: croSpin 0.8s linear infinite;
            margin: 0 auto 1.25rem auto;
        }

        @keyframes croSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .cro-applicant-banner {
            background: linear-gradient(135deg, #1B2A6B 0%, #111A44 100%);
            color: #FFFFFF;
            border-radius: var(--pim-radius-md);
            padding: 0.75rem 1.25rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.65rem;
            box-shadow: var(--pim-shadow-md);
        }

        .cro-applicant-info {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .cro-cibil-score-badge {
            background: #ECFDF5;
            color: #065F46;
            border: 1.5px solid #A7F3D0;
            font-weight: 800;
            padding: 0.25rem 0.75rem;
            border-radius: var(--pim-radius-pill);
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }

        /* --- DEDICATED CIBIL SCORE CARD (Placed Immediately Before Offers) --- */
        .cro-cibil-card-container {
            width: 100%;
            max-width: 540px;
            margin: 0 auto 2rem auto;
            padding: 0 0.5rem;
        }

        .cro-cibil-card {
            background: #FFFFFF;
            border: 2px solid #E2E8F0;
            border-radius: var(--pim-radius-lg);
            box-shadow: 0 10px 25px -5px rgba(27, 42, 107, 0.1), 0 8px 10px -6px rgba(27, 42, 107, 0.04);
            overflow: hidden;
            transition: all 0.25s ease;
        }

        .cro-cibil-card-top {
            background: linear-gradient(135deg, #1B2A6B 0%, #111A44 100%);
            color: #FFFFFF;
            padding: 0.75rem 1.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.82rem;
            font-weight: 600;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .cro-cibil-card-top .cro-cibil-applicant {
            display: flex;
            align-items: center;
            gap: 0.45rem;
        }

        .cro-cibil-card-top .cro-cibil-appid {
            background: rgba(255, 255, 255, 0.15);
            padding: 0.2rem 0.65rem;
            border-radius: var(--pim-radius-pill);
            font-size: 0.76rem;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .cro-cibil-card-body {
            padding: 1.75rem 1.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.65rem;
            background: radial-gradient(circle at 50% 25%, rgba(240, 253, 244, 0.65) 0%, #FFFFFF 72%);
        }

        .cro-cibil-badge-title {
            font-size: 0.8rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: var(--pim-text-muted);
            text-transform: uppercase;
        }

        .cro-cibil-score-val {
            font-family: var(--pim-font-heading);
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            font-weight: 800;
            color: #059669;
            line-height: 1;
            letter-spacing: -0.02em;
        }

        .cro-cibil-score-val.unavailable {
            font-size: clamp(1.2rem, 3.5vw, 1.55rem);
            color: #475569;
            font-weight: 700;
            letter-spacing: 0;
            margin: 0.5rem 0;
        }

        .cro-cibil-score-val.loading {
            font-size: clamp(1.05rem, 3vw, 1.35rem);
            color: #2563EB;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
            animation: croCibilPulse 1.6s ease-in-out infinite;
        }

        @keyframes croCibilPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.55; transform: scale(0.98); }
        }

        .cro-cibil-status-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: #ECFDF5;
            color: #065F46;
            border: 1.5px solid #A7F3D0;
            padding: 0.35rem 0.95rem;
            border-radius: var(--pim-radius-pill);
            font-size: 0.86rem;
            font-weight: 700;
            transition: all 0.2s ease;
        }

        .cro-cibil-status-tag.neutral {
            background: #EFF6FF;
            color: #1D4ED8;
            border-color: #BFDBFE;
        }

        .cro-cibil-status-tag.warning {
            background: #FFFBEB;
            color: #B45309;
            border-color: #FDE68A;
        }

        .cro-cibil-status-tag.loading {
            background: #EFF6FF;
            color: #1D4ED8;
            border-color: #BFDBFE;
        }

        .cro-cibil-bureau-note {
            margin-top: 0.4rem;
            padding-top: 0.85rem;
            border-top: 1px dashed #CBD5E1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            font-size: 0.82rem;
            flex-wrap: wrap;
        }

        .cro-cibil-bureau-label {
            color: var(--pim-text-muted);
            font-weight: 600;
        }

        .cro-cibil-bureau-val {
            color: var(--pim-primary);
            font-weight: 700;
        }

        @media (max-width: 576px) {
            .cro-cibil-card-container {
                max-width: 100%;
                padding: 0;
            }
            .cro-cibil-card {
                border-radius: var(--pim-radius-md);
            }
            .cro-cibil-card-body {
                padding: 1.4rem 1.15rem;
            }
        }

        /* --- LOAN OFFERS CONTAINER --- */
        .cro-offers-section {
            display: none;
            padding: 1.25rem 0 3.5rem 0;
            background: var(--pim-bg-alt);
            border-top: 1px solid var(--pim-border);
        }

        .cro-offers-header {
            text-align: center;
            max-width: 680px;
            margin: 0 auto 1rem auto;
        }

        .cro-offers-header h2 {
            font-family: var(--pim-font-heading);
            font-size: clamp(1.4rem, 2.5vw, 1.85rem);
            color: var(--pim-primary);
            font-weight: 800;
            margin-bottom: 0.3rem;
        }

        .cro-offers-header p {
            color: var(--pim-text-muted);
            font-size: 0.88rem;
        }

        .cro-filter-tabs {
            display: flex;
            justify-content: center;
            gap: 0.6rem;
            margin-bottom: 1.25rem;
            flex-wrap: wrap;
        }

        .cro-filter-tab {
            padding: 0.5rem 1.25rem;
            border-radius: var(--pim-radius-pill);
            border: 1.5px solid var(--pim-border);
            background: #FFFFFF;
            color: var(--pim-text-body);
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cro-filter-tab.active {
            background: var(--pim-primary);
            color: #FFFFFF;
            border-color: var(--pim-primary);
        }

        /* --- OFFERS GRID --- */
        .cro-offers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            align-items: stretch;
        }

        @media (max-width: 480px) {
            .cro-offers-grid {
                grid-template-columns: 1fr;
            }
        }

        .cro-offer-card {
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-lg);
            padding: 1.5rem;
            box-shadow: var(--pim-shadow-sm);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            transition: all 0.25s ease;
        }

        .cro-offer-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--pim-shadow-md);
            border-color: #BFDBFE;
        }

        .cro-offer-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            gap: 0.75rem;
        }

        .cro-offer-logo-box {
            height: 40px;
            width: auto;
            max-width: 140px;
            display: flex;
            align-items: center;
        }

        .cro-offer-logo-box img {
            max-height: 38px;
            max-width: 130px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
        }

        .cro-offer-badge-wrap {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }

        .cro-offer-badge {
            font-size: 0.7rem;
            font-weight: 800;
            padding: 0.25rem 0.6rem;
            border-radius: var(--pim-radius-pill);
            text-transform: uppercase;
            letter-spacing: 0.04em;
            background: #EFF6FF;
            color: #1D4ED8;
            border: 1px solid #BFDBFE;
            white-space: nowrap;
        }

        .cro-offer-rating {
            display: inline-flex;
            align-items: center;
            gap: 0.2rem;
            font-size: 0.75rem;
            font-weight: 700;
            color: #B45309;
            background: #FFFBEB;
            border: 1px solid #FDE68A;
            padding: 0.2rem 0.5rem;
            border-radius: var(--pim-radius-sm);
        }

        .cro-offer-match-pill {
            background: #ECFDF5;
            color: #065F46;
            border: 1px solid #A7F3D0;
            font-size: 0.76rem;
            font-weight: 700;
            padding: 0.35rem 0.65rem;
            border-radius: var(--pim-radius-sm);
            margin-bottom: 1.15rem;
            display: flex;
            align-items: center;
            gap: 0.35rem;
        }

        /* 3-Column Proportional Grid: MAX LOAN | INTEREST RATE | TENURE */
        .cro-metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr 1fr;
            gap: 0.4rem;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: var(--pim-radius-md);
            padding: 0.75rem 0.6rem;
            margin-bottom: 1.15rem;
            align-items: center;
        }

        .cro-metric-col {
            display: flex;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
        }

        .cro-metric-label {
            font-size: 0.64rem;
            font-weight: 800;
            color: var(--pim-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 0.2rem;
            white-space: nowrap;
        }

        .cro-metric-val {
            font-size: 0.85rem;
            font-weight: 800;
            color: var(--pim-text-main);
            line-height: 1.25;
            word-break: normal;
        }

        .cro-offer-brand {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        .cro-offer-lender-name {
            font-family: var(--pim-font-heading);
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--pim-primary);
            margin: 0;
            line-height: 1.25;
        }

        /* Transparent Cost Breakdown (Fee, GST, APR, Total Repayment) */
        .cro-cost-breakdown {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: var(--pim-radius-sm);
            padding: 0.65rem 0.75rem;
            margin-bottom: 1.15rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.78rem;
        }

        .cro-cost-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
        }

        .cro-cost-label {
            color: var(--pim-text-muted);
            font-weight: 600;
        }

        .cro-cost-val {
            color: var(--pim-text-main);
            font-weight: 700;
            text-align: right;
        }

        .cro-cost-row.cro-cost-repay {
            border-top: 1px dashed #CBD5E1;
            padding-top: 0.4rem;
            margin-top: 0.15rem;
        }

        .cro-cost-row.cro-cost-repay .cro-cost-label {
            color: var(--pim-primary);
            font-weight: 700;
        }

        .cro-cost-row.cro-cost-repay .cro-cost-val {
            color: var(--pim-primary);
            font-weight: 800;
            font-size: 0.8rem;
        }

        .cro-offer-features {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.45rem;
            margin-bottom: 1.35rem;
        }

        .cro-offer-feature-item {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.8rem;
            color: var(--pim-text-body);
        }

        .cro-offer-feature-item svg {
            color: var(--pim-success);
            flex-shrink: 0;
        }

        .cro-offer-cta {
            width: 100%;
            height: 48px;
            background: var(--pim-primary);
            color: #FFFFFF;
            text-decoration: none;
            border-radius: var(--pim-radius-pill);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            font-weight: 700;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(27, 42, 107, 0.2);
        }

        .cro-offer-cta:hover {
            background: var(--pim-accent);
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(74, 141, 255, 0.35);
        }

        /* --- 5 LOAN CATEGORIES SECTION --- */
        .cro-section {
            padding: 4rem 0;
            border-bottom: 1px solid var(--pim-border);
        }

        .cro-section-header {
            text-align: center;
            max-width: 680px;
            margin: 0 auto 2.5rem auto;
        }

        .cro-section-tag {
            display: inline-block;
            font-size: 0.76rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--pim-accent);
            background: var(--pim-accent-light);
            padding: 0.25rem 0.75rem;
            border-radius: var(--pim-radius-pill);
            margin-bottom: 0.6rem;
        }

        .cro-section-title {
            font-family: var(--pim-font-heading);
            font-size: clamp(1.6rem, 3.2vw, 2.25rem);
            color: var(--pim-primary);
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 0.5rem;
        }

        .cro-section-subtitle {
            color: var(--pim-text-muted);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .cro-categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.25rem;
        }

        .cro-cat-card {
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-md);
            padding: 1.5rem 1.25rem;
            text-align: center;
            transition: all 0.25s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .cro-cat-card:hover {
            border-color: var(--pim-accent);
            box-shadow: var(--pim-shadow-md);
            transform: translateY(-3px);
        }

        .cro-cat-icon-wrap {
            width: 54px;
            height: 54px;
            border-radius: 16px;
            background: var(--pim-accent-light);
            color: var(--pim-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            transition: all 0.2s ease;
        }

        .cro-cat-card:hover .cro-cat-icon-wrap {
            background: var(--pim-primary);
            color: #FFFFFF;
        }

        .cro-cat-title {
            font-family: var(--pim-font-heading);
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--pim-primary);
            margin-bottom: 0.4rem;
        }

        .cro-cat-desc {
            font-size: 0.82rem;
            color: var(--pim-text-muted);
            line-height: 1.5;
        }

        /* --- WHY PAISA IN MINUTES (BENEFITS) --- */
        .cro-benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .cro-benefit-card {
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-md);
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            transition: all 0.2s ease;
        }

        .cro-benefit-card:hover {
            border-color: #BFDBFE;
            box-shadow: var(--pim-shadow-sm);
        }

        .cro-benefit-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: var(--pim-success-light);
            color: var(--pim-success-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .cro-benefit-content h3 {
            font-size: 1rem;
            font-weight: 700;
            color: var(--pim-primary);
            margin-bottom: 0.3rem;
        }

        .cro-benefit-content p {
            font-size: 0.84rem;
            color: var(--pim-text-muted);
            line-height: 1.5;
        }

        /* --- HOW IT WORKS TIMELINE --- */
        .cro-steps-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            position: relative;
        }

        @media (max-width: 991px) {
            .cro-steps-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
            }
        }
        @media (max-width: 576px) {
            .cro-steps-grid {
                grid-template-columns: 1fr;
                gap: 1.25rem;
            }
        }

        .cro-step-card {
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-md);
            padding: 1.75rem 1.25rem;
            text-align: center;
            position: relative;
        }

        .cro-step-num {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: var(--pim-primary);
            color: #FFFFFF;
            font-size: 1rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem auto;
            box-shadow: 0 4px 10px rgba(27, 42, 107, 0.2);
        }

        .cro-step-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--pim-primary);
            margin-bottom: 0.4rem;
        }

        .cro-step-desc {
            font-size: 0.82rem;
            color: var(--pim-text-muted);
            line-height: 1.5;
        }

        /* --- TRUST & COMPLIANCE SECTION --- */
        .cro-compliance-card {
            background: #F8FAFC;
            border: 1px solid #CBD5E1;
            border-radius: var(--pim-radius-lg);
            padding: 2rem;
            margin: 3rem 0;
        }

        .cro-compliance-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #E2E8F0;
        }

        .cro-compliance-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 800;
            color: var(--pim-primary);
            font-size: 1.05rem;
        }

        .cro-compliance-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .cro-compliance-pill {
            background: #FFFFFF;
            border: 1px solid #CBD5E1;
            padding: 0.25rem 0.65rem;
            border-radius: var(--pim-radius-pill);
            font-size: 0.74rem;
            font-weight: 700;
            color: var(--pim-text-body);
        }

        .cro-compliance-body {
            font-size: 0.82rem;
            color: var(--pim-text-body);
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        /* --- FAQ ACCORDION --- */
        .cro-faq-list {
            max-width: 820px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .cro-faq-item {
            background: #FFFFFF;
            border: 1px solid var(--pim-border);
            border-radius: var(--pim-radius-md);
            overflow: hidden;
            transition: all 0.2s ease;
        }

        .cro-faq-header {
            padding: 1.15rem 1.35rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            cursor: pointer;
            user-select: none;
            background: #FFFFFF;
        }

        .cro-faq-question {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--pim-text-main);
            text-align: left;
            margin: 0;
        }

        .cro-faq-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--pim-accent);
            transition: transform 0.25s ease;
            flex-shrink: 0;
        }

        .cro-faq-item.active .cro-faq-icon {
            transform: rotate(180deg);
        }

        .cro-faq-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
            background: #F8FAFC;
        }

        .cro-faq-item.active .cro-faq-body {
            max-height: 400px;
            transition: max-height 0.3s ease-in-out;
            border-top: 1px solid var(--pim-border);
        }

        .cro-faq-content {
            padding: 1.15rem 1.35rem;
            font-size: 0.88rem;
            color: var(--pim-text-body);
            line-height: 1.6;
        }

        /* --- FINAL CTA BANNER --- */
        .cro-final-banner {
            background: linear-gradient(135deg, #1B2A6B 0%, #2970E6 100%);
            color: #FFFFFF;
            border-radius: var(--pim-radius-lg);
            padding: 3.5rem 2rem;
            text-align: center;
            margin: 3.5rem 0;
            box-shadow: var(--pim-shadow-lg);
        }

        .cro-final-banner h2 {
            font-family: var(--pim-font-heading);
            font-size: clamp(1.75rem, 3.5vw, 2.4rem);
            font-weight: 800;
            margin-bottom: 0.6rem;
            line-height: 1.2;
        }

        .cro-final-banner p {
            max-width: 580px;
            margin: 0 auto 1.75rem auto;
            font-size: 1.05rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .cro-final-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #FFFFFF;
            color: var(--pim-primary);
            font-size: 1.05rem;
            font-weight: 800;
            padding: 0.85rem 2.25rem;
            border-radius: var(--pim-radius-pill);
            text-decoration: none;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
        }

        .cro-final-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
            background: #F8FAFC;
        }

        /* --- CRO MINIMAL FOOTER --- */
        .cro-footer {
            background: #0F172A;
            color: #94A3B8;
            padding: 2.5rem 0 6rem 0; /* extra padding for sticky CTA */
            font-size: 0.8rem;
        }

        .cro-footer-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.25rem;
        }

        .cro-footer-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.25rem;
        }

        .cro-footer-links a {
            color: #CBD5E1;
            text-decoration: none;
            font-weight: 600;
        }

        .cro-footer-links a:hover {
            color: #FFFFFF;
            text-decoration: underline;
        }

        /* --- STICKY MOBILE CTA BAR --- */
        .cro-sticky-mobile-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: #FFFFFF;
            border-top: 1px solid var(--pim-border);
            padding: 0.75rem 1rem;
            box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.12);
            display: none;
        }

        @media (max-width: 768px) {
            .cro-sticky-mobile-bar {
                display: block;
            }
        }

        .cro-sticky-btn {
            width: 100%;
            height: 48px;
            background: linear-gradient(135deg, #1B2A6B 0%, #2970E6 100%);
            color: #FFFFFF;
            border: none;
            border-radius: var(--pim-radius-pill);
            font-size: 0.98rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(27, 42, 107, 0.25);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
    </style>
</head>
<body>

    <!-- ==========================================
         CRO HEADER (Enlarged Logo + Apply Now CTA)
         ========================================== -->
    <header class="cro-header">
        <div class="cro-container cro-header-inner">
            <a href="/" class="cro-logo-link" aria-label="Paisa in Minutes Homepage">
                <img src="/assets/logo.webp?v=5" alt="Paisa in Minutes" class="cro-logo-img" width="180" height="56" fetchpriority="high">
            </a>
            <a href="#formCardInitial" class="cro-header-apply-btn" id="headerApplyBtn" onclick="croSmoothScrollToForm(event)" aria-label="Apply Now for Instant Cash Loan">
                Apply Now
            </a>
        </div>
    </header>

    <main>
        <!-- ==========================================
             HERO SECTION + ABOVE-THE-FOLD FORM
             ========================================== -->
        <section class="cro-hero" id="applySection">
            <div class="cro-container">
                
                <!-- Centered Campaign Headline & Trust Hierarchy -->
                <div class="cro-hero-content">
                    <div class="cro-campaign-pill">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                        <span>Need Cash for an Urgent Expense?</span>
                    </div>

                    <h1 class="cro-hero-title">
                        Check Loan Offers <span class="cro-highlight">Up to ₹1 Lakh</span>
                    </h1>

                    <p class="cro-hero-subtitle">
                        Compare available loan options from our lending partners through a quick digital application.
                    </p>

                    <ul class="cro-hero-bullets">
                        <li class="cro-hero-bullet-item">
                            <span class="cro-hero-bullet-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <span>Digital Application</span>
                        </li>
                        <li class="cro-hero-bullet-item">
                            <span class="cro-hero-bullet-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <span>Multiple Lending Partners</span>
                        </li>
                        <li class="cro-hero-bullet-item">
                            <span class="cro-hero-bullet-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <span>Secure Application</span>
                        </li>
                        <li class="cro-hero-bullet-item">
                            <span class="cro-hero-bullet-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <span>Transparent Loan Terms</span>
                        </li>
                        <li class="cro-hero-bullet-item">
                            <span class="cro-hero-bullet-icon">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <span>Online Process</span>
                        </li>
                    </ul>

                    <div class="cro-hero-trust-bar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Connected with RBI-regulated lending partners</span>
                    </div>
                </div>

                <!-- Centered Application Form Card -->
                <div class="cro-hero-form-wrapper">
                    
                    <!-- Initial Step: Mobile Number & Consent -->
                    <div class="cro-form-card" id="formCardInitial">
                        <span class="cro-form-card-badge">Instant Match</span>
                        <div class="cro-form-header">
                            <h2 class="cro-form-title">Check Your Loan Eligibility</h2>
                            <p class="cro-form-subtitle">Enter your mobile number to check available loan options</p>
                        </div>

                        <form id="croApplicationForm" novalidate>
                            <div class="cro-input-group">
                                <label for="croMobileInput" class="cro-input-label">Mobile Number</label>
                                <div class="cro-phone-wrap">
                                    <span class="cro-phone-prefix">+91</span>
                                    <input type="tel" 
                                           id="croMobileInput" 
                                           name="phone" 
                                           class="cro-phone-input" 
                                           placeholder="Enter 10-digit mobile number" 
                                           maxlength="10" 
                                           inputmode="numeric" 
                                           autocomplete="tel" 
                                           required>
                                </div>
                            </div>

                            <div class="cro-consent-group">
                                <!-- Consent 1: Terms & Privacy -->
                                <label class="cro-consent-item">
                                    <input type="checkbox" id="consentTerms" class="cro-checkbox" required checked>
                                    <span>By continuing, you agree to our <a href="/terms-and-conditions" target="_blank">Terms &amp; Conditions</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a> and consent to receive communications regarding your application.</span>
                                </label>

                                <!-- Consent 2: Credit Information (Explicitly Unchecked by Default) -->
                                <label class="cro-consent-item cro-bureau-consent-highlight">
                                    <input type="checkbox" id="consentBureau" class="cro-checkbox">
                                    <span>I authorize Paisa in Minutes and its lending partners to obtain my credit information from authorized Credit Information Companies for the purpose of evaluating my loan eligibility.</span>
                                </label>
                            </div>

                            <button type="submit" class="cro-btn-primary" id="croSubmitBtn">
                                <span>Check My Loan Offers</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>

                            <div class="cro-form-status" id="croFormStatus" aria-live="polite"></div>

                            <p class="cro-form-microcopy">
                                Checking your options does not guarantee loan approval. Final approval, interest rate and disbursal are decided by the respective lender.
                            </p>
                        </form>
                    </div>

                    <!-- Funnel Panel: Loading & Bureau Analysis -->
                    <div class="cro-funnel-panel" id="panelLoading">
                        <div class="cro-spinner"></div>
                        <h3 style="font-family: var(--pim-font-heading); color: var(--pim-primary); font-size: 1.3rem; margin-bottom: 0.5rem;" id="loadingStatusHeading">Checking your eligibility...</h3>
                        <p style="color: var(--pim-text-muted); font-size: 0.9rem;" id="loadingStatusText">Securely querying authorized credit bureaus and matching active lending partners.</p>
                    </div>

                </div>

            </div>
        </section>

        <!-- ==========================================
             DYNAMIC LOAN OFFERS CONTAINER
             Revealed dynamically after verification
             ========================================== -->
        <section class="cro-offers-section" id="offersSection">
            <div class="cro-container">
                
                <!-- CIBIL SCORE CARD (Placed Immediately Before Loan Offers) -->
                <div class="cro-cibil-card-container" id="cibilCardContainer">
                    <div class="cro-cibil-card">
                        <div class="cro-cibil-card-top">
                            <div class="cro-cibil-applicant">
                                <span style="color: #10B981; font-size: 1rem;">●</span>
                                <span id="cibilCardPhone">+91 ******••••</span>
                            </div>
                            <span class="cro-cibil-appid" id="cibilCardAppId">Application ID: PIM-••••••</span>
                        </div>
                        <div class="cro-cibil-card-body">
                            <div class="cro-cibil-badge-title">YOUR CIBIL SCORE</div>
                            <div class="cro-cibil-score-val" id="cibilScoreNumber">—</div>
                            <div class="cro-cibil-status-tag" id="cibilStatusTag">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                <span id="cibilStatusText">Credit Score Checked ✓</span>
                            </div>
                            <div class="cro-cibil-bureau-note">
                                <span class="cro-cibil-bureau-label">Bureau Status:</span>
                                <span class="cro-cibil-bureau-val" id="cibilBureauStatus">Eligible for Income-Based Disbursal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cro-offers-header">
                    <span class="cro-section-tag">Matched Lending Partners</span>
                    <h2>Loan Offers Matched for You</h2>
                    <p>Based on the information provided, these lending partners have available options for you up to ₹1,00,000.</p>
                </div>

                <!-- Offers Filter Bar -->
                <div class="cro-filter-tabs">
                    <button class="cro-filter-tab active" onclick="croFilterOffers('all', this)">All Available Lenders</button>
                    <button class="cro-filter-tab" onclick="croFilterOffers('instant', this)">⚡ Fast Approval Lenders</button>
                </div>

                <!-- Dynamic Lender Grid (From config/partners.php) -->
                <div class="cro-offers-grid" id="offersGrid">
                    <?php 
                    foreach ($campaignPartners as $slug => $p): 
                        $partnerName = htmlspecialchars($p['name'] ?? ucfirst($slug));
                        $badgeText = htmlspecialchars($p['badge_text'] ?? $p['badge'] ?? 'Direct Application');
                        $rating = htmlspecialchars($p['rating'] ?? '4.8');
                        $maxAmount = htmlspecialchars($p['max_amount'] ?? '₹1,00,000');
                        $interestRate = htmlspecialchars($p['interest_rate'] ?? 'From 0.8% / day');
                        $tenure = htmlspecialchars($p['tenure'] ?? '30 - 90 Days');
                        $apr = htmlspecialchars($p['apr'] ?? '14% – 24% p.a.');
                        $processingFee = htmlspecialchars($p['processing_fee'] ?? '1% – 3% of loan amount');
                        $gst = htmlspecialchars($p['gst'] ?? '18% on Processing Fee');
                        $totalRepayment = htmlspecialchars($p['total_repayment'] ?? 'Calculated per sanctioned terms');
                        
                        // Clean static asset image path (avoids megabytes of Base64 HTML overhead)
                        $staticLogo = '/assets/' . $slug . '.png';
                        $logo = file_exists(__DIR__ . $staticLogo) ? $staticLogo : (!empty($p['logo']) && strpos($p['logo'], 'data:') === false ? $p['logo'] : $staticLogo);
                        $partnerType = ($p['badge_type'] === 'instant' || $p['badge_icon'] === 'zap') ? 'instant' : 'regular';
                    ?>
                    <div class="cro-offer-card" data-partner-type="<?php echo $partnerType; ?>">
                        <div>
                            <div class="cro-offer-top">
                                <div class="cro-offer-brand">
                                    <div class="cro-offer-logo-box">
                                        <img src="<?php echo $logo; ?>" alt="<?php echo $partnerName; ?>" loading="lazy" width="120" height="36">
                                    </div>
                                    <h3 class="cro-offer-lender-name"><?php echo $partnerName; ?></h3>
                                </div>
                                <div class="cro-offer-badge-wrap">
                                    <span class="cro-offer-badge"><?php echo $badgeText; ?></span>
                                    <span class="cro-offer-rating">★ <?php echo $rating; ?></span>
                                </div>
                            </div>

                            <div class="cro-offer-match-pill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                <span>Matched for your profile</span>
                            </div>

                            <!-- 3-Column Metrics Grid -->
                            <div class="cro-metrics-grid">
                                <div class="cro-metric-col">
                                    <span class="cro-metric-label">MAX LOAN</span>
                                    <span class="cro-metric-val highlight"><?php echo $maxAmount; ?></span>
                                </div>
                                <div class="cro-metric-col">
                                    <span class="cro-metric-label">INTEREST RATE</span>
                                    <span class="cro-metric-val"><?php echo $interestRate; ?></span>
                                </div>
                                <div class="cro-metric-col">
                                    <span class="cro-metric-label">TENURE</span>
                                    <span class="cro-metric-val"><?php echo $tenure; ?></span>
                                </div>
                            </div>

                            <!-- Cost Breakdown: Processing Fee, GST, APR, Total Repayment -->
                            <div class="cro-cost-breakdown">
                                <div class="cro-cost-row">
                                    <span class="cro-cost-label">Processing Fee:</span>
                                    <span class="cro-cost-val"><?php echo $processingFee; ?></span>
                                </div>
                                <div class="cro-cost-row">
                                    <span class="cro-cost-label">Applicable GST:</span>
                                    <span class="cro-cost-val"><?php echo $gst; ?></span>
                                </div>
                                <div class="cro-cost-row">
                                    <span class="cro-cost-label">Indicative APR:</span>
                                    <span class="cro-cost-val"><?php echo $apr; ?></span>
                                </div>
                                <div class="cro-cost-row cro-cost-repay">
                                    <span class="cro-cost-label">Total Repayment:</span>
                                    <span class="cro-cost-val"><?php echo $totalRepayment; ?></span>
                                </div>
                            </div>

                            <!-- Features List -->
                            <ul class="cro-offer-features">
                                <?php foreach (array_slice($p['features'] ?? [], 0, 3) as $feat): ?>
                                <li class="cro-offer-feature-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    <span><?php echo htmlspecialchars($feat); ?></span>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>

                        <!-- Apply Button via Tracked Node Redirect -->
                        <a href="<?php echo htmlspecialchars($pimNodeApi); ?>/api/public/redirect/<?php echo urlencode($slug); ?>?ref=<?php echo urlencode($affId); ?>&source=instant_cash_loan" 
                           target="_blank" 
                           rel="noopener" 
                           class="cro-offer-cta"
                           data-partner-slug="<?php echo htmlspecialchars($slug); ?>"
                           onclick="croTrackOfferClick('<?php echo htmlspecialchars($slug); ?>')">
                            <span>View Offer</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                    <?php endforeach; ?>
                </div>

            </div>
        </section>

        <!-- ==========================================
             LOAN CATEGORIES SECTION (5 USE CASES ONLY)
             ========================================== -->
        <section class="cro-section">
            <div class="cro-container">
                <div class="cro-section-header">
                    <span class="cro-section-tag">Urgent Financial Support</span>
                    <h2 class="cro-section-title">Find the Right Loan for Your Need</h2>
                    <p class="cro-section-subtitle">Designed specifically for quick personal requirements up to ₹1 Lakh with minimal documentation.</p>
                </div>

                <div class="cro-categories-grid">
                    
                    <!-- 1. Instant Cash -->
                    <div class="cro-cat-card">
                        <div class="cro-cat-icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                <circle cx="12" cy="12" r="2"></circle>
                                <path d="M6 12h.01M18 12h.01"></path>
                            </svg>
                        </div>
                        <h3 class="cro-cat-title">Instant Cash</h3>
                        <p class="cro-cat-desc">Direct bank account credit within minutes to handle unplanned liquid cash needs.</p>
                    </div>

                    <!-- 2. Salary Advance -->
                    <div class="cro-cat-card">
                        <div class="cro-cat-icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <h3 class="cro-cat-title">Salary Advance</h3>
                        <p class="cro-cat-desc">Bridge the mid-month cash crunch before your monthly salary paycheck arrives.</p>
                    </div>

                    <!-- 3. Emergency Loan -->
                    <div class="cro-cat-card">
                        <div class="cro-cat-icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h3 class="cro-cat-title">Emergency Loan</h3>
                        <p class="cro-cat-desc">Rapid assistance to manage sudden medical bills, vehicle repairs, or urgent household costs.</p>
                    </div>

                    <!-- 4. Short-Term Loan -->
                    <div class="cro-cat-card">
                        <div class="cro-cat-icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h3 class="cro-cat-title">Short-Term Loan</h3>
                        <p class="cro-cat-desc">Quick borrowing without tying yourself into multi-year recurring debt commitments.</p>
                    </div>

                    <!-- 5. Payday Loan -->
                    <div class="cro-cat-card">
                        <div class="cro-cat-icon-wrap">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                <path d="M18 12a2 2 0 0 0 0 4h4v-4z"></path>
                            </svg>
                        </div>
                        <h3 class="cro-cat-title">Payday Loan</h3>
                        <p class="cro-cat-desc">Fast collateral-free personal credit line designed to support you till the next month.</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==========================================
             WHY USE PAISA IN MINUTES (BENEFITS)
             ========================================== -->
        <section class="cro-section" style="background: var(--pim-bg-alt);">
            <div class="cro-container">
                <div class="cro-section-header">
                    <span class="cro-section-tag">Trusted Platform</span>
                    <h2 class="cro-section-title">Why Check Loan Offers with Paisa in Minutes?</h2>
                    <p class="cro-section-subtitle">We simplify personal financing by connecting you directly to verified, RBI-registered lending institutions.</p>
                </div>

                <div class="cro-benefits-grid">
                    
                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Digital Application</h3>
                            <p>Complete the entire process from your smartphone without physical paper forms or branch queues.</p>
                        </div>
                    </div>

                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Multiple Lending Partners</h3>
                            <p>Access multiple regulated NBFCs in a single digital session to compare approved limits and rates.</p>
                        </div>
                    </div>

                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Quick Eligibility Check</h3>
                            <p>Get evaluated in under 2 minutes so you only spend time applying where you qualify.</p>
                        </div>
                    </div>

                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Secure Application Process</h3>
                            <p>Your personal data is encrypted with 256-bit SSL encryption and handled under strict data privacy standards.</p>
                        </div>
                    </div>

                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Compare Available Options</h3>
                            <p>Clear view of loan amounts, daily/monthly interest, and tenures with zero hidden fee surprises.</p>
                        </div>
                    </div>

                    <div class="cro-benefit-card">
                        <div class="cro-benefit-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                        </div>
                        <div class="cro-benefit-content">
                            <h3>Simple Online Process</h3>
                            <p>No complicated financial jargon. A clean, seamless user journey built for quick execution.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==========================================
             HOW IT WORKS (4-STEP VISUAL TIMELINE)
             ========================================== -->
        <section class="cro-section">
            <div class="cro-container">
                <div class="cro-section-header">
                    <span class="cro-section-tag">Step-by-Step Flow</span>
                    <h2 class="cro-section-title">How It Works</h2>
                    <p class="cro-section-subtitle">Get matched with suitable loan options in 4 transparent steps.</p>
                </div>

                <div class="cro-steps-grid">
                    
                    <div class="cro-step-card">
                        <div class="cro-step-num">01</div>
                        <h3 class="cro-step-title">Enter Mobile Number</h3>
                        <p class="cro-step-desc">Provide your 10-digit mobile number above to begin your digital check.</p>
                    </div>

                    <div class="cro-step-card">
                        <div class="cro-step-num">02</div>
                        <h3 class="cro-step-title">Verify OTP &amp; Consent</h3>
                        <p class="cro-step-desc">Confirm your number with a 6-digit SMS code and authorize profile evaluation.</p>
                    </div>

                    <div class="cro-step-card">
                        <div class="cro-step-num">03</div>
                        <h3 class="cro-step-title">Check Credit &amp; Eligibility</h3>
                        <p class="cro-step-desc">Our backend securely queries credit bureaus to identify pre-matched lenders.</p>
                    </div>

                    <div class="cro-step-card">
                        <div class="cro-step-num">04</div>
                        <h3 class="cro-step-title">View Matched Offers</h3>
                        <p class="cro-step-desc">Compare partner offers up to ₹1 Lakh and complete your application directly.</p>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==========================================
             TRUST & REGULATORY COMPLIANCE SECTION
             ========================================== -->
        <section class="cro-container">
            <div class="cro-compliance-card">
                <div class="cro-compliance-header">
                    <div class="cro-compliance-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <polyline points="9 12 11 14 15 10"></polyline>
                        </svg>
                        <span>Regulatory &amp; Lending Marketplace Disclosure</span>
                    </div>
                    <div class="cro-compliance-tags">
                        <span class="cro-compliance-pill">RBI Regulated NBFC Partners</span>
                        <span class="cro-compliance-pill">Zero Upfront Advance Fees</span>
                        <span class="cro-compliance-pill">256-Bit SSL Encrypted</span>
                    </div>
                </div>

                <div class="cro-compliance-body">
                    <p>
                        <strong>About Our Platform:</strong> Paisa in Minutes is a digital loan facilitation platform (Lending Service Provider - LSP) owned and operated by <strong>AdGrow Media Services</strong>. We are not a bank or Non-Banking Financial Company (NBFC) and do not directly lend money to consumers. We connect prospective applicants with RBI-registered NBFCs and Scheduled Commercial Banks.
                    </p>
                    <p>
                        <strong>Approval &amp; Disbursal Terms:</strong> Loan approval, interest rates, processing fees, repayment tenures, and disbursals are determined solely at the discretion of the partner lending institutions based on applicant risk profiling, documentation, and credit assessment. Checking options on this website does not guarantee loan approval or immediate credit sanction.
                    </p>
                    <p>
                        <strong>Google Financial Services Lending Policy Compliance:</strong>
                        <br>&bull; <strong>Repayment Tenure:</strong> Dynamic repayment periods ranging from 30 to 180 days for short-term personal credit options, extending up to 60 months depending on the matched partner product. We strictly prohibit deceptive loan terms.
                        <br>&bull; <strong>Annual Percentage Rate (APR):</strong> Indicative APR ranges from 14% p.a. to 24% p.a. based on partner credit risk evaluation and bureau profile.
                        <br>&bull; <strong>Representative Worked Example:</strong> For a personal loan of ₹50,000 borrowed for a tenure of 90 days (3 months) at an indicative APR of 18% p.a.:
                        <br>&nbsp;&nbsp;&bull; Loan Principal: ₹50,000
                        <br>&nbsp;&nbsp;&bull; Repayment Tenure: 90 days (3 months)
                        <br>&nbsp;&nbsp;&bull; Indicative APR: 18% p.a.
                        <br>&nbsp;&nbsp;&bull; Total Interest Payable: ₹2,250 (calculated as ₹50,000 × 18% × 90 / 360 days)
                        <br>&nbsp;&nbsp;&bull; Processing Fee (2%): ₹1,000
                        <br>&nbsp;&nbsp;&bull; Applicable GST (18% on Processing Fee): ₹180
                        <br>&nbsp;&nbsp;&bull; Total Upfront Deductibles: ₹1,180
                        <br>&nbsp;&nbsp;&bull; Net Disbursed Amount: ₹48,820 (₹50,000 – ₹1,180)
                        <br>&nbsp;&nbsp;&bull; Total Repayment Amount: ₹52,250 (Principal ₹50,000 + Total Interest ₹2,250)
                        <br><em>Note: Actual rates, fees, and repayment schedules depend on applicant credit assessment and are confirmed directly by the chosen lending partner prior to agreement execution.</em>
                    </p>
                    <p>
                        <strong>Zero Upfront Fee Policy:</strong> Paisa in Minutes never asks applicants for upfront registration fees, security deposits, or advance processing charges via personal UPI or bank accounts. Beware of fraudulent impostors.
                    </p>
                </div>
            </div>
        </section>

        <!-- ==========================================
             FAQ SECTION (ACCORDION)
             ========================================== -->
        <section class="cro-section" style="background: var(--pim-bg-alt);" id="faqSection">
            <div class="cro-container">
                <div class="cro-section-header">
                    <span class="cro-section-tag">Frequently Asked Questions</span>
                    <h2 class="cro-section-title">Have Questions? We’re Here to Help</h2>
                    <p class="cro-section-subtitle">Transparent answers about our loan facilitation process and partner guidelines.</p>
                </div>

                <div class="cro-faq-list">
                    
                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">1. How much can I borrow?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                You can check available loan options from ₹10,000 up to ₹1,00,000 on this instant cash campaign. Final borrowing limits are determined by the lending partner based on your income profile and credit assessment.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">2. What interest rate will I get?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Interest rates are set directly by partner lenders based on your creditworthiness, starting from 14% to 24% p.a. (or starting from 0.8% per day for short-term products). All rates are disclosed in the lender contract before acceptance.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">3. What fees apply?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Partner processing fees typically range between 1% to 3% of the sanctioned loan amount, plus standard 18% GST on the fee. Paisa in Minutes does not charge any upfront or advance fee to check your offers.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">4. How is eligibility checked?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Eligibility is evaluated digitally based on your mobile verification, authorized bureau check, employment status, and the underwriting criteria of our connected RBI-regulated partners.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">5. Will my credit score be checked?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Yes, with your explicit authorization. A credit inquiry is performed via authorized Credit Information Companies to match you with appropriate lender options without unnecessary multiple hard inquiries.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">6. Does Paisa in Minutes lend directly?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                No. Paisa in Minutes is a digital loan facilitation platform (Lending Service Provider - LSP). Loan approval, sanction, and disbursal are executed directly by RBI-registered NBFCs and banks.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">7. Is loan approval guaranteed?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                No. Approval is never guaranteed. All loan sanctions are subject to successful KYC verification, profile assessment, and lender underwriting discretion.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">8. What documents are required?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Standard digital requirements include PAN Card, Aadhaar (linked to your mobile number for online e-KYC), and recent 3-month bank statement or net banking verification.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">9. How long does repayment take?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Repayment tenures vary dynamically by lender and product, typically ranging from 30 to 180 days for short-term credit, with extended terms available on qualifying multi-month products.
                            </div>
                        </div>
                    </div>

                    <div class="cro-faq-item">
                        <div class="cro-faq-header" role="button" tabindex="0">
                            <h3 class="cro-faq-question">10. How do I check my loan offers?</h3>
                            <span class="cro-faq-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></span>
                        </div>
                        <div class="cro-faq-body">
                            <div class="cro-faq-content">
                                Simply enter your 10-digit mobile number in the application card above, complete the 6-digit OTP verification, and review your matched options on screen in under 2 minutes.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ==========================================
             FINAL CTA BANNER
             ========================================== -->
        <section class="cro-container">
            <div class="cro-final-banner">
                <h2>Need Immediate Cash Assistance?</h2>
                <p>Check your loan offers up to ₹1 Lakh in under 2 minutes with zero physical paperwork.</p>
                <a href="#applySection" class="cro-final-btn" onclick="croSmoothScrollToForm(event)">
                    <span>Check My Loan Offers</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
        </section>
    </main>

    <!-- ==========================================
             CRO MINIMAL FOOTER
             ========================================== -->
    <footer class="cro-footer">
        <div class="cro-container cro-footer-inner">
            <a href="/" aria-label="Paisa in Minutes">
                <img src="/assets/logo.webp" alt="Paisa in Minutes" style="height: 38px; width: auto; opacity: 0.85;" loading="lazy">
            </a>
            <div class="cro-footer-links">
                <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                <a href="/terms-and-conditions" target="_blank">Terms &amp; Conditions</a>
                <a href="/partner-terms" target="_blank">Partner T&amp;C</a>
                <a href="/about-us" target="_blank">About Us</a>
                <a href="/contact-us" target="_blank">Contact Us</a>
            </div>
            <p style="color: #64748B; font-size: 0.76rem; max-width: 650px; line-height: 1.5;">
                &copy; <?php echo date('Y'); ?> Paisa in Minutes. All rights reserved by <a href="https://adgrowmedia.in/" target="_blank" rel="noopener noreferrer" style="color: #94A3B8; text-decoration: underline;">AdGrow Media Services</a>.
                <br>Lending marketplace connecting borrowers with RBI-registered lenders.
            </p>
        </div>
    </footer>

    <!-- ==========================================
         STICKY BOTTOM CTA (MOBILE ONLY)
         ========================================== -->
    <div class="cro-sticky-mobile-bar" id="stickyMobileBar">
        <a href="#applySection" class="cro-sticky-btn" onclick="croSmoothScrollToForm(event)">
            <span>Check Loan Offers →</span>
        </a>
    </div>

    <!-- ==========================================
         REUSE EXISTING LIVE OTP MODAL COMPONENT
         ========================================== -->
    <?php include_once __DIR__ . '/includes/otp-modal.php'; ?>

    <!-- ==========================================
         INTERACTIVE CRO CLIENT ENGINE & TRACKING
         ========================================== -->
    <script>
    (function() {
        'use strict';

        const form = document.getElementById('croApplicationForm');
        const phoneInput = document.getElementById('croMobileInput');
        const submitBtn = document.getElementById('croSubmitBtn');
        const statusEl = document.getElementById('croFormStatus');
        const consentTerms = document.getElementById('consentTerms');
        const consentBureau = document.getElementById('consentBureau');
        const panelInitial = document.getElementById('formCardInitial');
        const panelLoading = document.getElementById('panelLoading');
        const offersSection = document.getElementById('offersSection');
        const loadingHeading = document.getElementById('loadingStatusHeading');
        const loadingText = document.getElementById('loadingStatusText');
        const stickyBar = document.getElementById('stickyMobileBar');
        const heroSection = document.getElementById('applySection');
        
        let verifiedPhone = '';
        let activeLeadId = 'PIM-' + Math.floor(100000 + Math.random() * 900000);
        let bureauScoreValue = null;
        let offersRevealed = false;
        let appStartedTracked = false;

        // --- Meta Pixel & DataLayer Tracking Dispatcher ---
        // Strictly compliant: Never sends CIBIL score, PAN, Aadhaar, salary, or sensitive financial data
        function trackMetaEvent(eventName, params = {}) {
            try {
                if (typeof window.fbq === 'function') {
                    window.fbq('track', eventName, params);
                }
                if (Array.isArray(window.dataLayer)) {
                    window.dataLayer.push(Object.assign({ event: 'meta_' + eventName }, params));
                }
            } catch (e) {}
        }

        // Trigger PageView & ViewContent on page load
        trackMetaEvent('PageView');
        trackMetaEvent('ViewContent', {
            content_name: 'Instant Cash Loan Campaign',
            content_category: 'Personal Loan',
            value: 100000,
            currency: 'INR'
        });

        // Track ApplicationStarted once when user interacts with phone input
        if (phoneInput) {
            const onPhoneStart = function() {
                if (!appStartedTracked) {
                    appStartedTracked = true;
                    trackMetaEvent('ApplicationStarted', { source: 'instant_cash_loan' });
                }
            };
            phoneInput.addEventListener('focus', onPhoneStart, { once: true });
            phoneInput.addEventListener('input', function() {
                onPhoneStart();
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
                if (statusEl) statusEl.style.display = 'none';
            });
        }

        // Form Submit Handler
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                if (statusEl) {
                    statusEl.style.display = 'none';
                    statusEl.className = 'cro-form-status';
                }

                const rawPhone = (phoneInput.value || '').trim().replace(/\D/g, '');
                if (rawPhone.length !== 10 || !/^[6-9]/.test(rawPhone)) {
                    showStatus('Please enter a valid 10-digit Indian mobile number.', 'error');
                    phoneInput.focus();
                    return;
                }

                if (!consentTerms || !consentTerms.checked) {
                    showStatus('Please agree to the Terms & Conditions and Privacy Policy.', 'error');
                    return;
                }

                if (!consentBureau || !consentBureau.checked) {
                    showStatus('Please authorize the credit evaluation consent checkbox to check offers.', 'error');
                    consentBureau.focus();
                    return;
                }

                verifiedPhone = rawPhone;

                // Fire non-sensitive Meta Lead & OTPStarted events
                trackMetaEvent('Lead', {
                    content_name: 'Instant Loan Check Initiated',
                    value: 100000,
                    currency: 'INR'
                });
                trackMetaEvent('OTPStarted');

                // Open existing OTP Modal
                if (window.PimOtpService && typeof window.PimOtpService.open === 'function') {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Verifying Mobile...</span>';
                    
                    window.PimOtpService.open(verifiedPhone, function(authResult) {
                        handleOtpSuccess(authResult);
                    });

                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span>Check My Loan Offers</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    }, 1000);
                } else {
                    // Fallback direct progress if OTP modal is unavailable
                    handleOtpSuccess({ phone: verifiedPhone });
                }
            });
        }

        function showStatus(msg, type) {
            if (!statusEl) return;
            statusEl.textContent = msg;
            statusEl.className = 'cro-form-status ' + (type || 'info');
            statusEl.style.display = 'block';
        }

        // --- Multi-Field Bureau Score Extractor (Trace all existing backend field namings) ---
        function extractBureauScore(...responses) {
            for (const res of responses) {
                if (!res || typeof res !== 'object') continue;
                const candidates = [
                    res.score,
                    res.cibilScore,
                    res.cibil_score,
                    res.bureau_score,
                    res.bureauScore,
                    res.credit_score,
                    res.cibil,
                    // Primitive creditScore
                    (typeof res.creditScore === 'number' || typeof res.creditScore === 'string') ? res.creditScore : null,
                    // Nested under res.creditScore object (Swagger /api/credit-score/latest & /check)
                    res.creditScore?.score,
                    res.creditScore?.cibilScore,
                    res.creditScore?.cibil_score,
                    res.creditScore?.bureau_score,
                    res.creditScore?.credit_score,
                    res.creditScore?.cibil,
                    // Nested under res.data
                    res.data?.score,
                    res.data?.bureau_score,
                    res.data?.bureauScore,
                    res.data?.cibilScore,
                    res.data?.cibil_score,
                    res.data?.credit_score,
                    res.data?.cibil,
                    (typeof res.data?.creditScore === 'number' || typeof res.data?.creditScore === 'string') ? res.data?.creditScore : null,
                    res.data?.creditScore?.score,
                    res.data?.creditScore?.cibilScore,
                    res.data?.creditScore?.bureau_score,
                    // Nested under res.lead (Node lead model /api/public/leads)
                    res.lead?.bureau_score,
                    res.lead?.bureauScore,
                    res.lead?.cibilScore,
                    res.lead?.cibil_score,
                    res.lead?.score,
                    res.lead?.cibil,
                    res.lead?.creditScore,
                    // Nested under res.report
                    res.report?.score,
                    res.report?.cibilScore,
                    res.report?.creditScore,
                    res.report?.bureau_score,
                    // Nested under res.application
                    res.application?.creditScore,
                    res.application?.bureauScore,
                    res.application?.score
                ];
                for (const val of candidates) {
                    if (val !== null && val !== undefined && val !== '' && typeof val !== 'object') {
                        const num = Number(val);
                        if (!isNaN(num) && num >= 300 && num <= 900) {
                            return Math.round(num);
                        }
                    }
                }
            }
            return null;
        }

        // --- Handle Successful OTP Verification & Backend Bureau Flow ---
        async function handleOtpSuccess(authResult) {
            trackMetaEvent('OTPVerified');
            trackMetaEvent('CreditCheckStarted');

            // Switch UI to Loading panel
            if (panelInitial) panelInitial.style.display = 'none';
            if (panelLoading) panelLoading.style.display = 'block';

            if (loadingHeading) loadingHeading.textContent = 'Verifying Bureau Records...';
            if (loadingText) loadingText.textContent = 'Querying authorized credit bureaus for +91 ' + verifiedPhone + '...';

            // Extract Auth Token from OTP response or device login (awaiting if Promise)
            let authToken = '';
            if (authResult && authResult.token) {
                authToken = authResult.token;
            } else if (window.PIMAuth && typeof window.PIMAuth.accessToken === 'function') {
                try {
                    authToken = (await window.PIMAuth.accessToken()) || '';
                } catch(e) {}
            }

            // Check if device already holds a verified bureau score in session for this phone (Requirement 10 & 21)
            let sessionScore = null;
            try {
                const sPhone = sessionStorage.getItem('pim_cibil_phone') || localStorage.getItem('pim_phone');
                const sScore = sessionStorage.getItem('pim_cibil');
                if (sPhone === verifiedPhone && sScore) {
                    const parsed = Number(sScore);
                    if (!isNaN(parsed) && parsed >= 300 && parsed <= 900) {
                        sessionScore = parsed;
                        bureauScoreValue = parsed;
                    }
                }
            } catch(e) {}

            // Gather Marketing Attribution data
            let attrData = {};
            try {
                const rawAttr = localStorage.getItem('pim_attr_v2');
                if (rawAttr) attrData = JSON.parse(rawAttr) || {};
            } catch(e) {}
            const lastTouch = attrData.last || {};

            const leadPayload = {
                phone: verifiedPhone,
                mobile: verifiedPhone,
                loanAmount: 100000,
                amount: 100000,
                salary: 35000,
                monthlySalary: 35000,
                name: "Valued Customer",
                source: "Meta Ads (Instant Cash Loan)",
                lead_source: "Campaign",
                utm_source: lastTouch.utm_source || "Meta Ads",
                utm_medium: lastTouch.utm_medium || "cpc",
                utm_campaign: lastTouch.utm_campaign || "instant-cash-1lakh",
                fbclid: lastTouch.fbclid || null,
                consent: true,
                status: "Fresh"
            };

            const apiHeaders = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            if (authToken) {
                apiHeaders['Authorization'] = 'Bearer ' + authToken;
            }

            // Diagnostic logging (Requirement 19 & 20)
            const reqStartTs = Date.now();
            window.PIM_CIBIL_DIAGNOSTICS = {
                applicationId: activeLeadId,
                requestStatus: 'STARTED',
                startedAt: new Date().toISOString(),
                hasAuthToken: !!authToken,
                scoreAvailable: !!bureauScoreValue
            };
            if (window.console && typeof window.console.info === 'function') {
                window.console.info('[CIBIL_REQUEST_STARTED]', {
                    appId: activeLeadId,
                    phone: '+91 ******' + verifiedPhone.slice(-4),
                    ts: new Date().toISOString()
                });
            }

            // Step 1: Explicit Consent Recording on Backend (Requirement 9 & Swagger /api/credit-score/consent)
            if (authToken) {
                try {
                    await fetch(window.backend_server_url + '/api/credit-score/consent', {
                        method: 'POST',
                        headers: apiHeaders,
                        body: JSON.stringify({})
                    }).catch(() => {});
                } catch(e) {}
            }

            // Step 2: Trigger Bureau Credit Check & Lead Intake
            const bureauPayload = {
                phone: verifiedPhone,
                mobile: verifiedPhone,
                name: "Valued Customer",
                consent: true
            };

            // Public Credit Check route
            const creditCheckPromise = fetch(window.backend_server_url + '/api/public/credit-check', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(bureauPayload)
            }).then(r => r.json().then(j => ({ ok: r.ok, status: r.status, data: j }))).catch(err => ({ ok: false, error: err }));

            // Authenticated Customer Credit Score Check route
            const customerCheckPromise = authToken ? fetch(window.backend_server_url + '/api/credit-score/check', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(bureauPayload)
            }).then(r => r.json().then(j => ({ ok: r.ok, status: r.status, data: j }))).catch(err => ({ ok: false, error: err })) : Promise.resolve({ ok: false });

            // Lead Intake API (creates lead record in MongoDB)
            const leadPromise = fetch(window.backend_server_url + '/api/public/leads', {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify(leadPayload),
                keepalive: true
            }).then(r => r.json().then(j => ({ ok: r.ok, status: r.status, data: j }))).catch(err => ({ ok: false, error: err }));

            // Step 3: Handle results and gracefully coordinate
            Promise.all([creditCheckPromise, customerCheckPromise, leadPromise])
                .then(async ([creditCheckRes, customerCheckRes, leadRes]) => {
                    const durationMs = Date.now() - reqStartTs;

                    const creditData = creditCheckRes?.data || {};
                    const customerData = customerCheckRes?.data || {};
                    const leadData = leadRes?.data || {};

                    // Resolve active lead ID from backend response
                    const resolvedId = leadData.lead_id || leadData.data?.lead_id || leadData.lead?.id || leadData.id || creditData.lead_id;
                    if (resolvedId) {
                        activeLeadId = resolvedId;
                    }

                    // Extract bureau score dynamically from actual backend response
                    const extracted = extractBureauScore(creditData, customerData, leadData);
                    if (extracted) {
                        bureauScoreValue = extracted;
                    }

                    // If score is not immediately returned (asynchronous bureau check), poll briefly (Requirement 15 & 16)
                    if (!bureauScoreValue && authToken) {
                        revealOffers('loading');

                        for (let attempt = 1; attempt <= 3 && !bureauScoreValue; attempt++) {
                            await new Promise(r => setTimeout(r, attempt === 1 ? 1200 : 1800));

                            try {
                                const [latestPoll, lookupPoll] = await Promise.all([
                                    fetch(window.backend_server_url + '/api/credit-score/latest', { method: 'GET', headers: apiHeaders }).then(r => r.json()).catch(() => ({})),
                                    fetch(window.backend_server_url + '/api/public/leads/lookup?phone=' + encodeURIComponent(verifiedPhone) + '&leadCode=' + encodeURIComponent(activeLeadId), { method: 'GET', headers: apiHeaders }).then(r => r.json()).catch(() => ({}))
                                ]);
                                const polledScore = extractBureauScore(latestPoll, lookupPoll);
                                if (polledScore) {
                                    bureauScoreValue = polledScore;
                                    break;
                                }
                            } catch(e) {}
                        }
                    }

                    finalizeCibilCardAndOffers(durationMs);
                })
                .catch((err) => {
                    finalizeCibilCardAndOffers(Date.now() - reqStartTs, err);
                });
        }

        // --- Finalize CIBIL Card & Disclose Offers ---
        function finalizeCibilCardAndOffers(durationMs, err) {
            if (bureauScoreValue && typeof bureauScoreValue === 'number' && bureauScoreValue >= 300 && bureauScoreValue <= 900) {
                try {
                    sessionStorage.setItem('pim_cibil', String(bureauScoreValue));
                    sessionStorage.setItem('pim_cibil_phone', verifiedPhone);
                } catch(e) {}

                window.PIM_CIBIL_DIAGNOSTICS = {
                    applicationId: activeLeadId,
                    requestStatus: 'SUCCESS',
                    scoreAvailable: true,
                    scoreRange: '300-900',
                    durationMs: durationMs,
                    completedAt: new Date().toISOString()
                };

                if (window.console && typeof window.console.info === 'function') {
                    window.console.info('[CIBIL_REQUEST_SUCCESS]', {
                        appId: activeLeadId,
                        durationMs: durationMs,
                        ts: new Date().toISOString()
                    });
                }
            } else {
                window.PIM_CIBIL_DIAGNOSTICS = {
                    applicationId: activeLeadId,
                    requestStatus: err ? 'ERROR' : 'NO_SCORE',
                    scoreAvailable: false,
                    durationMs: durationMs,
                    completedAt: new Date().toISOString()
                };

                if (window.console && typeof window.console.warn === 'function') {
                    window.console.warn(err ? '[CIBIL_REQUEST_FAILED]' : '[CIBIL_NO_SCORE]', {
                        appId: activeLeadId,
                        durationMs: durationMs
                    });
                }
            }

            // Non-sensitive Meta tracking: never send the score itself
            trackMetaEvent('CreditCheckCompleted', {
                bureau_status: bureauScoreValue ? 'available' : 'unavailable'
            });
            trackMetaEvent('ApplicationCompleted', {
                lead_id: activeLeadId
            });

            // Update loading screen briefly before displaying matched offers
            if (loadingHeading) loadingHeading.textContent = 'Offers Matched Successfully!';
            if (loadingText) loadingText.textContent = 'Unlocking curated lender options for your profile...';

            setTimeout(() => {
                revealOffers(bureauScoreValue ? 'success' : (err ? 'error' : 'no_score'));
            }, 600);
        }

        // --- Reveal Matched Offers UI & CIBIL Card ---
        function revealOffers(state) {
            if (panelLoading) panelLoading.style.display = 'none';
            if (offersSection) {
                offersSection.style.display = 'block';
                offersRevealed = true;
                
                // Hide mobile sticky CTA so it never obstructs lender offers
                if (stickyBar) stickyBar.style.display = 'none';

                // Precision smooth scroll to bring CIBIL card and matched offers into view
                setTimeout(() => {
                    const cibilContainer = document.getElementById('cibilCardContainer');
                    if (cibilContainer) {
                        const targetY = cibilContainer.getBoundingClientRect().top + window.pageYOffset - 16;
                        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
                    } else {
                        offersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 60);
            }

            // Populate CIBIL Score Card
            const cardPhone = document.getElementById('cibilCardPhone');
            if (cardPhone) {
                const last4 = verifiedPhone ? verifiedPhone.slice(-4) : '••••';
                cardPhone.textContent = '+91 ******' + last4;
            }

            const cardAppId = document.getElementById('cibilCardAppId');
            if (cardAppId) cardAppId.textContent = 'Application ID: ' + activeLeadId;

            const scoreNumberEl = document.getElementById('cibilScoreNumber');
            const statusTagEl = document.getElementById('cibilStatusTag');
            const statusTextEl = document.getElementById('cibilStatusText');
            const bureauStatusEl = document.getElementById('cibilBureauStatus');

            if (state === 'loading' && !bureauScoreValue) {
                // Professional Loading State (Requirement 16)
                if (scoreNumberEl) {
                    scoreNumberEl.textContent = 'Checking your credit profile...';
                    scoreNumberEl.className = 'cro-cibil-score-val loading';
                }
                if (statusTagEl) statusTagEl.className = 'cro-cibil-status-tag loading';
                if (statusTextEl) statusTextEl.textContent = 'Querying Credit Bureau...';
                if (bureauStatusEl) bureauStatusEl.textContent = 'Evaluating Bureau Records';
            } else if (bureauScoreValue && typeof bureauScoreValue === 'number' && bureauScoreValue >= 300 && bureauScoreValue <= 900) {
                // Success: Actual CIBIL score verified from backend (Requirement 1 & 13)
                if (scoreNumberEl) {
                    scoreNumberEl.textContent = bureauScoreValue;
                    scoreNumberEl.className = 'cro-cibil-score-val';
                }
                if (statusTagEl) statusTagEl.className = 'cro-cibil-status-tag';
                if (statusTextEl) statusTextEl.textContent = 'Credit Score Checked ✓';
                if (bureauStatusEl) bureauStatusEl.textContent = 'Eligible for Income-Based Disbursal';
            } else if (state === 'no_score') {
                // Legitimate No Score / New to Credit (Requirement 18)
                if (scoreNumberEl) {
                    scoreNumberEl.textContent = 'CIBIL Score Unavailable';
                    scoreNumberEl.className = 'cro-cibil-score-val unavailable';
                }
                if (statusTagEl) statusTagEl.className = 'cro-cibil-status-tag neutral';
                if (statusTextEl) statusTextEl.textContent = 'Profile Evaluated ✓';
                if (bureauStatusEl) bureauStatusEl.textContent = 'Eligible for Income-Based Disbursal';
            } else {
                // Unavailability fallback: never show 0/null/fake score (Requirement 1 & 17)
                if (scoreNumberEl) {
                    scoreNumberEl.textContent = 'CIBIL Score Unavailable';
                    scoreNumberEl.className = 'cro-cibil-score-val unavailable';
                }
                if (statusTagEl) statusTagEl.className = 'cro-cibil-status-tag neutral';
                if (statusTextEl) statusTextEl.textContent = 'Profile Evaluated ✓';
                if (bureauStatusEl) bureauStatusEl.textContent = 'Eligible for Income-Based Disbursal';
            }

            // Update CTA Links with live Lead ID
            const ctaLinks = document.querySelectorAll('.cro-offer-cta');
            ctaLinks.forEach(link => {
                const currentHref = link.getAttribute('href');
                if (currentHref && !currentHref.includes('lead_id=')) {
                    link.setAttribute('href', currentHref + '&lead_id=' + encodeURIComponent(activeLeadId));
                }
            });

            trackMetaEvent('LoanOffersViewed', {
                lead_id: activeLeadId,
                offers_count: ctaLinks.length
            });
        }

        // --- Filter Offers Tab Logic ---
        window.croFilterOffers = function(type, btn) {
            const tabs = document.querySelectorAll('.cro-filter-tab');
            tabs.forEach(t => t.classList.remove('active'));
            if (btn) btn.classList.add('active');

            const cards = document.querySelectorAll('.cro-offer-card');
            cards.forEach(card => {
                if (type === 'all') {
                    card.style.display = 'flex';
                } else if (type === 'instant') {
                    const isInstant = card.getAttribute('data-partner-type') === 'instant';
                    card.style.display = isInstant ? 'flex' : 'none';
                }
            });
        };

        // --- Track Offer Click to Node Keepalive & Meta ---
        window.croTrackOfferClick = function(partnerSlug) {
            trackMetaEvent('LoanOfferClicked', {
                partner: partnerSlug,
                lead_id: activeLeadId
            });

            try {
                fetch(window.backend_server_url + '/api/public/partner-click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        partner: partnerSlug,
                        leadId: activeLeadId,
                        source: 'instant_cash_loan'
                    }),
                    keepalive: true
                }).catch(() => {});
            } catch(e) {}
        };

        // --- FAQ Accordion Logic ---
        const faqItems = document.querySelectorAll('.cro-faq-item');
        faqItems.forEach(item => {
            const header = item.querySelector('.cro-faq-header');
            if (header) {
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(i => i.classList.remove('active'));
                    if (!isActive) item.classList.add('active');
                });
                header.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        header.click();
                    }
                });
            }
        });

        // --- Smooth Scroll to Form ---
        window.croSmoothScrollToForm = function(e) {
            if (e) e.preventDefault();
            const target = document.getElementById('applySection');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (phoneInput) {
                setTimeout(() => phoneInput.focus(), 400);
            }
        };

        // --- Sticky Bottom Bar Visibility Check ---
        // Hidden once offers are revealed to not compete with lender cards
        if (stickyBar && heroSection) {
            window.addEventListener('scroll', () => {
                if (offersRevealed) {
                    stickyBar.style.display = 'none';
                    return;
                }
                const rect = heroSection.getBoundingClientRect();
                if (rect.bottom < 150) {
                    stickyBar.style.display = 'block';
                } else {
                    stickyBar.style.display = 'none';
                }
            }, { passive: true });
        }

    })();
    </script>
</body>
</html>
