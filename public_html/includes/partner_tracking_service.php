<?php
/**
 * Paisa in Minutes - Unified Partner Tracking, Event Logging, Delivery & Postback Service
 */

date_default_timezone_set('Asia/Kolkata');

if (!function_exists('getPimDbConnection')) {
    function getPimDbConnection() {
        static $pdo = null;
        if ($pdo !== null) return $pdo;

        $dbHost = getenv('DB_HOST') ?: '127.0.0.1';
        $dbUser = getenv('DB_USER') ?: 'root';
        $dbPass = getenv('DB_PASS') ?: '';
        $dbName = getenv('DB_NAME') ?: 'paisacrm';

        try {
            $pdo = new PDO("mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 3
            ]);
            ensureDatabaseTables($pdo);
            return $pdo;
        } catch (Exception $e) {
            $pdo = false;
            return false;
        }
    }
}

function ensureDatabaseTables($pdo) {
    if (!$pdo) return;
    try {
        // 1. lead_partner_events table
        $pdo->exec("CREATE TABLE IF NOT EXISTS lead_partner_events (
            id VARCHAR(64) PRIMARY KEY,
            lead_id VARCHAR(64) NOT NULL,
            partner_id VARCHAR(64) NOT NULL,
            partner_slug VARCHAR(64),
            partner_name VARCHAR(128),
            event_type VARCHAR(32) NOT NULL, -- assigned, clicked, api_pushed, postback, status_updated
            ip VARCHAR(45),
            user_agent TEXT,
            status VARCHAR(64),
            details JSON,
            created_at DATETIME NOT NULL,
            INDEX idx_lead_id (lead_id),
            INDEX idx_partner_id (partner_id),
            INDEX idx_event_type (event_type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 2. partners table
        $pdo->exec("CREATE TABLE IF NOT EXISTS partners (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(128) NOT NULL,
            slug VARCHAR(64) NOT NULL,
            api_url TEXT,
            api_key VARCHAR(255),
            payload_mapping JSON,
            is_api_enabled TINYINT(1) DEFAULT 0,
            secret_token VARCHAR(255),
            daily_export_email VARCHAR(255),
            created_at DATETIME NOT NULL,
            INDEX idx_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 3. partner_delivery_logs table
        $pdo->exec("CREATE TABLE IF NOT EXISTS partner_delivery_logs (
            id VARCHAR(64) PRIMARY KEY,
            lead_id VARCHAR(64) NOT NULL,
            partner_id VARCHAR(64) NOT NULL,
            partner_name VARCHAR(128),
            endpoint TEXT,
            status VARCHAR(32) NOT NULL, -- delivered, failed, retrying
            attempts INT DEFAULT 1,
            request_payload JSON,
            response_code INT,
            response_body TEXT,
            created_at DATETIME NOT NULL,
            INDEX idx_lead_id (lead_id),
            INDEX idx_status (status),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 4. partner_users table
        $pdo->exec("CREATE TABLE IF NOT EXISTS partner_users (
            id VARCHAR(64) PRIMARY KEY,
            partner_id VARCHAR(64) NOT NULL,
            partner_name VARCHAR(128),
            name VARCHAR(128),
            username VARCHAR(128) UNIQUE,
            email VARCHAR(128),
            password VARCHAR(255),
            status VARCHAR(32) DEFAULT 'Active',
            created_at DATETIME NOT NULL,
            INDEX idx_partner_id (partner_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (Exception $e) {
        // Table creation error ignored, flat files will back it up
    }
}

// -------------------------------------------------------------
// Storage Paths & Helpers
// -------------------------------------------------------------
function getPimStorageDir() {
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    return $dir;
}

function getJsonFileContent($filepath, $default = []) {
    if (file_exists($filepath)) {
        $content = @file_get_contents($filepath);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data)) return $data;
        }
    }
    return $default;
}

function saveJsonFileContent($filepath, $data) {
    $dir = dirname($filepath);
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// -------------------------------------------------------------
// Partner Configurations (MySQL + JSON sync)
// -------------------------------------------------------------
function getDefaultPartnersConfig() {
    return [
        'rupay91' => [
            'id' => 'rupay91',
            'name' => 'Rupay 91',
            'slug' => 'rupay91',
            'api_url' => 'https://api.rupay91.com/v1/lead-ingest',
            'api_key' => 'live_pk_rupay91_892b1a',
            'payload_mapping' => [
                'full_name' => '{name}',
                'mobile_no' => '{phone}',
                'pan' => '{pan}',
                'requested_amount' => '{loanAmount}',
                'net_salary' => '{monthlySalary}',
                'cibil_score' => '{cibil}',
                'city' => '{city}',
                'pincode' => '{pincode}',
                'external_lead_id' => '{leadId}'
            ],
            'is_api_enabled' => 1,
            'secret_token' => 'sec_rupay91_2026',
            'daily_export_email' => 'partners@rupay91.com'
        ],
        'borrowera' => [
            'id' => 'borrowera',
            'name' => 'Borrowera',
            'slug' => 'borrowera',
            'api_url' => 'https://api.borrowera.com/leads/receive',
            'api_key' => 'bor_live_99214a',
            'payload_mapping' => [
                'applicant_name' => '{name}',
                'phone' => '{phone}',
                'loan_amount' => '{loanAmount}',
                'monthly_income' => '{monthlySalary}',
                'sub_id' => '{leadId}'
            ],
            'is_api_enabled' => 1,
            'secret_token' => 'sec_borrowera_2026',
            'daily_export_email' => 'leads@borrowera.com'
        ],
        'easyfincare' => [
            'id' => 'easyfincare',
            'name' => 'Easy Fincare',
            'slug' => 'easyfincare',
            'api_url' => 'https://partner.easyfincare.com/api/v2/webhook',
            'api_key' => 'efc_live_key_310',
            'payload_mapping' => [
                'name' => '{name}',
                'mobile' => '{phone}',
                'salary' => '{monthlySalary}',
                'cibil' => '{cibil}',
                'lead_ref' => '{leadId}'
            ],
            'is_api_enabled' => 1,
            'secret_token' => 'sec_easyfincare_2026',
            'daily_export_email' => 'ops@easyfincare.com'
        ],
        'loanwithin' => [
            'id' => 'loanwithin',
            'name' => 'LoanWithin',
            'slug' => 'loanwithin',
            'api_url' => 'https://api.loanwithin.com/v1/inbound-lead',
            'api_key' => 'lw_auth_781190',
            'payload_mapping' => [
                'customer_name' => '{name}',
                'phone_number' => '{phone}',
                'cibil_score' => '{cibil}',
                'applied_amount' => '{loanAmount}',
                'source_ref' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_loanwithin_2026',
            'daily_export_email' => 'leads@loanwithin.com'
        ],
        'instarupees' => [
            'id' => 'instarupees',
            'name' => 'Insta Rupees',
            'slug' => 'instarupees',
            'api_url' => 'https://api.instarupees.com/leads',
            'api_key' => 'ir_api_90112',
            'payload_mapping' => [
                'fullName' => '{name}',
                'mobile' => '{phone}',
                'amount' => '{loanAmount}',
                'leadId' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_instarupees_2026',
            'daily_export_email' => 'paisa@instarupees.com'
        ],
        'shubhcash' => [
            'id' => 'shubhcash',
            'name' => 'ShubhCash',
            'slug' => 'shubhcash',
            'api_url' => 'https://api.shubhcash.com/v1/lead',
            'api_key' => 'shubh_k8912',
            'payload_mapping' => [
                'name' => '{name}',
                'phone' => '{phone}',
                'salary' => '{monthlySalary}',
                'sub_id' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_shubhcash_2026',
            'daily_export_email' => 'leads@shubhcash.com'
        ],
        'udhaarnow' => [
            'id' => 'udhaarnow',
            'name' => 'UdhaarNow',
            'slug' => 'udhaarnow',
            'api_url' => 'https://api.udhaarnow.com/partner/leads',
            'api_key' => 'un_tok_99182',
            'payload_mapping' => [
                'name' => '{name}',
                'mobile' => '{phone}',
                'loan_amount' => '{loanAmount}',
                'lead_id' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_udhaarnow_2026',
            'daily_export_email' => 'credit@udhaarnow.com'
        ],
        'jhatpatloans' => [
            'id' => 'jhatpatloans',
            'name' => 'Jhatpat Loans',
            'slug' => 'jhatpatloans',
            'api_url' => 'https://api.jhatpatloans.com/webhook/pim',
            'api_key' => 'jhatpat_sec_4412',
            'payload_mapping' => [
                'name' => '{name}',
                'mobile' => '{phone}',
                'amount' => '{loanAmount}',
                'cibil' => '{cibil}',
                'ref' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_jhatpatloans_2026',
            'daily_export_email' => 'ops@jhatpatloans.com'
        ],
        'ticket2loan' => [
            'id' => 'ticket2loan',
            'name' => 'Ticket 2 Loan',
            'slug' => 'ticket2loan',
            'api_url' => 'https://api.ticket2loan.com/leads/receive',
            'api_key' => 't2l_key_7718',
            'payload_mapping' => [
                'borrower' => '{name}',
                'contact' => '{phone}',
                'amount' => '{loanAmount}',
                'tracking_code' => '{leadId}'
            ],
            'is_api_enabled' => 0,
            'secret_token' => 'sec_ticket2loan_2026',
            'daily_export_email' => 'affiliates@ticket2loan.com'
        ]
    ];
}

function getAllPartnersConfig() {
    $file = getPimStorageDir() . '/partners_config.json';
    $config = getJsonFileContent($file, []);

    if (empty($config)) {
        $config = getDefaultPartnersConfig();
        saveJsonFileContent($file, $config);
    } else {
        // Merge defaults to ensure no fields are missing
        $defaults = getDefaultPartnersConfig();
        foreach ($defaults as $k => $def) {
            if (!isset($config[$k])) {
                $config[$k] = $def;
            } else {
                $config[$k] = array_merge($def, $config[$k]);
            }
        }
    }

    return $config;
}

function getPartnerBySlugOrId($slugOrId) {
    if (empty($slugOrId)) return null;
    $partners = getAllPartnersConfig();
    $clean = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$slugOrId));

    if (isset($partners[$slugOrId])) {
        return $partners[$slugOrId];
    }

    foreach ($partners as $key => $p) {
        $pk = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$key));
        $ps = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)($p['slug'] ?? '')));
        $pn = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)($p['name'] ?? '')));
        if ($pk === $clean || $ps === $clean || $pn === $clean) {
            return $p;
        }
    }

    return null;
}

