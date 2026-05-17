import 'dotenv/config';

const requiredEnv = [
    'SERVER_PORT',
    'SERVER_HOST',
    'MONGO_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'FRONTEND_URL'
];

requiredEnv.forEach((key)=>{
    if(!process.env[key]){
        return console.log(`Required Env Key Missing: ${key}`)
    }
});

const CONFIG = Object.freeze({
    SERVER_PORT: process.env.SERVER_PORT,
    SERVER_HOST: process.env.SERVER_HOST,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL
});

export default CONFIG;