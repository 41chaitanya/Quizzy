import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        unique: true,
        index: true 
    },
    description: { type: String, trim: true, default: "" },
    maxCapacity: { 
        type: Number, 
        default: 0 // 0 represents unlimited. (could have used -1, null or undefined)
    },
    currentStudentCount:{
        type: Number,
        default: 0
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { 
    timestamps: true
});

batchSchema.index({ name: 1, isDeleted: 1 });

const batchModel = mongoose.model("batches", batchSchema);

export default batchModel;