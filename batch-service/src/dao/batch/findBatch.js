import mongoose from "mongoose"
import batchModel from "../../models/batch.model.js";
export const findBatch = async ({ id, name }) => {

    try {

        const conditions = [];

        if (id && mongoose.Types.ObjectId.isValid(id)) {

            conditions.push({

                _id: id

            });

        }

        if (name) {

            conditions.push({

                name: name.trim()

            });

        }

        if (conditions.length === 0) {

            return null;

        }

        const batch = await batchModel.findOne({

            isDeleted: false,

            $or: conditions

        });

        return batch;

    } catch (error) {

        throw new Error(
            `Failed to find batch: ${error.message}`
        );

    }

};