import app from "./src/app.js"
import { connectToDB } from "./src/config/db.config.js"
import { PORT } from "./src/config/env.config.js"

connectToDB().then(() => {
    console.log("Database Connected Successfully.")
    app.listen(PORT, () => console.log("Server Is Running On Port : ", PORT))
})