import mongoose from "mongoose";
import config from "./config.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Connected to MongoDB");

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err.message);
        });

    } catch (error) {
        console.error("database connection failed:", error);
        process.exit(1);
    }
}