import jwt from 'jsonwebtoken';
import CONFIG from '../configs/env.config.js';

export const isAuthenticated = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;
        const token = req.cookies.token || bearerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        req.user = jwt.verify(token, CONFIG.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};