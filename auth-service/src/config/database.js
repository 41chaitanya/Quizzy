import mongoose from "mongoose";
import config from "./config.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected To DB");
  } catch (error) {
    console.log("Error while connecting to DB", error);
    process.exit(1);
  }
};

export default connectToDB
