import Redis from 'ioredis';
import pino from 'pino';

const logger = pino({ name: 'redis' });

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisInstance) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redisInstance = new Redis(redisUrl, {
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

export async function checkRedisHealth(): Promise<boolean> {
  const redis = getRedisClient();
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    logger.error({ error }, 'Redis health check failed');
    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redisInstance) {
    await redisInstance.quit();
    logger.info('Redis disconnected');
    redisInstance = null;
  }
}
