import { generateToken } from "../utils/genrateToken.js";
import { comparePassword } from "../utils/comparedPassword.js";
import { hashPassword } from "../utils/hashedPassword.js";
import * as userDAO from "../dao/user.dao.js";

export const register = async (data) => {
  const { name, email, password } = data;

  const existingUser = await userDAO.findUserByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await userDAO.createUser({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

export const login = async (data) => {
  const { email, password } = data;

  const user = await userDAO.findUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid Password");
    error.statusCode = 404;
    throw error;
  }

  const token = generateToken(user);

  return {
    user,
    token,
  };
};
