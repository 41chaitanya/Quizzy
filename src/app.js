import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(compression());

//  - /api/auth/signup
//  - /api/auth/login
//  - /api/auth/profile
app.use("/api/auth", authRoutes);

export default app;

