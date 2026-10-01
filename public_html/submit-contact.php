<?php
/**
 * Contact form endpoint (compatibility forwarder).
 *
 * The contact page now posts directly to the Node server (POST /api/public/contact). This file only remains for
 * old cached pages: it forwards the submission to Node server-side and relays Node's JSON answer. It no longer
 * stores anything itself (no data/contacts.json, no contacts_log.csv).
 */
if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
}
header('Content-Type: application/json');

require_once __DIR__ . '/config/env.php';
$pimNodeApi = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');

// Read input from POST or JSON body
$input = $_POST;
$jsonInput = json_decode(file_get_contents('php://input'), true);
if (is_array($jsonInput)) {
    $input = array_merge($input, $jsonInput);
}

$body = [
    'name' => isset($input['name']) ? trim((string) $input['name']) : '',
    'phone' => isset($input['phone']) ? trim((string) $input['phone']) : '',
    'email' => isset($input['email']) ? trim((string) $input['email']) : '',
    'subject' => isset($input['subject']) ? trim((string) $input['subject']) : '',
    'message' => isset($input['message']) ? trim((string) $input['message']) : '',
    'agree_consent' => isset($input['agree_consent']) ? '1' : '',
    'website' => isset($input['website']) ? (string) $input['website'] : '',
];

if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['status' => 'error', 'message' => 'The message service is temporarily unavailable. Please try again later.']);
    exit;
}

$ch = curl_init($pimNodeApi . '/api/public/contact');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 2,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
    CURLOPT_POSTFIELDS => json_encode($body),
]);
$response = curl_exec($ch);
$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$decoded = ($response === false) ? null : json_decode($response, true);
if (!is_array($decoded)) {
    http_response_code(503);
    echo json_encode(['status' => 'error', 'message' => 'The message service is temporarily unavailable. Please try again later.']);
    exit;
}

if (!isset($decoded['status'])) {
    // Node rate limiter answers {success:false,error:"..."}
    $decoded = ['status' => 'error', 'message' => $decoded['error'] ?? 'Failed to send message. Please try again.'];
}
http_response_code($code >= 100 ? $code : 503);
echo json_encode($decoded);
exit;
