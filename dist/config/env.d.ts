import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    DATABASE_URL: z.ZodString;
    EVOLUTION_API_URL: z.ZodString;
    EVOLUTION_API_KEY: z.ZodString;
    EVOLUTION_WEBHOOK_SECRET: z.ZodString;
    JWT_SECRET: z.ZodString;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace"]>>;
    CORS_ORIGIN: z.ZodString;
    RATE_LIMIT_WINDOW_MS: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    RATE_LIMIT_MAX: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    LOG_LEVEL: "info" | "fatal" | "error" | "warn" | "debug" | "trace";
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX: number;
    NODE_ENV: "production" | "development" | "test";
    PORT: number;
    DATABASE_URL: string;
    EVOLUTION_API_URL: string;
    EVOLUTION_API_KEY: string;
    EVOLUTION_WEBHOOK_SECRET: string;
    JWT_SECRET: string;
}, {
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX: string;
    PORT: string;
    DATABASE_URL: string;
    EVOLUTION_API_URL: string;
    EVOLUTION_API_KEY: string;
    EVOLUTION_WEBHOOK_SECRET: string;
    JWT_SECRET: string;
    LOG_LEVEL?: "info" | "fatal" | "error" | "warn" | "debug" | "trace" | undefined;
    NODE_ENV?: "production" | "development" | "test" | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
export declare function validateEnv(): Env;
export {};
//# sourceMappingURL=env.d.ts.map