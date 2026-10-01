const https = require('https');

function patchJson(path, payload, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const req = https.request(`https://api.paisainminutes.tech${path}`, {
      method: 'PATCH',
      headers
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

async function testPatch() {
  // Let's get one lead ID first from GET /api/loan-applications/all
  const res = await new Promise((resolve, reject) => {
    https.get('https://api.paisainminutes.tech/api/loan-applications/all', (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const firstLead = res.applications[0];
  console.log("First lead ID:", firstLead?.id, "Current status:", firstLead?.status);

  if (firstLead) {
    console.log("\nAttempting PATCH /api/loan-applications/" + firstLead.id + " without token...");
    const patchRes = await patchJson(`/api/loan-applications/${firstLead.id}`, { status: firstLead.status || "FRESH" });
    console.log("PATCH status without auth:", patchRes);
  }
}

testPatch();
