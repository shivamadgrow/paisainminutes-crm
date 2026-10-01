<?php
/**
 * Paisa in Minutes - Auth Proxy to Backend (http://145.223.23.114:4000)
 * Proxies send-otp and verify-otp seamlessly to bypass browser Mixed Content restrictions.
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
$backendBase = getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech');

$action = $_GET['action'] ?? '';
$targetPath = '';

if ($action === 'send-otp' || strpos($_SERVER['REQUEST_URI'], 'send-otp') !== false) {
    $targetPath = '/api/auth/send-otp';
} elseif ($action === 'verify-otp' || strpos($_SERVER['REQUEST_URI'], 'verify-otp') !== false) {
    $targetPath = '/api/auth/verify-otp';
} elseif ($action === 'refresh' || strpos($_SERVER['REQUEST_URI'], 'refresh') !== false) {
    $targetPath = '/api/auth/refresh';
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action parameter']);
    exit;
}

$rawInput = file_get_contents('php://input');

$ch = curl_init(rtrim($backendBase, '/') . $targetPath);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
curl_setopt($ch, CURLOPT_TIMEOUT, 6);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false || !empty($curlErr)) {
    http_response_code(502);
    echo json_encode([
        'ok'      => false,
        'error'   => 'Backend server unavailable: ' . ($curlErr ?: 'timeout')
    ]);
    exit;
}

http_response_code($httpCode ?: 200);
echo $response;
