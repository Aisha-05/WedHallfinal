<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(400);
    die(json_encode(['error' => 'Only PUT method allowed']));
}

checkAuth();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

$name = trim($data['name'] ?? '');

// Validation
if (empty($name)) {
    http_response_code(400);
    die(json_encode(['error' => 'Name is required']));
}

try {
    // Update user profile
    $stmt = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
    $stmt->execute([$name, $_SESSION['user_id']]);

    // Update session
    $_SESSION['name'] = $name;

    // Get updated user data
    $stmt = $pdo->prepare("SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
