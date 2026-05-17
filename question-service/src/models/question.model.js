import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["MCQ", "MSQ", "TRUE_FALSE", "SHORT_ANSWER"],
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, //prevent storing large question text in database
    },
    options: {
      type: [{ type: String, maxlength: 500 }],
      validate: {
        validator: function (v) {
          if (
            (this.type === "MCQ" || this.type === "MSQ") &&
            (!v || v.length < 2)
          ) {
            return false; // for MCQ and MSQ, array length should be >= 2
          }
          return true;
        },
        message: "MCQ and MSQ must have at least 2 options.",
      },
    },
    correctAnswer: { 
      type: mongoose.Schema.Types.Mixed, 
      required: true,
      validate: {
        validator: function (v) {
          if (this.type === "MCQ") {
            return this.options && this.options.includes(v); // Check if the ans exists in the options array
          }
          if (this.type === "MSQ") {
            if (!Array.isArray(v) || v.length === 0) return false; // Check if the ans is an array and not empty
            return v.every((ans) => this.options && this.options.includes(ans)); // Check if all the ans exist in the options array
          }
          return true; // for TRUE_FALSE and SHORT_ANSWER
        },
        message: "Correct answer must be valid according to the provided options.",
      },
    },
    explanation: { type: String, maxlength: 2000 }, //size limitation
    marks: { type: Number, required: true, min: 0 },
    negativeMarks: { 
      type: Number, // the input must be in negative (e.g. -1, -2)
      default: 0, 
      max: 0,
      validate: {
        validator: function(v) {
          // 'this' refers to the current document
          return v >= -this.marks;
        },
        message: "Negative marks cannot be greater (in magnitude) than the total marks."
      }
    }, // the number of negative marks for each incorrect answer
    subject: { type: String, required: true, index: true }, // indexed for fast querying
    topic: { type: String, required: true, index: true }, // indexed for fast querying
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
    tags: {
      type: [{ type: String, maxlength: 50 }],
      validate: {
        validator: function (v) {
          return !v || v.length <= 20; //max 20 tags per question, each tag max 50 characters long
        },
        message: "Maximum 20 tags allowed.",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ref -> reference to the User model
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes for performance optimization
questionSchema.index({ createdBy: 1 });
questionSchema.index({ subject: 1, topic: 1, isActive: 1 });

const questionModel = mongoose.model("Question", questionSchema);
export default questionModel;


// ------------------------------ NOTE ------------------------------
// If you want to update a question, fetch it, change it, and call .save().
// This populates the this keyword properly, and all our validations will work correctly.
// If you use direct update methods like .updateOne() or .findByIdAndUpdate(),
// Mongoose does not load the document into memory. Because of this, the this
// keyword inside our validators will be undefined, and the validation will crash.
// ------------------------------------------------------------------ 