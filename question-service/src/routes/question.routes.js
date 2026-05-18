import express from "express";

import {
  createQuestionController,
  bulkCreateQuestionsController,
  getQuestionByIdController,
  listQuestionsController,
  updateQuestionController,
  deleteQuestionController,
} from "../controllers/question.controller.js";

import { validate } from "../middlewares/zod.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  CreateQuestionSchema,
  BulkCreateQuestionSchema,
  UpdateQuestionSchema,
} from "../validators/question.validation.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  authorize("admin", "teacher"),
  validate(CreateQuestionSchema),
  createQuestionController
);

router.post(
  "/bulk",
  isAuthenticated,
  authorize("admin", "teacher"),
  validate(BulkCreateQuestionSchema),
  bulkCreateQuestionsController
);

router.get(
  "/:id",
  isAuthenticated,
  authorize("admin", "teacher", "user"),
  getQuestionByIdController
);

router.get(
  "/",
  isAuthenticated,
  authorize("admin", "teacher"),
  listQuestionsController
);

router.put(
  "/:id",
  isAuthenticated,
  authorize("admin", "teacher"),
  validate(UpdateQuestionSchema),
  updateQuestionController
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("admin"),
  deleteQuestionController
);

export default router;