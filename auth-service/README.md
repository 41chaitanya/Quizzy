# Auth Service - JWT Authentication Microservice

A production-ready authentication microservice built with Node.js, Express, MongoDB, and JWT.

## Features

✅ **Complete Authentication System**
- User registration with strong validation
- Login with JWT token generation
- Logout with token invalidation
- Protected routes with auth middleware
- Get current user profile

✅ **Security Best Practices**
- Password hashing with bcrypt (10 salt rounds)
- Strong password validation (uppercase, lowercase, digit, special char, 8-32 length)
- JWT access tokens (short-lived) and refresh tokens (long-lived)
- httpOnly cookies with sameSite: strict
- Secure flag for production environments
- Input validation with Zod schemas

✅ **Clean Architecture**
- Repository pattern for data access layer
- Service layer for business logic
- Controller layer for request handling
- Middleware for cross-cutting concerns
- AsyncHandler for clean error handling
- Global error middleware

✅ **Role-Based Access Control (RBAC)**
- Role-based authorization middleware
- Flexible role checking with multiple role support
- Easy to extend for custom roles

✅ **Developer Experience**
- Standardized API response format
- Comprehensive error messages
- Environment variable validation on startup
- Clean and maintainable code structure

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout and clear token
- `GET /auth/me` - Get current user profile (protected)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Cookie Management**: cookie-parser

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
NODE_ENV=development
```

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

## Project Structure

```
auth-service/
├── src/
│   ├── config/           # Configuration files
│   │   ├── config.js     # Environment variable validation
│   │   └── database.js   # MongoDB connection
│   ├── controllers/      # Request handlers
│   │   └── auth.controller.js
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── role.middleware.js
│   │   └── zod.middleware.js
│   ├── models/           # Mongoose schemas
│   │   └── user.model.js
│   ├── repositories/     # Data access layer
│   │   └── user.repository.js
│   ├── routes/           # API routes
│   │   ├── auth.route.js
│   │   └── index.route.js
│   ├── services/         # Business logic
│   │   └── user.service.js
│   ├── utils/            # Utility functions
│   │   ├── asyncHandler.js
│   │   ├── bcrypt.js
│   │   ├── generateToken.utils.js
│   │   ├── jwt.js
│   │   └── response.js
│   ├── validators/       # Zod schemas
│   │   └── zod.vaidator.js
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── package.json
└── README.md
```

## Contributors

This authentication service was built with contributions from multiple developers:

- **suryakumarsirvi** - Core JWT authentication with repository pattern
- **Kaif1119** - Refresh token system for session management
- **Mohd Khalid** - Role-based authorization middleware (RBAC)
- **Rahul Madeshiya** - Standardized API response utilities
- **rishipandey02** - Centralized config validation and database connection

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
