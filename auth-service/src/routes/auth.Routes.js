import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
} from "../controllers/auth.Controller.js"; 
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", logoutUser);

authRouter.get("/me", authMiddleware, (req, res) => {
    res.json({
        user: req.user,
    });
});

export default authRouter;