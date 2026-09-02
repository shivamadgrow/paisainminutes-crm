<?php
/**
 * Paisa in Minutes - Unified Lead Retrieval API Endpoint
 * Endpoint: /admin/api/get-leads, /admin/api/get-leads.php, /api/get-leads
 */

// Enable CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Helper to clean and parse Loan Amount
function cleanLoanAmount($raw) {
    if ($raw === null || $raw === '' || $raw === false) return 50000;
    if (is_numeric($raw) && $raw > 0 && $raw <= 500000) return (int)$raw;

    $str = (string)$raw;
    // Check range strings e.g. "₹25,000 - ₹50,000"
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

    // Detect concatenated numeric ranges e.g. 2500050000 -> 50000
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

    // Detect concatenated salary strings e.g. 7000079999 -> 75000
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
        $clean = strtolower(trim($explicitCompany));
        if (strpos($clean, 'rupay91') !== false || strpos($clean, 'rupay 91') !== false) return 'Rupay91';
        if (strpos($clean, 'adgrow') !== false) return 'Adgrow';
        if (strpos($clean, 'agdm') !== false) return 'AGDM';
        if (strpos($clean, 'rupaysure') !== false || strpos($clean, 'rupay sure') !== false) return 'Rupaysure';
        return trim($explicitCompany);
    }

    $cibilNum = 0;
    if (!empty($cibilStr)) {
        preg_match('/\d{3}/', $cibilStr, $matches);
        if (!empty($matches[0])) {
            $cibilNum = (int)$matches[0];
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

// 4. Load from Primary Data File: public_html/data/leads.json
$rootPath = dirname(__DIR__, 2);
$leadsFile = $rootPath . '/data/leads.json';
$leadsStoreFile = $rootPath . '/crm/leads_store.json';
$leadsLogCsv = $rootPath . '/leads_log.csv';

// Load deleted leads blacklist
$deletedMap = [];
$deletedStoreCandidates = array_unique([
    $rootPath . '/crm/deleted_leads.json',
    $rootPath . '/data/deleted_leads.json',
    __DIR__ . '/../../crm/deleted_leads.json',
    __DIR__ . '/../deleted_leads.json',
    __DIR__ . '/deleted_leads.json'
]);
foreach ($deletedStoreCandidates as $df) {
    if (file_exists($df)) {
        $rawD = file_get_contents($df);
        $dArr = json_decode($rawD, true);
        if (is_array($dArr)) {
            foreach ($dArr as $dItem) {
                $cleanD = trim(strtolower((string)$dItem));
                if ($cleanD !== '') $deletedMap[$cleanD] = true;
            }
        }
    }
}

$allLeads = [];
$seenIds = [];

// Load from data/leads.json
if (file_exists($leadsFile)) {
    $content = file_get_contents($leadsFile);
    $arr = json_decode($content, true);
    if (is_array($arr)) {
        foreach ($arr as $row) {
            if (!is_array($row)) continue;
            $leadId = trim((string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? ''));
            $lIdLower = strtolower($leadId);
            $lPhone = preg_replace('/\D/', '', (string)($row['phone'] ?? $row['mobile'] ?? ''));
            
            if ($lIdLower && !empty($deletedMap[$lIdLower])) continue;
            if ($lPhone && !empty($deletedMap[$lPhone])) continue;

            if (empty($leadId)) {
                $leadId = 'PIM-' . rand(100000, 999999);
            }
            $row['id'] = $leadId;
            $row['loanNo'] = $leadId;
            $row['lead_id'] = $leadId;
            $allLeads[] = $row;
            $seenIds[$leadId] = true;
        }
    }
}

// Load secondary from crm/leads_store.json if not duplicate
if (file_exists($leadsStoreFile)) {
    $content = file_get_contents($leadsStoreFile);
    $arr = json_decode($content, true);
    if (is_array($arr)) {
        foreach ($arr as $row) {
            if (!is_array($row)) continue;
            $leadId = trim((string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? ''));
            $lIdLower = strtolower($leadId);
            $lPhone = preg_replace('/\D/', '', (string)($row['phone'] ?? $row['mobile'] ?? ''));
            if ($lIdLower && !empty($deletedMap[$lIdLower])) continue;
            if ($lPhone && !empty($deletedMap[$lPhone])) continue;
            if ($leadId && !empty($seenIds[$leadId])) continue;
            if (empty($leadId)) {
                $leadId = 'PIM-' . rand(100000, 999999);
            }
            $row['id'] = $leadId;
            $row['loanNo'] = $leadId;
            $row['lead_id'] = $leadId;
            $allLeads[] = $row;
            if ($leadId) $seenIds[$leadId] = true;
        }
    }
}

// Also load from leads_log.csv and merge any records not already in list
if (file_exists($leadsLogCsv)) {
    $csvData = array_map('str_getcsv', file($leadsLogCsv));
    if (count($csvData) > 1) {
        $headers = array_shift($csvData);
        foreach ($csvData as $row) {
            if (count($row) >= 4) {
                // Support both format with leadId in row[0] or timestamp in row[0]
                $isIdFirst = (strpos((string)$row[0], 'PIM-') === 0);
                $rowId = trim((string)($isIdFirst ? $row[0] : ('PIM-' . rand(100000, 999999))));
                $rowTimestamp = $isIdFirst ? ($row[1] ?? '') : ($row[0] ?? '');
                $rowName = $isIdFirst ? ($row[2] ?? 'Applicant') : ($row[1] ?? 'Applicant');
                $rowPhone = $isIdFirst ? ($row[4] ?? '') : ($row[3] ?? '');
                $rowAmount = $isIdFirst ? ($row[7] ?? 50000) : ($row[4] ?? 50000);
                $rowPartner = $isIdFirst ? ($row[6] ?? '') : ($row[5] ?? '');
                $rowStatus = $row[count($row) - 1] ?? 'Fresh';

                $cleanPhone = preg_replace('/\D/', '', (string)$rowPhone);
                $rIdLower = strtolower($rowId);
                if ($rIdLower && !empty($deletedMap[$rIdLower])) continue;
                if ($cleanPhone && !empty($deletedMap[$cleanPhone])) continue;
                if (!empty($rowId) && !empty($seenIds[$rowId])) continue;
                if (!empty($cleanPhone) && !empty($seenIds[$cleanPhone])) continue;

                $allLeads[] = [
                    'id'              => $rowId,
                    'loanNo'          => $rowId,
                    'lead_id'         => $rowId,
                    'name'            => $rowName ?: 'Applicant',
                    'mobile'          => $cleanPhone ? ('+91 ' . $cleanPhone) : '',
                    'phone'           => $cleanPhone,
                    'loanAmount'      => $rowAmount ?: 50000,
                    'salary'          => 35000,
                    'cibil'           => '750+',
                    'assignedCompany' => $rowPartner ?: 'Rupay91',
                    'created'         => $rowTimestamp ?: date('d M Y, h:i A'),
                    'created_at'      => $rowTimestamp ?: date('Y-m-d H:i:s'),
                    'status'          => $rowStatus ?: 'Fresh',
                    'source'          => 'Website Application'
                ];
                if (!empty($rowId)) $seenIds[$rowId] = true;
                if (!empty($cleanPhone)) $seenIds[$cleanPhone] = true;
            }
        }
    }
}

// Deduplicate and merge by 10-digit Phone Number (1 Lead Per Applicant)
$leadsByPhone = [];
$avatarColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600'];

foreach ($allLeads as $index => $lead) {
    $phone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? $lead['phoneNumber'] ?? ''));
    if (strlen($phone) > 10) {
        $phone = substr($phone, -10);
    }
    
    // Key for grouping: clean 10-digit phone or unique lead id
    $groupKey = (!empty($phone) && strlen($phone) === 10) ? $phone : ('ID_' . ($lead['id'] ?? $lead['lead_id'] ?? $index));

    $leadId = $lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? ('PIM-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT));
    $name = trim($lead['name'] ?? $lead['fullName'] ?? $lead['full_name'] ?? 'Applicant');
    if ($name === '') $name = 'Applicant';

    $rawLoan = $lead['loanAmount'] ?? $lead['applied'] ?? $lead['loan_amount'] ?? $lead['amount'] ?? 50000;
    $cleanedLoan = cleanLoanAmount($rawLoan);

    $rawSalary = $lead['salary'] ?? $lead['monthlySalary'] ?? $lead['monthly_salary'] ?? $lead['income'] ?? 35000;
    $salVal = $lead['sal_val'] ?? null;
    $salRange = $lead['salary_range'] ?? '';
    $cleanedSalary = cleanSalary($rawSalary, $salVal, $salRange);

    $cibil = trim($lead['cibil'] ?? $lead['cibilScore'] ?? $lead['cibil_score'] ?? $lead['cibil_range'] ?? '—');
    $explicitCompany = $lead['assignedCompany'] ?? $lead['company'] ?? $lead['partner'] ?? $lead['partner_name'] ?? '';
    $assignedCompany = determineCompany($cibil, $cleanedSalary, $cleanedLoan, $explicitCompany);

    $createdAt = $lead['created_at'] ?? $lead['created'] ?? $lead['date'] ?? $lead['timestamp'] ?? date('Y-m-d H:i:s');
    $timestamp = strtotime($createdAt) ?: time();
    $formattedDate = date('d M Y, h:i A', $timestamp);
    $isoDate = date('Y-m-d', $timestamp);
    $today = date('Y-m-d');

    // STRICTLY TODAY ONLY: Filter out any leads from past dates
    if ($isoDate < $today) {
        continue;
    }

    $status = trim($lead['status'] ?? 'Fresh');
    if (empty($status)) $status = 'Fresh';

    $eligibilityStatus = trim($lead['eligibilityStatus'] ?? $lead['eligibility_status'] ?? $lead['eligibility'] ?? 'Eligible');

    $item = [
        'id'                => $leadId,
        'loanNo'            => $leadId,
        'lead_id'           => $leadId,
        'name'              => $name,
        'fullName'          => $name,
        'phone'             => $phone,
        'mobile'            => $phone ? ('+91 ' . $phone) : '',
        'email'             => !empty($lead['email']) && $lead['email'] !== '—' ? $lead['email'] : ($phone ? ($phone . '@paisainminutes.com') : '—'),
        'emailAddress'      => !empty($lead['email']) && $lead['email'] !== '—' ? $lead['email'] : ($phone ? ($phone . '@paisainminutes.com') : '—'),
        'creditManager'     => $lead['creditManager'] ?? $lead['credit_manager'] ?? 'Unassigned',
        'pan'               => strtoupper(trim($lead['pan'] ?? '—')),
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
        'source'            => $lead['source'] ?? $lead['page_source'] ?? 'Website Form',
        'purpose'           => $lead['purpose'] ?? 'Personal Loan',
        'status'            => $status,
        'created'           => $formattedDate,
        'created_at'        => date('Y-m-d H:i:s', $timestamp),
        'date'              => $isoDate,
        'timestamp_num'     => $timestamp
    ];

    if (!isset($leadsByPhone[$groupKey])) {
        $leadsByPhone[$groupKey] = $item;
    } else {
        // Merge with existing: keep the best information (real name, specific amount/cibil, latest timestamp)
        $existing = $leadsByPhone[$groupKey];
        if (($existing['name'] === 'Applicant' || empty($existing['name'])) && $item['name'] !== 'Applicant') {
            $existing['name'] = $item['name'];
            $existing['fullName'] = $item['fullName'];
        }
        if (($existing['source'] === 'Website Application' || $existing['source'] === 'Apply Now Website') && $item['source'] === 'Check Eligibility Website') {
            $existing['source'] = $item['source'];
        }
        if ($existing['cibil'] === '—' && $item['cibil'] !== '—') {
            $existing['cibil'] = $item['cibil'];
            $existing['cibilScore'] = $item['cibilScore'];
        }
        if ($existing['loanAmount'] === 50000 && $item['loanAmount'] !== 50000) {
            $existing['loanAmount'] = $item['loanAmount'];
            $existing['applied'] = $item['applied'];
        }
        if ($item['timestamp_num'] >= $existing['timestamp_num']) {
            $existing['created'] = $item['created'];
            $existing['created_at'] = $item['created_at'];
            $existing['timestamp_num'] = $item['timestamp_num'];
        }
        $leadsByPhone[$groupKey] = $existing;
    }
}

$formattedLeads = [];
foreach ($leadsByPhone as $lead) {
    $name = $lead['name'];
    $initials = 'AP';
    $nameParts = preg_split('/\s+/', $name);
    if (count($nameParts) >= 2 && !empty($nameParts[0]) && !empty($nameParts[1])) {
        $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
    } elseif (!empty($name)) {
        $initials = strtoupper(substr($name, 0, min(2, strlen($name))));
    }

    $lead['initials'] = $initials;
    $lead['avatarBg'] = $avatarColors[abs(crc32($name)) % count($avatarColors)];
    unset($lead['timestamp_num']);
    $formattedLeads[] = $lead;
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
