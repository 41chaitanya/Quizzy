import userModel from "../models/user.model.js";

export const createUser = async (userData) => {
  return await userModel.create(userData);
};


export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
  });
};