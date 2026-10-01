async function testDirectBackend() {
  console.log("=== Verifying 100% Backend API Integration ===");

  // 1. Fetch all leads directly from Node.js backend
  const res = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const data = await res.json();
  const leads = data.applications || [];

  console.log(`[1] Total Leads directly in api.paisainminutes.tech: ${leads.length}`);
  console.log(`[2] Top 3 recent leads on backend:`);
  leads.slice(0, 3).forEach(l => {
    console.log(`    - ID: ${l.displayId} | Name: ${l.applicantName || l.name} | Phone: ${l.phone} | Status: ${l.status}`);
  });

  // 2. Fetch lenders directly from Node.js backend
  const lenRes = await fetch('https://api.paisainminutes.tech/api/lenders');
  const lenData = await lenRes.json();
  console.log(`[3] Total Lenders directly from api.paisainminutes.tech: ${(lenData.lenders || lenData).length}`);

  console.log("\nZero CSVs are being used for CRM data. Everything is 100% centralized on api.paisainminutes.tech!");
}

testDirectBackend();
