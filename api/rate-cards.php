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

$dataFile = __DIR__ . '/../../data/rate_cards.json';
if (!file_exists(dirname($dataFile))) {
    @mkdir(dirname($dataFile), 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input)) {
        file_put_contents($dataFile, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Rate cards updated successfully']);
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

// Default seed response
echo json_encode([
    'success' => true,
    'rateCards' => [
        ['id' => 'rc-rupay91', 'partnerName' => 'Rupay91', 'model' => 'tiered', 'defaultRate' => '2.8%', 'effectiveFrom' => '2026-04-01'],
        ['id' => 'rc-jhatpat', 'partnerName' => 'Jhatpat Loans', 'model' => 'flat_pct', 'defaultRate' => '2.4%', 'effectiveFrom' => '2026-04-01'],
        ['id' => 'rc-instarupees', 'partnerName' => 'Insta Rupees', 'model' => 'flat_pct', 'defaultRate' => '2.5%', 'effectiveFrom' => '2026-04-01'],
        ['id' => 'rc-udhaarnow', 'partnerName' => 'UdhaarNow', 'model' => 'per_lead', 'defaultRate' => '₹1,500 / lead', 'effectiveFrom' => '2026-04-01']
    ]
]);
