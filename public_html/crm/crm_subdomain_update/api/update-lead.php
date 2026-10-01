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

// Determine web root safely (never escape public_html)
$rootPath = __DIR__;
if (strpos(__DIR__, 'public_html') !== false) {
    $parts = explode('public_html', __DIR__);
    $rootPath = rtrim($parts[0] . 'public_html', '/\\');
} elseif (in_array(basename(__DIR__), ['api', 'crm', 'admin'])) {
    $rootPath = dirname(__DIR__);
}

// 1. Save to leads_overrides.json strictly within public_html
$overrideFiles = array_unique([
    $rootPath . '/data/leads_overrides.json',
    $rootPath . '/crm/leads_overrides.json',
    $rootPath . '/admin/leads_overrides.json',
    $rootPath . '/crm/crm_subdomain_update/leads_overrides.json',
    $rootPath . '/deploy_update/data/leads_overrides.json',
    $rootPath . '/deploy_update/crm/leads_overrides.json',
    $rootPath . '/leads_overrides.json'
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

// 1B. Sync to partner_assignments.json strictly within public_html
if (isset($updates['assignedCompany']) && !empty($updates['assignedCompany'])) {
    $assignedCompanyVal = trim((string)$updates['assignedCompany']);
    $assignmentFiles = array_unique([
        $rootPath . '/data/partner_assignments.json',
        $rootPath . '/crm/partner_assignments.json',
        $rootPath . '/admin/partner_assignments.json',
        $rootPath . '/crm/crm_subdomain_update/partner_assignments.json',
        $rootPath . '/deploy_update/data/partner_assignments.json',
        $rootPath . '/deploy_update/crm/partner_assignments.json',
        $rootPath . '/partner_assignments.json'
    ]);
    $assignEntry = [
        'partner'      => $assignedCompanyVal,
        'partner_slug' => strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $assignedCompanyVal)),
        'timestamp'    => date('Y-m-d H:i:s'),
        'lead_id'      => $targetId,
        'phone'        => $cleanPhone,
        'source'       => 'crm_manual_assign'
    ];
    foreach ($assignmentFiles as $af) {
        $pDir = dirname($af);
        if (!is_dir($pDir)) @mkdir($pDir, 0755, true);
        $existingA = file_exists($af) ? (json_decode(file_get_contents($af), true) ?: []) : [];
        if (!isset($existingA['by_phone'])) $existingA['by_phone'] = [];
        if (!isset($existingA['by_lead'])) $existingA['by_lead'] = [];
        if ($cleanPhone) $existingA['by_phone'][$cleanPhone] = $assignEntry;
        if ($targetId) $existingA['by_lead'][$targetId] = $assignEntry;
        @file_put_contents($af, json_encode($existingA, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }
}

// 2. Update existing leads in candidate files strictly within public_html
$candidateFiles = array_unique([
    $rootPath . '/data/leads.json',
    $rootPath . '/crm/leads_store.json',
    $rootPath . '/admin/leads_store.json',
    $rootPath . '/crm/crm_subdomain_update/leads_store.json',
    $rootPath . '/deploy_update/data/leads.json',
    $rootPath . '/deploy_update/crm/leads_store.json',
    $rootPath . '/leads_store.json'
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
