import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        instructions: {
            type: String,
            default: "",
            trim: true
        },

        batchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "batches",
            required: true,
            index: true
        },

        mode: {
            type: String,
            enum: ["fixed", "dynamic", "hybrid"],
            default: "dynamic",
            index: true
        },

        manualQuestionIds: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "questions"
                }
            ],
            default: []
        },

        autoRules: {
            subject: { type: String, trim: true },
            topic: { type: String, trim: true },
            difficulty: {
                type: String,
                enum: ["easy", "medium", "hard"]
            },
            type: {
                type: String,
                enum: [
                    "single_choice",
                    "multiple_choice",
                    "true_false",
                    "short_answer"
                ]
            },
            totalQuestions: { type: Number, min: 1 }
        },

        totalQuestions: {
            type: Number,
            required: true,
            min: 1
        },

        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },

        durationInMinutes: {
            type: Number,
            required: true,
            min: 1
        },

        isRandomized: {
            type: Boolean,
            default: true
        },

        publishedAt: {
            type: Date,
            default: null
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

quizSchema.index({ batchId: 1 });

quizSchema.index({
    "autoRules.subject": 1,
    "autoRules.topic": 1,
    "autoRules.difficulty": 1
});

export default mongoose.model("quizzes", quizSchema);