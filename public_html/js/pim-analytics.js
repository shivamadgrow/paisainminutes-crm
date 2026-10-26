/**
 * Paisa in Minutes - Production-Ready Analytics & GTM/GA4 dataLayer Dispatcher
 * 
 * Strict Financial Privacy & Security:
 * - NEVER sends PII (Name, Phone, Email, PAN, Aadhaar, CIBIL score, Salary, OTP, Bank details)
 * - Uses pseudonymized internal lead reference (e.g. PIM-XXXX-XXXX) for conversion deduplication
 * - Handles SPA navigation, scroll depth, CTA clicks, form start, OTP success, lead generation, partner redirects
 * 
 * Container: GTM-P8QSMXHR
 */
(function(window, document) {
    'use strict';

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Internal deduplication memory
    var dedupeRegistry = {};
    var scrollThresholdsFired = {};
    var initialPathname = window.location.pathname;
    var initialUrl = window.location.href;
    var formStartTracked = {};

    // Whitelist of approved non-PII analytics parameter keys
    var SAFE_EVENT_KEYS = [
        'event', 'event_id', 'lead_reference',
        'cta_name', 'cta_text', 'cta_location',
        'form_name', 'form_location',
        'partner_name', 'partner_category',
        'step_name', 'step_number',
        'auth_method', 'status',
        'currency', 'value', 'percent_scrolled',
        'page_location', 'page_path', 'page_title',
        'campaign_category', 'lead_source',
        'outbound_url', 'destination_url',
        'offers_count', 'offers_available', 'timestamp'
    ];

    // Blocked PII parameter keys
    var BLOCKED_PII_KEYS = [
        'phone', 'mobile', 'cell', 'telephone',
        'email', 'mail',
        'name', 'fullname', 'firstname', 'lastname', 'applicantname', 'customername', 'username',
        'pan', 'pannumber', 'aadhaar', 'aadhar', 'dob', 'birthdate',
        'cibil', 'cibilscore', 'bureau', 'bureauscore', 'creditscore', 'score',
        'salary', 'income', 'monthlysalary', 'monthlyincome',
        'otp', 'pin', 'password', 'token', 'authtoken', 'authorization',
        'bank', 'bankaccount', 'accountnumber', 'ifsc', 'accno'
    ];

    /**
     * Deep sanitizer to strip PII from any object or primitive before pushing to dataLayer
     */
    function sanitizeData(data) {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(function(item) {
                return sanitizeData(item);
            });
        }

        var clean = {};
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // If explicitly in safe analytics whitelist, accept key
                if (SAFE_EVENT_KEYS.indexOf(key) === -1) {
                    var lk = key.toLowerCase().replace(/[^a-z0-9_]/g, '');
                    var isBlockedKey = BLOCKED_PII_KEYS.some(function(b) {
                        return lk === b || lk.indexOf(b + '_') === 0 || lk.indexOf('_' + b) !== -1 || (b.length >= 4 && lk.indexOf(b) !== -1);
                    });

                    if (isBlockedKey) {
                        continue; // Discard sensitive keys
                    }
                }

                var val = data[key];
                if (typeof val === 'string') {
                    // Check for raw 10-digit phone number or email patterns
                    var phoneRegex = /^[6-9]\d{9}$/;
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    var panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
                    var trimmed = val.trim();
                    if (phoneRegex.test(trimmed) || emailRegex.test(trimmed) || panRegex.test(trimmed)) {
                        continue; // Discard sensitive values
                    }
                    clean[key] = trimmed.slice(0, 300);
                } else if (typeof val === 'number') {
                    clean[key] = val;
                } else if (typeof val === 'boolean') {
                    clean[key] = val;
                } else if (typeof val === 'object' && val !== null) {
                    clean[key] = sanitizeData(val);
                }
            }
        }
        return clean;
    }

    /**
     * Push event to GTM dataLayer with privacy scrubbing and deduplication
     */
    function pushEvent(eventName, params, dedupeKey) {
        if (!eventName) return;

        if (dedupeKey) {
            if (dedupeRegistry[dedupeKey]) return;
            dedupeRegistry[dedupeKey] = true;
        }

        var cleanParams = sanitizeData(params || {});
        var payload = Object.assign({
            event: eventName,
            timestamp: new Date().toISOString()
        }, cleanParams);

        window.dataLayer.push(payload);
    }

    /**
     * GA4 Event Implementations
     */
    var PIMAnalytics = {
        /**
         * Initialize analytics module and auto-track listeners
         */
        init: function() {
            PIMAnalytics.initNavigationTracking();
            PIMAnalytics.initScrollTracking();
            PIMAnalytics.initCtaTracking();
            PIMAnalytics.checkLandingPage();
        },

        /**
         * Universal event dispatcher
         */
        push: pushEvent,

        /**
         * SPA and Dynamic Navigation Page View Tracker
         * Guarantees one page_view per actual route transition, preventing duplicates
         */
        initNavigationTracking: function() {
            var lastTrackedUrl = window.location.pathname + window.location.search;

            function onNavChange() {
                var currentUrl = window.location.pathname + window.location.search;
                if (currentUrl !== lastTrackedUrl) {
                    lastTrackedUrl = currentUrl;
                    pushEvent('page_view', {
                        page_location: window.location.href,
                        page_path: window.location.pathname,
                        page_title: document.title
                    });
                    // Reset scroll depth tracking for the new route
                    scrollThresholdsFired = {};
                    PIMAnalytics.checkLandingPage();
                }
            }

            var historyObj = window.history;
            if (historyObj) {
                var wrapHistory = function(method) {
                    var orig = historyObj[method];
                    if (typeof orig !== 'function') return function() {};
                    return function() {
                        var res = orig.apply(this, arguments);
                        try { onNavChange(); } catch(e) {}
                        return res;
                    };
                };

                if (historyObj.pushState) historyObj.pushState = wrapHistory('pushState');
                if (historyObj.replaceState) historyObj.replaceState = wrapHistory('replaceState');
            }
            if (window.addEventListener) {
                window.addEventListener('popstate', onNavChange, { passive: true });
            }
        },

        /**
         * Check if current page is the instant cash loan landing page
         */
        checkLandingPage: function() {
            if (window.location.pathname.indexOf('/instant-cash-loan') !== -1) {
                PIMAnalytics.trackLandingPageView();
            }
        },

        /**
         * Track landing page visit (view_landing_page)
         */
        trackLandingPageView: function() {
            pushEvent('view_landing_page', {
                page_location: window.location.href,
                page_path: window.location.pathname,
                page_title: document.title,
                campaign_category: 'instant_cash_loan'
            }, 'vlp_' + window.location.pathname);
        },

        /**
         * Track important CTA clicks (Apply Now, Check Eligibility, Get Started)
         */
        initCtaTracking: function() {
            document.addEventListener('click', function(e) {
                var target = e.target.closest('a, button');
                if (!target) return;

                // Match primary and conversion CTAs
                var isCta = (
                    target.classList.contains('btn-accent') ||
                    target.classList.contains('btn-primary') ||
                    target.classList.contains('cro-cta-button') ||
                    target.classList.contains('cro-btn') ||
                    target.classList.contains('open-apply-modal') ||
                    target.classList.contains('btn-partner-apply') ||
                    target.classList.contains('cro-offer-cta') ||
                    target.hasAttribute('data-cta') ||
                    target.id === 'applyNowBtn' ||
                    target.id === 'heroApplyBtn'
                );

                if (isCta) {
                    var text = (target.innerText || target.textContent || target.getAttribute('aria-label') || '').trim().slice(0, 80);
                    var href = target.getAttribute('href') || '';
                    var location = target.closest('header') ? 'header' :
                                   target.closest('.hero, .cro-hero-section, .sec-hero') ? 'hero' :
                                   target.closest('.cro-sticky-bottom-bar, .sticky-bar') ? 'sticky_bar' :
                                   target.closest('.cro-offer-card, .partner-card') ? 'offer_card' :
                                   target.closest('footer') ? 'footer' : 'page_body';

                    var ctaName = target.getAttribute('data-cta') || target.id || text || 'cta_button';

                    pushEvent('cta_click', {
                        cta_name: ctaName,
                        cta_text: text,
                        cta_location: location,
                        destination_url: href ? href.slice(0, 200) : ''
                    });
                }
            }, { passive: true });
        },

        /**
         * Track meaningful scroll depth (25%, 50%, 75%, 90%)
         */
        initScrollTracking: function() {
            var ticking = false;
            var thresholds = [25, 50, 75, 90];

            function checkScroll() {
                var h = document.documentElement;
                var b = document.body;
                var st = 'scrollTop';
                var sh = 'scrollHeight';

                var scrollPercent = Math.round(
                    ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100
                );

                thresholds.forEach(function(t) {
                    if (scrollPercent >= t && !scrollThresholdsFired[t]) {
                        scrollThresholdsFired[t] = true;
                        pushEvent('scroll_depth', {
                            percent_scrolled: t,
                            page_path: window.location.pathname
                        });
                    }
                });
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(checkScroll);
                    ticking = true;
                }
            }, { passive: true });
        },

        /**
         * Track first meaningful form interaction (form_start)
         */
        trackFormStart: function(formName, formLocation) {
            formName = formName || 'lead_form';
            var key = 'form_start_' + formName + '_' + window.location.pathname;
            if (formStartTracked[key]) return;
            formStartTracked[key] = true;

            pushEvent('form_start', {
                form_name: formName,
                form_location: formLocation || window.location.pathname
            });
        },

        /**
         * Track OTP Verification Success (otp_verification_success)
         * STRICT NO PII: Only status and auth method
         */
        trackOtpSuccess: function(authMethod) {
            pushEvent('otp_verification_success', {
                auth_method: authMethod || 'otp',
                status: 'success'
            }, 'otp_success_' + window.location.pathname);
        },

        /**
         * Track Application Start / Stage Disclosure (application_start)
         * Fired when the user starts the loan configuration / reveals matched offers
         */
        trackApplicationStart: function(stepName, details) {
            var params = {
                step_name: stepName || 'offers_revealed'
            };
            if (details && typeof details === 'object') {
                Object.assign(params, details);
            }
            pushEvent('application_start', params);
        },

        /**
         * Track Lead Generation (generate_lead)
         * CRITICAL: Fired ONLY after confirmed backend save with internal lead reference
         * Deduplicated: Guaranteed to fire at most ONCE per unique lead reference
         */
        trackLeadGenerated: function(leadReference, options) {
            if (!leadReference) return;
            var cleanLeadId = String(leadReference).replace(/[^A-Za-z0-9_-]/g, '');
            if (!cleanLeadId) return;

            var dedupeKey = 'lead_gen_' + cleanLeadId;
            if (dedupeRegistry[dedupeKey]) return;

            // Session check for persistent deduplication across refreshes
            try {
                if (sessionStorage.getItem('pim_lead_tracked_' + cleanLeadId)) {
                    return;
                }
                sessionStorage.setItem('pim_lead_tracked_' + cleanLeadId, '1');
            } catch(e) {}

            var safeParams = {
                event_id: cleanLeadId,
                lead_reference: cleanLeadId,
                currency: 'INR',
                value: (options && typeof options.value === 'number') ? options.value : 50000,
                lead_source: (options && options.lead_source) ? options.lead_source : 'website'
            };

            pushEvent('generate_lead', safeParams, dedupeKey);
        },

        /**
         * Track Outbound Partner Redirect (partner_redirect)
         */
        trackPartnerRedirect: function(partnerSlug, outboundUrl, leadId) {
            var params = {
                partner_name: String(partnerSlug || 'unknown').toLowerCase(),
                partner_category: 'instant_loan',
                outbound_url: outboundUrl ? String(outboundUrl).slice(0, 300) : ''
            };
            if (leadId) {
                params.lead_reference = String(leadId).replace(/[^A-Za-z0-9_-]/g, '');
            }
            pushEvent('partner_redirect', params);
        }
    };

    // Auto-init on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', PIMAnalytics.init);
    } else {
        PIMAnalytics.init();
    }

    // Export to global window
    window.PIMAnalytics = PIMAnalytics;

})(window, document);
