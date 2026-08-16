import Redis from 'ioredis';
export declare function getRedisClient(): Redis;
export declare function checkRedisHealth(): Promise<boolean>;
export declare function disconnectRedis(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map