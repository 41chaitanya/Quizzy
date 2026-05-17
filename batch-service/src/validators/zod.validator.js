import * as z from 'zod';

const BatchBaseSchema = z.object({
  name: z
    .string({
      required_error: 'Batch name is required',
    })
    .trim()
    .min(3, {
      message: 'Batch name must be at least 3 characters',
    })
    .max(50, {
      message: 'Batch name cannot exceed 50 characters',
    }),

  description: z
    .string()
    .trim()
    .max(200, {
      message: 'Description cannot exceed 200 characters',
    })
    .optional(),

  startDate: z.coerce.date({
    required_error: 'Start date is required',
  }),

  endDate: z.coerce.date({
    required_error: 'End date is required',
  }),

  status: z
    .enum(['active', 'inactive'])
    .default('active'),
});

export const CreateBatchSchema =
  BatchBaseSchema.refine(
    (data) => data.endDate > data.startDate,
    {
      message:
        'End date must be after start date',
      path: ['endDate'],
    }
  );

export const UpdateBatchSchema =
  BatchBaseSchema.partial();

export const AddStudentSchema = z.object({
  studentId: z
    .string({
      required_error: 'Student ID is required',
    })
    .regex(
      /^[0-9a-fA-F]{24}$/,
      {
        message: 'Invalid student ID',
      }
    ),
});