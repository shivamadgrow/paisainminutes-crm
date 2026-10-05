/*
 * Paisa in Minutes - device login for verified customers.
 *
 * After a customer verifies their mobile number with an OTP, this browser holds a login for life: a refresh
 * token that never expires (it rotates on every use and can be revoked by the customer or by staff) and a
 * short-lived access token. While it exists the customer is never asked for an OTP again on this device.
 * A different phone or browser has no login and needs one OTP.
 *
 * The server only gives personal data and bureau lookups to a request that carries this login for the phone
 * in question (fixes F-26, F-10, F-29). PHP pages (loan offers, track status) cannot read localStorage, so the
 * current access token is also kept in the short-lived cookie pim_at, which they forward to the server.
 */
(function () {
    'use strict';

    var KEY = 'pim_auth_v1';
    var COOKIE = 'pim_at';
    var LEEWAY_MS = 60 * 1000;

    function apiBase() {
        return String(window.backend_server_url || 'https://api.paisainminutes.tech').replace(/\/+$/, '');
    }
    function digits10(phone) {
        return String(phone || '').replace(/\D/g, '').slice(-10);
    }
    function read() {
        try { return JSON.parse(localStorage.getItem(KEY) || 'null') || null; } catch (e) { return null; }
    }
    function write(state) {
        try {
            if (state) localStorage.setItem(KEY, JSON.stringify(state));
            else localStorage.removeItem(KEY);
        } catch (e) { /* private mode: the login lives only until the tab closes */ }
    }
    function jwtExpiry(token) {
        try {
            var part = String(token).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(part)).exp * 1000;
        } catch (e) { return 0; }
    }
    function setCookie(token, exp) {
        try {
            var seconds = Math.max(0, Math.floor((exp - Date.now()) / 1000));
            document.cookie = COOKIE + '=' + token + '; path=/; max-age=' + seconds + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
        } catch (e) { /* ignore */ }
    }
    function clearCookie() {
        try { document.cookie = COOKIE + '=; path=/; max-age=0; SameSite=Lax'; } catch (e) { /* ignore */ }
    }

    /** Saves the login returned by verify-otp. */
    function store(login) {
        if (!login || !login.token || !login.refreshToken) return false;
        var exp = jwtExpiry(login.token);
        write({ phone: digits10(login.phone), refreshToken: login.refreshToken, accessToken: login.token, exp: exp });
        setCookie(login.token, exp);
        return true;
    }

    function hasLogin() {
        var s = read();
        return !!(s && s.refreshToken);
    }
    /** True when THIS device already holds a verified login for this phone number. */
    function isVerifiedFor(phone) {
        var s = read();
        return !!(s && s.refreshToken && s.phone && s.phone === digits10(phone));
    }
    function phone() {
        var s = read();
        return s && s.phone ? s.phone : '';
    }

    async function doRefresh() {
        var s = read();
        if (!s || !s.refreshToken) return null;
        // Another tab may have refreshed while we waited for the lock.
        if (s.accessToken && s.exp - Date.now() > LEEWAY_MS) { setCookie(s.accessToken, s.exp); return s.accessToken; }
        try {
            var res = await window.fetch(apiBase() + '/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ refreshToken: s.refreshToken })
            });
            if (res.status === 401) { clear(); return null; } // the login was ended (customer, staff or theft detection)
            var data = await res.json().catch(function () { return {}; });
            if (res.ok && data.token && data.refreshToken) {
                store({ token: data.token, refreshToken: data.refreshToken, phone: s.phone });
                return data.token;
            }
        } catch (e) { /* offline: keep the login, try again later */ }
        return s.accessToken && s.exp > Date.now() ? s.accessToken : null;
    }

    /** A valid access token for this device's login, refreshing it when needed. Null when there is no login. */
    async function accessToken() {
        var s = read();
        if (!s || !s.refreshToken) return null;
        if (s.accessToken && s.exp - Date.now() > LEEWAY_MS) {
            setCookie(s.accessToken, s.exp);
            return s.accessToken;
        }
        if (navigator.locks && navigator.locks.request) {
            return navigator.locks.request('pim_auth_refresh', function () { return doRefresh(); });
        }
        return doRefresh();
    }

    function clear() {
        write(null);
        clearCookie();
    }

    /** Ends this device's login on the server and here. */
    async function logout() {
        var s = read();
        var token = await accessToken();
        if (s && token) {
            try {
                await window.fetch(apiBase() + '/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify({ refreshToken: s.refreshToken })
                });
            } catch (e) { /* the local login is removed anyway */ }
        }
        clear();
    }

    window.PIMAuth = { store: store, hasLogin: hasLogin, isVerifiedFor: isVerifiedFor, phone: phone, accessToken: accessToken, clear: clear, logout: logout };

    // Keep the cookie fresh so PHP pages opened later (loan offers, track status) can read this customer's data.
    if (hasLogin()) accessToken();
    document.addEventListener('visibilitychange', function () { if (!document.hidden && hasLogin()) accessToken(); });

    // A PHP page that needed the login but found no cookie sets window.PIM_NEEDS_AUTH (in the page body, so this runs
    // after the DOM is ready): this device refreshes its login once and reloads the page a single time.
    document.addEventListener('DOMContentLoaded', function () {
        var tried = false;
        try { tried = sessionStorage.getItem('pim_auth_reload') === '1'; } catch (e) { /* ignore */ }
        if (!window.PIM_NEEDS_AUTH) {
            try { sessionStorage.removeItem('pim_auth_reload'); } catch (e) { /* ignore */ }
            return;
        }
        if (tried || !hasLogin()) return;
        accessToken().then(function (token) {
            if (!token) return;
            try { sessionStorage.setItem('pim_auth_reload', '1'); } catch (e) { /* ignore */ }
            window.location.reload();
        });
    });
})();
