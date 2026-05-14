import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Generate a short-lived access token for authenticated API calls
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRE,
    },
  );
};



// Generate a refresh token for renewing user sessions
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRE,
    },
  );
};