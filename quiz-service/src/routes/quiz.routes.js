import express from "express";

import {
  createQuizController,
  getQuizByIdController,
  listQuizzesController,
  updateQuizController,
  deleteQuizController,
} from "../controllers/quiz.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  CreateQuizSchema,
  UpdateQuizSchema,
} from "../validators/quiz.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "teacher"),
  validate(CreateQuizSchema),
  createQuizController
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "teacher", "student"),
  getQuizByIdController
);

router.get(
  "/",
  authenticate,
  authorize("admin", "teacher"),
  listQuizzesController
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "teacher"),
  validate(UpdateQuizSchema),
  updateQuizController
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteQuizController
);

export default router;
