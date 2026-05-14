import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server unhealthy',
    });
  }
});

app.get('/', (req, res)=>{
    res.end('Server is running...')
});

app.use('/api/auth', authRoutes);

app.use(globalErrorHandler);

export default app;