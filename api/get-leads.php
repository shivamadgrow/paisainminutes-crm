<?php
error_reporting(0);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');
/**
 * Paisa in Minutes - Unified Lead Retrieval API Endpoint
 * Endpoint: /admin/api/get-leads, /admin/api/get-leads.php, /api/get-leads
 */

// Enable CORS & Disable Cache
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
header('Pragma: no-cache');
header('Expires: 0');
header('X-Accel-Expires: 0');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Helper to clean and parse Loan Amount (returns 0 if not provided)
function cleanLoanAmount($raw) {
    if ($raw === null || $raw === '' || $raw === false || $raw === 0 || $raw === '0') return 0;
    if (is_numeric($raw) && (int)$raw === 0) return 0;
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
    if ($clean <= 0) return 0;

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
        if ($clean > 1000000) return 0;
    }
    return $clean;
}

// 2. Helper to clean and parse Monthly Salary (returns 0 if not provided)
function cleanSalary($raw, $salVal = null, $salRange = '') {
    if ($raw === null || $raw === '' || $raw === false || $raw === 0 || $raw === '0') {
        if (empty($salVal) && empty($salRange)) return 0;
    }
    if (!empty($salVal) && is_numeric($salVal) && (int)$salVal > 0) {
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
    if ($clean <= 0) return 0;

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
        return 0;
    }
    return $clean;
}

// 3. Helper to determine eligibility slab and partner company strictly per user matrix
function getSlabAndPartner($cibilStr, $salaryNum = 0, $explicitCompany = '') {
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
            preg_match('/\d{3}/', $cibilStr, $matches);
            if (!empty($matches[0])) $cibilVal = (int)$matches[0];
        }
    }

    if ($cibilVal >= 850 || ($cibilVal === 0 && $salaryNum >= 90000)) {
        $slab = 8;
        $cibilRange = '850–900';
        $salaryRange = '₹90,000+';
        $eligibility = 'Eligible – Premium';
    } elseif ($cibilVal >= 800 || ($cibilVal === 0 && $salaryNum >= 80000)) {
        $slab = 7;
        $cibilRange = '800–849';
        $salaryRange = '₹80,000–₹89,999';
        $eligibility = 'Eligible – Premium';
    } elseif ($cibilVal >= 750 || ($cibilVal === 0 && $salaryNum >= 70000)) {
        $slab = 6;
        $cibilRange = '750–799';
        $salaryRange = '₹70,000–₹79,999';
        $eligibility = 'Eligible – Preferred';
    } elseif ($cibilVal >= 700 || ($cibilVal === 0 && $salaryNum >= 60000)) {
        $slab = 5;
        $cibilRange = '700–749';
        $salaryRange = '₹60,000–₹69,999';
        $eligibility = 'Eligible – Good';
    } elseif ($cibilVal >= 650 || ($cibilVal === 0 && $salaryNum >= 50000)) {
        $slab = 4;
        $cibilRange = '650–699';
        $salaryRange = '₹50,000–₹59,999';
        $eligibility = 'Eligible';
    } elseif ($cibilVal >= 600 || ($cibilVal === 0 && $salaryNum >= 40000)) {
        $slab = 3;
        $cibilRange = '600–649';
        $salaryRange = '₹40,000–₹49,999';
        $eligibility = 'Eligible';
    } elseif ($cibilVal >= 550 || ($cibilVal === 0 && $salaryNum >= 30000)) {
        $slab = 2;
        $cibilRange = '550–599';
        $salaryRange = '₹30,000–₹39,999';
        $eligibility = 'Eligible';
    } elseif ($cibilVal >= 500 || ($cibilVal === 0 && $salaryNum >= 20000)) {
        $slab = 1;
        $cibilRange = '500–549';
        $salaryRange = '₹20,000–₹29,999';
        $eligibility = 'Eligible – Base';
    } else {
        $slab = 0;
        $cibilRange = !empty($cibilStr) && $cibilStr !== '—' ? $cibilStr : '—';
        $salaryRange = 'Under ₹20,000';
        $eligibility = ($cibilVal === 0 && $salaryNum === 0) ? 'Incomplete / Phone Only' : 'Below Minimum Threshold';
    }

    // 750 se upar CIBIL: Rupay91. Below 750: Jhatpat Loans
    if ($cibilVal >= 750) {
        $partner = 'Rupay91';
    } elseif ($cibilVal > 0) {
        $partner = 'Jhatpat Loans';
    } else {
        if ($salaryNum >= 70000) {
            $partner = 'Rupay91';
        } elseif ($salaryNum > 0) {
            $partner = 'Jhatpat Loans';
        } else {
            $partner = 'Pending Details';
        }
    }

    if (!empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'AUTO' && $explicitCompany !== 'Pending Details') {
        $partner = trim($explicitCompany);
    }

    return [
        'slab' => $slab,
        'cibil_range' => $cibilRange,
        'salary_range' => $salaryRange,
        'eligibility' => $eligibility,
        'partner' => $partner
    ];
}

