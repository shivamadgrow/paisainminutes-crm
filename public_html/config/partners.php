<?php
/**
 * Paisa in Minutes - Partner Companies Configuration
 *
 * Used to be a fully static, hand-maintained array and drifted out of sync with the
 * backend more than once (wrong roster, wrong eligibility numbers, a discontinued
 * partner still listed). The business data below — which partners are active, their
 * APR/tenure/fees, their min salary & CIBIL — now comes live from the backend
 * (GET {API}/public/partners), the same single source of truth the Android app
 * reads from. A partner that isn't ACTIVE in the backend is simply never in the
 * response, so it automatically disappears from every page that uses this file —
 * no manual edit needed when the roster changes.
 *
 * What stays static here, in $partnerPresentation below, is only what the backend
 * genuinely has no business modeling: bundled logo assets, badge copy/styling,
 * star rating, marketing feature bullets, and the real outbound affiliate URL
 * (already public in this site's rendered HTML today; unrelated to the live API).
 */

// Helper to resolve logo src cleanly with 100% fallback reliability
if (!function_exists('getPartnerLogoSrc')) {
    function getPartnerLogoSrc($filename, $fallbackDataUri) {
        $possiblePaths = [
            __DIR__ . '/../assets/images/' . $filename,
            __DIR__ . '/../assets/' . $filename,
            __DIR__ . '/../assets/images/partners/' . $filename
        ];

        foreach ($possiblePaths as $path) {
            if (file_exists($path) && filesize($path) > 0) {
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                if ($ext === 'svg') {
                    $mime = 'image/svg+xml';
                } elseif ($ext === 'jpg' || $ext === 'jpeg') {
                    $mime = 'image/jpeg';
                } elseif ($ext === 'webp') {
                    $mime = 'image/webp';
                } else {
                    $mime = 'image/png';
                }
                return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
            }
        }

        return $fallbackDataUri;
    }
}

// Indian digit grouping (₹1,00,000, not ₹100,000) — PHP's number_format() only
// does Western grouping, so a small helper is needed for the real format every
// other part of this product already uses.
if (!function_exists('formatIndianRupees')) {
    function formatIndianRupees($amount) {
        $n = (int) $amount;
        $isNegative = $n < 0;
        $n = abs($n);
        $str = (string) $n;
        if (strlen($str) <= 3) {
            $formatted = $str;
        } else {
            $last3 = substr($str, -3);
            $rest = substr($str, 0, -3);
            $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', $rest);
            $formatted = $rest . ',' . $last3;
        }
        return ($isNegative ? '-' : '') . '₹' . $formatted;
    }
}

/**
 * Fetches the live partner catalog from the backend, with a short-lived file cache
 * (fast, and spares the backend a request on every single page view) and a
 * stale-on-error fallback: if the live fetch fails, the last known-good cache is
 * served regardless of its age, so a transient backend blip doesn't take the
 * partners section down site-wide. Only an empty response (first-ever request with
 * the backend unreachable, no cache yet) returns [] — never fabricated data.
 */
if (!function_exists('fetchLivePartners')) {
    function fetchLivePartners() {
        $cacheFile = __DIR__ . '/.partners-cache.json';
        $cacheTtl = 180; // seconds

        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTtl) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if (is_array($cached)) return $cached;
        }

        $apiUrl = 'https://api.paisainminutes.tech/api/public/partners';
        $response = false;
        $httpCode = 0;
        if (function_exists('curl_init')) {
            $ch = curl_init($apiUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 3,
                CURLOPT_CONNECTTIMEOUT => 2,
            ]);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
        }

        if ($response !== false && $httpCode === 200) {
            $data = json_decode($response, true);
            if (isset($data['success']) && $data['success'] && isset($data['partners']) && is_array($data['partners'])) {
                @file_put_contents($cacheFile, json_encode($data['partners']));
                return $data['partners'];
            }
        }

        // Live fetch failed — fall back to the last known-good cache, however old.
        if (file_exists($cacheFile)) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if (is_array($cached)) return $cached;
        }

        return [];
    }
}

