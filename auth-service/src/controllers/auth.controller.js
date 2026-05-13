import * as authService from "../services/auth.service.js";
import { blacklistToken } from "../services/blacklist.service.js";
import logger from "../utils/logger.js";

// Helper to wrap async controllers
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * POST /api/auth/register
 * Step 1: Validate → check duplicates → send OTP (user NOT saved yet)
 */
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * POST /api/auth/verify-register
 * Step 2: Verify OTP → create user → return token in header
 */
export const verifyAndRegister = asyncHandler(async (req, res) => {
  const result = await authService.verifyAndRegister(req.body);

  res.setHeader("Authorization", `Bearer ${result.token}`);
  res.setHeader("X-Auth-Token", result.token);

  res.status(201).json({
    success: true,
    message: result.message,
    token: result.token,
    user: result.user,
  });
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP for pending registration
 */
export const resendRegistrationOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendRegistrationOtp(req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * POST /api/auth/login
 * Login → return token in header
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.setHeader("Authorization", `Bearer ${result.token}`);
  res.setHeader("X-Auth-Token", result.token);

  res.status(200).json({
    success: true,
    message: result.message,
    token: result.token,
    user: result.user,
  });
});

/**
 * POST /api/auth/logout
 * Protected. Blacklists the current JWT token.
 */
export const logout = asyncHandler(async (req, res) => {
  await blacklistToken(req.token);

  logger.info(`User logged out: ${req.user.username}`);
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Token has been invalidated.",
  });
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.status(200).json({ success: true, ...result });
});

/**
 * POST /api/auth/change-password
 * Protected → blacklists old token, returns fresh token in header
 */
export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body);

  await blacklistToken(req.token);

  res.setHeader("Authorization", `Bearer ${result.token}`);
  res.setHeader("X-Auth-Token", result.token);

  res.status(200).json({
    success: true,
    message: result.message,
    token: result.token,
  });
});

/**
 * GET /api/auth/me
 * Protected → returns profile
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
});

/**
 * GET /api/auth/health
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: "auth-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};
