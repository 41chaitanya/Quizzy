import mongoose from "mongoose"
import batchModel from "../../models/batch.model.js";

export const deleteBatch = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const deletedBatch = await batchModel.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true
            },
            {
                new: true
            }
        );
        // This is soft delete here. first find, second update, last return
        return deletedBatch;
    } catch (error) {
        throw new Error(`Failed to delete batch: ${error.message}`);

    }

};

