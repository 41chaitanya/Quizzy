import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { sendOtp, verifyOtp, storePendingRegistration, getPendingRegistration } from "./otp.service.js";
import logger from "../utils/logger.js";

/**
 * Step 1: Validate data, check duplicates, send OTP (user NOT saved yet)
 */
export const register = async ({ name, username, email, password, role }) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw { status: 409, message: "Email is already registered." };

  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw { status: 409, message: "Username is already taken." };

  await storePendingRegistration(email, { name, username, email, password, role });
  await sendOtp(email, "register");

  logger.info(`Registration OTP sent to: ${email}`);
  return {
    message: "OTP sent to your email. Please verify to complete registration.",
    email,
  };
};

/**
 * Step 2: Verify OTP → Create user in DB → Return token
 */
export const verifyAndRegister = async ({ email, otp }) => {
  await verifyOtp(email, otp, "register");

  const userData = await getPendingRegistration(email);

  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) throw { status: 409, message: "Email is already registered." };

  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) throw { status: 409, message: "Username is already taken." };

  const user = await User.create({
    name: userData.name,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    isEmailVerified: true,
  });

  const token = generateToken(user);

  logger.info(`User registered & verified: ${email}`);
  return {
    message: "Registration successful. Email verified.",
    token,
    user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
  };
};

/**
 * Resend OTP for pending registration
 */
export const resendRegistrationOtp = async ({ email }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw { status: 400, message: "This email is already registered. Please login." };

  await sendOtp(email, "register");
  return { message: "OTP resent. Please check your email." };
};

/**
 * Login with email & password
 */
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw { status: 401, message: "Invalid email or password." };
  if (!user.isActive) throw { status: 403, message: "Your account has been deactivated. Contact support." };
  if (!user.isEmailVerified) throw { status: 403, message: "Please verify your email before logging in." };

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw { status: 401, message: "Invalid email or password." };

  const token = generateToken(user);

  logger.info(`User logged in: ${email}`);
  return {
    message: "Login successful.",
    token,
    user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
  };
};

/**
 * Send OTP for password reset
 */
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: "No account found with this email." };

  await sendOtp(email, "reset");
  logger.info(`Password reset OTP sent to: ${email}`);
  return { message: "Password reset OTP sent to your email." };
};

/**
 * Reset password after OTP verification
 */
export const resetPassword = async ({ email, otp, newPassword }) => {
  await verifyOtp(email, otp, "reset");

  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: "User not found." };

  user.password = newPassword;
  await user.save();

  logger.info(`Password reset for: ${email}`);
  return { message: "Password reset successful. You can now log in with your new password." };
};

/**
 * Change password (authenticated)
 */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw { status: 404, message: "User not found." };

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw { status: 401, message: "Current password is incorrect." };

  user.password = newPassword;
  await user.save();

  const token = generateToken(user);

  logger.info(`Password changed for user: ${userId}`);
  return { message: "Password changed successfully.", token };
};

/**
 * Get current user profile
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw { status: 404, message: "User not found." };
  return user;
};
