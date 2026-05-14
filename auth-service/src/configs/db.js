import mongoose from 'mongoose';
import config from './config.js';

const ConnectDB = async()=>{
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

export default ConnectDB;