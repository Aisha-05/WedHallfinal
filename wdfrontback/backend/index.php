<?php
/**
 * Wedding Hall Booking Application - Backend Router
 * This file helps route requests to the correct endpoint
 */

// Get the requested URL
$request = $_GET['route'] ?? '';

// Route requests based on the path
$routes = [
    'auth/signup' => 'auth/signup.php',
    'auth/login' => 'auth/login.php',
    'auth/logout' => 'auth/logout.php',
    'auth/me' => 'auth/me.php',
    'auth/debug' => 'auth/debug.php',
    'auth/updateProfile' => 'auth/updateProfile.php',
    'auth/uploadProfilePicture' => 'auth/uploadProfilePicture.php',
    'halls/get' => 'halls/getHalls.php',
    'halls/getOwner' => 'halls/getOwnerHalls.php',
    'halls/detail' => 'halls/getHall.php',
    'halls/add' => 'halls/addHall.php',
    'halls/update' => 'halls/updateHall.php',
    'halls/delete' => 'halls/deleteHall.php',
    'halls/uploadImages' => 'halls/uploadImages.php',
    'favorites/get' => 'favorites/getFavorites.php',
    'favorites/add' => 'favorites/addFavorite.php',
    'favorites/remove' => 'favorites/removeFavorite.php',
    'bookings/get' => 'bookings/getBookings.php',
    'bookings/create' => 'bookings/createBooking.php',
    'bookings/update' => 'bookings/updateBooking.php',
    'ratings/get' => 'ratings/getRatings.php',
    'ratings/submit' => 'ratings/submitRating.php',
];

// Handle CORS - Allow localhost without strict origin validation
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? 'http://localhost:3001';
if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: ' . ($origin ?? 'http://localhost:3001'));
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database config for all requests
require_once __DIR__ . '/config/database.php';

// Route the request
if (empty($request)) {
    http_response_code(400);
    echo json_encode(['error' => 'API endpoint not specified']);
    exit;
}

if (isset($routes[$request])) {
    require_once $routes[$request];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
    exit;
}
?>
