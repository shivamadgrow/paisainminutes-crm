<?php
/**
 * Paisa in Minutes CRM - Outbound Click Tracker API Endpoint
 * Accepts JSON POST or GET requests to record clicks asynchronously
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
if (!empty($rawInput)) {
    $jsonInput = json_decode($rawInput, true);
    if (is_array($jsonInput)) {
        $_GET = array_merge($_GET, $jsonInput);
    }
}

$_GET['format'] = 'json';
$_GET['source'] = $_GET['source'] ?? 'crm_api';

require_once __DIR__ . '/../../redirect.php';
