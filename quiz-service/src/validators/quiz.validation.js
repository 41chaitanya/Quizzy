import * as z from "zod";
import { difficultyEnum, questionTypeEnum } from "./question.validation.js";


const autoRulesSchema = z.object({
  subject: z.string().trim().optional(),
  topic: z.string().trim().optional(),
  difficulty: difficultyEnum.optional(),
  type: questionTypeEnum.optional(),
  totalQuestions: z.number().min(1).optional(),
});


const baseQuizSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),

  description: z.string().trim().optional().default(""),
  instructions: z.string().trim().optional().default(""),

  batchId: z.string().min(1, "Batch ID is required"),

  mode: z.enum(["fixed", "dynamic", "hybrid"]),

  manualQuestionIds: z.array(z.string().min(1)).default([]),

  autoRules: autoRulesSchema.optional(),

  totalQuestions: z.number().min(1, "At least 1 question required"),

  totalMarks: z.number().min(0, "Marks cannot be negative"),

  durationInMinutes: z.number().min(1, "Duration must be at least 1 minute"),

  isRandomized: z.boolean().default(true),

  publishedAt: z.string().datetime().optional(),

  isActive: z.boolean().default(true),
});


export const CreateQuizSchema = baseQuizSchema.superRefine((data, ctx) => {

  const hasManual = data.manualQuestionIds.length > 0;
  const hasAuto = !!data.autoRules;

  if (data.mode === "fixed") {
    if (!hasManual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manualQuestionIds"],
        message: "Fixed quiz requires at least one manual question",
      });
    }

    if (hasAuto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["autoRules"],
        message: "Fixed quiz should not contain auto rules",
      });
    }
  }

  if (data.mode === "dynamic") {
    if (!hasAuto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["autoRules"],
        message: "Dynamic quiz requires auto rules",
      });
    }

    if (hasManual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manualQuestionIds"],
        message: "Dynamic quiz should not contain manual questions",
      });
    }
  }

  if (data.mode === "hybrid") {
    if (!hasManual && !hasAuto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mode"],
        message: "Hybrid quiz requires either manual questions or auto rules",
      });
    }
  }


  if (data.autoRules?.totalQuestions && data.autoRules.totalQuestions > data.totalQuestions) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["autoRules", "totalQuestions"],
      message: "Auto rules cannot exceed total questions",
    });
  }

});

export const UpdateQuizSchema = z.object({
  title: z.string().trim().min(3, "Title is required").optional(),
  description: z.string().trim().optional(),
  instructions: z.string().trim().optional(),
  batchId: z.string().min(1, "Batch ID is required").optional(),
  mode: z.enum(["fixed", "dynamic", "hybrid"]).optional(),
  manualQuestionIds: z.array(z.string().min(1)).optional(),
  autoRules: autoRulesSchema.optional(),
  totalQuestions: z.number().min(1, "At least 1 question required").optional(),
  totalMarks: z.number().min(0, "Marks cannot be negative").optional(),
  durationInMinutes: z.number().min(1, "Duration must be at least 1 minute").optional(),
  isRandomized: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});