import mongoose from "mongoose";
import * as batchRepository from "../repositories/batch.repository.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import ApiError from "../utils/ApiError.js";


const validateBatchId = (batchId) => {

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new ApiError(
            400,
            "Invalid batch ID"
        );
    }
};

const normalizeBatchName = (name = "") => {
    return name.trim().toLowerCase();
};


const findExistingBatch = async (batchId) => {

    validateBatchId(batchId);

    const batch = await batchRepository.findById(batchId);

    if (!batch) {
        throw new ApiError(
            404,
            "Batch not found"
        );
    }

    return batch;
};



const validateDuplicateBatchName = async (batchName, batchId = null) => {

    const existingBatch = await batchRepository.findByName(batchName);

    if (existingBatch && existingBatch._id.toString() !== batchId) {
        throw new ApiError(
            409,
            "Batch with this name already exists"
        );
    }
};



export const createBatch = async (payload, userId) => {

    const normalizedBatchName = normalizeBatchName(payload.name);

    await validateDuplicateBatchName(normalizedBatchName);

    const batchPayload = {
        ...payload,
        name: normalizedBatchName,
        createdBy: userId
    };

    const batch = await batchRepository.create(batchPayload);

    return batch;
};



export const getBatchById = async (batchId) => {

    const batch = await findExistingBatch(batchId);

    return batch;
};



export const getAllBatches = async () => {

    const batches = await batchRepository.findAll();

    return batches;
};



export const updateBatch = async (batchId, payload) => {

    await findExistingBatch(batchId);

    const updatePayload = {...payload};

    if (payload.name) {

        const normalizedBatchName = normalizeBatchName(payload.name);

        await validateDuplicateBatchName(normalizedBatchName, batchId);

        updatePayload.name = normalizedBatchName;
    }

    const updatedBatch = await batchRepository.updateById(batchId, updatePayload);

    return updatedBatch;
};



export const deleteBatch = async (batchId) => {

    await findExistingBatch(batchId);

    const hasStudents =
        await enrollmentRepository.hasActiveStudents(batchId);

    if (hasStudents) {
        throw new ApiError(400, "Cannot delete batch because students are assigned");
    }

    await batchRepository.softDelete(batchId);

    return {
        success: true,
        message: "Batch deleted successfully"
    };
};

export const addStudentToBatch = async (batchId, studentId) => {
    await findExistingBatch(batchId);

    const existing = await enrollmentRepository.findByBatchAndUser(batchId, studentId);
    if (existing) {
        throw new ApiError(409, 'Student already enrolled in this batch');
    }

    const enrollment = await enrollmentRepository.create({ batchId, userId: studentId });
    return enrollment;
};

export const removeStudentFromBatch = async (batchId, studentId) => {
    await findExistingBatch(batchId);

    const enrollment = await enrollmentRepository.removeStudent(batchId, studentId);

    if (!enrollment) {
        throw new ApiError(404, 'Student not found in this batch');
    }

    return enrollment;
};

export const getStudentsInBatch = async (batchId) => {
    await findExistingBatch(batchId);
    const students = await enrollmentRepository.findAllByBatch(batchId);
    return students;
};