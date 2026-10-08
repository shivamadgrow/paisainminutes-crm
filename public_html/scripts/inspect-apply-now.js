const fs = require('fs');
const path = require('path');

function extractInputs(filePath) {
  if (!fs.existsSync(filePath)) return;
  const html = fs.readFileSync(filePath, 'utf-8');
  const regex = /<(?:input|select|textarea)[^>]+(?:name|id)=["']([^"']+)["']/gi;
  const found = new Set();
  let m;
  while ((m = regex.exec(html)) !== null) {
    found.add(m[1]);
  }
  console.log(filePath + ' fields:\n', Array.from(found));
}

const publicDir = path.resolve(__dirname, '..');
extractInputs(path.join(publicDir, 'apply-now.php'));
extractInputs(path.join(publicDir, 'check-eligibility.php'));
