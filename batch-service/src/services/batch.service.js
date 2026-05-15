import mongoose from 'mongoose';
import Batch from "../models/batch.model.js";

/**
 * Create a new batch with unique name validation.
 * @param {Object} batchData - Batch data object
 * @returns {Promise<Object>} Created batch document
 * @throws {Error} If batch name already exists
 */
const createBatch = async (batchData) => {

    const existingBatch = await Batch.findOne({ name: batchData.name, isDeleted: false });

    if (existingBatch) {
        throw new Error('Batch name must be unique');
    }

    return await Batch.create(batchData);
}


/**
 * Retrieve a batch by its ID.
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const getBatchById = async (batchId) => {

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await Batch.findOne({ _id: batchId, isDeleted: false });
    if (!batch) {
        throw new Error('Batch not found');
    }
    return batch;
}


/**
 * Retrieve all non-deleted batches.
 * @returns {Promise<Array>} Array of batch documents
 */
const getAllBatches = async () => {
    return await Batch.find({ isDeleted: false });
}


/**
 * Update a batch by ID.
 * @param {string} batchId - Batch ID
 * @param {Object} batchData - Updated batch data
 * @returns {Promise<Object>} Updated batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const updateBatch = async (batchId, batchData) => {

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await Batch.findOne({ _id: batchId, isDeleted: false });

    if (!batch) {
        throw new Error('Batch not found');
    }

    Object.assign(batch, batchData);
    return await batch.save();
}


/**
 * Soft delete a batch by ID (marks as deleted).
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Deleted batch document
 * @throws {Error} If ID is invalid or batch not found
 */
const deleteBatch = async (batchId) => {

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error('Invalid batch ID');
    }

    const batch = await Batch.findOne({ _id: batchId, isDeleted: false });

    if (!batch) {
        throw new Error('Batch not found');
    }

    batch.isDeleted = true;

    return await batch.save();
}