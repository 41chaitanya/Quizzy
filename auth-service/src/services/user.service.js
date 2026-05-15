import { compareHash, generateHash } from "../utils/bcrypt.js"
import * as UserRepo from '../repositories/user.repository.js'

export const registerUser = async ({ fullname, email, password }) => {
    if (!fullname || !email || !password) {
        throw new Error(
            'All fields are required'
        );
    }

    const isExist =
        await UserRepo.findByEmail(email);

    if (isExist) {
        throw new Error(
            'User already exists, try login'
        );
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
        throw new Error('Invalid credentials');
    }

    const isPasswordValid =
        await compareHash(
            password,
            user.password
        );

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    return user;
};

export const GetUser = async (req, res) =>{
    return await UserRepo.findById(req.user.id);
}