import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.JWT_SECRET ||
  !process.env.SERVICE_API_KEY
) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

export const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  SERVICE_API_KEY: process.env.SERVICE_API_KEY,
};
