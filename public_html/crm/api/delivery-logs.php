<?php
/**
 * Paisa in Minutes - Partner API Delivery Logs & Retry API Endpoint
 * /crm/api/delivery-logs.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$webRoot = dirname(dirname(__DIR__));
require_once $webRoot . '/includes/partner_tracking_service.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $action = $data['action'] ?? 'retry';

    if ($action === 'retry') {
        $logId = trim((string)($data['log_id'] ?? ''));
        $leadId = trim((string)($data['lead_id'] ?? ''));
        $partnerId = trim((string)($data['partner_id'] ?? ''));

        // If logId provided, look up log details
        if (!empty($logId)) {
            $logs = getDeliveryLogs(500);
            foreach ($logs as $l) {
                if (($l['id'] ?? '') === $logId) {
                    if (empty($leadId)) $leadId = $l['lead_id'] ?? '';
                    if (empty($partnerId)) $partnerId = $l['partner_id'] ?? '';
                    break;
                }
            }
        }

        if (empty($leadId) || empty($partnerId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing lead_id or partner_id for retry']);
            exit;
        }

        // Find lead data from store
        $leadData = null;
        $stores = [
            $webRoot . '/crm/leads_store.json',
            $webRoot . '/data/leads.json',
            $webRoot . '/admin/leads_store.json'
        ];
        foreach ($stores as $sf) {
            if (file_exists($sf)) {
                $arr = getJsonFileContent($sf, []);
                foreach ($arr as $row) {
                    $rowId = (string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? '');
                    if ($rowId === (string)$leadId) {
                        $leadData = $row;
                        break 2;
                    }
                }
            }
        }

        if (!$leadData) {
            $leadData = [
                'id' => $leadId,
                'lead_id' => $leadId,
                'name' => $data['name'] ?? 'Applicant',
                'phone' => $data['phone'] ?? '',
                'loanAmount' => $data['amount'] ?? 50000,
                'monthlySalary' => $data['salary'] ?? 35000
            ];
        }

        // Re-push lead to partner endpoint
        $pushResult = pushLeadToPartnerApi($leadData, $partnerId, 3);
        echo json_encode([
            'success' => $pushResult['success'],
            'message' => $pushResult['success'] ? 'Lead successfully pushed to partner!' : 'Retry failed. Check response.',
            'result' => $pushResult
        ]);
        exit;
    }

    if ($action === 'push') {
        $lead = $data['lead'] ?? $data;
        $partnerId = $data['partner_id'] ?? '';
        $pushResult = pushLeadToPartnerApi($lead, $partnerId, 3);
        echo json_encode([
            'success' => $pushResult['success'],
            'result' => $pushResult
        ]);
        exit;
    }
}

// GET Delivery Logs
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 150;
$statusFilter = isset($_GET['status']) ? trim($_GET['status']) : null;
$logs = getDeliveryLogs($limit, $statusFilter);

$totalPushed = count($logs);
$deliveredCount = count(array_filter($logs, fn($l) => ($l['status'] ?? '') === 'delivered'));
$failedCount = count(array_filter($logs, fn($l) => ($l['status'] ?? '') === 'failed'));

echo json_encode([
    'success' => true,
    'logs' => $logs,
    'stats' => [
        'total' => $totalPushed,
        'delivered' => $deliveredCount,
        'failed' => $failedCount,
        'success_rate' => $totalPushed > 0 ? round(($deliveredCount / $totalPushed) * 100, 1) : 100
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
