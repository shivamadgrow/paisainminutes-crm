const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..');
const content = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = new Set([...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));

const allPhp = fs.readdirSync(publicDir).filter(f => f.endsWith('.php'));
const notInSitemap = [];

for (const f of allPhp) {
  const slug = f === 'index.php' ? '' : f.replace('.php', '');
  const url = 'https://paisainminutes.com/' + slug;
  if (!sitemapUrls.has(url)) {
    notInSitemap.push(f);
  }
}
console.log('PHP files not in sitemap (' + notInSitemap.length + '):', notInSitemap);
