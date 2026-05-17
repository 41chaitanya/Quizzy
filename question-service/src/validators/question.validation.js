import * as z from "zod";


const optionSchema = z.object({
  optionId: z.string().trim().min(1, "Option id is required"),
  text: z.string().trim().min(1, "Option text is required"),
});


export const questionTypeEnum = z.enum([
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_answer",
]);

export const difficultyEnum = z.enum([
  "easy",
  "medium",
  "hard",
]);


const baseQuestionSchema = z.object({
  type: questionTypeEnum,

  questionText: z
    .string()
    .trim()
    .min(5, "Question text is required"),

  explanation: z
    .string()
    .trim()
    .optional()
    .default(""),

  marks: z.number().min(0).default(1),

  negativeMarks: z.number().min(0).default(0),

  subject: z.string().trim().min(1, "Subject is required"),

  topic: z.string().trim().min(1, "Topic is required"),

  difficulty: difficultyEnum.default("medium"),

  tags: z.array(z.string().trim()).default([]),

  aiGenerated: z.boolean().default(false),

  isActive: z.boolean().default(true),
});



const singleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal("single_choice"),

  options: z.array(optionSchema).min(2, "At least 2 options required"),

  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const multipleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal("multiple_choice"),

  options: z.array(optionSchema).min(2, "At least 2 options required"),

  correctAnswer: z.array(z.string()).min(1, "At least one correct answer required"),
});

const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("true_false"),

  options: z.array(optionSchema).optional().default([]),

  correctAnswer: z.boolean(),
});

const shortAnswerSchema = baseQuestionSchema.extend({
  type: z.literal("short_answer"),

  options: z.array(optionSchema).optional().default([]),

  correctAnswer: z.string().min(1, "Answer is required"),
});


const questionUnion = z.discriminatedUnion("type", [
  singleChoiceSchema,
  multipleChoiceSchema,
  trueFalseSchema,
  shortAnswerSchema,
]);



export const CreateQuestionSchema = questionUnion.superRefine((data, ctx) => {
  const optionIds = data.options?.map((o) => o.optionId) || [];


  if (data.type === "single_choice") {
    if (!optionIds.includes(data.correctAnswer)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "Correct answer must match one of the optionIds",
      });
    }
  }

  if (data.type === "multiple_choice") {
    const invalidAnswers = data.correctAnswer.filter(
      (ans) => !optionIds.includes(ans)
    );

    if (invalidAnswers.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "All correct answers must match optionIds",
      });
    }
  }

  if (data.type === "true_false" && data.options.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "True/False question should not have options",
    });
  }


  if (data.type === "short_answer" && data.options.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Short answer should not have options",
    });
  }
});

export const BulkCreateQuestionSchema = z.array(CreateQuestionSchema).min(1, "At least one question is required");

export const UpdateQuestionSchema = z.object({
  type: questionTypeEnum.optional(),
  questionText: z.string().trim().min(5, "Question text is required").optional(),
  explanation: z.string().trim().optional(),
  marks: z.number().min(0).optional(),
  negativeMarks: z.number().min(0).optional(),
  subject: z.string().trim().min(1, "Subject is required").optional(),
  topic: z.string().trim().min(1, "Topic is required").optional(),
  difficulty: difficultyEnum.optional(),
  tags: z.array(z.string().trim()).optional(),
  aiGenerated: z.boolean().optional(),
  isActive: z.boolean().optional(),
  options: z.array(optionSchema).optional(),
  correctAnswer: z.any().optional(),
});