<?php
// Local development router for PHP built-in server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$decoded_uri = urldecode($uri);
$file = __DIR__ . $decoded_uri;

// 1. Root route
if ($uri === '/' || $uri === '') {
    require __DIR__ . '/index.php';
    return;
}

// 2. Direct file exists
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

// 3. Extensionless .php file
if (file_exists($file . '.php')) {
    $_SERVER['SCRIPT_NAME'] = $uri . '.php';
    $_SERVER['PHP_SELF'] = $uri . '.php';
    require $file . '.php';
    return;
}

// 4. Redirects (mirroring .htaccess)
$redirects = [
    '/about' => '/about-us',
    '/contact' => '/contact-us',
    '/services' => '/personal-loan',
    '/resources' => '/personal-loan-emi-calculator',
    '/careers' => '/about-us',
    '/blog' => '/personal-loan',
];

if (isset($redirects[$uri])) {
    header("Location: " . $redirects[$uri], true, 301);
    exit;
}

// 5. CRM SPA fallback
if (str_starts_with($uri, '/crm')) {
    if (file_exists(__DIR__ . '/crm/index.html')) {
        header('Content-Type: text/html; charset=utf-8');
        readfile(__DIR__ . '/crm/index.html');
        return;
    }
}

// 404
http_response_code(404);
echo "<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>";
