<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

checkAuth();

if ($_SESSION['role'] !== 'owner') {
    http_response_code(403);
    die(json_encode(['error' => 'Only owners can access this endpoint']));
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            h.id, h.name, h.description, h.location, h.price, h.capacity, 
            h.images, h.services, h.owner_id, u.name as owner_name, h.created_at
        FROM halls h
        LEFT JOIN users u ON h.owner_id = u.id
        WHERE h.owner_id = ?
        ORDER BY h.created_at DESC
    ");
    
    $stmt->execute([$_SESSION['user_id']]);
    $halls = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse images and services JSON
    foreach ($halls as &$hall) {
        $hall['images'] = $hall['images'] ? json_decode($hall['images'], true) : [];
        $hall['services'] = $hall['services'] ? json_decode($hall['services'], true) : [];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'halls' => $halls
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
