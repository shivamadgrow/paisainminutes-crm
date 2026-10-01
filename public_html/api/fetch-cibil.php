<?php
/**
 * Paisa in Minutes - Bureau CIBIL / Credit Score Fetcher API Proxy
 * Securely communicates with the Backend Credit Bureau Service on 145.223.23.114:4000
 */

error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/env.php';

// Capture inputs from JSON or Form POST/GET
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);
$data = is_array($jsonInput) ? array_merge($_REQUEST, $jsonInput) : $_REQUEST;

$phone = preg_replace('/[^0-9]/', '', (string)($data['phone'] ?? $data['mobile'] ?? $data['phoneNumber'] ?? ''));
if (strlen($phone) > 10) {
    $phone = substr($phone, -10);
}

if (strlen($phone) !== 10 || !in_array($phone[0], ['6', '7', '8', '9'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'status'  => 'error',
        'error'   => 'A valid 10-digit Indian mobile number is required.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$name = trim((string)($data['name'] ?? $data['fullName'] ?? 'Valued Customer'));
if (empty($name) || $name === 'Applicant') {
    $name = 'Valued Customer';
}

$pan = strtoupper(trim((string)($data['pan'] ?? $data['panNumber'] ?? '')));
$email = trim((string)($data['email'] ?? ''));

// API Configuration
$apiUrl = getEnvVal('CREDIT_SCORE_API_URL', 'https://api.paisainminutes.tech/api/credit-score/check');

$payload = [
    'mobile'  => $phone,
    'phone'   => $phone,
    'name'    => $name,
    'consent' => true
];

if (!empty($pan) && preg_match('/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i', $pan)) {
    $payload['pan'] = $pan;
}
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $payload['email'] = $email;
}

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
curl_setopt($ch, CURLOPT_TIMEOUT, 6);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false || !empty($curlErr)) {
    echo json_encode([
        'success'        => false,
        'phone'          => $phone,
        'status'         => 'network_error',
        'error'          => 'Credit Bureau server unreachable: ' . ($curlErr ?: 'timeout'),
        'fallback_score' => 750
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$resData = json_decode($response, true);

// Extract score from potential response structures
$foundScore = null;
if (isset($resData['score']) && is_numeric($resData['score'])) {
    $foundScore = (int)$resData['score'];
} elseif (isset($resData['creditScore']) && is_numeric($resData['creditScore'])) {
    $foundScore = (int)$resData['creditScore'];
} elseif (isset($resData['cibilScore']) && is_numeric($resData['cibilScore'])) {
    $foundScore = (int)$resData['cibilScore'];
} elseif (isset($resData['data']['score']) && is_numeric($resData['data']['score'])) {
    $foundScore = (int)$resData['data']['score'];
} elseif (isset($resData['report']['score']) && is_numeric($resData['report']['score'])) {
    $foundScore = (int)$resData['report']['score'];
}

function getScoreBand($score) {
    if ($score >= 750) return ['band' => 'Excellent', 'color' => '#10B981'];
    if ($score >= 700) return ['band' => 'Good', 'color' => '#3B82F6'];
    if ($score >= 650) return ['band' => 'Fair', 'color' => '#F59E0B'];
    if ($score >= 600) return ['band' => 'Average', 'color' => '#FB923C'];
    return ['band' => 'Low CIBIL', 'color' => '#EF4444'];
}

if ($foundScore !== null && $foundScore >= 300 && $foundScore <= 900) {
    $bandInfo = getScoreBand($foundScore);
    echo json_encode([
        'success'      => true,
        'phone'        => $phone,
        'score'        => $foundScore,
        'cibilScore'   => $foundScore,
        'cibil'        => (string)$foundScore,
        'band'         => $bandInfo['band'],
        'color'        => $bandInfo['color'],
        'bureau'       => $resData['bureau'] ?? 'CIBIL',
        'fetched_at'   => date('Y-m-d H:i:s'),
        'report'       => $resData
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// Return detailed response if Bureau returned error (such as IP not whitelisted)
http_response_code(200);
echo json_encode([
    'success'        => false,
    'phone'          => $phone,
    'status'         => 'bureau_error',
    'http_code'      => $httpCode,
    'error'          => $resData['error'] ?? 'Unable to fetch credit score from bureau.',
    'providerStatus' => $resData['providerStatus'] ?? null,
    'fallback_score' => 750,
    'details'        => $resData
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

