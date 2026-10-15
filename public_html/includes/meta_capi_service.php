<?php
/**
 * Paisa in Minutes - Meta Conversions API (CAPI) Enterprise Service
 *
 * Implements server-side conversion tracking for Meta Ads according to official
 * Graph API v21.0 standards with strict data normalization, SHA-256 hashing,
 * Pixel deduplication (event_id matching), and failure isolation.
 *
 * Official Meta Conversions API Reference:
 * https://developers.facebook.com/docs/marketing-api/conversions-api/
 */

require_once __DIR__ . '/../config/env.php';

class MetaCapiService {
    const GRAPH_API_VERSION = 'v21.0';
    const DEFAULT_PIXEL_ID = '1113720467814583';
    const GRAPH_API_URL = 'https://graph.facebook.com';

    /**
     * Sent event cache for in-memory and session-level idempotency
     */
    private static $sentEvents = [];

    /**
     * Get configured Meta Pixel / Dataset ID
     *
     * @return string
     */
    public static function getPixelId() {
        return (string) getEnvVal('META_PIXEL_ID', self::DEFAULT_PIXEL_ID);
    }

    /**
     * Get configured Meta CAPI System User Access Token
     *
     * @return string|null
     */
    public static function getAccessToken() {
        $token = getEnvVal('META_CAPI_TOKEN');
        if ($token && is_string($token)) {
            $token = trim($token);
            if (!empty($token) && $token !== 'YOUR_META_CAPI_TOKEN_HERE') {
                return $token;
            }
        }
        return null;
    }

    /**
     * Get optional Meta Test Event Code for Events Manager Test Events Tool
     *
     * @return string|null
     */
    public static function getTestEventCode() {
        $code = getEnvVal('META_TEST_EVENT_CODE');
        if ($code && is_string($code)) {
            $code = trim($code);
            return !empty($code) ? $code : null;
        }
        return null;
    }

    /**
     * Normalize and SHA-256 hash phone number according to Meta requirements:
     * - Only digits (no spaces, dashes, +, or parens)
     * - Remove leading zeroes
     * - Include country code (for India: prepend 91 for 10-digit mobile numbers)
     * - Lowercase SHA-256 hex
     *
     * @param string|null $phone
     * @return string|null
     */
    public static function hashPhone($phone) {
        if (empty($phone)) return null;
        $digits = preg_replace('/\D/', '', (string) $phone);
        $digits = ltrim($digits, '0');
        if (empty($digits)) return null;

        // If standard 10-digit Indian mobile number, add 91 country code
        if (strlen($digits) === 10 && preg_match('/^[6-9]/', $digits)) {
            $digits = '91' . $digits;
        }

        return hash('sha256', strtolower(trim($digits)));
    }