// -------------------------------------------------------------
// EVENT LOGGING: lead_partner_events
// -------------------------------------------------------------
function logPartnerEvent($leadId, $partnerId = null, $partnerName = null, $eventType = 'clicked', $details = [], $ip = null, $userAgent = null) {
    if (is_array($leadId)) {
        $arr = $leadId;
        $leadId = $arr['lead_id'] ?? '';
        $partnerId = $arr['partner_id'] ?? '';
        $partnerName = $arr['partner_name'] ?? ($partnerId ? ucfirst($partnerId) : 'Partner');
        $eventType = $arr['event_type'] ?? 'clicked';
        $details = $arr['details'] ?? (!empty($arr['remarks']) ? ['remarks' => $arr['remarks']] : []);
        $ip = $arr['ip'] ?? null;
        $userAgent = $arr['user_agent'] ?? null;
    }
    if (empty($leadId)) return false;

    $timestamp = date('Y-m-d H:i:s');
    $eventId = 'EVT-' . strtoupper(substr($eventType, 0, 3)) . '-' . date('YmdHis') . '-' . rand(1000, 9999);
    $ip = $ip ?: ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    $userAgent = $userAgent ?: ($_SERVER['HTTP_USER_AGENT'] ?? 'Internal System');
    $partnerSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)$partnerId));

    $event = [
        'id' => $eventId,
        'lead_id' => (string)$leadId,
        'partner_id' => (string)$partnerId,
        'partner_slug' => $partnerSlug,
        'partner_name' => (string)$partnerName,
        'event_type' => (string)$eventType, // assigned, clicked, api_pushed, postback, status_updated
        'ip' => $ip,
        'user_agent' => $userAgent,
        'status' => $details['status'] ?? 'completed',
        'details' => $details,
        'created_at' => $timestamp
    ];

    // 1. MySQL Insert (if available)
    $pdo = getPimDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO lead_partner_events 
                (id, lead_id, partner_id, partner_slug, partner_name, event_type, ip, user_agent, status, details, created_at)
                VALUES (:id, :lead_id, :partner_id, :partner_slug, :partner_name, :event_type, :ip, :user_agent, :status, :details, :created_at)");
            $stmt->execute([
                ':id' => $event['id'],
                ':lead_id' => $event['lead_id'],
                ':partner_id' => $event['partner_id'],
                ':partner_slug' => $event['partner_slug'],
                ':partner_name' => $event['partner_name'],
                ':event_type' => $event['event_type'],
                ':ip' => $event['ip'],
                ':user_agent' => $event['user_agent'],
                ':status' => $event['status'],
                ':details' => json_encode($event['details'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                ':created_at' => $event['created_at']
            ]);
        } catch (Exception $e) {
            // Error ignored, flat file ensures zero data loss
        }
    }

    // 2. Flat File Persistence (data/lead_partner_events.json)
    $eventsFile = getPimStorageDir() . '/lead_partner_events.json';
    $events = getJsonFileContent($eventsFile, []);
    // Prepend event so newest is at the top
    array_unshift($events, $event);
    // Keep max 5000 events to prevent file bloating
    if (count($events) > 5000) {
        $events = array_slice($events, 0, 5000);
    }
    saveJsonFileContent($eventsFile, $events);

    // 3. Append to CSV log for audit
    $csvFile = getPimStorageDir() . '/lead_partner_events.csv';
    $isNew = !file_exists($csvFile);
    $fp = @fopen($csvFile, 'a');
    if ($fp) {
        if ($isNew) {
            fputcsv($fp, ['id', 'lead_id', 'partner_id', 'partner_name', 'event_type', 'status', 'ip', 'created_at', 'details']);
        }
        fputcsv($fp, [
            $eventId,
            $leadId,
            $partnerId,
            $partnerName,
            $eventType,
            $event['status'],
            $ip,
            $timestamp,
            json_encode($details)
        ]);
        @fclose($fp);
    }

    return $event;
}

