import batchModel from "../../models/batch.model.js";
export const findAllActiveBatches = async () => {

    try {

        const batches = await batchModel

            .find({

                isDeleted: false

            })

            .sort({

                createdAt: -1

            });

        return batches;

    } catch (error) {

        throw new Error(`Failed to fetch batches: ${error.message}`);

    }

};