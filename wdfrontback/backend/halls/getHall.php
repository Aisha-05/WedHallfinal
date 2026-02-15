<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

$hallId = $_GET['id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            h.id, h.name, h.description, h.location, h.price, h.capacity, 
            h.images, h.services, h.owner_id, u.name as owner_name, u.email as owner_email, h.created_at
        FROM halls h
        LEFT JOIN users u ON h.owner_id = u.id
        WHERE h.id = ?
    ");
    
    $stmt->execute([$hallId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        die(json_encode(['error' => 'Hall not found']));
    }
    
    $hall = $stmt->fetch(PDO::FETCH_ASSOC);
    $hall['images'] = $hall['images'] ? json_decode($hall['images'], true) : [];
    $hall['services'] = $hall['services'] ? json_decode($hall['services'], true) : [];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'hall' => $hall
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
