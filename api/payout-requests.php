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

$dataFile = __DIR__ . '/../../data/payout_requests.json';
if (!file_exists(dirname($dataFile))) {
    @mkdir(dirname($dataFile), 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input)) {
        file_put_contents($dataFile, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Payout requests saved successfully']);
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
    'payoutRequests' => [
        ['id' => 'PR-2026-081', 'partnerName' => 'Insta Rupees', 'amount' => 145000, 'requestedDate' => '2026-08-15', 'status' => 'Requested'],
        ['id' => 'PR-2026-079', 'partnerName' => 'LoanWithin', 'amount' => 88500, 'requestedDate' => '2026-08-12', 'status' => 'Acknowledged'],
        ['id' => 'PR-2026-068', 'partnerName' => 'Rupay91', 'amount' => 284000, 'requestedDate' => '2026-08-02', 'status' => 'Paid']
    ]
]);
