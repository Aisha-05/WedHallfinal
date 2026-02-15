#!/bin/bash

# Wedding Hall Booking Application - Quick Start Script

echo "🎊 Wedding Hall Booking Application - Setup"
echo "==========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL server is running."
fi

echo "✅ All prerequisites found!"
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed!"
cd ..
echo ""

# Setup database
echo "Setting up database..."
echo "Make sure PostgreSQL is running!"
php backend/setup_database.php

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
else
    echo "⚠️  Database setup had an issue. Please run 'php backend/setup_database.php' manually."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start developing:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && php -S localhost:8000 router.php"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
