<?php
// Auth Middleware - Check if user is logged in
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        // Log debugging info
        $debug_info = [
            'error' => 'Unauthorized - Please login first',
            'session_id' => session_id(),
            'session_status' => session_status(),
            'session_data_exists' => !empty($_SESSION),
            'php_session_name' => session_name()
        ];
        
        http_response_code(401);
        die(json_encode($debug_info));
    }
}

// Owner Middleware - Check if user is owner
function checkOwner() {
    checkAuth();
    
    if ($_SESSION['role'] !== 'owner') {
        http_response_code(403);
        die(json_encode(['error' => 'Forbidden - Only owners can perform this action']));
    }
}

// Client Middleware - Check if user is client
function checkClient() {
    checkAuth();
    
    if ($_SESSION['role'] !== 'client') {
        http_response_code(403);
        die(json_encode(['error' => 'Forbidden - Only clients can perform this action']));
    }
}
?>