// 4. Load from Primary Data Files across possible host configurations
$rootPath = dirname(__DIR__, 2);
$leadsCandidates = array_unique([
    $rootPath . '/data/leads.json',
    $rootPath . '/crm/leads_store.json',
    $rootPath . '/admin/leads_store.json',
    $rootPath . '/admin/data/leads.json',
    $rootPath . '/crm/crm_subdomain_update/leads_store.json',
    $rootPath . '/deploy_update/data/leads.json',
    $rootPath . '/deploy_update/crm/leads_store.json',
    dirname(__DIR__, 1) . '/leads_store.json',
    dirname(__DIR__, 2) . '/crm/leads_store.json',
    dirname(__DIR__, 2) . '/admin/leads_store.json',
    dirname(__DIR__, 2) . '/data/leads.json',
    dirname(__DIR__, 3) . '/public_html/data/leads.json',
    dirname(__DIR__, 3) . '/public_html/crm/leads_store.json',
    dirname(__DIR__, 3) . '/public_html/admin/leads_store.json',
    __DIR__ . '/../leads_store.json',
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../crm/leads_store.json',
    __DIR__ . '/../../admin/leads_store.json'
]);

$leadsLogCandidates = array_unique([
    $rootPath . '/leads_log.csv',
    dirname(__DIR__, 1) . '/leads_log.csv',
    dirname(__DIR__, 2) . '/leads_log.csv',
    dirname(__DIR__, 3) . '/public_html/leads_log.csv',
    __DIR__ . '/../../leads_log.csv'
]);

// Load deleted leads blacklist
$deletedMap = [];
$deletedStoreCandidates = array_unique([
    $rootPath . '/crm/deleted_leads.json',
    $rootPath . '/data/deleted_leads.json',
    $rootPath . '/admin/deleted_leads.json',
    $rootPath . '/admin/api/deleted_leads.json',
    $rootPath . '/crm/api/deleted_leads.json',
    dirname(__DIR__, 1) . '/deleted_leads.json',
    dirname(__DIR__, 2) . '/crm/deleted_leads.json',
    dirname(__DIR__, 2) . '/admin/deleted_leads.json',
    dirname(__DIR__, 3) . '/public_html/crm/deleted_leads.json',
    dirname(__DIR__, 3) . '/public_html/data/deleted_leads.json',
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
                if ($cleanD !== '' && $cleanD !== '*') $deletedMap[$cleanD] = true;
            }
        }
    }
}

$allLeads = [];
$seenIds = [];
$seenPhones = [];

// Load from all valid json leads stores
foreach ($leadsCandidates as $lf) {
    if (file_exists($lf)) {
        $content = file_get_contents($lf);
        $arr = json_decode($content, true);
        if (is_array($arr)) {
            foreach ($arr as $row) {
                if (!is_array($row)) continue;
                $leadId = trim((string)($row['id'] ?? $row['lead_id'] ?? $row['loanNo'] ?? ''));
                $lIdLower = strtolower($leadId);
                $lPhone = preg_replace('/\D/', '', (string)($row['phone'] ?? $row['mobile'] ?? ''));
                if (strlen($lPhone) > 10) $lPhone = substr($lPhone, -10);

                // Check deleted map by lead ID or phone
                if ($lIdLower && !empty($deletedMap[$lIdLower])) continue;
                if ($lPhone && !empty($deletedMap[$lPhone])) continue;

                // Live Launch Cutoff: exclude pre-launch testing records created before 12 Sep 2026 IST
                $rowCreated = $row['created_at'] ?? $row['created'] ?? $row['date'] ?? '';
                if (!empty($rowCreated)) {
                    $rowTs = strtotime($rowCreated);
                    if ($rowTs !== false && $rowTs > 0 && $rowTs < 1789151400) {
                        continue;
                    }
                }

                if ($leadId && !empty($seenIds[$leadId])) continue;

                if (empty($leadId)) {
                    $leadId = 'PIM-' . rand(100000, 999999);
                }
                $row['id'] = $leadId;
                $row['loanNo'] = $leadId;
                $row['lead_id'] = $leadId;
                if ($lPhone) {
                    $row['phone'] = $lPhone;
                    $row['mobile'] = '+91 ' . $lPhone;
                    $seenPhones[$lPhone] = true;
                }
                $allLeads[] = $row;
                $seenIds[$leadId] = true;
            }
        }
    }
}

