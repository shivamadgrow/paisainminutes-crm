<?php
/**
 * Paisa in Minutes - Curated Loan Offers Landing Page
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/includes/affiliate_tracker.php';
$partners = require __DIR__ . '/config/partners.php';

$leadId = isset($_GET['lead_id']) ? htmlspecialchars(trim($_GET['lead_id'])) : ($_SESSION['pim_lead_id'] ?? 'PIM-' . rand(100000, 999999));
$affId = getPimAffiliateId();

// The phone number is no longer read from (or put into) the URL (F-23). It is only known after the customer's own
// lookup below, and only its last four digits are shown.
$phone = '';
$phoneLast4 = '';
$lookupNeedsAuth = false;

$userName = isset($_GET['name']) ? htmlspecialchars(trim($_GET['name'])) : ($_SESSION['pim_lead_name'] ?? 'Applicant');
$userSalaryStr = isset($_GET['salary']) ? trim($_GET['salary']) : ($_SESSION['pim_lead_salary'] ?? '');
$userCibilStr = isset($_GET['cibil']) ? trim($_GET['cibil']) : (isset($_GET['cibil_score']) ? trim($_GET['cibil_score']) : ($_SESSION['pim_lead_cibil'] ?? ''));
$userAmountStr = isset($_GET['loan_amount']) ? trim($_GET['loan_amount']) : ($_SESSION['pim_lead_amount'] ?? '₹50,000');

// Node server (single backend). The page no longer reads or writes any lead data file.
require_once __DIR__ . '/config/env.php';
$pimNodeApi = rtrim((string) getEnvVal('BACKEND_API_URL', 'https://api.paisainminutes.tech'), '/');

/**
 * Looks the applicant up on the Node server with the customer's own device login (cookie pim_at, set by
 * js/pim-auth.js). The server only answers for the login's own phone (fixes F-26 and F-10). Returns
 * ['data' => array|null, 'code' => http status]; short timeout, so the page falls back to defaults on any failure.
 */
if (!function_exists('pimNodeLeadLookup')) {
    function pimNodeLeadLookup($base, $token, $leadCode) {
        if (!function_exists('curl_init') || $token === '') {
            return ['data' => null, 'code' => 0];
        }
        $url = $base . '/api/public/leads/lookup' . ($leadCode ? '?leadCode=' . urlencode($leadCode) : '');
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 1,
            CURLOPT_TIMEOUT => 3,
            CURLOPT_HTTPHEADER => ['Accept: application/json', 'Authorization: Bearer ' . $token],
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($body === false || $code !== 200) {
            return ['data' => null, 'code' => $code];
        }
        $json = json_decode($body, true);
        $ok = is_array($json) && !empty($json['success']) && isset($json['data']) && is_array($json['data']);
        return ['data' => $ok ? $json['data'] : null, 'code' => $code];
    }
}

// The customer's data comes from the Node server with their own login. Without a login cookie the page shows
// default offers, and (if this device holds a login) asks it to refresh the cookie once and reload.
$accessCookie = isset($_COOKIE['pim_at']) ? preg_replace('/[^A-Za-z0-9._-]/', '', (string) $_COOKIE['pim_at']) : '';
$lookupLeadCode = (isset($_GET['lead_id']) && strpos((string) $_GET['lead_id'], 'PIM-') === 0) ? trim((string) $_GET['lead_id']) : '';
if ($accessCookie === '') {
    $lookupNeedsAuth = true;
} else {
    $lookup = pimNodeLeadLookup($pimNodeApi, $accessCookie, $lookupLeadCode);
    $nodeLead = $lookup['data'];
    if ($lookup['code'] === 401) {
        $lookupNeedsAuth = true;
    }
    if ($nodeLead) {
        if (!empty($nodeLead['lead_id'])) {
            $leadId = htmlspecialchars((string) $nodeLead['lead_id']);
        }
        if (!empty($nodeLead['phone_last4'])) {
            $phoneLast4 = preg_replace('/\D/', '', (string) $nodeLead['phone_last4']);
        }
        if (!empty($nodeLead['name']) && $nodeLead['name'] !== 'Applicant') {
            $userName = htmlspecialchars($nodeLead['name']);
        }
        if (!empty($nodeLead['salary'])) {
            $userSalaryStr = (string) $nodeLead['salary'];
        }

        // Bureau / CIBIL score from Node lead
        $nodeBureauScore = null;
        foreach (['bureau_score', 'bureauScore', 'cibilScore', 'cibil_score', 'cibil', 'score'] as $ckey) {
            if (isset($nodeLead[$ckey]) && $nodeLead[$ckey] !== '' && $nodeLead[$ckey] !== null) {
                if (is_numeric($nodeLead[$ckey]) && (int)$nodeLead[$ckey] >= 300 && (int)$nodeLead[$ckey] <= 900) {
                    $nodeBureauScore = (int)$nodeLead[$ckey];
                    break;
                }
            }
        }
        if ($nodeBureauScore) {
            $userCibilStr = (string)$nodeBureauScore;
            $_SESSION['pim_cibil'] = $nodeBureauScore;
            $_SESSION['pim_lead_cibil'] = (string)$nodeBureauScore;
        } elseif (!empty($nodeLead['cibil'])) {
            $userCibilStr = (string) $nodeLead['cibil'];
        }
        if (empty($_GET['loan_amount']) && !empty($nodeLead['amount'])) {
            $userAmountStr = (string) $nodeLead['amount'];
        }
    }
}

// Calculate numerical salary
if (!function_exists('parseSalaryVal')) {
    function parseSalaryVal($salaryStr) {
        if (empty($salaryStr)) return 35000;
        $str = trim((string)$salaryStr);
        if (preg_match('/(\d+(?:\.\d+)?)\s*k/i', $str, $m)) {
            return (int)((float)$m[1] * 1000);
        }
        if (preg_match('/(\d+(?:\.\d+)?)\s*lakh/i', $str, $m)) {
            return (int)((float)$m[1] * 100000);
        }
        $clean = (int)preg_replace('/[^0-9]/', '', $str);
        return $clean > 0 ? $clean : 35000;
    }
}

