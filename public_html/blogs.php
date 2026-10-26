<?php
/**
 * Blogs & Financial Insights Hub - Paisa in Minutes
 * Curated personal loan guides, borrowing checklists, and financial planning tips
 */

$page_title = "Personal Loan Guides & Financial Blogs | Paisa in Minutes";
$page_description = "Explore expert personal loan guides, step-by-step application tips, interest rate comparisons, and smart repayment strategies on Paisa in Minutes.";
$page_keywords = "personal loan blog, personal loan guides, compare loan offers, instant cash loan tips, low cibil score loan guide, paisa in minutes blogs";
$canonical_url = "https://paisainminutes.com/blogs";

include 'includes/header.php';

// List of published and upcoming blog articles
$blogs = [
    [
        'title' => 'How to Apply for a Personal Loan Online: A Step-by-Step Guide',
        'slug' => 'how-to-apply-for-a-personal-loan-online',
        'category' => 'Application Guide',
        'tag' => 'beginner',
        'read_time' => '6 min read',
        'date' => 'October 22, 2026',
        'icon' => 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        'gradient' => 'linear-gradient(135deg, #1B2A6B 0%, #3B82F6 100%)',
        'excerpt' => 'A clear, hassle-free walkthrough on digital KYC verification, required documents, bank mandate setup, and same-day bank disbursal.'
    ],
    [
        'title' => 'How Can You Get a Personal Loan Without Visiting a Bank?',
        'slug' => 'how-can-you-get-a-personal-loan-without-visiting-a-bank',
        'category' => 'Digital Banking',
        'tag' => 'process',
        'read_time' => '5 min read',
        'date' => 'October 23, 2026',
        'icon' => 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        'gradient' => 'linear-gradient(135deg, #0F172A 0%, #10B981 100%)',
        'excerpt' => 'Discover how RBI-regulated NBFC digital platforms let you complete KYC via Aadhaar OTP and receive loan funds directly to your bank account.'
    ],
    [
        'title' => 'Personal Loan for Salaried Employees: Eligibility & Application Guide',
        'slug' => 'personal-loan-for-salaried-employees-eligibility-application-guide',
        'category' => 'Salaried Loans',
        'tag' => 'eligibility',
        'read_time' => '7 min read',
        'date' => 'October 24, 2026',
        'icon' => 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        'gradient' => 'linear-gradient(135deg, #1E1B4B 0%, #6366F1 100%)',
        'excerpt' => 'Learn key salary benchmarks, debt-to-income (FOIR) ratios, and salary slip requirements to get maximum sanction limits up to ₹1 Lakh.'
    ],
    [
        'title' => 'How to Compare Personal Loan Offers Before Making a Decision',
        'slug' => 'how-to-compare-personal-loan-offers',
        'category' => 'Smart Borrowing',
        'tag' => 'tips',
        'read_time' => '6 min read',
        'date' => 'October 25, 2026',
        'icon' => 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
        'gradient' => 'linear-gradient(135deg, #1B2A6B 0%, #00D09C 100%)',
        'excerpt' => 'Don\'t look only at advertised interest rates. Understand APR, processing fees, foreclosure charges, and monthly EMI burdens across lenders.'
    ],
    [
        'title' => 'How to Plan Your Monthly Budget Before Taking a Personal Loan',
        'slug' => 'how-to-plan-monthly-budget-before-personal-loan',
        'category' => 'Budgeting',
        'tag' => 'planning',
        'read_time' => '6 min read',
        'date' => 'October 27, 2026',
        'icon' => 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        'gradient' => 'linear-gradient(135deg, #312E81 0%, #818CF8 100%)',
        'excerpt' => 'Use the 50/30/20 rule and practical repayment buffers to make sure your monthly EMI fits comfortably into your income without stress.'
    ],
    [
        'title' => 'How to Compare Personal Loan Offers Online Safely',
        'slug' => 'how-to-compare-personal-loan-offers-online',
        'category' => 'Comparison Guide',
        'tag' => 'tips',
        'read_time' => '5 min read',
        'date' => 'October 28, 2026',
        'icon' => 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
        'gradient' => 'linear-gradient(135deg, #1E293B 0%, #38BDF8 100%)',
        'excerpt' => 'Identify legitimate RBI-registered lenders, protect your personal information from unregulated apps, and compare total repayment costs.'
    ],
    [
        'title' => '5 Things to Check Before Choosing a Personal Loan',
        'slug' => '5-things-to-check-before-choosing-a-personal-loan',
        'category' => 'Checklist',
        'tag' => 'beginner',
        'read_time' => '5 min read',
        'date' => 'October 29, 2026',
        'icon' => 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        'gradient' => 'linear-gradient(135deg, #1B2A6B 0%, #F59E0B 100%)',
        'excerpt' => 'A must-read pre-borrowing checklist covering interest rate structure (flat vs reducing), loan tenure, hidden costs, and early payoff rules.'
    ],
    [
        'title' => 'How to Manage Personal Loan Repayments Without Stress',
        'slug' => 'how-to-manage-personal-loan-repayments-without-stress',
        'category' => 'Repayment Tips',
        'tag' => 'planning',
        'read_time' => '6 min read',
        'date' => 'October 30, 2026',
        'icon' => 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        'gradient' => 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)',
        'excerpt' => 'Practical strategies including NACH auto-debit scheduling, emergency funds, part-prepayments, and protecting your CIBIL score.'
    ],
    [
        'title' => 'Pre-Approved Loan vs Regular Personal Loan: What is the Difference?',
        'slug' => 'difference-between-pre-approved-and-regular-personal-loan',
        'category' => 'Loan Types',
        'tag' => 'process',
        'read_time' => '5 min read',
        'date' => 'October 31, 2026',
        'icon' => 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
        'gradient' => 'linear-gradient(135deg, #1E1B4B 0%, #A855F7 100%)',
        'excerpt' => 'Understand whether a pre-approved loan offer guarantees disbursal, how interest rates compare, and what documentation is still needed.'
    ],
    [
        'title' => 'Common Mistakes to Avoid When Applying for a Personal Loan',
        'slug' => 'common-mistakes-to-avoid-when-applying-for-a-personal-loan',
        'category' => 'Tips & Advice',
        'tag' => 'tips',
        'read_time' => '6 min read',
        'date' => 'November 02, 2026',
        'icon' => 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        'gradient' => 'linear-gradient(135deg, #881337 0%, #F43F5E 100%)',
        'excerpt' => 'Avoid common errors like applying to multiple lenders at once, mismatching salary details, or borrowing more than your actual requirement.'
    ],
    [
        'title' => 'What Happens After You Submit an Online Personal Loan Application?',
        'slug' => 'what-happens-after-you-submit-an-online-personal-loan-application',
        'category' => 'Loan Process',
        'tag' => 'process',
        'read_time' => '5 min read',
        'date' => 'November 03, 2026',
        'icon' => 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        'gradient' => 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 100%)',
        'excerpt' => 'Step-by-step insight into backend credit underwriting, bureau hard checks, sanction letter issuance, e-mandate, and bank account credit.'
    ]
];
?>

