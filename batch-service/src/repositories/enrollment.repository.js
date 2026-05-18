import enrollmentModel from "../models/enrollment.model.js";

export async function create(data) {
    return await enrollmentModel.create(data);
}

export async function findByBatchAndUser(batchId, userId) {
    return await enrollmentModel.findOne({ batchId, userId, isActive: true });
}

export async function findAnyByBatchAndUser(batchId, userId) {
    return await enrollmentModel.findOne({ batchId, userId });
}

export async function findAllByBatch(batchId) {
    return await enrollmentModel.find({ batchId, isActive: true }).populate('userId', '-password');
}

export async function removeStudent(batchId, userId) {
    return await enrollmentModel.findOneAndUpdate(
        { batchId, userId, isActive: true },
        { isActive: false },
        { new: true }
    );
}

export async function reactivateStudent(batchId, userId) {
    return await enrollmentModel.findOneAndUpdate(
        { batchId, userId },
        { isActive: true, joinedAt: new Date() },
        { new: true }
    );
}

export async function hasActiveStudents(batchId) {
    const count = await enrollmentModel.countDocuments({ batchId, isActive: true });
    return count > 0;
}
