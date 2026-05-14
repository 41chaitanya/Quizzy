# Auth Service Features

This document summarizes the current authentication service features in the Quizzy backend.

## Overview

The `auth-service` handles user authentication using Express.js, MongoDB, Mongoose, JWT, bcrypt, and cookie-based refresh token handling.

## Features

### User Registration

- Creates a new user with `username`, `email`, and `password`.
- Validates required fields before creating the account.
- Validates email format.
- Validates password strength:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Checks if the email already exists.
- Hashes the password using bcrypt before saving.
- Generates access and refresh tokens after successful registration.
- Saves the refresh token in the database.
- Sends the refresh token in an HTTP-only cookie.

Endpoint:

```http
POST /api/users/register
```

### User Login

- Logs in users with email and password.
- Validates required fields.
- Validates email format.
- Checks if the user exists.
- Compares the password using bcrypt.
- Generates a new access token and refresh token after successful login.
- Saves the refresh token in the database.
- Sends the refresh token in an HTTP-only cookie.
- Returns the access token in the response body.

Endpoint:

```http
POST /api/users/login
```

### User Profile

- Provides a protected profile endpoint.
- Uses authentication middleware before returning the profile.
- Reads the user id from the verified token payload.
- Fetches the user from MongoDB.
- Excludes the password from the profile response.

Endpoint:

```http
GET /api/users/profile
```

### User Logout

- Reads the refresh token from cookies.
- Finds the logged-in user by refresh token.
- Removes the refresh token from the database.
- Clears the refresh token cookie.

Endpoint:

```http
POST /api/users/logout
```

### Authentication Middleware

- Reads `refreshToken` from cookies.
- Verifies the token using `REFRESH_TOKEN_SECRET`.
- Stores the decoded token payload in `req.user`.
- Blocks requests when the token is missing, invalid, or expired.

### JWT Token System

- Generates an access token with:
  - User id
  - Email
  - Role
- Generates a refresh token with:
  - User id
- Token secrets and expiry values are loaded from environment variables.

### User Model

The user model includes:

- `username`
- `email`
- `password`
- `role`
- `refreshToken`
- `createdAt`
- `updatedAt`

The password field uses `select: false` so it is hidden from normal database queries.

## Environment Variables

The service requires these environment variables:

```env
PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRE=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRE=
```

## Current Routes

```http
POST /api/users/register
POST /api/users/login
GET  /api/users/profile
POST /api/users/logout
```
