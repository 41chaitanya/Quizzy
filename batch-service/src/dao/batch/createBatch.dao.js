
import batchModel from '../../models/batch.model.js'

export const createBatch = async (data) => {

    try {

        const batch = await batchModel.create(data);

        return batch;

    } catch (error) {

        throw new Error(`Failed to create batch: ${error.message}`);

    }

};