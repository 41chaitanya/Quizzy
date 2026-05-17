import mongoose from "mongoose"
import config from "./config.js";

const connectDB = async ()=>{
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log("DataBase Connected")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB