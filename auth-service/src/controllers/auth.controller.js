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