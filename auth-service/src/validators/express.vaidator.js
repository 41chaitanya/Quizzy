import { body } from 'express-validator';

export const RegisterSchema = [
  body('fullname')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .isLength({ max: 14 }).withMessage('Full name must be at most 14 characters'),

  body('email')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isLength({ max: 32 }).withMessage('Password must be at most 32 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];

export const LoginSchema = [
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];