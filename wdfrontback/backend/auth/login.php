<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

// Validation
if (empty($email) || empty($password)) {
    http_response_code(400);
    die(json_encode(['error' => 'Email and password are required']));
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email, password, role, profile_picture FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        die(json_encode(['error' => 'Invalid email or password']));
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        die(json_encode(['error' => 'Invalid email or password']));
    }
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    
    unset($user['password']);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
