<?php
/**
 * Paisa in Minutes - Partner Analytics KPI Summary Endpoint
 * Exposes real-time affiliate performance metrics and partner breakdowns
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

$period = isset($_GET['period']) ? trim($_GET['period']) : 'FY2026-27';
$asOf = isset($_GET['asOf']) ? trim($_GET['asOf']) : date('Y-m-d');

// Load leads from storage files
$leads = [];
$leadsFile = __DIR__ . '/../../data/leads.json';
if (!file_exists($leadsFile)) {
    $leadsFile = __DIR__ . '/../../leads_store.json';
}
if (!file_exists($leadsFile)) {
    $leadsFile = __DIR__ . '/../../data/leads_store.json';
}

if (file_exists($leadsFile)) {
    $raw = file_get_contents($leadsFile);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $leads = $decoded;
    }
}

$PARTNERS_CONFIG = [
    ['id' => 'rupay91', 'name' => 'Rupay91', 'rateStr' => '2.8%', 'ratePct' => 0.028, 'status' => 'Paid'],
    ['id' => 'jhatpatloans', 'name' => 'Jhatpat Loans', 'rateStr' => '2.4%', 'ratePct' => 0.024, 'status' => 'Paid'],
    ['id' => 'instarupees', 'name' => 'Insta Rupees', 'rateStr' => '2.5%', 'ratePct' => 0.025, 'status' => 'Pending'],
    ['id' => 'udhaarnow', 'name' => 'UdhaarNow', 'rateStr' => '2.2%', 'ratePct' => 0.022, 'status' => 'Paid'],
    ['id' => 'loanwithin', 'name' => 'LoanWithin', 'rateStr' => '2.6%', 'ratePct' => 0.026, 'status' => 'Pending'],
    ['id' => 'shubhcash', 'name' => 'ShubhCash', 'rateStr' => '2.3%', 'ratePct' => 0.023, 'status' => 'Paid'],
    ['id' => 'borrowera', 'name' => 'Borrowera', 'rateStr' => '2.7%', 'ratePct' => 0.027, 'status' => 'Pending'],
    ['id' => 'easyfincare', 'name' => 'Easy Fincare', 'rateStr' => '2.4%', 'ratePct' => 0.024, 'status' => 'Paid']
];

function cleanLoanAmount($amt) {
    if (empty($amt)) return 50000;
    $num = floatval(preg_replace('/[^\d.]/', '', (string)$amt));
    return ($num > 0 && $num <= 1000000) ? $num : 50000;
}

$partnerStats = [];
foreach ($PARTNERS_CONFIG as $p) {
    $pId = $p['id'];
    $pNameClean = strtolower(preg_replace('/[\s\-_]/', '', $p['name']));
    
    $pLeads = array_filter($leads, function($l) use ($pId, $pNameClean) {
        $assigned = isset($l['assignedCompany']) ? strtolower(preg_replace('/[\s\-_]/', '', $l['assignedCompany'])) : '';
        return $assigned === $pId || $assigned === $pNameClean || strpos($assigned, $pId) !== false;
    });

    $leadsSent = count($pLeads);
    $approvedLeads = array_filter($pLeads, function($l) {
        $st = isset($l['status']) ? strtolower($l['status']) : '';
        return $st === 'approved' || $st === 'disbursed';
    });
    $approved = count($approvedLeads);
    $conversionRate = $leadsSent > 0 ? round(($approved / $leadsSent) * 100, 1) : 0;
    
    $disbursal = 0;
    foreach ($approvedLeads as $al) {
        $rawAmount = isset($al['loanAmount']) ? $al['loanAmount'] : (isset($al['applied']) ? $al['applied'] : 50000);
        $disbursal += cleanLoanAmount($rawAmount);
    }
    
    $commissionEarned = round($disbursal * $p['ratePct']);

    $partnerStats[] = [
        'id' => $p['id'],
        'name' => $p['name'],
        'leadsSent' => $leadsSent,
        'approved' => $approved,
        'conversionRate' => $conversionRate,
        'disbursal' => $disbursal,
        'commissionEarned' => $commissionEarned,
        'commissionRate' => $p['rateStr'],
        'paymentStatus' => $p['status']
    ];
}

$totalLeadsSent = array_sum(array_column($partnerStats, 'leadsSent'));
$totalApproved = array_sum(array_column($partnerStats, 'approved'));
$totalDisbursal = array_sum(array_column($partnerStats, 'disbursal'));
$totalCommissionEarned = array_sum(array_column($partnerStats, 'commissionEarned'));
$conversionRate = $totalLeadsSent > 0 ? round(($totalApproved / $totalLeadsSent) * 100, 1) : 0;
$avgCommissionPerLead = $totalApproved > 0 ? round($totalCommissionEarned / $totalApproved) : 0;

$commissionReceived = 0;
$commissionPending = 0;
foreach ($partnerStats as $ps) {
    if ($ps['paymentStatus'] === 'Paid') {
        $commissionReceived += $ps['commissionEarned'];
    } else {
        $commissionPending += $ps['commissionEarned'];
    }
}

$sorted = $partnerStats;
usort($sorted, function($a, $b) {
    return $b['commissionEarned'] - $a['commissionEarned'];
});

$topPartner = [
    'name' => !empty($sorted) ? $sorted[0]['name'] : 'Rupay91',
    'amount' => !empty($sorted) ? $sorted[0]['commissionEarned'] : 0
];

echo json_encode([
    'period' => $period,
    'asOf' => $asOf,
    'totalLeadsSent' => $totalLeadsSent,
    'totalApproved' => $totalApproved,
    'totalDisbursal' => $totalDisbursal,
    'totalCommissionEarned' => $totalCommissionEarned,
    'conversionRate' => $conversionRate,
    'avgCommissionPerLead' => $avgCommissionPerLead,
    'commissionReceived' => $commissionReceived,
    'commissionPending' => $commissionPending,
    'topPartner' => $topPartner,
    'partners' => $partnerStats
], JSON_PRETTY_PRINT);
