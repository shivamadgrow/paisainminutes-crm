const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://paisainminutes.com/instant-cash-loan', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const cleaned = data.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="[BASE64_IMAGE]"');
    const outPath = path.join(__dirname, 'live-cleaned-dump.html');
    fs.writeFileSync(outPath, cleaned, 'utf8');
    console.log('Saved live cleaned dump. Size in chars:', cleaned.length);
  });
}).on('error', e => console.error(e));