function getLeadEvents($leadId) {
    if (empty($leadId)) return [];

    $pdo = getPimDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM lead_partner_events WHERE lead_id = :lead_id ORDER BY created_at DESC");
            $stmt->execute([':lead_id' => $leadId]);
            $rows = $stmt->fetchAll();
            if ($rows && count($rows) > 0) {
                foreach ($rows as &$r) {
                    if (isset($r['details']) && is_string($r['details'])) {
                        $r['details'] = json_decode($r['details'], true) ?: [];
                    }
                }
                return $rows;
            }
        } catch (Exception $e) {}
    }

    // Fallback to JSON store
    $eventsFile = getPimStorageDir() . '/lead_partner_events.json';
    $events = getJsonFileContent($eventsFile, []);
    $matched = [];
    foreach ($events as $evt) {
        if (isset($evt['lead_id']) && (string)$evt['lead_id'] === (string)$leadId) {
            $matched[] = $evt;
        }
    }
    return $matched;
}

function getPartnerEvents($leadId) {
    return getLeadEvents($leadId);
}

function getAllEvents($limit = 100, $eventType = null, $partnerId = null) {
    $eventsFile = getPimStorageDir() . '/lead_partner_events.json';
    $events = getJsonFileContent($eventsFile, []);

    if ($eventType || $partnerId) {
        $events = array_values(array_filter($events, function($e) use ($eventType, $partnerId) {
            if ($eventType && ($e['event_type'] ?? '') !== $eventType) return false;
            if ($partnerId && ($e['partner_id'] ?? '') !== $partnerId && ($e['partner_slug'] ?? '') !== $partnerId) return false;
            return true;
        }));
    }

    return array_slice($events, 0, $limit);
}

