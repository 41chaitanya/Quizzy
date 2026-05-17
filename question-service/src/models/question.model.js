import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
    {
        optionId: {
            type: String,
            required: true,
            trim: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);

const questionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                "single_choice",
                "multiple_choice",
                "true_false",
                "short_answer"
            ],
            required: true,
            index: true
        },

        questionText: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [optionSchema],
            default: []
        },

        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        explanation: {
            type: String,
            trim: true,
            default: ""
        },

        marks: {
            type: Number,
            required: true,
            min: 0,
            default: 1
        },

        negativeMarks: {
            type: Number,
            min: 0,
            default: 0
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        topic: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
            index: true
        },

        tags: {
            type: [String],
            default: []
        },

        aiGenerated: {
            type: Boolean,
            default: false
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },

        version: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

questionSchema.index({
    subject: 1,
    topic: 1,
    difficulty: 1,
    type: 1
});

const QuestionModel = mongoose.model(
    "questions",
    questionSchema
);

export default QuestionModel;
