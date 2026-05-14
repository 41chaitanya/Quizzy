import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = async (userId) => {
    try {
        const token = jwt.sign(userId, config.JWT_SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.error(error)
    }
}

export const verifyToken = async (token) => {
    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        console.error(error)
    }
}