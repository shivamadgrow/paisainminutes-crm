<?php
/**
 * Paisa in Minutes CRM - PHP Database Reset & Backup Script
 * 
 * Execution: php reset_crm_data.php
 * Purpose: Backs up lead data tables to backup_* tables and resets CRM tables to 0 with AUTO_INCREMENT = 1.
 */

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';
$db_name = getenv('DB_NAME') ?: 'paisacrm';

echo "=== Paisa CRM Clean Slate Reset Script ===\n";

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $timestamp = date('Ymd_His');
    echo "[1/4] Connected to database '$db_name'.\n";

    // Tables to reset
    $tables = ['leads', 'applications', 'disbursals', 'collections', 'activity_logs', 'notifications'];

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

    foreach ($tables as $table) {
        // Backup
        $backupTable = "backup_{$table}_{$timestamp}";
        $pdo->exec("CREATE TABLE IF NOT EXISTS `{$backupTable}` AS SELECT * FROM `{$table}`;");
        echo "[2/4] Created backup table '$backupTable'.\n";

        // Truncate & Reset Sequence
        $pdo->exec("TRUNCATE TABLE `{$table}`;");
        $pdo->exec("ALTER TABLE `{$table}` AUTO_INCREMENT = 1;");
        echo "[3/4] Reset table '$table' to zero state and AUTO_INCREMENT = 1.\n";
    }

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    echo "[4/4] CRM Data reset completed successfully! User accounts and settings remain intact.\n";

} catch (PDOException $e) {
    echo "[ERROR] Database reset failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