// Calculate numerical CIBIL score
if (!function_exists('parseCibilVal')) {
    function parseCibilVal($cibilStr) {
        if (empty($cibilStr)) return 750;
        // Prioritize exact 3-digit numeric score from CIBIL API (e.g. 724):
        if (preg_match('/\b([3-8]\d{2}|900)\b/', (string)$cibilStr, $m)) {
            return (int)$m[1];
        }
        if (preg_match('/850/i', $cibilStr)) return 850;
        if (preg_match('/800/i', $cibilStr)) return 800;
        if (preg_match('/750/i', $cibilStr)) return 750;
        if (preg_match('/700/i', $cibilStr)) return 700;
        if (preg_match('/650/i', $cibilStr)) return 650;
        if (preg_match('/600/i', $cibilStr)) return 600;
        if (preg_match('/550/i', $cibilStr)) return 550;
        if (preg_match('/500/i', $cibilStr)) return 500;
        if (preg_match('/below|no\s*credit/i', $cibilStr)) return 450;
        return 700;
    }
}

$userSalVal = parseSalaryVal($userSalaryStr);
$userCibilVal = parseCibilVal($userCibilStr);

// Resolve actual CIBIL score for display in the applicant information bar
$actualCibilScore = null;
$cibilState = 'fetching'; // default state while resolving

// 1. Direct numeric check from $userCibilStr
if (!empty($userCibilStr) && is_numeric($userCibilStr)) {
    $cVal = (int)$userCibilStr;
    if ($cVal >= 300 && $cVal <= 900) {
        $actualCibilScore = $cVal;
    }
}

// 2. Direct numeric check from $_SESSION
if (!$actualCibilScore) {
    $sessVal = $_SESSION['pim_cibil'] ?? $_SESSION['pim_lead_cibil'] ?? null;
    if (!empty($sessVal) && is_numeric($sessVal)) {
        $sVal = (int)$sessVal;
        if ($sVal >= 300 && $sVal <= 900) {
            $actualCibilScore = $sVal;
        }
    }
}

// 3. Direct numeric check from $_GET
if (!$actualCibilScore && !empty($_GET['cibil']) && is_numeric($_GET['cibil'])) {
    $gVal = (int)$_GET['cibil'];
    if ($gVal >= 300 && $gVal <= 900) {
        $actualCibilScore = $gVal;
    }
}
if (!$actualCibilScore && !empty($_GET['cibil_score']) && is_numeric($_GET['cibil_score'])) {
    $gVal = (int)$_GET['cibil_score'];
    if ($gVal >= 300 && $gVal <= 900) {
        $actualCibilScore = $gVal;
    }
}

// 4. Status check from $nodeLead
if (!empty($nodeLead) && !$actualCibilScore) {
    $nodeCibilStatus = strtolower(trim((string)($nodeLead['cibilStatus'] ?? $nodeLead['cibil_status'] ?? '')));
    if (preg_match('/timed\s*out|no\s*credit|no\s*record|failed|not\s*found|none/i', $nodeCibilStatus)) {
        $cibilState = 'not_available';
    } elseif (preg_match('/in\s*progress|fetching|pending/i', $nodeCibilStatus)) {
        $cibilState = 'fetching';
    }
}

// 5. Final state & display strings
if ($actualCibilScore) {
    $cibilState = 'available';
    $cibilDisplayText = (string)$actualCibilScore;
    $cibilValClass = 'cibil-score-val';
} elseif ($cibilState === 'not_available') {
    $cibilDisplayText = 'Not Available';
    $cibilValClass = 'cibil-unavailable';
} else {
    $cibilDisplayText = 'Fetching...';
    $cibilValClass = 'cibil-fetching';
}

// (The page used to create/update the lead in data/leads.json here. Lead creation now happens only through
// the Node intake route POST /api/public/leads, called by apply-now / check-eligibility.)

// Exact 8-Slab Mapping as requested by User
if ($userCibilVal >= 850 || ($userCibilVal === 0 && $userSalVal >= 90000)) {
    $userSlab = 8;
    $cibilDisplay = '850–900';
    $salaryDisplay = '₹90,000+';
    $eligibilityBadge = 'Eligible – Premium';
    $cibilRatingText = 'Super Prime (Top Tier)';
} elseif ($userCibilVal >= 800 || ($userCibilVal === 0 && $userSalVal >= 80000)) {
    $userSlab = 7;
    $cibilDisplay = '800–849';
    $salaryDisplay = '₹80,000–₹89,999';
    $eligibilityBadge = 'Eligible – Premium';
    $cibilRatingText = 'Excellent Credit';
} elseif ($userCibilVal >= 750 || ($userCibilVal === 0 && $userSalVal >= 70000)) {
    $userSlab = 6;
    $cibilDisplay = '750–799';
    $salaryDisplay = '₹70,000–₹79,999';
    $eligibilityBadge = 'Eligible – Preferred';
    $cibilRatingText = 'Very Good Credit';
} elseif ($userCibilVal >= 700 || ($userCibilVal === 0 && $userSalVal >= 60000)) {
    $userSlab = 5;
    $cibilDisplay = '700–749';
    $salaryDisplay = '₹60,000–₹69,999';
    $eligibilityBadge = 'Eligible – Good';
    $cibilRatingText = 'Good Credit';
} elseif ($userCibilVal >= 650 || ($userCibilVal === 0 && $userSalVal >= 50000)) {
    $userSlab = 4;
    $cibilDisplay = '650–699';
    $salaryDisplay = '₹50,000–₹59,999';
    $eligibilityBadge = 'Eligible';
    $cibilRatingText = 'Standard Credit';
} elseif ($userCibilVal >= 600 || ($userCibilVal === 0 && $userSalVal >= 40000)) {
    $userSlab = 3;
    $cibilDisplay = '600–649';
    $salaryDisplay = '₹40,000–₹49,999';
    $eligibilityBadge = 'Eligible';
    $cibilRatingText = 'Moderate Credit';
} elseif ($userCibilVal >= 550 || ($userCibilVal === 0 && $userSalVal >= 30000)) {
    $userSlab = 2;
    $cibilDisplay = '550–599';
    $salaryDisplay = '₹30,000–₹39,999';
    $eligibilityBadge = 'Eligible';
    $cibilRatingText = 'Fair Credit';
} elseif ($userCibilVal >= 500 || ($userCibilVal === 0 && $userSalVal >= 20000)) {
    $userSlab = 1;
    $cibilDisplay = '500–549';
    $salaryDisplay = '₹20,000–₹29,999';
    $eligibilityBadge = 'Eligible – Base';
    $cibilRatingText = 'Base Credit';
} else {
    $userSlab = 0;
    $cibilDisplay = 'Below 500';
    $salaryDisplay = 'Under ₹20,000';
    $eligibilityBadge = 'Below Base Threshold';
    $cibilRatingText = 'Low / No Credit';
}

