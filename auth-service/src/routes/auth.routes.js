import express from "express";

import {
  registerController,
  loginController,
  protectedController,
} from "../controllers/auth.controller.js";

import { authenticateService } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/protected", authenticateService, protectedController);

export default router;
