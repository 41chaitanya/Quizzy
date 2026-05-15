import jwt from "jsonwebtoken";
import CONFIG from "../configs/env.config.js";

export const createAccessToken = (userId) => {
    const token = jwt.sign({ id: userId }, CONFIG.JWT_SECRET, { expiresIn: "5m" });
    return token;
}

export const createRefreshToken = (userId) => {
    // Note: ensure JWT_REFRESH_SECRET is in env.config.js if you use this
    const secret = CONFIG.JWT_REFRESH_SECRET || CONFIG.JWT_SECRET;
    const refreshToken = jwt.sign({ id: userId }, secret, { expiresIn: "15d" });
    return refreshToken;
}

export const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
    return decoded;
}
