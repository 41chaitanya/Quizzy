import UserModel from '../models/user.model.js';

export const findById = (id)=>{
    return UserModel.findById(id);
}

export const findByEmail = (email)=>{
    return UserModel.findOne({email});
}

export const createOne = (data)=>{
    return UserModel.create(data);
}