import userModel from "../models/user.model.js";

export const createNewUser = (credentials) => userModel.create(credentials);

export const loginUser = async ({ username, password }) => {

    const user = await userModel.findOne({ username }).select("+password");
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid password");

    return user;
}