<style>
/* --- BLOGS HUB STYLES --- */
.blogs-page-hero {
    background: linear-gradient(135deg, #1B2A6B 0%, #0E1638 100%);
    padding: 7.5rem 0 4.5rem;
    position: relative;
    overflow: hidden;
    color: #FFFFFF;
    text-align: center;
}
.blogs-page-hero::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(74, 141, 255, 0.22) 0%, rgba(27, 42, 107, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
}
.blogs-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(74, 141, 255, 0.16);
    border: 1px solid rgba(147, 197, 253, 0.35);
    color: #BFDBFE;
    padding: 0.4rem 1.15rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
}
.blogs-page-hero h1 {
    color: #FFFFFF !important;
    font-size: clamp(2rem, 4.5vw, 3.25rem);
    font-family: var(--font-heading);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
}
.blogs-page-hero p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.85);
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Category Filter Strip */
.blogs-filter-section {
    background: #F8FAFC;
    border-bottom: 1px solid #E2E8F0;
    padding: 1.25rem 0;
    position: sticky;
    top: 65px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.filter-tabs-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    flex-wrap: wrap;
}
.filter-tab-btn {
    background: #FFFFFF;
    color: #475569;
    border: 1px solid #CBD5E1;
    border-radius: 50px;
    padding: 0.5rem 1.25rem;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}
.filter-tab-btn:hover {
    color: #1B2A6B;
    border-color: #4A8DFF;
    transform: translateY(-1px);
}
.filter-tab-btn.active {
    background: #1B2A6B;
    color: #FFFFFF;
    border-color: #1B2A6B;
    box-shadow: 0 4px 12px rgba(27, 42, 107, 0.2);
}

/* Blog Cards Section */
.blogs-container-section {
    padding: 4rem 0 5.5rem;
    background: #F1F5F9;
}
.blogs-grid-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}
@media (max-width: 1024px) {
    .blogs-grid-layout {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}
@media (max-width: 640px) {
    .blogs-grid-layout {
        grid-template-columns: 1fr;
    }
}

.blog-hub-card {
    background: #FFFFFF;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.blog-hub-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(27, 42, 107, 0.1);
    border-color: rgba(74, 141, 255, 0.4);
}

.blog-card-banner {
    height: 140px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    color: #FFFFFF;
}
.blog-card-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
}
.blog-cat-pill {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #FFFFFF;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    letter-spacing: 0.02em;
}
.blog-read-time {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
}
.blog-card-icon-circle {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.blog-card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
}
.blog-date-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #64748B;
    margin-bottom: 0.75rem;
}
.blog-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0F172A;
    line-height: 1.4;
    margin-bottom: 0.75rem;
    font-family: var(--font-heading);
}
.blog-card-title a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}
.blog-card-title a:hover {
    color: #4A8DFF;
}
.blog-card-excerpt {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex: 1;
}
.blog-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid #F1F5F9;
    margin-top: auto;
}
.blog-read-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #1B2A6B;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.2s ease;
}
.blog-read-btn:hover {
    color: #4A8DFF;
    transform: translateX(4px);
}

