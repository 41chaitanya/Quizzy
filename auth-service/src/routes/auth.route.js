import { Router } from 'express';
import { handleGetMe, handleLogin, handleLogout, handleRegister } from '../controllers/auth.controller.js';
import { LoginSchema, RegisterSchema } from '../validators/express.vaidator.js';
import { validate } from '../middlewares/express.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const AuthRoutes = Router();

AuthRoutes.post('/register', validate(RegisterSchema), handleRegister);
AuthRoutes.post('/login', validate(LoginSchema), handleLogin);
AuthRoutes.post('/logout', isAuthenticated, handleLogout);
AuthRoutes.get('/me', isAuthenticated, handleGetMe);

export default AuthRoutes;