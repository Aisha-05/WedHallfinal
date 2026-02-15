<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

session_destroy();

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Logout successful'
]);
?>
