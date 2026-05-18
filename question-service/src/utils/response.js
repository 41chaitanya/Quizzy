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
  errors = undefined
) => {
  return res.status(status).json({
    success: false,
    message
    ,...(errors ? { errors } : {})
  });
};