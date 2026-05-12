import userModel from "../models/user.model.js";

export async function findUserByEmail(email) {
    const userData =  await userModel.findOne({email})
    return userData;
}

export async function createUser(user) {
   const newUser = await userModel.create(user);
    return newUser
}