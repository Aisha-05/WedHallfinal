<?php
// Router script for PHP development server

// Let the server handle real files and directories
if (is_file(__DIR__ . $_SERVER["REQUEST_URI"]) || is_dir(__DIR__ . $_SERVER["REQUEST_URI"])) {
    return false;
}

// Skip routing for static files (but not uploads)
if (preg_match('/\.(js|css|svg|ico|json|txt|xml|woff|woff2|ttf|eot)$/', $_SERVER["REQUEST_URI"])) {
    return false;  // Let the server handle static files
}

// Handle uploads directory (serve files from parent directory)
if (strpos($_SERVER["REQUEST_URI"], '/uploads/') === 0) {
    // The uploads directory is in the parent directory
    $filePath = dirname(__DIR__) . $_SERVER["REQUEST_URI"];
    
    // Check if file exists and is readable
    if (file_exists($filePath) && is_file($filePath)) {
        // Determine content type
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        $contentTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp'
        ];
        
        if (isset($contentTypes[$ext])) {
            header('Content-Type: ' . $contentTypes[$ext]);
            header('Cache-Control: public, max-age=2592000'); // 30 days
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
            exit;
        }
    }
    
    // File not found - return 404
    http_response_code(404);
    header('Content-Type: application/json');
    die(json_encode(['error' => 'File not found']));
}

// Route all other requests to index.php
$_SERVER["SCRIPT_NAME"] = "/index.php";
$_SERVER["SCRIPT_FILENAME"] = __DIR__ . "/index.php";
require_once __DIR__ . '/index.php';
?>
