import batchModel from "../models/batch.model.js";

export async function create(data) {
  try {
    return await batchModel.create(data);
  } catch (error) {
    throw error;
  }
}

export async function createMany(data) {
  try {
    return await batchModel.insertMany(data);
  } catch (error) {
    throw error;
  }
}

export async function findById(id) {
  try {
    return await batchModel.findOne({
      _id: id,
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}

export async function findByName(name) {
  try {
    return await batchModel.findOne({
      name,
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}

export async function findAll() {
  try {
    return await batchModel.find({
      isDeleted: false,
    });
  } catch (error) {
    throw error;
  }
}

export async function updateById(id, data) {
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

export async function softDelete(id) {
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
