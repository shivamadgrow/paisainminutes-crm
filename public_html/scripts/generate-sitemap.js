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
    'services.php'
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
        'business-loan',
        'home-loan',
        'credit-card',
        'apply-now',
        'check-eligibility',
        'loan-offers',
        'credit-score-free',
        'free-cibil-score',
        'best-credit-cards',
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
        slug.includes('lakh-personal-loan') ||
        slug.includes('lakh-home-loan') ||
        slug.endsWith('-emi-calculator') ||
        slug.includes('pre-approved') ||
        slug.includes('interest-rates') ||
        slug.includes('balance-transfer') ||
        slug.includes('lifetime-free') ||
        slug.includes('cashback') ||
        slug.includes('gold-loan') ||
        slug.includes('car-loan') ||
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
