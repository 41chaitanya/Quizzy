import UserModel from "../model/user.model.js";

export const createUser = async (userData) => {
    return await UserModel.create(userData);
};

export const findUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
};

export const findUserById = async (id) => {
    return await UserModel.findById(id).select("-password"); // exclude password field
};


