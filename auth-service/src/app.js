import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; 
import authRouter from "./routes/auth.Routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/api/auth", authRouter);

export default app;