// User Rule for RuPay 91:
// RuPay 91 ONLY for Minimum 750 CIBIL score.
// For all others (CIBIL < 750), show other companies (Jhatpat Loans, etc.).
$isRupay91Eligible = ($userCibilVal >= 750);

if (!function_exists('getSvgIcon')) {
    function getSvgIcon($name, $class = '', $width = 16, $height = 16) {
        $classAttr = $class ? ' class="' . htmlspecialchars($class) . '"' : '';
        switch ($name) {
            case 'flame':
                return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-4.97 0-9-3.58-9-8 0-3.5 2.5-6.5 5.5-8.5.5 1.5 1.5 2.5 3 2.5 1.5 0 2.5-1.5 2.5-3 0-1.5 2.5-3 4-3 0 2.5 2.5 4 3 6.5C22 13.5 20.5 23 12 23z"/></svg>';
            case 'zap':
                return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
            case 'briefcase':
                return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>';
        case 'academic':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>';
        case 'trophy':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.16-.4 3.86-2.15 4.39-4.39C19.08 10.63 21 8.55 21 6V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>';
        case 'lock':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
        case 'bank':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 2L3 7h18l-9-5z"/><line x1="6" y1="10" x2="6" y2="21"/><line x1="10" y1="10" x2="10" y2="21"/><line x1="14" y1="10" x2="14" y2="21"/><line x1="18" y1="10" x2="18" y2="21"/></svg>';
        case 'lightbulb':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.95 1.7 3.95.66.62 1.13 1.38 1.3 2.05"/></svg>';
        case 'star':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        case 'check':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
        case 'arrow-right':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        case 'shield-check':
            return '<svg' . $classAttr . ' width="' . $width . '" height="' . $height . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>';
        default:
            return '';
    }
}
}

include 'includes/header.php';
?>
<script>window.PIM_NEEDS_AUTH = <?php echo !empty($lookupNeedsAuth) ? 'true' : 'false'; ?>;</script>
<?php
?>

<style>
/* --- ULTRA-COMPACT HERO SECTION --- */
.site-breadcrumb-bar {
    display: none !important;
}

.offers-hero {
    position: relative;
    background: #080f28;
    background-image: 
        radial-gradient(ellipse at 50% 10%, rgba(37, 99, 235, 0.35) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 60%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, #070d24 0%, #0f1c42 50%, #152865 100%);
    color: #ffffff !important;
    padding-top: 150px;
    padding-bottom: 1.5rem;
    text-align: center;
    overflow: hidden;
}

@media (max-width: 768px) {
    .offers-hero {
        padding-top: 108px !important;
        padding-bottom: 0.6rem !important;
    }
    .hero-ambient-glow {
        display: none !important;
    }
    .hero-subtitle {
        display: none !important;
    }
    .user-badge-bar {
        margin-bottom: 0.25rem !important;
        padding: 0.18rem 0.6rem !important;
        font-size: 0.72rem !important;
    }
    .hero-title {
        font-size: 1.15rem !important;
        margin-bottom: 0.3rem !important;
        line-height: 1.25 !important;
    }
    .hero-metric-chips {
        gap: 0.3rem !important;
        margin-bottom: 0 !important;
    }
    .metric-chip {
        padding: 0.18rem 0.5rem !important;
        font-size: 0.7rem !important;
    }
    .metric-chip .chip-label {
        font-size: 0.64rem !important;
    }
}

.hero-container {
    position: relative;
    z-index: 2;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Ambient Glow Blobs */
.hero-ambient-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
}

.glow-1 {
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 250px;
    background: rgba(37, 99, 235, 0.2);
}

.glow-2 {
    bottom: 0;
    right: 10%;
    width: 300px;
    height: 200px;
    background: rgba(99, 102, 241, 0.1);
}

/* User Badge Bar */
.user-badge-bar {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.45rem;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 0.25rem 0.85rem;
    border-radius: 50px;
    font-size: 0.78rem;
    margin-bottom: 0.45rem;
    color: #ffffff !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.user-badge-bar .pulse-dot {
    width: 7px;
    height: 7px;
    background-color: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8);
    animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
    }
    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
}

.user-badge-bar .badge-icon-wrap {
    display: inline-flex;
    align-items: center;
    color: #38bdf8;
}

.user-badge-bar .ref-divider {
    color: rgba(255, 255, 255, 0.3);
}

.user-badge-bar .ref-code {
    color: #60a5fa;
    font-weight: 700;
}

.user-badge-bar .cibil-badge-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.22rem;
}

.user-badge-bar .cibil-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
}

.user-badge-bar .cibil-val {
    font-weight: 700;
    color: #34d399; /* clean vibrant emerald */
    letter-spacing: 0.01em;
    transition: all 0.2s ease;
}

.user-badge-bar .cibil-val.cibil-fetching {
    color: #38bdf8; /* sky blue while fetching */
    font-weight: 500;
}

.user-badge-bar .cibil-val.cibil-unavailable {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
}

