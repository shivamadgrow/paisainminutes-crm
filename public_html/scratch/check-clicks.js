const fs = require('fs');

const csvContent = fs.readFileSync('public_html/clicks_log.csv', 'utf8');
const lines = csvContent.trim().split('\n');
console.log('Total lines in clicks_log.csv:', lines.length);

const parsed = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  // Format: click_id,lead_id,phone,affiliate_id,source,partner_name,partner_url,timestamp,ip_address,user_agent
  const parts = line.split(',');
  const click_id = parts[0];
  const lead_id = parts[1];
  const phone = parts[2];
  const affiliate_id = parts[3];
  const source = parts[4];
  const partner_name = parts[5];
  const timestamp = parts[7] || parts[parts.length - 3];
  parsed.push({ click_id, lead_id, phone, affiliate_id, source, partner_name, timestamp, raw: line });
}

console.log('Parsed rows count:', parsed.length);
console.log('Sample parsed:');
parsed.forEach((p, idx) => {
  console.log(`${idx + 1}. Lead: ${p.lead_id} | Phone: ${p.phone} | Partner: ${p.partner_name} | Source: ${p.source} | Time: ${p.timestamp}`);
});
