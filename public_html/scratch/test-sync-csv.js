const fs = require('fs');

const csvLines = fs.readFileSync('public_html/leads_log.csv', 'utf8').trim().split('\n');
console.log('Total csv rows:', csvLines.length);

const leads = [];
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i].trim();
  if (!line) continue;
  // parse CSV
  const parts = [];
  let inQuotes = false;
  let cur = '';
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  parts.push(cur.trim());

  const [timestamp, name, email, phone, amount, partner, eligibility, ip, status, source] = parts;
  const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
  if (cleanPhone.length === 10) {
    leads.push({
      timestamp,
      name,
      email,
      phone: cleanPhone,
      amount: Number(amount) || 0,
      partner,
      eligibility,
      status: status || 'Fresh',
      source: source || 'Direct Website'
    });
  }
}

console.log('Parsed leads count:', leads.length);
console.log('Today leads (2026-09-30):');
console.log(leads.filter(l => l.timestamp.includes('2026-09-30')));
