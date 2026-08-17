import { validateEnv } from './env.js';

export const env = validateEnv();

export const PORT = env.PORT;
export const NODE_ENV = env.NODE_ENV;
export const DATABASE_URL = env.DATABASE_URL;
export const EVOLUTION_API_URL = env.EVOLUTION_API_URL;
export const EVOLUTION_API_KEY = env.EVOLUTION_API_KEY;
export const EVOLUTION_WEBHOOK_SECRET = env.EVOLUTION_WEBHOOK_SECRET;
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
export const LOG_LEVEL = env.LOG_LEVEL;
export const CORS_ORIGIN = env.CORS_ORIGIN;
export const RATE_LIMIT_WINDOW_MS = env.RATE_LIMIT_WINDOW_MS;
export const RATE_LIMIT_MAX = env.RATE_LIMIT_MAX;
