import jwt from "jsonwebtoken";
import config from "../config/config.js";

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

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },config.REFRESH_TOKEN_SECRET,{
            expiresIn: config.REFRESH_TOKEN_EXPIRE
        }
    )
};