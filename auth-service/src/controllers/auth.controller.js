import userModel from "../models/user.model.js";
import blackListTokenModel from "../models/blackList.model.js";
import { userValidate, loginValidate } from "../validator/user.validator.js";
import { createNewUser, loginUser } from "../repository/auth.repo.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { createAccessToken, createRefreshToken } from "../utils/tokenHandler.js";


export const refreshAccessToken = (req, res) => {

    const userId = req.user.id;

    const token = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ token });
}

export const register = asyncHandler(async (req, res) => {

    const { name, username, password, role } = req.body;
    if (!name || !username || !password || !role) return res.status(400).send('All fields are required');

    const error = userValidate({ name, username, password, role });
    if (error) return res.status(400).send(error.details[0].message);

    const existingUser = await userModel.findOne({ username });

    if (existingUser) return res.status(400).send("User already exists");

    const createdUser = await createNewUser({ name, username, password, role });

    const token = createAccessToken(createdUser._id);
    const refreshToken = createRefreshToken(createdUser._id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ token, createdUser });
})

export const login = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    const error = loginValidate({ username, password });
    if (error) return res.status(400).send(error.details[0].message);

    const user = await loginUser({ username, password });

    const token = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ token, user });
})

export const profile = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(401).send("Unauthorized");
    res.json({ user });
})

export const logout = asyncHandler(async (req, res) => {

    const token = req.token;

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });
})
