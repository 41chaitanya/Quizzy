import enrollmentModel from "../models/enrollment.model.js";

export async function createEnrollment(data) {
  try {
    return await enrollmentModel.create(data);
  } catch (error) {
    throw error;
  }
}

export async function findEnrollmentById(id) {
  try {
    return await enrollmentModel.findById(id);
  } catch (error) {
    throw error;
  }
}

export async function findEnrollmentByBatchAndUser(batchId, userId) {
  try {
    return await enrollmentModel.findOne({
      batchId,
      userId,
    });
  } catch (error) {
    throw error;
  }
}

export async function findEnrollmentsByBatchId(batchId) {
  try {
    return await enrollmentModel.find({
      batchId,
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function findEnrollmentsByUserId(userId) {
  try {
    return await enrollmentModel.find({
      userId,
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateEnrollment(id, data) {
  try {
    return await enrollmentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteEnrollment(id) {
  try {
    return await enrollmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  } catch (error) {
    throw error;
  }
}

export async function findAllEnrollments() {
  try {
    return await enrollmentModel.find({
      isActive: true,
    });
  } catch (error) {
    throw error;
  }
}
