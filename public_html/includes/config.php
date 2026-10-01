<?php
/**
 * Global Configuration for Silver Leaf Disability Services
 */

// Brand details
define('SITE_NAME', 'Silver Leaf Disability Services');
define('COMPANY_NAME', 'Silver Leaf Disability Services Pty Ltd');
define('COMPANY_EMAIL', 'contact@silverleafdisabilityservices.com.au');
define('COMPANY_PHONE', '0415 936 436');
define('COMPANY_ABN', '65 687 147 897');
define('COMPANY_ADDRESS', 'Alice Springs, NT 0870');

// Brand Colors (Extracted from Logo)
$primary_color = "#006DAA";    // Trustworthy Blue
$secondary_color = "#8C9A94";  // Warm Silver-Grey
$bg_color = "#FAF9F6";         // Off-White
$text_color = "#2B2B2B";       // Charcoal
$accent_color = "#C7A76C";     // Soft Gold

/**
 * Get logo path or return false if none exists
 */
function get_logo_path() {
    $paths = [
        'assets/logo.png',
        'logo.png',
        '../logo.png',
        '../assets/logo.png'
    ];
    foreach ($paths as $path) {
        if (file_exists($path)) {
            return $path;
        }
    }
    return false;
}

/**
 * Helper to determine active page state in navbar
 */
function is_active_page($page_name) {
    $current_page = basename($_SERVER['PHP_SELF']);
    return ($current_page === $page_name) ? true : false;
}
?>
