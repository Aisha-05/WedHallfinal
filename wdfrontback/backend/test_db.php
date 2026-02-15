<?php
// Database configuration
define('DB_HOST', 'aws-1-eu-north-1.pooler.supabase.com');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres.zbzjcivizurstfmjcura');
define('DB_PASS', 'akramredaayaaisha');
define('DB_PORT', '6543');

// PDO Connection
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=prefer";
    $pdo = new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 10
        )
    );
    
    // Test with a simple query
    $result = $pdo->query('SELECT 1');
    echo json_encode(['status' => 'success', 'message' => 'Database connection successful!']);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
}
?>
