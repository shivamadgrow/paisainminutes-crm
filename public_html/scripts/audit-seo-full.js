const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..');
const phpFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.php'));

console.log('=== FULL SEO & ON-PAGE AUDIT ===\n');

// 1. Check robots.txt
const robotsTxt = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
console.log('1. ROBOTS.TXT:');
console.log(' - Sitemap reference:', robotsTxt.includes('Sitemap: https://paisainminutes.com/sitemap.xml') ? 'OK' : 'MISSING');
console.log(' - User-agent allow /:', robotsTxt.includes('Allow: /') ? 'OK' : 'MISSING');

// 2. Check sitemap.xml
const sitemapXml = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('\n2. SITEMAP.XML:');
console.log(' - Total URLs:', sitemapUrls.length);

// 3. Inspect PHP files
const analysis = {
    redirects: [],
    noHeader: [],
    titles: {},
    duplicateTitles: {},
    h1s: {},
    duplicateH1s: {},
    canonicalMismatches: [],
    missingMetaDesc: [],
    duplicateMetaDesc: {},
    brandMentions: [],
    altIssues: []
};

for (const file of phpFiles) {
    const filePath = path.join(publicDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if redirect
    if (content.includes('301 Moved Permanently') || content.includes('header("Location:') || content.includes("header('Location:")) {
        analysis.redirects.push(file);
        continue;
    }

    // Check if includes header
    if (!content.includes("include 'includes/header.php'") && !content.includes('include "includes/header.php"') && !content.includes("include_once 'includes/header.php'")) {
        analysis.noHeader.push(file);
    }

    // Extract title
    let title = '';
    const titleMatch = content.match(/\$page_title\s*=\s*["']([^"']+)["']/);
    if (titleMatch) {
        title = titleMatch[1];
    } else {
        const htmlTitle = content.match(/<title>([^<]+)<\/title>/);
        if (htmlTitle) title = htmlTitle[1];
    }
    if (title) {
        if (!analysis.titles[title]) analysis.titles[title] = [];
        analysis.titles[title].push(file);
    }

    // Extract meta description
    let desc = '';
    const descMatch = content.match(/\$page_description\s*=\s*["']([^"']+)["']/);
    if (descMatch) {
        desc = descMatch[1];
    } else {
        const htmlDesc = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (htmlDesc) desc = htmlDesc[1];
    }
    if (!desc) {
        analysis.missingMetaDesc.push(file);
    } else {
        if (!analysis.duplicateMetaDesc[desc]) analysis.duplicateMetaDesc[desc] = [];
        analysis.duplicateMetaDesc[desc].push(file);
    }

    // Extract H1
    const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    const h1Clean = h1Matches.map(m => m[1].replace(/<[^>]+>/g, '').trim());
    analysis.h1s[file] = h1Clean;

    // Check images and alt text
    const imgMatches = [...content.matchAll(/<img\s+([^>]+)>/gi)];
    for (const img of imgMatches) {
        const attrs = img[1];
        if (!attrs.includes('alt=')) {
            analysis.altIssues.push({ file, issue: 'Missing alt attribute', img: img[0] });
        } else {
            const altVal = attrs.match(/alt=["']([^"']*)["']/);
            if (altVal && (altVal[1] === '' || altVal[1].toLowerCase() === 'logo' || altVal[1].toLowerCase() === 'image')) {
                analysis.altIssues.push({ file, issue: `Suboptimal alt: "${altVal[1]}"`, img: img[0] });
            }
        }
    }
}

console.log('\n3. REDIRECT PHP FILES:', analysis.redirects);
console.log(' - Are any in sitemap.xml?');
for (const red of analysis.redirects) {
    const slug = red.replace('.php', '');
    const url = 'https://paisainminutes.com/' + slug;
    if (sitemapUrls.includes(url)) {
        console.log('   WARNING: Sitemap contains redirect URL:', url);
    }
}

console.log('\n4. FILES WITHOUT STANDARD HEADER.PHP:', analysis.noHeader);

// Check duplicate titles
const dupTitles = Object.entries(analysis.titles).filter(([t, files]) => files.length > 1);
console.log('\n5. DUPLICATE TITLES:', dupTitles.length);
dupTitles.forEach(([t, files]) => console.log(` - "${t}":`, files));

// Check missing or duplicate meta descriptions
const dupDesc = Object.entries(analysis.duplicateMetaDesc).filter(([d, files]) => files.length > 1);
console.log('\n6. DUPLICATE META DESCRIPTIONS:', dupDesc.length);
dupDesc.forEach(([d, files]) => console.log(` - "${d.slice(0, 50)}...":`, files));

// Check H1 counts
const multiH1 = Object.entries(analysis.h1s).filter(([f, h1List]) => h1List.length > 1);
const zeroH1 = Object.entries(analysis.h1s).filter(([f, h1List]) => h1List.length === 0 && !analysis.redirects.includes(f));
console.log('\n7. H1 AUDIT:');
console.log(' - Pages with MULTIPLE H1s:', multiH1.length, multiH1.map(([f, h]) => f));
console.log(' - Pages with ZERO H1s:', zeroH1.length, zeroH1.map(([f, h]) => f));

// Check Homepage Specifically
console.log('\n8. HOMEPAGE AUDIT (index.php):');
const indexContent = fs.readFileSync(path.join(publicDir, 'index.php'), 'utf8');
const indexTitle = (indexContent.match(/\$page_title\s*=\s*["']([^"']+)["']/) || [])[1];
const indexDesc = (indexContent.match(/\$page_description\s*=\s*["']([^"']+)["']/) || [])[1];
const indexH1 = analysis.h1s['index.php'];
console.log(' - Title:', indexTitle);
console.log(' - Description:', indexDesc);
console.log(' - H1s:', indexH1);
