import { auditService } from '../../services/audit/audit.service.js';
// Helper function to safely extract string from query params
const getStringParam = (param) => {
    if (typeof param === 'string')
        return param;
    return undefined;
};
export class AuditController {
    /**
     * Get audit logs with filters
     * GET /admin/audit/logs
     */
    async getLogs(req, res) {
        try {
            const page = parseInt(getStringParam(req.query.page) || '1', 10);
            const limit = parseInt(getStringParam(req.query.limit) || '50', 10);
            const { action, entity, userId, startDate, endDate } = req.query;
            const filters = {};
            if (action && typeof action === 'string')
                filters.action = action;
            if (entity && typeof entity === 'string')
                filters.entity = entity;
            if (userId && typeof userId === 'string')
                filters.userId = userId;
            if (startDate && typeof startDate === 'string')
                filters.startDate = new Date(startDate);
            if (endDate && typeof endDate === 'string')
                filters.endDate = new Date(endDate);
            const result = await auditService.getLogs(filters, page, limit);
            return res.json({
                ...result,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch audit logs',
            });
        }
    }
    /**
     * Get audit logs by entity
     * GET /admin/audit/entity/:entity/:entityId
     */
    async getLogsByEntity(req, res) {
        try {
            const entity = getStringParam(req.params.entity);
            const entityId = getStringParam(req.params.entityId);
            if (!entity || !entityId) {
                return res.status(400).json({
                    error: 'Invalid entity or entityId',
                });
            }
            const limit = parseInt(getStringParam(req.query.limit) || '20', 10);
            const logs = await auditService.getLogsByEntity(entity, entityId, limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch audit logs',
            });
        }
    }
    /**
     * Get audit logs by user
     * GET /admin/audit/user/:userId
     */
    async getLogsByUser(req, res) {
        try {
            const userId = getStringParam(req.params.userId);
            if (!userId) {
                return res.status(400).json({
                    error: 'Invalid userId',
                });
            }
            const limit = parseInt(getStringParam(req.query.limit) || '20', 10);
            const logs = await auditService.getLogsByUser(userId, limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch audit logs',
            });
        }
    }
    /**
     * Get recent audit logs
     * GET /admin/audit/recent
     */
    async getRecentLogs(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const logs = await auditService.getRecentLogs(limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch recent audit logs',
            });
        }
    }
    /**
     * Get audit statistics
     * GET /admin/audit/stats
     */
    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;
            const stats = await auditService.getStats(start, end);
            return res.json({
                stats,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch audit statistics',
            });
        }
    }
    /**
     * Clean old audit logs
     * POST /admin/audit/cleanup
     */
    async cleanupLogs(req, res) {
        try {
            const retentionDays = parseInt(req.body.retentionDays) || 365;
            const result = await auditService.cleanOldLogs(retentionDays);
            return res.json({
                message: 'Audit logs cleaned successfully',
                ...result,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to clean audit logs',
            });
        }
    }
}
export const auditController = new AuditController();
//# sourceMappingURL=audit.controller.js.map