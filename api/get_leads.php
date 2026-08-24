<?php
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json');

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY id DESC");
        $dbLeads = $stmt->fetchAll();
        $leads = [];
        foreach ($dbLeads as $row) {
            $name = $row['name'] ?: 'Applicant';
            $leads[] = [
                'id' => $row['lead_no'] ?: ('PIM-2026-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT)),
                'loanNo' => $row['lead_no'] ?: ('PIM-2026-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT)),
                'name' => $name,
                'initials' => strtoupper(substr($name, 0, 2)),
                'avatarBg' => 'bg-blue-600',
                'mobile' => $row['mobile'],
                'email' => $row['email'] ?: '—',
                'creditManager' => $row['credit_manager'] ?: 'Unassigned',
                'pan' => $row['pan'] ?: '—',
                'cibil' => $row['cibil'] ?? '—',
                'applied' => floatval($row['applied_amount'] ?: 50000),
                'loanAmount' => floatval($row['applied_amount'] ?: 50000),
                'salary' => floatval($row['monthly_salary'] ?: 30000),
                'city' => $row['city'] ?: 'Online',
                'state' => $row['state'] ?: 'India',
                'pincode' => $row['pincode'] ?: '110001',
                'source' => $row['source'] ?: 'Apply Now Website',
                'purpose' => $row['purpose'] ?: 'Personal Loan',
                'status' => $row['status'] ?: 'Fresh',
                'created' => date('d M Y, h:i A', strtotime($row['created_at'] ?? 'now')),
                'date' => date('Y-m-d', strtotime($row['created_at'] ?? 'now'))
            ];
        }
        echo json_encode(['success' => true, 'count' => count($leads), 'leads' => $leads]);
        exit();
    } catch (PDOException $e) {
        // Fallback to JSON file
    }
}

// Fallback JSON persistence
$jsonFile = __DIR__ . '/../leads_store.json';
$leads = [];
if (file_exists($jsonFile)) {
    $leads = json_decode(file_get_contents($jsonFile), true) ?: [];
}

echo json_encode(['success' => true, 'count' => count($leads), 'leads' => $leads]);
?>
