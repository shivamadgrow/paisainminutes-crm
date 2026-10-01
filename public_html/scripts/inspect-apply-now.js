const fs = require('fs');

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

extractInputs('public_html/apply-now.php');
extractInputs('public_html/check-eligibility.php');
