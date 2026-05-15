export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
}