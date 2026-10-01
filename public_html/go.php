<?php
/**
 * Paisa in Minutes - Internal Partner Redirection & Click Tracking Route
 * Route: /go/{partner_slug}?lead_id={id} (Rewrite: go.php?partner_slug=...)
 */

// Set Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/includes/partner_tracking_service.php';
$partnersList = require __DIR__ . '/config/partners.php';

// 1. Extract Partner Slug & Lead ID
$partnerSlug = isset($_GET['partner_slug']) ? trim($_GET['partner_slug']) : (isset($_GET['partner']) ? trim($_GET['partner']) : '');
if (empty($partnerSlug) && isset($_SERVER['REQUEST_URI'])) {
    $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#^/go/([^/?]+)#', $uriPath, $matches)) {
        $partnerSlug = trim($matches[1]);
    }
}

$leadId = isset($_GET['lead_id']) ? htmlspecialchars(trim($_GET['lead_id'])) : (isset($_GET['sub_id']) ? htmlspecialchars(trim($_GET['sub_id'])) : ($_SESSION['pim_lead_id'] ?? 'CRM'));
$userPhone = isset($_GET['phone']) ? trim($_GET['phone']) : ($_SESSION['pim_lead_phone'] ?? '');
$affId = isset($_GET['ref']) ? htmlspecialchars(trim($_GET['ref'])) : 'paisainminutes';
$source = isset($_GET['source']) ? trim($_GET['source']) : 'crm';

// 2. Resolve Partner
$partnerInfo = null;
$matchedSlug = '';
$partnerName = 'Direct Partner';

// Match against config/partners.php
$cleanSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$partnerSlug));
foreach ($partnersList as $k => $info) {
    $ck = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$k));
    $cn = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)($info['name'] ?? '')));
    if ($ck === $cleanSlug || $cn === $cleanSlug) {
        $partnerInfo = $info;
        $matchedSlug = $k;
        $partnerName = $info['name'];
        break;
    }
}

// Fallback to partner config from tracking service
if (!$partnerInfo) {
    $cfgPartner = getPartnerBySlugOrId($partnerSlug);
    if ($cfgPartner) {
        $matchedSlug = $cfgPartner['slug'] ?: $cfgPartner['id'];
        $partnerName = $cfgPartner['name'];
    } else {
        $matchedSlug = !empty($partnerSlug) ? $partnerSlug : 'partner';
        $partnerName = ucfirst($matchedSlug);
    }
}

// 3. Resolve Lead Details from JSON store if phone is missing
$leadData = null;
$cleanPhone = preg_replace('/\D/', '', (string)$userPhone);
if (strlen($cleanPhone) > 10) $cleanPhone = substr($cleanPhone, -10);

$webRoot = __DIR__;
$leadsCandidates = [
    $webRoot . '/crm/leads_store.json',
    $webRoot . '/data/leads.json',
    $webRoot . '/admin/leads_store.json'
];

foreach ($leadsCandidates as $lf) {
    if (file_exists($lf)) {
        $leadsArr = getJsonFileContent($lf, []);
        foreach ($leadsArr as $row) {
            $rowId = (string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? '');
            $rowPhone = preg_replace('/\D/', '', (string)($row['phone'] ?? $row['mobile'] ?? ''));
            if (strlen($rowPhone) > 10) $rowPhone = substr($rowPhone, -10);

            if ((!empty($leadId) && $leadId !== 'CRM' && $rowId === (string)$leadId) ||
                (!empty($cleanPhone) && $rowPhone === $cleanPhone)) {
                $leadData = $row;
                if (empty($cleanPhone) && !empty($rowPhone)) $cleanPhone = $rowPhone;
                if ((empty($leadId) || $leadId === 'CRM') && !empty($rowId)) $leadId = $rowId;
                break 2;
            }
        }
    }
}

// 4. Construct Target Destination URL with sub_id and UTMs
$targetUrl = 'https://paisainminutes.com/';
if ($partnerInfo && !empty($partnerInfo['target_url'])) {
    $targetUrl = str_replace(
        ['{lead_id}', '{aff_id}'],
        [urlencode($leadId), urlencode($affId)],
        $partnerInfo['target_url']
    );
} elseif (!empty($_GET['url'])) {
    $targetUrl = trim($_GET['url']);
}

// Always ensure sub_id={leadId} is present in target URL
$utmParams = [
    'sub_id'       => $leadId,
    'utm_source'   => !empty($_GET['utm_source']) ? trim($_GET['utm_source']) : 'paisainminutes',
    'utm_medium'   => !empty($_GET['utm_medium']) ? trim($_GET['utm_medium']) : 'affiliate',
    'utm_campaign' => !empty($_GET['utm_campaign']) ? trim($_GET['utm_campaign']) : 'paisainminutes_crm',
    'utm_term'     => !empty($_GET['utm_term']) ? trim($_GET['utm_term']) : ($matchedSlug . '_crm'),
    'ref'          => $affId,
    'source'       => $source
];

foreach ($utmParams as $k => $val) {
    if (!empty($val)) {
        if (preg_match('/([?&]' . preg_quote($k, '/') . '=)[^&]*/', $targetUrl)) {
            $targetUrl = preg_replace('/([?&]' . preg_quote($k, '/') . '=)[^&]*/', '${1}' . urlencode($val), $targetUrl);
        } else {
            $sep = (strpos($targetUrl, '?') !== false) ? '&' : '?';
            $targetUrl .= $sep . $k . '=' . urlencode($val);
        }
    }
}

// 5. Save Click Event in lead_partner_events
$userIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$timestamp = date('Y-m-d H:i:s');

