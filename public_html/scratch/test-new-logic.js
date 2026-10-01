const fs = require('fs');

async function testNewIngestion() {
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

  const usedDisplayIds = new Set();
  const rawListSubmissionKeys = new Set();
  rawList.forEach(b => {
    const p = String(b.phone || b.phoneNumber || (b.user && b.user.phone) || '').replace(/\D/g, '').slice(-10);
    const d = b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : '';
    const t = (b.created_at || (b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 19).replace('T', ' ') : ''));
    if (p && t) rawListSubmissionKeys.add(`${p}_${t}`);
    if (b.displayId) usedDisplayIds.add(String(b.displayId));
    if (b.id) usedDisplayIds.add(String(b.id));
  });

  const extraLiveApps = [];
  const ingestedSubmissionKeys = new Set();

  for (let idx = 0; idx < recentCsvLeads.length; idx++) {
    const row = recentCsvLeads[idx];
    const rowTime = (row.timestamp || '').trim();
    const submissionKey = `${row.phone}_${rowTime}`;

    if (ingestedSubmissionKeys.has(submissionKey)) continue;
    ingestedSubmissionKeys.add(submissionKey);

    if (rawListSubmissionKeys.has(submissionKey)) continue;

    // Check if it's already in rawList by exact phone, timestamp, and amount
    const inRawList = rawList.some(b => {
      const bp = String(b.phone || b.phoneNumber || '').replace(/\D/g, '').slice(-10);
      if (bp !== row.phone) return false;
      const bCreated = b.createdAt ? new Date(b.createdAt).toISOString() : '';
      const bTime = (b.created_at || bCreated).slice(0, 19).replace('T', ' ');
      const bAmt = Number(b.amount || 0);
      return bTime === rowTime && bAmt === row.amount;
    });

    if (!inRawList) {
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
        phone: row.phone,
        amount: row.amount,
        createdAt: isoCreated,
        created_at: row.timestamp,
        isLiveSubmission: true
      });
    }
  }

  console.log(`\n✅ Extra live apps successfully ingested: ${extraLiveApps.length}`);
  extraLiveApps.forEach(a => {
    console.log(`  ID: ${a.displayId} | Name: ${a.applicantName} | Phone: ${a.phone} | Amount: ₹${a.amount} | Time: ${a.created_at}`);
  });
}

testNewIngestion();
