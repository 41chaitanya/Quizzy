import UserModel from '../models/user.model.js';

export const findById = async (id)=>{
    return await UserModel.findById(id);
}

export const findByEmail = async (email)=>{
    return await UserModel.findOne({email});
}

export const findByEmailWithPassword = async (email)=>{
    return await UserModel.findOne({email}).select("+password");
}

export const createOne = async (data)=>{
    return await UserModel.create(data);
}