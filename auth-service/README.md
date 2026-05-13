# 🎯 Quizzy — Auth Service

Authentication microservice for the Quizzy platform. Handles user registration with OTP-first verification, JWT authentication (token in headers), Redis-backed rate limiting, and password management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Registration Flow](#-registration-flow)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Rate Limiting](#-rate-limiting)
- [Mongoose Hooks](#-mongoose-hooks)
- [Error Responses](#-error-responses)
- [Notes](#-notes)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **OTP-First Registration** | User is NOT saved to DB until email OTP is verified |
| **JWT in Response Headers** | Token sent via `Authorization` & `X-Auth-Token` response headers |
| **Token Payload** | JWT contains `id`, `name`, `username`, `role` |
| **Email OTP** | Beautiful HTML OTP emails via Gmail SMTP (Nodemailer) |
| **Rate Limiting** | Redis-backed per-route rate limiting with in-memory fallback |
| **Zod Validation** | Schema-based input validation on every endpoint |
| **RBAC** | Role-based access control middleware (`student`, `teacher`, `admin`) |
| **Password Management** | Forgot/reset via OTP, change password (authenticated) |
| **bcrypt Hashing** | Password hashing with 12 salt rounds via Mongoose `pre('save')` hook |
| **Logging** | Winston (application) + Morgan (HTTP requests) |
| **Graceful Fallback** | Works without Redis using in-memory store for local dev |

---

## 🛠 Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| Node.js       | Runtime                          |
| Express.js    | Web framework                    |
| MongoDB       | Database                         |
| Mongoose      | ODM (with `pre`/`post` hooks)    |
| JWT           | Authentication tokens            |
| bcrypt        | Password hashing (12 salt rounds)|
| Zod           | Request body validation          |
| Nodemailer    | OTP email delivery (Gmail SMTP)  |
| ioredis       | Redis client for rate limiting & OTP storage |
| Winston       | Application logging              |
| Morgan        | HTTP request logging             |
| nodemon       | Dev auto-restart                 |

---

## 📁 Folder Structure

```
auth-service/
├── .env                               # Environment variables (git-ignored)
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── server.js                      # Entry point — connects MongoDB, Redis, starts Express
    ├── app.js                         # Express app — CORS, Morgan, routes, error handlers
    │
    ├── config/
    │   ├── db.js                      # MongoDB connection via Mongoose
    │   └── redis.js                   # Redis connection (ioredis) with in-memory fallback
    │
    ├── models/
    │   └── User.js                    # User schema with bcrypt pre/post hooks
    │
    ├── controllers/
    │   └── auth.controller.js         # Route handlers — sets token in response headers
    │
    ├── services/
    │   ├── auth.service.js            # Business logic — register, login, password flows
    │   └── otp.service.js             # OTP generation, email sending, verification, pending storage
    │
    ├── middlewares/
    │   ├── auth.middleware.js          # JWT Bearer token verification + RBAC authorize()
    │   ├── rateLimiter.middleware.js   # Redis/memory-backed per-IP rate limiting
    │   ├── validate.middleware.js      # Zod schema validation middleware factory
    │   └── error.middleware.js         # Global error handler + 404 handler
    │
    ├── utils/
    │   ├── jwt.js                     # generateToken() & verifyToken()
    │   ├── logger.js                  # Winston logger (console + file in production)
    │   └── validators.js              # Zod schemas for all endpoints
    │
    └── routes/
        └── auth.routes.js             # Route definitions with middleware chains
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** >= 18
- **MongoDB** Atlas cluster (or local MongoDB)
- **Gmail** account with App Password enabled
- **Redis** (optional — in-memory fallback for local dev)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/vishu9334/Quizzy.git
cd Quizzy/auth-service

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env and fill in your credentials (see section below)

# 4. Start the server
npm run dev       # Development (auto-restart with nodemon)
npm start         # Production
```

Server starts at **`http://localhost:8001`**

---

## 🔐 Environment Variables

Create `.env` in `auth-service/` root:

```env
# Server
PORT=8001
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/quizzy_auth?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Redis (optional — leave empty for in-memory fallback)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password

# OTP Config
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail"

---

## 🔄 Registration Flow

**OTP-first approach — user is only created in DB after email verification:**

```
 Client                          Server                         Gmail
   │                               │                              │
   │  POST /api/auth/register      │                              │
   │  {name,username,email,pass}   │                              │
   │──────────────────────────────>│                              │
   │                               │── Validate (Zod)             │
   │                               │── Check duplicates (MongoDB) │
   │                               │── Store pending data (Redis) │
   │                               │── Generate 6-digit OTP       │
   │                               │──────────────────────────────>│ Send OTP email
   │  200: "OTP sent to email"     │                              │
   │<──────────────────────────────│                              │
   │                               │                              │
   │  User reads OTP from email    │                              │
   │                               │                              │
   │  POST /api/auth/verify-register                              │
   │  {email, otp}                 │                              │
   │──────────────────────────────>│                              │
   │                               │── Verify OTP                 │
   │                               │── Retrieve pending data      │
   │                               │── Re-check duplicates        │
   │                               │── Create user (bcrypt hash)  │
   │                               │── Generate JWT token         │
   │                               │                              │
   │  201 + Headers:               │                              │
   │  Authorization: Bearer <jwt>  │                              │
   │  X-Auth-Token: <jwt>          │                              │
   │<──────────────────────────────│                              │
   │                               │                              │
   │  ✅ Registration complete!     │                              │
```

> If OTP expires (5 min), use `POST /api/auth/resend-otp` (max 3 sends per 10 min per email)

---

## 📡 API Endpoints

**Base URL:** `http://localhost:8001/api/auth`

### Public Routes

#### `GET /health` — Health Check
```json
// Response 200
{ "success": true, "service": "auth-service", "status": "healthy", "timestamp": "..." }
```

---

#### `POST /register` — Step 1: Send OTP
Validates input, checks duplicates, stores pending data, sends OTP email. **User NOT saved to DB.**

**Rate Limit:** 10 req / 15 min

```json
// Request Body
{ "name": "Vishal Kumar", "username": "vishal_k", "email": "vishal@gmail.com", "password": "mypass123", "role": "student" }

// Response 200
{ "success": true, "message": "OTP sent to your email. Please verify to complete registration.", "email": "vishal@gmail.com" }
```

---

#### `POST /verify-register` — Step 2: Verify OTP & Create User
Verifies OTP, creates user in DB (with `isEmailVerified: true`), returns JWT **in response headers**.

**Rate Limit:** 5 req / 10 min

```json
// Request Body
{ "email": "vishal@gmail.com", "otp": "768768" }

// Response Headers
// Authorization: Bearer eyJhbGciOi...
// X-Auth-Token: eyJhbGciOi...

// Response 201
{
  "success": true,
  "message": "Registration successful. Email verified.",
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "Vishal Kumar", "username": "vishal_k", "email": "vishal@gmail.com", "role": "student" }
}
```

---

#### `POST /resend-otp` — Resend Registration OTP
**Rate Limit:** 5 req / 10 min

```json
// Request
{ "email": "vishal@gmail.com" }

// Response 200
{ "success": true, "message": "OTP resent. Please check your email." }
```

---

#### `POST /login` — Login
Returns JWT **in response headers**.

**Rate Limit:** 10 req / 15 min

```json
// Request
{ "email": "vishal@gmail.com", "password": "mypass123" }

// Response Headers
// Authorization: Bearer eyJhbGciOi...
// X-Auth-Token: eyJhbGciOi...

// Response 200
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "Vishal Kumar", "username": "vishal_k", "email": "vishal@gmail.com", "role": "student" }
}
```

---

#### `POST /forgot-password` — Send Password Reset OTP
**Rate Limit:** 5 req / 10 min

```json
// Request
{ "email": "vishal@gmail.com" }

// Response 200
{ "success": true, "message": "Password reset OTP sent to your email." }
```

---

#### `POST /reset-password` — Reset Password with OTP
**Rate Limit:** 5 req / 10 min

```json
// Request
{ "email": "vishal@gmail.com", "otp": "123456", "newPassword": "newpass456" }

// Response 200
{ "success": true, "message": "Password reset successful. You can now log in with your new password." }
```

---

### Protected Routes

> Requires `Authorization: Bearer <token>` in request headers

#### `GET /me` — Get My Profile

```json
// Response 200
{
  "success": true,
  "user": {
    "id": "...", "name": "Vishal Kumar", "username": "vishal_k",
    "email": "vishal@gmail.com", "role": "student",
    "isEmailVerified": true, "createdAt": "2026-05-13T09:43:28.000Z"
  }
}
```

---

#### `POST /change-password` — Change Password (Authenticated)
Returns a **fresh JWT token** in response headers.

```json
// Request
{ "currentPassword": "mypass123", "newPassword": "newpass456" }

// Response Headers
// Authorization: Bearer eyJhbGciOi... (fresh token)
// X-Auth-Token: eyJhbGciOi...

// Response 200
{ "success": true, "message": "Password changed successfully.", "token": "eyJhbGciOi..." }
```

---

## 🔑 Authentication

### JWT Token Payload

```json
{
  "id": "6a0447bc9a59fb072f7c0b96",
  "name": "Vishal Kumar",
  "username": "vishal_k",
  "role": "student",
  "iat": 1778666943,
  "exp": 1779271743
}
```

### Token Delivery

Tokens are sent in **response headers** on these endpoints:

| Endpoint | Header |
|----------|--------|
| `POST /verify-register` | `Authorization: Bearer <token>` + `X-Auth-Token: <token>` |
| `POST /login` | `Authorization: Bearer <token>` + `X-Auth-Token: <token>` |
| `POST /change-password` | `Authorization: Bearer <token>` (fresh) + `X-Auth-Token: <token>` |

Token is also included in the response body for convenience.

### How to Authenticate

Send the token in the **request `Authorization` header** for protected routes:
```
Authorization: Bearer eyJhbGciOi...
```

### RBAC (Role-Based Access Control)

The `authorize()` middleware is available for restricting routes by role:

```javascript
// Only admins
router.get("/admin-panel", authenticate, authorize("admin"), handler);

// Teachers and admins
router.post("/create-quiz", authenticate, authorize("teacher", "admin"), handler);
```

Available roles: `student`, `teacher`, `admin`

---

## 🛡 Rate Limiting

All rate limits are enforced **per IP** using Redis (or in-memory fallback).

| Route | Limit | Window | Middleware |
|-------|-------|--------|------------|
| All endpoints | 100 req | 15 min | `globalLimiter` |
| `/register`, `/login` | 10 req | 15 min | `authLimiter` |
| `/verify-register`, `/resend-otp`, `/forgot-password`, `/reset-password` | 5 req | 10 min | `otpLimiter` |
| OTP email sending (internal) | 3 sends | 10 min | Per-email throttle in `otp.service.js` |

**Response headers on every request:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1778667830251
```

---

## 🪝 Mongoose Hooks

The `User` model uses Mongoose `pre` and `post` hooks:

| Hook | Type | Purpose |
|------|------|---------|
| `pre('save')` | Async | Hashes password with **bcrypt** (12 salt rounds) if password field is modified |
| `post('save')` | Sync | Logs successful user save to console |
| `post('save')` | Error | Catches MongoDB duplicate key errors (E11000) and returns clean error message |

**Instance Method:**
- `user.comparePassword(candidatePassword)` — uses `bcrypt.compare()` to verify passwords

```javascript
// pre('save') — runs before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// post('save') — runs after successful save
userSchema.post("save", function (doc) {
  console.log(`[User Model] User saved successfully: ${doc.email} (${doc._id})`);
});

// post('save') error handler — catches duplicate key errors
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) { ... }
});
```

---

## ❌ Error Responses

All errors follow a consistent JSON format:

| Status | Scenario | Example Message |
|--------|----------|-----------------|
| `400` | Validation failed | `"Validation failed."` + `errors[]` array |
| `400` | Invalid/expired OTP | `"OTP has expired or does not exist."` |
| `401` | No token | `"Access denied. No token provided."` |
| `401` | Invalid credentials | `"Invalid email or password."` |
| `401` | Expired token | `"Token has expired. Please log in again."` |
| `403` | Email not verified | `"Please verify your email before logging in."` |
| `403` | Wrong role | `"Access forbidden. Required role(s): admin."` |
| `404` | Route not found | `"Route GET /api/auth/unknown not found."` |
| `409` | Duplicate email/username | `"Email is already registered."` |
| `429` | Rate limited | `"Too many requests..."` + `retryAfter` |
| `500` | Server error | `"An unexpected error occurred."` |

**Validation error example:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

## 📝 Notes

- **OTP expiry:** 5 minutes (configurable via `OTP_EXPIRY_MINUTES`)
- **OTP length:** 6 digits (configurable via `OTP_LENGTH`)
- **JWT expiry:** 7 days (configurable via `JWT_EXPIRES_IN`)
- **Password hashing:** bcrypt with 12 salt rounds via Mongoose `pre('save')` hook
- **Redis fallback:** If Redis is unavailable, in-memory store is used automatically (data lost on restart — use Redis in production)
- **CORS:** `Authorization` and `X-Auth-Token` headers are exposed via `Access-Control-Expose-Headers` so frontend can read them
- **Service port:** `8001` (as per microservice architecture)
- **Fail-open rate limiting:** If Redis/memory store errors, requests are allowed through (logged as error)

---

## 👥 Team

- **Backend Lead:** Chaitanya
- **Service:** Auth Service — Part of the Quizzy microservice architecture

---
