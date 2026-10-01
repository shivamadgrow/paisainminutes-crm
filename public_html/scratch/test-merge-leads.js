const fs = require('fs');

async function testMerge() {
  // 1. Fetch backend leads
  const backendRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const backendData = await backendRes.json();
  const rawBackend = backendData.applications || [];
  console.log('Backend applications count:', rawBackend.length);

  // 2. Read leads_log.csv
  let csvText = '';
  try {
    csvText = fs.readFileSync('public_html/leads_log.csv', 'utf8');
  } catch (e) {
    const res = await fetch('https://paisainminutes.com/leads_log.csv');
    csvText = await res.text();
  }

  // Parse CSV
  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
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
      const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
      if (cleanPhone.length === 10) {
        items.push({
          timestamp,
          name: name ? name.replace(/^"|"$/g, '').trim() : 'Applicant',
          email: email ? email.replace(/^"|"$/g, '').trim() : '',
          phone: cleanPhone,
          amount: Number(amount) || 0,
          partner: partner ? partner.replace(/^"|"$/g, '').trim() : 'Pending Selection',
          eligibility: eligibility ? eligibility.replace(/^"|"$/g, '').trim() : 'Eligible',
          status: status ? status.replace(/^"|"$/g, '').trim() : 'Fresh',
          source: source ? source.replace(/^"|"$/g, '').trim() : 'WhatsApp'
        });
      }
    }
    return items;
  }

  const csvRows = parseCSV(csvText);
  console.log('Total CSV rows:', csvRows.length);

  // Find CSV rows that don't match any backend item by phone and date
  // Especially today's submissions!
  const backendFingerprints = new Set();
  rawBackend.forEach(b => {
    const p = String(b.phone || b.phoneNumber || (b.user && b.user.phone) || '').replace(/\D/g, '').slice(-10);
    const d = b.createdAt ? b.createdAt.slice(0, 10) : '';
    if (p) {
      backendFingerprints.add(`${p}_${b.amount}`);
      backendFingerprints.add(`${p}_${d}`);
    }
  });

  const missingFromBackend = [];
  csvRows.forEach((row, idx) => {
    const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
    const isToday = rowDate === '2026-09-30';
    // If it's from today, or phone+amount not in backend
    if (isToday) {
      missingFromBackend.push(row);
    }
  });

  console.log('Today rows from CSV:', missingFromBackend.length);
  console.log(missingFromBackend);
}

testMerge();
