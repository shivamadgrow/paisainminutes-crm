<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/../../data/integrations.json';
if (!file_exists(dirname($dataFile))) {
    @mkdir(dirname($dataFile), 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input)) {
        file_put_contents($dataFile, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Integrations saved successfully']);
        exit;
    }
}

if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    if (!empty($content)) {
        echo $content;
        exit;
    }
}

echo json_encode([
    'success' => true,
    'integrations' => [
        ['partnerId' => 'rupay91', 'partnerName' => 'Rupay91', 'status' => 'Connected', 'apiEndpoint' => 'https://api.rupay91.com/v2/leads/ingest'],
        ['partnerId' => 'jhatpat', 'partnerName' => 'Jhatpat Loans', 'status' => 'Connected', 'apiEndpoint' => 'https://partners.jhatpatloans.com/api/v1/applications']
    ]
]);
