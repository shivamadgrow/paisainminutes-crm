async function testCrmLoad() {
  const res = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const data = await res.json();
  const leads = data.applications || [];
  console.log('Total Leads on api.paisainminutes.tech:', leads.length);
  
  // Show breakdown of statuses
  const statusCounts = {};
  leads.forEach(l => {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  });
  console.log('Status breakdown on server:', statusCounts);

  // Check today leads (2026-09-30)
  const todayLeads = leads.filter(l => (l.createdAt && l.createdAt.startsWith('2026-09-30')));
  console.log('Total leads created today (2026-09-30):', todayLeads.length);
  todayLeads.forEach(l => {
    console.log(`- ${l.displayId} | ${l.applicantName || l.name} | Phone: ${l.phone} | Status: ${l.status} | Lender: ${l.selectedLenderId || 'None'}`);
  });
}
testCrmLoad();
