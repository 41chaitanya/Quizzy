import * as QuestionService from "../services/question.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

export const createQuestionController = asyncHandler(async (req, res) => {
  const question = await QuestionService.createQuestion(req.body);
  return successResponse(res, "Question created successfully", question);
});

export const bulkCreateQuestionsController = asyncHandler(async (req, res) => {
  const result = await QuestionService.bulkCreateQuestions(req.body);
  return successResponse(res, "Questions created successfully", result);
});

export const getQuestionByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await QuestionService.getQuestionById(id);
  return successResponse(res, "Question retrieved successfully", question);
});

export const listQuestionsController = asyncHandler(async (req, res) => {
  const result = await QuestionService.listQuestions(req.query);
  return successResponse(res, "Questions retrieved successfully", result);
});

export const updateQuestionController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await QuestionService.updateQuestion(id, req.body);
  return successResponse(res, "Question updated successfully", question);
});

export const deleteQuestionController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await QuestionService.deleteQuestion(id);
  return successResponse(res, "Question deleted successfully", question);
});