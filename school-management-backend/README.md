# School Management Backend

## Setup
1. Create a MySQL database named `school_db`.
2. Import `database.sql` into your MySQL server.
3. Update `.env` with your MySQL credentials.
4. Run `npm install` to install dependencies.
5. Run `npm start` (or `npx nodemon server.js`) to start the server.

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/stats` - Get dashboard statistics
