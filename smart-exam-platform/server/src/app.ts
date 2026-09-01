import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request Logging with Morgan and Winston
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// Body Parsing & Payload size management
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Response Compression
app.use(compression());

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Examination Management Platform API is running healthy',
    timestamp: new Date(),
    env: process.env.NODE_ENV,
  });
});

import authRouter from './routes/auth.routes';
import examRouter from './routes/exam.routes';
import questionRouter from './routes/question.routes';
import evaluationRouter from './routes/evaluation.routes';
import resultRouter from './routes/result.routes';
import analyticsRouter from './routes/analytics.routes';

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/evaluations', evaluationRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/analytics', analyticsRouter);

// Global Error Handler Middleware
app.use(errorHandler);

// Listen to server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server successfully running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
export { app };
