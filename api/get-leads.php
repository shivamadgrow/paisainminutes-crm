<?php
/**
 * Paisa in Minutes - Direct Self-Contained CRM Lead Retrieval Endpoint
 * Endpoint: /crm/api/get-leads.php or /api/get-leads.php on subdomain
 */

date_default_timezone_set('Asia/Kolkata');

// Enable CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Helper to clean and parse Loan Amount
function cleanLoanAmount($raw) {
    if ($raw === null || $raw === '' || $raw === false) return 50000;
    if (is_numeric($raw) && $raw > 0 && $raw <= 500000) return (int)$raw;

    $str = (string)$raw;
    if (preg_match('/[-–—]|to/i', $str)) {
        $parts = preg_split('/[-–—]|to/i', str_replace(',', '', $str));
        if (count($parts) >= 2) {
            $n1 = (int)preg_replace('/\D/', '', $parts[0]);
            $n2 = (int)preg_replace('/\D/', '', $parts[1]);
            if ($n2 > 0) return $n2;
            if ($n1 > 0) return $n1;
        }
    }

    $clean = (int)preg_replace('/\D/', '', $str);
    if ($clean <= 0) return 50000;

    if ($clean > 500000) {
        $s = (string)$clean;
        $len = strlen($s);
        for ($i = 3; $i <= 6; $i++) {
            if ($i < $len) {
                $p1 = (int)substr($s, 0, $i);
                $p2 = (int)substr($s, $i);
                if ($p1 >= 1000 && $p1 <= 500000 && $p2 >= 1000 && $p2 <= 1000000 && $p2 >= $p1) {
                    return $p2;
                }
            }
        }
        if ($clean > 1000000) return 50000;
    }
    return $clean;
}

// 2. Helper to clean and parse Monthly Salary
function cleanSalary($raw, $salVal = null, $salRange = '') {
    if (!empty($salVal) && is_numeric($salVal)) {
        $sv = (int)$salVal;
        if ($sv >= 5000 && $sv <= 500000) return $sv;
    }

    $textToCheck = (string)(!empty($salRange) ? $salRange : $raw);
    if (preg_match('/[-–—]|to/i', $textToCheck)) {
        $parts = preg_split('/[-–—]|to/i', str_replace(',', '', $textToCheck));
        if (count($parts) >= 2) {
            $n1 = (int)preg_replace('/\D/', '', $parts[0]);
            $n2 = (int)preg_replace('/\D/', '', $parts[1]);
            if ($n1 > 0 && $n2 > 0) return (int)round(($n1 + $n2) / 2);
            if ($n1 > 0) return $n1;
        }
    }

    $clean = (int)preg_replace('/\D/', '', (string)$raw);
    if ($clean <= 0) return 30000;

    if ($clean > 500000) {
        $s = (string)$clean;
        $len = strlen($s);
        if ($len === 10) {
            $p1 = (int)substr($s, 0, 5);
            $p2 = (int)substr($s, 5);
            if ($p1 >= 10000 && $p1 <= 300000 && $p2 >= 10000 && $p2 <= 300000) {
                return (int)round(($p1 + $p2) / 2);
            }
        }
        for ($i = 4; $i <= 6; $i++) {
            if ($i < $len) {
                $p1 = (int)substr($s, 0, $i);
                $p2 = (int)substr($s, $i);
                if ($p1 >= 10000 && $p1 <= 300000 && $p2 >= 10000 && $p2 <= 300000) {
                    return (int)round(($p1 + $p2) / 2);
                }
            }
        }
        return 35000;
    }
    return $clean;
}

