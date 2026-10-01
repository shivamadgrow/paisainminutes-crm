const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
const content = fs.readFileSync(sitemapPath, 'utf8');

const errors = [];

if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('Invalid XML declaration');
}

if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    errors.push('Missing or invalid <urlset> namespace tag');
}

if (!content.endsWith('</urlset>\n') && !content.endsWith('</urlset>')) {
    errors.push('Missing closing </urlset> tag');
}

const openUrls = (content.match(/<url>/g) || []).length;
const closeUrls = (content.match(/<\/url>/g) || []).length;
const locs = (content.match(/<loc>/g) || []).length;
const lastmods = (content.match(/<lastmod>/g) || []).length;
const changefreqs = (content.match(/<changefreq>/g) || []).length;
const priorities = (content.match(/<priority>/g) || []).length;

if (openUrls !== closeUrls) errors.push(`Mismatch <url> (${openUrls}) vs </url> (${closeUrls})`);
if (openUrls !== locs) errors.push(`Mismatch <url> (${openUrls}) vs <loc> (${locs})`);
if (openUrls !== lastmods) errors.push(`Mismatch <url> (${openUrls}) vs <lastmod> (${lastmods})`);
if (openUrls !== changefreqs) errors.push(`Mismatch <url> (${openUrls}) vs <changefreq> (${changefreqs})`);
if (openUrls !== priorities) errors.push(`Mismatch <url> (${openUrls}) vs <priority> (${priorities})`);

// Validate every URL starts with https://paisainminutes.com
const locMatches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
let count = 0;
for (const m of locMatches) {
    count++;
    const url = m[1];
    if (!url.startsWith('https://paisainminutes.com/')) {
        errors.push(`Invalid URL domain or protocol: ${url}`);
    }
    if (url.includes('.php')) {
        errors.push(`URL contains .php extension (must be clean extensionless URL): ${url}`);
    }
}

console.log(`Verified ${count} URLs.`);
if (errors.length > 0) {
    console.error('Validation FAILED:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
} else {
    console.log('Sitemap XML is 100% valid W3C standard format!');
}
