<?php
/**
 * Paisa in Minutes - Delete Lead API Endpoint (Hostinger & Subdomain Safe)
 * Endpoint: /admin/api/delete-lead, /admin/api/delete-lead.php, /api/delete-lead, /crm/api/delete-lead.php
 */

date_default_timezone_set('Asia/Kolkata');

// Enable Full CORS for Subdomains & Cross-Origin Hostinger Environments
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$isClearAll = !empty($data['clear_all']) || !empty($data['all']) || (!empty($data['ids']) && in_array('*', $data['ids'])) || (!empty($data['action']) && $data['action'] === 'reset_all');

$idsToDelete = [];
if (!empty($data['ids']) && is_array($data['ids'])) {
    $idsToDelete = $data['ids'];
} elseif (!empty($data['id'])) {
    $idsToDelete = [$data['id']];
} elseif (!empty($data['leadId'])) {
    $idsToDelete = [$data['leadId']];
} elseif (!empty($data['lead_id'])) {
    $idsToDelete = [$data['lead_id']];
}

if (!$isClearAll && empty($idsToDelete)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'No Lead ID(s) provided for deletion',
        'received_payload' => $data
    ]);
    exit;
}

$idsMap = [];
$cleanPhones = [];
foreach ($idsToDelete as $id) {
    $cleanId = trim(strtolower((string)$id));
    if ($cleanId !== '') {
        $idsMap[$cleanId] = true;
        $digits = preg_replace('/\D/', '', $cleanId);
        if (strlen($digits) >= 6) {
            $cleanPhones[$digits] = true;
        }
    }
}

// Check all possible file paths across Hostinger subdomains and root domain
$rootPath = dirname(__DIR__, 2);
$candidateFiles = array_unique([
    $rootPath . '/data/leads.json',
    $rootPath . '/crm/leads_store.json',
    $rootPath . '/crm/crm_subdomain_update/leads_store.json',
    $rootPath . '/deploy_update/data/leads.json',
    $rootPath . '/deploy_update/crm/leads_store.json',
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../crm/leads_store.json',
    __DIR__ . '/../data/leads.json',
    __DIR__ . '/../leads_store.json',
    __DIR__ . '/leads_store.json'
]);

$deletedCount = 0;
$removedLeads = [];
$scannedFiles = [];
$modifiedFiles = [];

foreach ($candidateFiles as $filePath) {
    $exists = file_exists($filePath);
    $scannedFiles[] = [
        'path'     => $filePath,
        'exists'   => $exists,
        'writable' => $exists ? is_writable($filePath) : false
    ];

    if ($exists) {
        $raw = file_get_contents($filePath);
        $leads = json_decode($raw, true);

        if (is_array($leads)) {
            if ($isClearAll) {
                $deletedCount += count($leads);
                $removedLeads = array_merge($removedLeads, $leads);
                file_put_contents($filePath, "[]\n");
                $modifiedFiles[] = $filePath . ' (CLEARED ALL)';
            } else {
                $filteredLeads = [];
                $fileChanged = false;

                foreach ($leads as $lead) {
                    if (!is_array($lead)) continue;

                    $lId = strtolower(trim((string)($lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? '')));
                    $lPhone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? ''));

                    $match = false;
                    if (!empty($idsMap[$lId])) {
                        $match = true;
                    } elseif ($lPhone && !empty($cleanPhones[$lPhone])) {
                        $match = true;
                    } else {
                        foreach ($cleanPhones as $cp => $val) {
                            if (strlen($cp) >= 6 && (strpos($lPhone, $cp) !== false || strpos($lId, $cp) !== false)) {
                                $match = true;
                                break;
                            }
                        }
                    }

                    if ($match) {
                        $deletedCount++;
                        $removedLeads[] = $lead;
                        $fileChanged = true;
                    } else {
                        $filteredLeads[] = $lead;
                    }
                }

                if ($fileChanged) {
                    file_put_contents($filePath, json_encode(array_values($filteredLeads), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
                    $modifiedFiles[] = $filePath . " (DELETED {$deletedCount} MATCHES)";
                }
            }
        }
    } elseif ($isClearAll) {
        // Ensure data dir exists and write empty json
        $dir = dirname($filePath);
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        @file_put_contents($filePath, "[]\n");
    }
}

// If clear all, also reset CSV log and deleted archive
$csvCandidates = [
    $rootPath . '/leads_log.csv',
    __DIR__ . '/../../leads_log.csv',
    dirname(__DIR__, 2) . '/leads_log.csv'
];

if ($isClearAll) {
    foreach ($csvCandidates as $csv) {
        if (file_exists($csv) || is_dir(dirname($csv))) {
            @file_put_contents($csv, "lead_id,timestamp,name,email,phone,affiliate_id,source,loan_amount,tenure_months,monthly_income,ip_address,status\n");
            $modifiedFiles[] = $csv . ' (RESET HEADER)';
        }
    }

    $deletedStoreCandidates = [
        $rootPath . '/crm/deleted_leads.json',
        __DIR__ . '/../../crm/deleted_leads.json'
    ];
    foreach ($deletedStoreCandidates as $df) {
        if (file_exists($df) || is_dir(dirname($df))) {
            @file_put_contents($df, "[]\n");
            $modifiedFiles[] = $df . ' (RESET)';
        }
    }
}

echo json_encode([
    'success'         => true,
    'message'         => $isClearAll ? "All leads successfully cleared across all storage files" : "Deleted {$deletedCount} lead(s) successfully",
    'is_clear_all'    => $isClearAll,
    'deleted_count'   => $deletedCount,
    'scanned_files'   => $scannedFiles,
    'modified_files'  => $modifiedFiles,
    'timestamp'       => date('Y-m-d H:i:s')
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
