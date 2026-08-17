"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.getPrismaClient = getPrismaClient;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
exports.checkDatabaseHealth = checkDatabaseHealth;
const client_1 = require("@prisma/client");
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ name: 'database' });
let prismaInstance = null;
exports.prisma = new client_1.PrismaClient({
    log: [
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
    ],
});
function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new client_1.PrismaClient({
            log: [
                { level: 'error', emit: 'stdout' },
                { level: 'info', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
            ],
        });
    }
    return prismaInstance;
}
async function connectDatabase() {
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
async function disconnectDatabase() {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        logger.info('Database disconnected');
        prismaInstance = null;
    }
}
async function checkDatabaseHealth() {
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