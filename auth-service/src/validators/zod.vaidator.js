import * as z from 'zod';

export const ValidateUserSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, 'Fullname must be at least 3 characters')
    .max(14, 'Fullname cannot exceed 14 characters')
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot exceed 32 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
});