// -------------------------------------------------------------
// DELIVERY LOGGING & RETRY SYSTEM: partner_delivery_logs
// -------------------------------------------------------------
function logDelivery($leadId, $partnerId, $partnerName, $endpoint, $status, $attempts, $payload, $responseCode, $responseBody) {
    $logId = 'DLV-' . date('YmdHis') . '-' . rand(1000, 9999);
    $timestamp = date('Y-m-d H:i:s');

    $logEntry = [
        'id' => $logId,
        'lead_id' => (string)$leadId,
        'partner_id' => (string)$partnerId,
        'partner_name' => (string)$partnerName,
        'endpoint' => (string)$endpoint,
        'status' => (string)$status, // 'delivered', 'failed', 'retrying'
        'attempts' => (int)$attempts,
        'request_payload' => $payload,
        'response_code' => (int)$responseCode,
        'response_body' => is_string($responseBody) ? substr($responseBody, 0, 1000) : json_encode($responseBody),
        'created_at' => $timestamp
    ];

    // MySQL
    $pdo = getPimDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO partner_delivery_logs
                (id, lead_id, partner_id, partner_name, endpoint, status, attempts, request_payload, response_code, response_body, created_at)
                VALUES (:id, :lead_id, :partner_id, :partner_name, :endpoint, :status, :attempts, :payload, :code, :body, :created_at)");
            $stmt->execute([
                ':id' => $logEntry['id'],
                ':lead_id' => $logEntry['lead_id'],
                ':partner_id' => $logEntry['partner_id'],
                ':partner_name' => $logEntry['partner_name'],
                ':endpoint' => $logEntry['endpoint'],
                ':status' => $logEntry['status'],
                ':attempts' => $logEntry['attempts'],
                ':payload' => json_encode($payload, JSON_UNESCAPED_SLASHES),
                ':code' => $logEntry['response_code'],
                ':body' => $logEntry['response_body'],
                ':created_at' => $logEntry['created_at']
            ]);
        } catch (Exception $e) {}
    }

    // JSON file
    $file = getPimStorageDir() . '/partner_delivery_logs.json';
    $logs = getJsonFileContent($file, []);
    array_unshift($logs, $logEntry);
    if (count($logs) > 3000) {
        $logs = array_slice($logs, 0, 3000);
    }
    saveJsonFileContent($file, $logs);

    return $logEntry;
}

