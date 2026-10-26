const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Exclude backend endpoints, form handlers, and internal routing scripts
const excludedFiles = new Set([
    'admin-dashboard.php',
    'crm.php',
    'go.php',
    'postback.php',
    'redirect.php',
    'router.php',
    'submit-contact.php',
    'submit-lead.php'
]);

// Define priority and changefreq rules based on URL slug
function getSeoMeta(slug) {
    if (slug === '') {
        return { priority: '1.0', changefreq: 'daily' };
    }

    // High intent pillar / primary hub pages
    const highPillars = [
        'personal-loan',
        'instant-cash-loan',
        'apply-now',
        'check-eligibility',
        'loan-offers',
        'how-to-apply-for-a-personal-loan-online',
        'how-can-you-get-a-personal-loan-without-visiting-a-bank',
        'personal-loan-for-salaried-employees-eligibility-application-guide',
        'how-to-compare-personal-loan-offers',
        'how-to-plan-monthly-budget-before-personal-loan',
        'how-to-compare-personal-loan-offers-online',
        '5-things-to-check-before-choosing-a-personal-loan',
        'how-to-manage-personal-loan-repayments-without-stress',
        'difference-between-pre-approved-and-regular-personal-loan',
        'common-mistakes-to-avoid-when-applying-for-a-personal-loan',
        'what-happens-after-you-submit-an-online-personal-loan-application',
        'credit-score-free',
        'free-cibil-score',
        'mutual-funds',
        'bonds'
    ];
    if (highPillars.includes(slug)) {
        return { priority: '0.9', changefreq: 'weekly' };
    }

    // Trust, legal and company pages
    const trustPages = [
        'about-us',
        'contact-us',
        'our-partners',
        'partner-terms',
        'track-status',
        'terms-and-conditions',
        'privacy-policy'
    ];
    if (trustPages.includes(slug)) {
        return { priority: '0.6', changefreq: 'monthly' };
    }

    // High volume loan amount pages and main calculators
    if (
        slug.includes('thousand-personal-loan') ||
        slug.includes('1-lakh-personal-loan') ||
        slug.endsWith('-emi-calculator') ||
        slug.includes('pre-approved') ||
        slug.includes('interest-rates') ||
        slug.includes('balance-transfer') ||
        slug.includes('cibil') ||
        slug.includes('experian')
    ) {
        return { priority: '0.8', changefreq: 'weekly' };
    }

    // Default for specialized long-tail pages (e.g. niche loans, specific fund categories, bond types)
    return { priority: '0.7', changefreq: 'monthly' };
}

function generateSitemap() {
    const allFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.php'));
    const validFiles = allFiles.filter(f => !excludedFiles.has(f));

    console.log(`Found ${validFiles.length} valid public PHP pages.`);

    // Today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const pages = [];

    for (const file of validFiles) {
        const fullPath = path.join(publicDir, file);
        const slug = file === 'index.php' ? '' : file.replace('.php', '');
        const loc = slug === '' ? 'https://paisainminutes.com/' : `https://paisainminutes.com/${slug}`;
        
        // Priority & changefreq
        const { priority, changefreq } = getSeoMeta(slug);
        let lastmod = today;
        if (slug === 'how-can-you-get-a-personal-loan-without-visiting-a-bank') {
            lastmod = '2026-10-23';
        } else if (slug === 'personal-loan-for-salaried-employees-eligibility-application-guide') {
            lastmod = '2026-10-24';
        } else if (slug === 'how-to-compare-personal-loan-offers') {
            lastmod = '2026-10-25';
        } else if (slug === 'how-to-plan-monthly-budget-before-personal-loan') {
            lastmod = '2026-10-27';
        } else if (slug === 'how-to-compare-personal-loan-offers-online') {
            lastmod = '2026-10-28';
        } else if (slug === '5-things-to-check-before-choosing-a-personal-loan') {
            lastmod = '2026-10-29';
        } else if (slug === 'how-to-manage-personal-loan-repayments-without-stress') {
            lastmod = '2026-10-30';
        } else if (slug === 'difference-between-pre-approved-and-regular-personal-loan') {
            lastmod = '2026-10-31';
        } else if (slug === 'common-mistakes-to-avoid-when-applying-for-a-personal-loan') {
            lastmod = '2026-11-02';
        } else if (slug === 'what-happens-after-you-submit-an-online-personal-loan-application') {
            lastmod = '2026-11-03';
        }

        pages.push({
            file,
            slug,
            loc,
            lastmod,
            changefreq,
            priority: parseFloat(priority)
        });
    }

    // Sort order:
    // 1. Homepage first
    // 2. Highest priority first
    // 3. Alphabetical loc
    pages.sort((a, b) => {
        if (a.slug === '') return -1;
        if (b.slug === '') return 1;
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.loc.localeCompare(b.loc);
    });

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of pages) {
        xml += `    <url>\n`;
        xml += `        <loc>${page.loc}</loc>\n`;
        xml += `        <lastmod>${page.lastmod}</lastmod>\n`;
        xml += `        <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `        <priority>${page.priority.toFixed(1)}</priority>\n`;
        xml += `    </url>\n`;
    }

    xml += `</urlset>\n`;

    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`Successfully generated ${sitemapPath} with ${pages.length} URLs.`);

    // Also output category summary
    const priorityCounts = {};
    pages.forEach(p => {
        const key = `${p.priority.toFixed(1)} (${p.changefreq})`;
        priorityCounts[key] = (priorityCounts[key] || 0) + 1;
    });
    console.log('\nPriority distribution:');
    console.log(priorityCounts);
}

generateSitemap();
