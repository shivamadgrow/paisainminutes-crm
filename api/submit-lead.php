<?php
/**
 * Paisa in Minutes - Unified Lead Submission Handler for CRM Subdomain (Self-Contained)
 * Endpoint: https://crm.paisainminutes.com/api/submit-lead.php
 */

ignore_user_abort(true);
error_reporting(0);
ini_set('display_errors', '0');

date_default_timezone_set('Asia/Kolkata');

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Parse Input
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);
$data = is_array($jsonInput) ? array_merge($_POST, $jsonInput) : $_POST;

$phone = preg_replace('/[^0-9]/', '', (string)($data['phone'] ?? $data['mobile'] ?? $data['phoneNumber'] ?? $data['mobile_number'] ?? ''));
if (strlen($phone) > 10) {
    $phone = substr($phone, -10);
}

if (strlen($phone) !== 10 || !in_array($phone[0], ['6', '7', '8', '9'])) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'success' => false,
        'error'   => 'Mobile number is required and must be a valid 10-digit Indian number starting with 6-9.',
        'message' => 'Please enter a valid 10-digit mobile number.'
    ]);
    exit;
}

$name = trim((string)($data['name'] ?? $data['fullName'] ?? $data['full_name'] ?? 'Applicant'));
if ($name === '') $name = 'Applicant';
$email = trim((string)($data['email'] ?? $data['emailAddress'] ?? $data['email_address'] ?? '—'));
if (strpos($email, '@paisainminutes.com') !== false || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '—';
}

$loanAmt = $data['loan_amount'] ?? $data['loanAmount'] ?? $data['amount'] ?? $data['applied'] ?? 0;
$cleanLoan = (int)preg_replace('/\D/', '', (string)$loanAmt);
if ($cleanLoan > 500000) {
    $s = (string)$cleanLoan;
    $len = strlen($s);
    for ($i = 3; $i <= 6; $i++) {
        if ($i < $len) {
            $p1 = (int)substr($s, 0, $i);
            $p2 = (int)substr($s, $i);
            if ($p1 >= 1000 && $p1 <= 500000 && $p2 >= 1000 && $p2 <= 1000000 && $p2 >= $p1) {
                $cleanLoan = $p2;
                break;
            }
        }
    }
    if ($cleanLoan > 1000000) $cleanLoan = 50000;
}

$monthlySalary = $data['monthly_salary'] ?? $data['monthlySalary'] ?? $data['salary'] ?? 0;
$cibil = trim((string)($data['cibil'] ?? $data['cibilScore'] ?? $data['cibil_score'] ?? '—'));
$explicitCompany = trim((string)($data['assignedCompany'] ?? $data['company'] ?? $data['partner_name'] ?? ''));
$pageSource = trim((string)($data['source'] ?? $data['page_source'] ?? 'Website Application'));
$pincode = trim((string)($data['pincode'] ?? '—'));
if ($pincode === '110001' || empty($pincode)) $pincode = '—';

$isPhoneOnly = ($name === 'Applicant' || empty($name)) && ($cleanLoan === 0) && ($monthlySalary === 0 || $monthlySalary === '—') && ($cibil === '—');