function getDeliveryLogs($limit = 150, $statusFilter = null) {
    $file = getPimStorageDir() . '/partner_delivery_logs.json';
    $logs = getJsonFileContent($file, []);

    if ($statusFilter && $statusFilter !== 'all') {
        $logs = array_values(array_filter($logs, function($l) use ($statusFilter) {
            return strtolower($l['status'] ?? '') === strtolower($statusFilter);
        }));
    }

    return array_slice($logs, 0, $limit);
}

// -------------------------------------------------------------
// API / WEBHOOK PUSH ENGINE (with 3-attempt retry)
// -------------------------------------------------------------
function pushLeadToPartnerApi($leadData, $partnerId, $maxAttempts = 3) {
    $partner = getPartnerBySlugOrId($partnerId);
    if (!$partner) {
        return ['success' => false, 'error' => "Partner '{$partnerId}' not found"];
    }

    if (empty($partner['is_api_enabled']) || empty($partner['api_url'])) {
        return ['success' => false, 'skipped' => true, 'message' => "API Push not enabled for {$partner['name']}"];
    }

    $leadId = $leadData['id'] ?? $leadData['lead_id'] ?? $leadData['loanNo'] ?? 'UNKNOWN';
    $endpoint = $partner['api_url'];
    $apiKey = $partner['api_key'] ?? '';
    $mapping = $partner['payload_mapping'] ?? [];

    // Build payload according to payload_mapping
    $payload = [];
    if (!empty($mapping) && is_array($mapping)) {
        foreach ($mapping as $targetKey => $placeholder) {
            if (is_string($placeholder)) {
                $val = $placeholder;
                $val = str_replace('{leadId}', $leadId, $val);
                $val = str_replace('{name}', $leadData['name'] ?? 'Applicant', $val);
                $val = str_replace('{phone}', $leadData['phone'] ?? $leadData['mobile'] ?? '', $val);
                $val = str_replace('{email}', $leadData['email'] ?? '', $val);
                $val = str_replace('{pan}', $leadData['pan'] ?? '', $val);
                $val = str_replace('{loanAmount}', (string)($leadData['loanAmount'] ?? $leadData['loan_amount'] ?? 50000), $val);
                $val = str_replace('{monthlySalary}', (string)($leadData['monthlySalary'] ?? $leadData['salary'] ?? 35000), $val);
                $val = str_replace('{cibil}', (string)($leadData['cibilScore'] ?? $leadData['cibil'] ?? 750), $val);
                $val = str_replace('{city}', $leadData['city'] ?? '', $val);
                $val = str_replace('{pincode}', $leadData['pincode'] ?? '', $val);
                $payload[$targetKey] = $val;
            } else {
                $payload[$targetKey] = $placeholder;
            }
        }
    } else {
        // Default standard payload
        $payload = [
            'lead_id' => $leadId,
            'applicant_name' => $leadData['name'] ?? 'Applicant',
            'phone_number' => $leadData['phone'] ?? $leadData['mobile'] ?? '',
            'email' => $leadData['email'] ?? '',
            'loan_amount' => $leadData['loanAmount'] ?? 50000,
            'monthly_salary' => $leadData['monthlySalary'] ?? 35000,
            'cibil_score' => $leadData['cibilScore'] ?? $leadData['cibil'] ?? 750,
            'pan' => $leadData['pan'] ?? '',
            'city' => $leadData['city'] ?? '',
            'pincode' => $leadData['pincode'] ?? '',
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }

    $jsonPayload = json_encode($payload);
    $attempts = 0;
    $httpCode = 0;
    $responseBody = '';
    $isSuccess = false;

    // Execute with up to $maxAttempts retries
    while ($attempts < $maxAttempts && !$isSuccess) {
        $attempts++;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $apiKey,
            'X-Partner-Key: ' . $apiKey,
            'X-Lead-ID: ' . $leadId,
            'User-Agent: PaisaInMinutes-CRM-Webhook/2.0'
        ]);

        $responseBody = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode <= 299) {
            $isSuccess = true;
            break;
        }

        if ($attempts < $maxAttempts) {
            // Backoff: 100ms
            usleep(100000);
        }
    }

    $deliveryStatus = $isSuccess ? 'delivered' : 'failed';

    // 1. Log in Delivery Log
    $log = logDelivery(
        $leadId,
        $partner['id'],
        $partner['name'],
        $endpoint,
        $deliveryStatus,
        $attempts,
        $payload,
        $httpCode,
        $responseBody ?: $curlError
    );

    // 2. Log in lead_partner_events
    logPartnerEvent(
        $leadId,
        $partner['id'],
        $partner['name'],
        'api_pushed',
        [
            'status' => $deliveryStatus,
            'attempts' => $attempts,
            'http_code' => $httpCode,
            'endpoint' => $endpoint,
            'delivery_log_id' => $log['id']
        ]
    );

    // 3. Update lead's delivery status flag in store
    updateLeadDeliveryStatus($leadId, $partner['name'], $deliveryStatus);

    return [
        'success' => $isSuccess,
        'status' => $deliveryStatus,
        'attempts' => $attempts,
        'http_code' => $httpCode,
        'response' => $responseBody,
        'log_id' => $log['id']
    ];
}

