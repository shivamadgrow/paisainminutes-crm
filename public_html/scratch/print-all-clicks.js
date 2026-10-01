const fs = require('fs');

async function printAllClickJourneys() {
  console.log('========================================================================');
  console.log('📌 COMPLETE AUDIT OF EVERY LEAD THAT CLICKED ON COMPANIES');
  console.log('========================================================================\n');

  // Load all click sources
  let clicksJson = [];
  if (fs.existsSync('public_html/data/clicks.json')) {
    clicksJson = JSON.parse(fs.readFileSync('public_html/data/clicks.json', 'utf8'));
  }

  let clicksCsv = [];
  if (fs.existsSync('public_html/clicks_log.csv')) {
    const lines = fs.readFileSync('public_html/clicks_log.csv', 'utf8').trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      clicksCsv.push({
        click_id: parts[0],
        lead_id: parts[1],
        phone: parts[2],
        affiliate_id: parts[3],
        source: parts[4],
        partner_name: parts[5]?.replace(/^"|"$/g, ''),
        target_url: parts[6],
        timestamp: parts[7]?.replace(/^"|"$/g, ''),
        ip: parts[8],
        user_agent: parts[9]
      });
    }
  }

  // Load partner assignments
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

  // Group all clicks by unique phone and lead_id
  const leadJourneyMap = new Map();

  function recordJourney(phone, leadId, partner, timestamp, source, targetUrl, clickId) {
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    const key = cleanPhone || String(leadId || 'UNKNOWN');
    if (!key || key === 'UNKNOWN') return;

    if (!leadJourneyMap.has(key)) {
      leadJourneyMap.set(key, {
        phone: cleanPhone,
        leadIds: new Set(),
        destinations: [],
        assignedPartner: partnerAssignments.by_phone[cleanPhone]?.partner || partnerAssignments.by_lead[leadId]?.partner || null
      });
    }

    const item = leadJourneyMap.get(key);
    if (leadId) item.leadIds.add(String(leadId));
    if (partner && partner !== 'Paisa in Minutes') {
      item.destinations.push({
        partner,
        timestamp,
        source,
        clickId,
        targetUrl
      });
    }
  }

  clicksJson.forEach(c => {
    recordJourney(c.phone, c.lead_id, c.partner_name, c.timestamp, c.source, c.target_url, c.click_id);
  });

  clicksCsv.forEach(c => {
    recordJourney(c.phone, c.lead_id, c.partner_name, c.timestamp, c.source, c.target_url, c.click_id);
  });

  // Also match with user names from leads.json
  let leads = [];
  if (fs.existsSync('public_html/crm/public/data/leads.json')) {
    leads = JSON.parse(fs.readFileSync('public_html/crm/public/data/leads.json', 'utf8'));
  }

  const nameMap = new Map();
  leads.forEach(l => {
    const p = String(l.phone || l.mobile || '').replace(/\D/g, '').slice(-10);
    if (p) nameMap.set(p, l.name || l.fullName || l.applicantName || 'Applicant');
  });

  console.log(`Found ${leadJourneyMap.size} distinct applicant journeys with real click tracking:\n`);

  let count = 1;
  for (const [key, journey] of leadJourneyMap.entries()) {
    const name = nameMap.get(journey.phone) || 'Applicant';
    const uniquePartners = [...new Set(journey.destinations.map(d => d.partner))];
    const ids = Array.from(journey.leadIds).join(', ') || 'N/A';

    console.log(`------------------------------------------------------------------------`);
    console.log(`#${count++} Applicant: ${name} | Phone: ${journey.phone || 'N/A'} | Lead ID: ${ids}`);
    console.log(`🏢 Assigned Partner (CRM/Server): ${journey.assignedPartner || (uniquePartners[uniquePartners.length - 1] || 'None')}`);
    console.log(`🎯 Companies Clicked (${uniquePartners.length}): ${uniquePartners.join(', ') || 'None'}`);
    console.log(`📜 Click Timeline:`);
    
    // Deduplicate identical clicks by clickId
    const seen = new Set();
    journey.destinations.forEach(d => {
      const k = `${d.partner}_${d.timestamp}_${d.clickId}`;
      if (!seen.has(k)) {
        seen.add(k);
        console.log(`   ⏱️ [${d.timestamp}] → ${d.partner} (Source: ${d.source}, ID: ${d.clickId})`);
        if (d.targetUrl) console.log(`      🔗 Outbound URL: ${d.targetUrl.slice(0, 110)}...`);
      }
    });
    console.log('');
  }
}

printAllClickJourneys().catch(console.error);
