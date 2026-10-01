<?php
if (!headers_sent()) {
    header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
    header("X-Content-Type-Options: nosniff");
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

// Read input from POST or JSON body
$input = $_POST;
$jsonInput = json_decode(file_get_contents('php://input'), true);
if (is_array($jsonInput)) {
    $input = array_merge($input, $jsonInput);
}

$name = isset($input['name']) ? trim(htmlspecialchars($input['name'])) : '';
$phone = isset($input['phone']) ? trim(htmlspecialchars($input['phone'])) : '';
$email = isset($input['email']) ? trim(htmlspecialchars($input['email'])) : '';
$subject = isset($input['subject']) ? trim(htmlspecialchars($input['subject'])) : '';
$message = isset($input['message']) ? trim(htmlspecialchars($input['message'])) : '';
$agree_consent = isset($input['agree_consent']) ? true : false;

// Validation
if (empty($name) || empty($phone) || empty($email) || empty($message)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Phone, Email, and Message).'
    ]);
    exit;
}

if (!$agree_consent && !isset($input['agree_consent'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please accept the consent terms before submitting.'
    ]);
    exit;
}

$contactId = 'MSG-' . rand(100000, 999999);
$timestamp = date('Y-m-d H:i:s');
$userIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

$contactData = [
    'contact_id' => $contactId,
    'timestamp' => $timestamp,
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'ip_address' => $userIp,
    'status' => 'New'
];

// Save to data/contacts.json
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$jsonFile = $dataDir . '/contacts.json';
$contactsList = [];
if (file_exists($jsonFile)) {
    $existing = file_get_contents($jsonFile);
    $contactsList = json_decode($existing, true) ?: [];
}
$contactsList[] = $contactData;
@file_put_contents($jsonFile, json_encode($contactsList, JSON_PRETTY_PRINT));

// Save to contacts_log.csv
$logFile = __DIR__ . '/contacts_log.csv';
$fileExisted = file_exists($logFile);
$file = @fopen($logFile, 'a');
if ($file) {
    if (!$fileExisted) {
        fputcsv($file, array_keys($contactData));
    }
    fputcsv($file, array_values($contactData));
    fclose($file);
}

// Return success response
echo json_encode([
    'status' => 'success',
    'message' => 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
    'reference_id' => $contactId
]);
exit;