// 3. Helper to determine partner company
function determineCompany($cibilStr, $salaryNum, $amountNum, $explicitCompany) {
    if (!empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'AUTO') {
        $clean = strtolower(trim((string)$explicitCompany));
        if (strpos($clean, 'rupay91') !== false || strpos($clean, 'rupay 91') !== false) return 'Rupay91';
        if (strpos($clean, 'adgrow') !== false) return 'Adgrow';
        if (strpos($clean, 'agdm') !== false) return 'AGDM';
        if (strpos($clean, 'rupaysure') !== false || strpos($clean, 'rupay sure') !== false) return 'Rupaysure';
        if (!preg_match('/^\d+$/', $clean) && in_array(ucfirst($clean), ['Rupay91', 'Adgrow', 'Agdm', 'Rupaysure'])) {
            return ucfirst($clean);
        }
    }

    $cibilNum = 0;
    if (!empty($cibilStr)) {
        preg_match('/\d{3}/', (string)$cibilStr, $matches);
        if (!empty($matches[0])) {
            $cibilNum = (int)$matches[0];
        } elseif (strpos(strtolower((string)$cibilStr), '750') !== false || strpos(strtolower((string)$cibilStr), 'excellent') !== false) {
            $cibilNum = 780;
        } elseif (strpos(strtolower((string)$cibilStr), '700') !== false || strpos(strtolower((string)$cibilStr), 'good') !== false) {
            $cibilNum = 720;
        } elseif (strpos(strtolower((string)$cibilStr), '650') !== false || strpos(strtolower((string)$cibilStr), 'average') !== false) {
            $cibilNum = 660;
        }
    }

    if ($cibilNum >= 720 || $salaryNum >= 40000) return 'Rupay91';
    if ($amountNum >= 150000 || ($salaryNum >= 25000 && $cibilNum >= 650)) return 'Adgrow';
    if ($cibilNum >= 670 || $salaryNum >= 20000) return 'Rupaysure';
    return 'AGDM';
}

// 4. Look for all possible lead files
$possibleFiles = [
    __DIR__ . '/../leads_store.json',
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../crm/leads_store.json',
    __DIR__ . '/leads_store.json',
    dirname(__DIR__, 2) . '/data/leads.json',
    dirname(__DIR__, 2) . '/crm/leads_store.json'
];

$rawList = [];

foreach ($possibleFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $arr = json_decode($content, true);
        if (is_array($arr)) {
            foreach ($arr as $row) {
                if (is_array($row)) {
                    $rawList[] = $row;
                }
            }
        }
    }
}

// 5. Intelligent Deduplication Map (By Phone, or By Stable ID)
$dedupedMap = [];

foreach ($rawList as $row) {
    $phone = preg_replace('/\D/', '', (string)($row['phone'] ?? $row['mobile'] ?? ''));
    if (strlen($phone) === 12 && strpos($phone, '91') === 0) {
        $phone = substr($phone, 2);
    }
    
    $rowId = trim((string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? ''));
    $key = ($phone && strlen($phone) === 10) ? ('phone_' . $phone) : ('id_' . ($rowId ?: rand(100000, 999999)));

    if (!isset($dedupedMap[$key])) {
        $dedupedMap[$key] = $row;
    } else {
        // Merge into existing: Keep the more complete data
        $existing = $dedupedMap[$key];
        $existingName = trim((string)($existing['name'] ?? $existing['fullName'] ?? ''));
        $newName = trim((string)($row['name'] ?? $row['fullName'] ?? ''));

        // If new has real name and existing is Applicant/empty, replace
        if ($newName && $newName !== 'Applicant' && ($existingName === 'Applicant' || empty($existingName))) {
            $dedupedMap[$key] = array_merge($existing, $row);
        } else {
            $dedupedMap[$key] = array_merge($row, $existing);
        }
    }
}

// 6. Format and Normalize Leads for Display
$formattedLeads = [];
$avatarColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600'];
$index = 0;

