<?php
/**
 * Blog: What Happens After You Submit an Online Personal Loan Application?
 * Scheduled Release: 2026-11-03 12:00 PM IST
 * 100% YMYL & E-E-A-T Compliant, Rich Contextual Internal Linking & Structured Data
 */

$scheduled_release_timestamp = strtotime('2026-11-03 12:00:00 +05:30');
$is_live = (time() >= $scheduled_release_timestamp);

$canonical_url = "https://paisainminutes.com/what-happens-after-you-submit-an-online-personal-loan-application";
$page_title = "What Happens After You Submit an Online Personal Loan Application? | Paisa in Minutes";
$page_description = "Wondering what happens after you apply for a personal loan online? Learn the 8-step verification process, KYC checks, income review, KFS approval, and bank disbursal timeline.";
$page_keywords = "what happens after submitting personal loan application, personal loan verification process, digital loan disbursal timeline, kyc personal loan, loan approval steps india";
$page_og_image = "https://paisainminutes.com/assets/images/what-happens-after-you-submit-an-online-personal-loan-application.jpg";

if (!$is_live) {
    // Before official scheduled release on Nov 03, 2026 at 12:00 PM IST
    $page_robots = "noindex, nofollow";
}

$breadcrumb_parent = ['name' => 'Personal Loan', 'url' => '/personal-loan'];

// Page Specific FAQs - Synchronized with FAQPage JSON-LD Schema
$page_faqs = [
    [
        "question" => "What happens immediately after submitting an online personal loan application?",
        "answer" => "The platform may acknowledge your application and begin checking your details. Depending on the lender, the next steps may include KYC, income verification, credit assessment and an eligibility decision."
    ],
    [
        "question" => "What are the personal loan documents required in India?",
        "answer" => "Common requirements may include PAN details, accepted identity and address information, salary slips and bank statements. The exact list depends on the lender and your profile."
    ],
    [
        "question" => "Does submitting a personal loan application guarantee approval?",
        "answer" => "No. The lender must assess your application and may approve, reject or request more information. An initial offer or eligibility result does not guarantee final approval or disbursal."
    ],
    [
        "question" => "How long does it take to receive a personal loan after approval?",
        "answer" => "The timeline varies by lender and application. Funds may be sent after verification, agreement signing and completion of other conditions. Wait for confirmation that the money has reached your bank account."
    ],
    [
        "question" => "Can a personal loan application be rejected after verification?",
        "answer" => "Yes. A lender may reject an application if it does not meet its credit, income, identity or other lending requirements, even if some verification steps have been completed."
    ],
    [
        "question" => "Should I pay a fee to guarantee personal loan approval?",
        "answer" => "Be cautious of anyone demanding an unexplained advance payment in exchange for guaranteed approval. Verify the lender and review all disclosed charges in the official loan documents before making any payment."
    ]
];

include 'includes/header.php';
?>

<!-- Article Structured Data (BlogPosting Schema) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://paisainminutes.com/what-happens-after-you-submit-an-online-personal-loan-application#article",
  "isPartOf": {
    "@id": "https://paisainminutes.com/#website"
  },
  "headline": "What Happens After You Submit an Online Personal Loan Application?",
  "description": "A comprehensive guide to the complete post-application lifecycle of an online personal loan in India: verification stages, credit underwriting, KFS inspection, e-sign agreements, and bank account disbursal.",
  "inLanguage": "en-IN",
  "mainEntityOfPage": "https://paisainminutes.com/what-happens-after-you-submit-an-online-personal-loan-application",
  "datePublished": "2026-11-03T12:00:00+05:30",
  "dateModified": "2026-11-03T12:00:00+05:30",
  "image": {
    "@type": "ImageObject",
    "url": "https://paisainminutes.com/assets/images/what-happens-after-you-submit-an-online-personal-loan-application.jpg",
    "width": 1024,
    "height": 682
  },
  "author": {
    "@type": "Organization",
    "name": "Paisa in Minutes Editorial Team",
    "url": "https://paisainminutes.com/about-us"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://paisainminutes.com/#organization",
    "name": "Paisa in Minutes",
    "logo": {
      "@type": "ImageObject",
      "url": "https://paisainminutes.com/assets/logo.png"
    }
  },
  "articleSection": "Loan Application & Verification Guide",
  "keywords": "what happens after submitting personal loan application, personal loan verification process, digital loan disbursal timeline, kyc personal loan, loan approval steps india"
}
</script>

