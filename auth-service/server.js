import app from "./src/app.js";
import ConnectDB from "./src/config/db.js"
import config from "./src/config/config.js";
import dns from "node:dns/promises"
dns.setServers(["8.8.8.8","8.8.4.4"])

const PORT = config.PORT || 3000

ConnectDB()

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})