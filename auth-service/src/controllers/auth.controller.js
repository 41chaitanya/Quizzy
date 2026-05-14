import { createUser, getUser } from "../services/db.service.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import { generateToken } from "../utils/token.util.js";

export const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if(!email || !password || !fullName){
            return res.status(400).json({ message: "All fields are required" });
        }

        const passwordHash = await hashPassword(password)

        const user = await createUser(fullName, email, passwordHash);

        const token = generateToken({id: user._id, email: user.email});

        res.cookie("token", token, {
            maxAge: 7*60*60*1000, //7 days
            httpOnly: true
        })

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullName
            }, success: true
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registeration error",
            error: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await getUser(email)
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }

        const passwordMatch = await comparePassword(password, user.password)
        if(!passwordMatch){
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken({id: user._id, email: user.email});

        res.cookie("token", token, {
            maxAge: 7*60*60*1000, //7 days
            httpOnly: true
        })

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullName
            }, success: true
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login error",
            error: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout error",
            error: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullName
            }, success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Profile fetch error",
            error: error.message
        })
    }
}