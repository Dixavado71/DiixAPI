import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { getLogger } from './utils/logger';
import routes from './routes';
const logger = getLogger();
export function createApp() {
    const app = express();
    // Security middleware
    app.use(helmet());
    // CORS configuration
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    app.use(cors({
        origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
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
    app.use(pinoHttp({
        logger,
        autoLogging: {
            ignore: (req) => req.url === '/health',
        },
    }));
    // API routes
    app.use('/api/v1', routes);
    // Root endpoint
    app.get('/', (_req, res) => {
        res.json({
            service: 'ecms6',
            version: '1.0.0',
            documentation: '/api/v1/health',
        });
    });
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
        });
    });
    // Global error handler
    app.use((err, _req, res, next) => {
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
//# sourceMappingURL=app.js.map