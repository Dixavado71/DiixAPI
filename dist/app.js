"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./routes"));
const logger = (0, logger_1.getLogger)();
function createApp() {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    // CORS configuration
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    app.use((0, cors_1.default)({
        origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
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
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
    // HTTP logging
    app.use((0, pino_http_1.default)({
        logger,
        autoLogging: {
            ignore: (req) => req.url === '/health',
        },
    }));
    // API routes
    app.use('/api/v1', routes_1.default);
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