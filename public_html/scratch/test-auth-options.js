const https = require('https');

function testReq(headers, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const req = https.request('https://api.paisainminutes.tech/api/loan-applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: d });
      });
    });
    req.on('error', (e) => resolve({ error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const payload = {
    applicantName: "Test Lead",
    phone: "9876543210",
    email: "test@example.com",
    amount: 50000,
    tenureMonths: 12,
    purpose: "Personal Loan",
    monthlyIncome: 55000
  };

  const headerTests = [
    { name: "No Auth", headers: {} },
    { name: "x-api-key: crm", headers: { 'x-api-key': 'crm' } },
    { name: "x-api-key: paisa_crm", headers: { 'x-api-key': 'paisa_crm' } },
    { name: "x-api-key: live_pk_rupay91_892b1a", headers: { 'x-api-key': 'live_pk_rupay91_892b1a' } },
    { name: "Bearer admin", headers: { 'Authorization': 'Bearer admin' } },
    { name: "Bearer crm", headers: { 'Authorization': 'Bearer crm' } },
    { name: "Bearer paisainminutes", headers: { 'Authorization': 'Bearer paisainminutes' } }
  ];

  for (const t of headerTests) {
    const res = await testReq(t.headers, payload);
    console.log(`${t.name} -> ${res.status}: ${res.data}`);
  }
}

run();
