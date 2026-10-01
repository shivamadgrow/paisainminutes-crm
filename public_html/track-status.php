<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$phone = isset($_REQUEST['phone']) ? trim($_REQUEST['phone']) : ($_SESSION['pim_lead_phone'] ?? '');
$phone = preg_replace('/[^0-9]/', '', $phone);
if (strlen($phone) > 10) {
    $phone = substr($phone, -10);
}

// Determine if request expects JSON
$isJsonRequest = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) 
    || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_REQUEST['format']) && $_REQUEST['format'] === 'json');

$found = false;
$leadDetails = null;
$serviceError = false;

// The application status comes from the Node server (GET /api/public/leads/status). Short timeout, no local files.
require_once __DIR__ . '/config/env.php';
$pimNodeApi = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');

if (!function_exists('pimNodeStatusLookup')) {
    function pimNodeStatusLookup($base, $phone) {
        if (!function_exists('curl_init')) {
            return ['code' => 0, 'json' => null];
        }
        $ch = curl_init($base . '/api/public/leads/status?phone=' . urlencode($phone));
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 1,
            CURLOPT_TIMEOUT => 3,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['code' => $code, 'json' => ($body === false) ? null : json_decode($body, true)];
    }
}

if (!empty($phone) && preg_match("/^[6-9]\d{9}$/", $phone)) {
    $nodeRes = pimNodeStatusLookup($pimNodeApi, $phone);
    $nodeJson = $nodeRes['json'];
    if ($nodeRes['code'] === 200 && is_array($nodeJson) && ($nodeJson['status'] ?? '') === 'success' && !empty($nodeJson['data'])) {
        $d = $nodeJson['data'];
        $submitted = $d['timeline'][0]['at'] ?? null;
        $found = true;
        $leadDetails = [
            'timestamp' => $submitted ? (new DateTime($submitted))->setTimezone(new DateTimeZone('Asia/Kolkata'))->format('Y-m-d H:i:s') : '',
            'name' => $d['name'] ?? 'Loan Applicant',
            'amount' => $d['amount'] ?? null,
            'status' => $d['status'] ?? 'Under Review',
            'reference_id' => $d['reference_id'] ?? '',
            'next_step' => $d['next_step'] ?? ''
        ];
    } elseif ($nodeRes['code'] !== 404) {
        // Node unreachable or errored: say so instead of claiming "no application"
        $serviceError = true;
    }
}

// Return JSON response if requested via AJAX or API call
if ($isJsonRequest) {
    header('Content-Type: application/json');
    if (empty($phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter your registered mobile number.']);
    } elseif (!preg_match("/^[6-9]\d{9}$/", $phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter a valid 10-digit mobile number.']);
    } elseif ($found) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Application found successfully.',
            'data' => [
                'name' => htmlspecialchars($leadDetails['name']),
                'status' => htmlspecialchars($leadDetails['status']),
                'amount' => $leadDetails['amount'] !== null ? number_format((float)$leadDetails['amount']) : '—',
                'reference_id' => strtoupper($leadDetails['reference_id']),
                'date' => $leadDetails['timestamp'] ? date('d M Y', strtotime($leadDetails['timestamp'])) : ''
            ]
        ]);
    } elseif ($serviceError) {
        http_response_code(503);
        echo json_encode(['status' => 'error', 'message' => 'Status service is temporarily unavailable. Please try again shortly.']);
    } else {
        echo json_encode([
            'status' => 'not_found',
            'message' => 'We could not find any active application registered with this mobile number.'
        ]);
    }
    exit;
}

// Otherwise, render HTML Web Page
$page_title = "Track Loan Application Status | Paisa in Minutes";
$page_description = "Track your instant personal loan application status online with Paisa in Minutes. Real-time updates on NBFC approval and disbursal.";
include 'includes/header.php';
?>

