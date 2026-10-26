<?php
/**
 * Paisa in Minutes - Centralized Analytics & Tag Management Configuration
 * 
 * Configures Google Tag Manager (GTM) and Google Analytics 4 (GA4) settings
 * across the main website and landing pages.
 * 
 * Container ID: GTM-P8QSMXHR (Central GTM Container)
 */

if (!function_exists('getEnvVal')) {
    require_once __DIR__ . '/env.php';
}

// Configurable GTM Container ID and GA4 Measurement ID
$pim_gtm_container_id = getEnvVal('GTM_CONTAINER_ID', 'GTM-P8QSMXHR');
$pim_ga4_measurement_id = getEnvVal('GA4_MEASUREMENT_ID', '');

/**
 * Renders the official Google Tag Manager head script
 * High in the <head> tag, loading asynchronously without artificial delays.
 */
function render_gtm_head($gtm_id = null) {
    global $pim_gtm_container_id;
    $id = htmlspecialchars($gtm_id ?: $pim_gtm_container_id, ENT_QUOTES, 'UTF-8');
    if (empty($id)) return;
    ?>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','<?php echo $id; ?>');</script>
    <!-- End Google Tag Manager -->
    <?php
}

/**
 * Renders the official Google Tag Manager noscript fallback
 * Immediately following the opening <body> tag.
 */
function render_gtm_body($gtm_id = null) {
    global $pim_gtm_container_id;
    $id = htmlspecialchars($gtm_id ?: $pim_gtm_container_id, ENT_QUOTES, 'UTF-8');
    if (empty($id)) return;
    ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo $id; ?>"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
}
