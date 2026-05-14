import { register, login } from "../services/auth.service.js";

export const registerController = async (req, res) => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      message: "User register successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = login(req.body);

    res.status(200).json({
      success: true,
      message: "User Login successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const profileController = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