/* Hero Main Title */
.hero-title {
    font-size: clamp(1.2rem, 3.2vw, 1.75rem) !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    margin-bottom: 0.3rem;
    line-height: 1.25;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.hero-title .highlight-text {
    background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Subtitle */
.hero-subtitle {
    font-size: 0.82rem;
    color: #cbd5e1 !important;
    max-width: 680px;
    margin: 0 auto 0.65rem;
    line-height: 1.4;
    font-weight: 400;
}

.hero-subtitle strong {
    color: #ffffff;
    font-weight: 600;
}

/* Compact Metric Chips Bar */
.hero-metric-chips {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 800px;
    margin: 0 auto;
}

.metric-chip {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 50px;
    padding: 0.28rem 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: #e2e8f0;
}

.metric-chip.accent-chip {
    background: rgba(16, 185, 129, 0.18);
    border-color: rgba(16, 185, 129, 0.4);
    color: #6ee7b7;
    font-weight: 700;
}

.metric-chip .chip-label {
    color: #94a3b8;
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.metric-chip .chip-val {
    font-weight: 700;
    color: #ffffff;
}

.metric-chip.accent-chip .chip-val {
    color: #6ee7b7;
}

/* LOAN OFFERS CONTAINER */
.offers-container {
    padding: 1.15rem 0 3.5rem;
    background-color: #f8fafc;
    min-height: 70vh;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .offers-container {
        padding: 0.5rem 0 2rem !important;
    }
    .filter-tab-bar {
        margin-bottom: 0.65rem !important;
        gap: 0.35rem !important;
    }
    .filter-tab {
        padding: 0.28rem 0.65rem !important;
        font-size: 0.74rem !important;
    }
    .partner-card {
        padding: 1.15rem 1rem !important;
        border-radius: 16px !important;
    }
    .partner-metrics,
    .loan-details {
        padding: 0.75rem 0.8rem !important;
        gap: 0.5rem !important;
        margin-bottom: 1.1rem !important;
    }
    .metric-item .metric-label {
        font-size: 0.64rem !important;
        letter-spacing: 0.4px !important;
    }
    .metric-item-amount .metric-val {
        font-size: 1.05rem !important;
    }
    .metric-item-rate .rate-prefix {
        font-size: 0.74rem !important;
    }
    .metric-item-rate .rate-combo .val-main,
    .metric-item-rate .val-main {
        font-size: 0.96rem !important;
    }
    .metric-item-rate .rate-combo .val-unit,
    .metric-item-rate .val-unit {
        font-size: 0.74rem !important;
    }
    .metric-item-tenure .metric-val .val-main {
        font-size: 0.92rem !important;
    }
}

@media (max-width: 480px) {
    .partner-card {
        padding: 1.1rem 0.85rem !important;
    }
    .partner-metrics,
    .loan-details {
        padding: 0.65rem 0.6rem !important;
        gap: 0.4rem !important;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.38fr) minmax(0, 1fr) !important;
    }
    .metric-item .metric-label {
        font-size: 0.6rem !important;
        letter-spacing: 0.25px !important;
        margin-bottom: 0.2rem !important;
    }
    .metric-item-amount .metric-val {
        font-size: 0.98rem !important;
    }
    .metric-item-rate .rate-prefix {
        font-size: 0.7rem !important;
    }
    .metric-item-rate .rate-combo .val-main,
    .metric-item-rate .val-main {
        font-size: 0.9rem !important;
    }
    .metric-item-rate .rate-combo .val-unit,
    .metric-item-rate .val-unit {
        font-size: 0.7rem !important;
    }
    .metric-item-tenure .metric-val .val-main {
        font-size: 0.85rem !important;
    }
}

@media (max-width: 360px) {
    .partner-card {
        padding: 0.95rem 0.65rem !important;
    }
    .partner-metrics,
    .loan-details {
        padding: 0.55rem 0.45rem !important;
        gap: 0.3rem !important;
    }
    .metric-item .metric-label {
        font-size: 0.56rem !important;
    }
    .metric-item-amount .metric-val {
        font-size: 0.88rem !important;
    }
    .metric-item-rate .rate-prefix {
        font-size: 0.66rem !important;
    }
    .metric-item-rate .rate-combo .val-main,
    .metric-item-rate .val-main {
        font-size: 0.84rem !important;
    }
    .metric-item-rate .rate-combo .val-unit,
    .metric-item-rate .val-unit {
        font-size: 0.66rem !important;
    }
    .metric-item-tenure .metric-val .val-main {
        font-size: 0.78rem !important;
    }
}

.offers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 440px));
    justify-content: center;
    gap: 1.75rem;
    max-width: 980px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.offers-grid.single-offer-grid {
    grid-template-columns: minmax(320px, 520px);
}

@media (max-width: 576px) {
    .offers-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
        padding: 0 0.5rem;
    }
}

/* Partner Card */
.partner-card {
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03);
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-sizing: border-box;
    width: 100%;
}

@media (max-width: 576px) {
    .partner-card {
        padding: 1.25rem 1.15rem;
        border-radius: 18px;
    }
}

.partner-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.16), 0 8px 18px -4px rgba(15, 23, 42, 0.04);
    border-color: #93c5fd;
}

.card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
    min-height: 52px;
}

.partner-logo-box {
    width: auto;
    max-width: 150px;
    height: 48px;
    background: #ffffff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    flex-shrink: 0;
}

.partner-logo-box img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
}

.card-header-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 0.35rem;
    flex-shrink: 0;
}

.card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 0.25rem 0.65rem;
    border-radius: 50px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.badge-featured {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
}

.badge-instant {
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
}

.badge-popular {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
}

.badge-trusted {
    background: #fdf2f8;
    color: #db2777;
    border: 1px solid #fbcfe8;
}

.badge-verified {
    background: #f5f3ff;
    color: #7c3aed;
    border: 1px solid #ddd6fe;
}

.partner-rating {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.76rem;
    font-weight: 700;
    color: #b45309;
    background: #fffbe6;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    border: 1px solid #fef3c7;
}

.elig-match-pill-wrap {
    margin-bottom: 1.15rem;
}

.elig-match-pill {
    padding: 0.5rem 0.85rem;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.elig-pill-premium {
    background: #ECFDF5;
    border: 1px solid #A7F3D0;
    color: #065F46;
}

.elig-pill-matched {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1D4ED8;
}

.elig-pill-base {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    color: #475569;
}

/* Perfect Align Metrics Box - Robust 3-Column Proportional Grid */
.partner-metrics,
.loan-details {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr) minmax(0, 1fr);
    gap: 0.65rem;
    background: #f8fafc;
    padding: 0.85rem 0.95rem;
    border-radius: 14px;
    margin-bottom: 1.25rem;
    border: 1px solid #e2e8f0;
    align-items: start;
    box-sizing: border-box;
    width: 100%;
}

.metric-item,
.loan-detail {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: normal;
    box-sizing: border-box;
}

