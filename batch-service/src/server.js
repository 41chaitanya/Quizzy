import app from "./app.js";
import CONFIG from "./configs/env.config.js";
import Database from './configs/db.config.js';

await Database.connect();

app.listen(CONFIG.SERVER_PORT, ()=>{
    console.log(`Server Running on Port: ${CONFIG.SERVER_PORT} | ${CONFIG.SERVER_HOST}`);
})