/* Bottom CTA Strip */
.blogs-cta-strip {
    background: linear-gradient(135deg, #1B2A6B 0%, #111942 100%);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    color: #FFFFFF;
    text-align: center;
    margin-top: 4rem;
    box-shadow: 0 15px 35px rgba(27, 42, 107, 0.2);
    position: relative;
    overflow: hidden;
}
.blogs-cta-strip::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(74, 141, 255, 0.2) 0%, transparent 60%);
    pointer-events: none;
}
.blogs-cta-strip h3 {
    color: #FFFFFF !important;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
}
.blogs-cta-strip p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.05rem;
    max-width: 600px;
    margin: 0 auto 1.75rem;
}
</style>

<!-- HERO SECTION -->
<section class="blogs-page-hero">
    <div class="container">
        <span class="blogs-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            Personal Finance &amp; Loan Knowledge Hub
        </span>
        <h1>Borrow Smarter with Expert Personal Loan Insights</h1>
        <p>Clear, transparent, and actionable guides on online loan approval, low CIBIL score solutions, EMI planning, and avoiding common borrowing pitfalls.</p>
    </div>
</section>

<!-- FILTER TABS -->
<div class="blogs-filter-section">
    <div class="container">
        <div class="filter-tabs-wrapper">
            <button type="button" class="filter-tab-btn active" data-filter="all">All Articles (<?php echo count($blogs); ?>)</button>
            <button type="button" class="filter-tab-btn" data-filter="beginner">Application Guides</button>
            <button type="button" class="filter-tab-btn" data-filter="tips">Smart Borrowing</button>
            <button type="button" class="filter-tab-btn" data-filter="planning">Budget &amp; Repayment</button>
            <button type="button" class="filter-tab-btn" data-filter="process">Approval Process</button>
        </div>
    </div>
</div>

<!-- BLOG CARDS GRID -->
<section class="blogs-container-section">
    <div class="container">
        <div class="blogs-grid-layout" id="blogsGrid">
            <?php foreach ($blogs as $b): ?>
            <article class="blog-hub-card" data-tag="<?php echo htmlspecialchars($b['tag']); ?>">
                <div class="blog-card-banner" style="background: <?php echo htmlspecialchars($b['gradient']); ?>;">
                    <div class="blog-card-top-row">
                        <span class="blog-cat-pill"><?php echo htmlspecialchars($b['category']); ?></span>
                        <span class="blog-read-time"><?php echo htmlspecialchars($b['read_time']); ?></span>
                    </div>
                    <div class="blog-card-icon-circle">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="<?php echo htmlspecialchars($b['icon']); ?>"/>
                        </svg>
                    </div>
                </div>

                <div class="blog-card-body">
                    <div class="blog-date-author">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span><?php echo htmlspecialchars($b['date']); ?></span>
                        <span>&bull;</span>
                        <span>Editorial Team</span>
                    </div>

                    <h2 class="blog-card-title">
                        <a href="/<?php echo htmlspecialchars($b['slug']); ?>"><?php echo htmlspecialchars($b['title']); ?></a>
                    </h2>

                    <p class="blog-card-excerpt">
                        <?php echo htmlspecialchars($b['excerpt']); ?>
                    </p>

                    <div class="blog-card-footer">
                        <a href="/<?php echo htmlspecialchars($b['slug']); ?>" class="blog-read-btn">
                            <span>Read Guide</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

        <!-- BOTTOM CONVERSION CTA -->
        <div class="blogs-cta-strip">
            <h3>Ready to Apply for an Instant Personal Loan?</h3>
            <p>Check your sanction limit up to ₹1,00,000 in under 2 minutes. 100% digital KYC with zero branch visits.</p>
            <a href="/apply-now" class="btn btn-primary" style="padding: 0.95rem 2.5rem; font-size: 1.05rem; background: #00D09C; color: #064E3B; font-weight: 700; border-radius: 50px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 8px 24px rgba(0, 208, 156, 0.35);">
                Check Eligibility &amp; Apply Now ⚡
            </a>
        </div>
    </div>
</section>

<script>
// Filter Tab Controller
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    const blogCards = document.querySelectorAll('.blog-hub-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            blogCards.forEach(card => {
                const tag = card.getAttribute('data-tag');
                if (filter === 'all' || tag === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
</script>

<?php include 'includes/footer.php'; ?>
