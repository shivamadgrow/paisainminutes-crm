<?php
// Local development router for PHP built-in server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$decoded_uri = urldecode($uri);
$clean_slug = trim(preg_replace('/\.php$/', '', $decoded_uri), '/');
$file = __DIR__ . $decoded_uri;

// 1. Root route
if ($uri === '/' || $uri === '') {
    require __DIR__ . '/index.php';
    return;
}

// 2. High-Ticket Personal Loan Amount Pages (> ₹1 Lakh limit) -> 301 to /1-lakh-personal-loan
if (preg_match('/^(5|10|20|30|40|50)-lakh-personal-loan$/', $clean_slug)) {
    header("Location: /1-lakh-personal-loan", true, 301);
    exit;
}

// 3. Specific 301 Redirects for Legacy / Discontinued URLs
$redirects = [
    'about' => '/about-us',
    'contact' => '/contact-us',
    'services' => '/personal-loan',
    'resources' => '/personal-loan-emi-calculator',
    'careers' => '/about-us',
    'blog' => '/personal-loan',
    'cibil-score-for-credit-card' => '/cibil-score-for-personal-loan',
    'loan-on-credit-card' => '/personal-loan',
];

if (isset($redirects[$clean_slug])) {
    header("Location: " . $redirects[$clean_slug], true, 301);
    exit;
}

// 4. HTTP 410 Gone for Permanently Retired Unsupported Products
$retired_410_patterns = [
    // Home Loans
    '/^(home-loan|10-lakh-home-loan|15-lakh-home-loan|20-lakh-home-loan|25-lakh-home-loan|30-lakh-home-loan|40-lakh-home-loan|50-lakh-home-loan|60-lakh-home-loan|home-construction-loan|home-extension-loan|home-renovation-loan|top-up-home-loan|home-loan-for-women|home-loan-for-self-employed|home-loan-interest-rates|home-loan-low-cibil-score|home-loan-balance-transfer|home-loan-eligibility-calculator|home-loan-emi-calculator|home-loan-prepayment-calculator|plot-loan)$/',
    // Gold Loans
    '/^(gold-loan|gold-loan-emi-calculator)$/',
    // Auto / Vehicle Loans
    '/^(car-loan|loan-against-car|two-wheeler-loan|tractor-loan-emi-calculator)$/',
    // Business / Commercial / MSME Loans
    '/^(business-loan|small-business-loan|startups-loan|msme-loan|mudra-loan|pmegp-loan|working-capital-loan|business-loan-emi-calculator|business-loan-interest-rates|business-loan-low-cibil-score|mudra-loan-emi-calculator|term-loan-emi-calculator)$/',
    // Agriculture & Allied
    '/^(dairy-farming-loan|goat-farming-loan|poultry-farm-loan)$/',
    // Other Non-Personal Loans
    '/^(education-loan|letter-of-credit|loan-against-fixed-deposit|loan-against-property|loan-against-property-emi-calculator)$/',
    // Credit Cards & Forex Cards
    '/^(credit-card|best-credit-cards|best-forex-cards|compare-credit-cards|credit-card-eligibility|credit-card-lounge-access|rupay-credit-cards|secured-credit-cards|lifetime-free-credit-cards|rewards-credit-cards|cashback-credit-cards|virtual-credit-cards|fuel-credit-cards|travel-credit-cards|international-credit-cards|zero-forex-markup-credit-cards)$/'
];

foreach ($retired_410_patterns as $pattern) {
    if (preg_match($pattern, $clean_slug)) {
        http_response_code(410);
        header('HTTP/1.1 410 Gone');
        header('Status: 410 Gone');
        header('X-Robots-Tag: noindex, nofollow, noarchive', true);
        ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>410 Gone - Page Permanently Retired | Paisa in Minutes</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { max-width: 520px; width: 100%; background: #ffffff; padding: 40px 32px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 0.85rem; border-radius: 9999px; margin-bottom: 16px; letter-spacing: 0.05em; }
        h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 12px; color: #0f172a; }
        p { font-size: 0.975rem; color: #64748b; line-height: 1.6; margin: 0 0 24px; }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-block; padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; text-decoration: none; transition: all 0.2s; }
        .btn-primary { background: #00D09C; color: #064e3b; }
        .btn-secondary { background: #1B2A6B; color: #ffffff; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">HTTP 410 GONE</span>
        <h1>Content Permanently Retired</h1>
        <p>This category has been permanently discontinued on Paisa in Minutes. We specialize exclusively in digital Personal Loans up to ₹1,00,000.</p>
        <div class="actions">
            <a href="/" class="btn btn-primary">Go to Homepage</a>
            <a href="/personal-loan" class="btn btn-secondary">Explore Personal Loans</a>
        </div>
    </div>
</body>
</html>
        <?php
        exit;
    }
}

// 5. Direct file exists
if (file_exists($file)) {
    if (is_dir($file)) {
        if (file_exists(rtrim($file, '/') . '/index.html')) {
            $_SERVER['SCRIPT_NAME'] = rtrim($uri, '/') . '/index.html';
            $_SERVER['PHP_SELF'] = rtrim($uri, '/') . '/index.html';
            return false;
        }
        if (file_exists(rtrim($file, '/') . '/index.php')) {
            $_SERVER['SCRIPT_NAME'] = rtrim($uri, '/') . '/index.php';
            $_SERVER['PHP_SELF'] = rtrim($uri, '/') . '/index.php';
            require rtrim($file, '/') . '/index.php';
            return;
        }
    }
    return false;
}

// 6. Extensionless .php file
if (file_exists($file . '.php')) {
    $_SERVER['SCRIPT_NAME'] = $uri . '.php';
    $_SERVER['PHP_SELF'] = $uri . '.php';
    require $file . '.php';
    return;
}

// 7. CRM SPA fallback
if (str_starts_with($uri, '/crm')) {
    if (file_exists(__DIR__ . '/crm/index.html')) {
        header('Content-Type: text/html; charset=utf-8');
        readfile(__DIR__ . '/crm/index.html');
        return;
    }
}

// 8. 404
http_response_code(404);
echo "<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>";
