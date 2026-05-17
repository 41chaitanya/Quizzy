import QuizModel from "../models/quiz.model.js";

export const createOne = async (data) => {
  return await QuizModel.create(data);
};

export const findById = async (id) => {
  return await QuizModel.findById(id)
    .populate("manualQuestionIds");
};

export const findAll = async (filter, options) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = options;

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === "asc" ? 1 : -1;

  return await QuizModel.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(Number(limit))
    .populate("manualQuestionIds");
};

export const countDocuments = async (filter) => {
  return await QuizModel.countDocuments(filter);
};

export const updateById = async (id, data) => {
  return await QuizModel.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteById = async (id) => {
  return await QuizModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};