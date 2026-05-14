import { Router } from "express";
import {
  registerController,
  loginController,
  profileController
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/profile",authMiddleware,profileController)
 
export default authRouter