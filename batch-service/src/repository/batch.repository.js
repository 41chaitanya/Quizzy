import batchModel from "../models/batch.model.js";

export async function createBatch(data) {
  try {
    return await batchModel.create(data);
  } catch (error) {
    throw error;
  }
}

export async function findBatchById(id) {
  try {
    return await batchModel.findOne({
      _id: id,
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}

export async function findBatchByName(name) {
  try {
    return await batchModel.findOne({
      name,
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateBatch(id, data) {
  try {
    return await batchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      data,
      {
        new: true,
        runValidators: true,
      },
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteBatch(id) {
  try {
    return await batchModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );
  } catch (error) {
    throw error;
  }
}

export async function findAllBatches() {
  try {
    return await batchModel.find({
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}
