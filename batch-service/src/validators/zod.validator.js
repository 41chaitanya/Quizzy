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

  maxCapacity: z
    .coerce.number()
    .int({ message: 'Max capacity must be a whole number' })
    .min(0, { message: 'Max capacity cannot be negative' })
    .optional(),

  status: z
    .enum(['active', 'inactive'])
    .optional(),
});

export const CreateBatchSchema = BatchBaseSchema;

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