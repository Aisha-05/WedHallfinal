<?php
// Database configuration
define('DB_HOST', 'aws-1-eu-north-1.pooler.supabase.com');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres.zbzjcivizurstfmjcura');
define('DB_PASS', 'akramredaayaaisha');
define('DB_PORT', '6543');

// Disable IPv6 for this connection (force IPv4)
putenv('IPv6=0');

// PDO Connection
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=prefer";
    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 30
        )
    );
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

// Set header for JSON responses
header('Content-Type: application/json');

// Note: CORS headers removed - not needed when proxied through Vite (same-origin)
// If you need to support direct API access from different origins, add CORS headers here

// Configure session cookie parameters
session_set_cookie_params([
    'lifetime' => 86400 * 7,  // 7 days
    'path' => '/',
    'secure' => false,  // Allow HTTP for localhost
    'httponly' => true,   // Prevent JS access
    'samesite' => 'Strict'  // Strict during development/localhost
]);

// Configure session save path
$sessionPath = __DIR__ . '/../sessions';
if (!is_dir($sessionPath)) {
    mkdir($sessionPath, 0755, true);
}
ini_set('session.save_path', $sessionPath);
ini_set('session.use_cookies', '1');
ini_set('session.use_only_cookies', '1');

// Start session
session_start();

// Log session info for debugging
if (isset($_GET['debug_session'])) {
    error_log('SESSION_DEBUG: ID=' . session_id() . ', $_SESSION=' . json_encode($_SESSION) . ', PHPSESSID=' . ($_COOKIE['PHPSESSID'] ?? 'NOT SET'));
}
?>
