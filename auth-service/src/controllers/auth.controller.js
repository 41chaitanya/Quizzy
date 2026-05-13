import { registerUser } from "../services/auth.service.js";

// Controller to handle user registration requests
export async function registerController(req, res) {
  try {
    // Normalize and validate incoming fields
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }

    // Register the user and generate tokens
    const { user, accessToken, refreshToken } = await registerUser({
      username,
      email,
      password,
    });

    // Set refresh token cookie for future refresh requests
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      status: 500,
    });
  }
}
