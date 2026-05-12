export const validate = async (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);

            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Failed to validate schema",
                errors: error.errors
            });
        }
    }
}