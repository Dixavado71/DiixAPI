import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export class AuditService {
  /**
   * Create an audit log entry
   */
  async log(input: AuditLogCreateInput) {
    const { userId, action, entity, entityId, ipAddress, metadata } = input;

    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        ipAddress,
        metadata: metadata || {},
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return log;
  }

  /**
   * Log user login
   */
  async logLogin(userId: string, ipAddress?: string, success: boolean = true) {
    return this.log({
      userId,
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      entity: 'AdminUser',
      entityId: userId,
      ipAddress,
      metadata: { success },
    });
  }

  /**
   * Log user logout
   */
  async logLogout(userId: string, ipAddress?: string) {
    return this.log({
      userId,
      action: 'LOGOUT',
      entity: 'AdminUser',
      entityId: userId,
      ipAddress,
    });
  }

  /**
   * Log user creation
   */
  async logUserCreation(creatorId: string, newUserId: string, ipAddress?: string) {
    return this.log({
      userId: creatorId,
      action: 'USER_CREATED',
      entity: 'AdminUser',
      entityId: newUserId,
      ipAddress,
      metadata: { newUserId },
    });
  }

  /**
   * Log user update
   */
  async logUserUpdate(
    updaterId: string,
    targetUserId: string,
    changes: Record<string, any>,
    ipAddress?: string
  ) {
    return this.log({
      userId: updaterId,
      action: 'USER_UPDATED',
      entity: 'AdminUser',
      entityId: targetUserId,
      ipAddress,
      metadata: { changes },
    });
  }

  /**
   * Log user deletion (deactivation)
   */
  async logUserDeletion(deleterId: string, targetUserId: string, ipAddress?: string) {
    return this.log({
      userId: deleterId,
      action: 'USER_DEACTIVATED',
      entity: 'AdminUser',
      entityId: targetUserId,
      ipAddress,
    });
  }

  /**
   * Log password change
   */
  async logPasswordChange(userId: string, ipAddress?: string) {
    return this.log({
      userId,
      action: 'PASSWORD_CHANGED',
      entity: 'AdminUser',
      entityId: userId,
      ipAddress,
    });
  }

  /**
   * Log role change
   */
  async logRoleChange(
    changerId: string,
    targetUserId: string,
    oldRole: string,
    newRole: string,
    ipAddress?: string
  ) {
    return this.log({
      userId: changerId,
      action: 'ROLE_CHANGED',
      entity: 'AdminUser',
      entityId: targetUserId,
      ipAddress,
      metadata: { oldRole, newRole },
    });
  }

  /**
   * Log store management actions
   */
  async logStoreAction(
    userId: string,
    storeId: string,
    action: string,
    metadata?: Record<string, any>,
    ipAddress?: string
  ) {
    return this.log({
      userId,
      action,
      entity: 'Store',
      entityId: storeId,
      ipAddress,
      metadata,
    });
  }

  /**
   * Log order actions
   */
  async logOrderAction(
    userId: string,
    orderId: string,
    action: string,
    metadata?: Record<string, any>,
    ipAddress?: string
  ) {
    return this.log({
      userId,
      action,
      entity: 'Order',
      entityId: orderId,
      ipAddress,
      metadata,
    });
  }

  /**
   * Log product actions
   */
  async logProductAction(
    userId: string,
    productId: string,
    action: string,
    metadata?: Record<string, any>,
    ipAddress?: string
  ) {
    return this.log({
      userId,
      action,
      entity: 'Product',
      entityId: productId,
      ipAddress,
      metadata,
    });
  }

  /**
   * Get audit logs with filters and pagination
   */
  async getLogs(filters: AuditLogFilters = {}, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const { action, entity, userId, startDate, endDate } = filters;

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (entity) {
      where.entity = entity;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get logs by entity
   */
  async getLogsByEntity(entity: string, entityId: string, limit: number = 20) {
    const logs = await prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs;
  }

  /**
   * Get logs by user
   */
  async getLogsByUser(userId: string, limit: number = 20) {
    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs;
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit: number = 50) {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs;
  }

  /**
   * Get audit statistics
   */
  async getStats(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [total, byAction, byEntity, topUsers] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['entity'],
        where,
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ['userId'],
        where,
        _count: true,
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      total,
      byAction: byAction.map((item) => ({
        action: item.action,
        count: item._count,
      })),
      byEntity: byEntity.map((item) => ({
        entity: item.entity,
        count: item._count,
      })),
      topUsers: await Promise.all(
        topUsers.map(async (item) => {
          if (item.userId) {
            const user = await prisma.adminUser.findUnique({
              where: { id: item.userId },
              select: { email: true, name: true },
            });
            return {
              userId: item.userId,
              email: user?.email,
              name: user?.name,
              count: item._count,
            };
          }
          return {
            userId: null,
            email: null,
            name: 'System',
            count: item._count,
          };
        })
      ),
    };
  }

  /**
   * Clean old audit logs (retention policy)
   */
  async cleanOldLogs(retentionDays: number = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return {
      deleted: result.count,
      cutoffDate,
    };
  }
}

export const auditService = new AuditService();
