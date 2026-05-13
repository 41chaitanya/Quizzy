import { createUser, findUserByEmail } from "../dao/user.dao.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.utils.js";

export async function registerUser({ username, email, password }) {
  // Check if the email is already registered
  const user = await findUserByEmail(email);

  if (user) {
    throw new Error("User already exists");
  }

  // Hash the plain text password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserData = {
    username,
    email,
    password: hashedPassword,
  };

  // Create a new user record in the database
  const newUser = await createUser(newUserData);

  // Create JWT tokens for the new user
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // refresh token DB me save
  newUser.refreshToken = refreshToken;
  await newUser.save();

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
}
