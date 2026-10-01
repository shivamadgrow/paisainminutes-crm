<?php
/**
 * Paisa in Minutes - Delete Lead API Endpoint
 * Directly deletes from backend at http://145.223.23.114:4000/api/loan-applications/{id}
 */

error_reporting(0);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/env.php';
$backendBase = getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech');

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$idsToDelete = [];
if (!empty($data['ids']) && is_array($data['ids'])) {
    $idsToDelete = $data['ids'];
} elseif (!empty($data['id'])) {
    $idsToDelete = [$data['id']];
} elseif (!empty($data['leadId'])) {
    $idsToDelete = [$data['leadId']];
} elseif (!empty($data['lead_id'])) {
    $idsToDelete = [$data['lead_id']];
} elseif (!empty($_GET['id'])) {
    $idsToDelete = [$_GET['id']];
}

if (empty($idsToDelete)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'No application ID provided for deletion'
    ]);
    exit;
}

$headers = ['Accept: application/json'];
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

$deletedCount = 0;
$errors = [];

foreach ($idsToDelete as $id) {
    $cleanId = trim((string)$id);
    if (empty($cleanId) || $cleanId === '*') continue;

    $ch = curl_init(rtrim($backendBase, '/') . '/api/loan-applications/' . urlencode($cleanId));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code >= 200 && $code < 300) {
        $deletedCount++;
    } else {
        $errors[] = "Failed to delete ID {$cleanId} (HTTP {$code})";
    }
}

echo json_encode([
    'success' => $deletedCount > 0 || empty($errors),
    'deleted' => $deletedCount,
    'errors'  => $errors
], JSON_UNESCAPED_SLASHES);