function updateLeadDeliveryStatus($leadId, $partnerName, $deliveryStatus) {
    $webRoot = dirname(__DIR__);
    $overrideFiles = [
        $webRoot . '/data/leads_overrides.json',
        $webRoot . '/crm/leads_overrides.json',
        $webRoot . '/admin/leads_overrides.json'
    ];

    $patch = [
        'delivery_status' => $deliveryStatus, // 'delivered' | 'failed'
        'delivery_partner' => $partnerName,
        'delivery_at' => date('Y-m-d H:i:s')
    ];

    foreach ($overrideFiles as $of) {
        $data = getJsonFileContent($of, []);
        $data[$leadId] = array_merge($data[$leadId] ?? [], $patch);
        saveJsonFileContent($of, $data);
    }
}

function updateLeadRedirectStatus($leadId, $partnerSlug, $partnerName, $phone = '') {
    $timestamp = date('Y-m-d H:i:s');
    $redirectStatus = 'Redirected to ' . $partnerName;
    $webRoot = dirname(__DIR__);

    $patch = [
        'appliedTo'        => $partnerName,
        'applied_to'       => $partnerName,
        'appliedCompany'   => $partnerName,
        'clickedPartner'   => $partnerSlug,
        'clicked_partner'  => $partnerSlug,
        'applied_at'       => $timestamp,
        'status'           => $redirectStatus,
        'updated_at'       => $timestamp
    ];

    // Overrides
    $overrideFiles = [
        $webRoot . '/data/leads_overrides.json',
        $webRoot . '/crm/leads_overrides.json',
        $webRoot . '/admin/leads_overrides.json'
    ];
    foreach ($overrideFiles as $of) {
        $overrides = getJsonFileContent($of, []);
        if (!empty($leadId)) $overrides[$leadId] = array_merge($overrides[$leadId] ?? [], $patch);
        if (!empty($phone)) $overrides[$phone] = array_merge($overrides[$phone] ?? [], $patch);
        saveJsonFileContent($of, $overrides);
    }

    // Leads stores
    $leadsFiles = [
        $webRoot . '/crm/leads_store.json',
        $webRoot . '/data/leads.json',
        $webRoot . '/admin/leads_store.json'
    ];
    foreach ($leadsFiles as $lf) {
        if (file_exists($lf)) {
            $leads = getJsonFileContent($lf, []);
            $changed = false;
            foreach ($leads as &$l) {
                $rowId = (string)($l['id'] ?? $l['lead_id'] ?? $l['loanNo'] ?? '');
                $rowPhone = preg_replace('/\D/', '', (string)($l['phone'] ?? $l['mobile'] ?? ''));
                if ((!empty($leadId) && $rowId === (string)$leadId) || (!empty($phone) && $rowPhone === (string)$phone)) {
                    $l['appliedTo'] = $partnerName;
                    $l['applied_to'] = $partnerName;
                    $l['clickedPartner'] = $partnerSlug;
                    $l['clicked_partner'] = $partnerSlug;
                    $l['status'] = $redirectStatus;
                    $l['applied_at'] = $timestamp;
                    $changed = true;
                }
            }
            if ($changed) {
                saveJsonFileContent($lf, $leads);
            }
        }
    }
    return true;
}

