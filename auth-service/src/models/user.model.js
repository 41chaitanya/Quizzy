import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 5
    },
    role: {
        type: "String",
        enum: ["user", "admin"],
        required: true
    }
}, { timestamps: true });

userSchema.pre("save", async function () {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (password) {

        return await bcrypt.compare(password, this.password);
}

export default mongoose.model("User", userSchema);
