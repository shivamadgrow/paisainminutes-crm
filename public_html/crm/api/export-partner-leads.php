<?php
/**
 * Paisa in Minutes - Partner Leads CSV Export Endpoint
 * /crm/api/export-partner-leads.php?partner_id={id}
 */

// Set Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

$webRoot = dirname(dirname(__DIR__));
require_once $webRoot . '/includes/partner_tracking_service.php';

$partnerId = isset($_GET['partner_id']) ? trim($_GET['partner_id']) : (isset($_GET['partner']) ? trim($_GET['partner']) : '');
$format = isset($_GET['format']) ? strtolower(trim($_GET['format'])) : 'csv';

if (empty($partnerId)) {
    http_response_code(400);
    echo "Missing partner_id parameter.";
    exit;
}

$partner = getPartnerBySlugOrId($partnerId);
$partnerName = $partner ? $partner['name'] : ucfirst($partnerId);
$cleanSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$partnerId));

// Fetch all leads
$leadsFile = $webRoot . '/crm/leads_store.json';
$allLeads = getJsonFileContent($leadsFile, []);
if (empty($allLeads)) {
    $allLeads = getJsonFileContent($webRoot . '/data/leads.json', []);
}

// Read overrides
$overrides = getJsonFileContent($webRoot . '/data/leads_overrides.json', []);

// Filter leads for this partner
$partnerLeads = [];
foreach ($allLeads as $lead) {
    $lid = (string)($lead['id'] ?? $lead['lead_id'] ?? $lead['loanNo'] ?? '');
    $lPhone = preg_replace('/\D/', '', (string)($lead['phone'] ?? $lead['mobile'] ?? ''));
    if (strlen($lPhone) > 10) $lPhone = substr($lPhone, -10);

    // Apply overrides
    $ov = $overrides[$lid] ?? ($overrides[$lPhone] ?? []);
    $lead = array_merge($lead, $ov);

    $assigned = (string)($lead['assignedCompany'] ?? $lead['company'] ?? '');
    $applied = (string)($lead['appliedTo'] ?? $lead['applied_to'] ?? $lead['clickedPartner'] ?? '');

    $cleanAssigned = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $assigned));
    $cleanApplied = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $applied));

    $isMatch = ($cleanAssigned === $cleanSlug || strpos($cleanAssigned, $cleanSlug) !== false)
            || ($cleanApplied === $cleanSlug || strpos($cleanApplied, $cleanSlug) !== false);

    if ($isMatch) {
        $partnerLeads[] = $lead;
    }
}

$dateStr = date('Y-m-d');
$filename = "leads_" . strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '_', $partnerName)) . "_{$dateStr}.csv";

// Save copy in data/exports/ for automated cron/daily storage
$exportDir = $webRoot . '/data/exports';
if (!is_dir($exportDir)) @mkdir($exportDir, 0755, true);
$savedCsvPath = $exportDir . '/' . $filename;

$fp = fopen('php://memory', 'w+');
// BOM for UTF-8 Excel support
fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));

// CSV Header
fputcsv($fp, [
    'Lead ID',
    'Applicant Name',
    'Mobile Number',
    'Email Address',
    'Applied Amount (INR)',
    'Monthly Salary (INR)',
    'CIBIL Score',
    'City',
    'Pincode',
    'Lead Status',
    'Applied To',
    'Application Date',
    'Partner Remarks'
]);

foreach ($partnerLeads as $l) {
    $phone = (string)($l['phone'] ?? $l['mobile'] ?? '');
    $salary = (string)($l['monthlySalary'] ?? $l['salary'] ?? '0');
    $amount = (string)($l['loanAmount'] ?? $l['applied'] ?? '0');

    fputcsv($fp, [
        $l['id'] ?? $l['lead_id'] ?? $l['loanNo'] ?? '—',
        $l['name'] ?? $l['fullName'] ?? 'Applicant',
        $phone,
        $l['email'] ?? $l['emailAddress'] ?? '—',
        $amount,
        $salary,
        $l['cibilScore'] ?? $l['cibil'] ?? '—',
        $l['city'] ?? '—',
        $l['pincode'] ?? '—',
        $l['status'] ?? 'Fresh',
        $l['appliedTo'] ?? $partnerName,
        $l['created'] ?? $l['created_at'] ?? $l['date'] ?? '—',
        $l['remarks'] ?? $l['notes'] ?? ''
    ]);
}

rewind($fp);
$csvOutput = stream_get_contents($fp);
fclose($fp);

// Save to disk
@file_put_contents($savedCsvPath, $csvOutput);

// Send to client
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

echo $csvOutput;
exit;
