import bcrypt from "bcrypt"
import userModel from "../models/user.model.js"
import { genarateAccesToken, genarateRefreshToken } from "../utils/genarateToken.js"

export const registerService = async (payload) => {
  const { name, email, password } = payload
  const exisitingUser = await userModel.findOne({ email })
  if (exisitingUser) {
    throw new Error("User already exist");
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword
  })
  return {
    success: true,
    user
  }
}


export const loginService = async (payload) => {
  const { email, password } = payload;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);


  if (!isMatch) {
    throw new Error("Invalid credentials");
  }


  const accessToken = genarateAccesToken(user)
  const refreshToken = genarateRefreshToken(user)

  return {
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  };

};