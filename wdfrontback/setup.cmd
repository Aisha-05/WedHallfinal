@echo off
REM Wedding Hall Booking Application - Quick Start Script (Windows)

echo.
echo 🎊 Wedding Hall Booking Application - Setup
echo ===========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check PHP
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PHP is not installed. Please install PHP first.
    exit /b 1
)

echo ✅ All prerequisites found!
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo ✅ Frontend dependencies installed!
cd ..
echo.

REM Setup database
echo Setting up database...
echo Make sure PostgreSQL is running!
php backend/setup_database.php

if %ERRORLEVEL% EQU 0 (
    echo ✅ Database setup complete!
) else (
    echo ⚠️  Database setup had an issue. Please run 'php backend/setup_database.php' manually.
)

echo.
echo 🎉 Setup complete!
echo.
echo To start developing:
echo.
echo 1. Start the backend (in one terminal):
echo    cd backend
echo    php -S localhost:8000
echo.
echo 2. Start the frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
