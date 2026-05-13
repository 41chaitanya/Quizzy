import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import { successResponse, errorResponse } from "../utils/response.js";

import { generateToken } from "../services/token.service.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return successResponse(res, "User Registered", user);
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Invalid Credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, "Invalid Credentials", 400);
    }

    const token = generateToken(user);

    return successResponse(res, "Login Success", {
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const protectedController = async (req, res) => {
  return successResponse(res, "Protected Route Accessed", req.user);
};
