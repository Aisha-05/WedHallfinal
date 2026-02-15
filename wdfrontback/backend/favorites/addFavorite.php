<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkClient();

$data = json_decode(file_get_contents('php://input'), true);
$hallId = $data['hall_id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

try {
    // Check if hall exists
    $hallStmt = $pdo->prepare("SELECT id FROM halls WHERE id = ?");
    $hallStmt->execute([$hallId]);
    
    if ($hallStmt->rowCount() === 0) {
        http_response_code(404);
        die(json_encode(['error' => 'Hall not found']));
    }
    
    // Check if already favorited
    $checkStmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND hall_id = ?");
    $checkStmt->execute([$_SESSION['user_id'], $hallId]);
    
    if ($checkStmt->rowCount() === 0) {
        // Add to favorites only if not already there
        $stmt = $pdo->prepare("INSERT INTO favorites (user_id, hall_id) VALUES (?, ?)");
        $stmt->execute([$_SESSION['user_id'], $hallId]);
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Hall added to favorites'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
