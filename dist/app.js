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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
    // API routes (must be first)
    app.use('/api/v1', routes_1.default);
    // Root endpoint - API info
    app.get('/', (_req, res) => {
        res.json({
            service: 'ecms6',
            version: '1.0.0',
            documentation: '/api/v1/health',
        });
    });
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // Production: Serve frontend static files and SPA fallback
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
        const distPath = path_1.default.join(__dirname, '..', 'frontend', 'dist');
        logger.info({ distPath, __dirname }, 'Checking frontend build');
        // Verify frontend build exists
        const indexHtmlPath = path_1.default.join(distPath, 'index.html');
        const frontendExists = fs_1.default.existsSync(distPath) && fs_1.default.existsSync(indexHtmlPath);
        if (frontendExists) {
            const files = fs_1.default.readdirSync(distPath);
            logger.info({ distPath, files }, 'Frontend build found, serving static files');
            // Serve static assets with proper caching
            app.use(express_1.default.static(distPath, {
                maxAge: '1d',
                etag: true,
                lastModified: true,
            }));
            // SPA fallback: serve index.html for all non-API routes
            app.get('*', (req, res, next) => {
                // Skip API routes
                if (req.path.startsWith('/api/') || req.path === '/api') {
                    return next();
                }
                // Skip if file exists in dist
                const filePath = path_1.default.join(distPath, req.path);
                if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isFile()) {
                    return next();
                }
                // Serve index.html for SPA routing
                logger.info({ path: req.path }, 'SPA fallback serving index.html');
                res.sendFile(indexHtmlPath);
            });
        }
        else {
            logger.warn({ distPath, indexHtmlPath, frontendExists }, 'Frontend build not found');
        }
    }
    // 404 handler - must be after all routes
    app.use((_req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Route not found',
        });
    });
    // Global error handler - must be last
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