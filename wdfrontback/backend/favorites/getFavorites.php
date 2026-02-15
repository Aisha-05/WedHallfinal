<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

checkClient();

try {
    $stmt = $pdo->prepare("
        SELECT h.id, h.name, h.description, h.location, h.price, h.capacity, 
               h.images, h.owner_id, u.name as owner_name
        FROM favorites f
        JOIN halls h ON f.hall_id = h.id
        JOIN users u ON h.owner_id = u.id
        WHERE f.user_id = ?
        ORDER BY f.id DESC
    ");
    
    $stmt->execute([$_SESSION['user_id']]);
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse images JSON
    foreach ($favorites as &$fav) {
        $fav['images'] = $fav['images'] ? json_decode($fav['images'], true) : [];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'favorites' => $favorites
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
