import app from "./app.js";
import config from "./config/config.js";
import connectToDB from "./config/database.js";

app.listen(config.PORT, async () => {
    await connectToDB()
    console.log(`Server is running on port ${config.PORT}`);
})