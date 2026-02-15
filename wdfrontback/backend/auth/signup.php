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

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$role = trim($data['role'] ?? 'client');

// Validation
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    die(json_encode(['error' => 'Name, email, and password are required']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid email format']));
}

if (strlen($password) < 6) {
    http_response_code(400);
    die(json_encode(['error' => 'Password must be at least 6 characters']));
}

if (!in_array($role, ['client', 'owner'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Role must be either client or owner']));
}

try {
    // Check if email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        die(json_encode(['error' => 'Email already registered']));
    }

    // Hash password and insert user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $insertStmt = $pdo->prepare("
        INSERT INTO users (name, email, password, role, created_at)
        VALUES (?, ?, ?, ?, NOW())
        RETURNING id, name, email, role, profile_picture
    ");
    
    $insertStmt->execute([$name, $email, $hashedPassword, $role]);
    $user = $insertStmt->fetch(PDO::FETCH_ASSOC);
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Signup successful',
        'user' => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