.metric-item .metric-label {
    font-size: 0.68rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.metric-item .metric-val,
.loan-detail .interest-value {
    font-size: 1.08rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: normal;
}

.metric-item .metric-val.highlight {
    color: #2563eb;
}

.metric-item-amount .metric-val {
    font-size: 1.12rem;
    white-space: nowrap;
}

.metric-item-tenure .metric-val .val-main {
    font-size: 0.98rem;
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
}

/* Dedicated styling for Interest Rate Column & Natural Wrapping */
.metric-item-rate {
    min-width: 0;
}

.metric-item-rate .metric-val,
.metric-item-rate .interest-value {
    display: block;
    min-width: 0;
    line-height: 1.25;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: normal;
}

.metric-item-rate .rate-prefix {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
    letter-spacing: -0.01em;
    display: inline;
    margin-right: 0.25rem;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: normal;
}

.metric-item-rate .rate-combo {
    display: inline-block;
    white-space: nowrap; /* Ensures '0.8% / day' never breaks 'day' apart */
}

.metric-item-rate .rate-combo .val-main,
.metric-item-rate .val-main {
    font-size: 1.02rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    white-space: nowrap;
}

.metric-item-rate .rate-combo .val-unit,
.metric-item-rate .val-unit {
    font-size: 0.78rem;
    font-weight: 700;
    color: #2563eb;
    margin-left: 0.15rem;
    white-space: nowrap;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
}

.feature-list li {
    font-size: 0.86rem;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.55rem;
    font-weight: 500;
}

.feature-list li:last-child {
    margin-bottom: 0;
}

.feature-list .check-icon {
    width: 18px;
    height: 18px;
    background: #dcfce7;
    color: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.btn-apply-partner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    width: 100%;
    text-align: center;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff !important;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.85rem 1.25rem;
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
    transition: all 0.25s ease;
}

.btn-apply-partner:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(37, 99, 235, 0.38);
}

.btn-apply-partner svg {
    transition: transform 0.2s ease;
}

.btn-apply-partner:hover svg {
    transform: translateX(4px);
}
</style>

<!-- HERO PROFILE SECTION -->
<section class="offers-hero">
    <div class="hero-ambient-glow glow-1"></div>
    <div class="hero-ambient-glow glow-2"></div>
    
    <div class="container hero-container">
        <!-- User Badge Bar -->
        <div class="user-badge-bar" id="applicantInfoBar">
            <span class="pulse-dot"></span>
            <span class="applicant-name" style="font-weight: 700; color: #fff;"><?php echo !empty($userName) && $userName !== 'Applicant' ? htmlspecialchars($userName) : 'Applicant Profile'; ?></span>
            <span class="ref-divider phone-divider"<?php echo empty($phoneLast4) ? ' style="display:none;"' : ''; ?>>|</span>
            <span class="applicant-phone-wrap" id="applicantPhoneWrap"<?php echo empty($phoneLast4) ? ' style="display:none;"' : ''; ?>>+91 ******<span id="applicantPhoneLast4"><?php echo htmlspecialchars($phoneLast4); ?></span></span>
            <span class="ref-divider">|</span>
            <span class="cibil-badge-wrap" id="applicantCibilWrap">
                <span class="cibil-label">CIBIL:</span>
                <span class="cibil-val <?php echo $cibilValClass; ?>" id="applicantCibilVal" data-score="<?php echo $actualCibilScore ? htmlspecialchars((string)$actualCibilScore) : ''; ?>" data-state="<?php echo htmlspecialchars($cibilState); ?>"><?php echo htmlspecialchars($cibilDisplayText); ?></span>
            </span>
            <span class="ref-divider">|</span>
            <span class="badge-icon-wrap"><?php echo getSvgIcon('shield-check', '', 13, 13); ?></span>
            <span class="ref-code"><?php echo htmlspecialchars($leadId); ?></span>
        </div>

        <!-- Main Title -->
        <h1 class="hero-title">
            Pre-Approved Loan Offers <span class="highlight-text">Matched for You</span>
        </h1>
        
        <p class="hero-subtitle">
            Based on your profile, here are top RBI registered lenders ready to disburse funds. Compare and apply now.
        </p>


    </div>
</section>