<!-- Embedded Blog Page Styles -->
<style>
/* --- SCHEDULED PREVIEW NOTIFICATION BANNER --- */
.scheduled-banner {
    background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
    color: #F8FAFC;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #38BDF8;
    position: sticky;
    top: 72px;
    z-index: 998;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
.scheduled-banner-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.92rem;
}
.scheduled-tag {
    background: #0284C7;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 50px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.scheduled-timer {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.95rem;
    color: #38BDF8;
    font-weight: 700;
}

/* --- HERO SECTION --- */
.blog-hero {
    background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #172554 100%);
    color: #FFFFFF;
    padding: 3.5rem 1rem 4rem;
    position: relative;
    overflow: hidden;
}
.blog-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 60%);
    pointer-events: none;
}
.blog-hero-container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    text-align: center;
}
.blog-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.35);
    color: #38BDF8;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.blog-title {
    font-size: 2.45rem;
    line-height: 1.25;
    font-weight: 800;
    color: #FFFFFF;
    margin-bottom: 1.25rem;
    letter-spacing: -0.5px;
}
.blog-subtitle {
    font-size: 1.15rem;
    line-height: 1.6;
    color: #E2E8F0;
    max-width: 780px;
    margin: 0 auto 2rem;
}
.blog-meta-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 0.88rem;
    color: #94A3B8;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.blog-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

/* --- FEATURED HERO IMAGE CARD --- */
.featured-image-wrapper {
    max-width: 900px;
    margin: -2.5rem auto 3rem;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
}
.featured-image-card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12);
    border: 1px solid #E2E8F0;
}
.featured-image-card img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
.featured-image-caption {
    padding: 1rem 1.5rem;
    font-size: 0.88rem;
    color: #64748B;
    background: #F8FAFC;
    border-top: 1px solid #EDF2F7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.featured-image-badge {
    background: #E0F2FE;
    color: #0369A1;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* --- CONTENT CONTAINER --- */
.blog-container {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.25rem 4rem;
}
.article-content {
    color: #334155;
    line-height: 1.8;
    font-size: 1.05rem;
}
.article-content h2 {
    font-size: 1.75rem;
    line-height: 1.35;
    color: #0F172A;
    font-weight: 800;
    margin: 2.75rem 0 1rem;
    letter-spacing: -0.3px;
    position: relative;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #E2E8F0;
}
.article-content h2::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 60px;
    height: 2px;
    background: #2563EB;
}
.article-content h3 {
    font-size: 1.25rem;
    line-height: 1.4;
    color: #1E293B;
    font-weight: 700;
    margin: 1.75rem 0 0.5rem;
}
.article-content p {
    margin-bottom: 1.25rem;
}
.article-content ul, .article-content ol {
    margin: 1rem 0 1.5rem 1.5rem;
}
.article-content li {
    margin-bottom: 0.5rem;
}

/* --- PROCESS STEP CARDS --- */
.step-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 1.75rem;
    margin: 2rem 0;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
}
.step-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}
.step-card-badge {
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    color: #FFFFFF;
    font-size: 0.85rem;
    font-weight: 800;
    padding: 6px 14px;
    border-radius: 50px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}
.step-card-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #0F172A;
    margin: 0;
}

/* --- CALLOUT BOXES --- */
.callout-box {
    background: #EFF6FF;
    border-left: 4px solid #2563EB;
    border-radius: 0 10px 10px 0;
    padding: 1.25rem 1.5rem;
    margin: 1.5rem 0;
    font-size: 0.96rem;
    color: #1E3A8A;
}
.callout-box p:last-child {
    margin-bottom: 0;
}
.callout-alert {
    background: #FEF2F2;
    border-left-color: #EF4444;
    color: #991B1B;
}
.callout-success {
    background: #F0FDF4;
    border-left-color: #10B981;
    color: #065F46;
}

/* --- COMPARISON & OFFER TABLE --- */
.comparison-table-wrapper {
    overflow-x: auto;
    margin: 2rem 0;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}
.comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    min-width: 550px;
}
.comparison-table th {
    background: #F8FAFC;
    color: #0F172A;
    font-weight: 700;
    text-align: left;
    padding: 1rem 1.25rem;
    border-bottom: 2px solid #E2E8F0;
}
.comparison-table td {
    padding: 0.95rem 1.25rem;
    border-bottom: 1px solid #F1F5F9;
    color: #334155;
    vertical-align: top;
}
.comparison-table tr:hover td {
    background: #F8FAFC;
}
.comparison-table tr:last-child td {
    border-bottom: none;
}

/* --- TABLE OF CONTENTS --- */
.toc-box {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 1.5rem 1.75rem;
    margin: 2rem 0 2.5rem;
}
.toc-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}
.toc-list {
    margin: 0 !important;
    padding: 0 !important;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 0.6rem 1.5rem;
}
.toc-list li a {
    color: #2563EB;
    text-decoration: none;
    font-size: 0.93rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.15s ease;
}
.toc-list li a:hover {
    color: #1D4ED8;
    text-decoration: underline;
}

