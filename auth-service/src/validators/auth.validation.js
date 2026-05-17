import * as z from 'zod';

export const RegisterSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3)
    .max(14),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  password: z
    .string()
    .min(8)
    .max(32)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
    ),
});


export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  password: z
    .string(),
});
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email")
    .transform((val) => val.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email")
    .transform((val) => val.toLowerCase()),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must be at most 100 characters"),
});
