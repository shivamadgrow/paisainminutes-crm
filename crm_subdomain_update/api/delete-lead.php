<?php
/**
 * Paisa in Minutes - Bulletproof Delete Lead API Endpoint
 * Handles Hostinger Subdomain, Main Domain, CSV Logs, JSON Stores & Blacklist Tracking
 */

date_default_timezone_set('Asia/Kolkata');

// Enable Full CORS
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

$isClearAll = !empty($data['clear_all']) || 
              !empty($data['all']) || 
              (!empty($data['ids']) && in_array('*', $data['ids'])) || 
              (!empty($data['action']) && in_array($data['action'], ['reset_all', 'clear_all']));

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

$phoneParam = !empty($data['phone']) ? $data['phone'] : (!empty($data['mobile']) ? $data['mobile'] : '');

if (!$isClearAll && empty($idsToDelete) && empty($phoneParam)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'No Lead ID or Phone provided for deletion',
        'received_payload' => $data
    ]);
    exit;
}

$idsMap = [];
$cleanPhones = [];

if ($phoneParam) {
    $cleanP = preg_replace('/\D/', '', (string)$phoneParam);
    if (strlen($cleanP) >= 6) $cleanPhones[$cleanP] = true;
}

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
                    $modifiedFiles[] = $filePath . " (DELETED MATCHES)";
                }
            }
        }
    } elseif ($isClearAll) {
        $dir = dirname($filePath);
        if (!is_dir($dir)) @mkdir($dir, 0777, true);
        @file_put_contents($filePath, "[]\n");
    }
}

// 2. CSV LOG DELETION
$csvCandidates = array_unique([
    $rootPath . '/leads_log.csv',
    __DIR__ . '/../../leads_log.csv',
    dirname(__DIR__, 2) . '/leads_log.csv',
    __DIR__ . '/../leads_log.csv'
]);

foreach ($csvCandidates as $csv) {
    if (file_exists($csv)) {
        if ($isClearAll) {
            file_put_contents($csv, "lead_id,timestamp,name,email,phone,affiliate_id,source,loan_amount,tenure_months,monthly_income,ip_address,status\n");
            $modifiedFiles[] = $csv . ' (RESET CSV)';
        } else {
            $lines = file($csv);
            if (!empty($lines)) {
                $newLines = [];
                $header = array_shift($lines);
                $newLines[] = $header;
                $csvChanged = false;

                foreach ($lines as $line) {
                    $row = str_getcsv($line);
                    $rowId = strtolower(trim((string)($row[0] ?? '')));
                    $rowPhone = preg_replace('/\D/', '', (string)($row[4] ?? ($row[3] ?? '')));

                    $match = false;
                    if (!empty($idsMap[$rowId])) $match = true;
                    if ($rowPhone && !empty($cleanPhones[$rowPhone])) $match = true;

                    if ($match) {
                        $csvChanged = true;
                    } else {
                        $newLines[] = $line;
                    }
                }

                if ($csvChanged) {
                    file_put_contents($csv, implode('', $newLines));
                    $modifiedFiles[] = $csv . ' (REMOVED CSV ROW)';
                }
            }
        }
    }
}

// 3. PERSIST DELETED IDS TO BLACKLIST FILE (deleted_leads.json)
$deletedStores = array_unique([
    $rootPath . '/crm/deleted_leads.json',
    $rootPath . '/data/deleted_leads.json',
    __DIR__ . '/../../crm/deleted_leads.json',
    __DIR__ . '/../deleted_leads.json',
    __DIR__ . '/deleted_leads.json'
]);

$newDeletedEntries = array_keys($idsMap);
foreach (array_keys($cleanPhones) as $p) {
    $newDeletedEntries[] = $p;
}

foreach ($deletedStores as $df) {
    $dir = dirname($df);
    if (!is_dir($dir)) @mkdir($dir, 0777, true);

    if ($isClearAll) {
        @file_put_contents($df, "[]\n");
    } else {
        $existing = [];
        if (file_exists($df)) {
            $raw = file_get_contents($df);
            $existing = json_decode($raw, true) ?: [];
        }
        $merged = array_unique(array_merge($existing, $newDeletedEntries));
        @file_put_contents($df, json_encode(array_values($merged), JSON_PRETTY_PRINT));
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
