<<<<<<< HEAD
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables before application startup

const requireENV = [
  "PORT",
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRE",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRE",
];

requireENV.forEach((key) => {
  if (!process.env[key]) {
    console.log(`${key} is not defined in environment variables`);
=======
import { config } from "dotenv";

config();

// Validate required environment variables on startup
const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRE',
  'REFRESH_TOKEN_EXPIRE'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`${envVar} is not defined in environment variables`);
>>>>>>> upstream/main
    process.exit(1);
  }
});

<<<<<<< HEAD

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
};

export default config;
=======
const _config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Freeze config to prevent modifications
export default Object.freeze(_config);
>>>>>>> upstream/main
