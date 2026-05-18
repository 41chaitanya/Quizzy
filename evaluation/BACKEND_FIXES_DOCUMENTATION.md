# Backend Fixes Documentation

This document summarizes the backend and integration fixes made across the Quizzy microservices. It explains what was broken before, what was fixed, and what the current behavior is now.

## 1. Auth Service

### What was wrong before
- The main app file had unresolved merge conflict markers and mixed two different app setups.
- The auth middleware had conflicting implementations and inconsistent token handling.
- Route and controller names were inconsistent between `auth.route.js`, `auth.routes.js`, and controller exports.
- Registration did not clearly return HTTP 201.
- JWT payloads did not consistently include the user role, which broke role-based authorization.
- The user model still had merge conflict content and mismatched field definitions.

### What was fixed
- Removed merge conflict markers from the auth app, auth middleware, and user model.
- Standardized auth routing to use the newer controller names and validator-based route flow.
- Updated register responses to return HTTP 201.
- Updated token generation so the JWT payload contains both `id` and `role`.
- Updated authorization middleware to safely read `req.user.role`.
- Added a proper global error middleware for JSON error responses.

### Current behavior
- Register and login now return consistent JSON responses.
- Protected auth routes read the authenticated user from the JWT and can enforce RBAC with `req.user.role`.
- Auth service now behaves like the rest of the backend and no longer has merge conflict leftovers.

### Files changed
- [auth-service/src/app.js](../auth-service/src/app.js)
- [auth-service/src/controllers/auth.controller.js](../auth-service/src/controllers/auth.controller.js)
- [auth-service/src/middlewares/auth.middleware.js](../auth-service/src/middlewares/auth.middleware.js)
- [auth-service/src/middlewares/error.middleware.js](../auth-service/src/middlewares/error.middleware.js)
- [auth-service/src/middlewares/role.middleware.js](../auth-service/src/middlewares/role.middleware.js)
- [auth-service/src/models/user.model.js](../auth-service/src/models/user.model.js)
- [auth-service/src/routes/auth.route.js](../auth-service/src/routes/auth.route.js)
- [auth-service/src/routes/auth.routes.js](../auth-service/src/routes/auth.routes.js)
- [auth-service/src/routes/index.route.js](../auth-service/src/routes/index.route.js)
- [auth-service/src/utils/response.js](../auth-service/src/utils/response.js)

## 2. Batch Service

### What was wrong before
- The app imported config from the auth service instead of using local batch service config.
- Protected routes were not consistently guarded by authentication and authorization middleware.
- The batch validation schema did not match the actual batch model fields.
- Batch creation and update payloads were not validated cleanly.
- Enrollment handling did not properly support re-enrollment of inactive students.
- Error and response handling were not aligned with the shared response format.

### What was fixed
- Switched the batch app to use local batch-service config.
- Added local authentication and RBAC middleware for protected batch routes.
- Added Zod validation for create and update batch routes.
- Updated the batch validation schema to match the current batch model fields.
- Updated batch creation and update handling to return clean validation errors.
- Added student ID validation before enrollment operations.
- Added reactivation logic so previously removed students can be re-enrolled.
- Added consistent JSON error middleware and response helpers.

### Current behavior
- Batch CRUD routes now require authentication and proper roles.
- Invalid batch input returns a clean HTTP 400 response.
- Student re-enrollment now reactivates an existing enrollment instead of failing on duplicate data.
- Batch responses now follow the same `{ success, message, data }` pattern.

### Files changed
- [batch-service/src/app.js](../batch-service/src/app.js)
- [batch-service/src/controllers/batch.controller.js](../batch-service/src/controllers/batch.controller.js)
- [batch-service/src/middlewares/auth.middleware.js](../batch-service/src/middlewares/auth.middleware.js)
- [batch-service/src/middlewares/error.middleware.js](../batch-service/src/middlewares/error.middleware.js)
- [batch-service/src/middlewares/role.middleware.js](../batch-service/src/middlewares/role.middleware.js)
- [batch-service/src/repositories/enrollment.repository.js](../batch-service/src/repositories/enrollment.repository.js)
- [batch-service/src/routes/batch.routes.js](../batch-service/src/routes/batch.routes.js)
- [batch-service/src/services/batch.service.js](../batch-service/src/services/batch.service.js)
- [batch-service/src/utils/response.js](../batch-service/src/utils/response.js)
- [batch-service/src/validators/zod.validator.js](../batch-service/src/validators/zod.validator.js)

## 3. Question Service

### What was wrong before
- Invalid MongoDB IDs could flow into find/update/delete operations and surface as HTTP 500 errors.
- Response and error formats were not fully standardized.
- The 403 middleware response was inconsistent with the rest of the API.
- Unknown routes did not return a clean JSON 404 response.
- Create endpoints did not clearly return HTTP 201.
- Bulk create responses could be inconsistent when some items failed.
- Question listing did not consistently filter inactive or deleted records.

### What was fixed
- Added ObjectId validation before all question lookup, update, and delete operations.
- Updated the question repository to filter out inactive and deleted records by default.
- Standardized response helpers to use the same JSON shape as the other services.
- Fixed 403 handling to return a consistent JSON response.
- Added a JSON 404 handler for unknown routes.
- Updated create endpoints to return HTTP 201.
- Made bulk create behavior consistent when some records fail validation.

### Current behavior
- Invalid question IDs now return HTTP 400 instead of HTTP 500.
- Active questions are listed by default, while deleted records stay hidden.
- All question API responses now follow the same response format.
- Unknown routes return a clean JSON 404 response.

### Files changed
- [question-service/src/app.js](../question-service/src/app.js)
- [question-service/src/controllers/question.controller.js](../question-service/src/controllers/question.controller.js)
- [question-service/src/middlewares/error.middleware.js](../question-service/src/middlewares/error.middleware.js)
- [question-service/src/middlewares/role.middleware.js](../question-service/src/middlewares/role.middleware.js)
- [question-service/src/middlewares/zod.middleware.js](../question-service/src/middlewares/zod.middleware.js)
- [question-service/src/repositories/question.repository.js](../question-service/src/repositories/question.repository.js)
- [question-service/src/services/question.service.js](../question-service/src/services/question.service.js)
- [question-service/src/utils/response.js](../question-service/src/utils/response.js)

## 4. Verification

### What was checked
- Static error validation was run across the modified auth, batch, and question services.
- No syntax or import errors were reported after the changes.

### What was not run
- Full integration tests were not run here because the services do not expose a common automated test script for end-to-end execution in this workspace.

## 5. Summary

The backend now has:
- consistent auth, RBAC, and JWT payload behavior,
- local batch-service configuration and protected batch routes,
- clean validation and enrollment reactivation logic,
- safer question-service ID handling,
- standardized JSON response and error handling across services.