    /**
     * Normalize and SHA-256 hash email according to Meta requirements:
     * - Trim whitespace
     * - Convert to lowercase
     * - Lowercase SHA-256 hex
     *
     * @param string|null $email
     * @return string|null
     */
    public static function hashEmail($email) {
        if (empty($email)) return null;
        $email = strtolower(trim((string) $email));
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return hash('sha256', $email);
        }
        return null;
    }

    /**
     * Normalize and SHA-256 hash first name according to Meta requirements:
     * - Trim whitespace
     * - Lowercase
     * - Remove punctuation and digits
     * - Lowercase SHA-256 hex
     *
     * @param string|null $name
     * @return string|null
     */
    public static function hashFirstName($name) {
        if (empty($name)) return null;
        $parts = preg_split('/\s+/', trim((string) $name));
        $first = strtolower(trim($parts[0] ?? ''));
        $first = preg_replace('/[^a-z]/', '', $first);
        if (!empty($first)) {
            return hash('sha256', $first);
        }
        return null;
    }

    /**
     * Resolve the client IP address (never hashed)
     *
     * @return string
     */
    public static function getClientIp() {
        $headers = [
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'REMOTE_ADDR'
        ];
        foreach ($headers as $h) {
            if (!empty($_SERVER[$h])) {
                $ips = explode(',', (string) $_SERVER[$h]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }
        return '127.0.0.1';
    }

    /**
     * Resolve the browser User-Agent (never hashed)
     *
     * @return string
     */
    public static function getClientUserAgent() {
        return trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
    }

    /**
     * Resolve _fbp (Facebook Browser ID cookie, never hashed)
     *
     * @param string|null $customFbp
     * @return string|null
     */
    public static function getFbp($customFbp = null) {
        if (!empty($customFbp) && preg_match('/^fb\.[0-9a-zA-Z._-]+$/', trim($customFbp))) {
            return trim($customFbp);
        }
        if (!empty($_COOKIE['_fbp']) && preg_match('/^fb\.[0-9a-zA-Z._-]+$/', trim($_COOKIE['_fbp']))) {
            return trim($_COOKIE['_fbp']);
        }
        return null;
    }

    /**
     * Resolve _fbc (Facebook Click ID cookie or fbclid parameter, never hashed)
     * Format: fb.1.<creation_time>.<fbclid>
     *
     * @param string|null $customFbc
     * @param string|null $fbclid
     * @return string|null
     */
    public static function getFbc($customFbc = null, $fbclid = null) {
        if (!empty($customFbc) && strpos(trim($customFbc), 'fb.') === 0) {
            return trim($customFbc);
        }
        if (!empty($_COOKIE['_fbc']) && strpos(trim($_COOKIE['_fbc']), 'fb.') === 0) {
            return trim($_COOKIE['_fbc']);
        }
        // Build from fbclid if available
        $clickId = $fbclid ?: ($_GET['fbclid'] ?? null);
        if (!empty($clickId)) {
            $cleanClick = trim(preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) $clickId));
            if (!empty($cleanClick)) {
                return 'fb.1.' . time() . '.' . $cleanClick;
            }
        }
        return null;
    }

    /**
     * Build standard user_data payload adhering strictly to Meta CAPI specification
     *
     * @param array $params
     * @return array
     */
    public static function buildUserData(array $params = []) {
        $userData = [];

        // 1. Client IP & User Agent (RAW - NOT HASHED)
        $clientIp = !empty($params['client_ip_address']) ? $params['client_ip_address'] : self::getClientIp();
        if ($clientIp && $clientIp !== '127.0.0.1') {
            $userData['client_ip_address'] = $clientIp;
        }

        $userAgent = !empty($params['client_user_agent']) ? $params['client_user_agent'] : self::getClientUserAgent();
        if ($userAgent) {
            $userData['client_user_agent'] = $userAgent;
        }

        // 2. Facebook Browser & Click IDs (RAW - NOT HASHED)
        $fbp = self::getFbp($params['fbp'] ?? null);
        if ($fbp) {
            $userData['fbp'] = $fbp;
        }

        $fbc = self::getFbc($params['fbc'] ?? null, $params['fbclid'] ?? null);
        if ($fbc) {
            $userData['fbc'] = $fbc;
        }

        // 3. Normalized and Hashed Customer Identifiers (SHA-256)
        if (!empty($params['phone'])) {
            $hPh = self::hashPhone($params['phone']);
            if ($hPh) {
                $userData['ph'] = [$hPh];
            }
        }

        if (!empty($params['email'])) {
            $hEm = self::hashEmail($params['email']);
            if ($hEm) {
                $userData['em'] = [$hEm];
            }
        }

        if (!empty($params['name']) || !empty($params['first_name'])) {
            $nameStr = $params['first_name'] ?? $params['name'];
            $hFn = self::hashFirstName($nameStr);
            if ($hFn) {
                $userData['fn'] = [$hFn];
            }
        }

        return $userData;
    }

    /**
     * Send server-side Lead event to Meta Conversions API
     *
     * @param array $eventData [
     *   'event_id' => 'PIM-20261015-1234', // REQUIRED for Pixel deduplication
     *   'phone' => '9811002000',
     *   'name' => 'Applicant Name',
     *   'email' => 'user@example.com',
     *   'loan_amount' => 100000,
     *   'event_source_url' => 'https://paisainminutes.com/apply-now',
     *   'fbp' => '...',
     *   'fbc' => '...',
     *   'utm_source' => 'facebook',
     *   'utm_campaign' => 'diwali_2026',
     *   'test_event_code' => 'TEST12345' // optional override
     * ]
     * @return array ['success' => bool, 'event_id' => string, 'code' => int, 'response' => array|string, 'skipped' => bool]
     */
    public static function sendLeadEvent(array $eventData) {
        $leadId = trim((string) ($eventData['event_id'] ?? $eventData['lead_id'] ?? ''));
        if (empty($leadId)) {
            return [
                'success' => false,
                'error' => 'Missing required event_id for Meta CAPI deduplication.',
                'code' => 400
            ];
        }

        // Idempotency check: prevent duplicate dispatch within current runtime / session
        $idempotencyKey = 'pim_capi_sent_' . md5($leadId);
        if (isset(self::$sentEvents[$idempotencyKey]) || (!empty($_SESSION[$idempotencyKey]))) {
            return [
                'success' => true,
                'event_id' => $leadId,
                'message' => 'Event already dispatched (idempotent deduplication).',
                'skipped' => true,
                'code' => 200
            ];
        }

        $pixelId = self::getPixelId();
        $token = self::getAccessToken();

        // Safe graceful degradation if token is not yet configured
        if (empty($token)) {
            // Mark sent in memory so we don't spam logs
            self::$sentEvents[$idempotencyKey] = true;
            return [
                'success' => true,
                'event_id' => $leadId,
                'warning' => 'META_CAPI_TOKEN is not configured. Server-side tracking skipped gracefully.',
                'code' => 200,
                'skipped' => true
            ];
        }

        // Determine event source URL
        $pageUrl = $eventData['event_source_url'] ?? $eventData['page_url'] ?? null;
        if (empty($pageUrl)) {
            $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'] ?? 'paisainminutes.com';
            $uri = $_SERVER['REQUEST_URI'] ?? '/apply-now';
            $pageUrl = $scheme . '://' . $host . $uri;
        }

        // Build user data
        $userData = self::buildUserData($eventData);

        // Build custom data
        $loanAmount = !empty($eventData['loan_amount']) ? (float) preg_replace('/[^\d.]/', '', (string) $eventData['loan_amount']) : 0.0;
        $customData = [
            'currency' => 'INR',
            'value' => $loanAmount,
            'content_name' => $eventData['content_name'] ?? 'Personal Loan Lead',
            'content_category' => 'Personal Loan',
            'lead_id' => $leadId
        ];

        // Include attribution parameters if available
        $utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        foreach ($utmKeys as $uk) {
            if (!empty($eventData[$uk])) {
                $customData[$uk] = (string) $eventData[$uk];
            }
        }

        // Assemble Meta CAPI event payload
        $eventItem = [
            'event_name' => 'Lead',
            'event_time' => time(),
            'event_id' => $leadId, // Critical for browser Pixel deduplication
            'event_source_url' => (string) $pageUrl,
            'action_source' => 'website',
            'user_data' => $userData,
            'custom_data' => $customData
        ];

        $payload = [
            'data' => [$eventItem]
        ];

        // Append test_event_code if testing
        $testCode = $eventData['test_event_code'] ?? self::getTestEventCode();
        if (!empty($testCode)) {
            $payload['test_event_code'] = $testCode;
        }

        // Transmit to Meta Graph API
        $endpoint = self::GRAPH_API_URL . '/' . self::GRAPH_API_VERSION . '/' . urlencode($pixelId) . '/events';
        $jsonPayload = json_encode($payload);

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $jsonPayload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_TIMEOUT => 4, // Fast non-blocking timeout
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $token,
                'User-Agent: PaisaInMinutes-CAPI/' . self::GRAPH_API_VERSION
            ]
        ]);

        $responseBody = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        $parsedResponse = json_decode($responseBody, true) ?: [];

        // Safe error handling without logging raw PII or tokens
        if ($httpCode >= 200 && $httpCode < 300) {
            self::$sentEvents[$idempotencyKey] = true;
            if (session_status() === PHP_SESSION_ACTIVE) {
                $_SESSION[$idempotencyKey] = true;
            }
            return [
                'success' => true,
                'event_id' => $leadId,
                'events_received' => $parsedResponse['events_received'] ?? 1,
                'fbtrace_id' => $parsedResponse['fbtrace_id'] ?? null,
                'code' => $httpCode
            ];
        }

        // In case of Meta API error or network failure, isolate error and log safely
        $sanitizedError = !empty($parsedResponse['error']['message']) ? $parsedResponse['error']['message'] : ($curlError ?: 'HTTP Status ' . $httpCode);
        error_log(sprintf('[Meta CAPI] Lead event delivery warning (lead_id: %s, code: %d): %s', $leadId, $httpCode, $sanitizedError));

        return [
            'success' => false,
            'event_id' => $leadId,
            'error' => $sanitizedError,
            'code' => $httpCode,
            'response' => $parsedResponse
        ];
    }
}
