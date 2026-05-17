import { compareHash, generateHash } from "../utils/bcrypt.js"
import * as UserRepo from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';
export const registerUser = async ({ fullname, email, password }) => {
    if (!fullname || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const isExist =
        await UserRepo.findByEmail(email);

    if (isExist) {
        throw new ApiError(409, 'User already exists, try login');
    }

    const hashedPassword = await generateHash(password);

    const newUser = {
        fullname,
        email,
        password: hashedPassword,
    };

    return await UserRepo.createOne(newUser);
}

export const loginUser = async ({ email, password }) => {
    const user =
        await UserRepo.findByEmailWithPassword(
            email
        );

    if (!user) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid =
        await compareHash(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials');
    }

    return user;
};

export const GetUser = async (req, res) =>{
    return await UserRepo.findById(req.user.id);
}