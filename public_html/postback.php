<?php
/**
 * Paisa in Minutes - Partner Postback Conversion Webhook Receiver
 * Endpoint: /postback/{partner_slug}?sub_id={lead_id}&status={status}&amount={amount}&secret={token}
 */

// Set Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
}
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/includes/partner_tracking_service.php';

// 1. Extract Partner Slug
$partnerSlug = isset($_REQUEST['partner_slug']) ? trim($_REQUEST['partner_slug']) : (isset($_REQUEST['partner']) ? trim($_REQUEST['partner']) : '');
if (empty($partnerSlug) && isset($_SERVER['REQUEST_URI'])) {
    $uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#^/postback/([^/?]+)#', $uriPath, $matches)) {
        $partnerSlug = trim($matches[1]);
    }
}

// 2. Extract Query / Body Parameters
$subId = isset($_REQUEST['sub_id']) ? trim($_REQUEST['sub_id']) : (isset($_REQUEST['lead_id']) ? trim($_REQUEST['lead_id']) : '');
$status = isset($_REQUEST['status']) ? trim($_REQUEST['status']) : 'disbursed';
$amount = isset($_REQUEST['amount']) ? floatval($_REQUEST['amount']) : 0;
$secret = isset($_REQUEST['secret']) ? trim($_REQUEST['secret']) : (isset($_REQUEST['token']) ? trim($_REQUEST['token']) : '');

// If JSON body was sent
$rawBody = file_get_contents('php://input');
if (!empty($rawBody)) {
    $bodyData = json_decode($rawBody, true);
    if (is_array($bodyData)) {
        if (empty($subId)) $subId = trim((string)($bodyData['sub_id'] ?? $bodyData['lead_id'] ?? $bodyData['leadId'] ?? ''));
        if (empty($status) || $status === 'disbursed') $status = trim((string)($bodyData['status'] ?? $status));
        if ($amount <= 0 && isset($bodyData['amount'])) $amount = floatval($bodyData['amount']);
        if (empty($secret)) $secret = trim((string)($bodyData['secret'] ?? $bodyData['token'] ?? ''));
        if (empty($partnerSlug) && !empty($bodyData['partner_slug'])) $partnerSlug = trim((string)$bodyData['partner_slug']);
    }
}

if (empty($subId)) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'success' => false,
        'message' => 'Missing required parameter: sub_id (or lead_id)'
    ]);
    exit;
}

if (empty($partnerSlug)) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'success' => false,
        'message' => 'Missing partner slug in route /postback/{partner_slug} or query param'
    ]);
    exit;
}

// 3. Process Postback with validation, timeline logging and store update
$result = processPostback($partnerSlug, $subId, $status, $amount, $secret);

if (!$result['success']) {
    $code = (strpos($result['error'], 'Unauthorized') !== false) ? 401 : 400;
    http_response_code($code);
    echo json_encode([
        'status'  => 'error',
        'success' => false,
        'error'   => $result['error']
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'status'   => 'success',
    'success'  => true,
    'message'  => $result['message'],
    'data'     => [
        'lead_id'  => $result['lead_id'],
        'partner'  => $result['partner'],
        'status'   => $result['status'],
        'amount'   => $result['amount'],
        'event_id' => $result['event_id'],
        'timestamp'=> date('Y-m-d H:i:s')
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
