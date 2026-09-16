<?php
/**
 * Paisa in Minutes - Outbound Partner Link Click Tracker & UTM Engine
 * Records outbound clicks to clicks_log.csv and data/clicks.json,
 * and seamlessly redirects with complete affiliate tracking & UTM parameters.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/includes/affiliate_tracker.php';
$partners = require __DIR__ . '/config/partners.php';

$partnerSlug = isset($_GET['partner']) ? trim($_GET['partner']) : '';
$leadId = isset($_GET['lead_id']) ? htmlspecialchars(trim($_GET['lead_id'])) : ($_SESSION['pim_lead_id'] ?? 'CRM');
$affId = isset($_GET['ref']) ? htmlspecialchars(trim($_GET['ref'])) : getPimAffiliateId();
$source = isset($_GET['source']) ? trim($_GET['source']) : 'crm';

// 1. Flexible Partner Matching (e.g., "jhatpat loans", "jhatpat-loans", "jhatpatloans" -> "jhatpatloans")
$normalizedSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $partnerSlug));
$matchedSlug = '';

if (!empty($partnerSlug) && isset($partners[$partnerSlug])) {
    $matchedSlug = $partnerSlug;
} elseif (!empty($normalizedSlug)) {
    foreach ($partners as $k => $info) {
        $cleanK = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $k));
        $cleanName = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $info['name'] ?? ''));
        if ($cleanK === $normalizedSlug || $cleanName === $normalizedSlug) {
            $matchedSlug = $k;
            break;
        }
    }
}

// 2. Build Destination URL
$targetUrl = 'https://paisainminutes.com/';
$partnerName = 'Paisa in Minutes';

if (!empty($matchedSlug) && isset($partners[$matchedSlug])) {
    $partnerInfo = $partners[$matchedSlug];
    $partnerName = $partnerInfo['name'];
    
    // Replace standard placeholders
    $targetUrl = str_replace(
        ['{lead_id}', '{aff_id}'],
        [urlencode($leadId), urlencode($affId)],
        $partnerInfo['target_url']
    );
} elseif (!empty($_GET['url'])) {
    $targetUrl = trim($_GET['url']);
    $partnerName = !empty($partnerSlug) ? ucfirst($partnerSlug) : 'Direct Partner';
}

// 3. Inject / Override UTM and Affiliate parameters
$utmKeys = [
    'utm_source'   => !empty($_GET['utm_source']) ? trim($_GET['utm_source']) : $affId,
    'utm_medium'   => !empty($_GET['utm_medium']) ? trim($_GET['utm_medium']) : 'affiliate',
    'utm_campaign' => !empty($_GET['utm_campaign']) ? trim($_GET['utm_campaign']) : 'paisainminutes_crm',
    'utm_term'     => !empty($_GET['utm_term']) ? trim($_GET['utm_term']) : (!empty($matchedSlug) ? $matchedSlug . '_crm' : 'portal_visit'),
    'utm_content'  => !empty($_GET['utm_content']) ? trim($_GET['utm_content']) : 'crm_outbound',
    'ref'          => $affId,
    'source'       => $source,
    'sub_id'       => $leadId
];

foreach ($utmKeys as $key => $val) {
    if (!empty($val)) {
        // If parameter already exists in target URL, replace it
        if (preg_match('/([?&]' . preg_quote($key, '/') . '=)[^&]*/', $targetUrl)) {
            $targetUrl = preg_replace('/([?&]' . preg_quote($key, '/') . '=)[^&]*/', '${1}' . urlencode($val), $targetUrl);
        } else {
            $sep = (strpos($targetUrl, '?') !== false) ? '&' : '?';
            $targetUrl .= $sep . $key . '=' . urlencode($val);
        }
    }
}

// 4. Record Click Event
$clickId = 'CLK-' . rand(100000, 999999);
$timestamp = date('Y-m-d H:i:s');
$userIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$userPhone = isset($_GET['phone']) && !empty($_GET['phone']) ? trim($_GET['phone']) : ($_SESSION['pim_lead_phone'] ?? '');

// Fallback: Lookup phone from leads.json if empty but lead_id is present
if (empty($userPhone) && !empty($leadId) && $leadId !== 'CRM' && $leadId !== 'DIRECT') {
    $jsonLeadsFile = __DIR__ . '/data/leads.json';
    if (file_exists($jsonLeadsFile)) {
        $leadsList = json_decode(file_get_contents($jsonLeadsFile), true) ?: [];
        foreach ($leadsList as $ld) {
            if (isset($ld['lead_id']) && $ld['lead_id'] === $leadId && !empty($ld['phone'])) {
                $userPhone = $ld['phone'];
                break;
            }
        }
    }
}

