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

async function run() {
  const testPhone = "9999988888";
  console.log("Sending OTP to:", testPhone);
  const sendRes = await postJson('/api/auth/send-otp', { phone: testPhone });
  console.log("Send OTP response:", sendRes);

  console.log("\nAttempting verify OTP 1234...");
  const verifyRes = await postJson('/api/auth/verify-otp', { phone: testPhone, code: "1234" });
  console.log("Verify OTP response:", verifyRes);
}

run();
