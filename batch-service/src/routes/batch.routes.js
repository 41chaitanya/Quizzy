import { Router } from 'express';
import {
    handleCreateBatch,
    handleGetAllBatches,
    handleGetBatchById,
    handleUpdateBatch,
    handleDeleteBatch,
    handleAddStudent,
    handleRemoveStudent,
    handleGetStudents,
} from '../controllers/batch.controller.js';
import { validate } from '../middlewares/zod.middleware.js';
import { AddStudentSchema } from '../validators/zod.validator.js';

const router = Router();

// ── Batch CRUD ──────────────────────────────────────────────
router.post('/', handleCreateBatch);
router.get('/', handleGetAllBatches);
router.get('/:id', handleGetBatchById);
router.put('/:id', handleUpdateBatch);
router.delete('/:id', handleDeleteBatch);

// ── Student Assignment ──────────────────────────────────────
router.post('/:id/students', validate(AddStudentSchema), handleAddStudent);
router.delete('/:id/students/:studentId', handleRemoveStudent);
router.get('/:id/students', handleGetStudents);

export default router;
