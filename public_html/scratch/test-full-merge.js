const fs = require('fs');

async function testFullMerge() {
  const backendRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const backendData = await backendRes.json();
  const rawList = backendData.applications || [];
  console.log('Backend count:', rawList.length);

  const csvText = fs.readFileSync('public_html/leads_log.csv', 'utf8');

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
          timestamp: timestamp ? timestamp.replace(/^"|"$/g, '').trim() : '',
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

  const csvLeads = parseCSV(csvText);

  // Collect backend existing keys
  const backendExistingKeys = new Set();
  const usedDisplayIds = new Set();
  for (const b of rawList) {
    const p = String(b.phone || b.phoneNumber || (b.user && b.user.phone) || '').replace(/\D/g, '').slice(-10);
    const d = b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '';
    const amt = Number(b.amount || 0);
    if (p) {
      backendExistingKeys.add(`${p}_${d}_${amt}`);
      backendExistingKeys.add(`${p}_${amt}`);
      backendExistingKeys.add(`${p}_${d}`);
    }
    if (b.displayId) usedDisplayIds.add(b.displayId);
  }

  const extraLiveApps = [];
  for (let idx = 0; idx < csvLeads.length; idx++) {
    const row = csvLeads[idx];
    const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
    const isToday = rowDate === '2026-09-30';
    const keyWithDate = `${row.phone}_${rowDate}_${row.amount}`;
    
    // If not already in backend applications and either today or recent submission
    if (!backendExistingKeys.has(keyWithDate) && isToday) {
      const isoCreated = row.timestamp
        ? (row.timestamp.includes('T') ? row.timestamp : `${row.timestamp.replace(' ', 'T')}+05:30`)
        : new Date().toISOString();
      const createdDate = new Date(isoCreated);
      const yy = String(createdDate.getFullYear()).slice(-2);
      const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
      const dd = String(createdDate.getDate()).padStart(2, '0');
      
      let displayId = `PIM-${yy}${mm}${dd}-${row.phone.slice(-4)}`;
      if (usedDisplayIds.has(displayId)) {
        displayId = `PIM-${yy}${mm}${dd}-${row.phone.slice(-4)}-${idx + 1}`;
      }
      usedDisplayIds.add(displayId);

      extraLiveApps.push({
        id: `pim-live-${row.phone}-${createdDate.getTime()}-${idx}`,
        displayId: displayId,
        applicantName: row.name,
        name: row.name,
        phone: row.phone,
        phoneNumber: row.phone,
        mobile: `+91 ${row.phone}`,
        email: row.email,
        amount: row.amount,
        loanAmount: row.amount,
        tenureMonths: 12,
        purpose: 'Personal Loan',
        monthlyIncome: row.amount >= 50000 ? 55000 : 35000,
        status: row.status || 'FRESH',
        leadSource: row.source || 'WhatsApp',
        utmSource: (row.source && row.source.toLowerCase().includes('whatsapp')) ? 'Whatsapp-AGM' : null,
        source: row.source || 'WhatsApp',
        eligibilityStatus: row.eligibility || 'Eligible',
        selectedLenderId: (row.partner && row.partner !== 'Pending Selection') ? row.partner : null,
        createdAt: isoCreated,
        created_at: row.timestamp,
        updatedAt: isoCreated,
        isLiveSubmission: true
      });
    }
  }

  console.log('Extra live apps to merge:', extraLiveApps.length);
  console.log(extraLiveApps.map(a => ({ name: a.name, amount: a.amount, date: a.createdAt, displayId: a.displayId })));

  const combined = [...extraLiveApps, ...rawList];
  console.log('Total combined apps:', combined.length);
}

testFullMerge();
