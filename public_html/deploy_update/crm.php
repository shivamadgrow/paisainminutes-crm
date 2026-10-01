<?php
date_default_timezone_set('Asia/Kolkata');
if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: SAMEORIGIN");
    header("X-XSS-Protection: 1; mode=block");
}
/**
 * Paisa in Minutes - Official Lead CRM & Affiliate Control Panel
 * URL: https://www.paisainminutes.com/crm
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$ADMIN_PASSWORD = 'EepAVV@*#1!oo$9'; // Super Admin passkey

// Simple Auth Handling
if (isset($_POST['admin_pass'])) {
    $submittedPass = $_POST['admin_pass'];
    if ($submittedPass === $ADMIN_PASSWORD || trim($submittedPass) === $ADMIN_PASSWORD) {
        $_SESSION['pim_admin_auth'] = true;
    } else {
        $authError = "Invalid Passcode!";
    }
}

if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['pim_admin_auth']);
    header('Location: crm');
    exit;
}

$isAuthenticated = !empty($_SESSION['pim_admin_auth']);

$dataDir = __DIR__ . '/data';
$leadsFile = $dataDir . '/leads.json';
$clicksFile = $dataDir . '/clicks.json';

// Real-Time AJAX Data Polling Endpoint
if ($isAuthenticated && isset($_GET['action']) && $_GET['action'] === 'fetch_realtime') {
    header('Content-Type: application/json');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');

    $leads = file_exists($leadsFile) ? (json_decode(file_get_contents($leadsFile), true) ?: []) : [];
    $clicks = file_exists($clicksFile) ? (json_decode(file_get_contents($clicksFile), true) ?: []) : [];

    // Filter out pre-launch test leads (created before 12 Sep 2026 IST)
    $leads = array_values(array_filter($leads, function($l) {
        $ts = strtotime($l['created_at'] ?? $l['created'] ?? $l['date'] ?? '');
        return !($ts > 0 && $ts < 1789151400);
    }));

    if (empty($leads) && file_exists(__DIR__ . '/leads_log.csv')) {
        $csvData = array_map('str_getcsv', file(__DIR__ . '/leads_log.csv'));
        if (count($csvData) > 1) {
            $header = array_shift($csvData);
            foreach ($csvData as $row) {
                if (count($row) >= 4) {
                    $rowTs = !empty($row[0]) ? strtotime($row[0]) : 0;
                    if ($rowTs > 0 && $rowTs < 1789151400) continue;
                    $leads[] = [
                        'lead_id' => 'PIM-' . rand(100000, 999999),
                        'timestamp' => $row[0] ?? '',
                        'name' => $row[1] ?? 'Applicant',
                        'phone' => $row[3] ?? '',
                        'loan_amount' => $row[4] ?? 700000,
                        'affiliate_id' => 'paisainminutes',
                        'ip_address' => $row[7] ?? '::1',
                        'status' => $row[8] ?? 'Submitted'
                    ];
                }
            }
        }
    }

    if (empty($clicks) && file_exists(__DIR__ . '/clicks_log.csv')) {
        $csvData = array_map('str_getcsv', file(__DIR__ . '/clicks_log.csv'));
        if (count($csvData) > 1) {
            $header = array_shift($csvData);
            foreach ($csvData as $row) {
                if (count($row) >= 4) {
                    $clicks[] = [
                        'click_id' => $row[0] ?? 'CLK-' . rand(100000, 999999),
                        'lead_id' => $row[1] ?? '',
                        'phone' => $row[2] ?? '',
                        'affiliate_id' => $row[3] ?? 'paisainminutes',
                        'partner_name' => $row[5] ?? 'Rupay91 Instant Loan',
                        'timestamp' => $row[7] ?? '',
                        'ip_address' => $row[8] ?? ''
                    ];
                }
            }
        }
    }

    $clickMap = [];
    foreach ($clicks as $clk) {
        if (!empty($clk['lead_id'])) $clickMap[$clk['lead_id']] = $clk;
        if (!empty($clk['phone'])) $clickMap[$clk['phone']] = $clk;
    }

    $totalLeads = count($leads);
    $totalClicks = count($clicks);
    $disbursedCount = 0;
    $totalPayout = 0;

    foreach ($leads as $ld) {
        if (isset($ld['status']) && strtolower($ld['status']) === 'disbursed') {
            $disbursedCount++;
            $totalPayout += floatval($ld['payout'] ?? 0);
        }
    }

    echo json_encode([
        'status' => 'success',
        'metrics' => [
            'totalLeads' => $totalLeads,
            'totalClicks' => $totalClicks,
            'disbursedCount' => $disbursedCount,
            'totalPayout' => $totalPayout
        ],
        'leads' => array_reverse($leads),
        'clicks' => array_reverse($clicks),
        'clickMap' => $clickMap
    ]);
    exit;
}

// Handle Lead Status Updates
if ($isAuthenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_lead_status'])) {
    $targetLeadId = trim($_POST['lead_id']);
    $newStatus = trim($_POST['new_status']);
    $partnerCompany = trim($_POST['partner_company'] ?? '');
    $disbursedAmt = floatval($_POST['disbursed_amount']);
    $payoutAmt = floatval($_POST['payout_amount']);

    if (file_exists($leadsFile)) {
        $leads = json_decode(file_get_contents($leadsFile), true) ?: [];
        foreach ($leads as &$ld) {
            if (isset($ld['lead_id']) && $ld['lead_id'] === $targetLeadId) {
                $ld['status'] = $newStatus;
                if (!empty($partnerCompany)) {
                    $ld['partner_name'] = $partnerCompany;
                }
                if ($disbursedAmt > 0) {
                    $ld['loan_amount'] = $disbursedAmt;
                }
                $ld['payout'] = $payoutAmt;
                $ld['updated_at'] = date('Y-m-d H:i:s');
            }
        }
        file_put_contents($leadsFile, json_encode($leads, JSON_PRETTY_PRINT));
        $successMsg = "Status updated for Lead #{$targetLeadId} successfully!";
    }
}

// Handle CSV Disbursal Batch Import
if ($isAuthenticated && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['import_disbursal_csv']) && isset($_FILES['disbursal_csv'])) {
    if ($_FILES['disbursal_csv']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['disbursal_csv']['tmp_name'];
        $csvRows = array_map('str_getcsv', file($tmpName));
        $updatedCount = 0;

        if (count($csvRows) > 0) {
            $leadsList = file_exists($leadsFile) ? (json_decode(file_get_contents($leadsFile), true) ?: []) : [];
            
            foreach ($csvRows as $row) {
                // Format: lead_id/phone, partner_name, disbursed_amount, payout, status
                if (count($row) >= 2) {
                    $cLeadId = trim($row[0]);
                    $cPartner = trim($row[1] ?? '');
                    $cAmt = floatval($row[2] ?? 0);
                    $cPayout = floatval($row[3] ?? 0);
                    $cStatus = !empty($row[4]) ? trim($row[4]) : 'Disbursed';

                    foreach ($leadsList as &$ld) {
                        if ((isset($ld['lead_id']) && strtolower($ld['lead_id']) === strtolower($cLeadId)) || (isset($ld['phone']) && $ld['phone'] === $cLeadId)) {
                            $ld['status'] = ucfirst($cStatus);
                            if (!empty($cPartner)) $ld['partner_name'] = $cPartner;
                            if ($cAmt > 0) $ld['loan_amount'] = $cAmt;
                            if ($cPayout > 0) $ld['payout'] = $cPayout;
                            $ld['updated_at'] = date('Y-m-d H:i:s');
                            $updatedCount++;
                        }
                    }
                }
            }
            file_put_contents($leadsFile, json_encode($leadsList, JSON_PRETTY_PRINT));
            $successMsg = "CSV Processed! Updated {$updatedCount} disbursal records successfully.";
        }
    }
}

// Load Data
$leads = file_exists($leadsFile) ? (json_decode(file_get_contents($leadsFile), true) ?: []) : [];
$clicks = file_exists($clicksFile) ? (json_decode(file_get_contents($clicksFile), true) ?: []) : [];

// Also read from leads_log.csv if leads.json is empty
if (empty($leads) && file_exists(__DIR__ . '/leads_log.csv')) {
    $csvData = array_map('str_getcsv', file(__DIR__ . '/leads_log.csv'));
    if (count($csvData) > 1) {
        $header = array_shift($csvData);
        foreach ($csvData as $row) {
            if (count($row) >= 4) {
                $leads[] = [
                    'lead_id' => 'PIM-' . rand(100000, 999999),
                    'timestamp' => $row[0] ?? '',
                    'name' => $row[1] ?? 'Applicant',
                    'phone' => $row[3] ?? '',
                    'loan_amount' => $row[4] ?? 700000,
                    'affiliate_id' => 'paisainminutes',
                    'ip_address' => $row[7] ?? '::1',
                    'status' => $row[8] ?? 'Submitted'
                ];
            }
        }
    }
}

// Also read clicks from clicks_log.csv if clicks.json empty
if (empty($clicks) && file_exists(__DIR__ . '/clicks_log.csv')) {
    $csvData = array_map('str_getcsv', file(__DIR__ . '/clicks_log.csv'));
    if (count($csvData) > 1) {
        $header = array_shift($csvData);
        foreach ($csvData as $row) {
            if (count($row) >= 4) {
                $clicks[] = [
                    'click_id' => $row[0] ?? 'CLK-' . rand(100000, 999999),
                    'lead_id' => $row[1] ?? '',
                    'phone' => $row[2] ?? '',
                    'affiliate_id' => $row[3] ?? 'paisainminutes',
                    'partner_name' => $row[5] ?? 'Rupay91 Instant Loan',
                    'timestamp' => $row[7] ?? '',
                    'ip_address' => $row[8] ?? ''
                ];
            }
        }
    }
}

// Create Click Map for matching partner click to lead
$clickMap = [];
foreach ($clicks as $clk) {
    if (!empty($clk['lead_id'])) {
        $clickMap[$clk['lead_id']] = $clk;
    }
    if (!empty($clk['phone'])) {
        $clickMap[$clk['phone']] = $clk;
    }
}

// Reverse arrays so newest appear first
$leads = array_reverse($leads);
$clicks = array_reverse($clicks);

// Metrics calculation
$totalLeads = count($leads);
$totalClicks = count($clicks);
$disbursedCount = 0;
$totalPayout = 0;

foreach ($leads as $ld) {
    if (isset($ld['status']) && strtolower($ld['status']) === 'disbursed') {
        $disbursedCount++;
        $totalPayout += floatval($ld['payout'] ?? 0);
    }
}

$siteUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-P8QSMXHR');</script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <title>Paisa in Minutes | Official Lead CRM Panel</title>
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2">
    <link rel="shortcut icon" type="image/png" href="/assets/logo.png?v=2">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png?v=2">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/logo.png?v=2">
    <link rel="apple-touch-icon" href="/assets/logo.png?v=2">
    <link rel="icon" type="image/png" href="assets/logo.png?v=2">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --bg-dark: #0b1329;
            --bg-card: #15203e;
            --text-light: #f8fafc;
            --text-muted: #94a3b8;
            --border: #233358;
            --accent-green: #10b981;
            --accent-amber: #f59e0b;
        }

        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-dark);
            color: var(--text-light);
            min-height: 100vh;
        }

        .login-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
        }

        .login-card {
            background: var(--bg-card);
            padding: 2.5rem;
            border-radius: 20px;
            border: 1px solid var(--border);
            width: 100%;
            max-width: 420px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
        }

        .login-card h2 { font-size: 1.6rem; margin-bottom: 0.5rem; font-weight: 800; color: #fff; }
        .login-card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.75rem; }

        .input-group {
            margin-bottom: 1.25rem;
            text-align: left;
        }

        .input-group label { display: block; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-muted); font-weight: 600; }
        .input-control {
            width: 100%;
            padding: 0.85rem 1rem;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: #0b1329;
            color: #fff;
            font-size: 1rem;
        }

        .btn-primary {
            width: 100%;
            padding: 0.85rem;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }

        .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }

        /* Dashboard Layout */
        .dash-header {
            background: var(--bg-card);
            border-bottom: 1px solid var(--border);
            padding: 1.25rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .dash-brand { font-size: 1.3rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .dash-brand span { color: #60a5fa; }

        .dash-container {
            padding: 2rem;
            max-width: 1450px;
            margin: 0 auto;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .metric-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 1.5rem;
            border-radius: 16px;
        }

        .metric-title { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-num { font-size: 2.2rem; font-weight: 800; margin-top: 0.5rem; color: #fff; }

        /* Tabs Navigation */
        .tab-nav {
            display: flex;
            gap: 0.5rem;
            border-bottom: 1px solid var(--border);
            margin-bottom: 1.5rem;
            overflow-x: auto;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.95rem;
            font-weight: 600;
            padding: 0.85rem 1.25rem;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            white-space: nowrap;
            transition: 0.2s;
        }

        .tab-btn.active {
            color: #60a5fa;
            border-bottom-color: #60a5fa;
        }

        .tab-content { display: none; }
        .tab-content.active { display: block; }

        /* Tables */
        .table-responsive {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.88rem;
        }

        th {
            background: #0b1329;
            color: var(--text-muted);
            font-weight: 700;
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            color: var(--text-light);
            vertical-align: middle;
        }

        tr:hover td { background: rgba(255,255,255,0.02); }

        .badge-status {
            padding: 0.3rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-block;
        }

        .badge-submitted { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
        .badge-disbursed { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .badge-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

        .partner-badge {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.8rem;
            display: inline-block;
        }

        .generator-box {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 2rem;
            border-radius: 16px;
            max-width: 650px;
        }

        .alert-bar {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid #10b981;
            color: #34d399;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }

        .btn-action {
            background: #233358;
            color: #fff;
            border: 1px solid var(--border);
            padding: 0.4rem 0.75rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.78rem;
            font-weight: 600;
            margin-right: 0.3rem;
            transition: 0.15s;
        }
        .btn-action:hover { background: #3b82f6; }

        .live-sync-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.35);
            color: #34d399;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.35rem 0.85rem;
            border-radius: 50px;
            margin-left: 0.75rem;
            letter-spacing: 0.5px;
        }

        .pulse-green {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8);
            animation: pulseGreen 1.8s infinite;
        }

        @keyframes pulseGreen {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
    </style>
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8QSMXHR"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

<?php if (!$isAuthenticated): ?>
    <!-- LOGIN FORM -->
    <div class="login-wrapper">
        <div class="login-card">
            <h2>Paisa in Minutes</h2>
            <p>Official Lead CRM & Partner Control Panel</p>

            <?php if (!empty($authError)): ?>
                <div style="color: #ef4444; margin-bottom: 1rem; font-size: 0.9rem; font-weight: 600;"><?php echo $authError; ?></div>
            <?php endif; ?>

            <form method="POST">
                <div class="input-group">
                    <label>CRM Passcode</label>
                    <input type="password" name="admin_pass" class="input-control" placeholder="Enter CRM Passcode (default: admin)" required>
                </div>
                <button type="submit" class="btn-primary">Access Lead CRM ➔</button>
            </form>
        </div>
    </div>
<?php else: ?>

    <!-- MAIN DASHBOARD -->
    <header class="dash-header">
        <div class="dash-brand">
            🏛️ Paisa <span>in Minutes</span> Lead CRM
            <span class="live-sync-badge">
                <span class="pulse-green"></span>
                REAL-TIME SYNC ACTIVE
            </span>
        </div>
        <div>
            <a href="leads_log.csv" download class="btn-primary" style="padding: 0.5rem 1rem; text-decoration: none; font-size: 0.85rem; margin-right: 0.5rem; background: #233358;">Export Leads CSV 📥</a>
            <a href="clicks_log.csv" download class="btn-primary" style="padding: 0.5rem 1rem; text-decoration: none; font-size: 0.85rem; margin-right: 0.5rem; background: #233358;">Export Clicks CSV 📥</a>
            <a href="?action=logout" style="color: #ef4444; font-size: 0.9rem; text-decoration: none; font-weight: 700; margin-left: 0.5rem;">Logout</a>
        </div>
    </header>

    <div class="dash-container">
        <?php if (!empty($successMsg)): ?>
            <div class="alert-bar"><?php echo htmlspecialchars($successMsg); ?></div>
        <?php endif; ?>

        <!-- METRICS OVERVIEW -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">Total Submitted Leads</div>
                <div class="metric-num" id="metricLeadsCount"><?php echo number_format($totalLeads); ?></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Outbound Partner Clicks</div>
                <div class="metric-num" id="metricClicksCount" style="color: #60a5fa;"><?php echo number_format($totalClicks); ?></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Loans Disbursed</div>
                <div class="metric-num" id="metricDisbursedCount" style="color: #34d399;"><?php echo number_format($disbursedCount); ?></div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Total Commission Earned</div>
                <div class="metric-num" id="metricPayoutCount" style="color: #f59e0b;">₹<?php echo number_format($totalPayout, 2); ?></div>
            </div>
        </div>

        <!-- TAB NAVIGATION -->
        <div class="tab-nav">
            <button class="tab-btn active" onclick="switchTab('leads-tab', this)">📋 All Leads CRM (<span id="tabLeadsCount"><?php echo $totalLeads; ?></span>)</button>
            <button class="tab-btn" onclick="switchTab('applynow-tab', this)">🔥 Apply Now Modal Leads (<span id="tabApplyNowCount"><?php echo $totalLeads; ?></span>)</button>
            <button class="tab-btn" onclick="switchTab('clicks-tab', this)">⚡ Outbound Partner Clicks (<span id="tabClicksCount"><?php echo $totalClicks; ?></span>)</button>
            <button class="tab-btn" onclick="switchTab('generator-tab', this)">🔗 Affiliate Link Generator</button>
            <button class="tab-btn" onclick="switchTab('postback-tab', this)">📡 S2S Webhook Integration</button>
        </div>

        <!-- TAB: APPLY NOW MODAL LEADS ONLY -->
        <div id="applynow-tab" class="tab-content">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Lead ID</th>
                            <th>Date & Time</th>
                            <th>Mobile Number</th>
                            <th>Source Tag</th>
                            <th>Partner Clicked</th>
                            <th>Referral ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="applyNowTableBody">
                        <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Loading Apply Now Modal leads...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TAB 1: CAPTURED LEADS WITH EXACT DETAILS -->
        <div id="leads-tab" class="tab-content active">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Lead ID</th>
                            <th>Date & Time</th>
                            <th>Applicant Name</th>
                            <th>Mobile Number</th>
                            <th>Email Address</th>
                            <th>Loan Range</th>
                            <th>CIBIL Score</th>
                            <th>Pincode</th>
                            <th>Partner Clicked</th>
                            <th>Referral / Affiliate ID</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="leadsTableBody">
                        <?php if (empty($leads)): ?>
                            <tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 2rem;">No leads recorded yet. Test by submitting a form on the website!</td></tr>
                        <?php else: ?>
                            <?php foreach ($leads as $ld): ?>
                                <?php 
                                    $ldId = $ld['lead_id'] ?? $ld['id'] ?? $ld['loanNo'] ?? '';
                                    $ph = $ld['phone'] ?? $ld['mobile'] ?? '';
                                    $createdTime = $ld['timestamp'] ?? $ld['created_at'] ?? $ld['created'] ?? $ld['date'] ?? '';
                                    $applicantName = $ld['name'] ?? $ld['fullName'] ?? 'Applicant';
                                    $applicantEmail = $ld['email'] ?? $ld['emailAddress'] ?? 'N/A';
                                    $loanDisplay = $ld['loan_amount'] ?? $ld['loanAmount'] ?? $ld['applied'] ?? '₹50,000';
                                    if (is_numeric($loanDisplay)) $loanDisplay = '₹' . number_format((float)$loanDisplay);
                                    $cibilDisplay = $ld['cibil_score'] ?? $ld['cibil'] ?? $ld['cibilScore'] ?? '—';
                                    $partnerClicked = $ld['assignedCompany'] ?? $ld['partner_name'] ?? 'No Click Yet';
                                    if (isset($clickMap[$ldId])) {
                                        $partnerClicked = $clickMap[$ldId]['partner_name'];
                                    } elseif (isset($clickMap[$ph])) {
                                        $partnerClicked = $clickMap[$ph]['partner_name'];
                                    }
                                ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($ldId); ?></strong></td>
                                    <td><small><?php echo htmlspecialchars($createdTime); ?></small></td>
                                    <td><strong><?php echo htmlspecialchars($applicantName); ?></strong></td>
                                    <td><strong style="color: #60a5fa; font-size: 0.95rem;"><?php echo htmlspecialchars($ph); ?></strong></td>
                                    <td><small><?php echo htmlspecialchars($applicantEmail); ?></small></td>
                                    <td><strong style="color: #34d399; font-size: 0.88rem;"><?php echo htmlspecialchars($loanDisplay); ?></strong></td>
                                    <td><span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; font-size: 0.82rem;"><?php echo htmlspecialchars($cibilDisplay); ?></span></td>
                                    <td><code><?php echo htmlspecialchars($ld['pincode'] ?? 'N/A'); ?></code></td>
                                    <td>
                                        <?php if ($partnerClicked !== 'No Click Yet'): ?>
                                            <span class="partner-badge">🔥 <?php echo htmlspecialchars($partnerClicked); ?></span>
                                        <?php else: ?>
                                            <span style="color: var(--text-muted); font-size: 0.8rem;">Pending Click</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span style="background: rgba(96, 165, 250, 0.15); color: #60a5fa; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700;">
                                            <?php echo htmlspecialchars($ld['affiliate_id'] ?? 'paisainminutes'); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?php 
                                            $st = strtolower($ld['status'] ?? 'submitted');
                                            $badgeClass = ($st === 'disbursed') ? 'badge-disbursed' : (($st === 'pending') ? 'badge-pending' : 'badge-submitted');
                                        ?>
                                        <span class="badge-status <?php echo $badgeClass; ?>"><?php echo htmlspecialchars(ucfirst($st)); ?></span>
                                    </td>
                                    <td>
                                        <button class="btn-action" onclick="openDetailsModal(<?php echo htmlspecialchars(json_encode(array_merge($ld, ['partner_clicked' => $partnerClicked]))); ?>)">View Profile 👁️</button>
                                        <button class="btn-action" onclick="openStatusModal('<?php echo htmlspecialchars($ldId); ?>', '<?php echo htmlspecialchars($ld['status'] ?? 'Submitted'); ?>')">Update ✏️</button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TAB 2: OUTBOUND CLICKS -->
        <div id="clicks-tab" class="tab-content">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Click ID</th>
                            <th>Date & Time</th>
                            <th>Lead ID</th>
                            <th>Partner Company</th>
                            <th>Target URL</th>
                            <th>Affiliate ID</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody id="clicksTableBody">
                        <?php if (empty($clicks)): ?>
                            <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No outbound clicks logged yet. Click "Apply Now" on Rupay91 offer to generate click history!</td></tr>
                        <?php else: ?>
                            <?php foreach ($clicks as $clk): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($clk['click_id'] ?? 'N/A'); ?></strong></td>
                                    <td><small><?php echo htmlspecialchars($clk['timestamp'] ?? ''); ?></small></td>
                                    <td><strong><?php echo htmlspecialchars($clk['lead_id'] ?? ''); ?></strong></td>
                                    <td><strong style="color: #34d399;"><?php echo htmlspecialchars($clk['partner_name'] ?? ''); ?></strong></td>
                                    <td><small style="color: #60a5fa;"><?php echo htmlspecialchars($clk['target_url'] ?? 'https://www.rupay91.com/'); ?></small></td>
                                    <td>
                                        <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700;">
                                            <?php echo htmlspecialchars($clk['affiliate_id'] ?? 'paisainminutes'); ?>
                                        </span>
                                    </td>
                                    <td><small><?php echo htmlspecialchars($clk['ip_address'] ?? ''); ?></small></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- TAB 3: AFFILIATE LINK GENERATOR -->
        <div id="generator-tab" class="tab-content">
            <div class="generator-box">
                <h3 style="margin-bottom: 1rem;">Generate Referral Link for Promoters</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Enter any promoter or referral name to create a unique tracking URL for your website domain.
                </p>

                <div class="input-group">
                    <label>Referral / Promoter Code</label>
                    <input type="text" id="affCodeInput" class="input-control" value="paisainminutes" placeholder="e.g. paisainminutes, RAHUL100" oninput="generateLink()">
                </div>

                <div class="input-group">
                    <label>Your Live Website Referral Link</label>
                    <input type="text" id="generatedLink" class="input-control" readonly value="<?php echo $siteUrl; ?>/?ref=paisainminutes" style="background: #0b1329; color: #60a5fa; font-weight: 700;">
                </div>

                <button type="button" class="btn-primary" onclick="copyLink()">Copy Link 📋</button>
            </div>
        </div>

        <!-- TAB 4: WEBHOOK POSTBACK -->
        <div id="postback-tab" class="tab-content">
            <div class="generator-box" style="max-width: 800px;">
                <h3 style="margin-bottom: 1rem;">Server-to-Server (S2S) Webhook URL</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Share this URL with lending networks so they can automatically report conversion payouts back to your CRM panel.
                </p>

                <div class="input-group">
                    <label>Webhook URL</label>
                    <input type="text" class="input-control" readonly value="<?php echo $siteUrl; ?>/postback.php?lead_id={SUB_ID}&status=disbursed&amount={LOAN_AMOUNT}&payout={COMMISSION}" style="background: #0b1329; color: #34d399; font-family: monospace;">
                </div>
            </div>
        </div>
    </div>

    <!-- VIEW FULL PROFILE MODAL -->
    <div id="detailsModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); align-items: center; justify-content: center; padding: 1rem; z-index: 1000;">
        <div style="background: var(--bg-card); padding: 2rem; border-radius: 16px; border: 1px solid var(--border); width: 100%; max-width: 500px;">
            <h3 style="margin-bottom: 1rem; color: #60a5fa;">📋 Full Lead Profile Details</h3>
            <div id="profileDetailsBody" style="line-height: 1.8; font-size: 0.95rem;"></div>
            <button type="button" class="btn-primary" onclick="closeDetailsModal()" style="margin-top: 1.5rem;">Close Profile</button>
        </div>
    </div>

    <!-- UPDATE STATUS MODAL -->
    <div id="statusModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); align-items: center; justify-content: center; padding: 1rem; z-index: 1000;">
        <div style="background: var(--bg-card); padding: 2rem; border-radius: 16px; border: 1px solid var(--border); width: 100%; max-width: 420px;">
            <h3 style="margin-bottom: 1rem;">Update Lead Status</h3>
            <form method="POST">
                <input type="hidden" name="update_lead_status" value="1">
                <input type="hidden" name="lead_id" id="modalLeadId">

                <div class="input-group">
                    <label>Lead ID</label>
                    <input type="text" id="modalLeadIdDisplay" class="input-control" readonly style="background: #0b1329;">
                </div>

                <div class="input-group">
                    <label>Status</label>
                    <select name="new_status" id="modalStatus" class="input-control">
                        <option value="Submitted">Submitted</option>
                        <option value="Pending">Pending</option>
                        <option value="Disbursed">Disbursed (Approved & Paid)</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Disbursed Loan Partner Company</label>
                    <select name="partner_company" id="modalPartnerCompany" class="input-control">
                        <option value="">Auto-Detect from Click History</option>
                        <option value="Rupay91">Rupay91</option>
                        <option value="Jhatpat Loans">Jhatpat Loans</option>
                        <option value="Borrowera">Borrowera</option>
                        <option value="Easy Fincare">Easy Fincare</option>
                        <option value="Insta Rupees">Insta Rupees</option>
                        <option value="UdhaarNow">UdhaarNow</option>
                        <option value="LoanWithin">LoanWithin</option>
                        <option value="ShubhCash">ShubhCash</option>
                        <option value="Ticket 2 Loan">Ticket 2 Loan</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Disbursed Loan Amount (₹)</label>
                    <input type="number" name="disbursed_amount" class="input-control" placeholder="e.g. 50000" value="0">
                </div>

                <div class="input-group">
                    <label>Commission Payout Earned (₹)</label>
                    <input type="number" name="payout_amount" class="input-control" placeholder="e.g. 500" value="0">
                </div>

                <div style="display: flex; gap: 0.75rem;">
                    <button type="submit" class="btn-primary">Save Changes</button>
                    <button type="button" class="btn-primary" onclick="closeModal()" style="background: #233358;">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function switchTab(tabId, btn) {
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            btn.classList.add('active');
        }

        function generateLink() {
            const code = document.getElementById('affCodeInput').value.trim() || 'paisainminutes';
            const base = window.location.origin + window.location.pathname.replace('crm.php', '').replace('crm', '');
            document.getElementById('generatedLink').value = base + '?ref=' + encodeURIComponent(code);
        }

        function copyLink() {
            const linkInput = document.getElementById('generatedLink');
            linkInput.select();
            document.execCommand('copy');
            alert('Referral link copied to clipboard!');
        }

        function openDetailsModal(ld) {
            const body = document.getElementById('profileDetailsBody');
            const cleanPhone = (ld.phone || '').replace(/[^0-9]/g, '');
            const waMsg = encodeURIComponent(`Hello! Paisa in Minutes se follow-up kar rahe hain. Aapne ${ld.partner_clicked || 'Personal Loan'} ke liye application bhari thi. Kya aapka loan approval process complete ho gaya ya koi assist ki zaroorat hai?`);

            body.innerHTML = `
                <p><strong>Lead Reference ID:</strong> ${ld.lead_id || 'N/A'}</p>
                <p><strong>Applicant Name:</strong> ${ld.name || 'Applicant'}</p>
                <p><strong>Mobile Number:</strong> +91 ${ld.phone || ''}</p>
                <p><strong>Email Address:</strong> ${ld.email || 'N/A'}</p>
                <p><strong>Requested Loan Amount:</strong> <span style="color:#34d399; font-weight:bold;">${ld.loan_amount || '₹50,000 - ₹1,00,000'}</span></p>
                <p><strong>CIBIL Score:</strong> <span style="color:#f59e0b; font-weight:bold;">${ld.cibil_score || 'N/A'}</span></p>
                <p><strong>Pincode:</strong> ${ld.pincode || 'N/A'}</p>
                <p><strong>Clicked Loan Partner:</strong> <span style="color:#34d399; font-weight:bold;">${ld.partner_clicked || 'No Click Recorded'}</span></p>
                <p><strong>Referral Code:</strong> ${ld.affiliate_id || 'paisainminutes'}</p>
                <p><strong>Submission Date:</strong> ${ld.timestamp || ''}</p>
                <p><strong>User IP Address:</strong> ${ld.ip_address || '::1'}</p>
                <p><strong>Application Status:</strong> ${ld.status || 'Submitted'}</p>
                
                <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem;">
                    <a href="https://wa.me/91${cleanPhone}?text=${waMsg}" target="_blank" rel="noopener" class="btn-primary" style="background:#25d366; text-decoration:none; text-align:center; padding:0.65rem 1rem; font-size:0.88rem;">
                        WhatsApp Follow Up 💬
                    </a>
                    <a href="tel:+91${cleanPhone}" class="btn-primary" style="background:#3b82f6; text-decoration:none; text-align:center; padding:0.65rem 1rem; font-size:0.88rem;">
                        Direct Call 📞
                    </a>
                </div>
            `;
            document.getElementById('detailsModal').style.display = 'flex';
        }

        function closeDetailsModal() {
            document.getElementById('detailsModal').style.display = 'none';
        }

        function openStatusModal(leadId, currentStatus) {
            document.getElementById('modalLeadId').value = leadId;
            document.getElementById('modalLeadIdDisplay').value = leadId;
            document.getElementById('modalStatus').value = currentStatus;
            document.getElementById('statusModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('statusModal').style.display = 'none';
        }

        // --- REAL-TIME LIVE POLLING SYSTEM (Every 3 seconds) ---
        let currentLeadsCount = <?php echo count($leads); ?>;

        function playNotificationChime() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch(e){}
        }

        function showLiveToast(msg) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; top:20px; right:20px; background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#fff; padding:1rem 1.4rem; border-radius:14px; font-weight:bold; box-shadow:0 10px 30px rgba(0,0,0,0.4); z-index:99999; display:flex; align-items:center; gap:0.6rem;';
            toast.innerHTML = '🔔 ' + msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 4500);
        }

        function pollCRMRealtime() {
            fetch('crm.php?action=fetch_realtime')
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success' && data.metrics) {
                        // Update Metric Counters
                        document.getElementById('metricLeadsCount').innerText = Number(data.metrics.totalLeads).toLocaleString('en-IN');
                        document.getElementById('metricClicksCount').innerText = Number(data.metrics.totalClicks).toLocaleString('en-IN');
                        document.getElementById('metricDisbursedCount').innerText = Number(data.metrics.disbursedCount).toLocaleString('en-IN');
                        document.getElementById('metricPayoutCount').innerText = '₹' + Number(data.metrics.totalPayout).toLocaleString('en-IN', {minimumFractionDigits: 2});

                        document.getElementById('tabLeadsCount').innerText = data.metrics.totalLeads;
                        document.getElementById('tabClicksCount').innerText = data.metrics.totalClicks;

                        // Sound & Toast Alert on New Lead
                        if (data.metrics.totalLeads > currentLeadsCount) {
                            const diff = data.metrics.totalLeads - currentLeadsCount;
                            currentLeadsCount = data.metrics.totalLeads;
                            playNotificationChime();
                            showLiveToast(`${diff} NEW LEAD(S) RECEIVED IN REAL TIME!`);
                        }

                        // Re-render Tables
                        renderLeadsTable(data.leads, data.clickMap);
                        renderApplyNowTable(data.leads, data.clickMap);
                        renderClicksTable(data.clicks);
                    }
                })
                .catch(err => console.error('Realtime sync error:', err));
        }

        function renderLeadsTable(leads, clickMap) {
            const tbody = document.getElementById('leadsTableBody');
            if (!tbody || !leads) return;
            if (leads.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 2rem;">No leads recorded yet. Test by submitting a form on the website!</td></tr>';
                return;
            }
            let html = '';
            leads.forEach(ld => {
                const ldId = ld.lead_id || ld.id || ld.loanNo || '';
                const ph = ld.phone || ld.mobile || '';
                const createdTime = ld.timestamp || ld.created_at || ld.created || ld.date || '';
                const name = ld.name || ld.fullName || 'Applicant';
                const email = ld.email || ld.emailAddress || 'N/A';
                let loanAmt = ld.loan_amount || ld.loanAmount || ld.applied || '₹50,000';
                if (typeof loanAmt === 'number') loanAmt = '₹' + loanAmt.toLocaleString('en-IN');
                const cibil = ld.cibil_score || ld.cibil || ld.cibilScore || '—';
                const pincode = ld.pincode || 'N/A';

                let partnerClicked = ld.assignedCompany || ld.partner_name || 'No Click Yet';
                if (clickMap && clickMap[ldId]) {
                    partnerClicked = clickMap[ldId].partner_name;
                } else if (clickMap && clickMap[ph]) {
                    partnerClicked = clickMap[ph].partner_name;
                }

                const st = (ld.status || 'Fresh').toLowerCase();
                let badgeClass = 'badge-submitted';
                if (st === 'disbursed' || st === 'approved') badgeClass = 'badge-disbursed';
                else if (st === 'pending' || st === 'callback') badgeClass = 'badge-pending';

                const jsonObj = Object.assign({}, ld, {partner_clicked: partnerClicked});
                const jsonStr = JSON.stringify(jsonObj).replace(/"/g, '&quot;');

                html += `
                    <tr>
                        <td><strong>${escapeHtml(ldId)}</strong></td>
                        <td><small>${escapeHtml(createdTime)}</small></td>
                        <td><strong>${escapeHtml(name)}</strong></td>
                        <td><strong style="color: #60a5fa; font-size: 0.95rem;">${escapeHtml(ph)}</strong></td>
                        <td><small>${escapeHtml(email)}</small></td>
                        <td><strong style="color: #34d399; font-size: 0.88rem;">${escapeHtml(loanAmt)}</strong></td>
                        <td><span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 0.2rem 0.5rem; border-radius: 6px; font-weight: 700; font-size: 0.82rem;">${escapeHtml(cibil)}</span></td>
                        <td><code>${escapeHtml(pincode)}</code></td>
                        <td>
                            ${partnerClicked !== 'No Click Yet' ? `<span class="partner-badge">🔥 ${escapeHtml(partnerClicked)}</span>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">Pending Click</span>`}
                        </td>
                        <td>
                            <span style="background: rgba(96, 165, 250, 0.15); color: #60a5fa; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700;">
                                ${escapeHtml(ld.affiliate_id || 'paisainminutes')}
                            </span>
                        </td>
                        <td><span class="badge-status ${badgeClass}">${escapeHtml(capitalize(ld.status || 'Fresh'))}</span></td>
                        <td>
                            <button class="btn-action" onclick="openDetailsModal(${jsonStr})">View Profile 👁️</button>
                            <button class="btn-action" onclick="openStatusModal('${escapeHtml(ldId)}', '${escapeHtml(ld.status || 'Fresh')}')">Update ✏️</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }

        function renderApplyNowTable(leads, clickMap) {
            const tbody = document.getElementById('applyNowTableBody');
            const tabCount = document.getElementById('tabApplyNowCount');
            if (!tbody || !leads) return;

            const applyLeads = leads.filter(ld => !ld.source || ld.source.includes('Apply Now'));
            if (tabCount) tabCount.innerText = applyLeads.length;

            if (applyLeads.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No Apply Now Modal leads recorded yet. Submit a query on the website modal!</td></tr>';
                return;
            }

            let html = '';
            applyLeads.forEach(ld => {
                const ldId = ld.lead_id || '';
                const ph = ld.phone || '';
                let partnerClicked = 'No Click Yet';
                if (clickMap && clickMap[ldId]) {
                    partnerClicked = clickMap[ldId].partner_name;
                } else if (clickMap && clickMap[ph]) {
                    partnerClicked = clickMap[ph].partner_name;
                }

                const st = (ld.status || 'Submitted').toLowerCase();
                let badgeClass = 'badge-submitted';
                if (st === 'disbursed') badgeClass = 'badge-disbursed';
                else if (st === 'pending') badgeClass = 'badge-pending';

                const jsonObj = Object.assign({}, ld, {partner_clicked: partnerClicked});
                const jsonStr = JSON.stringify(jsonObj).replace(/"/g, '&quot;');

                html += `
                    <tr>
                        <td><strong>${escapeHtml(ldId)}</strong></td>
                        <td><small>${escapeHtml(ld.timestamp || '')}</small></td>
                        <td><strong style="color: #60a5fa; font-size: 0.95rem;">${escapeHtml(ph)}</strong></td>
                        <td><span style="background: rgba(16,185,129,0.15); color: #34d399; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.78rem;">🚀 Apply Now Modal</span></td>
                        <td>
                            ${partnerClicked !== 'No Click Yet' ? `<span class="partner-badge">🔥 ${escapeHtml(partnerClicked)}</span>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">Pending Click</span>`}
                        </td>
                        <td>
                            <span style="background: rgba(96, 165, 250, 0.15); color: #60a5fa; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700;">
                                ${escapeHtml(ld.affiliate_id || 'paisainminutes')}
                            </span>
                        </td>
                        <td><span class="badge-status ${badgeClass}">${escapeHtml(capitalize(ld.status || 'Submitted'))}</span></td>
                        <td>
                            <button class="btn-action" onclick="openDetailsModal(${jsonStr})">View Profile 👁️</button>
                            <button class="btn-action" onclick="openStatusModal('${escapeHtml(ldId)}', '${escapeHtml(ld.status || 'Submitted')}')">Update ✏️</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }

        function renderClicksTable(clicks) {
            const tbody = document.getElementById('clicksTableBody');
            if (!tbody || !clicks) return;
            if (clicks.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No outbound clicks logged yet. Click "Apply Now" on Rupay91 offer to generate click history!</td></tr>';
                return;
            }
            let html = '';
            clicks.forEach(clk => {
                html += `
                    <tr>
                        <td><strong>${escapeHtml(clk.click_id || 'N/A')}</strong></td>
                        <td><small>${escapeHtml(clk.timestamp || '')}</small></td>
                        <td><strong>${escapeHtml(clk.lead_id || '')}</strong></td>
                        <td><strong style="color: #34d399;">${escapeHtml(clk.partner_name || '')}</strong></td>
                        <td><small style="color: #60a5fa;">${escapeHtml(clk.target_url || 'https://www.rupay91.com/')}</small></td>
                        <td>
                            <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700;">
                                ${escapeHtml(clk.affiliate_id || 'paisainminutes')}
                            </span>
                        </td>
                        <td><small>${escapeHtml(clk.ip_address || '')}</small></td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        // Start 3-second Auto-Polling for Real-Time Sync
        setInterval(pollCRMRealtime, 3000);
    </script>
<?php endif; ?>

</body>
</html>
