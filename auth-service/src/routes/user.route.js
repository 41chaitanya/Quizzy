import express from 'express';
import { getUserProfileController, loginController, logoutController, registerController, } from '../controllers/auth.controller.js';
import { authMiddleware } from "../middlewares/auth.middleware.js";



const router = express.Router();


// Route for user registration
router.post('/register', registerController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, getUserProfileController);
router.post('/logout', authMiddleware , logoutController)

export default router;
