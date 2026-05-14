import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authHeader;

        // Check if the Authorization header is present
        if (!authHeader) { //
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }
        const decoded = jwt.verify(token, process.env.jwt_SECRET_KEY);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

/**
 * when user logged in the token send to the server in the Authorization header of the request. and it is in [bearer", "tokenabc23" ] rmat.
 * Authorization Header
↓
"Bearer abc123xyz"

split(" ")
↓
["Bearer", "abc123xyz"]

[1]
↓
"abc123xyz"
 */