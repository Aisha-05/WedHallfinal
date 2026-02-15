<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

checkAuth();

try {
    if ($_SESSION['role'] === 'owner') {
        // For owners, get all bookings for their halls
        $stmt = $pdo->prepare("
            SELECT b.id, b.user_id, b.hall_id, b.start_date, b.end_date, b.status, b.created_at,
                   h.name as hall_name, u.name as client_name, u.email as client_email
            FROM bookings b
            JOIN halls h ON b.hall_id = h.id
            JOIN users u ON b.user_id = u.id
            WHERE h.owner_id = ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$_SESSION['user_id']]);
    } else {
        // For clients, get their own bookings
        $stmt = $pdo->prepare("
            SELECT b.id, b.user_id, b.hall_id, b.start_date, b.end_date, b.status, b.created_at,
                   h.name as hall_name, u.name as owner_name, u.email as owner_email
            FROM bookings b
            JOIN halls h ON b.hall_id = h.id
            JOIN users u ON h.owner_id = u.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$_SESSION['user_id']]);
    }
    
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'bookings' => $bookings
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
