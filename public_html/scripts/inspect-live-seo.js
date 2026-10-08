async function inspectLiveHomepage() {
    try {
        const res = await fetch('https://paisainminutes.com/');
        console.log('Status:', res.status);
        console.log('Headers:');
        for (const [k, v] of res.headers.entries()) {
            if (['content-type', 'x-robots-tag', 'strict-transport-security', 'server', 'x-frame-options'].includes(k.toLowerCase())) {
                console.log(' ', k, ':', v);
            }
        }
        const html = await res.text();
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        const metaRobots = html.match(/<meta\s+name=["']robots["'][^>]*content=["']([^"']+)["']/i);
        const canonical = html.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        console.log('HTML Title:', titleMatch ? titleMatch[1] : 'NONE');
        console.log('Meta Robots:', metaRobots ? metaRobots[1] : 'NONE');
        console.log('Canonical:', canonical ? canonical[1] : 'NONE');
        console.log('H1:', h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'NONE');

        // Check Schema
        const schemaMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
        console.log('Schema count:', schemaMatches.length);
        schemaMatches.forEach((s, idx) => {
            try {
                const parsed = JSON.parse(s[1]);
                console.log(`Schema #${idx + 1} types:`, parsed['@graph'] ? parsed['@graph'].map(item => item['@type']) : parsed['@type']);
            } catch (err) {
                console.log(`Schema #${idx + 1} JSON Parse Error:`, err.message);
            }
        });
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
inspectLiveHomepage();
