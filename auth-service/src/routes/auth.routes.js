import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRouter = Router();

//public routes
authRouter.post("/register", register)
authRouter.post("/login", login)

//protected route
authRouter.post("/logout", protect, logout)
authRouter.get("/profile", protect, getProfile)

export default authRouter;