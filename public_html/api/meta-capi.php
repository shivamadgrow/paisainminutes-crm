<?php
/**
 * Paisa in Minutes - Public Meta Conversions API (CAPI) Lead Endpoint
 *
 * Receives confirmed lead events from client-side or server-side workflows
 * and dispatches them to Meta's official Conversions API with the matching
 * event_id for browser Pixel deduplication.
 */

// Set strict API response headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Allow CORS from website origin if requested asynchronously
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!empty($origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed. Only POST is supported.']);
    exit;
}

require_once __DIR__ . '/../includes/meta_capi_service.php';

// Parse incoming request body (supports JSON or Form encoded)
$rawInput = file_get_contents('php://input');
$body = [];
if (!empty($rawInput)) {
    $parsed = json_decode($rawInput, true);
    if (is_array($parsed)) {
        $body = $parsed;
    }
}
if (empty($body) && !empty($_POST)) {
    $body = $_POST;
}

$leadId = trim((string) ($body['event_id'] ?? $body['lead_id'] ?? $body['leadCode'] ?? ''));

// Validate that lead ID is present (never fire CAPI for incomplete or failed submissions)
if (empty($leadId)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Validation error: Missing required lead_id / event_id parameter.'
    ]);
    exit;
}

// Ensure event_source_url is captured accurately
$eventSourceUrl = $body['event_source_url'] ?? $body['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? null);

$payload = [
    'event_id' => $leadId,
    'phone' => $body['phone'] ?? $body['mobile'] ?? null,
    'name' => $body['name'] ?? $body['fullName'] ?? $body['first_name'] ?? null,
    'email' => $body['email'] ?? null,
    'loan_amount' => $body['loan_amount'] ?? $body['amount'] ?? $body['loanAmount'] ?? null,
    'event_source_url' => $eventSourceUrl,
    'fbp' => $body['fbp'] ?? null,
    'fbc' => $body['fbc'] ?? null,
    'fbclid' => $body['fbclid'] ?? null,
    'utm_source' => $body['utm_source'] ?? null,
    'utm_medium' => $body['utm_medium'] ?? null,
    'utm_campaign' => $body['utm_campaign'] ?? null,
    'utm_term' => $body['utm_term'] ?? null,
    'utm_content' => $body['utm_content'] ?? null,
    'test_event_code' => $body['test_event_code'] ?? null
];

try {
    $result = MetaCapiService::sendLeadEvent($payload);
    http_response_code($result['code'] ?? 200);
    echo json_encode($result);
} catch (Throwable $e) {
    // Fail-safe: A tracking failure must NEVER break website flows
    error_log('[Meta CAPI] Unhandled error: ' . $e->getMessage());
    http_response_code(200);
    echo json_encode([
        'success' => false,
        'event_id' => $leadId,
        'warning' => 'CAPI service encountered a temporary error, logged safely.'
    ]);
}
