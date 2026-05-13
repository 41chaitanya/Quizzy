import jwt from "jsonwebtoken";

/**
 * Generate JWT token with user details in payload
 * Token contains: id, name, username, role
 */
export const generateToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
