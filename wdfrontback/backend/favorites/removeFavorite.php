<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(400);
    die(json_encode(['error' => 'Only DELETE method allowed']));
}

checkClient();

$hallId = $_GET['id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

try {
    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND hall_id = ?");
    $stmt->execute([$_SESSION['user_id'], $hallId]);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Hall removed from favorites'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
