<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    die(json_encode(['user' => null]));
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        die(json_encode(['user' => null]));
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'user' => $user,
        'isAuthenticated' => true
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