<style>
.track-hero {
    background: var(--gradient-primary);
    padding: 7rem 0 4rem 0;
    color: var(--white);
    text-align: center;
}
.track-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    padding: 2.5rem;
    max-width: 650px;
    margin: -3rem auto 4rem auto;
    position: relative;
    z-index: 10;
}
.status-badge {
    display: inline-block;
    padding: 0.4rem 1.2rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.status-submitted { background: #E0F2FE; color: #0284C7; }
.status-review { background: #FEF3C7; color: #D97706; }
.status-approved { background: #DCFCE7; color: #16A34A; }
.status-disbursed { background: #D1FAE5; color: #059669; }
</style>

<section class="track-hero">
    <div class="container">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">Track Your Application</h1>
        <p style="opacity: 0.9; font-size: 1.1rem;">Check real-time status of your loan application with Paisa in Minutes</p>
    </div>
</section>

<div class="container">
    <div class="track-card">
        <form method="GET" action="track-status" style="margin-bottom: 2rem;">
            <label for="phoneInput" style="font-weight: 700; display: block; margin-bottom: 0.5rem; color: var(--text-dark);">Registered Mobile Number</label>
            <div style="display: flex; gap: 0.5rem;">
                <div style="position: relative; flex-grow: 1;">
                    <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-weight: 600; color: var(--text-muted);">+91</span>
                    <input type="tel" id="phoneInput" name="phone" value="<?php echo htmlspecialchars($phone); ?>" placeholder="Enter 10-digit number" pattern="[6-9][0-9]{9}" maxlength="10" required style="width: 100%; padding: 0.75rem 0.75rem 0.75rem 3rem; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-size: 1rem;">
                </div>
                <button type="submit" class="btn btn-primary" style="background: var(--accent-color); color: #fff; font-weight: 600; padding: 0.75rem 1.5rem; border: none; border-radius: var(--border-radius-sm); cursor: pointer;">Search</button>
            </div>
        </form>

        <?php if (!empty($phone) && $found && $leadDetails): ?>
            <?php
            $statusStr = strtolower($leadDetails['status']);
            $badgeClass = 'status-review';
            if (strpos($statusStr, 'approved') !== false) $badgeClass = 'status-approved';
            elseif (strpos($statusStr, 'disbursed') !== false) $badgeClass = 'status-disbursed';
            elseif (strpos($statusStr, 'submitted') !== false) $badgeClass = 'status-submitted';
            ?>
            <div style="border-top: 1px dashed var(--border-color); padding-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <span style="font-size: 0.85rem; color: var(--text-muted); display: block;">Reference ID</span>
                        <strong style="font-size: 1.25rem; color: var(--primary-color);"><?php echo htmlspecialchars($leadDetails['reference_id']); ?></strong>
                    </div>
                    <span class="status-badge <?php echo $badgeClass; ?>"><?php echo htmlspecialchars($leadDetails['status']); ?></span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--light-gray); padding: 1.25rem; border-radius: var(--border-radius-sm); margin-bottom: 1.5rem;">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Applicant Name</span>
                        <strong style="color: var(--text-dark);"><?php echo htmlspecialchars($leadDetails['name']); ?></strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Requested Amount</span>
                        <strong style="color: var(--accent-color);"><?php echo $leadDetails['amount'] !== null ? '₹' . number_format((float)$leadDetails['amount']) : '—'; ?></strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Date Submitted</span>
                        <strong style="color: var(--text-dark);"><?php echo $leadDetails['timestamp'] ? date('d M Y, h:i A', strtotime($leadDetails['timestamp'])) : '—'; ?></strong>
                    </div>
                    <div>
                        <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Mobile Number</span>
                        <strong style="color: var(--text-dark);">+91 <?php echo htmlspecialchars($phone); ?></strong>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 1.5rem;">
                    <a href="loan-offers.php?lead_id=<?php echo urlencode($leadDetails['reference_id']); ?>" class="btn btn-primary" style="background: var(--primary-color); color: #fff; padding: 0.75rem 2rem; border-radius: var(--border-radius-pill); text-decoration: none; font-weight: 600; display: inline-block;">View Pre-Approved Loan Offers &rarr;</a>
                </div>
            </div>
        <?php elseif (!empty($phone) && $serviceError): ?>
            <div style="border-top: 1px dashed var(--border-color); padding-top: 1.5rem; text-align: center;">
                <div style="background: #FEF2F2; color: #DC2626; padding: 1rem; border-radius: 8px; font-weight: 600;">
                    Status service is temporarily unavailable. Please try again in a few minutes.
                </div>
            </div>
        <?php elseif (!empty($phone)): ?>
            <div style="border-top: 1px dashed var(--border-color); padding-top: 1.5rem; text-align: center;">
                <div style="background: #FEF2F2; color: #DC2626; padding: 1rem; border-radius: 8px; font-weight: 600; margin-bottom: 1.5rem;">
                    No active application found for +91 <?php echo htmlspecialchars($phone); ?>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You haven't submitted a loan application yet. Apply online in 2 minutes to get instant loan approval.</p>
                <button class="btn btn-primary open-apply-modal" style="background: var(--accent-color); color: #fff; padding: 0.75rem 2rem; border-radius: var(--border-radius-pill); border: none; font-weight: 600; cursor: pointer;">Apply Now for Instant Loan</button>
            </div>
        <?php else: ?>
            <div style="text-align: center; color: var(--text-muted); font-size: 0.95rem; margin-top: 1rem;">
                Enter your 10-digit mobile number above to view your loan application status.
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>

