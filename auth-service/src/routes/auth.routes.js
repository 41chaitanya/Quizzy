import { Router } from "express";
import {
  registerController,
  loginController,
  profileController,
  logoutController,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/profile",authMiddleware,profileController)
authRouter.post("/logout",logoutController)
export default authRouter