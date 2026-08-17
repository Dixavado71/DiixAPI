import { Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
export declare class AuditController {
    /**
     * Get audit logs with filters
     * GET /admin/audit/logs
     */
    getLogs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get audit logs by entity
     * GET /admin/audit/entity/:entity/:entityId
     */
    getLogsByEntity(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get audit logs by user
     * GET /admin/audit/user/:userId
     */
    getLogsByUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get recent audit logs
     * GET /admin/audit/recent
     */
    getRecentLogs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get audit statistics
     * GET /admin/audit/stats
     */
    getStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Clean old audit logs
     * POST /admin/audit/cleanup
     */
    cleanupLogs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const auditController: AuditController;
//# sourceMappingURL=audit.controller.d.ts.map