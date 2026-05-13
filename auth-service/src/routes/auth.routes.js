const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../utils/validators");

// ─── Public Routes ────────────────────────────────────────────────────────────

/** Health check */
router.get("/health", authController.healthCheck);

/** Step 1: Register → validates input, checks duplicates, sends OTP (user NOT saved) */
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register
);

/** Step 2: Verify OTP → creates user → returns token in header */
router.post(
  "/verify-register",
  otpLimiter,
  validate(verifyOtpSchema),
  authController.verifyAndRegister
);

/** Resend registration OTP */
router.post(
  "/resend-otp",
  otpLimiter,
  validate(sendOtpSchema),
  authController.resendRegistrationOtp
);

/** Login → returns token in header */
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  authController.login
);

/** Forgot password — sends reset OTP */
router.post(
  "/forgot-password",
  otpLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/** Reset password with OTP */
router.post(
  "/reset-password",
  otpLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ─── Protected Routes (require Bearer token in Authorization header) ──────────

/** Logout → blacklists current token */
router.post("/logout", authenticate, authController.logout);

/** Get my profile */
router.get("/me", authenticate, authController.getMe);

/** Change password → blacklists old token, returns fresh token in header */
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

module.exports = router;
