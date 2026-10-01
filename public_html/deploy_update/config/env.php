<?php
/**
 * Simple Lightweight .env Loader for PHP
 */
if (!function_exists('loadEnvFile')) {
    function loadEnvFile($envPath = null) {
        if (!$envPath) {
            $candidates = [
                __DIR__ . '/../.env',
                __DIR__ . '/../../.env',
                dirname(__DIR__, 2) . '/.env'
            ];
            foreach ($candidates as $c) {
                if (file_exists($c)) {
                    $envPath = $c;
                    break;
                }
            }
        }

        if ($envPath && file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim($val, " \t\n\r\0\x0B\"'");
                if (!isset($_ENV[$key])) {
                    $_ENV[$key] = $val;
                    putenv("$key=$val");
                }
            }
        }
    }
}

loadEnvFile();

if (!function_exists('getEnvVal')) {
    function getEnvVal($key, $default = null) {
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }
}
