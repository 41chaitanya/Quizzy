<<<<<<< HEAD
import jwt from "jsonwebtoken"
import config from "../config/config.js"

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({
                message: "Unauthorized"
            });
        };
        
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

        req.user(decoded)
        next()
    } catch (error) {
   return res.status(400).json({
    message: "Invalid token"
   })
    }
} 
=======
import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decoded = verifyToken(token);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};
>>>>>>> dfb84492e962b8ae0649259916816f10d60ad178
