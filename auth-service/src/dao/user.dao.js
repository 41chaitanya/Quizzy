import userModel from "../models/user.model.js";

// Find a single user by email address
export async function findUserByEmail(email) {
    const userData =  await userModel.findOne({ email }).select("+password");
    return userData;
}

// Create a new user document in the database
export async function createUser(user) {
   const newUser = await userModel.create(user);
    return newUser;
}
// user fine  in the database
export async function findUserById(id) {
    const userFatch = await userModel.findById(id).select("-password");
    return userFatch
}
