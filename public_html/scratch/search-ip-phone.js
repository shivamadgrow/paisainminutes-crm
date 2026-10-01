const fs = require('fs');
const path = require('path');

function searchDir(dir, query) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        results.push(...searchDir(fullPath, query));
      }
    } else {
      try {
        const text = fs.readFileSync(fullPath, 'utf8');
        if (text.includes(query)) {
          results.push({ file: fullPath, count: (text.match(new RegExp(query, 'g')) || []).length });
        }
      } catch (e) {}
    }
  }
  return results;
}

const queries = ['8810606033', '106.219.164.181', 'PIM-260930-6033', 'yuvrajkapoor605@gmail.com'];
queries.forEach(q => {
  const matches = searchDir('public_html', q);
  console.log(`\n=== Query: "${q}" ===`);
  matches.forEach(m => console.log(`  ${m.file} (${m.count} occurrences)`));
});
