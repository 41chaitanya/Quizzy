export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
        ...(err.errors ? { errors: err.errors } : {}),
    });
};export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
}