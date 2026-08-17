"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_MAX = exports.RATE_LIMIT_WINDOW_MS = exports.CORS_ORIGIN = exports.LOG_LEVEL = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.EVOLUTION_WEBHOOK_SECRET = exports.EVOLUTION_API_KEY = exports.EVOLUTION_API_URL = exports.DATABASE_URL = exports.NODE_ENV = exports.PORT = exports.env = void 0;
const env_js_1 = require("./env.js");
exports.env = (0, env_js_1.validateEnv)();
exports.PORT = exports.env.PORT;
exports.NODE_ENV = exports.env.NODE_ENV;
exports.DATABASE_URL = exports.env.DATABASE_URL;
exports.EVOLUTION_API_URL = exports.env.EVOLUTION_API_URL;
exports.EVOLUTION_API_KEY = exports.env.EVOLUTION_API_KEY;
exports.EVOLUTION_WEBHOOK_SECRET = exports.env.EVOLUTION_WEBHOOK_SECRET;
exports.JWT_SECRET = exports.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = exports.env.JWT_EXPIRES_IN;
exports.LOG_LEVEL = exports.env.LOG_LEVEL;
exports.CORS_ORIGIN = exports.env.CORS_ORIGIN;
exports.RATE_LIMIT_WINDOW_MS = exports.env.RATE_LIMIT_WINDOW_MS;
exports.RATE_LIMIT_MAX = exports.env.RATE_LIMIT_MAX;
//# sourceMappingURL=index.js.map