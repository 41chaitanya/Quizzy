import { validationResult } from 'express-validator';

export const validate = (schemas) => {
  return async (req, res, next) => {

    if (!req.body || !Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required',
      });
    }

    // Run all validation chains
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    next();
  };
};