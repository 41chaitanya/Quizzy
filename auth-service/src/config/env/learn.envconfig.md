surya kumar

import 'dotenv/config';

const requiredEnv = [
    'SERVER_PORT',
    'SERVER_HOST',
    'MONGO_URI',
    'JWT_SECRET'
];

requiredEnv.forEach((key)=>{
    if(!process.env[key]){
        return console.log(`Required Env Key Missing: ${key}`)
    }
});

const CONFIG = {
    SERVER_PORT: process.env.SERVER_PORT,
    SERVER_HOST: process.env.SERVER_HOST,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
};

export default CONFIG;



khalid



import dotenv from "dotenv"
dotenv.config()

const requarMentalVreable = [
    "PORT",
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY"
]

requarMentalVreable.forEach((key)=>{
if(!process.env[key]){
    throw new Error(`${key} environment variable is missing`);
}
})

const config = {
    PORT:Number(process.env.PORT),
    MONGO_URI:process.env.MONGO_URI,
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRY:process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY:process.env.REFRESH_TOKEN_EXPIRY,
}

export default config