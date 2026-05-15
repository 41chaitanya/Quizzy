import jwt from 'jsonwebtoken';
import CONFIG from "../configs/env.config.js";

export const generateToken = (payload, expiry = '7d') =>{
    return jwt.sign(
        payload,
        CONFIG.JWT_SECRET,
        {
            expiresIn: expiry
        }
    );
};

export const verifyToken = (token) =>{
    return jwt.verify(token, CONFIG.JWT_SECRET);
};