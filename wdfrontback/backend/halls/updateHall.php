<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(400);
    die(json_encode(['error' => 'Only PUT method allowed']));
}

checkOwner();

$hallId = $_GET['id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
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
        die(json_encode(['error' => 'You can only edit your own halls']));
    }

    $name = trim($data['name'] ?? '');
    $description = trim($data['description'] ?? '');
    $location = trim($data['location'] ?? '');
    $price = floatval($data['price'] ?? 0);
    $capacity = intval($data['capacity'] ?? 0);
    $images = $data['images'] ?? [];
    $services = $data['services'] ?? [];

    // Validation
    if (empty($name) || empty($description) || empty($location)) {
        http_response_code(400);
        die(json_encode(['error' => 'Name, description, and location are required']));
    }

    if ($price <= 0 || $capacity <= 0) {
        http_response_code(400);
        die(json_encode(['error' => 'Price and capacity must be positive numbers']));
    }

    $imagesJson = json_encode($images);
    $servicesJson = json_encode($services);
    
    $updateStmt = $pdo->prepare("
        UPDATE halls 
        SET name = ?, description = ?, location = ?, price = ?, capacity = ?, images = ?, services = ?
        WHERE id = ?
        RETURNING id, name, description, location, price, capacity, images, services, owner_id
    ");
    
    $updateStmt->execute([$name, $description, $location, $price, $capacity, $imagesJson, $servicesJson, $hallId]);
    $updatedHall = $updateStmt->fetch(PDO::FETCH_ASSOC);
    
    $updatedHall['images'] = json_decode($updatedHall['images'], true);
    $updatedHall['services'] = json_decode($updatedHall['services'], true);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Hall updated successfully',
        'hall' => $updatedHall
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