$clickEvent = logPartnerEvent(
    $leadId,
    $matchedSlug,
    $partnerName,
    'clicked',
    [
        'phone' => $cleanPhone,
        'partner_slug' => $matchedSlug,
        'target_url' => $targetUrl,
        'source' => $source,
        'status' => 'Redirected to ' . $partnerName
    ],
    $userIp,
    $userAgent
);

// Also log to legacy clicks_log.csv & clicks.json for backwards compatibility
$csvFile = $webRoot . '/clicks_log.csv';
$fp = @fopen($csvFile, 'a');
if ($fp) {
    fputcsv($fp, [
        'CLK-' . rand(100000, 999999),
        $leadId,
        $cleanPhone,
        $affId,
        $source,
        $partnerName,
        $targetUrl,
        $timestamp,
        $userIp,
        $userAgent
    ]);
    @fclose($fp);
}

// 6. Update Lead Record:
// Fresh → "Redirected to {Partner}" on click
// Set "Applied To" = $partnerName
$redirectStatus = 'Redirected to ' . $partnerName;

$leadPatch = [
    'appliedTo'        => $partnerName,
    'applied_to'       => $partnerName,
    'appliedCompany'   => $partnerName,
    'clickedPartner'   => $matchedSlug,
    'clicked_partner'  => $matchedSlug,
    'applied_at'       => $timestamp,
    'status'           => $redirectStatus,
    'updated_at'       => $timestamp
];

// Save to leads_overrides.json across public_html directories
$overrideFiles = [
    $webRoot . '/data/leads_overrides.json',
    $webRoot . '/crm/leads_overrides.json',
    $webRoot . '/admin/leads_overrides.json',
    $webRoot . '/crm/crm_subdomain_update/leads_overrides.json',
    $webRoot . '/deploy_update/data/leads_overrides.json'
];

foreach ($overrideFiles as $of) {
    $overrides = getJsonFileContent($of, []);
    if (!empty($cleanPhone)) {
        $overrides[$cleanPhone] = array_merge($overrides[$cleanPhone] ?? [], $leadPatch);
    }
    if (!empty($leadId) && $leadId !== 'CRM' && $leadId !== 'DIRECT') {
        $overrides[$leadId] = array_merge($overrides[$leadId] ?? [], $leadPatch);
    }
    saveJsonFileContent($of, $overrides);
}

// Save to partner_assignments.json
$assignmentFiles = [
    $webRoot . '/data/partner_assignments.json',
    $webRoot . '/crm/partner_assignments.json',
    $webRoot . '/admin/partner_assignments.json'
];

$assignEntry = [
    'partner'      => $partnerName,
    'partner_slug' => $matchedSlug,
    'applied_to'   => $partnerName,
    'status'       => $redirectStatus,
    'timestamp'    => $timestamp,
    'lead_id'      => $leadId,
    'phone'        => $cleanPhone,
    'source'       => $source
];

foreach ($assignmentFiles as $af) {
    $assignments = getJsonFileContent($af, ['by_phone' => [], 'by_lead' => []]);
    if (!empty($cleanPhone)) $assignments['by_phone'][$cleanPhone] = $assignEntry;
    if (!empty($leadId) && $leadId !== 'CRM' && $leadId !== 'DIRECT') $assignments['by_lead'][$leadId] = $assignEntry;
    saveJsonFileContent($af, $assignments);
}

// Update lead records in leads.json / leads_store.json
foreach ($leadsCandidates as $sf) {
    if (file_exists($sf)) {
        $leadsArr = getJsonFileContent($sf, []);
        if (is_array($leadsArr)) {
            $changed = false;
            foreach ($leadsArr as &$l) {
                $rowId = (string)($l['id'] ?? $l['lead_id'] ?? $l['loanNo'] ?? '');
                $rowPhone = preg_replace('/\D/', '', (string)($l['phone'] ?? $l['mobile'] ?? ''));
                if (strlen($rowPhone) > 10) $rowPhone = substr($rowPhone, -10);

                $match = (!empty($cleanPhone) && $rowPhone === $cleanPhone) ||
                         (!empty($leadId) && $leadId !== 'CRM' && $rowId === (string)$leadId);

                if ($match) {
                    $l['appliedTo'] = $partnerName;
                    $l['applied_to'] = $partnerName;
                    $l['clicked_partner'] = $matchedSlug;
                    $l['applied_at'] = $timestamp;
                    $l['status'] = $redirectStatus;
                    $l['updated_at'] = $timestamp;
                    $changed = true;
                }
            }
            unset($l);
            if ($changed) saveJsonFileContent($sf, $leadsArr);
        }
    }
}

// 7. API / Webhook Push (if partner has is_api_enabled)
if ($leadData) {
    $leadDataForPush = array_merge($leadData, [
        'id' => $leadId,
        'lead_id' => $leadId,
        'phone' => $cleanPhone ?: ($leadData['phone'] ?? ''),
        'status' => $redirectStatus
    ]);
    // Push in background or inline
    pushLeadToPartnerApi($leadDataForPush, $matchedSlug);
}

// 8. Return JSON if format=json / AJAX beacon
if ((isset($_GET['format']) && $_GET['format'] === 'json') || (isset($_GET['action']) && $_GET['action'] === 'track')) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success'      => true,
        'event_id'     => $clickEvent['id'],
        'partner'      => $partnerName,
        'partner_slug' => $matchedSlug,
        'status'       => $redirectStatus,
        'target_url'   => $targetUrl,
        'sub_id'       => $leadId,
        'timestamp'    => $timestamp
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// 9. 302 Redirect to partner's landing page
header("Location: " . $targetUrl, true, 302);
exit;
