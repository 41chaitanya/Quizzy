import QuestionModel from "../models/question.model.js";

export const normalizeQuestion = (data) => {
  return {
    ...data,

    questionText: data.questionText?.trim(),
    subject: data.subject?.trim(),
    topic: data.topic?.trim(),
    explanation: data.explanation?.trim() || "",

    options: data.options === undefined
      ? undefined
      : Array.isArray(data.options)
      ? data.options
          .filter((opt) => opt?.optionId && opt?.text)
          .map((opt) => ({
            optionId: String(opt.optionId).trim().toUpperCase(),
            text: String(opt.text).trim(),
          }))
      : [],

    correctAnswer: normalizeCorrectAnswer(data),
  };
};

const normalizeCorrectAnswer = (data) => {
  if (!data.correctAnswer) return data.correctAnswer;

  switch (data.type) {
    case "single_choice":
      return String(data.correctAnswer).trim().toUpperCase();

    case "multiple_choice":
      return Array.isArray(data.correctAnswer)
        ? data.correctAnswer.map((ans) =>
            String(ans).trim().toUpperCase()
          )
        : [];

    case "true_false":
      return Boolean(data.correctAnswer);

    case "short_answer":
      return String(data.correctAnswer).trim();

    default:
      return data.correctAnswer;
  }
};

export const removeEmptyFields = (data) => {
  const cleaned = {};

  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

export const createOne = async (data) => {
  return await QuestionModel.create(data);
};

export const createMany = async (questions) => {
  return await QuestionModel.insertMany(questions, {
    ordered: false,
  });
};

export const findById = async (id) => {
  return await QuestionModel.findOne({
    _id: id,
    isActive: true,
    isDeleted: false,
  });
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

  const finalFilter = {
    ...filter,
    isDeleted: false,
  };

  if (finalFilter.isActive === undefined) {
    finalFilter.isActive = true;
  }

  return await QuestionModel.find(finalFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(Number(limit));
};

export const countDocuments = async (filter) => {
  const finalFilter = {
    ...filter,
    isDeleted: false,
  };

  if (finalFilter.isActive === undefined) {
    finalFilter.isActive = true;
  }

  return await QuestionModel.countDocuments(finalFilter);
};

export const updateById = async (id, data) => {
  return await QuestionModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
};

export const deleteById = async (id) => {
  return await QuestionModel.findOneAndUpdate(
    {
      _id: id,
      isActive: true,
      isDeleted: false,
    },
    { isActive: false, isDeleted: true },
    { new: true }
  );
};
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
};

export const deleteById = async (id) => {
  return await QuestionModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};
