<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    die(json_encode(['error' => 'Only GET method allowed']));
}

$hallId = $_GET['id'] ?? null;

if (!$hallId) {
    http_response_code(400);
    die(json_encode(['error' => 'Hall ID is required']));
}

try {
    // Get average rating and count
    $stmt = $pdo->prepare("
        SELECT 
            ROUND(AVG(rating)::numeric, 1) as average_rating,
            COUNT(*) as total_ratings
        FROM ratings 
        WHERE hall_id = ?
    ");
    $stmt->execute([$hallId]);
    $ratingStats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get current user's rating (if logged in)
    $userRating = null;
    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("
            SELECT rating, created_at, updated_at 
            FROM ratings 
            WHERE hall_id = ? AND user_id = ?
        ");
        $stmt->execute([$hallId, $_SESSION['user_id']]);
        $userRating = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'average_rating' => floatval($ratingStats['average_rating'] ?? 0),
        'total_ratings' => intval($ratingStats['total_ratings'] ?? 0),
        'user_rating' => $userRating
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Database error: ' . $e->getMessage()]));
}
?>
