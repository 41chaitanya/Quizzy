import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.route.js";

const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Register the user route handlers under /api/users
app.use("/api/users", userRoutes);

export default app;
