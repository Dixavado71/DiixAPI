export interface AuditLogCreateInput {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
export interface AuditLogFilters {
    action?: string;
    entity?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class AuditService {
    /**
     * Create an audit log entry
     */
    log(input: AuditLogCreateInput): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log user login
     */
    logLogin(userId: string, ipAddress?: string, success?: boolean): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log user logout
     */
    logLogout(userId: string, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log user creation
     */
    logUserCreation(creatorId: string, newUserId: string, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log user update
     */
    logUserUpdate(updaterId: string, targetUserId: string, changes: Record<string, any>, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log user deletion (deactivation)
     */
    logUserDeletion(deleterId: string, targetUserId: string, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log password change
     */
    logPasswordChange(userId: string, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log role change
     */
    logRoleChange(changerId: string, targetUserId: string, oldRole: string, newRole: string, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log store management actions
     */
    logStoreAction(userId: string, storeId: string, action: string, metadata?: Record<string, any>, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log order actions
     */
    logOrderAction(userId: string, orderId: string, action: string, metadata?: Record<string, any>, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Log product actions
     */
    logProductAction(userId: string, productId: string, action: string, metadata?: Record<string, any>, ipAddress?: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    /**
     * Get audit logs with filters and pagination
     */
    getLogs(filters?: AuditLogFilters, page?: number, limit?: number): Promise<{
        logs: ({
            user: {
                name: string;
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string;
            entityId: string | null;
            ipAddress: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get logs by entity
     */
    getLogsByEntity(entity: string, entityId: string, limit?: number): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    /**
     * Get logs by user
     */
    getLogsByUser(userId: string, limit?: number): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    /**
     * Get recent logs
     */
    getRecentLogs(limit?: number): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        ipAddress: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    /**
     * Get audit statistics
     */
    getStats(startDate?: Date, endDate?: Date): Promise<{
        total: number;
        byAction: {
            action: string;
            count: number;
        }[];
        byEntity: {
            entity: string;
            count: number;
        }[];
        topUsers: ({
            userId: string;
            email: string | undefined;
            name: string | undefined;
            count: number;
        } | {
            userId: null;
            email: null;
            name: string;
            count: number;
        })[];
    }>;
    /**
     * Clean old audit logs (retention policy)
     */
    cleanOldLogs(retentionDays?: number): Promise<{
        deleted: number;
        cutoffDate: Date;
    }>;
}
export declare const auditService: AuditService;
//# sourceMappingURL=audit.service.d.ts.map