// src/app.js

import express from 'express';
import cors from 'cors';

import authRoutes from './modules/auth/auth.routes.js';
import globalErrorHandler from './middlewares/global-error-handler.middleware.js';

const app = express();

/**
 * Middlewares
 */
app.use(
  cors({
    origin: true,        // Allow configured frontend origin(s)
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON request body

/**
 * Health Check Route
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

/**
 * API Routes
 */
app.use('/api/v1/auth', authRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Global Error Handler
 * Must be the last middleware.
 */
app.use(globalErrorHandler);

export default app;