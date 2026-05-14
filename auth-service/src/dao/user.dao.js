import userModel from "../models/user.model.js";

// Find a single user by email address
export async function findUserByEmail(email) {
    const userData =  await userModel.findOne({ email });
    return userData;
}

// Create a new user document in the database
export async function createUser(user) {
   const newUser = await userModel.create(user);
    return newUser;
}