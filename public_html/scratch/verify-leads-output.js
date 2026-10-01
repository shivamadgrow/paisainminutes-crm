const fs = require('fs');

async function verify() {
  // Simulate fetchRecentCsvLeads
  const csvSources = [
    'https://paisainminutes.com/leads_log.csv'
  ];

  let recentCsvLeads = [];
  for (const src of csvSources) {
    try {
      const res = await fetch(src + '?t=' + Date.now());
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split('\n');
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const parts = [];
          let inQuotes = false;
          let cur = '';
          for (let j = 0; j < line.length; j++) {
            const c = line[j];
            if (c === '"') inQuotes = !inQuotes;
            else if (c === ',' && !inQuotes) { parts.push(cur.trim()); cur = ''; }
            else cur += c;
          }
          parts.push(cur.trim());
          const [timestamp, rawName, email, phone, amount, partner, eligibility, ip, status, source] = parts;
          const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
          if (cleanPhone.length === 10) {
            recentCsvLeads.push({
              timestamp: timestamp ? timestamp.replace(/^"|"$/g, '').trim() : '',
              name: rawName ? rawName.replace(/^"|"$/g, '').trim() : 'Applicant',
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
        break;
      }
    } catch(e) {}
  }

  // Backend API
  const backendRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const backendData = await backendRes.json();
  const rawList = backendData.applications || [];

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
    if (b.displayId) usedDisplayIds.add(String(b.displayId));
    if (b.id) usedDisplayIds.add(String(b.id));
  }

  const extraLiveApps = [];
  const nowIst = new Date();
  const todayIstStr = '2026-09-30';

  for (let idx = 0; idx < recentCsvLeads.length; idx++) {
    const row = recentCsvLeads[idx];
    const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
    const isToday = rowDate === todayIstStr;
    const keyWithDate = `${row.phone}_${rowDate}_${row.amount}`;

    if (!backendExistingKeys.has(keyWithDate) && isToday) {
      const isoCreated = row.timestamp
        ? (row.timestamp.includes('T') ? row.timestamp : `${row.timestamp.replace(' ', 'T')}+05:30`)
        : new Date().toISOString();
      const createdDate = new Date(isoCreated);
      const yy = String(createdDate.getFullYear()).slice(-2);
      const mm = String(createdDate.getMonth() + 1).padStart(2, '0');
      const dd = String(createdDate.getDate()).padStart(2, '0');

      const baseId = `PIM-${yy}${mm}${dd}-${row.phone.slice(-4)}`;
      let displayId = baseId;
      let counter = 1;
      while (usedDisplayIds.has(displayId)) {
        counter++;
        displayId = `${baseId}-${counter}`;
      }
      usedDisplayIds.add(displayId);

      extraLiveApps.push({
        id: `pim-live-${row.phone}-${createdDate.getTime()}-${idx}`,
        displayId: displayId,
        applicantName: row.name,
        name: row.name,
        fullName: row.name,
        phone: row.phone,
        phoneNumber: row.phone,
        mobile: `+91 ${row.phone}`,
        email: row.email,
        amount: row.amount,
        loanAmount: row.amount,
        applied: row.amount,
        tenureMonths: 12,
        purpose: 'Personal Loan',
        monthlyIncome: row.amount >= 50000 ? 55000 : 35000,
        salary: row.amount >= 50000 ? 55000 : 35000,
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

  const combined = [...extraLiveApps, ...rawList];
  console.log('✅ Combined total leads count:', combined.length);
  console.log('✅ Today leads count:', extraLiveApps.length);
  console.log('\n--- TOP LEADS IN CRM ---');
  combined.slice(0, 5).forEach((l, i) => {
    console.log(`${i + 1}. [${l.displayId || l.id}] ${l.name || l.applicantName} - ₹${l.amount} | Date: ${l.created_at || l.createdAt} | Status: ${l.status}`);
  });
}

verify();
