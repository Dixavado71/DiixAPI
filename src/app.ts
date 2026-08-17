import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import path from 'path';
import fs from 'fs';
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

  // API routes (must be first)
  app.use('/api/v1', routes);

  // Root endpoint - API info
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      service: 'ecms6',
      version: '1.0.0',
      documentation: '/api/v1/health',
    });
  });

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Production: Serve frontend static files and SPA fallback
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    const distPath = path.join(__dirname, '..', 'frontend', 'dist');
    
    logger.info({ distPath, __dirname }, 'Checking frontend build');
    
    // Verify frontend build exists
    const indexHtmlPath = path.join(distPath, 'index.html');
    const frontendExists = fs.existsSync(distPath) && fs.existsSync(indexHtmlPath);
    
    if (frontendExists) {
      const files = fs.readdirSync(distPath);
      logger.info({ distPath, files }, 'Frontend build found, serving static files');
      
      // Serve static assets with proper caching
      app.use(express.static(distPath, {
        maxAge: '1d',
        etag: true,
        lastModified: true,
      }));

      // SPA fallback: serve index.html for all non-API routes
      app.get('*', (req: Request, res: Response, next: NextFunction) => {
        // Skip API routes
        if (req.path.startsWith('/api/') || req.path === '/api') {
          return next();
        }
        
        // Skip if file exists in dist
        const filePath = path.join(distPath, req.path);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          return next();
        }
        
        // Serve index.html for SPA routing
        logger.info({ path: req.path }, 'SPA fallback serving index.html');
        res.sendFile(indexHtmlPath);
      });
    } else {
      logger.warn({ distPath, indexHtmlPath, frontendExists }, 'Frontend build not found');
    }
  }

  // 404 handler - must be after all routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  // Global error handler - must be last
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
