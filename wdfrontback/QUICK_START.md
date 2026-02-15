# Quick Start Guide

## Installation Steps

### Step 1: Prerequisites

Make sure you have installed:

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **PHP** (v7.4+) - [Download](https://www.php.net/)
- **PostgreSQL** (v12+) - [Download](https://www.postgresql.org/)

### Step 2: Automatic Setup (Recommended)

**On Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**

```bash
setup.cmd
```

### Step 3: Manual Setup (If automatic fails)

**1. Install Frontend Dependencies:**

```bash
cd frontend
npm install
cd ..
```

**2. Setup Database:**

```bash
# Make sure PostgreSQL is running, then:
php backend/setup_database.php
```

### Step 4: Start the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
php -S localhost:8000
```

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Verify Installation

### Frontend is working if:

- You see the Wedding Hall Booking homepage
- Page loads without errors
- Styling is visible (purple and pink colors)

### Backend is working if:

- `/backend` folder accessible at `http://localhost:8000`
- No connection errors in browser console

### Database is working if:

- `php backend/setup_database.php` completes without errors
- You can create user accounts and data persists

## Test the Application

### As a Client:

1. Sign up as "Client"
2. Browse halls
3. Add to favorites
4. Request a booking
5. Check booking status in "My Bookings"

### As an Owner:

1. Sign up as "Owner"
2. Go to "Dashboard"
3. Add a new hall
4. View booking requests
5. Approve/reject bookings

## Troubleshooting

### "Cannot connect to backend"

- Check backend running: `lsof -i :8000` (Mac/Linux)
- Make sure `php -S` is running in backend folder

### "Database connection failed"

- Check PostgreSQL is running
- Run `php backend/setup_database.php` again
- Verify credentials in `backend/config/database.php`

### "npm install fails"

- Try `npm install --legacy-peer-deps`
- Delete `package-lock.json` and try again

### "Port already in use"

- Change port in `frontend/vite.config.js` (port: 3001)
- Or kill process: `lsof -i :3000` (Mac/Linux)

## Project URLs

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Database    | localhost:5432        |

## Database

Default credentials (change in production):

- **Database**: wedding_hall_db
- **User**: postgres
- **Password**: postgres
- **Port**: 5432

## Features Overview

### Available for Everyone

- 👀 Browse wedding halls
- 📖 View hall details
- 🔍 Search and filter

### For Clients (After Login)

- ❤️ Add/remove favorites
- 📅 Book halls
- 👤 View profile
- 📝 Check booking status

### For Owners (After Login)

- 🏛️ Add/edit/delete halls
- 📸 Upload hall images
- 📊 View booking requests
- ✅ Approve/reject bookings

## Next Steps

1. **Customize** the theme colors in `tailwind.config.js`
2. **Add more features** like ratings, reviews, payments
3. **Deploy** to production with proper database and SSL
4. **Connect** payment gateway for real bookings
5. **Setup email** notifications for bookings

## Need Help?

- Check README.md for detailed documentation
- See backend/README.md for API details
- See frontend/README.md for frontend architecture

## Production Deployment

For production:

1. **Backend**: Deploy to web server with Apache/Nginx
2. **Frontend**: Build and deploy to static host
3. **Database**: Use managed PostgreSQL service
4. **SSL**: Enable HTTPS everywhere
5. **Environment**: Use proper credentials, not defaults

---

Happy booking! 💍
