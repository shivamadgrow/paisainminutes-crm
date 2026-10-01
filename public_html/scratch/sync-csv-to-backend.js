const https = require('https');

async function syncLeads() {
  const backendRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const backendData = await backendRes.json();
  const backendList = backendData.applications || [];
  
  const backendPhones = new Set(backendList.map(b => String(b.phone || '').replace(/\D/g, '').slice(-10)));
  console.log('Unique phones already in backend:', backendPhones.size);

  const csvRes = await fetch('https://paisainminutes.com/leads_log.csv?t=' + Date.now());
  const csvText = await csvRes.text();
  const lines = csvText.trim().split('\n');

  const missingInBackend = [];
  const seenInCsv = new Set();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
    const [timestamp, name, email, phone, amount, partner, eligibility, ip, status, source] = parts;
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length === 10 && !backendPhones.has(cleanPhone) && !seenInCsv.has(cleanPhone)) {
      seenInCsv.add(cleanPhone);
      missingInBackend.push({
        timestamp,
        name: name || 'Applicant',
        email: (email && email !== '—') ? email : `${cleanPhone}@paisainminutes.com`,
        phone: cleanPhone,
        amount: Number(amount) || 25000,
        partner,
        status: status || 'FRESH'
      });
    }
  }

  console.log(`Found ${missingInBackend.length} CSV leads not yet in backend database.`);
  console.log('Sample to sync:', missingInBackend.slice(0, 3));

  let synced = 0;
  for (const lead of missingInBackend) {
    const payload = JSON.stringify({
      amount: lead.amount,
      tenureMonths: 12,
      purpose: 'Personal Loan',
      phone: '+91' + lead.phone,
      phoneNumber: lead.phone,
      mobile: lead.phone,
      name: lead.name,
      applicantName: lead.name,
      email: lead.email
    });

    const res = await new Promise((resolve) => {
      const req = https.request('https://api.paisainminutes.tech/api/loan-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => resolve({ status: r.statusCode, body: d }));
      });
      req.on('error', e => resolve({ error: e.message }));
      req.write(payload);
      req.end();
    });

    if (res.status === 200 || res.status === 201) {
      synced++;
    } else {
      console.log(`Failed to sync ${lead.name} (${lead.phone}):`, res.status, res.body);
    }
  }

  console.log(`\nSuccessfully synced ${synced} / ${missingInBackend.length} leads directly to api.paisainminutes.tech!`);

  // Verify total count now
  const verifyRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const verifyData = await verifyRes.json();
  console.log(`New Total in backend database: ${verifyData.applications.length}`);
}

syncLeads();
