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
import { AddStudentSchema, CreateBatchSchema, UpdateBatchSchema } from '../validators/zod.validator.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

// ── Batch CRUD ──────────────────────────────────────────────
router.use(isAuthenticated);
router.use(authorize('admin', 'teacher'));

router.post('/', validate(CreateBatchSchema), handleCreateBatch);
router.get('/', handleGetAllBatches);
router.get('/:id', handleGetBatchById);
router.put('/:id', validate(UpdateBatchSchema), handleUpdateBatch);
router.delete('/:id', handleDeleteBatch);

// ── Student Assignment ──────────────────────────────────────
router.post('/:id/students', validate(AddStudentSchema), handleAddStudent);
router.delete('/:id/students/:studentId', handleRemoveStudent);
router.get('/:id/students', handleGetStudents);

export default router;
