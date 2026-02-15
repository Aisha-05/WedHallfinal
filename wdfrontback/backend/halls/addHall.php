<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkOwner();

// Verify the user exists in the database
try {
    $userCheck = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $userCheck->execute([$_SESSION['user_id']]);
    if ($userCheck->rowCount() === 0) {
        http_response_code(401);
        die(json_encode(['error' => 'User session invalid. Please login again']));
    }
} catch (Exception $e) {
    // Continue if check fails, will catch in main try-catch
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
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

try {
    $imagesJson = json_encode($images);
    $servicesJson = json_encode($services);
    
    $stmt = $pdo->prepare("
        INSERT INTO halls (name, description, location, price, capacity, images, services, owner_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        RETURNING id, name, description, location, price, capacity, images, services, owner_id
    ");
    
    $stmt->execute([$name, $description, $location, $price, $capacity, $imagesJson, $servicesJson, $_SESSION['user_id']]);
    $hall = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $hall['images'] = json_decode($hall['images'], true);
    $hall['services'] = json_decode($hall['services'], true);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Hall added successfully',
        'hall' => $hall
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