<!-- LOAN PARTNERS GRID SECTION -->
<section class="offers-container">
    <div class="container">
        
        <!-- Category Filter Bar -->
        <div class="filter-tab-bar" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.65rem; margin-bottom: 1.25rem;">
            <button class="filter-tab active" onclick="filterOffers('all', this)" style="padding: 0.45rem 1.15rem; border-radius: 50px; border: 1.5px solid #2563EB; background: #2563EB; color: #fff; font-weight: 700; font-size: 0.84rem; cursor: pointer; transition: all 0.2s;">
                All Available Lenders
            </button>
            <button class="filter-tab" onclick="filterOffers('instant', this)" style="padding: 0.45rem 1.15rem; border-radius: 50px; border: 1.5px solid #CBD5E1; background: #fff; color: #334155; font-weight: 600; font-size: 0.84rem; cursor: pointer; transition: all 0.2s;">
                ⚡ Fast Approval Lenders
            </button>
        </div>

        <?php
        // Separate partners into Eligible and Ineligible based on customer monthly salary
        $eligiblePartners = [];
        $ineligiblePartners = [];

        foreach ($partners as $slug => $partner) {
            $minSalVal = (int)($partner['min_salary_val'] ?? 25000);
            if ($userSalVal >= $minSalVal) {
                $eligiblePartners[$slug] = $partner;
            } else {
                $ineligiblePartners[$slug] = $partner;
            }
        }
        ?>

        <!-- Eligible Pre-Approved Header Banner -->
        <?php if (!empty($eligiblePartners)): ?>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 0.85rem 1.25rem; border-radius: 14px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);">
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #10B981; color: #ffffff; font-size: 0.85rem; font-weight: 800;">✓</span>
                    <div>
                        <span style="font-weight: 800; color: #065F46; font-size: 0.98rem; display: block;">
                            Pre-Approved Offers: <?php echo count($eligiblePartners); ?> Lender(s) Matched
                        </span>
                        <span style="font-size: 0.78rem; color: #047857;">Based on your verified monthly salary of ₹<?php echo number_format($userSalVal); ?></span>
                    </div>
                </div>
                <span style="font-size: 0.82rem; font-weight: 700; color: #065F46; background: #ffffff; padding: 0.3rem 0.85rem; border-radius: 50px; border: 1px solid #A7F3D0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    Monthly Salary: ₹<?php echo number_format($userSalVal); ?>
                </span>
            </div>
        <?php else: ?>
            <div style="background: #FFFBEB; border: 1px solid #FCD34D; padding: 1.25rem; border-radius: 14px; text-align: center; margin-bottom: 2rem;">
                <p style="color: #92400E; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.35rem 0;">
                    Minimum Monthly Salary Requirement: ₹25,000
                </p>
                <p style="color: #B45309; font-size: 0.88rem; margin: 0;">
                    Currently our partner lending institutions require a minimum monthly income of ₹25,000. Please check the requirements below to unlock offers.
                </p>
            </div>
        <?php endif; ?>

        <!-- ELIGIBLE OFFERS GRID -->
        <div class="offers-grid" id="offersGridContainer">
            <?php 
            foreach ($eligiblePartners as $slug => $partner): 
                $minSalVal = $partner['min_salary_val'] ?? 20000;
                $minCibilVal = $partner['min_cibil_val'] ?? 500;

                $badgeType = $partner['badge_type'] ?? 'featured';
                $badgeIcon = $partner['badge_icon'] ?? 'flame';
                $rawBadgeText = $partner['badge_text'] ?? $partner['badge'];
                $badgeText = preg_replace('/[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]/u', '', $rawBadgeText);
                $badgeText = trim($badgeText);
                $ratingVal = preg_replace('/[^0-9.]/', '', $partner['rating'] ?? '4.9');
                $rawLogo = $partner['local_logo'] ?? ($partner['logo'] ?? '/assets/images/partners/rupay91.png');
                if (strpos($rawLogo, 'http') === 0 || strpos($rawLogo, 'data:') === 0) {
                    $localLogo = $rawLogo;
                } else {
                    $localLogo = '/' . ltrim($rawLogo, '/');
                }

                $interestRaw = (string)($partner['interest_rate'] ?? 'Up to 1.0% / day');
                $prefix = '';
                $rateVal = $interestRaw;
                $rateUnit = '';

                if (preg_match('/^(?:(Ranges\s+from\s+up\s*to|Ranges\s+from\s+upto|Ranges\s+from|Up\s*to|upto)\s*)?(.*?)\s*(?:\/|\bper\b)\s*(.*)$/i', $interestRaw, $m)) {
                    $prefix = trim($m[1] ?? '');
                    $rateVal = trim($m[2] ?? '');
                    $rateUnit = '/ ' . trim($m[3] ?? '');
                } elseif (preg_match('/^(?:(Ranges\s+from\s+up\s*to|Ranges\s+from\s+upto|Ranges\s+from|Up\s*to|upto)\s*)(.*)$/i', $interestRaw, $m)) {
                    $prefix = trim($m[1] ?? '');
                    $rateVal = trim($m[2] ?? '');
                    $rateUnit = '';
                } else {
                    $prefix = '';
                    $rateVal = $interestRaw;
                    $rateUnit = '';
                }
            ?>
                <div class="partner-card partner-offer-card" 
                     id="partner-card-<?php echo htmlspecialchars($slug); ?>"
                     data-partner-slug="<?php echo htmlspecialchars($slug); ?>"
                     data-min-salary="<?php echo $minSalVal; ?>"
                     data-min-cibil="<?php echo $minCibilVal; ?>">
                    <div>
                        <!-- Top Header Row: Brand Logo & Verified Badges -->
                        <div class="card-header-row">
                            <div class="partner-logo-box">
                                <img src="<?php echo htmlspecialchars($localLogo); ?>" 
                                     alt="<?php echo htmlspecialchars($partner['name']); ?>" 
                                     loading="lazy">
                            </div>
                            <div class="card-header-badges">
                                <div class="card-badge badge-<?php echo htmlspecialchars($badgeType); ?>">
                                    <?php echo getSvgIcon($badgeIcon, '', 12, 12); ?>
                                    <span><?php echo htmlspecialchars($badgeText); ?></span>
                                </div>
                                <div class="partner-rating">
                                    <?php echo getSvgIcon('star', '', 12, 12); ?>
                                    <span><?php echo htmlspecialchars($ratingVal ?: $partner['rating']); ?> / 5.0</span>
                                </div>
                            </div>
                        </div>

                        <!-- CIBIL & Monthly Salary Match Pill -->
                        <div class="elig-match-pill-wrap">
                            <div class="elig-match-pill elig-pill-matched">
                                <span>✓ Matched for Min Salary <?php echo htmlspecialchars($partner['min_salary']); ?>+ | CIBIL <?php echo htmlspecialchars($partner['min_cibil']); ?></span>
                            </div>
                        </div>

                        <!-- Key Metrics Box -->
                        <div class="partner-metrics loan-details">
                            <div class="metric-item loan-detail metric-item-amount">
                                <div class="metric-label">MAX LOAN</div>
                                <div class="metric-val highlight"><?php echo htmlspecialchars($partner['max_amount']); ?></div>
                            </div>
                            <div class="metric-item loan-detail metric-item-rate">
                                <div class="metric-label">INTEREST RATE</div>
                                <div class="metric-val interest-value">
                                    <?php if (!empty($prefix)): ?>
                                        <span class="rate-prefix"><?php echo htmlspecialchars($prefix); ?></span>
                                    <?php endif; ?>
                                    <span class="rate-combo">
                                        <span class="val-main"><?php echo htmlspecialchars($rateVal); ?></span>
                                        <?php if (!empty($rateUnit)): ?>
                                            <span class="val-unit"><?php echo htmlspecialchars($rateUnit); ?></span>
                                        <?php endif; ?>
                                    </span>
                                </div>
                            </div>
                            <div class="metric-item loan-detail metric-item-tenure">
                                <div class="metric-label">TENURE</div>
                                <div class="metric-val">
                                    <span class="val-main"><?php echo htmlspecialchars($partner['tenure'] ?? '30 - 45 Days'); ?></span>
                                </div>
                            </div>
                        </div>

                        <!-- Features Checklist -->
                        <ul class="feature-list">
                            <?php foreach ($partner['features'] as $feature): ?>
                                <li>
                                    <span class="check-icon"><?php echo getSvgIcon('check', '', 13, 13); ?></span>
                                    <span><?php echo htmlspecialchars($feature); ?></span>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <!-- Call To Action Button -->
                    <a href="<?php echo htmlspecialchars($pimNodeApi); ?>/api/public/redirect/<?php echo urlencode($slug); ?>?lead_id=<?php echo urlencode($leadId); ?>&ref=<?php echo urlencode($affId); ?>&source=loan_offers" 
                       target="_blank" 
                       rel="noopener"
                       class="btn-apply-partner"
                       onclick="recordOfferClick('<?php echo htmlspecialchars($slug, ENT_QUOTES); ?>', '<?php echo htmlspecialchars($leadId, ENT_QUOTES); ?>')">
                       <span>Apply Now</span>
                       <?php echo getSvgIcon('arrow-right', '', 18, 18); ?>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- INELIGIBLE / LOCKED OFFERS SECTION (Lenders requiring higher salary) -->
        <?php if (!empty($ineligiblePartners)): ?>
            <div class="ineligible-offers-wrapper" style="margin-top: 3.5rem; padding-top: 2.5rem; border-top: 2px dashed #CBD5E1;">
                <div style="text-align: center; max-width: 760px; margin: 0 auto 2rem auto;">
                    <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.75rem;">
                        🔒 Locked Offers • Income Criteria
                    </div>
                    <h2 style="font-size: clamp(1.35rem, 2.8vw, 1.85rem); font-weight: 800; color: #1E293B; margin-bottom: 0.5rem; letter-spacing: -0.01em;">
                        Other Lending Partners (Requires Higher Monthly Salary)
                    </h2>
                    <p style="color: #64748B; font-size: 0.95rem; line-height: 1.6; margin: 0;">
                        Aapki current monthly salary (<strong>₹<?php echo number_format($userSalVal); ?></strong>) ke hisab se aap neeche di gayi companies ke liye abhi eligible nahi hain. In companies ke offers unlock karne ke liye required minimum salary criteria meet hona zaroori hai.
                    </p>
                </div>

                <div class="offers-grid" id="ineligibleOffersGrid">
                    <?php 
                    foreach ($ineligiblePartners as $slug => $partner): 
                        $minSalVal = $partner['min_salary_val'] ?? 25000;
                        $shortfall = max(0, $minSalVal - $userSalVal);
                        $ratingVal = preg_replace('/[^0-9.]/', '', $partner['rating'] ?? '4.8');
                        $rawLogo = $partner['local_logo'] ?? ($partner['logo'] ?? '/assets/images/partners/rupay91.png');
                        if (strpos($rawLogo, 'http') === 0 || strpos($rawLogo, 'data:') === 0) {
                            $localLogo = $rawLogo;
                        } else {
                            $localLogo = '/' . ltrim($rawLogo, '/');
                        }

                        $interestRaw = (string)($partner['interest_rate'] ?? 'Up to 1.0% / day');
                        $prefix = '';
                        $rateVal = $interestRaw;
                        $rateUnit = '';
                        if (preg_match('/^(?:(Ranges\s+from\s+up\s*to|Ranges\s+from\s+upto|Ranges\s+from|Up\s*to|upto)\s*)?(.*?)\s*(?:\/|\bper\b)\s*(.*)$/i', $interestRaw, $m)) {
                            $prefix = trim($m[1] ?? '');
                            $rateVal = trim($m[2] ?? '');
                            $rateUnit = '/ ' . trim($m[3] ?? '');
                        } elseif (preg_match('/^(?:(Ranges\s+from\s+up\s*to|Ranges\s+from\s+upto|Ranges\s+from|Up\s*to|upto)\s*)(.*)$/i', $interestRaw, $m)) {
                            $prefix = trim($m[1] ?? '');
                            $rateVal = trim($m[2] ?? '');
                            $rateUnit = '';
                        } else {
                            $prefix = '';
                            $rateVal = $interestRaw;
                            $rateUnit = '';
                        }
                    ?>
                        <div class="partner-card partner-offer-card partner-card-locked" 
                             id="partner-card-<?php echo htmlspecialchars($slug); ?>"
                             data-partner-slug="<?php echo htmlspecialchars($slug); ?>"
                             data-min-salary="<?php echo $minSalVal; ?>"
                             style="background: #F8FAFC; border: 1.5px solid #CBD5E1; opacity: 0.92;">
                            <div>
                                <!-- Header Row with Logo and Not Eligible Badge -->
                                <div class="card-header-row">
                                    <div class="partner-logo-box" style="background: #ffffff; border-color: #E2E8F0;">
                                        <img src="<?php echo htmlspecialchars($localLogo); ?>" 
                                             alt="<?php echo htmlspecialchars($partner['name']); ?>" 
                                             loading="lazy">
                                    </div>
                                    <div class="card-header-badges">
                                        <div class="card-badge" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:-1px;"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                                            <span>Min. ₹<?php echo number_format($minSalVal); ?> Salary</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Ineligibility Notice Pill -->
                                <div class="elig-match-pill-wrap">
                                    <div class="elig-match-pill" style="background: #FFF1F2; border: 1px solid #FECDD3; color: #9F1239; font-size: 0.8rem;">
                                        <span>✕ Not Eligible (Short by ₹<?php echo number_format($shortfall); ?>/mo)</span>
                                    </div>
                                </div>

                                <!-- Key Metrics Box -->
                                <div class="partner-metrics loan-details" style="background: #ffffff; border-color: #E2E8F0;">
                                    <div class="metric-item loan-detail metric-item-amount">
                                        <div class="metric-label" style="color: #DC2626; font-weight: 700;">REQ. SALARY</div>
                                        <div class="metric-val" style="color: #DC2626; font-size: 0.95rem;">₹<?php echo number_format($minSalVal); ?>+</div>
                                    </div>
                                    <div class="metric-item loan-detail metric-item-rate">
                                        <div class="metric-label">INTEREST RATE</div>
                                        <div class="metric-val interest-value">
                                            <?php if (!empty($prefix)): ?>
                                                <span class="rate-prefix"><?php echo htmlspecialchars($prefix); ?></span>
                                            <?php endif; ?>
                                            <span class="rate-combo">
                                                <span class="val-main"><?php echo htmlspecialchars($rateVal); ?></span>
                                                <?php if (!empty($rateUnit)): ?>
                                                    <span class="val-unit"><?php echo htmlspecialchars($rateUnit); ?></span>
                                                <?php endif; ?>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="metric-item loan-detail metric-item-tenure">
                                        <div class="metric-label">TENURE</div>
                                        <div class="metric-val">
                                            <span class="val-main"><?php echo htmlspecialchars($partner['tenure'] ?? '30 - 45 Days'); ?></span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Features Checklist -->
                                <ul class="feature-list" style="opacity: 0.8;">
                                    <?php foreach ($partner['features'] as $feature): ?>
                                        <li>
                                            <span class="check-icon" style="background: #F1F5F9; color: #64748B;">✓</span>
                                            <span><?php echo htmlspecialchars($feature); ?></span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>

                            <!-- Disabled Locked Button -->
                            <div style="padding-top: 1rem; border-top: 1px solid #E2E8F0;">
                                <button type="button" 
                                        disabled 
                                        style="width: 100%; padding: 0.8rem 1rem; border-radius: 12px; background: #E2E8F0; color: #64748B; font-weight: 700; font-size: 0.92rem; border: 1px solid #CBD5E1; cursor: not-allowed; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                                    <span>Locked • Requires Min. ₹<?php echo number_format($minSalVal); ?> Salary</span>
                                </button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- REALTIME FILTER SCRIPT -->
