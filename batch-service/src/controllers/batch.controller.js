import asyncHandler from '../utils/asyncHandler.js';
import * as BatchService from '../services/batch.service.js';
import { successResponse } from '../utils/response.js';

export const handleCreateBatch = asyncHandler(async (req, res) => {
    const { name, description, maxCapacity, status } = req.body;

    const batch = await BatchService.createBatch({
        name,
        description,
        maxCapacity,
        status,
    }, req.user?._id);

    return successResponse(res, "Batch created successfully", batch);
});

export const handleGetAllBatches = asyncHandler(async (req, res) => {
    const batches = await BatchService.getAllBatches();
    return successResponse(res, "Batches fetched successfully", batches);
});

export const handleGetBatchById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const batch = await BatchService.getBatchById(id);
    return successResponse(res, "Batch fetched successfully", batch);
});

export const handleUpdateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, maxCapacity, status } = req.body; 

    const batch = await BatchService.updateBatch(id, {
        name,
        description,
        maxCapacity,
        status,
    });

    return successResponse(res, "Batch updated successfully", batch);
});

export const handleDeleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await BatchService.deleteBatch(id);
    return successResponse(res, "Batch deleted successfully");
});

export const handleAddStudent = asyncHandler(async (req, res) => {
    const { id: batchId } = req.params;
    const { studentId } = req.body;

    const enrollment = await BatchService.addStudentToBatch(batchId, studentId);

    return successResponse(res, "Student added successfully", enrollment);
});

export const handleRemoveStudent = asyncHandler(async (req, res) => {
    const { id: batchId, studentId } = req.params;

    const enrollment = await BatchService.removeStudentFromBatch(batchId, studentId);

    return successResponse(res, "Student removed successfully", enrollment);
});

export const handleGetStudents = asyncHandler(async (req, res) => {
    const { id: batchId } = req.params;

    const students = await BatchService.getStudentsInBatch(batchId);

    return successResponse(res, "Students fetched successfully", {
        count: students.length,
        students,
    });
});
