<?php
/**
 * Paisa in Minutes - Partner User Accounts Management API
 * /crm/api/partner-users.php
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

$users = getPartnerUsersList();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $action = $data['action'] ?? 'create';

    // 1. Toggle Active / Disabled
    if ($action === 'toggle_status') {
        $userId = $data['id'] ?? '';
        $newStatus = $data['status'] ?? 'Active';

        $found = false;
        foreach ($users as &$u) {
            if ($u['id'] === $userId) {
                $u['status'] = $newStatus;
                $found = true;
                break;
            }
        }
        unset($u);

        if ($found) {
            savePartnerUsersList($users);
            echo json_encode(['success' => true, 'message' => "User status updated to {$newStatus}", 'users' => $users]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Partner user not found']);
        }
        exit;
    }

    // 2. Create New Partner User Account
    if ($action === 'create') {
        $partnerId = trim((string)($data['partner_id'] ?? ''));
        $username = trim((string)($data['username'] ?? ''));
        $email = trim((string)($data['email'] ?? ''));
        $name = trim((string)($data['name'] ?? ''));
        $password = trim((string)($data['password'] ?? 'Partner@2026'));

        if (empty($partnerId) || empty($username)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Partner and Username are required']);
            exit;
        }

        // Check duplicate username
        foreach ($users as $u) {
            if (strtolower($u['username']) === strtolower($username)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "Username '{$username}' already exists"]);
                exit;
            }
        }

        $partnerInfo = getPartnerBySlugOrId($partnerId);
        $partnerName = $partnerInfo['name'] ?? ucfirst($partnerId);

        $newUser = [
            'id' => 'usr_partner_' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $username)) . '_' . rand(100, 999),
            'partner_id' => $partnerId,
            'partner_name' => $partnerName,
            'name' => $name ?: "{$partnerName} Portal",
            'username' => $username,
            'email' => $email ?: "{$username}@paisainminutes.com",
            'password' => $password,
            'role' => 'Partner',
            'status' => 'Active',
            'created_at' => date('Y-m-d H:i:s')
        ];

        array_unshift($users, $newUser);
        savePartnerUsersList($users);

        echo json_encode(['success' => true, 'message' => 'Partner account created successfully', 'user' => $newUser, 'users' => $users]);
        exit;
    }

    // 3. Delete partner user
    if ($action === 'delete') {
        $userId = $data['id'] ?? '';
        $users = array_values(array_filter($users, fn($u) => $u['id'] !== $userId));
        savePartnerUsersList($users);
        echo json_encode(['success' => true, 'message' => 'Partner user deleted', 'users' => $users]);
        exit;
    }
}

// GET all partner users
echo json_encode(['success' => true, 'users' => $users, 'count' => count($users)]);
exit;
