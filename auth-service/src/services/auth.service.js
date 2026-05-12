import { createUser, findUserByEmail } from "../dao/user.dao.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.utils.js";

export async function registerUser({ username, email, password,}) {


  
  // Check if user already exists using email
  const user = await findUserByEmail(email);

  // If user found, throw error
  if (user) {
    throw new Error("User already exists");
  }

  // Convert plain password into hashed password
  // 10 = salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUserData = {
    username,
    email,
    password: hashedPassword,
  };

  // Save user into database
  const newUser = await createUser(newUserData);

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);


  // Return created user
  return {
    user: newUser,
    accessToken,
    refreshToken
  }
}
