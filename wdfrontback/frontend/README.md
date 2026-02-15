# Frontend - Wedding Hall Booking React App

Built with React 18, Vite, TailwindCSS, and React Router.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Folder Structure

```
src/
├── components/      # Reusable components (Navbar, Footer, HallCard)
├── pages/          # Page components (Home, Halls, Login, etc.)
├── context/        # React Context for auth state
├── api.js          # API service for backend communication
├── App.jsx         # Main app with routing
└── index.css       # Global styles with Tailwind
```

## Environment

Make sure the backend is running on `http://localhost:8000` (see backend/README.md)

The Vite config proxies all `/backend` requests to the backend server.

## Architecture

- **Context API** for authentication state
- **React Router v6** for client-side routing
- **Protected Routes** based on user role (client/owner)
- **TailwindCSS** for responsive styling
- **Fetch API** for HTTP requests (supports sessions with credentials)

## Pages & Routes

| Route                | Component      | Required Auth | Allowed Roles |
| -------------------- | -------------- | ------------- | ------------- |
| /                    | HomePage       | No            | All           |
| /halls               | HallsPage      | No            | All           |
| /halls/:id           | HallDetailPage | No            | All           |
| /login               | LoginPage      | -             | Guests        |
| /signup              | SignupPage     | -             | Guests        |
| /profile             | ProfilePage    | Yes           | Client        |
| /favorites           | FavoritesPage  | Yes           | Client        |
| /bookings            | BookingsPage   | Yes           | Client        |
| /owner/dashboard     | OwnerDashboard | Yes           | Owner         |
| /owner/add-hall      | AddHallPage    | Yes           | Owner         |
| /owner/edit-hall/:id | EditHallPage   | Yes           | Owner         |

## Styling

- Custom TailwindCSS theme with purple primary and pink secondary colors
- Responsive grid layouts for mobile, tablet, desktop
- Custom classes defined in `index.css`: `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.card`, `.input-field`

## Key Components

### Navbar

- Dynamic menu based on auth status and role
- Links to role-specific pages
- Logout button

### HallCard

- Displays hall with image, name, price, capacity
- Favorite toggle for clients
- Responsive grid layout

### Forms

- Controlled components with React state
- Client-side validation
- Error handling

## API Integration

All API calls go through `/src/api.js`:

```javascript
import { authAPI, hallsAPI, bookingsAPI, favoritesAPI } from "./api";

// Example usage
const user = await authAPI.login({ email, password });
const halls = await hallsAPI.getAll();
```

Includes error handling, JSON serialization, and session credentials.
