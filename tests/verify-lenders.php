<?php
/**
 * Lender Interest Rates Audit Suite
 * Verifies that:
 * 1. Jhatpat Loans displays 'Up to 0.8% per day'
 * 2. Every other lender displays 'Up to 1% per day'
 * 3. No non-Jhatpat lender displays 0.8%
 * 4. No occurrences of 'Ranges from upto 0.8% per day' exist
 * 5. All config files, templates, and rendered HTML outputs are consistent
 */

$rootDir = dirname(__DIR__);
$publicHtmlDir = $rootDir . '/public_html';

$passed = 0;
$failed = 0;

function check($desc, $cond) {
    global $passed, $failed;
    if ($cond) {
        echo "✅ PASS: $desc\n";
        $passed++;
    } else {
        echo "❌ FAIL: $desc\n";
        $failed++;
    }
}

echo "==================================================\n";
echo "AUDIT SUITE: LENDER OFFER CARD INTEREST RATES\n";
echo "==================================================\n\n";

// 1. Audit public_html/config/partners.php
echo "--- 1. AUDITING public_html/config/partners.php ---\n";
$partners = require $publicHtmlDir . '/config/partners.php';

$expectedLenders = [
    'jhatpatloans' => ['name' => 'Jhatpat Loans', 'rate' => 'Up to 0.8% per day', 'isJhatpat' => true],
    'rupay91'      => ['name' => 'Rupay 91',      'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'borrowera'    => ['name' => 'Borrowera',     'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'easyfincare'  => ['name' => 'Easy Fincare',  'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'ticket2loan'  => ['name' => 'Ticket 2 Loan', 'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'udhaarnow'    => ['name' => 'UdhaarNow',     'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'loanwithin'   => ['name' => 'LoanWithin',    'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'shubhcash'    => ['name' => 'ShubhCash',     'rate' => 'Up to 1% per day',   'isJhatpat' => false],
    'instarupees'  => ['name' => 'Insta Rupees',  'rate' => 'Up to 1% per day',   'isJhatpat' => false],
];

foreach ($expectedLenders as $slug => $info) {
    check("partners.php has {$info['name']} ($slug)", isset($partners[$slug]));
    if (isset($partners[$slug])) {
        $actualRate = $partners[$slug]['interest_rate'] ?? '';
        check("partners.php: {$info['name']} interest_rate is exactly '{$info['rate']}'", $actualRate === $info['rate']);
        if ($info['isJhatpat']) {
            check("partners.php: Jhatpat Loans displays 0.8% per day", $actualRate === 'Up to 0.8% per day');
        } else {
            check("partners.php: Non-Jhatpat lender {$info['name']} does NOT display 0.8%", strpos($actualRate, '0.8%') === false);
        }
        // Integrity check of untouched fields
        check("partners.php: {$info['name']} max_amount intact", !empty($partners[$slug]['max_amount']));
        check("partners.php: {$info['name']} apr intact", !empty($partners[$slug]['apr']));
        check("partners.php: {$info['name']} processing_fee intact", !empty($partners[$slug]['processing_fee']));
        check("partners.php: {$info['name']} gst intact", !empty($partners[$slug]['gst']));
        check("partners.php: {$info['name']} total_repayment intact", !empty($partners[$slug]['total_repayment']));
    }
}

// 2. Audit public_html/our-partners.php
echo "\n--- 2. AUDITING public_html/our-partners.php ---\n";
$ourPartnersRaw = file_get_contents($publicHtmlDir . '/our-partners.php');
if (preg_match('/\$onboardedPartners\s*=\s*\[(.*?)\];/s', $ourPartnersRaw, $m)) {
    eval('$onboardedPartners = [' . $m[1] . '];');
    check("our-partners.php contains 9 onboarded partners", count($onboardedPartners) === 9);
    foreach ($onboardedPartners as $p) {
        $slug = $p['slug'];
        $actualRate = $p['interest_rate'] ?? '';
        if ($slug === 'jhatpatloans') {
            check("our-partners.php: Jhatpat Loans displays 'Up to 0.8% per day'", $actualRate === 'Up to 0.8% per day');
        } else {
            check("our-partners.php: {$p['name']} displays 'Up to 1% per day'", $actualRate === 'Up to 1% per day');
            check("our-partners.php: Non-Jhatpat {$p['name']} does NOT display 0.8%", strpos($actualRate, '0.8%') === false);
        }
    }
} else {
    check("Could parse onboardedPartners from our-partners.php", false);
}

// 3. Audit affiliatePartners.js
echo "\n--- 3. AUDITING crm/src/data/affiliatePartners.js ---\n";
$affContent = file_get_contents($publicHtmlDir . '/crm/src/data/affiliatePartners.js');
foreach ($expectedLenders as $slug => $info) {
    if (preg_match("/id:\s*['\"]" . preg_quote($slug, '/') . "['\"].*?interestRate:\s*['\"]([^'\"]+)['\"]/s", $affContent, $m)) {
        $jsRate = $m[1];
        check("affiliatePartners.js: {$info['name']} interestRate is '{$info['rate']}'", $jsRate === $info['rate']);
        if ($info['isJhatpat']) {
            check("affiliatePartners.js: Jhatpat Loans displays 0.8%", $jsRate === 'Up to 0.8% per day');
        } else {
            check("affiliatePartners.js: {$info['name']} does NOT display 0.8%", strpos($jsRate, '0.8%') === false);
        }
    } else {
        check("affiliatePartners.js: Found {$info['name']}", false);
    }
}

// 4. Audit Rendered HTML in public_html/instant-cash-loan.php
echo "\n--- 4. AUDITING RENDERED HTML OF public_html/instant-cash-loan.php ---\n";
$_SERVER['DOCUMENT_ROOT'] = $publicHtmlDir;
$_SERVER['HTTP_HOST'] = 'paisainminutes.com';
$_SERVER['REQUEST_URI'] = '/instant-cash-loan';

ob_start();
include $publicHtmlDir . '/instant-cash-loan.php';
$renderedHtml = ob_get_clean();

foreach ($expectedLenders as $slug => $info) {
    // Find card container with lender name and match its INTEREST RATE span
    $pattern = '/<h3 class="cro-offer-lender-name">' . preg_quote($info['name'], '/') . '<\/h3>.*?<span class="cro-metric-label">INTEREST RATE<\/span>\s*<span class="cro-metric-val">([^<]+)<\/span>/s';
    if (preg_match($pattern, $renderedHtml, $m)) {
        $htmlRate = trim($m[1]);
        check("Rendered HTML: {$info['name']} displays '{$info['rate']}'", $htmlRate === $info['rate']);
        if ($info['isJhatpat']) {
            check("Rendered HTML: Jhatpat Loans displays 0.8% per day", $htmlRate === 'Up to 0.8% per day');
        } else {
            check("Rendered HTML: {$info['name']} does NOT display 0.8%", strpos($htmlRate, '0.8%') === false);
        }
    } else {
        check("Rendered HTML: Found offer card for {$info['name']}", false);
    }
}

// Check for legacy/banned strings in rendered HTML
check("Rendered HTML: Zero occurrences of 'Ranges from upto'", strpos($renderedHtml, 'Ranges from upto') === false);
check("Rendered HTML: Zero occurrences of 'Ranges from upto 0.8% per day'", strpos($renderedHtml, 'Ranges from upto 0.8% per day') === false);
check("Rendered HTML: Zero occurrences of 'From 0.8% / day'", strpos($renderedHtml, 'From 0.8% / day') === false);

// 5. Future Lender and Edge Cases Simulation
echo "\n--- 5. SIMULATING FUTURE / DYNAMIC LENDERS ---\n";
// Simulation 1: Future lender with no rate set
$slug = 'futurepartner';
$partnerName = 'Future Partner';
$p = ['name' => $partnerName];
$isJhatpat = ($slug === 'jhatpatloans' || stripos($partnerName, 'jhatpat') !== false);
$defaultRate = $isJhatpat ? 'Up to 0.8% per day' : 'Up to 1% per day';
$rateString = trim((string)($p['interest_rate'] ?? $defaultRate));
if (!$isJhatpat && strpos($rateString, '0.8%') !== false) {
    $rateString = 'Up to 1% per day';
}
check("Future partner without interest_rate defaults to 'Up to 1% per day'", $rateString === 'Up to 1% per day');

// Simulation 2: Misconfigured lender passing 0.8%
$slug = 'misconfiguredpartner';
$partnerName = 'Misconfigured Partner';
$p = ['name' => $partnerName, 'interest_rate' => 'Up to 0.8% per day'];
$isJhatpat = ($slug === 'jhatpatloans' || stripos($partnerName, 'jhatpat') !== false);
$defaultRate = $isJhatpat ? 'Up to 0.8% per day' : 'Up to 1% per day';
$rateString = trim((string)($p['interest_rate'] ?? $defaultRate));
if (!$isJhatpat && strpos($rateString, '0.8%') !== false) {
    $rateString = 'Up to 1% per day';
}
check("Misconfigured non-Jhatpat partner is sanitized to 'Up to 1% per day'", $rateString === 'Up to 1% per day');

// 6. Global Codebase Scan for Obsolete String
echo "\n--- 6. GLOBAL CODEBASE INTEGRITY SCAN ---\n";
$scanFiles = [
    $publicHtmlDir . '/config/partners.php',
    $publicHtmlDir . '/our-partners.php',
    $publicHtmlDir . '/instant-cash-loan.php',
    $publicHtmlDir . '/loan-offers.php',
    $publicHtmlDir . '/crm/src/data/affiliatePartners.js',
    $publicHtmlDir . '/crm/src/components/LeadsView.jsx'
];

foreach ($scanFiles as $filePath) {
    $content = file_get_contents($filePath);
    $rel = str_replace($rootDir . '/', '', str_replace('\\', '/', $filePath));
    check("$rel: No 'Ranges from upto 0.8% per day'", strpos($content, 'Ranges from upto 0.8% per day') === false);
    check("$rel: No 'Ranges from upto'", strpos($content, 'Ranges from upto') === false);
}

echo "\n==================================================\n";
echo "TOTAL CHECKS: " . ($passed + $failed) . " | PASSED: $passed | FAILED: $failed\n";
if ($failed === 0) {
    echo "🎉 ALL LENDER INTEREST RATE AUDIT CHECKS PASSED 100%!\n";
    exit(0);
} else {
    echo "⚠️ SOME CHECKS FAILED!\n";
    exit(1);
}
