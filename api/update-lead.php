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
$phone = trim((string)($data['phone'] ?? $data['mobile'] ?? ''));
$cleanPhone = preg_replace('/\D/', '', $phone);
if (strlen($cleanPhone) > 10) $cleanPhone = substr($cleanPhone, -10);

$updates = $data['updates'] ?? [];

if (empty($updates) && is_array($data)) {
    $updates = $data;
    unset($updates['id'], $updates['leadId'], $updates['lead_id'], $updates['loanNo'], $updates['phone'], $updates['mobile']);
}

if (empty($targetId) && empty($cleanPhone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Lead ID or Phone is required']);
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

// 1. Save to leads_overrides.json across possible paths
$overrideFiles = array_unique([
    __DIR__ . '/../leads_overrides.json',
    __DIR__ . '/../../data/leads_overrides.json',
    __DIR__ . '/../../crm/leads_overrides.json',
    dirname(__DIR__, 2) . '/data/leads_overrides.json',
    dirname(__DIR__, 2) . '/crm/leads_overrides.json',
    dirname(__DIR__, 3) . '/public_html/data/leads_overrides.json',
    dirname(__DIR__, 3) . '/public_html/crm/leads_overrides.json'
]);

foreach ($overrideFiles as $of) {
    $dir = dirname($of);
    if (!is_dir($dir)) continue;
    $existingOverrides = [];
    if (file_exists($of)) {
        $existingOverrides = json_decode(file_get_contents($of), true) ?: [];
    }
    if ($targetId) {
        $existingOverrides[$targetId] = array_merge($existingOverrides[$targetId] ?? [], $updates);
    }
    if ($cleanPhone) {
        $existingOverrides[$cleanPhone] = array_merge($existingOverrides[$cleanPhone] ?? [], $updates);
    }
    file_put_contents($of, json_encode($existingOverrides, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// 2. Update existing leads in candidate files
$candidateFiles = array_unique([
    __DIR__ . '/../leads_store.json',
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../crm/leads_store.json',
    __DIR__ . '/leads_store.json',
    dirname(__DIR__, 2) . '/data/leads.json',
    dirname(__DIR__, 2) . '/crm/leads_store.json',
    dirname(__DIR__, 3) . '/public_html/data/leads.json',
    dirname(__DIR__, 3) . '/public_html/crm/leads_store.json'
]);

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
                if (strlen($lPhone) > 10) $lPhone = substr($lPhone, -10);
                $targetClean = preg_replace('/\D/', '', $targetId);

                $match = false;
                if ($targetId && strcasecmp($lId, $targetId) === 0) $match = true;
                if (!$match && $cleanPhone && $lPhone === $cleanPhone) $match = true;
                if (!$match && strlen($targetClean) === 10 && $lPhone === $targetClean) $match = true;

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

// 3. If lead was dynamic (from Render) and not yet stored locally, append it to primary files
if ($updatedCount === 0) {
    foreach ($candidateFiles as $filePath) {
        if (file_exists($filePath)) {
            $content = file_get_contents($filePath);
            $leads = json_decode($content, true) ?: [];
            $newRecord = [
                'id'              => $targetId ?: ('PIM-' . rand(100000, 999999)),
                'loanNo'          => $targetId ?: ('PIM-' . rand(100000, 999999)),
                'lead_id'         => $targetId ?: ('PIM-' . rand(100000, 999999)),
                'name'            => 'Applicant',
                'fullName'        => 'Applicant',
                'phone'           => $cleanPhone,
                'mobile'          => $cleanPhone ? ('+91 ' . $cleanPhone) : '',
                'assignedCompany' => $updates['assignedCompany'] ?? 'Rupay91',
                'partner_name'    => $updates['assignedCompany'] ?? 'Rupay91',
                'status'          => $updates['status'] ?? 'Fresh',
                'created_at'      => $now,
                'updated_at'      => $now
            ];
            foreach ($updates as $k => $v) {
                $newRecord[$k] = $v;
            }
            $leads[] = $newRecord;
            file_put_contents($filePath, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
            $updatedCount++;
        }
    }
}

echo json_encode([
    'success'      => true,
    'message'      => "Lead {$targetId} updated successfully",
    'updatedCount' => $updatedCount
]);
