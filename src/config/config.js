import 'dotenv/config';


//best way to check if all required env vars are set.

const reqiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET_KEY', 'JWT_EXPIRES_IN'];

reqiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.warn(`Warning: Required Environment variable ${varName} is not set.`);
    }
});

const CONFIG = {
    PORT: process.env.PORT || 3001,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

}

export default CONFIG;
