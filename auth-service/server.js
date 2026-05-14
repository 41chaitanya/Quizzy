import app from "./src/app.js";
import config from "./src/configs/config.js";
import ConnectDB from './src/configs/db.js';

await ConnectDB();

app.listen(config.PORT, ()=>{
    console.log(`Server Running on Port: ${config.PORT}`);
})