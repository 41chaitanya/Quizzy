import jwt from "jsonwebtoken";
import config from "../config/config.js";
const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config.JWT_SECRET_KEY,
        {
            expiresIn: "1d",
        },
    )
}

export default generateToken;


/**
 * create jwt token for logged in user.
 * User Logs In
      ↓
Server verifies password
      ↓
generateToken(user)
      ↓
JWT token created
      ↓
Token sent to frontend
 */