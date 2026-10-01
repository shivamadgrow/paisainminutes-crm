const fs = require('fs');

async function runDeepResearch() {
  console.log('=====================================================');
  console.log('🔍 DEEP RESEARCH: TRACKING ALL LEADS & PARTNER CLICKS');
  console.log('=====================================================\n');

  // 1. Load Backend / Local Leads
  let leads = [];
  try {
    const res = await fetch('https://api.paisainminutes.tech/api/loan-applications/all');
    if (res.ok) {
      const data = await res.json();
      leads = Array.isArray(data) ? data : (data.applications || data.leads || []);
      console.log(`[1] Loaded ${leads.length} live leads from https://api.paisainminutes.tech`);
    }
  } catch (e) {
    console.log('[1] Backend fetch error:', e.message);
  }

  if (leads.length === 0 && fs.existsSync('public_html/crm/public/data/leads.json')) {
    leads = JSON.parse(fs.readFileSync('public_html/crm/public/data/leads.json', 'utf8'));
    console.log(`[1] Loaded ${leads.length} fallback leads from crm/public/data/leads.json`);
  }

  // 2. Load Clicks from clicks.json
  let clicksJson = [];
  if (fs.existsSync('public_html/data/clicks.json')) {
    try {
      clicksJson = JSON.parse(fs.readFileSync('public_html/data/clicks.json', 'utf8'));
      console.log(`[2] Loaded ${clicksJson.length} click records from data/clicks.json`);
    } catch (e) {}
  }

  // 3. Load Clicks from clicks_log.csv
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
        raw: line
      });
    }
    console.log(`[3] Loaded ${clicksCsv.length} click records from clicks_log.csv`);
  }

  // 4. Load Partner Assignments (by_phone and by_lead)
  let partnerAssignments = { by_phone: {}, by_lead: {} };
  const paFiles = [
    'public_html/data/partner_assignments.json',
    'public_html/crm/partner_assignments.json'
  ];
  paFiles.forEach(f => {
    if (fs.existsSync(f)) {
      try {
        const d = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (d.by_phone) Object.assign(partnerAssignments.by_phone, d.by_phone);
        if (d.by_lead) Object.assign(partnerAssignments.by_lead, d.by_lead);
      } catch (e) {}
    }
  });
  console.log(`[4] Loaded partner assignments: ${Object.keys(partnerAssignments.by_phone).length} phones, ${Object.keys(partnerAssignments.by_lead).length} lead IDs`);

  // 5. Load Partner Events
  let partnerEvents = [];
  if (fs.existsSync('public_html/data/lead_partner_events.json')) {
    try {
      partnerEvents = JSON.parse(fs.readFileSync('public_html/data/lead_partner_events.json', 'utf8'));
      console.log(`[5] Loaded ${partnerEvents.length} events from lead_partner_events.json`);
    } catch (e) {}
  }

  // 6. Cross-reference: For EVERY lead, find all clicks, partner assignments, and destination
  console.log('\n=====================================================');
  console.log('📊 CROSS-REFERENCED LEAD JOURNEY & PARTNER DESTINATIONS');
  console.log('=====================================================\n');

  const trackedResults = [];

  leads.forEach((l, idx) => {
    const rawPhone = String(l.phone || l.phoneNumber || (l.user && l.user.phone) || '').replace(/\D/g, '').slice(-10);
    const leadId = String(l.id || l.lead_id || l.loanNo || l.displayId || `LEAD-${idx}`);
    const displayId = String(l.displayId || l.loanNo || l.id || `PIM-${idx}`);
    const name = l.applicantName || l.fullName || l.name || (l.user && l.user.name) || 'Applicant';

    // Check clicksJson
    const leadClicksJson = clicksJson.filter(c => {
      const cPhone = String(c.phone || '').replace(/\D/g, '').slice(-10);
      const cId = String(c.lead_id || '');
      return (rawPhone && cPhone === rawPhone) || (cId && (cId === leadId || cId === displayId));
    });

    // Check clicksCsv
    const leadClicksCsv = clicksCsv.filter(c => {
      const cPhone = String(c.phone || '').replace(/\D/g, '').slice(-10);
      const cId = String(c.lead_id || '');
      return (rawPhone && cPhone === rawPhone) || (cId && (cId === leadId || cId === displayId));
    });

    // Check partner assignments
    const assignByPhone = rawPhone ? partnerAssignments.by_phone[rawPhone] : null;
    const assignByLead = partnerAssignments.by_lead[leadId] || partnerAssignments.by_lead[displayId];
    const assignedPartner = assignByPhone?.partner || assignByLead?.partner || null;
    const assignedTime = assignByPhone?.timestamp || assignByLead?.timestamp || null;

    // Check partner events
    const leadEvents = partnerEvents.filter(e => {
      const eId = String(e.lead_id || '');
      const ePhone = String(e.details?.phone || '').replace(/\D/g, '').slice(-10);
      return (eId && (eId === leadId || eId === displayId)) || (rawPhone && ePhone === rawPhone);
    });

    // Consolidate unique partners clicked
    const clickedPartners = new Set();
    leadClicksJson.forEach(c => {
      if (c.partner_name && c.partner_name !== 'Paisa in Minutes') clickedPartners.add(c.partner_name);
    });
    leadClicksCsv.forEach(c => {
      if (c.partner_name && c.partner_name !== 'Paisa in Minutes') clickedPartners.add(c.partner_name);
    });
    if (assignedPartner) clickedPartners.add(assignedPartner);

    const hasActivity = clickedPartners.size > 0 || leadClicksJson.length > 0 || leadClicksCsv.length > 0 || leadEvents.length > 0;

    trackedResults.push({
      index: idx + 1,
      name,
      phone: rawPhone,
      displayId,
      backendId: leadId,
      assignedPartner,
      assignedTime,
      clickedPartners: Array.from(clickedPartners),
      totalClicks: leadClicksJson.length + leadClicksCsv.length,
      eventsCount: leadEvents.length,
      hasActivity,
      allClicks: [...leadClicksJson, ...leadClicksCsv]
    });
  });

  // Print leads with activity first
  const activeLeads = trackedResults.filter(r => r.hasActivity);
  const inactiveLeads = trackedResults.filter(r => !r.hasActivity);

  console.log(`🎯 TOTAL ACTIVE LEADS WITH PARTNER CLICKS / REDIRECTS: ${activeLeads.length} out of ${trackedResults.length}\n`);

  activeLeads.forEach(r => {
    console.log(`─────────────────────────────────────────────────────`);
    console.log(`👤 Name: ${r.name} | Phone: ${r.phone} | ID: ${r.displayId}`);
    console.log(`🏢 Assigned Partner: ${r.assignedPartner || 'None'}`);
    console.log(`🔗 Clicked Companies: ${r.clickedPartners.length > 0 ? r.clickedPartners.join(', ') : 'None'}`);
    console.log(`🖱️ Total Click Events: ${r.totalClicks} | Audit Events: ${r.eventsCount}`);
    if (r.allClicks.length > 0) {
      console.log(`   Click Details:`);
      r.allClicks.forEach(c => {
        console.log(`     - [${c.timestamp || 'No time'}] Partner: ${c.partner_name} | Source: ${c.source} | Click ID: ${c.click_id}`);
      });
    }
  });

  console.log(`\n─────────────────────────────────────────────────────`);
  console.log(`ℹ️ INACTIVE LEADS (No Partner Clicks Yet): ${inactiveLeads.length}`);
  console.log(`Sample Inactive:`);
  inactiveLeads.slice(0, 10).forEach(r => {
    console.log(`   - ${r.name} (${r.phone}) [${r.displayId}]`);
  });

  // Check specifically for PIM-260930-6033
  console.log('\n=====================================================');
  console.log('🔍 SPECIFIC AUDIT: LEAD PIM-260930-6033 / 8810606033');
  console.log('=====================================================');
  const target6033 = trackedResults.find(r => r.phone === '8810606033' || r.displayId.includes('6033'));
  console.log(JSON.stringify(target6033, null, 2));

  // Also check if 8810606033 appears ANYWHERE in the entire workspace files
  return trackedResults;
}

runDeepResearch().then(() => console.log('\n✅ Deep Research Complete.')).catch(console.error);
