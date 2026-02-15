<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(400);
    die(json_encode(['error' => 'Only PUT method allowed']));
}

checkOwner();

$bookingId = $_GET['id'] ?? null;

if (!$bookingId) {
    http_response_code(400);
    die(json_encode(['error' => 'Booking ID is required']));
}

$data = json_decode(file_get_contents('php://input'), true);
$status = trim($data['status'] ?? '');

if (!in_array($status, ['pending', 'approved', 'rejected', 'cancelled'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid status']));
}

try {
    // Verify ownership
    $checkStmt = $pdo->prepare("
        SELECT b.id FROM bookings b
        JOIN halls h ON b.hall_id = h.id
        WHERE b.id = ? AND h.owner_id = ?
    ");
    $checkStmt->execute([$bookingId, $_SESSION['user_id']]);
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        die(json_encode(['error' => 'Booking not found or you do not have permission']));
    }
    
    $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ? RETURNING id, user_id, hall_id, start_date, end_date, status");
    $stmt->execute([$status, $bookingId]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Booking status updated',
        'booking' => $booking
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
