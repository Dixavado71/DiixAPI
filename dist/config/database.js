import { PrismaClient } from '@prisma/client';
import pino from 'pino';
const logger = pino({ name: 'database' });
let prismaInstance = null;
export const prisma = new PrismaClient({
    log: [
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
    ],
});
export function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient({
            log: [
                { level: 'error', emit: 'stdout' },
                { level: 'info', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
            ],
        });
    }
    return prismaInstance;
}
export async function connectDatabase() {
    const prisma = getPrismaClient();
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');
    }
    catch (error) {
        logger.error({ error }, 'Failed to connect to database');
        // Don't throw - allow app to start for health check to report status
        process.exitCode = 1;
    }
}
export async function disconnectDatabase() {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        logger.info('Database disconnected');
        prismaInstance = null;
    }
}
export async function checkDatabaseHealth() {
    const prisma = getPrismaClient();
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        logger.error({ error }, 'Database health check failed');
        return false;
    }
}
//# sourceMappingURL=database.js.map