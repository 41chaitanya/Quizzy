export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(err.errors ? { errors: err.errors } : {}),
    });
};