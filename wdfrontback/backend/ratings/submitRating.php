<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    die(json_encode(['error' => 'Only POST method allowed']));
}

checkAuth();

// Only clients can rate
if ($_SESSION['role'] !== 'client') {
    http_response_code(403);
    die(json_encode(['error' => 'Only clients can rate halls']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

$hallId = $data['hall_id'] ?? null;
$rating = $data['rating'] ?? null;

if (!$hallId || !$rating) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID and rating are required']));
}

if ($rating < 1 || $rating > 5 || !is_numeric($rating)) {
    http_response_code(400);
    die(json_encode(['error' => 'Rating must be a number between 1 and 5']));
}

try {
    // Check if user has booked this hall
    $stmt = $pdo->prepare("
        SELECT id FROM bookings 
        WHERE user_id = ? AND hall_id = ? AND status = 'approved'
        LIMIT 1
    ");
    $stmt->execute([$_SESSION['user_id'], $hallId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(403);
        die(json_encode(['error' => 'You can only rate halls you have booked']));
    }

    // Check if user already rated this hall
    $stmt = $pdo->prepare("SELECT id FROM ratings WHERE user_id = ? AND hall_id = ?");
    $stmt->execute([$_SESSION['user_id'], $hallId]);
    $existingRating = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingRating) {
        // Update existing rating
        $stmt = $pdo->prepare("
            UPDATE ratings 
            SET rating = ?, updated_at = NOW()
            WHERE user_id = ? AND hall_id = ?
        ");
        $stmt->execute([$rating, $_SESSION['user_id'], $hallId]);
        $message = 'Rating updated successfully';
    } else {
        // Insert new rating
        $stmt = $pdo->prepare("
            INSERT INTO ratings (user_id, hall_id, rating)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$_SESSION['user_id'], $hallId, $rating]);
        $message = 'Rating submitted successfully';
    }

    // Get updated stats
    $stmt = $pdo->prepare("
        SELECT 
            ROUND(AVG(rating)::numeric, 1) as average_rating,
            COUNT(*) as total_ratings
        FROM ratings 
        WHERE hall_id = ?
    ");
    $stmt->execute([$hallId]);
    $ratingStats = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'average_rating' => floatval($ratingStats['average_rating'] ?? 0),
        'total_ratings' => intval($ratingStats['total_ratings'] ?? 0),
        'user_rating' => intval($rating)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
