const https = require('https');

https.get('https://api.paisainminutes.tech/api/docs/swagger-ui-init.js', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const s = d.indexOf('"swaggerDoc": ');
    const e = d.indexOf('"customOptions":');
    const json = d.substring(s + 14, d.lastIndexOf('}', e) + 1);
    const spec = JSON.parse(json);
    console.log('Security schemes:', JSON.stringify(spec.components?.securitySchemes, null, 2));
    console.log('POST /api/auth/send-otp:', JSON.stringify(spec.paths['/api/auth/send-otp'], null, 2));
    console.log('POST /api/auth/verify-otp:', JSON.stringify(spec.paths['/api/auth/verify-otp'], null, 2));
  });
});
