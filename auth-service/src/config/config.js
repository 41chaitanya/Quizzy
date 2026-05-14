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
    process.exit(1);
  }
});


const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
};

export default config;
