import CONFIG from "../configs/env.config.js";
import { registerUser, loginUser, GetUser } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const handleRegister = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

        const user = await registerUser({ fullname, email, password });

        const token = generateToken({
            id: user._id,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 'User registered successfully', {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
        }, 201);
})

export const handleLogin = asyncHandler(async (req, res) => {

        const { email, password } = req.body;

        const user = await loginUser({
            email,
            password,
        });

        const token = generateToken({
            id: user._id,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, 'Login successful', {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
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

    return successResponse(res, 'Logout successful');
});

export const handleGetMe = asyncHandler(async (req, res) => {
        const user = await GetUser(req);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, 'User fetched successfully', user);
});