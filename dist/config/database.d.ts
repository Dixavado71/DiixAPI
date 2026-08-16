import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    log: ({
        level: "error";
        emit: "stdout";
    } | {
        level: "info";
        emit: "stdout";
    } | {
        level: "warn";
        emit: "stdout";
    })[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function getPrismaClient(): PrismaClient;
export declare function connectDatabase(): Promise<void>;
export declare function disconnectDatabase(): Promise<void>;
export declare function checkDatabaseHealth(): Promise<boolean>;
//# sourceMappingURL=database.d.ts.map