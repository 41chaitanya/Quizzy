import { Router } from "express";
import batchRouter from "./batch.routes.js";

const routes = Router();

routes.use("/batches", batchRouter);

export default routes