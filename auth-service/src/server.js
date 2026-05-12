import app from './app.js';
import config from './config/config.js';
import connectDB from './config/database/database.js';

connectDB()

const PORT = config.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`Server is runnig on http://localhost:${PORT}`);
})