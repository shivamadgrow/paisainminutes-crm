const fs = require('fs');

async function testFetchAll() {
  const res = await fetch('https://paisainminutes.com/leads_log.csv?t=' + Date.now(), { cache: 'no-store' });
  const text = await res.text();
  const lines = text.trim().split('\n');
  const recentCsvLeads = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
    recentCsvLeads.push({
      timestamp: parts[0],
      name: parts[1],
      email: parts[2],
      phone: String(parts[3] || '').replace(/\D/g, '').slice(-10),
      amount: Number(parts[4]) || 0,
      partner: parts[5],
      status: parts[8],
      source: parts[9]
    });
  }

  const bRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const bData = await bRes.json();
  const rawList = Array.isArray(bData) ? bData : (bData.applications || bData.leads || []);

  const extraLiveApps = [];
  const ingestedSubmissionKeys = new Set();
  const nowIst = new Date();
  const todayIstStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(nowIst);

  for (let idx = 0; idx < recentCsvLeads.length; idx++) {
    const row = recentCsvLeads[idx];
    const rowDate = row.timestamp ? row.timestamp.slice(0, 10) : '';
    const isToday = rowDate === todayIstStr || rowDate === '2026-09-30';
    const rowTime = (row.timestamp || '').trim();
    const submissionKey = row.phone + '_' + rowTime;

    if (ingestedSubmissionKeys.has(submissionKey)) continue;
    ingestedSubmissionKeys.add(submissionKey);

    const alreadyInBackend = rawList.some(b => {
      const bp = String(b.phone || b.phoneNumber || '').replace(/\D/g, '').slice(-10);
      if (bp !== row.phone) return false;
      const bCreated = b.createdAt ? new Date(b.createdAt).toISOString() : '';
      const bTime = (b.created_at || (b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 19).replace('T', ' ') : ''));
      const bAmt = Number(b.amount || 0);
      return bTime === rowTime && bAmt === row.amount;
    });

    if (!alreadyInBackend && isToday) {
      extraLiveApps.push(row);
    }
  }

  const combined = [...extraLiveApps, ...rawList];
  console.log('Total combined applications:', combined.length);
  console.log('Today live extra apps:', extraLiveApps.length);
  extraLiveApps.forEach(a => console.log('  Live App:', a.timestamp, a.name, a.phone, '₹' + a.amount));

  const target1648 = combined.find(c => (c.created_at && c.created_at.includes('16:48')) || (c.timestamp && c.timestamp.includes('16:48')));
  console.log('Found 16:48:02 lead in combined array?:', !!target1648);
}

testFetchAll().catch(console.error);
