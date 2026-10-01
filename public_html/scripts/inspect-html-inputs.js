const fs = require('fs');

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

['public_html/index.html', 'public_html/apply-now.html', 'public_html/personal-loan.html'].forEach(checkForms);
