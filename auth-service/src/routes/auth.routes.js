import express from "express"
import { Login, register } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"


const router = express.Router();

router.post("/register", register)

router.post("/login", Login)

router.get("/admin", verifyToken, authorizeRoles("ADMIN"), (req, res) => {
    res.json({
        message: "Welcome Admin"
    })
})

export default router;