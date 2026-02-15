<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkAuth();

// Check if file was uploaded
if (!isset($_FILES['profile_picture']) || empty($_FILES['profile_picture']['name'])) {
    http_response_code(400);
    die(json_encode(['error' => 'No file uploaded']));
}

$file = $_FILES['profile_picture'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileError = $file['error'];
$fileSize = $file['size'];
$fileType = $file['type'];

// Check for upload errors
if ($fileError !== UPLOAD_ERR_OK) {
    http_response_code(400);
    die(json_encode(['error' => 'Error uploading file']));
}

// Validate file size (max 2MB)
$maxFileSize = 2 * 1024 * 1024;
if ($fileSize > $maxFileSize) {
    http_response_code(400);
    die(json_encode(['error' => 'File size exceeds 2MB limit']));
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid file type. Only images are allowed']));
}

try {
    // Create uploads directory if it doesn't exist
    $uploadDir = __DIR__ . '/../../uploads/profile_pictures/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $uniqueName = 'profile_' . $_SESSION['user_id'] . '_' . time() . '.' . $fileExtension;
    $uploadPath = $uploadDir . $uniqueName;

    // Move uploaded file
    if (!move_uploaded_file($fileTmpName, $uploadPath)) {
        http_response_code(500);
        die(json_encode(['error' => 'Failed to save file']));
    }

    // Store relative URL path
    $imageUrl = '/uploads/profile_pictures/' . $uniqueName;

    // Update user profile picture in database
    $stmt = $pdo->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $stmt->execute([$imageUrl, $_SESSION['user_id']]);

    // Get updated user data
    $stmt = $pdo->prepare("SELECT id, name, email, role, profile_picture, created_at FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profile picture uploaded successfully',
        'user' => $user
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