function getSlabInfo($salary, $cibilStr) {
    $salVal = 0;
    if (is_numeric($salary)) {
        $salVal = (int)$salary;
    } else {
        $clean = preg_replace('/\D/', '', (string)$salary);
        $salVal = (int)$clean;
    }

    $cibilVal = 0;
    if (!empty($cibilStr) && $cibilStr !== '—') {
        if (preg_match('/\b(850|8[5-9]\d|900)\b/', $cibilStr)) $cibilVal = 875;
        elseif (preg_match('/\b(800|8[0-4]\d)\b/', $cibilStr)) $cibilVal = 825;
        elseif (preg_match('/\b(750|7[5-9]\d)\b/', $cibilStr)) $cibilVal = 775;
        elseif (preg_match('/\b(700|7[0-4]\d)\b/', $cibilStr)) $cibilVal = 725;
        elseif (preg_match('/\b(650|6[5-9]\d)\b/', $cibilStr)) $cibilVal = 675;
        elseif (preg_match('/\b(600|6[0-4]\d)\b/', $cibilStr)) $cibilVal = 625;
        elseif (preg_match('/\b(550|5[5-9]\d)\b/', $cibilStr)) $cibilVal = 575;
        elseif (preg_match('/\b(500|5[0-4]\d)\b/', $cibilStr)) $cibilVal = 525;
        else {
            preg_match('/\d{3}/', $cibilStr, $m);
            if (!empty($m[0])) $cibilVal = (int)$m[0];
        }
    }

    if ($cibilVal >= 850 || ($cibilVal === 0 && $salVal >= 90000)) {
        return ['slab' => 8, 'cibil_range' => '850–900', 'salary_range' => '₹90,000+', 'eligibility' => 'Eligible – Premium', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 800 || ($cibilVal === 0 && $salVal >= 80000)) {
        return ['slab' => 7, 'cibil_range' => '800–849', 'salary_range' => '₹80,000–₹89,999', 'eligibility' => 'Eligible – Premium', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 750 || ($cibilVal === 0 && $salVal >= 70000)) {
        return ['slab' => 6, 'cibil_range' => '750–799', 'salary_range' => '₹70,000–₹79,999', 'eligibility' => 'Eligible – Preferred', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 700 || ($cibilVal === 0 && $salVal >= 60000)) {
        return ['slab' => 5, 'cibil_range' => '700–749', 'salary_range' => '₹60,000–₹69,999', 'eligibility' => 'Eligible – Good', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 650 || ($cibilVal === 0 && $salVal >= 50000)) {
        return ['slab' => 4, 'cibil_range' => '650–699', 'salary_range' => '₹50,000–₹59,999', 'eligibility' => 'Eligible', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 600 || ($cibilVal === 0 && $salVal >= 40000)) {
        return ['slab' => 3, 'cibil_range' => '600–649', 'salary_range' => '₹40,000–₹49,999', 'eligibility' => 'Eligible', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 550 || ($cibilVal === 0 && $salVal >= 30000)) {
        return ['slab' => 2, 'cibil_range' => '550–599', 'salary_range' => '₹30,000–₹39,999', 'eligibility' => 'Eligible', 'sal_val' => $salVal];
    } elseif ($cibilVal >= 500 || ($cibilVal === 0 && $salVal >= 20000)) {
        return ['slab' => 1, 'cibil_range' => '500–549', 'salary_range' => '₹20,000–₹29,999', 'eligibility' => 'Eligible – Base', 'sal_val' => $salVal];
    } else {
        return ['slab' => 0, 'cibil_range' => 'Below 500', 'salary_range' => 'Under ₹20,000', 'eligibility' => 'Below Minimum Threshold', 'sal_val' => $salVal];
    }
}

if ($isPhoneOnly) {
    $cleanLoan = 0;
    $slabData = ['slab' => 0, 'cibil_range' => '—', 'salary_range' => '—', 'eligibility' => 'Incomplete / Phone Only', 'sal_val' => 0];
    $assignedCompany = !empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'Pending Details' ? $explicitCompany : 'Pending Details';
    $cibil = '—';
    $salNumber = 0;
} else {
    $slabData = getSlabInfo($monthlySalary, $cibil);
    $salNumber = $slabData['sal_val'];
    $assignedCompany = (!empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'AUTO') ? $explicitCompany : ($salNumber >= 30000 ? 'Rupay91' : 'Rupaysure');
}

$initials = 'AP';
$nameParts = preg_split('/\s+/', $name);
if (count($nameParts) >= 2 && !empty($nameParts[0]) && !empty($nameParts[1])) {
    $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
} elseif (!empty($name)) {
    $initials = strtoupper(substr($name, 0, min(2, strlen($name))));
}

$existingLeadId = $data['lead_id'] ?? $data['leadId'] ?? $data['id'] ?? ($_SESSION['pim_lead_id'] ?? null);
if (!empty($existingLeadId) && $existingLeadId !== 'null' && $existingLeadId !== 'undefined') {
    $leadId = (string)$existingLeadId;
} else {
    $leadId = 'PIM-' . date('Ymd') . '-' . rand(1000, 9999);
}

$nowTime = time();
$formattedDate = date('d M Y, h:i A', $nowTime);
$timestamp = date('Y-m-d H:i:s', $nowTime);
$isoDate = date('Y-m-d', $nowTime);

$leadRecord = [
    'id'                => $leadId,
    'loanNo'            => $leadId,
    'lead_id'           => $leadId,
    'name'              => $name,
    'fullName'          => $name,
    'initials'          => $initials,
    'avatarBg'          => 'bg-blue-600',
    'phone'             => $phone,
    'phoneNumber'       => $phone,
    'mobile'            => '+91 ' . $phone,
    'email'             => $email,
    'emailAddress'      => $email,
    'creditManager'     => 'Unassigned',
    'pan'               => '—',
    'cibil'             => $cibil,
    'cibilScore'        => $cibil,
    'applied'           => $cleanLoan,
    'loanAmount'        => $cleanLoan,
    'salary'            => $salNumber,
    'monthlySalary'     => $salNumber,
    'sal_val'           => $salNumber,
    'salary_range'      => $slabData['salary_range'],
    'city'              => '—',
    'state'             => '—',
    'pincode'           => $pincode,
    'employmentType'    => 'Salaried',
    'assignedCompany'   => $assignedCompany,
    'partner_name'      => $assignedCompany,
    'eligibilityStatus' => $slabData['eligibility'],
    'source'            => $pageSource,
    'purpose'           => 'Personal Loan',
    'status'            => 'Fresh',
    'created'           => $formattedDate,
    'created_at'        => $timestamp,
    'date'              => $isoDate
];

function upsertLead(&$list, $newLead, $phone) {
    $cleanPhone = preg_replace('/\D/', '', (string)$phone);
    $foundIndex = -1;
    foreach ($list as $idx => $item) {
        $itemPhone = preg_replace('/\D/', '', (string)($item['phone'] ?? $item['mobile'] ?? ''));
        if (!empty($itemPhone) && !empty($cleanPhone) && substr($itemPhone, -10) === substr($cleanPhone, -10)) {
            $foundIndex = $idx;
            break;
        }
    }

    if ($foundIndex >= 0) {
        $existing = $list[$foundIndex];
        $newLead['id'] = (!empty($existing['id']) && $existing['id'] !== 'null') ? $existing['id'] : $newLead['id'];
        $newLead['loanNo'] = (!empty($existing['loanNo']) && $existing['loanNo'] !== 'null') ? $existing['loanNo'] : $newLead['loanNo'];
        $newLead['lead_id'] = (!empty($existing['lead_id']) && $existing['lead_id'] !== 'null') ? $existing['lead_id'] : $newLead['lead_id'];
        if (($newLead['name'] === 'Applicant' || empty($newLead['name'])) && !empty($existing['name']) && $existing['name'] !== 'Applicant') {
            $newLead['name'] = $existing['name'];
            $newLead['fullName'] = $existing['fullName'] ?? $existing['name'];
            $newLead['initials'] = $existing['initials'] ?? 'AP';
        }
        if (!empty($existing['status']) && $existing['status'] !== 'Fresh' && $newLead['status'] === 'Fresh') {
            $newLead['status'] = $existing['status'];
        }
        array_splice($list, $foundIndex, 1);
        array_unshift($list, $newLead);
    } else {
        array_unshift($list, $newLead);
    }
}

// 2. Write to stores safely
$storeLocations = [
    dirname(__DIR__, 1) . '/leads_store.json',
    __DIR__ . '/leads_store.json',
    dirname(__DIR__, 2) . '/crm/leads_store.json',
    dirname(__DIR__, 2) . '/data/leads.json',
    dirname(__DIR__, 2) . '/admin/leads_store.json'
];

foreach ($storeLocations as $storeFile) {
    try {
        if (@file_exists($storeFile) || @is_dir(dirname($storeFile))) {
            $content = @file_get_contents($storeFile);
            $leadsArr = $content ? (json_decode($content, true) ?: []) : [];
            upsertLead($leadsArr, $leadRecord, $phone);
            @file_put_contents($storeFile, json_encode($leadsArr, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        }
    } catch (Exception $e) {}
}

// 3. Un-blacklist from deleted leads
$delStores = [
    dirname(__DIR__, 1) . '/deleted_leads.json',
    __DIR__ . '/deleted_leads.json',
    dirname(__DIR__, 2) . '/crm/deleted_leads.json',
    dirname(__DIR__, 2) . '/data/deleted_leads.json'
];
foreach ($delStores as $delStore) {
    try {
        if (@file_exists($delStore)) {
            $delArr = json_decode(@file_get_contents($delStore), true);
            if (is_array($delArr)) {
                $filtered = array_values(array_filter($delArr, function($item) use ($phone, $leadId) {
                    $it = trim(strtolower((string)$item));
                    return $it !== strtolower((string)$leadId) && $it !== (string)$phone;
                }));
                @file_put_contents($delStore, json_encode($filtered, JSON_PRETTY_PRINT));
            }
        }
    } catch (Exception $e) {}
}

// 4. Background sync to Render
if (function_exists('curl_init')) {
    $ch = curl_init('https://paisainminutes.onrender.com/api/loan-applications');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'amount' => $cleanLoan,
        'tenureMonths' => 12,
        'purpose' => 'Personal Loan',
        'monthlyIncome' => $salNumber,
        'phone' => $phone,
        'phoneNumber' => $phone,
        'mobile' => $phone,
        'name' => $name,
        'email' => $email
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    @curl_exec($ch);
    @curl_close($ch);
}

// 5. Return success
echo json_encode([
    'status'  => 'success',
    'success' => true,
    'message' => 'Lead submitted successfully!',
    'lead_id' => $leadId,
    'lead'    => $leadRecord
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
