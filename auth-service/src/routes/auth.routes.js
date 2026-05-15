import express from "express";
import { register, login, profile, logout, refreshAccessToken } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { logoutMiddleware } from "../middlewares/logout.middleware.js";

const router = express.Router();


router.get("/access-token", authMiddleware, refreshAccessToken);

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, profile);

router.post("/logout", logoutMiddleware, logout);


export default router;