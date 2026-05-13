import nodemailer from "nodemailer";
import { getRedis } from "../config/redis.js";
import logger from "../utils/logger.js";

const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_MINUTES || "5") * 60;
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || "6");

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate a random numeric OTP
const generateOtp = () => {
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

// Redis key helpers
const otpKey = (email, type) => `otp:${type}:${email}`;
const otpAttemptsKey = (email, type) => `otp:attempts:${type}:${email}`;
const pendingRegKey = (email) => `pending:register:${email}`;

/**
 * Send OTP email and store in Redis/memory
 */
export const sendOtp = async (email, type = "register") => {
  const redis = getRedis();

  const attemptsKey = otpAttemptsKey(email, type);
  const attempts = await redis.incr(attemptsKey);
  if (attempts === 1) {
    await redis.expire(attemptsKey, 600);
  }
  if (attempts > 3) {
    const ttl = await redis.ttl(attemptsKey);
    throw {
      status: 429,
      message: `Too many OTP requests. Please wait ${Math.ceil(ttl / 60)} minute(s) before trying again.`,
    };
  }

  const otp = generateOtp();
  const key = otpKey(email, type);
  await redis.setex(key, OTP_EXPIRY, otp);

  const subject =
    type === "register"
      ? "Quizzy — Verify Your Email to Complete Registration"
      : "Quizzy — Password Reset OTP";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">🎯 Quizzy</h2>
      <p style="font-size: 15px; color: #333;">
        ${type === "register" ? "Welcome! Please verify your email address to complete your registration." : "You requested a password reset. Use the OTP below."}
      </p>
      <div style="background: #f3f0ff; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #4f46e5;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #666;">This OTP expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 5} minutes</strong>. Do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
      <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Quizzy" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });

  logger.info(`OTP sent to ${email} [type: ${type}]`);
  return true;
};

/**
 * Verify OTP
 */
export const verifyOtp = async (email, otp, type = "register") => {
  const redis = getRedis();
  const key = otpKey(email, type);

  const storedOtp = await redis.get(key);

  if (!storedOtp) {
    throw { status: 400, message: "OTP has expired or does not exist. Please request a new one." };
  }

  if (storedOtp !== otp) {
    throw { status: 400, message: "Invalid OTP. Please check and try again." };
  }

  await redis.del(key);
  await redis.del(otpAttemptsKey(email, type));

  logger.info(`OTP verified for ${email} [type: ${type}]`);
  return true;
};

/**
 * Store pending registration data temporarily
 */
export const storePendingRegistration = async (email, userData) => {
  const redis = getRedis();
  const key = pendingRegKey(email);
  await redis.setex(key, OTP_EXPIRY, JSON.stringify(userData));
  logger.info(`Pending registration stored for: ${email}`);
};

/**
 * Get and delete pending registration data
 */
export const getPendingRegistration = async (email) => {
  const redis = getRedis();
  const key = pendingRegKey(email);
  const data = await redis.get(key);
  if (!data) {
    throw { status: 400, message: "Registration session expired. Please register again." };
  }
  await redis.del(key);
  return JSON.parse(data);
};
