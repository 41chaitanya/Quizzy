import {Router} from 'express';
import { handleGetMe, handleLogin, handleLogout, handleRegister } from '../controllers/auth.controller.js';
import { ValidateUserSchema } from '../validators/zod.vaidator.js';
import { validate } from '../middlewares/zod.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const AuthRoutes = Router();

AuthRoutes.post('/register', validate(ValidateUserSchema), handleRegister);
AuthRoutes.post('/login', validate(ValidateUserSchema), handleLogin);
AuthRoutes.post('/logout', isAuthenticated, handleLogout);
AuthRoutes.post('/me', isAuthenticated, handleGetMe);

export default AuthRoutes;