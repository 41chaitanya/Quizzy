import app from "./src/app.js";
import config from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";


const PORT = config.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
