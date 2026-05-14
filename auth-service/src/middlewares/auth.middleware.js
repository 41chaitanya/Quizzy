import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token not found",
      });
    }
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);

    req.user = decoded;

    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or expired token",
      error: error.message,
    });
  }
}

