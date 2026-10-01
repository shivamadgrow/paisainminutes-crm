const fs = require('fs');

async function testEnrichment() {
  console.log('Testing lead enrichment with real click tracking data...');

  // 1. Load leads
  const leads = JSON.parse(fs.readFileSync('public_html/crm/public/data/leads.json', 'utf8'));

  // 2. Load partner assignments
  let partnerAssignments = { by_phone: {}, by_lead: {} };
  ['public_html/data/partner_assignments.json', 'public_html/crm/partner_assignments.json'].forEach(f => {
    if (fs.existsSync(f)) {
      try {
        const d = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (d.by_phone) Object.assign(partnerAssignments.by_phone, d.by_phone);
        if (d.by_lead) Object.assign(partnerAssignments.by_lead, d.by_lead);
      } catch (e) {}
    }
  });

  // 3. Load clicks
  const clicks = JSON.parse(fs.readFileSync('public_html/data/clicks.json', 'utf8'));

  console.log(`Loaded ${leads.length} leads, ${Object.keys(partnerAssignments.by_phone).length} assignments by phone, ${clicks.length} clicks`);

  const enriched = leads.map(l => {
    const phone = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
    const id = String(l.id || l.lead_id || l.displayId || '');
    const displayId = String(l.displayId || l.loanNo || l.id || '');

    // Check assignment
    const assign = (phone && partnerAssignments.by_phone[phone]) || 
                   partnerAssignments.by_lead[id] || 
                   partnerAssignments.by_lead[displayId];

    // Check clicks
    const leadClicks = clicks.filter(c => {
      const cp = String(c.phone || '').replace(/\D/g, '').slice(-10);
      const cid = String(c.lead_id || '');
      return (phone && cp === phone) || (cid && (cid === id || cid === displayId));
    });

    const realPartner = assign?.partner || 
                        (leadClicks.length > 0 ? leadClicks[0].partner_name : null);

    return {
      name: l.name,
      phone,
      displayId,
      assignedCompany: realPartner || (l.selectedLenderId || 'Pending Selection'),
      clickCount: leadClicks.length,
      realPartner: realPartner || 'None (Pending Selection)',
      hasClicked: !!realPartner
    };
  });

  const clickedCount = enriched.filter(e => e.hasClicked).length;
  console.log(`\n✅ Out of ${enriched.length} leads:`);
  console.log(`   - ${clickedCount} leads clicked on companies and were redirected.`);
  console.log(`   - ${enriched.length - clickedCount} leads are Pending Selection (haven't clicked an offer yet).\n`);

  console.log('--- LEADS THAT WENT TO COMPANIES ---');
  enriched.filter(e => e.hasClicked).forEach((e, idx) => {
    console.log(`${idx + 1}. ${e.name} (${e.phone}) -> Company: ${e.assignedCompany} [Clicks: ${e.clickCount}]`);
  });

  console.log('\n--- SAMPLE PENDING LEADS ---');
  enriched.filter(e => !e.hasClicked).slice(0, 5).forEach((e, idx) => {
    console.log(`${idx + 1}. ${e.name} (${e.phone}) -> ${e.assignedCompany}`);
  });
}

testEnrichment().catch(console.error);
