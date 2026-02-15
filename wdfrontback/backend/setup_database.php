<?php
// Database initialization script
// Run this in terminal: php setup_database.php

require_once 'config/database.php';

try {
    // Drop tables if they exist (order matters due to foreign keys)
    $pdo->exec("DROP TABLE IF EXISTS ratings");
    $pdo->exec("DROP TABLE IF EXISTS bookings");
    $pdo->exec("DROP TABLE IF EXISTS favorites");
    $pdo->exec("DROP TABLE IF EXISTS halls");
    $pdo->exec("DROP TABLE IF EXISTS users");

    // Create users table
    $pdo->exec("
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'owner')),
            profile_picture VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create halls table
    $pdo->exec("
        CREATE TABLE halls (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            location VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            capacity INT NOT NULL,
            images JSONB,
            services JSONB,
            owner_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");

    // Create favorites table
    $pdo->exec("
        CREATE TABLE favorites (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            hall_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, hall_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
        )
    ");

    // Create bookings table
    $pdo->exec("
        CREATE TABLE bookings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            hall_id INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
        )
    ");

    // Create ratings table
    $pdo->exec("
        CREATE TABLE ratings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            hall_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, hall_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
        )
    ");

    echo "Database tables created successfully!";

} catch (PDOException $e) {
    die("Error creating tables: " . $e->getMessage());
}
?>
