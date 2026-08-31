<?php
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$mobile = trim($data['mobile'] ?? $data['phone'] ?? $data['mobile_number'] ?? $data['phone_number'] ?? $data['contact'] ?? '');

if (empty($mobile)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Mobile number is required']);
    exit();
}

// Format mobile number with +91
$digitsOnly = preg_replace('/\D/', '', $mobile);
$formattedMobile = $mobile;
if (strlen($digitsOnly) === 10) {
    $formattedMobile = '+91 ' . $digitsOnly;
} elseif (strlen($digitsOnly) === 12 && strpos($digitsOnly, '91') === 0) {
    $formattedMobile = '+91 ' . substr($digitsOnly, 2);
}

$rawName = trim($data['name'] ?? $data['fullName'] ?? $data['full_name'] ?? $data['applicant_name'] ?? $data['customer_name'] ?? '');
$name = $rawName ?: ('Applicant (' . substr($digitsOnly, -4) . ')');

$email = trim($data['email'] ?? $data['email_address'] ?? $data['emailAddress'] ?? '');
if (empty($email)) {
    $email = $digitsOnly . '@paisainminutes.com';
}

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

// Helper to determine partner company
function determineCompany($cibilStr, $salaryNum, $amountNum, $explicitCompany) {
    if (!empty($explicitCompany) && $explicitCompany !== '—') {
        $clean = strtolower(trim($explicitCompany));
        if (strpos($clean, 'rupay91') !== false) return 'Rupay91';
        if (strpos($clean, 'adgrow') !== false) return 'Adgrow';
        if (strpos($clean, 'agdm') !== false) return 'AGDM';
        if (strpos($clean, 'rupaysure') !== false) return 'Rupaysure';
        return trim($explicitCompany);
    }

    $cibilNum = 0;
    if (!empty($cibilStr)) {
        preg_match('/\d{3}/', $cibilStr, $matches);
        if (!empty($matches[0])) {
            $cibilNum = intval($matches[0]);
        } elseif (strpos(strtolower($cibilStr), '750') !== false || strpos(strtolower($cibilStr), 'excellent') !== false) {
            $cibilNum = 780;
        } elseif (strpos(strtolower($cibilStr), '700') !== false || strpos(strtolower($cibilStr), 'good') !== false) {
            $cibilNum = 720;
        } elseif (strpos(strtolower($cibilStr), '650') !== false || strpos(strtolower($cibilStr), 'average') !== false) {
            $cibilNum = 660;
        }
    }

    if ($cibilNum >= 720 || $salaryNum >= 40000) return 'Rupay91';
    if ($amountNum >= 150000 || ($salaryNum >= 25000 && $cibilNum >= 650)) return 'Adgrow';
    if ($cibilNum >= 670 || $salaryNum >= 20000) return 'Rupaysure';
    return 'AGDM';
}

$rawLoan = $data['loanAmount'] ?? $data['loan_amount'] ?? $data['amount'] ?? $data['applied'] ?? $data['applied_amount'] ?? $data['loan_range'] ?? $data['required_loan_amount'] ?? 50000;
$applied = parseLoanAmount($rawLoan);

$rawSalary = $data['salary'] ?? $data['monthly_salary'] ?? $data['income'] ?? $data['monthlySalary'] ?? 30000;
$salVal = $data['sal_val'] ?? null;
$salRange = $data['salary_range'] ?? '';
$salary = parseSalary($rawSalary, $salVal, $salRange);
$city = trim($data['city'] ?? 'Online Apply');
$state = trim($data['state'] ?? 'India');
$pincode = trim($data['pincode'] ?? $data['pin_code'] ?? $data['pin'] ?? $data['zipcode'] ?? '110001');
$employmentType = trim($data['employmentType'] ?? $data['employment_type'] ?? $data['occupation'] ?? 'Salaried');
$cibil = trim($data['cibil'] ?? $data['cibil_score'] ?? $data['cibilScore'] ?? $data['estimated_cibil'] ?? $data['cibil_range'] ?? '—');
$defaultSource = ($cibil !== '—') ? 'Check Eligibility Website' : 'Apply Now Website';
$source = trim($data['source'] ?? $data['form_type'] ?? $data['page_source'] ?? $defaultSource);

$explicitCompany = trim($data['assignedCompany'] ?? $data['company'] ?? $data['partner'] ?? $data['assignedPartner'] ?? '');
$assignedCompany = determineCompany($cibil, $salary, $applied, $explicitCompany);
$eligibilityStatus = trim($data['eligibilityStatus'] ?? $data['eligibility_status'] ?? ($cibil !== '—' ? 'Eligible' : 'Fresh Review'));

$purpose = trim($data['purpose'] ?? 'Personal Loan');
$status = 'Fresh';

// Fallback JSON persistence
$jsonFile = __DIR__ . '/../leads_store.json';
$existingLeads = [];
if (file_exists($jsonFile)) {
    $existingLeads = json_decode(file_get_contents($jsonFile), true) ?: [];
}

$leadId = 'PIM-2026-' . str_pad(count($existingLeads) + 1, 4, '0', STR_PAD_LEFT);
$newLead = [
    'id' => $leadId,
    'loanNo' => $leadId,
    'name' => $name,
    'initials' => strtoupper(substr($name, 0, 2)),
    'avatarBg' => 'bg-blue-600',
    'mobile' => $formattedMobile,
    'email' => $email,
    'creditManager' => 'Unassigned',
    'pan' => strtoupper(trim($data['pan'] ?? '—')),
    'cibil' => $cibil,
    'applied' => $applied,
    'loanAmount' => $applied,
    'salary' => $salary,
    'city' => $city,
    'state' => $state,
    'pincode' => $pincode,
    'employmentType' => $employmentType,
    'assignedCompany' => $assignedCompany,
    'eligibilityStatus' => $eligibilityStatus,
    'source' => $source,
    'purpose' => $purpose,
    'status' => 'Fresh',
    'created' => date('d M Y, h:i A'),
    'date' => date('Y-m-d')
];

array_unshift($existingLeads, $newLead);
file_put_contents($jsonFile, json_encode($existingLeads, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => "Lead received and assigned to {$assignedCompany}!",
    'lead' => $newLead
]);
?>
