import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import IndexRoutes from './routes/index.route.js';
// import { globalErrorHandler } from './middlewares/error.middleware.js';


const app = express();

// Security middleware
app.use(helmet());

// Compression middleware for response optimization
app.use(compression());

// CORS configuration for frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Cookie parsing middleware
app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Logging middleware
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



// app.use(globalErrorHandler);

export default app;