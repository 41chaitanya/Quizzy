import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
    batchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'batches', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, { 
    timestamps: true 
});


// Prevent same student from joining same batch twice
enrollmentSchema.index({ batchId: 1, userId: 1 }, { unique: true });

// Index for fast lookup of all batches a user is enrolled in
enrollmentSchema.index({ userId: 1 });

const enrollmentModel = mongoose.model("enrollments", enrollmentSchema);

export default enrollmentModel;