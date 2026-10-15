<?php
/**
 * Paisa in Minutes - Lending Partner Conversion Postback Receiver & Proxy
 *
 * Receives automated callbacks from affiliate/lending partners (e.g. Rupay91, Borrowera, etc.)
 * when a loan application updates status (e.g. 'approved', 'disbursed', 'rejected', 'contacted').
 *
 * Supported formats:
 *   POST /postback/{partner_slug} (JSON or Form body)
 *   GET  /postback/{partner_slug}?sub_id={lead_id}&status={status}&amount={amount}&secret={secret}
 *   POST /api/public/postback/{partner_slug}
 */

// Set strict API response headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

require_once __DIR__ . '/config/env.php';
$pimNodeApi = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// 1. Resolve Partner Slug from query, URI, or headers
$partnerSlug = '';
if (!empty($_GET['partner'])) {
    $partnerSlug = trim($_GET['partner']);
} elseif (!empty($_GET['slug'])) {
    $partnerSlug = trim($_GET['slug']);
} else {
    $uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (preg_match('#(?:^|/)postback/([a-zA-Z0-9_\-]+)#i', $uriPath, $m)) {
        $partnerSlug = $m[1];
    }
}
$partnerSlug = strtolower(preg_replace('/[^a-zA-Z0-9_\-]/', '', $partnerSlug));

if (empty($partnerSlug)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Missing required partner slug identifier.'
    ]);
    exit;
}

if ($partnerSlug === 'ticket2loan' || strpos($partnerSlug, 'ticket') !== false) {
    http_response_code(410);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Partner Ticket 2 Loan has been permanently deactivated and discontinued.'
    ]);
    exit;
}

// 2. Parse incoming payload (supports JSON body, form data, and query parameters)
$inputJson = [];
$rawInput = file_get_contents('php://input');
if (!empty($rawInput)) {
    $parsed = json_decode($rawInput, true);
    if (is_array($parsed)) {
        $inputJson = $parsed;
    }
}

$subId = trim((string) ($inputJson['sub_id'] ?? $inputJson['lead_id'] ?? $inputJson['leadCode'] ?? $_POST['sub_id'] ?? $_POST['lead_id'] ?? $_GET['sub_id'] ?? $_GET['lead_id'] ?? ''));
$status = trim((string) ($inputJson['status'] ?? $inputJson['lead_status'] ?? $_POST['status'] ?? $_GET['status'] ?? ''));
$amount = $inputJson['amount'] ?? $inputJson['loan_amount'] ?? $_POST['amount'] ?? $_POST['loan_amount'] ?? $_GET['amount'] ?? $_GET['loan_amount'] ?? null;
$secret = trim((string) ($inputJson['secret'] ?? $inputJson['partner_secret'] ?? $_POST['secret'] ?? $_GET['secret'] ?? ''));

// Validate Lead ID / sub_id
$cleanSubId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $subId);
if (empty($cleanSubId)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Missing or invalid sub_id / lead_id parameter.'
    ]);
    exit;
}

// Validate Status
$cleanStatus = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '', $status));
$validStatuses = ['contacted', 'in_progress', 'applied', 'approved', 'disbursed', 'rejected'];
if (empty($cleanStatus) || !in_array($cleanStatus, $validStatuses, true)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Invalid status value. Allowed: ' . implode(', ', $validStatuses)
    ]);
    exit;
}

// Validate Amount (if provided)
$numAmount = null;
if ($amount !== null && $amount !== '') {
    $cleanAmt = filter_var($amount, FILTER_VALIDATE_FLOAT);
    if ($cleanAmt === false || $cleanAmt < 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'success' => false,
            'message' => 'Invalid amount. Amount must be a non-negative number.'
        ]);
        exit;
    }
    $numAmount = $cleanAmt;
}

// Validate Secret Token presence
if (empty($secret)) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'error' => 'Unauthorized: Invalid secret token',
        'message' => 'Unauthorized: Missing or invalid partner secret token.'
    ]);
    exit;
}

// 3. Forward request to Node CRM Backend Postback API
$forwardPayload = [
    'sub_id' => $cleanSubId,
    'lead_id' => $cleanSubId,
    'status' => $cleanStatus,
    'secret' => $secret
];
if ($numAmount !== null) {
    $forwardPayload['amount'] = $numAmount;
}

$targetUrl = $pimNodeApi . '/api/public/postback/' . urlencode($partnerSlug);
if ($method === 'GET') {
    $targetUrl .= '?' . http_build_query($forwardPayload);
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $targetUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'User-Agent: PaisaInMinutes-PostbackProxy/1.0'
    ]
]);

if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($forwardPayload));
}

$backendResponse = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($backendResponse === false || $httpCode === 0) {
    http_response_code(502);
    echo json_encode([
        'status' => 'error',
        'success' => false,
        'message' => 'Failed to reach backend CRM attribution service: ' . ($curlError ?: 'Connection timeout')
    ]);
    exit;
}

// Forward the exact status code and response from the backend
http_response_code($httpCode);
echo $backendResponse;
exit;
