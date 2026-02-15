# CORS Configuration for PHP Backend

The backend PHP files are configured to:

1. Accept requests from any origin (_/api/_)
2. Support all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
3. Accept JSON content type
4. Handle preflight requests (OPTIONS)
5. Support credentials for session management

## Frontend to Backend Communication

All frontend API calls use:

```javascript
fetch(url, {
  method: "POST/GET/PUT/DELETE",
  credentials: "include", // Important for session cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

## Session Handling

- Sessions are started in `/backend/config/database.php`
- User data is stored in `$_SESSION['user_id']`, `$_SESSION['role']`, etc.
- Frontend checks session with `/auth/me.php` endpoint on app load
- Session persists across requests due to `credentials: 'include'`

## Notes

- The backend is stateless except for user sessions
- All data is validated both client-side and server-side
- PDO is used for all database queries to prevent SQL injection
- Passwords are hashed using PHP's `password_hash()` function
