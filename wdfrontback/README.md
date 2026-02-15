# Wedding Hall Booking Application

A complete full-stack wedding hall booking web application with React.js frontend and PHP backend using PostgreSQL database.

## Project Structure

```
wdfrontback/
├── frontend/          # React.js + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── api.js         # API calls
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── backend/           # PHP backend
    ├── config/
    │   └── database.php
    ├── auth/
    │   ├── signup.php
    │   ├── login.php
    │   ├── logout.php
    │   └── me.php
    ├── halls/
    ├── favorites/
    ├── bookings/
    ├── middleware/
    └── setup_database.php
```

## Prerequisites

- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE wedding_hall_db;"
```

Or configure your PostgreSQL credentials in `/backend/config/database.php` if needed:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'wedding_hall_db');
define('DB_USER', 'postgres');
define('DB_PASS', 'postgres');
define('DB_PORT', '5432');
```

Then run the database setup script:

```bash
cd backend
php setup_database.php
```

### 2. Frontend Setup

Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### 3. Backend Setup

Start the PHP built-in server (or use Apache):

```bash
cd backend
php -S localhost:8000
```

Or for Apache, configure a virtual host to point to the `/backend` directory.

The backend will be available at: `http://localhost:8000`

## Features

### Guest Access

- Browse all wedding halls
- View hall details
- See pricing and capacity
- Login/Signup

### Client Features

- Create account
- Browse and search halls
- Add/remove favorites
- Request bookings
- View booking history and status
- Manage profile

### Owner Features

- Create account as hall owner
- Add/edit/delete halls
- Upload multiple images per hall
- View booking requests
- Approve/reject bookings
- Manage pricing and capacity

## Authentication

The application uses **PHP Sessions** for authentication:

- Passwords are hashed using `password_hash()` with bcrypt
- User sessions are stored server-side
- Frontend sends credentials via JSON with `credentials: 'include'` for CORS

### User Roles

1. **Guest**: Can browse without logging in
2. **Client**: Can book halls, add favorites, manage profile
3. **Owner**: Can manage halls and booking requests

## API Endpoints

### Authentication

- `POST /auth/signup.php` - User registration
- `POST /auth/login.php` - User login
- `POST /auth/logout.php` - User logout
- `GET /auth/me.php` - Get current user info

### Halls

- `GET /halls/getHalls.php` - Get all halls
- `GET /halls/getHall.php?id={id}` - Get hall details
- `POST /halls/addHall.php` - Add new hall (Owner only)
- `PUT /halls/updateHall.php?id={id}` - Update hall (Owner only)
- `DELETE /halls/deleteHall.php?id={id}` - Delete hall (Owner only)

### Favorites

- `GET /favorites/getFavorites.php` - Get user's favorites (Client only)
- `POST /favorites/addFavorite.php` - Add to favorites (Client only)
- `DELETE /favorites/removeFavorite.php?id={id}` - Remove from favorites (Client only)

### Bookings

- `GET /bookings/getBookings.php` - Get bookings
- `POST /bookings/createBooking.php` - Create booking (Client only)
- `PUT /bookings/updateBooking.php?id={id}` - Update booking status (Owner only)

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **TailwindCSS** - Styling
- **Fetch API** - HTTP requests

### Backend

- **PHP 7.4+** - Server-side language
- **PDO** - Database abstraction
- **PostgreSQL** - Database

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Building for Production

Frontend:

```bash
cd frontend
npm run build
# Output in dist/ folder
```

Backend:

- Deploy the entire `/backend` folder to your web server
- Update database credentials in `/backend/config/database.php`

## Testing

### Test Accounts

You can create test accounts during signup, or use these flows:

1. **Client Flow**:
   - Sign up as client
   - Browse halls
   - Add to favorites
   - Request booking
   - Check booking status

2. **Owner Flow**:
   - Sign up as owner
   - Add new hall
   - View booking requests
   - Approve/reject bookings

## Directory Structure Details

### Frontend Components

- `Navbar.jsx` - Navigation bar with role-based menu
- `Footer.jsx` - Footer component
- `HallCard.jsx` - Hall card in grid/list view

### Frontend Pages

- `HomePage.jsx` - Landing page
- `HallsPage.jsx` - Browse halls with filters
- `HallDetailPage.jsx` - Hall details and booking
- `LoginPage.jsx` - Login form
- `SignupPage.jsx` - Registration form
- `ProfilePage.jsx` - User profile
- `FavoritesPage.jsx` - User's favorite halls
- `BookingsPage.jsx` - User's bookings
- `OwnerDashboard.jsx` - Owner dashboard
- `AddHallPage.jsx` - Add new hall form
- `EditHallPage.jsx` - Edit hall form

## Key Features Implementation

### Responsive Design

- Mobile-first approach with TailwindCSS
- Breakpoints for mobile, tablet, desktop
- Touch-friendly buttons and inputs

### Session Management

- PHP sessions with secure cookies
- Automatic session check on app load
- Session-based role verification

### Error Handling

- Frontend validation before API calls
- Backend validation for all inputs
- User-friendly error messages
- HTTP status codes (401, 403, 404, 500)

### Security Considerations

- Password hashing with bcrypt
- Protected API endpoints with middleware
- Session-based CSRF protection
- Input validation and sanitization

## Troubleshooting

### CORS Issues

Make sure your backend CORS headers in `/backend/config/database.php` allow your frontend URL.

### Database Connection Failed

- Check PostgreSQL is running
- Verify credentials in `/backend/config/database.php`
- Ensure database `wedding_hall_db` exists

### Frontend not connecting to backend

- Check backend server is running on `localhost:8000`
- Verify proxy settings in `frontend/vite.config.js`
- Check browser console for error details

### Session not persisting

- Ensure `credentials: 'include'` in fetch calls
- Check cookie settings in browser
- Verify PHP session configuration

## License

This project is provided as-is for educational purposes.

## Support

For issues or questions, please contact: support@wedhall.com

---

**Created with ❤️ for beautiful weddings**
