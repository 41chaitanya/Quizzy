import express from "express"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());


// Auth routes
app.use("/api/auth", authRouter)

export default app;