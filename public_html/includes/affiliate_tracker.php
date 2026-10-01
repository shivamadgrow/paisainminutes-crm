<?php
/**
 * Paisa in Minutes - Campaign, UTM & Affiliate Tracker Helper
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Capture UTM Source from URL parameters: utm_source, source
$utmSource = trim((string)($_GET['utm_source'] ?? $_GET['source'] ?? ''));

// Safety fallback: Check HTTP Referer if WhatsApp link was clicked directly
if (empty($utmSource) && !empty($_SERVER['HTTP_REFERER'])) {
    if (stripos($_SERVER['HTTP_REFERER'], 'whatsapp') !== false) {
        $utmSource = 'Whatsapp-AGM';
    }
}

if (!empty($utmSource)) {
    // Sanitize string (only alphanumeric, dash, underscore, dot)
    $cleanUtm = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $utmSource);
    if (!empty($cleanUtm)) {
        $_SESSION['pim_utm_source'] = $cleanUtm;
        $_SESSION['pim_source'] = $cleanUtm;
        // Save in cookie for 30 days
        setcookie('pim_utm_source', $cleanUtm, time() + (86400 * 30), '/');
        setcookie('pim_source', $cleanUtm, time() + (86400 * 30), '/');
    }
}

// Capture additional UTM parameters if present
foreach (['utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $uParam) {
    if (!empty($_GET[$uParam])) {
        $cleanU = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', trim($_GET[$uParam]));
        $_SESSION['pim_' . $uParam] = $cleanU;
        setcookie('pim_' . $uParam, $cleanU, time() + (86400 * 30), '/');
    }
}

// 2. Capture affiliate code from URL parameters: ref, aff, affiliate
$refParam = '';
if (!empty($_GET['ref'])) {
    $refParam = trim($_GET['ref']);
} elseif (!empty($_GET['aff'])) {
    $refParam = trim($_GET['aff']);
} elseif (!empty($_GET['affiliate'])) {
    $refParam = trim($_GET['affiliate']);
}

if (!empty($refParam)) {
    // Sanitize string (only alphanumeric, dash, underscore)
    $cleanRef = preg_replace('/[^a-zA-Z0-9_\-]/', '', $refParam);
    if (!empty($cleanRef)) {
        $_SESSION['pim_aff_id'] = $cleanRef;
        // Save in cookie for 30 days
        setcookie('pim_aff_id', $cleanRef, time() + (86400 * 30), '/');
    }
}

/**
 * Get current UTM Source for tracking
 * @return string
 */
function getPimUtmSource() {
    if (!empty($_GET['utm_source'])) {
        return preg_replace('/[^a-zA-Z0-9_\-\.]/', '', trim($_GET['utm_source']));
    }
    if (!empty($_SESSION['pim_utm_source'])) {
        return $_SESSION['pim_utm_source'];
    }
    if (!empty($_COOKIE['pim_utm_source'])) {
        return preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $_COOKIE['pim_utm_source']);
    }
    return '';
}

/**
 * Get current Affiliate ID for tracking
 * @return string
 */
function getPimAffiliateId() {
    if (!empty($_SESSION['pim_aff_id'])) {
        return $_SESSION['pim_aff_id'];
    }
    if (!empty($_COOKIE['pim_aff_id'])) {
        return preg_replace('/[^a-zA-Z0-9_\-]/', '', $_COOKIE['pim_aff_id']);
    }
    return 'paisainminutes';
}
