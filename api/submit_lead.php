<?php
/**
 * Paisa in Minutes - Direct Customer Lead Submission Handler & PaisaCRM Integration
 */

// Ensure script finishes saving even if user navigates away
ignore_user_abort(true);
error_reporting(0);
ini_set('display_errors', '0');

// Set Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

// Enable session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security & CORS Headers
if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Capture Form Inputs (supports JSON & URL-encoded POST)
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);
$data = is_array($jsonInput) ? array_merge($_POST, $jsonInput) : $_POST;

// Sanitize and extract inputs with fallback keys
$phone = preg_replace('/[^0-9]/', '', (string)($data['phone'] ?? $data['mobile'] ?? $data['phoneNumber'] ?? $data['mobile_number'] ?? ''));
if (strlen($phone) > 10) {
    $phone = substr($phone, -10);
}

// Validate Phone Number
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

$name          = trim((string)($data['name'] ?? $data['fullName'] ?? $data['full_name'] ?? 'Applicant'));
if ($name === '') $name = 'Applicant';
$email         = trim((string)($data['email'] ?? $data['emailAddress'] ?? $data['email_address'] ?? '—'));
if (empty($email) || strpos($email, '@paisainminutes.com') !== false) $email = '—';

$loanAmt       = trim((string)($data['loanAmount'] ?? $data['loan_amount'] ?? $data['amount'] ?? $data['applied'] ?? ''));
$cibil         = trim((string)($data['cibilScore'] ?? $data['cibil_score'] ?? $data['cibil'] ?? '—'));
$monthlySalary = trim((string)($data['monthlySalary'] ?? $data['monthly_salary'] ?? $data['salary'] ?? ''));
$pincode       = trim((string)($data['pincode'] ?? $data['pin_code'] ?? '—'));
$city          = trim((string)($data['city'] ?? '—'));
$state         = trim((string)($data['state'] ?? 'India'));
$employmentType= trim((string)($data['employmentType'] ?? $data['employment_type'] ?? 'Salaried'));
$pageSource    = trim((string)($data['source'] ?? ($cibil !== '—' ? 'Check Eligibility Website' : 'Apply Now (Phone Only)')));
$explicitCompany = trim((string)($data['assignedCompany'] ?? $data['company'] ?? $data['partner'] ?? ''));

// Detect if this is a Step-1 Phone-Only lead or full eligibility submission
$isPhoneOnly = ($name === 'Applicant' || empty($data['name'])) && 
               (empty($data['loanAmount']) || $data['loanAmount'] === 0 || $data['loanAmount'] === '0') && 
               (empty($data['monthlySalary']) || $data['monthlySalary'] === 0 || $data['monthlySalary'] === '0') &&
               ($cibil === '—' || empty($data['cibilScore']));

