import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import connectDB from './database/mongodb.js';
import { config } from './config/env.js';
import routes from './routes/index.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS configuration
app.use(
  cors({
    origin: [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5177',
  'http://localhost:3000',
],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Painting Store API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`\n🚀 Server running on http://localhost:${config.port}`);
  console.log(`📦 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend: ${config.frontendUrl}\n`);
});

export default app;