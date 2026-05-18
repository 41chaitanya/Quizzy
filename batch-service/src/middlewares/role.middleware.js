import { errorResponse } from '../utils/response.js';

export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return errorResponse(res, 'Forbidden', 403);
    }

    return next();
};