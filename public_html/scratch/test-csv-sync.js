const fs = require('fs');

async function testFetch() {
  console.log('Testing CSV fetch from production and local...');
  const urls = [
    'https://paisainminutes.com/leads_log.csv',
    'http://localhost:5173/leads_log.csv'
  ];

  for (const u of urls) {
    try {
      const r = await fetch(u + '?t=' + Date.now());
      const t = await r.text();
      const lines = t.trim().split('\n');
      console.log(u, 'Status:', r.status, 'Total lines:', lines.length, 'Last line:', lines[lines.length - 1]);
    } catch (e) {
      console.log(u, 'Error:', e.message);
    }
  }
}

testFetch();
