
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/env.config.js";

export const createAccessToken = (userId) => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "5m" });
    return token;
}

export const createRefreshToken = (userId) => {
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "15d" });
    return refreshToken;
}

export const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
}