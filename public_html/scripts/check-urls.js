const fs = require('fs');
const path = require('path');
const https = require('https');

const sitemapPath = path.resolve(__dirname, '..', 'sitemap.xml');
const content = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('Total URLs to check:', urls.length);

let active = 0, index = 0;
const results = { 200: 0, 301: 0, 404: 0, other: 0, errors: [] };

function checkNext() {
  if (index >= urls.length) {
    if (active === 0) {
      console.log('Results summary:', JSON.stringify({
        total: urls.length,
        '200_OK': results[200],
        '301_Redirect': results[301],
        '404_NotFound': results[404],
        'other': results.other,
        issues: results.errors
      }, null, 2));
    }
    return;
  }
  const u = urls[index++];
  active++;
  const req = https.request(u, { method: 'HEAD', timeout: 8000 }, res => {
    active--;
    if (res.statusCode === 200) {
      results[200]++;
    } else if (res.statusCode === 301) {
      results[301]++;
      results.errors.push(`301: ${u} -> ${res.headers.location}`);
    } else if (res.statusCode === 404) {
      results[404]++;
      results.errors.push(`404: ${u}`);
    } else {
      results.other++;
      results.errors.push(`${res.statusCode}: ${u}`);
    }
    checkNext();
  });
  req.on('error', err => {
    active--;
    results.errors.push(`ERR: ${u} - ${err.message}`);
    checkNext();
  });
  req.end();
}

for (let i = 0; i < 8; i++) checkNext();
