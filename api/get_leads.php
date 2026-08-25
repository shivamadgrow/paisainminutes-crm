<?php
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json');

// Helper to parse loan amount numeric value
function parseLoanAmount($val) {
    if (empty($val) && $val !== 0 && $val !== '0') return 50000;
    if (is_string($val)) {
        $parts = preg_split('/[-–—]|to/i', str_replace(',', '', $val));
        if (count($parts) >= 2) {
            $n1 = floatval(preg_replace('/\D/', '', $parts[0]));
            $n2 = floatval(preg_replace('/\D/', '', $parts[1]));
            if ($n2 > 0) return $n2;
            if ($n1 > 0) return $n1;
        }
    }
    $clean = preg_replace('/[^\d.]/', '', strval($val));
    $num = floatval($clean);
    if ($num <= 0) return 50000;
    if ($num > 500000) {
        $s = strval(floor($num));
        $len = strlen($s);
        for ($i = 3; $i <= 6; $i++) {
            if ($i < $len) {
                $p1 = floatval(substr($s, 0, $i));
                $p2 = floatval(substr($s, $i));
                if ($p1 >= 1000 && $p1 <= 500000 && $p2 >= 1000 && $p2 <= 1000000 && $p2 >= $p1) {
                    return $p2;
                }
            }
        }
        if ($num > 1000000) return 50000;
    }
    return $num;
}

// Helper to parse monthly salary numeric value
function parseSalary($val, $salVal = null, $salRange = '') {
    if (!empty($salVal)) {
        $sv = floatval($salVal);
        if ($sv >= 5000 && $sv <= 500000) return $sv;
    }
    $textToCheck = strval(!empty($salRange) ? $salRange : $val);
    if (preg_match('/[-–—]|to/i', $textToCheck)) {
        $parts = preg_split('/[-–—]|to/i', str_replace(',', '', $textToCheck));
        if (count($parts) >= 2) {
            $n1 = floatval(preg_replace('/\D/', '', $parts[0]));
            $n2 = floatval(preg_replace('/\D/', '', $parts[1]));
            if ($n1 > 0 && $n2 > 0) return round(($n1 + $n2) / 2);
            if ($n1 > 0) return $n1;
        }
    }
    $clean = preg_replace('/[^\d.]/', '', strval($val));
    $num = floatval($clean);
    if ($num <= 0) return 30000;
    if ($num > 500000) {
        $s = strval(floor($num));
        $len = strlen($s);
        if ($len === 10) {
            $p1 = floatval(substr($s, 0, 5));
            $p2 = floatval(substr($s, 5));
            if ($p1 >= 10000 && $p1 <= 300000 && $p2 >= 10000 && $p2 <= 300000) {
                return round(($p1 + $p2) / 2);
            }
        }
        for ($i = 4; $i <= 6; $i++) {
            if ($i < $len) {
                $p1 = floatval(substr($s, 0, $i));
                $p2 = floatval(substr($s, $i));
                if ($p1 >= 10000 && $p1 <= 300000 && $p2 >= 10000 && $p2 <= 300000) {
                    return round(($p1 + $p2) / 2);
                }
            }
        }
        return 35000;
    }
    return $num;
}

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY id DESC");
        $dbLeads = $stmt->fetchAll();
        $leads = [];
        foreach ($dbLeads as $row) {
            $name = $row['name'] ?: 'Applicant';
            $cleanedLoan = parseLoanAmount($row['applied_amount'] ?? 50000);
            $cleanedSalary = parseSalary($row['monthly_salary'] ?? 30000);
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
                'applied' => $cleanedLoan,
                'loanAmount' => $cleanedLoan,
                'salary' => $cleanedSalary,
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
    $rawLeads = json_decode(file_get_contents($jsonFile), true) ?: [];
    foreach ($rawLeads as $l) {
        $loanNum = parseLoanAmount($l['loanAmount'] ?? $l['applied'] ?? 50000);
        $salary = parseSalary($l['salary'] ?? $l['monthlySalary'] ?? 30000, $l['sal_val'] ?? null, $l['salary_range'] ?? '');
        $l['applied'] = $loanNum;
        $l['loanAmount'] = $loanNum;
        $l['salary'] = $salary;
        $l['monthlySalary'] = $salary;
        $leads[] = $l;
    }
}

echo json_encode(['success' => true, 'count' => count($leads), 'leads' => $leads]);
?>
