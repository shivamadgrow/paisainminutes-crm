<?php
/**
 * Paisa in Minutes - Self-Contained Lead Update Endpoint
 * Supports 1-click Partner Re-assign & Status Updates
 */

date_default_timezone_set('Asia/Kolkata');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$targetId = trim((string)($data['id'] ?? $data['leadId'] ?? $data['lead_id'] ?? $data['loanNo'] ?? ''));
$updates = $data['updates'] ?? [];

if (empty($updates) && is_array($data)) {
    $updates = $data;
    unset($updates['id'], $updates['leadId'], $updates['lead_id'], $updates['loanNo']);
}

if (empty($targetId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Lead ID is required']);
    exit;
}

// Clean assigned company if updating
if (isset($updates['assignedCompany'])) {
    $c = trim((string)$updates['assignedCompany']);
    if (preg_match('/^\d+$/', $c)) {
        // Was accidentally a pincode, set to default partner
        $updates['assignedCompany'] = 'Rupay91';
    }
}

// Check all possible file locations
$candidateFiles = [
    __DIR__ . '/../leads_store.json',
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../crm/leads_store.json',
    __DIR__ . '/leads_store.json',
    dirname(__DIR__, 2) . '/data/leads.json',
    dirname(__DIR__, 2) . '/crm/leads_store.json'
];

$updatedCount = 0;
$now = date('Y-m-d H:i:s');

foreach ($candidateFiles as $filePath) {
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        $leads = json_decode($content, true);
        if (is_array($leads)) {
            $fileChanged = false;
            foreach ($leads as &$lead) {
                if (!is_array($lead)) continue;
                $lId = trim((string)($lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? ''));
                $lPhone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? ''));
                $targetClean = preg_replace('/\D/', '', $targetId);

                $match = (strcasecmp($lId, $targetId) === 0);
                if (!$match && strlen($targetClean) === 10 && $lPhone === $targetClean) {
                    $match = true;
                }

                if ($match) {
                    foreach ($updates as $k => $v) {
                        $lead[$k] = $v;
                        if ($k === 'assignedCompany') {
                            $lead['assignedCompany'] = $v;
                            $lead['partner_name'] = $v;
                        }
                    }
                    $lead['updated_at'] = $now;
                    $fileChanged = true;
                    $updatedCount++;
                }
            }
            unset($lead);

            if ($fileChanged) {
                file_put_contents($filePath, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            }
        }
    }
}

echo json_encode([
    'success'      => true,
    'message'      => "Lead {$targetId} updated successfully",
    'updatedCount' => $updatedCount
]);