// Presentation-only registry — cosmetic/branding details the backend doesn't
// model. A slug not listed here (e.g. a brand-new partner activated in the
// backend before anyone has added its branding) still renders, with sane generic
// defaults, rather than being silently dropped.
$partnerPresentation = [
    'rupay91' => [
        'logo' => getPartnerLogoSrc('rupay91.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60"><rect width="220" height="60" rx="8" fill="%230F172A"/><text x="20" y="38" font-family="sans-serif" font-weight="bold" font-size="22" fill="%232563EB">RuPay<tspan fill="%2310B981">91</tspan></text></svg>'),
        'badge' => 'Verified Partner',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'flame',
        'badge_type' => 'featured',
        'rating' => '4.9',
        'min_slab' => 8,
        'tier' => 'high',
        'eligibility_badge' => 'Matched for High Salary & CIBIL Tier',
        'features' => ['Fast Digital Process', 'Direct Bank Account Disbursal', 'Zero Physical Paperwork'],
        'target_url' => 'https://loans.rupay91.com/login',
    ],
    'jhatpatloans' => [
        'logo' => getPartnerLogoSrc('jhatpatloans.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="21" fill="%231E3A8A">JHATPAT <tspan fill="%2310B981">LOANS</tspan></text></svg>'),
        'badge' => 'Fast Verification',
        'badge_text' => 'Digital Verification',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'rating' => '4.9',
        'min_slab' => 3,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Digital Online Process)',
        'features' => ['Hassle Free Digital Process', 'Direct Bank Transfer on Approval', '100% Digital & Paperless'],
        'target_url' => 'https://www.jhatpatloans.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}',
    ],
    'instarupees' => [
        'logo' => getPartnerLogoSrc('instarupees.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="20" fill="%23000000">INSTA <tspan fill="%23DC2626">RUPEES</tspan></text></svg>'),
        'badge' => 'Direct Credit',
        'badge_text' => 'Direct Application',
        'badge_icon' => 'zap',
        'badge_type' => 'popular',
        'rating' => '4.8',
        'min_slab' => 2,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Online Evaluation)',
        'features' => ['Paperless Digital Sanction', 'Fast Application Processing', 'No Preclosure Charges'],
        'target_url' => 'https://www.instarupees.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}',
    ],
    'borrowera' => [
        'logo' => getPartnerLogoSrc('borrowera.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="22" fill="%23EA580C">borrow<tspan fill="%231E3A8A">era</tspan></text></svg>'),
        'badge' => 'Fast Track',
        'badge_text' => 'Digital Verification',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'rating' => '4.9',
        'min_slab' => 3,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Instant Online Credit)',
        'features' => ['100% Paperless Application', 'Speedy Digital Verification', 'Direct Account Credit in Minutes'],
        'target_url' => 'https://www.borrowera.com/apply-loan?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}',
    ],
    // Kept for when reactivated in the backend — harmless to leave here unused.
    'easyfincare' => [
        'logo' => getPartnerLogoSrc('easyfincare.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" rx="10" fill="%23ffffff"/><text x="16" y="38" font-family="sans-serif" font-weight="900" font-size="20" fill="%231E293B">EASY <tspan fill="%23DC2626">FINCA₹E</tspan></text></svg>'),
        'badge' => 'Simplifying Finance',
        'badge_text' => 'Quick Disbursal',
        'badge_icon' => 'zap',
        'badge_type' => 'instant',
        'rating' => '4.8',
        'min_slab' => 2,
        'tier' => 'mid',
        'eligibility_badge' => 'Matched (Simplifying Finance)',
        'features' => ['Minimal Documentation Required', 'Fast Loan Processing', 'Zero Hidden Charges'],
        'target_url' => 'https://www.easyfincare.com/apply-now?utm_source={aff_id}&utm_medium=affiliate&utm_campaign=paisainminutes&utm_term={lead_id}&sub_id={lead_id}&ref={aff_id}&source={aff_id}',
    ],
    'moneydot' => [
        'logo' => getPartnerLogoSrc('moneydot.png', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60"><rect width="240" height="60" fill="%23ffffff"/><defs><linearGradient id="mdGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%230284C7"/><stop offset="100%25" stop-color="%23059669"/></linearGradient></defs><rect x="6" y="6" width="48" height="48" rx="12" fill="url(%23mdGrad)"/><circle cx="30" cy="30" r="14" fill="%230284C7"/><text x="30" y="36" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23ffffff" text-anchor="middle">₹</text><text x="64" y="39" font-family="sans-serif" font-weight="900" font-size="24" fill="%23059669">Money<tspan fill="%230052CC">dot</tspan></text></svg>'),
        'badge' => 'Personal Loan App',
        'badge_text' => 'Personal Loan App',
        'badge_icon' => 'zap',
        'badge_type' => 'featured',
        'rating' => '—',
        'min_slab' => 1,
        'tier' => 'mid',
        'eligibility_badge' => 'Personal Loan App (Digital Eligibility)',
        'features' => ['Digital Loan Application via MoneyDot App', 'Flexible Tenure from 3 to 12 Months', 'Processing Fee: Up to 5.1% + GST'],
        'target_url' => 'https://play.google.com/store/apps/details?id=com.yrs.moneydot&hl=en_IN',
        'app_package' => 'com.yrs.moneydot',
    ],
];

