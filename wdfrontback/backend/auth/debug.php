<?php
require_once __DIR__ . '/../config/database.php';

// Debug endpoint - shows session and cookie info
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

$debug = [
    'session_id' => session_id(),
    'session_data' => $_SESSION,
    'php_session_name' => session_name(),
    'cookies_received' => $_COOKIE,
    'headers_sent' => function_exists('headers_list') ? headers_list() : [],
    'server_info' => [
        'php_version' => phpversion(),
        'ini_session_save_path' => ini_get('session.save_path'),
        'ini_session_cookie_lifetime' => ini_get('session.cookie_lifetime'),
        'ini_session_cookie_path' => ini_get('session.cookie_path'),
        'ini_session_cookie_domain' => ini_get('session.cookie_domain'),
        'ini_session_cookie_httponly' => ini_get('session.cookie_httponly'),
        'ini_session_cookie_secure' => ini_get('session.cookie_secure'),
        'ini_session_cookie_samesite' => ini_get('session.cookie_samesite'),
    ]
];

http_response_code(200);
echo json_encode($debug, JSON_PRETTY_PRINT);
?>
