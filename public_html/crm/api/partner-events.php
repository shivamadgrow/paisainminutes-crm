<?php
/**
 * Paisa in Minutes - Partner Events API Endpoint
 * /crm/api/partner-events.php, /api/partner-events.php
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

$leadId = isset($_GET['lead_id']) ? trim($_GET['lead_id']) : (isset($_POST['lead_id']) ? trim($_POST['lead_id']) : '');
$action = isset($_GET['action']) ? trim($_GET['action']) : (isset($_POST['action']) ? trim($_POST['action']) : 'list');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $leadId = trim((string)($data['lead_id'] ?? $leadId));
    $partnerId = trim((string)($data['partner_id'] ?? ''));
    $partnerName = trim((string)($data['partner_name'] ?? ''));
    $eventType = trim((string)($data['event_type'] ?? 'assigned'));
    $details = $data['details'] ?? [];

    if (empty($leadId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing lead_id']);
        exit;
    }

    $event = logPartnerEvent($leadId, $partnerId, $partnerName, $eventType, $details);
    echo json_encode(['success' => true, 'event' => $event]);
    exit;
}

// GET requests
if (!empty($leadId)) {
    $events = getLeadEvents($leadId);
    echo json_encode(['success' => true, 'events' => $events, 'count' => count($events)]);
    exit;
}

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$eventType = isset($_GET['event_type']) ? trim($_GET['event_type']) : null;
$partnerId = isset($_GET['partner_id']) ? trim($_GET['partner_id']) : null;

$events = getAllEvents($limit, $eventType, $partnerId);
echo json_encode(['success' => true, 'events' => $events, 'count' => count($events)]);
exit;
