import mongoose from 'mongoose';
import CONFIG from './env.config.js';

class Database {
  async connect() {
    try {
      const conn = await mongoose.connect(CONFIG.MONGO_URI);

      console.log(
        `MongoDB Connected: ${conn.connection.host}`
      );

      this.registerEvents();
    } catch (error) {
      console.error('Database connection failed:', error.message);
      process.exit(1);
    }
  }

  registerEvents() {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('Mongoose error:', error.message);
    });
  }
}

export default new Database();