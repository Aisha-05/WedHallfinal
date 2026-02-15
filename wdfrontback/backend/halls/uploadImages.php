<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkOwner();

// Create uploads directory if it doesn't exist
$uploadDir = __DIR__ . '/../../uploads/halls/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Check if files were uploaded
if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
    http_response_code(400);
    die(json_encode(['error' => 'No files uploaded']));
}

$uploadedFiles = [];
$errors = [];
$maxFileSize = 5 * 1024 * 1024; // 5MB
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Process each uploaded file
for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
    $fileName = $_FILES['images']['name'][$i];
    $fileTmpName = $_FILES['images']['tmp_name'][$i];
    $fileError = $_FILES['images']['error'][$i];
    $fileSize = $_FILES['images']['size'][$i];
    $fileType = $_FILES['images']['type'][$i];

    // Check for upload errors
    if ($fileError !== UPLOAD_ERR_OK) {
        $errors[] = "Error uploading {$fileName}";
        continue;
    }

    // Validate file size
    if ($fileSize > $maxFileSize) {
        $errors[] = "{$fileName} exceeds maximum file size of 5MB";
        continue;
    }

    // Validate file type
    if (!in_array($fileType, $allowedTypes)) {
        $errors[] = "{$fileName} is not a valid image format";
        continue;
    }

    // Generate unique filename
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $uniqueName = $_SESSION['user_id'] . '_' . time() . '_' . uniqid() . '.' . $fileExtension;
    $uploadPath = $uploadDir . $uniqueName;

    // Move uploaded file
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        // Store relative URL path
        $imageUrl = '/uploads/halls/' . $uniqueName;
        $uploadedFiles[] = $imageUrl;
    } else {
        $errors[] = "Failed to save {$fileName}";
    }
}

// Return response
if (empty($uploadedFiles) && !empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => 'Failed to upload images: ' . implode(', ', $errors)]);
} else {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'images' => $uploadedFiles,
        'errors' => $errors
    ]);
}
?>
