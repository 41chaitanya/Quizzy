import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// app.use("/api/auth",);

export default app;

