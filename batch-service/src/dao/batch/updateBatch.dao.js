import mongoose from 'mongoose'
import batchModel from '../../models/batch.model.js';
export const updateBatch = async (id, data) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return null;

        }

        const updatedBatch = await batchModel.findOneAndUpdate(

            {

                _id: id,

                isDeleted: false

            },
                // Here id is importaint for check real user and which data need update so
            data,

            {

                new: true,

                runValidators: true

            }

        );

        return updatedBatch;

    } catch (error) {

        throw new Error(`Failed to update batch: ${error.message}`);

    }

};