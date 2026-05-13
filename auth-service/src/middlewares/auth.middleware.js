import jwt from "jsonwebtoken";

import { errorResponse } from "../utils/response.js";

export const authenticateService = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return errorResponse(res, "Token Missing", 401);
    }

    const splitToken = token.split(" ")[1];

    const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, "Unauthorized", 401);
  }
};
