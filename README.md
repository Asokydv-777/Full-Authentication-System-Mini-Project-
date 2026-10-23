Capstone: Full Authentication System

A complete, production-shaped authentication and authorization system built as part of the Phase 7 internship assignment. 

This project demonstrates a secure backend implementation using Node.js and Express, featuring short-lived JWTs, server-side RBAC (Role-Based Access Control), and a secure password reset flow.

## 🚀 Features

- **User Signup**: Secure password hashing using `bcryptjs`.
- **User Login**: Issues short-lived Access Tokens (15m) and longer-lived Refresh Tokens (7d).
- **Token Refresh**: Endpoint to issue a new access token using a valid refresh token.
- **Role-Based Access Control (RBAC)**: Server-side route protection (e.g., `user` vs `admin` roles).
- **Password Reset Flow**: Secure, time-limited, and single-use reset tokens.
- **Security First**: Generic error messages to prevent user enumeration, no passwords returned in API responses.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: `jsonwebtoken` (JWT), `bcryptjs` (Password Hashing)
- **Environment**: `dotenv`
- **Database**: In-memory array (for demonstration purposes; easily swappable with MongoDB/PostgreSQL).

## 📂 Project Structure

```text
├── controllers/
│   └── authController.js    # Core logic for signup, login, reset, etc.
├── middleware/
│   └── authMiddleware.js    # JWT verification and RBAC checks
├── models/
│   └── User.js              # In-memory user storage
├── routes/
│   └── auth.js              # API route definitions
├── .env                     # Environment variables (Secrets)
├── .gitignore               # Ignores node_modules and .env
├── server.js                # Application entry point
└── package.json             # Dependencies and scripts
⚙️ Setup & Installation
Clone the repository:

bash
git clone <your-repo-url>
cd <your-repo-name>
Install dependencies:

bash
npm install
Environment Variables:
Create a .env file in the root directory and add the following:

env
PORT=3000
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_REFRESH_SECRET=a_different_very_secret_key_for_refresh_tokens
Run the server (Development mode):

bash
npm run dev
The server will start on http://localhost:3000.

📡 API Endpoints
Method	Endpoint	Access	Description
POST	/auth/signup	Public	Creates a new user. Returns 201 (no password in response).
POST	/auth/login	Public	Verifies credentials. Returns access & refresh tokens.
POST	/auth/refresh	Public	Accepts a refresh token, returns a new access token.
GET	/auth/profile	Private	Requires valid access token. Returns user info.
GET	/auth/admin/dashboard	Admin Only	Requires valid token + admin role.
POST	/auth/request-reset	Public	Generates a password reset token (returns generic message).
POST	/auth/complete-reset	Public	Verifies token, updates password, invalidates token.
🧪 Testing Procedure (Thunder Client / Postman)
To verify the system works as intended, follow these testing steps in order:

1. Signup & Login
Signup: POST /auth/signup with { "email": "test@example.com", "password": "password123" }.

Verify: Status 201, no password field in response.

Login: POST /auth/login with the same credentials.

Verify: Status 200, receive accessToken and refreshToken.

2. Access & Refresh
Access Protected Route: GET /auth/profile with Header Authorization: Bearer <accessToken>.

Verify: Status 200.

Refresh Token: POST /auth/refresh with { "refreshToken": "<your_refreshToken>" }.

Verify: Status 200, receive a new access token.

3. Role-Based Access Control (RBAC)
Make a user an admin in controllers/authController.js (or the database).

Log in as the admin, get the new token.

Admin Route: GET /auth/admin/dashboard with the new token.

Verify: Status 200.

Try the same route with a user role token.

Verify: Status 403 Forbidden.

4. Password Reset Flow & Security Checks
Request Reset: POST /auth/request-reset with { "email": "test@example.com" }.

Copy the resetToken from the response.

Complete Reset: POST /auth/complete-reset with { "resetToken": "<token>", "newPassword": "newpassword456" }.

Verify: Status 200.

Security Check (Reuse): Try sending the exact same complete-reset request again.

Verify: Status 400 Bad Request (token is single-use).

Security Check (Unknown Email): Call /auth/request-reset with an email that doesn't exist.

Verify: Returns the exact same generic message as a successful request.

🛡️ Security Checklist Verification
☑ Passwords are hashed using bcrypt and never stored or returned as plain text.
☑ Access tokens are short-lived (15m).
☑ Refresh tokens are used to get new access tokens without re-entering credentials.
☑ Login failures and password resets return generic messages (prevents user enumeration).
☑ RBAC is enforced server-side via custom Express middleware.
☑ Reset tokens are single-use (invalidated immediately after use).
☑ Reset tokens expire after a set time (1 hour).
☑ Sensitive data (.env) is excluded from version control via .gitignore.# Full-Authentication-System-Mini-Project-
