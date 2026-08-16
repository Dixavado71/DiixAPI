"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.checkRedisHealth = checkRedisHealth;
exports.disconnectRedis = disconnectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ name: 'redis' });
let redisInstance = null;
function getRedisClient() {
    if (!redisInstance) {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is not set');
        }
        redisInstance = new ioredis_1.default(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3) {
                    return null;
                }
                return Math.min(times * 50, 2000);
            },
        });
        redisInstance.on('error', (error) => {
            logger.error({ error }, 'Redis error');
        });
        redisInstance.on('connect', () => {
            logger.info('Redis connected');
        });
    }
    return redisInstance;
}
async function checkRedisHealth() {
    const redis = getRedisClient();
    try {
        const result = await redis.ping();
        return result === 'PONG';
    }
    catch (error) {
        logger.error({ error }, 'Redis health check failed');
        return false;
    }
}
async function disconnectRedis() {
    if (redisInstance) {
        await redisInstance.quit();
        logger.info('Redis disconnected');
        redisInstance = null;
    }
}
//# sourceMappingURL=redis.js.map