// -------------------------------------------------------------
// POSTBACK PROCESSING
// -------------------------------------------------------------
function processPostback($partnerSlug, $subId, $status = null, $amount = 0, $secretToken = null) {
    if (is_array($subId)) {
        $params = $subId;
        $subId = $params['sub_id'] ?? $params['lead_id'] ?? '';
        $status = $params['status'] ?? 'Disbursed';
        $amount = $params['amount'] ?? 0;
        $secretToken = $params['secret'] ?? $params['token'] ?? '';
    }

    if (empty($subId)) {
        return ['success' => false, 'error' => 'Missing sub_id / lead_id'];
    }

    $partner = getPartnerBySlugOrId($partnerSlug);
    if (!$partner) {
        return ['success' => false, 'error' => "Invalid partner slug: '{$partnerSlug}'"];
    }

    // Secret validation: check configured partner secret or global master token
    $expectedSecret = $partner['secret_token'] ?? '';
    $masterSecret = 'PIM_POSTBACK_SEC_2026';
    
    $isValidSecret = (!empty($expectedSecret) && hash_equals($expectedSecret, (string)$secretToken))
        || hash_equals($masterSecret, (string)$secretToken);

    if (!$isValidSecret) {
        return ['success' => false, 'error' => 'Unauthorized: Invalid secret token'];
    }

    $amountVal = floatval($amount);
    $normalizedStatus = ucfirst(strtolower(trim($status)));
    if (!in_array($normalizedStatus, ['Contacted', 'Approved', 'Rejected', 'Disbursed'])) {
        $normalizedStatus = 'Disbursed';
    }

    $timestamp = date('Y-m-d H:i:s');

    // 1. Log event in lead_partner_events
    $event = logPartnerEvent(
        $subId,
        $partner['id'],
        $partner['name'],
        'postback',
        [
            'status' => $normalizedStatus,
            'amount' => $amountVal,
            'received_status' => $status,
            'timestamp' => $timestamp
        ]
    );

    // 2. Update Lead Record across stores
    $leadPatch = [
        'status' => $normalizedStatus,
        'updated_at' => $timestamp,
        'postback_partner' => $partner['name'],
        'postback_at' => $timestamp
    ];
    if ($amountVal > 0) {
        $leadPatch['loanAmount'] = $amountVal;
        $leadPatch['disbursedAmount'] = $amountVal;
    }

    $webRoot = dirname(__DIR__);
    $overrideFiles = [
        $webRoot . '/data/leads_overrides.json',
        $webRoot . '/crm/leads_overrides.json',
        $webRoot . '/admin/leads_overrides.json'
    ];
    foreach ($overrideFiles as $of) {
        $data = getJsonFileContent($of, []);
        $data[$subId] = array_merge($data[$subId] ?? [], $leadPatch);
        saveJsonFileContent($of, $data);
    }

    // Update active lead stores
    $leadStores = [
        $webRoot . '/data/leads.json',
        $webRoot . '/crm/leads_store.json',
        $webRoot . '/admin/leads_store.json'
    ];
    foreach ($leadStores as $sf) {
        if (file_exists($sf)) {
            $leads = getJsonFileContent($sf, []);
            if (is_array($leads)) {
                $mod = false;
                foreach ($leads as &$l) {
                    $lid = $l['id'] ?? $l['lead_id'] ?? $l['loanNo'] ?? '';
                    if ((string)$lid === (string)$subId) {
                        $l['status'] = $normalizedStatus;
                        if ($amountVal > 0) $l['loanAmount'] = $amountVal;
                        $l['updated_at'] = $timestamp;
                        $l['postback_partner'] = $partner['name'];
                        $mod = true;
                    }
                }
                unset($l);
                if ($mod) saveJsonFileContent($sf, $leads);
            }
        }
    }

    // Record in conversions.json
    $convFile = $webRoot . '/data/conversions.json';
    $conversions = getJsonFileContent($convFile, []);
    $conversions[] = [
        'conversion_id' => 'CNV-' . date('Ymd') . '-' . rand(1000, 9999),
        'lead_id' => $subId,
        'partner' => $partner['name'],
        'status' => $normalizedStatus,
        'amount' => $amountVal,
        'timestamp' => $timestamp
    ];
    saveJsonFileContent($convFile, $conversions);

    return [
        'success' => true,
        'message' => "Postback recorded successfully for lead {$subId}",
        'lead_id' => $subId,
        'partner' => $partner['name'],
        'status' => $normalizedStatus,
        'amount' => $amountVal,
        'event_id' => $event['id']
    ];
}

// -------------------------------------------------------------
// PARTNER USER MANAGEMENT (Super Admin Portal)
// -------------------------------------------------------------
function getPartnerUsersList() {
    $file = getPimStorageDir() . '/partner_users.json';
    $users = getJsonFileContent($file, []);

    if (empty($users)) {
        // Seed default partner accounts for initial testing
        $users = [
            [
                'id' => 'usr_partner_rupay91',
                'partner_id' => 'rupay91',
                'partner_name' => 'Rupay 91',
                'name' => 'RuPay91 Operations',
                'username' => 'rupay91_partner',
                'email' => 'partner@rupay91.com',
                'password' => 'Partner@2026',
                'role' => 'Partner',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'usr_partner_borrowera',
                'partner_id' => 'borrowera',
                'partner_name' => 'Borrowera',
                'name' => 'Borrowera Team',
                'username' => 'borrowera_partner',
                'email' => 'partner@borrowera.com',
                'password' => 'Partner@2026',
                'role' => 'Partner',
                'status' => 'Active',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
        saveJsonFileContent($file, $users);
    }

    return $users;
}

function savePartnerUsersList($users) {
    $file = getPimStorageDir() . '/partner_users.json';
    saveJsonFileContent($file, $users);
}
