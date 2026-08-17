import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'path';
import { getLogger } from './utils/logger';
import routes from './routes';

const logger = getLogger();

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  app.use(
    cors({
      origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Body parsing with size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP logging
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/health',
      },
    })
  );

  // API routes
  app.use('/api/v1', routes);

  // Serve static files from frontend build in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
    logger.info({ distPath }, 'Serving static files from');
    app.use(express.static(distPath));

    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Root endpoint
  app.get('/' as const, (_req: Request, res: Response) => {
    res.json({
      service: 'ecms6',
      version: '1.0.0',
      documentation: '/api/v1/health',
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    logger.error({ err }, 'Unhandled error');

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
  });

  return app;
}
