import { createUser, findUserByEmail, findUserById } from "../dao/user.dao.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.utils.js";
import userModel from "../models/user.model.js";

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
  try {
    newUser.refreshToken = refreshToken;
    await newUser.save();
  } catch (error) {
    throw new Error("Database save failed");
  }

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
}

export async function loginUser({ email, password }) {
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // Create JWT tokens for the new user
  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  // refresh token DB me save
  try {
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
  } catch (error) {
    throw new Error("Database save failed");
  }

  return {
    existingUser,
    accessToken,
    refreshToken,
  };
}

export async function logoutUser(refreshToken) {
  const user = await userModel.findOne({ refreshToken });

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  user.refreshToken = null;
  await user.save();

  return true;
}


export async function getProfile(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

