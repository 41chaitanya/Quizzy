import { verifyToken } from "../utils/token.util.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = verifyToken(token);
        if(!decodedToken){
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        })
    }
}