foreach ($dedupedMap as $lead) {
    $index++;
    $phone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? ''));
    if (strlen($phone) === 12 && strpos($phone, '91') === 0) {
        $phone = substr($phone, 2);
    }
    $mobileFormatted = $phone ? ('+91 ' . $phone) : '—';

    $leadId = trim((string)($lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? ''));
    if (empty($leadId) || strpos($leadId, 'undefined') !== false) {
        $leadId = 'PIM-' . ($phone ? substr($phone, -6) : (100000 + $index));
    }

    $name = trim((string)($lead['name'] ?? $lead['fullName'] ?? $lead['full_name'] ?? 'Applicant'));
    if ($name === '') $name = 'Applicant';

    $email = trim((string)($lead['email'] ?? $lead['emailAddress'] ?? $lead['email_address'] ?? ''));
    if (empty($email) || $email === '—') {
        $email = $phone ? ($phone . '@paisainminutes.com') : '—';
    }

    $rawLoan = $lead['loanAmount'] ?? $lead['applied'] ?? $lead['loan_amount'] ?? $lead['amount'] ?? 50000;
    $cleanedLoan = cleanLoanAmount($rawLoan);

    $rawSalary = $lead['salary'] ?? $lead['monthlySalary'] ?? $lead['monthly_salary'] ?? $lead['income'] ?? 35000;
    $salVal = $lead['sal_val'] ?? null;
    $salRange = $lead['salary_range'] ?? '';
    $cleanedSalary = cleanSalary($rawSalary, $salVal, $salRange);

    $cibil = trim((string)($lead['cibil'] ?? $lead['cibilScore'] ?? $lead['cibil_score'] ?? $lead['cibil_range'] ?? '750+'));
    if (empty($cibil)) $cibil = '750+';

    $explicitCompany = $lead['assignedCompany'] ?? $lead['company'] ?? $lead['partner'] ?? $lead['partner_name'] ?? '';
    $assignedCompany = determineCompany($cibil, $cleanedSalary, $cleanedLoan, $explicitCompany);

    $initials = 'AP';
    $nameParts = preg_split('/\s+/', $name);
    if (count($nameParts) >= 2 && !empty($nameParts[0]) && !empty($nameParts[1])) {
        $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
    } elseif (!empty($name)) {
        $initials = strtoupper(substr($name, 0, min(2, strlen($name))));
    }

    // Correct IST Date/Time
    $createdAt = $lead['created_at'] ?? $lead['created'] ?? $lead['date'] ?? $lead['timestamp'] ?? date('Y-m-d H:i:s');
    $timestamp = strtotime($createdAt) ?: time();

    $formattedDate = date('d M Y, h:i A', $timestamp);
    $isoDate = date('Y-m-d', $timestamp);
    $today = date('Y-m-d');

    // STRICTLY TODAY ONLY: Filter out any leads from past dates
    if ($isoDate < $today) {
        continue;
    }

    $status = trim((string)($lead['status'] ?? 'Fresh'));
    if (empty($status)) $status = 'Fresh';

    $eligibilityStatus = trim((string)($lead['eligibilityStatus'] ?? $lead['eligibility_status'] ?? $lead['eligibility'] ?? 'Eligible'));

    $formattedLeads[] = [
        'id'                => $leadId,
        'loanNo'            => $leadId,
        'lead_id'           => $leadId,
        'name'              => $name,
        'fullName'          => $name,
        'initials'          => $initials,
        'avatarBg'          => $avatarColors[abs(crc32($name)) % count($avatarColors)],
        'mobile'            => $mobileFormatted,
        'phone'             => $phone ?: $mobileFormatted,
        'email'             => $email,
        'emailAddress'      => $email,
        'creditManager'     => $lead['creditManager'] ?? $lead['credit_manager'] ?? 'Unassigned',
        'pan'               => strtoupper(trim((string)($lead['pan'] ?? '—'))),
        'cibil'             => $cibil,
        'cibilScore'        => $cibil,
        'applied'           => $cleanedLoan,
        'loanAmount'        => $cleanedLoan,
        'salary'            => $cleanedSalary,
        'monthlySalary'     => $cleanedSalary,
        'sal_val'           => $salVal ?: $cleanedSalary,
        'salary_range'      => $salRange,
        'city'              => $lead['city'] ?? 'Delhi NCR',
        'state'             => $lead['state'] ?? 'India',
        'pincode'           => $lead['pincode'] ?? $lead['pin_code'] ?? '110001',
        'employmentType'    => $lead['employmentType'] ?? $lead['employment_type'] ?? 'Salaried',
        'assignedCompany'   => $assignedCompany,
        'eligibilityStatus' => $eligibilityStatus,
        'source'            => $lead['source'] ?? $lead['page_source'] ?? 'Website Application',
        'purpose'           => $lead['purpose'] ?? 'Personal Loan',
        'status'            => $status,
        'created'           => $formattedDate,
        'created_at'        => date('Y-m-d H:i:s', $timestamp),
        'date'              => $isoDate,
        'payout'            => floatval($lead['payout'] ?? 0),
        'ip_address'        => $lead['ip_address'] ?? '::1'
    ];
}

// Sort newest first
usort($formattedLeads, function($a, $b) {
    return strtotime($b['created_at']) <=> strtotime($a['created_at']);
});

echo json_encode([
    'success' => true,
    'count'   => count($formattedLeads),
    'leads'   => $formattedLeads
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