/* --- FAQ ACCORDION --- */
.faq-section {
    margin: 3.5rem 0 2rem;
}
.faq-accordion-item {
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    margin-bottom: 0.75rem;
    background: #FFFFFF;
    overflow: hidden;
    transition: all 0.2s ease;
}
.faq-accordion-item:hover {
    border-color: #CBD5E1;
}
.faq-question-btn {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.15rem 1.25rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0F172A;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-family: inherit;
}
.faq-icon-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
    color: #2563EB;
}
.faq-answer-pane {
    padding: 0 1.25rem 1.25rem;
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.65;
    display: none;
}
.faq-answer-pane p:last-child {
    margin-bottom: 0;
}

/* --- RESPONSIVE ADJUSTMENTS --- */
@media (max-width: 640px) {
    .blog-title {
        font-size: 1.85rem;
    }
    .blog-subtitle {
        font-size: 1rem;
    }
    .article-content h2 {
        font-size: 1.45rem;
    }
    .step-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>

<!-- SCHEDULED PREVIEW NOTIFICATION (ACTIVE BEFORE RELEASE TIME) -->
<?php if (!$is_live): ?>
<div class="scheduled-banner" id="scheduledBanner">
    <div class="scheduled-banner-inner">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span class="scheduled-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Scheduled Publication
            </span>
            <span>This guide is scheduled to publish on <strong>November 03, 2026 at 12:00 PM IST</strong>.</span>
        </div>
        <div class="scheduled-timer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span id="countdownDisplay">Going live in...</span>
        </div>
    </div>
</div>
<script>
(function() {
    var targetDate = new Date("2026-11-03T12:00:00+05:30").getTime();
    function updateCountdown() {
        var now = new Date().getTime();
        var diff = targetDate - now;
        if (diff <= 0) {
            var banner = document.getElementById('scheduledBanner');
            if (banner) banner.style.display = 'none';
            return;
        }
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60)) / (1000 * 60));
        var secs = Math.floor((diff % (1000 * 60)) / 1000);
        var el = document.getElementById('countdownDisplay');
        if (el) {
            el.textContent = "Live in " + (days > 0 ? days + "d " : "") + hours + "h " + mins + "m " + secs + "s";
        }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();
</script>
<?php endif; ?>

<!-- HERO SECTION -->
<section class="blog-hero">
    <div class="blog-hero-container">
        <span class="blog-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Loan Lifecycle &amp; Verification Guide
        </span>
        <h1 class="blog-title">What Happens After You Submit an Online Personal Loan Application?</h1>
        <p class="blog-subtitle">Have you completed an online loan application and wondered what happens next? Discover the 8-step journey from digital KYC, income verification, and credit underwriting to loan sanction, KFS review, and bank account disbursal.</p>

        <div class="blog-meta-bar">
            <div class="blog-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                <span>By <strong>Paisa in Minutes Editorial Team</strong></span>
            </div>
            <div class="blog-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Reviewed by <strong>Credit Underwriting Panel</strong></span>
            </div>
            <div class="blog-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>8 Min Read</span>
            </div>
            <div class="blog-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>Scheduled for Nov 03, 2026</span>
            </div>
        </div>
    </div>
</section>

<!-- FEATURED HERO IMAGE CARD -->
<div class="featured-image-wrapper">
    <div class="featured-image-card">
        <picture>
            <source srcset="/assets/images/what-happens-after-you-submit-an-online-personal-loan-application.webp" type="image/webp">
            <img src="/assets/images/what-happens-after-you-submit-an-online-personal-loan-application.jpg" alt="What Happens After You Submit an Online Personal Loan Application - Paisa in Minutes" width="1024" height="682" loading="eager">
        </picture>
        <div class="featured-image-caption">
            <span><strong>Transparent Workflow:</strong> From form submission to instant account credit, understand every stage of digital personal loan processing.</span>
            <span class="featured-image-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>
                RBI Digital Lending Compliant
            </span>
        </div>
    </div>
</div>

<!-- ARTICLE BODY CONTAINER -->
<div class="blog-container">
    <article class="article-content">
        <!-- Quick Summary Box -->
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <div style="font-weight: 800; color: #166534; font-size: 1.05rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Quick Summary: The Post-Application Journey
            </div>
            <p style="font-size: 0.95rem; color: #15803D; margin-bottom: 0;">Once you submit an online <a href="/personal-loan" style="color: #15803D; font-weight: 700; text-decoration: underline;">personal loan</a> form, the lender performs an automated, multi-tiered verification process. This includes verifying your Aadhaar and PAN via paperless e-KYC, analyzing bank statements for income stability, evaluating your credit profile via credit bureaus, and generating a formal loan sanction with a <strong>Key Facts Statement (KFS)</strong>. Disbursal directly into your bank account follows electronic agreement signing and e-NACH auto-debit setup.</p>
        </div>

        <p>Have you applied for a personal loan online and wondered what happens behind the scenes? You may have entered your mobile number, shared your salary details, and completed the initial screen. Now, you might be waiting to learn whether your application will be approved and when the money will reach your bank account.</p>

        <p>After you submit an online personal loan application, the subsequent steps usually involve automated data verification, digital identity and KYC checks, salary and banking pattern analysis, credit bureau reviews, and formal affordability assessments. If the lender approves your profile, you will receive a transparent loan offer and agreement to review before the funds are credited to your bank.</p>

        <p>The exact timeline and steps depend on the lending bank or NBFC, the loan amount (such as a <a href="/50-thousand-personal-loan" style="color: #2563EB; font-weight: 600; text-decoration: underline;">₹50,000 personal loan</a> or a <a href="/1-lakh-personal-loan" style="color: #2563EB; font-weight: 600; text-decoration: underline;">₹1 Lakh personal loan</a>), and your employment profile. Here is your definitive, step-by-step roadmap to what happens after clicking "Submit."</p>

        <!-- TABLE OF CONTENTS -->
        <div class="toc-box">
            <div class="toc-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
                Table of Contents: 8 Stages of Loan Processing
            </div>
            <ul class="toc-list">
                <li><a href="#step-1">1. Application Intake &amp; Acknowledgment</a></li>
                <li><a href="#step-2">2. Identity &amp; Paperless KYC Verification</a></li>
                <li><a href="#step-3">3. Income &amp; Employment Assessment</a></li>
                <li><a href="#step-4">4. Credit Profile &amp; Bureau Underwriting</a></li>
                <li><a href="#step-5">5. The Eligibility Decision (4 Outcomes)</a></li>
                <li><a href="#step-6">6. Reviewing the Sanction Offer &amp; KFS</a></li>
                <li><a href="#step-7">7. Electronic Loan Agreement Signing</a></li>
                <li><a href="#step-8">8. Bank Account Disbursal</a></li>
                <li><a href="#documents-needed">Documents Required in India</a></li>
                <li><a href="#processing-timeline">How Long Does the Process Take?</a></li>
                <li><a href="#pending-or-rejected">What to Do If Pending or Rejected</a></li>
                <li><a href="#faqs">Frequently Asked Questions</a></li>
            </ul>
        </div>

        <!-- STEP 1 -->
        <div class="step-card" id="step-1">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 1</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">Your Application Is Received &amp; Acknowledged</h2>
            </div>
            <p>The journey begins the moment you hit "Submit" on a web portal or mobile app. The platform's loan origination system collects your foundational data:</p>
            <ul>
                <li>Your full legal name and active mobile number.</li>
                <li>Date of birth and permanent address details.</li>
                <li>Permanent Account Number (PAN).</li>
                <li>Employment type (salaried or self-employed) and monthly net income.</li>
                <li>Requested borrowing amount and desired repayment duration.</li>
            </ul>
            <p>Upon submission, the system issues an immediate on-screen confirmation and an SMS or email acknowledgment containing your <strong>Application Reference Number</strong>.</p>
            <div class="callout-box">
                <p><strong>Important Note:</strong> An application acknowledgment confirms receipt of your information; it does <em>not</em> mean your loan has been approved. Always ensure your PAN, mobile number, and salary figures are typed accurately, as clerical errors can delay automated processing.</p>
            </div>
        </div>

        <!-- STEP 2 -->
        <div class="step-card" id="step-2">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 2</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">Identity and Digital KYC Details Are Verified</h2>
            </div>
            <p>The next critical phase is <strong>Know Your Customer (KYC)</strong> verification. Regulated lenders in India are mandated by the Reserve Bank of India (RBI) to confirm your legal identity and address before advancing credit.</p>
            <h3 style="font-size: 1.15rem; color: #1E293B;">Typical Digital KYC Workflows:</h3>
            <ul>
                <li><strong>Mobile OTP Verification:</strong> Verifying your phone number via a secure One-Time Password.</li>
                <li><strong>PAN Database Validation:</strong> Instant verification with the Income Tax Department database to authenticate your name and date of birth.</li>
                <li><strong>Aadhaar e-KYC:</strong> Paperless address and identity authentication via UIDAI OTP or DigiLocker integration.</li>
                <li><strong>Liveness Selfie Verification:</strong> Capturing a real-time geo-tagged selfie to prevent synthetic identity theft.</li>
            </ul>
            <div class="callout-box callout-alert">
                <p><strong>Cybersecurity Warning:</strong> Never share your OTP, net banking passwords, or UPI PIN with anyone claiming to represent a bank or loan platform. Legitimate lenders will never ask for your passwords or private PINs.</p>
            </div>
        </div>

        <!-- STEP 3 -->
        <div class="step-card" id="step-3">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 3</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">Income Stability and Employment Verification</h2>
            </div>
            <p>Once your identity is confirmed, the lender evaluates your repayment capacity. Lenders must satisfy themselves that you earn a stable, regular income that comfortably accommodates the prospective monthly EMI.</p>
            <h3 style="font-size: 1.15rem; color: #1E293B;">What Underwriters Scrutinize:</h3>
            <ul>
                <li><strong>Salary Credits:</strong> Consistent monthly salary credits reflected in your primary bank account statements over the past 3 to 6 months.</li>
                <li><strong>Employer Categorization:</strong> Stability and reputation of your employer (MNC, public sector, corporate, or private enterprise).</li>
                <li><strong>Salary Slips:</strong> Verification of gross salary, statutory deductions (PF, professional tax), and net take-home pay.</li>
                <li><strong>Banking Hygiene:</strong> Examining bank statements for negative indicators such as ECS/NACH dishonours, cheque bounces, or chronic minimum balance breaches.</li>
            </ul>
            <p><strong>Affordability Scenario:</strong> Suppose you earn ₹30,000 per month and currently pay ₹10,000 across existing EMIs. The lender evaluates the remaining ₹20,000 against standard household living costs to determine how much incremental EMI you can safely absorb.</p>
        </div>

        <!-- STEP 4 -->
        <div class="step-card" id="step-4">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 4</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">Credit Profile Review and Bureau Underwriting</h2>
            </div>
            <p>Underwriting algorithms pull your comprehensive credit report from authorized credit information companies (CIBIL, Experian, Equifax, or CRIF High Mark) to evaluate your past repayment discipline.</p>
            <h3 style="font-size: 1.15rem; color: #1E293B;">Key Underwriting Metrics:</h3>
            <ul>
                <li><strong>Repayment History:</strong> Whether you have paid past personal loans, credit card bills, and two-wheeler loans on time without defaults or write-offs.</li>
                <li><strong>Credit Utilization Ratio (CUR):</strong> The proportion of your credit card limits currently utilized (ideally below 30%).</li>
                <li><strong>Debt-to-Income / FOIR:</strong> Ensuring total monthly debt commitments do not exceed 40% to 50% of your net income.</li>
                <li><strong>Recent Inquiries:</strong> Frequency of recent loan applications. Multiple recent hard inquiries can signal financial distress.</li>
            </ul>
            <p>You can monitor your own credit health periodically without impacting your score using our <a href="/free-cibil-score" style="color: #2563EB; font-weight: 600; text-decoration: underline;">Free CIBIL Score tool</a>.</p>
        </div>

        <!-- STEP 5 -->
        <div class="step-card" id="step-5">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 5</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">The Lender Makes an Eligibility Decision</h2>
            </div>
            <p>After completing identity, income, and credit risk evaluations, the automated underwriting engine arrives at one of four standard determinations:</p>
            <ol>
                <li><strong>Approved:</strong> Your financial profile satisfies all risk criteria, and a formal loan sanction offer is generated.</li>
                <li><strong>More Information Required:</strong> The lender requires clarifying documents—such as an updated bank statement, a clearer salary slip, or manual address confirmation.</li>
                <li><strong>Application Pending:</strong> Background checks, employer email verification, or banking integrations are currently processing.</li>
                <li><strong>Rejected:</strong> Your application currently falls outside the lender's risk parameters (e.g. low credit score, high existing debt ratio, or unverifiable income).</li>
            </ol>
            <div class="callout-box">
                <p><strong>Pre-Approved vs Final Approval:</strong> A "pre-qualified" or "pre-approved" offer displayed during initial marketing steps does not equal final approval. Regulated lenders can only issue final approval once full underwriting checks conclude successfully.</p>
            </div>
        </div>

        <!-- STEP 6 -->
        <div class="step-card" id="step-6">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 6</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">You Receive the Loan Offer &amp; Key Facts Statement (KFS)</h2>
            </div>
            <p>If your application is successful, the lender presents a formal loan offer. <strong>Never accept an offer without scrutinizing its costs and terms.</strong></p>
            <p>Under RBI digital lending guidelines, regulated lenders must provide a standardized <strong>Key Facts Statement (KFS)</strong> before you sign. This document explains the exact cost of credit in transparent terms.</p>

            <div class="comparison-table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th style="width: 35%;">What to Check in Your KFS</th>
                            <th style="width: 65%;">Why It Matters to Your Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Sanctioned Loan Amount</strong></td>
                            <td>Confirms the exact principal amount you are borrowing.</td>
                        </tr>
                        <tr>
                            <td><strong>Interest Rate (p.a.)</strong></td>
                            <td>Specifies the nominal rate charged and whether it is flat or reducing balance.</td>
                        </tr>
                        <tr>
                            <td><strong>Annual Percentage Rate (APR)</strong></td>
                            <td>Reflects the true annual borrowing cost, including interest, processing fees, and documentation charges.</td>
                        </tr>
                        <tr>
                            <td><strong>Processing Fee &amp; GST</strong></td>
                            <td>Deducted upfront from your sanctioned amount; affects net funds disbursed.</td>
                        </tr>
                        <tr>
                            <td><strong>Repayment Tenure</strong></td>
                            <td>The total number of months you have to repay the principal and interest.</td>
                        </tr>
                        <tr>
                            <td><strong>Monthly EMI Amount</strong></td>
                            <td>The fixed amount deducted from your account each month.</td>
                        </tr>
                        <tr>
                            <td><strong>Late Payment / Penal Charges</strong></td>
                            <td>Discloses the transparent charges applicable if an EMI is delayed.</td>
                        </tr>
                        <tr>
                            <td><strong>Prepayment / Foreclosure Terms</strong></td>
                            <td>Explains whether you can repay early and whether any penalty applies.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p><strong>Net Disbursal Example:</strong> If your approved loan is ₹50,000 and the processing fee is ₹1,500 + GST (₹1,770 total), the actual amount credited to your account will be <strong>₹48,230</strong>. Always verify both the net amount received and the total repayable amount before proceeding.</p>
        </div>

        <!-- STEP 7 -->
        <div class="step-card" id="step-7">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 7</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">You Execute the Digital Loan Agreement</h2>
            </div>
            <p>Once you are completely satisfied with the offer and KFS, you execute the legally binding loan agreement electronically. In modern digital lending, this is achieved via an <strong>Aadhaar-based e-Sign OTP</strong>.</p>
            <h3 style="font-size: 1.15rem; color: #1E293B;">What Happens During Execution:</h3>
            <ul>
                <li>You review the full digital contract on your screen.</li>
                <li>You receive a secure UIDAI OTP on your Aadhaar-linked mobile phone to apply an electronic digital signature.</li>
                <li>You set up an automated repayment mandate (<strong>e-NACH / UPI Autopay</strong>) on your primary bank account so your monthly EMI can be debited automatically on the scheduled due date.</li>
            </ul>
            <div class="callout-box callout-alert">
                <p><strong>Crucial Rule:</strong> Never pay an advance "processing deposit," "insurance fee," or "security charge" to a personal bank account or individual UPI ID. Legitimate lenders deduct fees directly from the sanctioned loan amount upon disbursal.</p>
            </div>
        </div>

        <!-- STEP 8 -->
        <div class="step-card" id="step-8">
            <div class="step-card-header">
                <span class="step-card-badge">Stage 8</span>
                <h2 class="step-card-title" style="border:none; padding:0; margin:0;">The Loan Amount Is Disbursed to Your Account</h2>
            </div>
            <p>The final stage is <strong>disbursal</strong>. Once the e-sign and e-NACH mandate are validated, the lending institution's core banking system triggers a direct bank transfer (via NEFT, RTGS, or IMPS) to your verified savings account.</p>
            <p>Disbursal timelines range from a few minutes (for pre-approved, fully digital applications) to 24 to 48 hours for cases requiring manual underwriter review.</p>
            <div class="callout-box callout-success">
                <p><strong>Post-Disbursal Best Practice:</strong> Check your bank account balance to confirm that the net funds have been credited. Download and securely archive your Sanction Letter, KFS, Loan Agreement, and Repayment Amortization Schedule for future reference.</p>
            </div>
        </div>

        <!-- DOCUMENTS SECTION -->
        <h2 id="documents-needed">What Are the Personal Loan Documents Required in India?</h2>
        <p>Documentation requirements vary based on the lender's underwriting model and whether you are a salaried employee or self-employed professional. Common documents include:</p>
        <ul>
            <li><strong>Tax Identity:</strong> Permanent Account Number (PAN) card.</li>
            <li><strong>Identity &amp; Address Proof:</strong> Aadhaar card, Passport, or Voter ID (typically authenticated via paperless DigiLocker e-KYC).</li>
            <li><strong>Income Proof (Salaried):</strong> Latest 3 months salary slips showing gross pay and deductions.</li>
            <li><strong>Bank Statements:</strong> Recent 3 to 6 months bank account statements reflecting steady salary credits.</li>
            <li><strong>Employer Verification:</strong> Official corporate email verification or employee ID card.</li>
        </ul>

        <!-- TIMELINE SECTION -->
        <h2 id="processing-timeline">How Long Does the Online Personal Loan Process Take?</h2>
        <p>There is no single universal timeline, as turnaround times depend heavily on data accuracy and lender infrastructure:</p>
        <ul>
            <li><strong>Instant Pre-Approved Loans:</strong> 15 minutes to 2 hours when applying with your existing salary bank.</li>
            <li><strong>Open-Market Digital Applications:</strong> 4 hours to 24 hours when automated bank statement fetching and e-KYC succeed seamlessly.</li>
            <li><strong>Manual Underwriting Cases:</strong> 2 to 3 business days if physical address verification or additional employment documentation is required.</li>
        </ul>

        <!-- PENDING OR REJECTED -->
        <h2 id="pending-or-rejected">What Should You Do If Your Application Is Pending or Rejected?</h2>
        <p>If your application status displays <strong>"Pending,"</strong> do not submit fresh applications elsewhere immediately. Check your registered email or loan app dashboard to see if the lender requested additional document uploads, and contact their official customer support.</p>
        <p>If your application is <strong>"Rejected,"</strong> take these constructive steps:</p>
        <ol>
            <li><strong>Review the Rejection Reason:</strong> Inquire whether the decision was due to low credit score, high existing debt (FOIR), or document discrepancies.</li>
            <li><strong>Check Your Credit Report:</strong> Inspect your bureau file for inaccurate overdue flags or clerical errors.</li>
            <li><strong>Avoid Panic Applications:</strong> Applying to multiple lenders within a few days triggers multiple hard inquiries and depresses your credit score further.</li>
            <li><strong>Explore Low-Cost Alternatives:</strong> Consider utilizing liquid emergency savings or negotiating payment plans with service providers.</li>
        </ol>

        <!-- FREQUENTLY ASKED QUESTIONS -->
        <div class="faq-section" id="faqs">
            <h2>Frequently Asked Questions</h2>
            <p style="color: #64748B; margin-bottom: 1.5rem;">Clear answers to common questions about online personal loan application processing and disbursals:</p>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>1. What happens immediately after submitting an online personal loan application?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>The platform may acknowledge your application and begin checking your details. Depending on the lender, the next steps may include KYC, income verification, credit assessment and an eligibility decision.</p>
                </div>
            </div>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>2. What are the personal loan documents required in India?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>Common requirements may include PAN details, accepted identity and address information, salary slips and bank statements. The exact list depends on the lender and your profile.</p>
                </div>
            </div>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>3. Does submitting a personal loan application guarantee approval?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>No. The lender must assess your application and may approve, reject or request more information. An initial offer or eligibility result does not guarantee final approval or disbursal.</p>
                </div>
            </div>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>4. How long does it take to receive a personal loan after approval?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>The timeline varies by lender and application. Funds may be sent after verification, agreement signing and completion of other conditions. Wait for confirmation that the money has reached your bank account.</p>
                </div>
            </div>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>5. Can a personal loan application be rejected after verification?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>Yes. A lender may reject an application if it does not meet its credit, income, identity or other lending requirements, even if some verification steps have been completed.</p>
                </div>
            </div>

            <div class="faq-accordion-item">
                <button class="faq-question-btn" type="button" aria-expanded="false">
                    <span>6. Should I pay a fee to guarantee personal loan approval?</span>
                    <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer-pane">
                    <p>Be cautious of anyone demanding an unexplained advance payment in exchange for guaranteed approval. Verify the lender and review all disclosed charges in the official loan documents before making any payment.</p>
                </div>
            </div>
        </div>

        <!-- SECTION: Related Guides & Recommended Reading -->
        <div style="background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%); border: 1px solid #BFDBFE; border-radius: 16px; padding: 1.75rem; margin: 2.5rem 0;">
            <h3 style="font-size: 1.25rem; color: var(--primary-color); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                Explore More Personal Loan Guides &amp; Tools
            </h3>
            <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 1.25rem;">Navigate your personal loan journey with our practical guides and instant calculators:</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
                <a href="/common-mistakes-to-avoid-when-applying-for-a-personal-loan" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; text-decoration: none; color: inherit; display: block; transition: all 0.2s ease;">
                    <div style="font-weight: 700; color: #2563EB; font-size: 0.95rem; margin-bottom: 0.25rem;">Loan Mistakes to Avoid ⚠️</div>
                    <div style="font-size: 0.82rem; color: var(--text-light); line-height: 1.4;">Learn how to steer clear of the 12 most common personal loan application blunders.</div>
                </a>
                <a href="/how-to-manage-personal-loan-repayments-without-stress" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; text-decoration: none; color: inherit; display: block; transition: all 0.2s ease;">
                    <div style="font-weight: 700; color: #2563EB; font-size: 0.95rem; margin-bottom: 0.25rem;">Stress-Free Loan Repayment 💡</div>
                    <div style="font-size: 0.82rem; color: var(--text-light); line-height: 1.4;">Master your EMI schedule, avoid late penalties, and separate repayment funds safely.</div>
                </a>
                <a href="/difference-between-pre-approved-and-regular-personal-loan" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; text-decoration: none; color: inherit; display: block; transition: all 0.2s ease;">
                    <div style="font-weight: 700; color: #2563EB; font-size: 0.95rem; margin-bottom: 0.25rem;">Pre-Approved vs Regular Loan 🔄</div>
                    <div style="font-size: 0.82rem; color: var(--text-light); line-height: 1.4;">Compare invitation-based bank offers versus self-initiated market applications.</div>
                </a>
                <a href="/personal-loan-emi-calculator" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 1rem; text-decoration: none; color: inherit; display: block; transition: all 0.2s ease;">
                    <div style="font-weight: 700; color: #059669; font-size: 0.95rem; margin-bottom: 0.25rem;">Personal Loan EMI Calculator 🧮</div>
                    <div style="font-size: 0.82rem; color: var(--text-light); line-height: 1.4;">Calculate exact monthly instalments, interest outgo, and amortization schedules instantly.</div>
                </a>
            </div>
        </div>

        <!-- SECTION: Conclusion -->
        <h2 id="conclusion">Conclusion: Know What Happens Before You Borrow</h2>
        <p>Submitting an online personal loan application is simply the first milestone of the credit journey. Your data is verified, your income and credit profile assessed, and an eligibility decision made before a formal loan offer is presented. If approved, carefully review the Key Facts Statement and contract terms before executing the agreement and awaiting disbursal.</p>

        <p>Understanding each step helps you avoid confusion, detect fraudulent warning signs, and make confident, responsible financial choices.</p>

        <p>Looking to explore personal loan options up to ₹1,00,000 from RBI-regulated lending partners? Visit <a href="/personal-loan" style="color: var(--accent-color); font-weight: 700; text-decoration: underline;">Paisa in Minutes</a> today.</p>

        <!-- Compliance Disclaimer Card -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem 1.5rem; margin: 2rem 0; font-size: 0.85rem; color: var(--text-light); line-height: 1.6;">
            <strong>Borrow Responsibly:</strong> Paisa in Minutes operates as a digital loan facilitation platform connecting applicants with RBI-regulated commercial banks and NBFCs. Final credit limits, interest rates, processing fees, and loan approvals are determined solely by the lending partner based on their independent underwriting criteria. This article is published for educational guidance only and does not constitute formal financial advice.
        </div>

        <!-- Bottom Conversion CTA -->
        <div style="background: #F1F5F9; border-radius: 16px; padding: 2rem; margin-top: 2rem; text-align: center; border: 1px solid var(--border-color);">
            <h3 style="font-size: 1.35rem; color: var(--primary-color); margin-bottom: 0.5rem;">Need a Personal Loan Up to ₹1 Lakh?</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">Compare transparent options from RBI-registered lending partners with affordable EMIs, clear KFS disclosures, and zero hidden charges.</p>
            <a href="/apply-now" class="btn btn-primary" style="background: var(--gradient-primary); color: #FFFFFF; padding: 0.75rem 2rem; border-radius: 50px; text-decoration: none; font-weight: 700; display: inline-block;">Check Eligibility Now ⚡</a>
        </div>
    </article>
</div>

<!-- Accordion Toggle Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    var faqButtons = document.querySelectorAll('.faq-question-btn');
    faqButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            var pane = this.nextElementSibling;
            var arrow = this.querySelector('.faq-icon-arrow');
            
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                pane.style.display = 'none';
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                this.setAttribute('aria-expanded', 'true');
                pane.style.display = 'block';
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }
        });
    });
});
</script>

<?php include 'includes/footer.php'; ?>
