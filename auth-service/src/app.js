import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);

app.get("*not", (req, res) => {
    res.send("Path Not Found.")
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

export default app;