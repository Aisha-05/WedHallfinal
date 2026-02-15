<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkClient();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

$hallId = isset($data['hall_id']) ? intval($data['hall_id']) : null;
$startDate = trim($data['start_date'] ?? '');
$endDate = trim($data['end_date'] ?? '');

// Validation
if (!$hallId || empty($startDate) || empty($endDate)) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID, start date, and end date are required']));
}

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $startDate) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $endDate)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid date format. Use YYYY-MM-DD']));
}

// Validate date range
if (strtotime($startDate) > strtotime($endDate)) {
    http_response_code(400);
    die(json_encode(['error' => 'Start date must be before end date']));
}

// Validate dates are not in the past
$today = date('Y-m-d');
if (strtotime($startDate) < strtotime($today)) {
    http_response_code(400);
    die(json_encode(['error' => 'Start date cannot be in the past']));
}

try {
    // Check if hall exists
    $hallStmt = $pdo->prepare("SELECT id FROM halls WHERE id = ?");
    $hallStmt->execute([$hallId]);
    
    if ($hallStmt->rowCount() === 0) {
        http_response_code(404);
        die(json_encode(['error' => 'Hall not found or no longer available']));
    }
    
    // Check for booking conflicts - overlapping approved bookings
    $conflictStmt = $pdo->prepare("
        SELECT id FROM bookings 
        WHERE hall_id = ? 
        AND status = 'approved'
        AND (
            (start_date <= ? AND end_date >= ?)
            OR (start_date <= ? AND end_date >= ?)
            OR (start_date >= ? AND end_date <= ?)
        )
    ");
    
    $conflictStmt->execute([
        $hallId,
        $endDate, $startDate,      // Check if existing booking overlaps with our start
        $endDate, $startDate,      // Check if existing booking contains our range
        $startDate, $endDate       // Check if existing booking is within our range
    ]);
    
    if ($conflictStmt->rowCount() > 0) {
        http_response_code(409);
        die(json_encode(['error' => 'This hall is already booked for the requested dates']));
    }
    
    // Create booking
    $stmt = $pdo->prepare("
        INSERT INTO bookings (user_id, hall_id, start_date, end_date, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', NOW())
        RETURNING id, user_id, hall_id, start_date, end_date, status
    ");
    
    $stmt->execute([$_SESSION['user_id'], $hallId, $startDate, $endDate]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Booking created successfully',
        'booking' => $booking
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
