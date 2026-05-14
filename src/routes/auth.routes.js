import express from 'express';
import { signupController, loginController, profileController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.get("/profile", authMiddleware, profileController);

export default router;
