import * as QuizService from "../services/quiz.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createQuizController = asyncHandler(async (req, res) => {
  const quiz = await QuizService.createQuiz(req.body);
  return successResponse(res, "Quiz created successfully", quiz);
});

export const getQuizByIdController = asyncHandler(async (req, res) => {
  const quiz = await QuizService.getQuizById(req.params.id);
  return successResponse(res, "Quiz retrieved successfully", quiz);
});

export const listQuizzesController = asyncHandler(async (req, res) => {
  const result = await QuizService.listQuizzes(req.query);
  return successResponse(res, "Quizzes retrieved successfully", result);
});

export const updateQuizController = asyncHandler(async (req, res) => {
  const quiz = await QuizService.updateQuiz(req.params.id, req.body);
  return successResponse(res, "Quiz updated successfully", quiz);
});

export const deleteQuizController = asyncHandler(async (req, res) => {
  const quiz = await QuizService.deleteQuiz(req.params.id);
  return successResponse(res, "Quiz deleted successfully", quiz);
});