// Helper to determine partner company
function determineCompany($cibilStr, $salaryNum, $amountNum, $explicitCompany) {
    $cibilNum = 0;
    if (!empty($cibilStr)) {
        preg_match('/\d{3}/', $cibilStr, $matches);
        if (!empty($matches[0])) {
            $cibilNum = (int)$matches[0];
        } elseif (strpos(strtolower($cibilStr), '850') !== false) {
            $cibilNum = 850;
        } elseif (strpos(strtolower($cibilStr), '800') !== false) {
            $cibilNum = 800;
        } elseif (strpos(strtolower($cibilStr), '750') !== false || strpos(strtolower($cibilStr), 'excellent') !== false) {
            $cibilNum = 780;
        } elseif (strpos(strtolower($cibilStr), '700') !== false || strpos(strtolower($cibilStr), 'good') !== false) {
            $cibilNum = 720;
        } elseif (strpos(strtolower($cibilStr), '650') !== false || strpos(strtolower($cibilStr), 'average') !== false) {
            $cibilNum = 660;
        } elseif (strpos(strtolower($cibilStr), '600') !== false) {
            $cibilNum = 620;
        } elseif (strpos(strtolower($cibilStr), '550') !== false) {
            $cibilNum = 560;
        } elseif (strpos(strtolower($cibilStr), '500') !== false) {
            $cibilNum = 510;
        }
    }

    if (!empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'AUTO' && $explicitCompany !== 'Pending Details') {
        $clean = strtolower(trim($explicitCompany));
        if (strpos($clean, 'rupay91') !== false || strpos($clean, 'rupay 91') !== false) {
            if ($salaryNum >= 30000 && $cibilNum >= 700) {
                return 'Rupay91';
            }
            return 'Jhatpat Loans';
        }
        if (strpos($clean, 'jhatpat') !== false) return 'Jhatpat Loans';
        if (strpos($clean, 'borrowera') !== false) return 'Borrowera';
        if (strpos($clean, 'easyfincare') !== false || strpos($clean, 'easy fincare') !== false) return 'Easy Fincare';
        if (strpos($clean, 'instarupees') !== false || strpos($clean, 'insta rupees') !== false) return 'Insta Rupees';
        if (strpos($clean, 'udhaar') !== false || strpos($clean, 'dhanar') !== false) return 'UdhaarNow';
        if (strpos($clean, 'loanwithin') !== false || strpos($clean, 'loan within') !== false) return 'LoanWithin';
        if (strpos($clean, 'shubh') !== false) return 'ShubhCash';
        return trim($explicitCompany);
    }

    if ($salaryNum === 0 && $cibilNum === 0 && $amountNum === 0) {
        return 'Pending Details';
    }

    // 750 se upr cibil vale ko rupay 91 dikhaao baaki sbb ko uske niche vala
    if ($cibilNum >= 750) {
        return 'Rupay91';
    } elseif ($cibilNum > 0) {
        return 'Jhatpat Loans';
    }

    if ($salaryNum >= 70000) {
        return 'Rupay91';
    }
    return 'Jhatpat Loans';
}

