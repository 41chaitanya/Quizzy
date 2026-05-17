export const validate = (schema) => {
  return async (req, res, next) => {
    try {

      if (
        !req.body ||
        !Object.keys(req.body).length
      ) {
        return res.status(400).json({
          success: false,
          message: 'Request body is required',
        });
      }

      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues,
      });
    }
  };
};