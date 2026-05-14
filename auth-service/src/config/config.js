import { config } from "dotenv";

config();

if (!process.env.PORT) {
  console.error("PORT is not defined in environment variable");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variable");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variable");
  process.exit(1);
}

const _config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default Object.freeze(_config);
