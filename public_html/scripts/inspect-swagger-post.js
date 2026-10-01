const https = require('https');

https.get('https://api.paisainminutes.tech/api/docs/swagger-ui-init.js', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const startMarker = '"swaggerDoc": ';
    const sIdx = d.indexOf(startMarker);
    const endMarker = ',\n  "customOptions":';
    let eIdx = d.indexOf(endMarker, sIdx);
    if (eIdx === -1) eIdx = d.indexOf(',\r\n  "customOptions":', sIdx);
    const jsonStr = d.substring(sIdx + startMarker.length, eIdx);
    const spec = JSON.parse(jsonStr);
    console.log('POST /api/loan-applications:', JSON.stringify(spec.paths['/api/loan-applications']?.post, null, 2));
  });
});
