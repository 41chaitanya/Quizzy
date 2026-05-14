import "dotenv/config";

const requiredEnv = ["PORT", "MONGO_URI", "JWT_SECRET"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    return console.log(`Required Env Key Missing: ${key}`);
  }
});

const CONFIG = Object.freeze({
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
});

export default CONFIG;