<script>
function filterOffers(filterType, btnEl) {
    // Update active button styling
    document.querySelectorAll('.filter-tab').forEach(b => {
        b.style.background = '#fff';
        b.style.color = '#334155';
        b.style.borderColor = '#CBD5E1';
        b.classList.remove('active');
    });
    if (btnEl) {
        btnEl.style.background = '#2563EB';
        btnEl.style.color = '#fff';
        btnEl.style.borderColor = '#2563EB';
        btnEl.classList.add('active');
    }

    const cards = document.querySelectorAll('.partner-offer-card');
    cards.forEach(card => {
        const slug = card.getAttribute('data-partner-slug');
        let show = true;

        if (filterType === 'instant') {
            show = ['rupay91', 'jhatpatloans', 'borrowera', 'instarupees', 'shubhcash', 'ticket2loan'].includes(slug);
        }

        card.style.display = show ? 'flex' : 'none';
    });
}

function recordOfferClick(slug, leadId) {
    // The redirect route also records the click; this keepalive call makes sure it is logged even if the
    // new tab is slow to open. The server de-duplicates (same partner + lead + source within 10 minutes).
    try {
        fetch((window.backend_server_url || '') + '/api/public/partner-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                partner: slug,
                leadId: leadId || '',
                source: 'loan_offers'
            }),
            keepalive: true
        }).catch(() => {});
    } catch(e) {}
}
</script>

