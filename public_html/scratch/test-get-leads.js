const fs = require('fs');

async function testCurrentIngestion() {
  const backendRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const backendData = await backendRes.json();
  const rawList = Array.isArray(backendData) ? backendData : (backendData.applications || backendData.leads || []);

  const csvRes = await fetch('https://paisainminutes.com/leads_log.csv?t=' + Date.now());
  const csvText = await csvRes.text();
  const lines = csvText.trim().split('\n');
  const recentCsvLeads = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
    const [timestamp, name, email, phone, amount, partner, eligibility, ip, status, source] = parts;
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length === 10) {
      recentCsvLeads.push({
        timestamp, name, email, phone: cleanPhone, amount: Number(amount) || 0, partner, eligibility, status, source
      });
    }
  }

  console.log(`Backend leads: ${rawList.length}, CSV leads: ${recentCsvLeads.length}`);

  // Test the current deduplication in apiConfig.js
  const backendExistingKeys = new Set();
  for (const b of rawList) {
    const p = String(b.phone || b.phoneNumber || (b.user && b.user.phone) || '').replace(/\D/g, '').slice(-10);
    const d = b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '';
    const amt = Number(b.amount || 0);
    if (p) {
      backendExistingKeys.add(`${p}_${d}_${amt}`);
      backendExistingKeys.add(`${p}_${amt}`);
      backendExistingKeys.add(`${p}_${d}`);
    }
  }

  console.log('\nChecking CSV leads against current backendExistingKeys:');
  const extraLiveApps = [];
  const nowIst = new Date();
  const todayIstStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(nowIst);

  for (let idx = 0; idx < recentCsvLeads.length; idx++) {
    const row = recentCsvLeads[idx];
    const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
    const isToday = rowDate === todayIstStr || rowDate === '2026-09-30';
    const keyWithDate = `${row.phone}_${rowDate}_${row.amount}`;

    const blocked = backendExistingKeys.has(keyWithDate);
    if (row.timestamp.includes('16:48') || row.phone === '7838056998') {
      console.log(`Row [${row.timestamp}] ${row.name} (${row.phone}) ₹${row.amount}:`);
      console.log(`   keyWithDate: "${keyWithDate}"`);
      console.log(`   isToday: ${isToday} (rowDate: ${rowDate}, todayIst: ${todayIstStr})`);
      console.log(`   backendExistingKeys.has("${keyWithDate}"): ${blocked}`);
    }

    if (!blocked && isToday) {
      extraLiveApps.push(row);
    }
  }

  console.log(`\nExtra live apps ingested with current logic: ${extraLiveApps.length}`);
  extraLiveApps.forEach(a => console.log('  Ingested:', a.timestamp, a.name, a.phone, a.amount));
}

testCurrentIngestion();
