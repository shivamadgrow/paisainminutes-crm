const fs = require('fs');
const path = require('path');

function checkForms(p) {
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf-8');
  const inputs = [];
  const regex = /<(?:input|select|textarea)[^>]+name=["']([^"']+)["']/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    inputs.push(m[1]);
  }
  console.log(p + ' inputs:\n', Array.from(new Set(inputs)));
}

const publicDir = path.resolve(__dirname, '..');
['index.html', 'apply-now.html', 'personal-loan.html'].map(f => path.join(publicDir, f)).forEach(checkForms);
