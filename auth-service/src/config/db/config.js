import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(CONFIG.MONGO_URI);
    console.log("MongoDB Connected");


    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
    
     mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err.message);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
