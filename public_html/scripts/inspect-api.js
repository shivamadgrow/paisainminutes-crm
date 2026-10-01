const http = require('https');

http.get('https://api.paisainminutes.tech/api/docs/swagger-ui-init.js', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const startMarker = '"swaggerDoc": ';
        const startIndex = data.indexOf(startMarker);
        if (startIndex === -1) {
            console.log('Cannot find swaggerDoc');
            return;
        }
        const endMarker = ',\n  "customOptions":';
        let endIndex = data.indexOf(endMarker, startIndex);
        if (endIndex === -1) {
            endIndex = data.indexOf(',\r\n  "customOptions":', startIndex);
        }
        if (endIndex === -1) {
            endIndex = data.indexOf('"customOptions"', startIndex);
            // find last comma before this
            endIndex = data.lastIndexOf(',', endIndex);
        }
        const jsonStr = data.substring(startIndex + startMarker.length, endIndex);
        try {
            const spec = JSON.parse(jsonStr);
            console.log('All Swagger paths:', Object.keys(spec.paths));
        } catch (e) {
            console.log('JSON Parse error:', e.message);
        }
    });
});
