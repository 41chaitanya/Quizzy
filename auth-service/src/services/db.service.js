import User from "../models/user.model.js";

export const createUser = async (fullName, email, password) => {
    const user = await User.create({
        fullName,
        email,
        password
    })
    return user;
}

export const getUser = async (email) => {
    const user = await User.findOne({ email }).select("+password");
    return user;
}