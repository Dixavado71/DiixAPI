import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1).max(65535)),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  EVOLUTION_API_URL: z.string().url(),
  EVOLUTION_API_KEY: z.string().min(1),
  EVOLUTION_WEBHOOK_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().positive()),
  RATE_LIMIT_MAX: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().positive()),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
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
