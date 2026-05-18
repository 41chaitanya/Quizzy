export const successResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  status = 500,
  errors = []
) => {
  return res.status(status).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  });
};
