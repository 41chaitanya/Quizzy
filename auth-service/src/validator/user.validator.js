import Joi from "joi";

export const userValidate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        password: Joi.string().required().min(5),
        username: Joi.string().required(),
        role:Joi.string().required()
    })
    const { error } = schema.validate(data);
    return error;
}

export const loginValidate = (data) => {
    const schema = Joi.object({
        password: Joi.string().required().min(5),
        username: Joi.string().required(),
    })
    const { error } = schema.validate(data);
    return error;
}