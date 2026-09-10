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

$dataFile = __DIR__ . '/../../data/activity_log.json';
if (!file_exists(dirname($dataFile))) {
    @mkdir(dirname($dataFile), 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input)) {
        $existing = [];
        if (file_exists($dataFile)) {
            $existing = json_decode(file_get_contents($dataFile), true) ?: [];
        }
        array_unshift($existing, $input);
        file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Activity logged successfully']);
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
    'logs' => [
        ['id' => 'act-001', 'when' => '10/08/2026 04:12 PM', 'who' => 'Super Admin', 'module' => 'Commissions', 'type' => 'Update', 'activity' => 'Updated Commission Rate Card for Rupay91.']
    ]
]);
