const https = require('https');

async function testWebsiteSubmission() {
  const phone = '9876543219';
  const clean10 = phone.replace(/\D/g, '').slice(-10);
  const backendPhone = '+91' + clean10;

  const payload = JSON.stringify({
    amount: 30000,
    tenureMonths: 12,
    purpose: 'Personal Loan',
    monthlyIncome: 40000,
    phone: backendPhone,
    phoneNumber: clean10,
    mobile: clean10,
    name: 'Website Live Test',
    applicantName: 'Website Live Test',
    email: 'livetest@example.com'
  });

  const res = await new Promise((resolve) => {
    const req = https.request('https://api.paisainminutes.tech/api/loan-applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Accept': 'application/json'
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

  console.log('Submission Status:', res.status);
  console.log('Backend Response:', res.body);

  // Check GET /all
  const getRes = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const getData = await getRes.json();
  const created = (getData.applications || []).find(a => String(a.phone).includes('3219'));
  console.log('Found in GET /all:', created ? `YES! ID: ${created.displayId}, Name: ${created.applicantName}` : 'NO');
}

testWebsiteSubmission();
