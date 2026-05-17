import * as QuizRepo from "../repositories/quiz.repository.js";
import { CreateQuizSchema } from "../validators/quiz.validation.js";
import ApiError from "../utils/ApiError.js";

const cleanEmptyFields = (data) => {
  const cleaned = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "")) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const createQuiz = async (payload) => {
  const cleaned = cleanEmptyFields(payload);
  const parsed = CreateQuizSchema.safeParse(cleaned);

  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", parsed.error.flatten().fieldErrors);
  }

  const quiz = await QuizRepo.createOne(parsed.data);
  return quiz;
};

export const getQuizById = async (id) => {
  if (!id) throw new ApiError(400, "ID required");

  const quiz = await QuizRepo.findById(id);
  if (!quiz) throw new ApiError(404, "Not found");

  return quiz;
};

export const listQuizzes = async (query) => {
  const filter = {};

  if (query.title) {
    filter.title = {
      $regex: query.title.trim(),
      $options: "i",
    };
  }

  if (query.batchId) filter.batchId = query.batchId.trim();
  if (query.mode) filter.mode = query.mode;
  if (query.isActive !== undefined) filter.isActive = query.isActive;

  const options = {
    page: Number(query.page || 1),
    limit: Number(query.limit || 10),
    sortBy: query.sortBy || "createdAt",
    order: query.order || "desc",
  };

  const [data, total] = await Promise.all([
    QuizRepo.findAll(filter, options),
    QuizRepo.countDocuments(filter),
  ]);

  return {
    records: data,
    meta: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    },
  };
};

export const updateQuiz = async (id, payload) => {
  const existing = await QuizRepo.findById(id);
  if (!existing) throw new ApiError(404, "Not found");

  const cleaned = cleanEmptyFields(payload);

  const parsed = CreateQuizSchema.safeParse({
    ...existing.toObject(),
    ...cleaned,
  });

  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", parsed.error.flatten().fieldErrors);
  }

  const updated = await QuizRepo.updateById(id, parsed.data);
  return updated;
};

export const deleteQuiz = async (id) => {
  const existing = await QuizRepo.findById(id);
  if (!existing) throw new ApiError(404, "Not found");
  if (!existing.isActive) throw new ApiError(400, "Already inactive");

  const deleted = await QuizRepo.deleteById(id);
  return deleted;
};
