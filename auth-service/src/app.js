import express from 'express';
import morgan from 'morgan';
import IndexRoutes from './routes/index.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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

app.use('/api', IndexRoutes);

app.use(globalErrorHandler);

export default app;