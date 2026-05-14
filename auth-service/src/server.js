import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/database/database.js";

// Connect to the database before starting the HTTP server
connectDB();

const PORT = config.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





