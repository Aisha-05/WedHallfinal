<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(400);
    die(json_encode(['error' => 'Only DELETE method allowed']));
}

checkOwner();

$hallId = $_GET['id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

try {
    // Verify ownership
    $checkStmt = $pdo->prepare("SELECT owner_id FROM halls WHERE id = ?");
    $checkStmt->execute([$hallId]);
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        die(json_encode(['error' => 'Hall not found']));
    }
    
    $hall = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($hall['owner_id'] != $_SESSION['user_id']) {
        http_response_code(403);
        die(json_encode(['error' => 'You can only delete your own halls']));
    }

    // Delete associated favorites
    $deleteFavStmt = $pdo->prepare("DELETE FROM favorites WHERE hall_id = ?");
    $deleteFavStmt->execute([$hallId]);
    
    // Delete associated bookings
    $deleteBookStmt = $pdo->prepare("DELETE FROM bookings WHERE hall_id = ?");
    $deleteBookStmt->execute([$hallId]);
    
    // Delete hall
    $deleteStmt = $pdo->prepare("DELETE FROM halls WHERE id = ?");
    $deleteStmt->execute([$hallId]);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Hall deleted successfully'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
