<<<<<<< HEAD
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.service.js";

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

export async function loginController(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const { existingUser, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      accessToken,
    });
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed",
      status: 500,
    });
  }
}

export async function getUserProfileController(req, res) {
  try {
    console.log(req.user);
    const userId = req.user.id;
    
    const user = await getProfile(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
}



export async function logoutController(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
=======
import CONFIG from "../configs/env.config.js";
import { registerUser, loginUser, GetUser } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/jwt.js";


export const handleRegister = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

        const user = await registerUser({ fullname, email, password });

        const token = generateToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
})

export const handleLogin = asyncHandler(async (req, res) => {

        const { email, password } = req.body;

        const user = await loginUser({
            email,
            password,
        });

        const token = generateToken({
            id: user._id,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',

            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
});

export const handleLogout = asyncHandler(async (req, res) => {

    const cookieOptions = {
        httpOnly: true,
        secure: CONFIG.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
     };

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});

export const handleGetMe = asyncHandler(async (req, res) => {
        const user = await GetUser(req);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
});
>>>>>>> upstream/main