$clickData = [
    'click_id'     => $clickId,
    'lead_id'      => $leadId,
    'phone'        => $userPhone,
    'affiliate_id' => $affId,
    'source'       => $source,
    'partner_slug' => $matchedSlug ?: $partnerSlug,
    'partner_name' => $partnerName,
    'target_url'   => $targetUrl,
    'timestamp'    => $timestamp,
    'ip_address'   => $userIp,
    'user_agent'   => $userAgent
];

// 5. Save to clicks_log.csv
$csvFile = __DIR__ . '/clicks_log.csv';
$fileExisted = file_exists($csvFile);
$file = @fopen($csvFile, 'a');
if ($file) {
    if (!$fileExisted) {
        fputcsv($file, ['click_id', 'lead_id', 'phone', 'affiliate_id', 'source', 'partner_name', 'partner_url', 'timestamp', 'ip_address', 'user_agent']);
    }
    fputcsv($file, [
        $clickId,
        $leadId,
        $userPhone,
        $affId,
        $source,
        $partnerName,
        $targetUrl,
        $timestamp,
        $userIp,
        $userAgent
    ]);
    @fclose($file);
}

$cleanPhone = preg_replace('/\D/', '', (string)$userPhone);
if (strlen($cleanPhone) > 10) {
    $cleanPhone = substr($cleanPhone, -10);
}

// 6. Save to data/clicks.json and data/phone_clicks.json
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$jsonFile = $dataDir . '/clicks.json';
$clicksList = [];
if (file_exists($jsonFile)) {
    $existing = @file_get_contents($jsonFile);
    $clicksList = json_decode($existing, true) ?: [];
}
$clicksList[] = $clickData;
@file_put_contents($jsonFile, json_encode($clicksList, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Fast Phone-to-Partner Click Map for Real-time CRM Assignment
if (strlen($cleanPhone) === 10 && !empty($partnerName)) {
    $phoneClicksFile = $dataDir . '/phone_clicks.json';
    $phoneClicks = file_exists($phoneClicksFile) ? (json_decode(file_get_contents($phoneClicksFile), true) ?: []) : [];
    $phoneClicks[$cleanPhone] = [
        'partner'    => $partnerName,
        'slug'       => $matchedSlug ?: $partnerSlug,
        'lead_id'    => $leadId,
        'timestamp'  => $timestamp,
        'click_id'   => $clickId,
        'target_url' => $targetUrl
    ];
    @file_put_contents($phoneClicksFile, json_encode($phoneClicks, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// 7. Update assignedCompany across lead stores by Phone or Lead ID
if (!empty($partnerName) && (!empty($cleanPhone) || (!empty($leadId) && $leadId !== 'CRM' && $leadId !== 'DIRECT'))) {
    $leadStoreFiles = [
        $dataDir . '/leads.json',
        __DIR__ . '/crm/leads_store.json',
        __DIR__ . '/admin/leads_store.json',
        __DIR__ . '/deploy_update/data/leads.json'
    ];

    foreach ($leadStoreFiles as $storePath) {
        if (file_exists($storePath)) {
            $leadsData = json_decode(@file_get_contents($storePath), true);
            if (is_array($leadsData)) {
                $leadUpdated = false;
                foreach ($leadsData as &$ld) {
                    $ldPhone = substr(preg_replace('/\D/', '', (string)($ld['phone'] ?? $ld['mobile'] ?? '')), -10);
                    $ldId = (string)($ld['lead_id'] ?? $ld['id'] ?? '');

                    if ((!empty($cleanPhone) && $ldPhone === $cleanPhone) ||
                        (!empty($leadId) && $leadId !== 'CRM' && $leadId !== 'DIRECT' && $ldId === $leadId)) {
                        $ld['assignedCompany'] = $partnerName;
                        $ld['partner_name'] = $partnerName;
                        $leadUpdated = true;
                        break;
                    }
                }
                unset($ld);

                if ($leadUpdated) {
                    @file_put_contents($storePath, json_encode($leadsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                }
            }
        }
    }
}

// 8. Return JSON for Beacon / Async API calls
if ((isset($_GET['format']) && $_GET['format'] === 'json') || (isset($_GET['action']) && $_GET['action'] === 'track')) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success'    => true,
        'click_id'   => $clickId,
        'partner'    => $partnerName,
        'target_url' => $targetUrl,
        'timestamp'  => $timestamp
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// 9. Redirect browser to loan company landing page with UTM tags
header("Location: " . $targetUrl, true, 302);
exit;