// 2. Calculate Eligibility Slab & Status strictly per User Matrix
function getSlabInfo($salaryStr, $cibilStr) {
    $salVal = 0;
    if (preg_match('/90,?000/i', $salaryStr)) {
        $salVal = 95000;
    } elseif (preg_match('/80,?000/i', $salaryStr)) {
        $salVal = 85000;
    } elseif (preg_match('/70,?000/i', $salaryStr)) {
        $salVal = 75000;
    } elseif (preg_match('/60,?000/i', $salaryStr)) {
        $salVal = 65000;
    } elseif (preg_match('/50,?000/i', $salaryStr)) {
        $salVal = 55000;
    } elseif (preg_match('/40,?000/i', $salaryStr)) {
        $salVal = 45000;
    } elseif (preg_match('/30,?000/i', $salaryStr)) {
        $salVal = 35000;
    } elseif (preg_match('/20,?000/i', $salaryStr)) {
        $salVal = 25000;
    } else {
        $clean = (int)preg_replace('/[^0-9]/', '', $salaryStr);
        if ($clean > 0) $salVal = $clean;
    }

    $cibilVal = 0;
    if (!empty($cibilStr) && $cibilStr !== '—') {
        if (preg_match('/\b(850|8[5-9]\d|900)\b/', $cibilStr)) {
            $cibilVal = 875;
        } elseif (preg_match('/\b(800|8[0-4]\d)\b/', $cibilStr)) {
            $cibilVal = 825;
        } elseif (preg_match('/\b(750|7[5-9]\d)\b/', $cibilStr)) {
            $cibilVal = 775;
        } elseif (preg_match('/\b(700|7[0-4]\d)\b/', $cibilStr)) {
            $cibilVal = 725;
        } elseif (preg_match('/\b(650|6[5-9]\d)\b/', $cibilStr)) {
            $cibilVal = 675;
        } elseif (preg_match('/\b(600|6[0-4]\d)\b/', $cibilStr)) {
            $cibilVal = 625;
        } elseif (preg_match('/\b(550|5[5-9]\d)\b/', $cibilStr)) {
            $cibilVal = 575;
        } elseif (preg_match('/\b(500|5[0-4]\d)\b/', $cibilStr)) {
            $cibilVal = 525;
        } else {
            preg_match('/\d{3}/', $cibilStr, $cm);
            if (!empty($cm[0])) $cibilVal = (int)$cm[0];
        }
    }

    if ($salVal === 0 && $cibilVal === 0) {
        return ['slab' => 0, 'cibil_range' => '—', 'salary_range' => '—', 'eligibility' => 'Incomplete / Phone Only', 'sal_val' => 0];
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
    $monthlySalary = '—';
} else {
    $slabData  = getSlabInfo($monthlySalary, $cibil);
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
    $assignedCompany = determineCompany($cibil, $slabData['sal_val'], $cleanLoan, $explicitCompany);
}

// Initials
$initials = 'AP';
$nameParts = preg_split('/\s+/', $name);
if (count($nameParts) >= 2 && !empty($nameParts[0]) && !empty($nameParts[1])) {
    $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
} elseif (!empty($name)) {
    $initials = strtoupper(substr($name, 0, min(2, strlen($name))));
}

// 3. Generate unique Lead ID & Store in Session for navigation
$existingLeadId = $data['lead_id'] ?? $data['leadId'] ?? $data['id'] ?? ($_SESSION['pim_lead_id'] ?? null);
if (!empty($existingLeadId) && $existingLeadId !== 'null' && $existingLeadId !== 'undefined') {
    $leadId = (string)$existingLeadId;
} else {
    $leadId = 'PIM-' . date('Ymd') . '-' . rand(1000, 9999);
}

$_SESSION['pim_lead_id']          = $leadId;
$_SESSION['pim_lead_phone']       = $phone;
if (!empty($name) && $name !== 'Applicant') {
    $_SESSION['pim_lead_name'] = $name;
} else {
    unset($_SESSION['pim_lead_name']);
}
if (!empty($email) && strpos($email, '@paisainminutes.com') === false && $email !== '—' && $email !== '-' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['pim_lead_email'] = $email;
} else {
    unset($_SESSION['pim_lead_email']);
}
if (!empty($monthlySalary) && $monthlySalary !== '₹35,000' && $monthlySalary !== '35000') {
    $_SESSION['pim_lead_salary'] = $monthlySalary;
} else {
    unset($_SESSION['pim_lead_salary']);
}
if (!empty($cibil) && $cibil !== '—' && $cibil !== '750+') {
    $_SESSION['pim_lead_cibil'] = $cibil;
} else {
    unset($_SESSION['pim_lead_cibil']);
}
$_SESSION['pim_lead_slab']        = $slabData['slab'];
$_SESSION['pim_lead_eligibility'] = $slabData['eligibility'];

$nowTime       = time();
$formattedDate = date('d M Y, h:i A', $nowTime);
$timestamp     = date('Y-m-d H:i:s', $nowTime);
$isoDate       = date('Y-m-d', $nowTime);

$leadRecord = [
    'id'                => $leadId,
    'loanNo'            => $leadId,
    'lead_id'           => $leadId,
    'name'              => $name,
    'fullName'          => $name,
    'initials'          => $initials,
    'avatarBg'          => 'bg-blue-600',
    'phone'             => $phone,
    'mobile'            => '+91 ' . $phone,
    'email'             => $email,
    'emailAddress'      => $email,
    'creditManager'     => 'Unassigned',
    'pan'               => '—',
    'loan_amount'       => $loanAmt,
    'loanAmount'        => $cleanLoan,
    'applied'           => $cleanLoan,
    'cibil_score'       => $cibil,
    'cibil'             => $cibil,
    'cibilScore'        => $cibil,
    'monthly_salary'    => $monthlySalary,
    'monthlySalary'     => $slabData['sal_val'],
    'salary'            => $slabData['sal_val'],
    'sal_val'           => $slabData['sal_val'],
    'pincode'           => $pincode,
    'city'              => $city,
    'state'             => $state,
    'employmentType'    => $employmentType,
    'slab'              => $slabData['slab'],
    'cibil_range'       => $slabData['cibil_range'],
    'salary_range'      => $slabData['salary_range'],
    'eligibility'       => $slabData['eligibility'],
    'eligibilityStatus' => $slabData['eligibility'],
    'assignedCompany'   => $assignedCompany,
    'partner_name'      => $assignedCompany,
    'purpose'           => 'Personal Loan',
    'status'            => 'Fresh',
    'source'            => $pageSource,
    'created'           => $formattedDate,
    'created_at'        => $timestamp,
    'date'              => $isoDate
];

// 4. Helper to upsert (update or insert) lead uniquely by phone number
function upsertLeadInList(&$list, $newLead, $phone) {
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
        // Preserve original lead ID if already established
        $newLead['id'] = (!empty($existing['id']) && $existing['id'] !== 'null') ? $existing['id'] : $newLead['id'];
        $newLead['loanNo'] = (!empty($existing['loanNo']) && $existing['loanNo'] !== 'null') ? $existing['loanNo'] : $newLead['loanNo'];
        $newLead['lead_id'] = (!empty($existing['lead_id']) && $existing['lead_id'] !== 'null') ? $existing['lead_id'] : $newLead['lead_id'];
        
        // Preserve specific custom name if new is generic 'Applicant'
        if (($newLead['name'] === 'Applicant' || empty($newLead['name'])) && !empty($existing['name']) && $existing['name'] !== 'Applicant') {
            $newLead['name'] = $existing['name'];
            $newLead['fullName'] = $existing['fullName'] ?? $existing['name'];
            $newLead['initials'] = $existing['initials'] ?? 'AP';
        }

        // Preserve status if already progressed beyond 'Fresh'
        if (!empty($existing['status']) && $existing['status'] !== 'Fresh' && $newLead['status'] === 'Fresh') {
            $newLead['status'] = $existing['status'];
        }
        
        // Remove old position and place updated record at top
        array_splice($list, $foundIndex, 1);
        array_unshift($list, $newLead);
    } else {
        array_unshift($list, $newLead);
    }
}

