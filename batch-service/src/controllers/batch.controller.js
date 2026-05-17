import asyncHandler from '../utils/asyncHandler.js';
import { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch } from '../services/batch.service.js';
import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import ApiError from '../utils/ApiError.js';

export const handleCreateBatch = asyncHandler(async (req, res) => {
    const { name, description, maxCapacity, status } = req.body;

    const batch = await createBatch({
        name,
        description,
        maxCapacity,
        status,
        createdBy: req.user?._id || req.user?.id,
    });

    return res.status(201).json({
        success: true,
        message: "Batch created successfully",
        batch,
    });
});


export const handleGetAllBatches = asyncHandler(async (req, res) => {
    const batches = await getAllBatches();

    return res.status(200).json({
        success: true,
        message: "Batches fetched successfully",
        batches,
    });
});


export const handleGetBatchById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const batch = await getBatchById(id);

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch fetched successfully",
        batch,
    });
});


export const handleUpdateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { name, description, maxCapacity, status } = req.body; 

    const batch = await updateBatch(id, {
        name,
        description,
        maxCapacity,
        status,
    });

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch updated successfully",
        batch,
    });
});


export const handleDeleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const batch = await deleteBatch(id);

    if (!batch) {
        return res.status(404).json({
            success: false,
            message: "Batch not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Batch deleted successfully",
    });
});


export const handleAddStudent = asyncHandler(async (req, res) => {
    const { id: batchId } = req.params;
    const { studentId } = req.body;

    // Verify batch exists (throws 404 if not found)
    await getBatchById(batchId);

    // Prevent duplicate enrollment
    const existing = await enrollmentRepository.findByBatchAndUser(batchId, studentId);
    if (existing) {
        throw new ApiError(409, 'Student already enrolled in this batch');
    }

    const enrollment = await enrollmentRepository.create({ batchId, userId: studentId });

    return res.status(201).json({
        success: true,
        message: 'Student added successfully',
        data: enrollment,
    });
});


export const handleRemoveStudent = asyncHandler(async (req, res) => {
    const { id: batchId, studentId } = req.params;

    // Verify batch exists (throws 404 if not found)
    await getBatchById(batchId);

    const enrollment = await enrollmentRepository.removeStudent(batchId, studentId);

    if (!enrollment) {
        throw new ApiError(404, 'Student not found in this batch');
    }

    return res.status(200).json({
        success: true,
        message: 'Student removed successfully',
        data: enrollment,
    });
});


export const handleGetStudents = asyncHandler(async (req, res) => {
    const { id: batchId } = req.params;

    // Verify batch exists (throws 404 if not found)
    await getBatchById(batchId);

    const students = await enrollmentRepository.findAllByBatch(batchId);

    return res.status(200).json({
        success: true,
        message: 'Students fetched successfully',
        count: students.length,
        data: students,
    });
});
