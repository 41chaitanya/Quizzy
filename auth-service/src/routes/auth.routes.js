import { Router } from 'express';
import { handleGetMe, handleLogin, handleLogout, handleRegister } from '../controllers/auth.controller.js';
import { LoginSchema, RegisterSchema } from '../validators/auth.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { successResponse } from '../utils/response.js';

const AuthRoutes = Router();

AuthRoutes.post('/register', validate(RegisterSchema), handleRegister);
AuthRoutes.post('/login', validate(LoginSchema), handleLogin);
AuthRoutes.post('/logout', isAuthenticated, handleLogout);
AuthRoutes.get('/me', isAuthenticated, handleGetMe);
AuthRoutes.get('/admin', isAuthenticated, authorize('admin'), (req, res) => {
    return successResponse(res, 'Welcome Admin', {
        id: req.user.id,
        role: req.user.role,
    });
});

export default AuthRoutes;