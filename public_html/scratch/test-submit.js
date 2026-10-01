const https = require('https');

function postJson(path, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = https.request(`https://api.paisainminutes.tech${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testSubmit() {
  const minimalPayload = {
    applicantName: "Test Applicant",
    name: "Test Applicant",
    phone: "9876543210",
    email: "test@example.com",
    amount: 50000,
    tenureMonths: 12,
    purpose: "Personal Loan",
    monthlyIncome: 55000
  };

  console.log("Testing POST /api/loan-applications without token...");
  const resNoAuth = await postJson('/api/loan-applications', minimalPayload);
  console.log("Status:", resNoAuth.status);
  console.log("Body:", resNoAuth.body);
}

testSubmit();
