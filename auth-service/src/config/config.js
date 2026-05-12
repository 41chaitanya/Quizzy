import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.error("PORT si not defined in environment variables");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is defined in environment variables");
  process.exit(1);
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
