async function checkLatest() {
  const r = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
  const d = await r.json();
  const list = d.applications || [];
  console.log('Total in backend:', list.length);
  console.log('Top 10 most recent:');
  list.slice(0, 10).forEach((a, i) => {
    console.log(`[${i+1}] ID: ${a.displayId} | Name: ${a.applicantName || a.name} | Phone: ${a.phone} | CreatedAt: ${a.createdAt} | UpdatedAt: ${a.updatedAt}`);
  });

  const shivams = list.filter(a => (a.applicantName && a.applicantName.toLowerCase().includes('shivam')) || (a.phone && a.phone.includes('6998')));
  console.log(`\nFound ${shivams.length} leads matching Shivam or 6998:`);
  shivams.forEach(s => {
    console.log(`- ID: ${s.displayId} | Name: ${s.applicantName} | Phone: ${s.phone} | Created: ${s.createdAt} | Updated: ${s.updatedAt} | Amount: ${s.amount}`);
  });
}
checkLatest();
