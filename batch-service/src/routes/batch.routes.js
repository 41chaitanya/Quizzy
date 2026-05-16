import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
} from "../controller/batch.controller.js";

import { validate } from "../middlewares/zod.middleware.js";
import {
  CreateBatchSchema,
  UpdateBatchSchema,
} from "../validators/zod.validator.js";

import { Router } from "express";

const batchRouter = Router();

batchRouter.post("/", validate(CreateBatchSchema), createBatch);
batchRouter.get("/", getAllBatches);
batchRouter.get("/:id", getBatchById);
batchRouter.put("/:id", validate(UpdateBatchSchema), updateBatch);
batchRouter.delete("/:id", deleteBatch);

export default batchRouter