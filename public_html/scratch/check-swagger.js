const https = require('https');

https.get('https://api.paisainminutes.tech/api/docs/swagger-ui-init.js', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const startMarker = '"swaggerDoc": ';
    const sIdx = d.indexOf(startMarker);
    const endMarker = '"customOptions":';
    let eIdx = d.indexOf(endMarker, sIdx);
    const lastBrace = d.lastIndexOf('}', eIdx);
    const jsonStr = d.substring(sIdx + startMarker.length, lastBrace + 1);
    const spec = JSON.parse(jsonStr);
    console.log('All paths:', Object.keys(spec.paths));
    console.log('\nPOST /api/loan-applications:');
    console.log(JSON.stringify(spec.paths['/api/loan-applications'], null, 2));
    if (spec.components && spec.components.schemas) {
      console.log('\nSchemas:', Object.keys(spec.components.schemas));
    }
  });
});

