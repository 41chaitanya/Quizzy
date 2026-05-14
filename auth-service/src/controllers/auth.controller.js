import { register, login } from "../services/auth.service.js";
import asyncHandler from "../utils/async.handler.js";

export const registerController = async (req, res) => {
  asyncHandler (async(req,res) {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      message: "User register successfully",
      data: result,
    });
  }); 
};

export const loginController = async (req, res) => {
  asyncHandler (async(req,res) {
    const result = login(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User Login successfully",
      data: result.user,
    });
  });
};

export const logoutController = (
  req,
  res
) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};


export const profileController = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
