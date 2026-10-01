const https = require('https');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function test() {
  console.log("Checking GET /api/lenders...");
  try {
    const lendersRes = await get('https://api.paisainminutes.tech/api/lenders');
    console.log("Status:", lendersRes.status);
    console.log("Response:", lendersRes.data.slice(0, 300));
  } catch (e) {
    console.error("Lenders error:", e.message);
  }

  console.log("\nChecking GET /api/loan-applications/all...");
  try {
    const leadsRes = await get('https://api.paisainminutes.tech/api/loan-applications/all');
    console.log("Status:", leadsRes.status);
    console.log("Response:", leadsRes.data.slice(0, 300));
  } catch (e) {
    console.error("Leads error:", e.message);
  }
}

test();
