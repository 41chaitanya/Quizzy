import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.error("PORT si not defined in environment variables");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRE) {
  console.error(
    "ACCESS_TOKEN_SECRET and ACCESS_TOKEN_EXPIRE is not defined in environment variables",
  );
  process.exit(1)
}
if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRE) {
  console.error(
    "REFRESH_TOKEN_SECRET and REFRESH_TOKEN_EXPIRE is not defined in environment variables",
  );
  process.exit(1);
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE,
};

export default config;
