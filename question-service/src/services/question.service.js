import * as QuestionRepo from "../repositories/question.repository.js";
import { CreateQuestionSchema } from "../validators/question.validation.js";
import ApiError from "../utils/ApiError.js";


export const createQuestion = async (payload) => {
  const cleaned = QuestionRepo.removeEmptyFields(QuestionRepo.normalizeQuestion(payload));

  const parsed = CreateQuestionSchema.safeParse(cleaned);

  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", parsed.error.flatten().fieldErrors);
  }

  const question = await QuestionRepo.createOne(parsed.data);
  return question;
};

export const bulkCreateQuestions = async (questions) => {
  const valid = [];
  const failed = [];

  for (const q of questions) {
    const cleaned = QuestionRepo.removeEmptyFields(QuestionRepo.normalizeQuestion(q));

    const parsed = CreateQuestionSchema.safeParse(cleaned);

    if (parsed.success) {
      valid.push(parsed.data);
    } else {
      failed.push({
        data: q,
        error: parsed.error.flatten(),
      });
    }
  }

  const inserted =
    valid.length > 0
      ? await QuestionRepo.createMany(valid)
      : [];

  return {
    success: failed.length === 0,
    inserted,
    failed,
  };
};

export const getQuestionById = async (id) => {
  if (!id) throw new ApiError(400, "ID required");

  const question = await QuestionRepo.findById(id);
  if (!question) throw new ApiError(404, "Not found");

  return question;
};

// GET /questions?search=node&page=1&limit=2
// GET /questions?subject=backend&difficulty=easy

export const listQuestions = async (query) => {
  const filter = {};

  if (query.search) {
    filter.questionText = {
      $regex: query.search.trim(),
      $options: "i",
    };
  }

  if (query.subject) filter.subject = query.subject.trim();
  if (query.topic) filter.topic = query.topic.trim();
  if (query.type) filter.type = query.type;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.isActive !== undefined) filter.isActive = query.isActive;

  const options = {
    page: Number(query.page || 1),
    limit: Number(query.limit || 10),
    sortBy: query.sortBy || "createdAt",
    order: query.order || "desc",
  };

  const [data, total] = await Promise.all([
    QuestionRepo.findAll(filter, options),
    QuestionRepo.countDocuments(filter),
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

export const updateQuestion = async (id, payload) => {
  const existing = await QuestionRepo.findById(id);
  if (!existing) throw new ApiError(404, "Not found");

  const cleaned = QuestionRepo.removeEmptyFields(QuestionRepo.normalizeQuestion(payload));
  const parsed = CreateQuestionSchema.safeParse({
    ...existing.toObject(),
    ...cleaned,
  });

  if (!parsed.success) {
    throw new ApiError(400, "Validation failed", parsed.error.flatten().fieldErrors);
  }

  const updated = await QuestionRepo.updateById(id, parsed.data);
  return updated;
};

export const deleteQuestion = async (id) => {
  const existing = await QuestionRepo.findById(id);
  if (!existing) throw new ApiError(404, "Not found");
  if (!existing.isActive) throw new ApiError(400, "Already inactive");

  const deleted = await QuestionRepo.deleteById(id);
  return deleted;
};