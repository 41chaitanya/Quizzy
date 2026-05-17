import Question from '../models/question.model.js';

export const create = async (data) => {
    return await Question.create(data);
};

export const bulkCreate = async (dataArray) => {
    return await Question.insertMany(dataArray, { ordered: false, runValidators: true });
};

//ordered nahi lagaya toh:Default true hoga — ek document fail hote hi baaki sab skip.

// By default runValidators: false hota hai Matlab Mongoose schema validation skip ho jaati hai — required, minlength, enum sab ignore.
// Seedha MongoDB mein data chala jaata hai bina kisi check ke.
