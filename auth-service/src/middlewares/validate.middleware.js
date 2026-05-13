/**
 * Middleware factory for Zod schema validation
 * Validates req.body against the provided schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  req.body = result.data;
  next();
};
