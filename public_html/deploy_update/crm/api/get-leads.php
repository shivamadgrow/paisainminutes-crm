<?php
/**
 * Paisa in Minutes - Unified Lead Retrieval API Endpoint
 * Single Source of Truth: http://145.223.23.114:4000/api/loan-applications/all
 */

error_reporting(0);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/env.php';
$backendBase = getEnvVal('BACKEND_API_URL', 'http://145.223.23.114:4000');

// Pass authorization header if present
$headers = ['Accept: application/json'];
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

$ch = curl_init(rtrim($backendBase, '/') . '/api/loan-applications/all');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($response === false || !empty($curlErr)) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error'   => 'Backend server unavailable: ' . ($curlErr ?: 'timeout'),
        'count'   => 0,
        'leads'   => []
    ]);
    exit;
}

$data = json_decode($response, true);
$rawList = is_array($data) ? ($data['applications'] ?? $data['leads'] ?? $data) : [];

if (!is_array($rawList)) {
    $rawList = [];
}

$partnerFilter = trim((string)($_GET['partner_id'] ?? $_GET['partner'] ?? ''));

$leads = [];
foreach ($rawList as $item) {
    if (!is_array($item)) continue;

    $rawPhone = preg_replace('/\D/', '', (string)($item['phone'] ?? $item['phoneNumber'] ?? $item['mobile'] ?? ''));
    if (strlen($rawPhone) > 10) $rawPhone = substr($rawPhone, -10);

    $leadId = (string)($item['id'] ?? $item['lead_id'] ?? $item['loanNo'] ?? '');
    $rawName = trim((string)($item['name'] ?? $item['fullName'] ?? 'Applicant'));
    if (empty($rawName) || $rawName === '—') $rawName = 'Applicant';

    $cleanLoan = (int)($item['amount'] ?? $item['loanAmount'] ?? 0);
    $cleanSalary = (int)($item['monthlyIncome'] ?? $item['salary'] ?? 0);
    $isPhoneOnly = ($rawName === 'Applicant' && $cleanLoan === 0 && $cleanSalary === 0);

    $initials = 'AP';
    if ($rawName !== 'Applicant') {
        $parts = explode(' ', $rawName);
        $initials = strtoupper(substr($parts[0] ?? '', 0, 1) . substr($parts[1] ?? '', 0, 1)) ?: 'AP';
    }

    $createdAt = $item['createdAt'] ?? $item['created_at'] ?? date('Y-m-d H:i:s');
    $ts = strtotime($createdAt);
    $formattedDate = $ts ? date('d M Y, h:i A', $ts) : date('d M Y, h:i A');
    $timeOnly = $ts ? date('h:i A', $ts) : date('h:i A');
    $dateOnly = $ts ? date('d M Y', $ts) : date('d M Y');

    $assignedCompany = $item['selectedLenderId'] ?? $item['assignedCompany'] ?? ($isPhoneOnly ? 'Pending Details' : 'Pending Selection');

    // Filter by partner if specified
    if (!empty($partnerFilter) && strcasecmp($partnerFilter, 'all') !== 0) {
        if (strcasecmp($assignedCompany, $partnerFilter) !== 0) {
            continue;
        }
    }

    $leads[] = [
        'id'                => $leadId,
        'loanNo'            => $leadId,
        'lead_id'           => $leadId,
        'name'              => $rawName,
        'fullName'          => $rawName,
        'initials'          => $initials,
        'avatarBg'          => 'bg-blue-600',
        'mobile'            => $rawPhone ? '+91 ' . $rawPhone : '—',
        'phone'             => $rawPhone,
        'phoneNumber'       => $rawPhone,
        'email'             => !empty($item['email']) && strpos($item['email'], '@paisainminutes.com') === false ? $item['email'] : '—',
        'emailAddress'      => !empty($item['email']) && strpos($item['email'], '@paisainminutes.com') === false ? $item['email'] : '—',
        'creditManager'     => $item['creditManager'] ?? 'Unassigned',
        'pan'               => strtoupper((string)($item['pan'] ?? '—')),
        'dob'               => $item['dob'] ?? '—',
        'gender'            => $item['gender'] ?? '—',
        'addressType'       => $item['addressType'] ?? 'Rented',
        'salaryMode'        => $item['salaryMode'] ?? 'Bank Transfer',
        'companyName'       => $item['companyName'] ?? '—',
        'haveCreditCard'    => $item['haveCreditCard'] ?? 'No',
        'creditCardLimit'   => $item['creditCardLimit'] ?? null,
        'cibil'             => (string)($item['cibil'] ?? $item['cibilScore'] ?? '—'),
        'cibilScore'        => (string)($item['cibil'] ?? $item['cibilScore'] ?? '—'),
        'applied'           => $cleanLoan,
        'loanAmount'        => $cleanLoan,
        'salary'            => $cleanSalary,
        'monthlySalary'     => $cleanSalary,
        'city'              => $item['city'] ?? '—',
        'state'             => $item['state'] ?? '—',
        'pincode'           => $item['pincode'] ?? '—',
        'employmentType'    => $item['employmentType'] ?? 'Salaried',
        'assignedCompany'   => $assignedCompany,
        'eligibilityStatus' => $isPhoneOnly ? 'Incomplete / Phone Only' : 'Eligible',
        'source'            => $item['source'] ?? ($isPhoneOnly ? 'Apply Now (Phone Only)' : 'Apply Now (Website)'),
        'utm_source'        => $item['utm_source'] ?? null,
        'lead_source'       => $item['lead_source'] ?? null,
        'purpose'           => $item['purpose'] ?? 'Personal Loan',
        'status'            => $item['status'] ?? 'Fresh',
        'created'           => $formattedDate,
        'created_at'        => $createdAt,
        'created_time'      => $timeOnly,
        'date'              => $dateOnly
    ];
}

// Sort newest first
usort($leads, function($a, $b) {
    return strtotime($b['created_at']) <=> strtotime($a['created_at']);
});

echo json_encode([
    'success' => true,
    'count'   => count($leads),
    'leads'   => $leads
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
