import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error while connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