<!-- APPLICANT CIBIL SCORE SYNC SCRIPT -->
<script>
(function() {
    const cibilValEl = document.getElementById('applicantCibilVal');
    if (!cibilValEl) return;

    function applyScore(score) {
        if (!score) return false;
        const num = Number(String(score).replace(/[^\d]/g, ''));
        if (Number.isInteger(num) && num >= 300 && num <= 900) {
            cibilValEl.textContent = String(num);
            cibilValEl.className = 'cibil-val cibil-score-val';
            cibilValEl.setAttribute('data-score', String(num));
            cibilValEl.setAttribute('data-state', 'available');
            try { sessionStorage.setItem('pim_cibil', String(num)); } catch(e){}
            return true;
        }
        return false;
    }

    function applyUnavailable() {
        cibilValEl.textContent = 'Not Available';
        cibilValEl.className = 'cibil-val cibil-unavailable';
        cibilValEl.setAttribute('data-state', 'not_available');
    }

    // 1. If server already resolved valid score (e.g. 724), preserve and cache it
    const initialScore = cibilValEl.getAttribute('data-score');
    if (initialScore && applyScore(initialScore)) {
        return;
    }

    // 2. Check client session storage from current application flow
    let sessScore = null;
    let sessPhone = null;
    try {
        sessScore = sessionStorage.getItem('pim_cibil');
        sessPhone = sessionStorage.getItem('pim_cibil_phone') || sessionStorage.getItem('pim_phone');
    } catch(e) {}

    const phoneLast4El = document.getElementById('applicantPhoneLast4');
    const curLast4 = phoneLast4El ? phoneLast4El.textContent.trim() : '';

    // Verify score is linked to the current applicant
    let isLinked = true;
    if (curLast4 && sessPhone) {
        const p4 = sessPhone.replace(/\D/g, '').slice(-4);
        if (p4 && p4 !== curLast4) {
            isLinked = false;
        }
    }

    if (isLinked && sessScore && applyScore(sessScore)) {
        return;
    }

    // If phone number was missing in server response, populate from verified session
    if (!curLast4 && sessPhone) {
        const p4 = sessPhone.replace(/\D/g, '').slice(-4);
        if (p4 && phoneLast4El) {
            phoneLast4El.textContent = p4;
            const pWrap = document.getElementById('applicantPhoneWrap');
            const pDiv = document.querySelector('.phone-divider');
            if (pWrap) pWrap.style.display = 'inline';
            if (pDiv) pDiv.style.display = 'inline';
        }
    }

    // 3. If in fetching state, check Node backend lookup
    const currentState = cibilValEl.getAttribute('data-state');
    if (currentState === 'fetching') {
        const leadCode = '<?php echo htmlspecialchars($leadId); ?>';
        const pimNodeApi = '<?php echo htmlspecialchars($pimNodeApi); ?>';

        async function fetchScoreOnce() {
            try {
                let token = '';
                if (window.PIMAuth && typeof window.PIMAuth.accessToken === 'function') {
                    token = await window.PIMAuth.accessToken().catch(() => '');
                }
                const headers = { 'Accept': 'application/json' };
                if (token) headers['Authorization'] = 'Bearer ' + token;

                const url = pimNodeApi + '/api/public/leads/lookup' + (leadCode && leadCode.indexOf('PIM-') === 0 ? '?leadCode=' + encodeURIComponent(leadCode) : '');
                const res = await fetch(url, { headers });
                if (res.ok) {
                    const data = await res.json();
                    const lead = data && data.data ? data.data : null;
                    if (lead) {
                        const score = lead.bureau_score || lead.bureauScore || lead.cibilScore || lead.cibil_score || lead.cibil || lead.score;
                        if (applyScore(score)) return true;
                    }
                }
            } catch(e) {}
            return false;
        }

        setTimeout(async () => {
            const ok = await fetchScoreOnce();
            if (!ok && cibilValEl.getAttribute('data-state') === 'fetching') {
                applyUnavailable();
            }
        }, 1500);
    }
})();
</script>

<!-- JSON-LD ItemList Schema for Google Rich Results Test -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Curated Digital Loan Provider Offers",
  "description": "Compare instant personal loan offers from top RBI-registered lenders in India.",
  "itemListElement": [
    <?php 
    $i = 1;
    $totalPartners = count($partners);
    foreach ($partners as $pKey => $pData): 
    ?>
    {
      "@type": "ListItem",
      "position": <?php echo $i; ?>,
      "item": {
        "@type": "FinancialProduct",
        "name": <?php echo json_encode($pData['name']); ?>,
        "description": <?php echo json_encode(implode('. ', $pData['features'])); ?>,
        "amount": {
          "@type": "MonetaryAmount",
          "currency": "INR",
          "maxValue": <?php echo json_encode($pData['max_amount']); ?>
        },
        "interestRate": <?php echo json_encode($pData['interest_rate']); ?>
      }
    }<?php echo ($i < $totalPartners) ? ',' : ''; ?>
    <?php $i++; endforeach; ?>
  ]
}
</script>

<?php include 'includes/footer.php'; ?>