// Also sync live leads from Render Cloud database
if (function_exists('curl_init')) {
    $ch = curl_init('https://paisainminutes.onrender.com/api/loan-applications/all');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $renderJson = curl_exec($ch);
    curl_close($ch);
    if ($renderJson) {
        $renderData = json_decode($renderJson, true);
        $renderList = is_array($renderData) ? ($renderData['applications'] ?? $renderData['leads'] ?? $renderData) : [];
        if (is_array($renderList)) {
            foreach ($renderList as $rItem) {
                if (!is_array($rItem)) continue;
                $rPhone = preg_replace('/\D/', '', (string)($rItem['phone'] ?? $rItem['phoneNumber'] ?? $rItem['mobile'] ?? ''));
                if (strlen($rPhone) > 10) $rPhone = substr($rPhone, -10);
                if (strlen($rPhone) !== 10) continue;
                
                $rId = (string)($rItem['id'] ?? ('PIM-' . rand(100000, 999999)));
                $rIdLower = strtolower($rId);
                if (!empty($deletedMap[$rIdLower])) continue;
                if (!empty($deletedMap[$rPhone])) continue;
                if (!empty($seenIds[$rId])) continue;

                // Live Launch Cutoff: exclude pre-launch testing records created before 12 Sep 2026 IST
                $rCreatedAt = $rItem['createdAt'] ?? $rItem['created_at'] ?? '';
                if (!empty($rCreatedAt)) {
                    $rTs = strtotime($rCreatedAt);
                    if ($rTs !== false && $rTs > 0 && $rTs < 1789151400) {
                        continue;
                    }
                }
                
                $rName = trim((string)($rItem['name'] ?? 'Applicant'));
                $cleanLoan = (int)($rItem['amount'] ?? 0);
                $cleanSalary = (int)($rItem['monthlyIncome'] ?? 0);
                $isPhoneOnly = ($rName === 'Applicant' || empty($rName)) && $cleanLoan === 0 && $cleanSalary === 0;

                $allLeads[] = [
                    'id'                => $rId,
                    'loanNo'            => $rId,
                    'lead_id'           => $rId,
                    'name'              => $rName ?: 'Applicant',
                    'fullName'          => $rName ?: 'Applicant',
                    'phone'             => $rPhone,
                    'mobile'            => '+91 ' . $rPhone,
                    'email'             => !empty($rItem['email']) && strpos($rItem['email'], '@paisainminutes.com') === false ? $rItem['email'] : '—',
                    'loanAmount'        => $cleanLoan,
                    'applied'           => $cleanLoan,
                    'salary'            => $cleanSalary,
                    'monthlySalary'     => $cleanSalary,
                    'cibil'             => $rItem['cibil'] ?? '—',
                    'source'            => $isPhoneOnly ? 'Apply Now (Phone Only)' : 'Render API / Loan App',
                    'status'            => $rItem['status'] ?? 'Fresh',
                    'assignedCompany'   => $isPhoneOnly ? 'Pending Details' : ($cleanSalary >= 30000 ? 'Rupay91' : 'Rupaysure'),
                    'eligibilityStatus' => $isPhoneOnly ? 'Incomplete / Phone Only' : 'Eligible',
                    'created_at'        => (function() use ($rItem) {
                        if (!empty($rItem['createdAt'])) {
                            try {
                                $dt = new DateTime($rItem['createdAt']);
                                $dt->setTimezone(new DateTimeZone('Asia/Kolkata'));
                                return $dt->format('Y-m-d H:i:s');
                            } catch (Exception $e) {}
                        }
                        return date('Y-m-d H:i:s');
                    })(),
                    'created'           => (function() use ($rItem) {
                        if (!empty($rItem['createdAt'])) {
                            try {
                                $dt = new DateTime($rItem['createdAt']);
                                $dt->setTimezone(new DateTimeZone('Asia/Kolkata'));
                                return $dt->format('d M Y, h:i A');
                            } catch (Exception $e) {}
                        }
                        return date('d M Y, h:i A');
                    })()
                ];
                $seenIds[$rId] = true;
                $seenPhones[$rPhone] = true;
            }
        }
    }
}

