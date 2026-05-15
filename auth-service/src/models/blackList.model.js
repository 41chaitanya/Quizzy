import mongoose from "mongoose";

const blackListSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token expires after 1 hour
    },
});

const blackListTokenModel = mongoose.model("BlackList", blackListSchema);
export default blackListTokenModel;
