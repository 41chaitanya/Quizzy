import app from './app.js';
import CONFIG from './configs/env.config.js';
import connectDB from './configs/db.config.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
//reddis. connection 
// some more logice before serve

    // Start Express server
    app.listen(CONFIG.PORT, () => {
      console.log(`Server is running on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();