// Also load from leads_log.csv and merge any records not already in list
foreach ($leadsLogCandidates as $leadsLogCsv) {
    if (file_exists($leadsLogCsv)) {
        $csvData = array_map('str_getcsv', file($leadsLogCsv));
        if (is_array($csvData) && count($csvData) > 1) {
            $headers = array_shift($csvData);
            foreach ($csvData as $row) {
                if (count($row) >= 4) {
                    // Extract phone number from row
                    $cleanPhone = '';
                    foreach ($row as $cell) {
                        $p = preg_replace('/\D/', '', (string)$cell);
                        if (strlen($p) === 10 && in_array($p[0], ['6','7','8','9'])) {
                            $cleanPhone = $p;
                            break;
                        }
                    }

                    if (!$cleanPhone) continue;
                    if (!empty($seenPhones[$cleanPhone])) continue;

                    $isIdFirst = (strpos((string)$row[0], 'PIM-') === 0);
                    $rowId = trim((string)($isIdFirst ? $row[0] : ('PIM-' . date('Ymd') . '-' . substr($cleanPhone, -4))));
                    $rowTimestamp = $isIdFirst ? ($row[1] ?? '') : ($row[0] ?? '');
                    $rowName = $isIdFirst ? ($row[2] ?? 'Applicant') : ($row[1] ?? 'Applicant');
                    $rowAmount = $isIdFirst ? ($row[7] ?? 50000) : ($row[4] ?? 50000);
                    $rowPartner = $isIdFirst ? ($row[6] ?? '') : ($row[5] ?? '');
                    $rowStatus = $row[count($row) - 1] ?? 'Fresh';

                    $rIdLower = strtolower($rowId);
                    if (!empty($deletedMap[$rIdLower])) continue;
                    if (!empty($deletedMap[$cleanPhone])) continue;
                    if (!empty($seenIds[$rowId])) continue;

                    // Live Launch Cutoff: exclude pre-launch testing records
                    if (!empty($rowTimestamp)) {
                        $csvTs = strtotime($rowTimestamp);
                        if ($csvTs !== false && $csvTs > 0 && $csvTs < 1789151400) {
                            continue;
                        }
                    }

                    $allLeads[] = [
                        'id'              => $rowId,
                        'loanNo'          => $rowId,
                        'lead_id'         => $rowId,
                        'name'            => $rowName ?: 'Applicant',
                        'mobile'          => '+91 ' . $cleanPhone,
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
                    $seenIds[$rowId] = true;
                    $seenPhones[$cleanPhone] = true;
                }
            }
        }
        break;
    }
}

// Consolidate deleted leads blacklist for frontend response
$deletedBlacklist = [];
$deletedBlacklistMap = [];
foreach ($deletedMap as $k => $v) {
    $strK = trim(strtolower((string)$k));
    if ($strK !== '' && strlen($strK) >= 5) {
        $deletedBlacklist[] = $strK;
        $deletedBlacklistMap[$strK] = true;
    }
}

// Deduplicate and merge by 10-digit Phone Number (1 Lead Per Applicant)
$leadsByPhone = [];
$avatarColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600'];

foreach ($allLeads as $index => $lead) {
    $leadId = $lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? ('PIM-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT));
    $lIdClean = strtolower(trim((string)$leadId));
    $phone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? $lead['phoneNumber'] ?? ''));
    if (strlen($phone) > 10) {
        $phone = substr($phone, -10);
    }

    // Skip leads that were deleted by admin (by specific Lead ID or phone)
    if (!empty($deletedBlacklistMap[$lIdClean])) {
        continue;
    }
    if ($phone && !empty($deletedBlacklistMap[$phone])) {
        continue;
    }

    // Live Launch Cutoff: exclude pre-launch testing records
    $leadTimestamp = strtotime($lead['created_at'] ?? $lead['created'] ?? $lead['date'] ?? '');
    if ($leadTimestamp !== false && $leadTimestamp > 0 && $leadTimestamp < 1789151400) {
        continue;
    }
    
    // Key for grouping: clean 10-digit phone or unique lead id
    $groupKey = (!empty($phone) && strlen($phone) === 10) ? $phone : ('ID_' . $leadId);
    $name = trim($lead['name'] ?? $lead['fullName'] ?? $lead['full_name'] ?? 'Applicant');
    if ($name === '') $name = 'Applicant';

    $rawLoan = $lead['loanAmount'] ?? $lead['applied'] ?? $lead['loan_amount'] ?? $lead['amount'] ?? 0;
    $cleanedLoan = cleanLoanAmount($rawLoan);

    $rawSalary = $lead['salary'] ?? $lead['monthlySalary'] ?? $lead['monthly_salary'] ?? $lead['income'] ?? 0;
    $salVal = $lead['sal_val'] ?? null;
    $salRange = $lead['salary_range'] ?? '';
    $cleanedSalary = cleanSalary($rawSalary, $salVal, $salRange);

    $cibil = trim($lead['cibil'] ?? $lead['cibilScore'] ?? $lead['cibil_score'] ?? $lead['cibil_range'] ?? '—');
    $explicitCompany = $lead['assignedCompany'] ?? $lead['company'] ?? $lead['partner'] ?? $lead['partner_name'] ?? '';

    $isPhoneOnly = ($name === 'Applicant' || empty($lead['name'])) && ($cleanedLoan === 0) && ($cleanedSalary === 0) && ($cibil === '—');
    
    if ($isPhoneOnly) {
        $assignedCompany = (!empty($explicitCompany) && $explicitCompany !== '—' && $explicitCompany !== 'AUTO') ? $explicitCompany : 'Pending Details';
        $eligibilityStatus = 'Incomplete / Phone Only';
    } else {
        $slabInfo = getSlabAndPartner($cibil, $cleanedSalary);
        $assignedCompany = $slabInfo['partner'];
        $eligibilityStatus = $slabInfo['eligibility'];
        if (empty($cibil) || $cibil === '—') {
            $cibil = $slabInfo['cibil_range'];
        }
    }

    $createdAt = $lead['created_at'] ?? $lead['created'] ?? $lead['date'] ?? $lead['timestamp'] ?? date('Y-m-d H:i:s');
    $formattedDate = date('d M Y, h:i A');
    $isoDate = date('Y-m-d');
    $timestamp = time();
    try {
        $dt = new DateTime($createdAt);
        $dt->setTimezone(new DateTimeZone('Asia/Kolkata'));
        $formattedDate = $dt->format('d M Y, h:i A');
        $isoDate = $dt->format('Y-m-d');
        $timestamp = $dt->getTimestamp();
    } catch (Exception $e) {
        $timestamp = strtotime($createdAt) ?: time();
        $formattedDate = date('d M Y, h:i A', $timestamp);
        $isoDate = date('Y-m-d', $timestamp);
    }
    $today = date('Y-m-d');

    $status = trim($lead['status'] ?? 'Fresh');
    if (empty($status)) $status = 'Fresh';

    $leadEmail = trim((string)($lead['email'] ?? $lead['emailAddress'] ?? '—'));
    if (strpos($leadEmail, '@paisainminutes.com') !== false || empty($leadEmail)) {
        $leadEmail = '—';
    }

    $item = [
        'id'                => $leadId,
        'loanNo'            => $leadId,
        'lead_id'           => $leadId,
        'name'              => $name,
        'fullName'          => $name,
        'phone'             => $phone,
        'mobile'            => $phone ? ('+91 ' . $phone) : '',
        'email'             => $leadEmail,
        'emailAddress'      => $leadEmail,
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
        'city'              => !empty($lead['city']) && $lead['city'] !== 'Delhi NCR' ? $lead['city'] : '—',
        'state'             => !empty($lead['state']) && $lead['state'] !== 'India' ? $lead['state'] : '—',
        'pincode'           => !empty($lead['pincode']) && $lead['pincode'] !== '110001' ? $lead['pincode'] : '—',
        'employmentType'    => $lead['employmentType'] ?? $lead['employment_type'] ?? 'Salaried',
        'assignedCompany'   => $assignedCompany,
        'eligibilityStatus' => $eligibilityStatus,
        'source'            => $lead['source'] ?? $lead['page_source'] ?? ($isPhoneOnly ? 'Apply Now (Phone Only)' : 'Check Eligibility Website'),
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
        if ($existing['salary'] === 0 && $item['salary'] > 0) {
            $existing['salary'] = $item['salary'];
            $existing['monthlySalary'] = $item['monthlySalary'];
        }
        if ($existing['email'] === '—' && $item['email'] !== '—') {
            $existing['email'] = $item['email'];
            $existing['emailAddress'] = $item['emailAddress'];
        }
        if ($existing['pincode'] === '—' && $item['pincode'] !== '—') {
            $existing['pincode'] = $item['pincode'];
        }

        // If the incoming submission is newer, update timestamps and ID to show at top
        if ($item['timestamp_num'] >= $existing['timestamp_num']) {
            $existing['id'] = $item['id'];
            $existing['loanNo'] = $item['loanNo'];
            $existing['lead_id'] = $item['lead_id'];
            $existing['created'] = $item['created'];
            $existing['created_at'] = $item['created_at'];
            $existing['date'] = $item['date'];
            $existing['timestamp_num'] = $item['timestamp_num'];
            if (!empty($item['status'])) $existing['status'] = $item['status'];
            if ($item['source'] !== 'Apply Now (Phone Only)') {
                $existing['source'] = $item['source'];
            }
            if ($item['name'] !== 'Applicant' && !empty($item['name'])) {
                $existing['name'] = $item['name'];
                $existing['fullName'] = $item['fullName'];
            }
            if ($item['loanAmount'] > 0) {
                $existing['loanAmount'] = $item['loanAmount'];
                $existing['applied'] = $item['applied'];
            }
            if ($item['salary'] > 0) {
                $existing['salary'] = $item['salary'];
                $existing['monthlySalary'] = $item['monthlySalary'];
            }
            if (!empty($item['assignedCompany']) && $item['assignedCompany'] !== 'Pending Details') {
                $existing['assignedCompany'] = $item['assignedCompany'];
            }
            if (!empty($item['eligibilityStatus']) && $item['eligibilityStatus'] !== 'Incomplete / Phone Only') {
                $existing['eligibilityStatus'] = $item['eligibilityStatus'];
            }
        }
        $leadsByPhone[$groupKey] = $existing;
    }
}

