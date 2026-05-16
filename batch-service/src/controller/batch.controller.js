import asyncHandler from "../utils/asynchandler.js";
import batchService from "../services/batch.service.js";

export const createBatch = asyncHandler(async (req, res) => {
  const batch = await batchService.createBatch(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Batch created",
    data: batch,
  });
});

export const getAllBatches = asyncHandler(async (req, res) => {
  const batches = await batchService.getAllBatches();

  res.status(200).json({
    success: true,
    message: "Batches fetched successfully",
    data: batches,
  });
});

export const getBatchById = asyncHandler(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Batch fetched successfully",
    data: batch,
  });
});

export const updateBatch = asyncHandler(async (req, res) => {
  const updateBatch = await await batchService.updateBatch(
    req.params.id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Batch updated successfully",
    data: updateBatch,
  });
});

export const deleteBatch = asyncHandler(async (req, res) => {
  await batchService.deleteBatch(req.params.id);

  res.status(200).json({
    success: true,
    message: "Batch deleted successfully",
  });
});
