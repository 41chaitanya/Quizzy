import app from "./app.js";
<<<<<<< HEAD
import config from "./config/config.js";
import connectDB from "./config/database/database.js";

// Connect to the database before starting the HTTP server
connectDB();

const PORT = config.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
=======
import CONFIG from "./configs/env.config.js";
import Database from './configs/db.config.js';

await Database.connect();

app.listen(CONFIG.SERVER_PORT, ()=>{
    console.log(`Server Running on Port: ${CONFIG.SERVER_PORT} | ${CONFIG.SERVER_HOST}`);
})
>>>>>>> upstream/main