// Load persistent overrides (status and company re-assignments)
$overrideCandidates = array_unique([
    __DIR__ . '/../leads_overrides.json',
    __DIR__ . '/../../data/leads_overrides.json',
    __DIR__ . '/../../crm/leads_overrides.json',
    dirname(__DIR__, 2) . '/data/leads_overrides.json',
    dirname(__DIR__, 2) . '/crm/leads_overrides.json',
    dirname(__DIR__, 3) . '/public_html/data/leads_overrides.json',
    dirname(__DIR__, 3) . '/public_html/crm/leads_overrides.json'
]);
$mergedOverrides = [];
foreach ($overrideCandidates as $of) {
    if (file_exists($of)) {
        $ovData = json_decode(file_get_contents($of), true);
        if (is_array($ovData)) {
            foreach ($ovData as $k => $v) {
                $mergedOverrides[strtolower(trim((string)$k))] = $v;
            }
        }
    }
}

$formattedLeads = [];
foreach ($leadsByPhone as $lead) {
    $flId = strtolower(trim((string)($lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? '')));
    $flPhone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? ''));
    if (strlen($flPhone) > 10) $flPhone = substr($flPhone, -10);

    $ov = $mergedOverrides[$flId] ?? ($flPhone ? ($mergedOverrides[$flPhone] ?? null) : null);
    if ($ov && is_array($ov)) {
        if (!empty($ov['assignedCompany'])) {
            $lead['assignedCompany'] = $ov['assignedCompany'];
            $lead['partner_name'] = $ov['assignedCompany'];
        }
        if (!empty($ov['status'])) {
            $lead['status'] = $ov['status'];
        }
        if (!empty($ov['eligibilityStatus'])) {
            $lead['eligibilityStatus'] = $ov['eligibilityStatus'];
        }
    }

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
    'deleted_blacklist' => array_values(array_unique($deletedBlacklist)),
    'leads'   => $formattedLeads
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