// 5. Save IMMEDIATELY to local stores (ultra-fast, under 1ms)
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}
$jsonFile = $dataDir . '/leads.json';
$leadsList = [];
if (file_exists($jsonFile)) {
    $existing = file_get_contents($jsonFile);
    $leadsList = json_decode($existing, true) ?: [];
}
upsertLeadInList($leadsList, $leadRecord, $phone);
file_put_contents($jsonFile, json_encode($leadsList, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

// Also sync to crm/leads_store.json
$crmStoreFile = __DIR__ . '/crm/leads_store.json';
if (file_exists($crmStoreFile) || is_dir(__DIR__ . '/crm')) {
    $crmLeads = [];
    if (file_exists($crmStoreFile)) {
        $crmLeads = json_decode(file_get_contents($crmStoreFile), true) ?: [];
    }
    upsertLeadInList($crmLeads, $leadRecord, $phone);
    file_put_contents($crmStoreFile, json_encode($crmLeads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// 5b. Un-blacklist phone and leadId from deleted_leads.json so fresh submission is never hidden
$unblackDeletedStores = [
    $dataDir . '/deleted_leads.json',
    __DIR__ . '/crm/deleted_leads.json',
    __DIR__ . '/crm/crm_subdomain_update/deleted_leads.json',
    __DIR__ . '/deploy_update/data/deleted_leads.json',
    __DIR__ . '/deploy_update/crm/deleted_leads.json'
];
foreach ($unblackDeletedStores as $delStore) {
    if (file_exists($delStore)) {
        $delArr = json_decode(file_get_contents($delStore), true);
        if (is_array($delArr)) {
            $updatedDel = array_values(array_filter($delArr, function($item) use ($phone, $leadId) {
                $it = trim(strtolower((string)$item));
                return $it !== strtolower((string)$leadId) && $it !== (string)$phone;
            }));
            if (count($updatedDel) !== count($delArr)) {
                file_put_contents($delStore, json_encode($updatedDel, JSON_PRETTY_PRINT));
            }
        }
    }
}

// 6. Sync Lead & Loan Application to Render Backend API (in background / with short timeout)
require_once __DIR__ . '/config/env.php';

function syncToRenderBackend($phone, $name, $email, $loanAmount, $monthlyIncome, $clientToken = null) {
    if (!function_exists('curl_init')) return null;

    $baseUrl = getEnvVal('RENDER_API_URL', 'https://paisainminutes.onrender.com');
    $token = $clientToken;
    
    // If client token not provided, try OTP verification flow
    if (empty($token)) {
        // 1. Send OTP
        $ch = curl_init($baseUrl . '/api/auth/send-otp');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['phone' => $phone]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $otpRes = curl_exec($ch);
        curl_close($ch);

        $otpData = json_decode($otpRes, true);
        $otpCode = $otpData['debug']['code'] ?? $otpData['code'] ?? '1234';

        // 2. Verify OTP & get token
        $ch = curl_init($baseUrl . '/api/auth/verify-otp');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['phone' => $phone, 'code' => (string)$otpCode, 'otp' => (string)$otpCode]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $verifyRes = curl_exec($ch);
        curl_close($ch);

        $verifyData = json_decode($verifyRes, true);
        $token = $verifyData['token'] ?? $verifyData['accessToken'] ?? null;
    }

    if ($token) {
        // 3. Update Name and Email on user profile
        $ch = curl_init($baseUrl . '/api/users/me');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['name' => $name, 'email' => $email]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_exec($ch);
        curl_close($ch);

        // 4. Create Loan Application with Phone Number on Render Database
        $ch = curl_init($baseUrl . '/api/loan-applications');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'amount'        => (int)$loanAmount,
            'tenureMonths'  => 12,
            'purpose'       => 'Personal Loan',
            'monthlyIncome' => (int)$monthlyIncome,
            'phone'         => (string)$phone,
            'phoneNumber'   => (string)$phone,
            'mobile'        => (string)$phone,
            'name'          => (string)$name,
            'email'         => (string)$email
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $appRes = curl_exec($ch);
        curl_close($ch);

        return json_decode($appRes, true);
    }

    return null;
}

// Trigger background sync to Render
$clientToken = $data['token'] ?? null;
$renderSyncResult = syncToRenderBackend($phone, $name, $email, $cleanLoan, $slabData['sal_val'], $clientToken);

// 7. Append to leads_log.csv for audit trail
$csvLog = __DIR__ . '/leads_log.csv';
$csvRow = [
    $timestamp,
    $name,
    $email,
    $phone,
    $cleanLoan,
    $assignedCompany,
    $slabData['eligibility'],
    $_SERVER['REMOTE_ADDR'] ?? '::1',
    'Fresh'
];
$fp = fopen($csvLog, 'a');
if ($fp) {
    if (filesize($csvLog) === 0) {
        fputcsv($fp, ['Timestamp', 'Name', 'Email', 'Phone', 'Amount', 'Partner', 'Eligibility', 'IP', 'Status']);
    }
    fputcsv($fp, $csvRow);
    fclose($fp);
}

// 7. Construct redirect URL for offers page
$redirectUrl = 'loan-offers.php?lead_id=' . urlencode($leadId) . 
               '&phone=' . urlencode($phone) . 
               '&salary=' . urlencode($monthlySalary ?: $slabData['salary_range']) . 
               '&cibil=' . urlencode($cibil ?: $slabData['cibil_range']) .
               '&slab=' . urlencode((string)$slabData['slab']);

// 8. Return JSON response to frontend
echo json_encode([
    'status'        => 'success',
    'success'       => true,
    'message'       => 'Lead submitted successfully!',
    'lead_id'       => $leadId,
    'lead'          => $leadRecord,
    'slab'          => $slabData['slab'],
    'eligibility'   => $slabData['eligibility'],
    'data'          => [
        'lead_id'      => $leadId,
        'redirect_url' => $redirectUrl
    ]
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
exit;
