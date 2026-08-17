"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z
        .string()
        .transform((val) => Number(val))
        .pipe(zod_1.z.number().min(1).max(65535)),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    EVOLUTION_API_URL: zod_1.z.string().url(),
    EVOLUTION_API_KEY: zod_1.z.string().min(1),
    EVOLUTION_WEBHOOK_SECRET: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(1),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    CORS_ORIGIN: zod_1.z.string(),
    RATE_LIMIT_WINDOW_MS: zod_1.z
        .string()
        .transform((val) => Number(val))
        .pipe(zod_1.z.number().positive()),
    RATE_LIMIT_MAX: zod_1.z
        .string()
        .transform((val) => Number(val))
        .pipe(zod_1.z.number().positive()),
});
function validateEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('❌ Environment validation failed:');
        Object.entries(result.error.flatten().fieldErrors).forEach(([key, errors]) => {
            console.error(`  ${key}: ${errors.join(', ')}`);
        });
        process.exit(1);
    }
    return result.data;
}
//# sourceMappingURL=env.js.map