$genericPresentation = [
    'logo' => null, 'badge' => 'Verified Partner', 'badge_text' => 'Online Application', 'badge_icon' => 'zap',
    'badge_type' => 'instant', 'rating' => '—', 'min_slab' => 1, 'tier' => 'mid',
    'eligibility_badge' => 'Matched (Online Evaluation)', 'features' => [], 'target_url' => null,
];

$livePartners = fetchLivePartners();

$partners = [];
foreach ($livePartners as $p) {
    $slug = $p['slug'] ?? null;
    if (!$slug) continue;
    $pres = array_merge($genericPresentation, $partnerPresentation[$slug] ?? []);
    $maxAmount = $p['maxAmount'] ?? 100000;
    $isApp = !empty($p['isApp']);

    $partners[$slug] = [
        'slug' => $slug,
        'name' => $p['name'],
        'partnerName' => $p['name'],
        'displayName' => $p['name'],
        'logo' => $pres['logo'],
        'local_logo' => $pres['logo'],
        'badge' => $pres['badge'],
        'badge_text' => $pres['badge_text'],
        'badge_icon' => $pres['badge_icon'],
        'badge_type' => $pres['badge_type'],
        'max_amount' => formatIndianRupees($maxAmount),
        'interest_rate' => $p['interestRateDisplay'] ?? null,
        'apr' => $p['aprDisplay'] ?? null,
        'tenure' => $p['tenureDisplay'] ?? null,
        'processing_fee' => $p['processingFeeDisplay'] ?? null,
        'gst' => '18% on Processing Fee',
        'total_repayment' => 'Determined by sanctioned tenure',
        'rating' => $pres['rating'],
        'min_salary' => $p['minSalaryDisplay'] ?? 'Partner Criteria',
        'min_salary_val' => $p['minSalary'] ?? 0,
        'min_cibil' => $p['minCibilDisplay'] ?? 'Partner Criteria',
        'min_cibil_val' => $p['minCibil'] ?? 0,
        'min_slab' => $pres['min_slab'],
        'tier' => $pres['tier'],
        'eligibility_badge' => $pres['eligibility_badge'],
        'features' => $pres['features'],
        'target_url' => $pres['target_url'],
    ];
    if ($isApp) {
        $partners[$slug]['is_app'] = true;
        $partners[$slug]['app_package'] = $p['appPackage'] ?? ($pres['app_package'] ?? null);
    }
}

return $partners;
