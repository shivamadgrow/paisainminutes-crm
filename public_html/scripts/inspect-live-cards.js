const https = require('https');

https.get('https://paisainminutes.com/instant-cash-loan', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const cardMatches = data.match(/class="cro-offer-card"/g) || [];
    console.log('cro-offer-card count:', cardMatches.length);
    const offersSection = data.match(/<section class="cro-offers-section"[^>]*>/);
    console.log('offersSection tag:', offersSection ? offersSection[0] : 'not found');
    const offersGrid = data.match(/<div class="cro-offers-grid"[^>]*>([\s\S]*?)<\/div>/);
    if (offersGrid) {
      console.log('Inside offersGrid length:', offersGrid[1].length);
      console.log('Inside offersGrid snippet:', offersGrid[1].substring(0, 300));
    } else {
      console.log('offersGrid div not found or failed regex');
    }
  });
}).on('error', e => console.error(e));
