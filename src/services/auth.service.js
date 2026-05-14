import { findUserByEmail, createUser, findUserById } from "../dao/user.dao.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signupService = async (data) => {

    const { name, email, password } = data;

    //check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists with this email");
    };

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        name,
        email,
        password: hashPassword,
    });

    const token = generateToken(user._id);

    return {
        token,
        user,
    };
};


export const loginService = async (data) => {

    const { email, password } = data;

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    return {
        token,
        user,
    };
}

export const profileService = async (userId) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}