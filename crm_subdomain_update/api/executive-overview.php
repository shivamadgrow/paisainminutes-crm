<?php
/**
 * Paisa in Minutes - Executive Overview & Partner Distribution API
 * Endpoint: /api/dashboard/executive-overview
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$periodType = isset($_GET['period']) ? trim(strtolower($_GET['period'])) : 'this_month';
$customStart = isset($_GET['startDate']) ? trim($_GET['startDate']) : '';
$customEnd = isset($_GET['endDate']) ? trim($_GET['endDate']) : '';

// Calculate start, end, and prior period dates
$now = new DateTime('now', new DateTimeZone('Asia/Kolkata'));
$today = clone $now;

switch ($periodType) {
    case 'last_month':
        $startDate = (clone $now)->modify('first day of last month')->setTime(0, 0, 0);
        $endDate = (clone $now)->modify('last day of last month')->setTime(23, 59, 59);
        $periodLabel = $startDate->format('F Y');
        
        $durationDays = $startDate->diff($endDate)->days + 1;
        $priorEnd = (clone $startDate)->modify('-1 second');
        $priorStart = (clone $priorEnd)->modify('-' . ($durationDays - 1) . ' days')->setTime(0, 0, 0);
        break;

    case 'this_fy':
        $curYear = (int)$now->format('Y');
        $curMonth = (int)$now->format('n');
        $fyStartYear = $curMonth >= 4 ? $curYear : ($curYear - 1);
        $startDate = new DateTime("$fyStartYear-04-01 00:00:00", new DateTimeZone('Asia/Kolkata'));
        $endDate = clone $now;
        $periodLabel = 'FY ' . $fyStartYear . '-' . substr((string)($fyStartYear + 1), -2);

        $durationDays = $startDate->diff($endDate)->days + 1;
        $priorEnd = (clone $startDate)->modify('-1 second');
        $priorStart = (clone $priorEnd)->modify('-' . ($durationDays - 1) . ' days')->setTime(0, 0, 0);
        break;

    case 'custom':
        if (!empty($customStart) && !empty($customEnd)) {
            $startDate = new DateTime($customStart . ' 00:00:00', new DateTimeZone('Asia/Kolkata'));
            $endDate = new DateTime($customEnd . ' 23:59:59', new DateTimeZone('Asia/Kolkata'));
            $periodLabel = $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y');
        } else {
            $startDate = (clone $now)->modify('first day of this month')->setTime(0, 0, 0);
            $endDate = clone $now;
            $periodLabel = $startDate->format('F Y');
        }
        $durationDays = $startDate->diff($endDate)->days + 1;
        $priorEnd = (clone $startDate)->modify('-1 second');
        $priorStart = (clone $priorEnd)->modify('-' . ($durationDays - 1) . ' days')->setTime(0, 0, 0);
        break;

    case 'this_month':
    default:
        $startDate = (clone $now)->modify('first day of this month')->setTime(0, 0, 0);
        $endDate = clone $now;
        $periodLabel = $startDate->format('F Y');

        $elapsedDays = $startDate->diff($endDate)->days + 1;
        $priorEnd = (clone $startDate)->modify('-1 second');
        $priorStart = (clone $priorEnd)->modify('-' . ($elapsedDays - 1) . ' days')->setTime(0, 0, 0);
        break;
}

// Load leads from storage files
$leads = [];
$potentialPaths = [
    __DIR__ . '/../../data/leads.json',
    __DIR__ . '/../../leads_store.json',
    __DIR__ . '/../../data/leads_store.json',
    __DIR__ . '/../data/leads.json',
    __DIR__ . '/../leads_store.json'
];

foreach ($potentialPaths as $path) {
    if (file_exists($path)) {
        $raw = file_get_contents($path);
        $decoded = json_decode($raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            $leads = $decoded;
            break;
        }
    }
}

$PARTNERS_CONFIG = [
    ['id' => 'rupay91', 'name' => 'Rupay91', 'rateStr' => '2.8%', 'ratePct' => 0.028, 'badgeClass' => 'bg-blue-50 text-blue-700 border-blue-200'],
    ['id' => 'jhatpatloans', 'name' => 'Jhatpat Loans', 'rateStr' => '2.4%', 'ratePct' => 0.024, 'badgeClass' => 'bg-emerald-50 text-emerald-700 border-emerald-200'],
    ['id' => 'instarupees', 'name' => 'Insta Rupees', 'rateStr' => '2.5%', 'ratePct' => 0.025, 'badgeClass' => 'bg-amber-50 text-amber-700 border-amber-200'],
    ['id' => 'udhaarnow', 'name' => 'UdhaarNow', 'rateStr' => '2.2%', 'ratePct' => 0.022, 'badgeClass' => 'bg-purple-50 text-purple-700 border-purple-200'],
    ['id' => 'loanwithin', 'name' => 'LoanWithin', 'rateStr' => '2.6%', 'ratePct' => 0.026, 'badgeClass' => 'bg-cyan-50 text-cyan-700 border-cyan-200'],
    ['id' => 'shubhcash', 'name' => 'ShubhCash', 'rateStr' => '2.3%', 'ratePct' => 0.023, 'badgeClass' => 'bg-teal-50 text-teal-700 border-teal-200'],
    ['id' => 'borrowera', 'name' => 'Borrowera', 'rateStr' => '2.7%', 'ratePct' => 0.027, 'badgeClass' => 'bg-rose-50 text-rose-700 border-rose-200'],
    ['id' => 'easyfincare', 'name' => 'Easy Fincare', 'rateStr' => '2.4%', 'ratePct' => 0.024, 'badgeClass' => 'bg-orange-50 text-orange-700 border-orange-200']
];

function cleanLoanAmount($amt) {
    if (empty($amt)) return 50000;
    $num = floatval(preg_replace('/[^\d.]/', '', (string)$amt));
    return ($num > 0 && $num <= 10000000) ? $num : 50000;
}

function parseLeadDate($lead) {
    $raw = $lead['created_at'] ?? $lead['createdAt'] ?? $lead['created'] ?? $lead['date'] ?? null;
    if (!$raw) return null;
    try {
        return new DateTime($raw, new DateTimeZone('Asia/Kolkata'));
    } catch (Exception $e) {
        return null;
    }
}

// Filter leads into Current Period and Prior Period
$currentLeads = [];
$priorLeads = [];

foreach ($leads as $l) {
    $leadDt = parseLeadDate($l);
    if (!$leadDt) {
        $currentLeads[] = $l;
        continue;
    }
    if ($leadDt >= $startDate && $leadDt <= $endDate) {
        $currentLeads[] = $l;
    } elseif ($leadDt >= $priorStart && $leadDt <= $priorEnd) {
        $priorLeads[] = $l;
    }
}

// Compute Current Period Metrics
$totalLeads = count($currentLeads);
$totalApproved = 0;
$appliedVolume = 0;
$totalCommissionEarned = 0;

$partnerMap = [];
foreach ($PARTNERS_CONFIG as $p) {
    $partnerMap[$p['id']] = [
        'id' => $p['id'],
        'name' => $p['name'],
        'ratePct' => $p['ratePct'],
        'rateStr' => $p['rateStr'],
        'badgeClass' => $p['badgeClass'],
        'leads' => 0,
        'volume' => 0,
        'approved' => 0,
        'commission' => 0
    ];
}

foreach ($currentLeads as $l) {
    $assigned = strtolower(preg_replace('/[\s\-_]/', '', $l['assignedCompany'] ?? ''));
    $st = strtolower($l['status'] ?? '');
    $amt = cleanLoanAmount($l['loanAmount'] ?? $l['applied'] ?? 50000);
    $isApproved = ($st === 'approved' || $st === 'disbursed');

    $appliedVolume += $amt;
    if ($isApproved) {
        $totalApproved++;
    }

    $matchedPartnerId = null;
    foreach ($PARTNERS_CONFIG as $p) {
        $cleanId = $p['id'];
        $cleanName = strtolower(preg_replace('/[\s\-_]/', '', $p['name']));
        if ($assigned === $cleanId || $assigned === $cleanName || strpos($assigned, $cleanId) !== false) {
            $matchedPartnerId = $cleanId;
            break;
        }
    }
    if (!$matchedPartnerId) {
        $matchedPartnerId = 'rupay91';
    }

    $partnerMap[$matchedPartnerId]['leads']++;
    $partnerMap[$matchedPartnerId]['volume'] += $amt;
    if ($isApproved) {
        $partnerMap[$matchedPartnerId]['approved']++;
        $comm = round($amt * $partnerMap[$matchedPartnerId]['ratePct']);
        $partnerMap[$matchedPartnerId]['commission'] += $comm;
        $totalCommissionEarned += $comm;
    }
}

// Compute Prior Period Metrics for Trends
$priorTotalLeads = count($priorLeads);
$priorTotalApproved = 0;
$priorAppliedVolume = 0;
$priorCommissionEarned = 0;

foreach ($priorLeads as $l) {
    $st = strtolower($l['status'] ?? '');
    $amt = cleanLoanAmount($l['loanAmount'] ?? $l['applied'] ?? 50000);
    $priorAppliedVolume += $amt;
    if ($st === 'approved' || $st === 'disbursed') {
        $priorTotalApproved++;
        $priorCommissionEarned += round($amt * 0.025);
    }
}

function calcTrend($current, $prior) {
    if ($prior <= 0) {
        return null;
    }
    $pct = (($current - $prior) / $prior) * 100;
    return round($pct, 1);
}

// Build Leads Over Time Series
$daysMap = [];
$periodDiff = $startDate->diff($endDate)->days;
$isDaily = $periodDiff <= 62;

$cursor = clone $startDate;
while ($cursor <= $endDate) {
    $k = $isDaily ? $cursor->format('Y-m-d') : $cursor->format('Y-W');
    $label = $isDaily ? $cursor->format('d M') : 'Wk ' . $cursor->format('W');
    if (!isset($daysMap[$k])) {
        $daysMap[$k] = [
            'date' => $label,
            'fullDate' => $cursor->format('Y-m-d'),
            'totalLeads' => 0,
            'approved' => 0
        ];
    }
    $cursor->modify('+1 day');
}

foreach ($currentLeads as $l) {
    $leadDt = parseLeadDate($l);
    $k = $leadDt ? ($isDaily ? $leadDt->format('Y-m-d') : $leadDt->format('Y-W')) : ($isDaily ? $now->format('Y-m-d') : $now->format('Y-W'));
    if (isset($daysMap[$k])) {
        $daysMap[$k]['totalLeads']++;
        $st = strtolower($l['status'] ?? '');
        if ($st === 'approved' || $st === 'disbursed') {
            $daysMap[$k]['approved']++;
        }
    }
}
$leadsOverTime = array_values($daysMap);

// Build Recent Activity Feed (8-10 items)
$recentActivity = [];
$sortedLeads = $leads;
usort($sortedLeads, function($a, $b) {
    $da = $a['created_at'] ?? $a['createdAt'] ?? $a['created'] ?? '';
    $db = $b['created_at'] ?? $b['createdAt'] ?? $b['created'] ?? '';
    return strcmp($db, $da);
});

$activitySlice = array_slice($sortedLeads, 0, 10);
foreach ($activitySlice as $idx => $l) {
    $st = strtolower($l['status'] ?? 'fresh');
    $eventType = 'New Lead';
    $eventCode = 'new_lead';
    if ($st === 'approved') {
        $eventType = 'Status Change → Approved';
        $eventCode = 'approved';
    } elseif ($st === 'disbursed') {
        $eventType = 'Loan Disbursed';
        $eventCode = 'disbursed';
    } elseif ($st === 'docs received') {
        $eventType = 'Documents Submitted';
        $eventCode = 'docs';
    } elseif ($st === 'interested') {
        $eventType = 'Customer Interested';
        $eventCode = 'interested';
    }

    $rawDt = $l['created_at'] ?? $l['createdAt'] ?? $l['created'] ?? date('c');
    $leadId = $l['id'] ?? ('L-' . (1000 + $idx));
    $leadName = $l['name'] ?? 'Applicant';

    $recentActivity[] = [
        'id' => 'act-' . $idx,
        'timestamp' => $rawDt,
        'leadRef' => (string)$leadId,
        'leadName' => $leadName,
        'partner' => $l['assignedCompany'] ?? 'Rupay91',
        'eventType' => $eventType,
        'eventCode' => $eventCode,
        'amount' => cleanLoanAmount($l['loanAmount'] ?? $l['applied'] ?? 50000)
    ];
}

$response = [
    'success' => true,
    'period' => [
        'type' => $periodType,
        'label' => $periodLabel,
        'start' => $startDate->format('Y-m-d'),
        'end' => $endDate->format('Y-m-d')
    ],
    'totalLeads' => $totalLeads,
    'totalLeadsTrend' => calcTrend($totalLeads, $priorTotalLeads),
    'totalApproved' => $totalApproved,
    'totalApprovedTrend' => calcTrend($totalApproved, $priorTotalApproved),
    'appliedVolume' => $appliedVolume,
    'appliedVolumeTrend' => calcTrend($appliedVolume, $priorAppliedVolume),
    'totalCommissionEarned' => $totalCommissionEarned,
    'totalCommissionTrend' => calcTrend($totalCommissionEarned, $priorCommissionEarned),
    'affiliatePartnerCount' => count($PARTNERS_CONFIG),
    'matchRoutingRate' => 100.0,
    'partners' => array_values($partnerMap),
    'leadsOverTime' => $leadsOverTime,
    'recentActivity' => $recentActivity
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
