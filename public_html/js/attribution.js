/*
 * Paisa in Minutes - marketing attribution capture.
 *
 * Reads UTM parameters, ad click ids (gclid / fbclid) and the external referrer when a visitor lands,
 * remembers them for 30 days (first touch + last touch) and adds them to every lead submitted to
 * /api/public/leads. The server decides the channel (Google Ads, Meta, SMS, RCS, WhatsApp, AI, Website...).
 * Nothing here guesses a source: no signal means no utm_source is sent.
 */
(function () {
    'use strict';

    var KEY = 'pim_attr_v2';
    var TTL_MS = 30 * 24 * 60 * 60 * 1000;
    var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

    function read() {
        var raw = null;
        try { raw = localStorage.getItem(KEY); } catch (e) {}
        if (!raw) {
            var m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
            if (m) { try { raw = decodeURIComponent(m[1]); } catch (e) {} }
        }
        if (!raw) return {};
        try {
            var data = JSON.parse(raw);
            if (data && data.last && Date.now() - (data.ts || 0) > TTL_MS) return {};
            return data || {};
        } catch (e) { return {}; }
    }

    function write(data) {
        var json = JSON.stringify(data);
        try { localStorage.setItem(KEY, json); } catch (e) {}
        try {
            var host = location.hostname.split('.').slice(-2).join('.');
            var domain = /^[a-z0-9.-]+\.[a-z]+$/i.test(host) && host.indexOf('.') > 0 ? '; domain=.' + host : '';
            document.cookie = KEY + '=' + encodeURIComponent(json) + '; max-age=' + TTL_MS / 1000 + '; path=/; SameSite=Lax' + domain;
        } catch (e) {}
    }

    function externalReferrer() {
        try {
            if (!document.referrer) return '';
            var host = new URL(document.referrer).hostname.toLowerCase();
            if (host === location.hostname.toLowerCase()) return '';
            if (/(^|\.)paisainminutes\.(com|tech|in)$/.test(host)) return '';
            return document.referrer.slice(0, 300);
        } catch (e) { return ''; }
    }

    function clean(value) {
        value = String(value == null ? '' : value).trim().slice(0, 200);
        return value === 'null' || value === 'undefined' ? '' : value;
    }

    function capture() {
        var stored = read();
        var params = new URLSearchParams(location.search);
        var touch = {};
        FIELDS.forEach(function (name) { var v = clean(params.get(name)); if (v) touch[name] = v; });
        if (!touch.gclid) { var g = clean(params.get('gbraid') || params.get('wbraid')); if (g) touch.gclid = g; }

        var hasCampaign = Object.keys(touch).length > 0;
        var referrer = externalReferrer();

        if (hasCampaign) {
            // The same source copied onto an internal link (?utm_source=x) must not wipe medium / campaign.
            if (stored.last && stored.last.utm_source && touch.utm_source === stored.last.utm_source) {
                for (var k in stored.last) { if (!touch[k] && FIELDS.indexOf(k) > -1) touch[k] = stored.last[k]; }
            }
            var sameSource = stored.last && stored.last.utm_source && touch.utm_source === stored.last.utm_source;
            touch.referrer = referrer || (stored.last && stored.last.referrer) || '';
            touch.landing_page = sameSource && stored.last.landing_page ? stored.last.landing_page : location.pathname;
            stored.last = touch;
            if (!stored.first) stored.first = touch;
            stored.ts = Date.now();
            write(stored);
        } else if (referrer && !stored.last) {
            // Organic / AI / referral visit: only recorded when there is nothing better already stored.
            var t = { referrer: referrer, landing_page: location.pathname };
            stored.last = t;
            if (!stored.first) stored.first = t;
            stored.ts = Date.now();
            write(stored);
        }

        // Keep the legacy storage key in step so older page code never reads a stale or invented value.
        var src = stored.last && stored.last.utm_source;
        try {
            if (src) { sessionStorage.setItem('pim_utm_source', src); localStorage.setItem('pim_utm_source', src); }
            else { sessionStorage.removeItem('pim_utm_source'); localStorage.removeItem('pim_utm_source'); }
        } catch (e) {}
        return stored;
    }

    var state = capture();

    function payload() {
        var last = state.last || {};
        var first = state.first || {};
        var out = {};
        FIELDS.forEach(function (name) { if (last[name]) out[name] = last[name]; });
        if (last.referrer) out.referrer = last.referrer;
        if (last.landing_page) out.landing_page = last.landing_page;
        ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'referrer'].forEach(function (name) {
            if (first[name]) out['first_' + name] = first[name];
        });
        return out;
    }

    function entryPoint() {
        var p = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.php$/, '');
        return p || 'home';
    }

    window.PIMAttribution = { get: function () { return state; }, payload: payload };

    // Add attribution to every lead submission, whichever form or script sends it. When this device holds a verified
    // login (pim-auth.js) the request also carries it, which is what lets the server look up the credit score.
    if (typeof window.fetch === 'function') {
        var nativeFetch = window.fetch;
        window.fetch = function (input, init) {
            var self = this;
            return (async function () {
                try {
                    var url = typeof input === 'string' ? input : (input && input.url) || '';
                    var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
                    if (method === 'POST' && url.indexOf('/api/public/leads') !== -1 && init && typeof init.body === 'string') {
                        var body = JSON.parse(init.body);
                        // Forms used to invent utm_source / lead_source; the stored visitor data is the only truth now.
                        delete body.utm_source; delete body.utmSource; delete body.lead_source; delete body.leadSource;
                        var extra = payload();
                        for (var key in extra) body[key] = extra[key];
                        body.entry_point = entryPoint();
                        var headers = Object.assign({}, init.headers || {});
                        if (window.PIMAuth && window.PIMAuth.hasLogin() && !headers.Authorization) {
                            var token = await window.PIMAuth.accessToken();
                            if (token) headers.Authorization = 'Bearer ' + token;
                        }
                        init = Object.assign({}, init, { body: JSON.stringify(body), headers: headers });
                    }
                } catch (e) { /* never block a lead because of tracking */ }
                return nativeFetch.call(self, input, init);
            })();
        };
    }
})();
