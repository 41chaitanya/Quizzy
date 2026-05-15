import enrollmentModel from "../models/enrollment.model.js";

export async function create(data) {
  try {
    return await enrollmentModel.create(data);
  } catch (error) {
    throw error;
  }
}

export async function findById(id) {
  try {
    return await enrollmentModel.findById(id);
  } catch (error) {
    throw error;
  }
}

export async function findByBatchAndUser(batchId, userId) {
  try {
    return await enrollmentModel.findOne({
      batchId,
      userId,
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function findByBatchId(batchId) {
  try {
    return await enrollmentModel.find({
      batchId,
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function findByUserId(userId) {
  try {
    return await enrollmentModel.find({
      userId,
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function findAll() {
  try {
    return await enrollmentModel.find({
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateById(id, data) {
  try {
    return await enrollmentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function softDelete(id) {
  try {
    return await enrollmentModel.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );
  } catch (error) {
    throw error;
  }
}

export async function hasActiveStudents(batchId) {
  try {
    const enrollment = await enrollmentModel.exists({
      batchId,
      isActive: true,
    });

    return Boolean(enrollment);
  } catch (error) {
    throw error;
  }
}
