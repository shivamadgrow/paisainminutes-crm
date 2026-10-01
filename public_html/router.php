<?php
// Localhost development router for PHP built-in web server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $uri;

// 1. Rewrite rule for /go/{partner_slug}
if (preg_match('#^/go/([^/?]+)#', $uri, $matches)) {
    $_GET['partner_slug'] = $matches[1];
    require __DIR__ . '/go.php';
    exit;
}

// 2. Rewrite rule for /postback/{partner_slug}
if (preg_match('#^/postback/([^/?]+)#', $uri, $matches)) {
    $_GET['partner_slug'] = $matches[1];
    require __DIR__ . '/postback.php';
    exit;
}

// 3. Legacy 301 redirects to protect topical authority
$legacy_redirects = [
    '/about' => '/about-us',
    '/contact' => '/contact-us',
    '/services' => '/personal-loan',
    '/resources' => '/personal-loan-emi-calculator',
    '/careers' => '/about-us',
    '/blog' => '/personal-loan'
];
$clean_path = rtrim($uri, '/');
if (isset($legacy_redirects[$clean_path])) {
    header("Location: " . $legacy_redirects[$clean_path], true, 301);
    exit;
}

// 4. Serve SPA entry for /crm or /admin
if ($uri === '/crm') {
    header("Location: /crm/", true, 301);
    exit;
}
if ($uri === '/crm/') {
    require __DIR__ . '/crm/index.html';
    exit;
}

if ($uri === '/admin') {
    header("Location: /admin/", true, 301);
    exit;
}
if ($uri === '/admin/') {
    require __DIR__ . '/admin/index.html';
    exit;
}

// 5. Serve existing physical file (css, js, images, etc.)
if (file_exists($file) && !is_dir($file)) {
    return false; // Let PHP built-in server serve static file
}

// 6. Clean extensionless routing for .php files (e.g. /personal-loan -> personal-loan.php)
if (file_exists($file . '.php')) {
    require $file . '.php';
    exit;
}

if (is_dir($file)) {
    if (file_exists($file . '/index.php')) {
        require $file . '/index.php';
        exit;
    }
    if (file_exists($file . '/index.html')) {
        require $file . '/index.html';
        exit;
    }
}

// Default fallback
if ($uri === '/' || $uri === '') {
    if (file_exists(__DIR__ . '/index.php')) {
        require __DIR__ . '/index.php';
        exit;
    } elseif (file_exists(__DIR__ . '/index.html')) {
        require __DIR__ . '/index.html';
        exit;
    }
}

return false;
