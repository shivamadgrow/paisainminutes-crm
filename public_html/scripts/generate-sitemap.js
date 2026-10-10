const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// List of all non-public or legacy files to exclude
const excludedFiles = new Set([
    'admin-dashboard.php',
    'crm.php',
    'go.php',
    'postback.php',
    'redirect.php',
    'router.php',
    'submit-contact.php',
    'submit-lead.php',
    // Legacy Silver Leaf NDIS template files
    'about.php',
    'contact.php',
    'blog.php',
    'careers.php',
    'resources.php',
    'services.php',
    // Retired high-ticket personal loan amount pages (capped at ₹1 Lakh)
    '5-lakh-personal-loan.php',
    '10-lakh-personal-loan.php',
    '20-lakh-personal-loan.php',
    '30-lakh-personal-loan.php',
    '40-lakh-personal-loan.php',
    '50-lakh-personal-loan.php',
    // Retired unsupported loan categories and calculators
    'business-loan.php',
    'business-loan-emi-calculator.php',
    'business-loan-interest-rates.php',
    'business-loan-low-cibil-score.php',
    'home-loan.php',
    'home-loan-balance-transfer.php',
    'home-loan-eligibility-calculator.php',
    'home-loan-emi-calculator.php',
    'home-loan-for-self-employed.php',
    'home-loan-for-women.php',
    'home-loan-interest-rates.php',
    'home-loan-low-cibil-score.php',
    'home-loan-prepayment-calculator.php',
    'home-construction-loan.php',
    'home-extension-loan.php',
    'home-renovation-loan.php',
    'top-up-home-loan.php',
    '10-lakh-home-loan.php',
    '15-lakh-home-loan.php',
    '20-lakh-home-loan.php',
    '30-lakh-home-loan.php',
    '40-lakh-home-loan.php',
    '60-lakh-home-loan.php',
    'car-loan.php',
    'loan-against-car.php',
    'two-wheeler-loan.php',
    'tractor-loan-emi-calculator.php',
    'gold-loan.php',
    'gold-loan-emi-calculator.php',
    'loan-against-property.php',
    'loan-against-property-emi-calculator.php',
    'loan-against-fixed-deposit.php',
    'plot-loan.php',
    'small-business-loan.php',
    'startups-loan.php',
    'msme-loan.php',
    'mudra-loan.php',
    'mudra-loan-emi-calculator.php',
    'pmegp-loan.php',
    'working-capital-loan.php',
    'letter-of-credit.php',
    'dairy-farming-loan.php',
    'goat-farming-loan.php',
    'poultry-farm-loan.php',
    'education-loan.php',
    'term-loan-emi-calculator.php',
    // Retired credit card and forex card pages
    'credit-card.php',
    'best-credit-cards.php',
    'best-forex-cards.php',
    'compare-credit-cards.php',
    'credit-card-eligibility.php',
    'credit-card-lounge-access.php',
    'rupay-credit-cards.php',
    'secured-credit-cards.php',
    'lifetime-free-credit-cards.php',
    'rewards-credit-cards.php',
    'cashback-credit-cards.php',
    'virtual-credit-cards.php',
    'fuel-credit-cards.php',
    'travel-credit-cards.php',
    'international-credit-cards.php',
    'zero-forex-markup-credit-cards.php',
    'cibil-score-for-credit-card.php',
    'loan-on-credit-card.php'
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

        pages.push({
            file,
            slug,
            loc,
            lastmod: today,
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
