"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditController = exports.AuditController = void 0;
const audit_service_js_1 = require("../../services/audit/audit.service.js");
class AuditController {
    /**
     * Get audit logs with filters
     * GET /admin/audit/logs
     */
    async getLogs(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const { action, entity, userId, startDate, endDate } = req.query;
            const filters = {};
            if (action)
                filters.action = action;
            if (entity)
                filters.entity = entity;
            if (userId)
                filters.userId = userId;
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
            const result = await audit_service_js_1.auditService.getLogs(filters, page, limit);
            return res.json({
                ...result,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to fetch audit logs',
            });
        }
    }
    /**
     * Get audit logs by entity
     * GET /admin/audit/entity/:entity/:entityId
     */
    async getLogsByEntity(req, res) {
        try {
            const { entity, entityId } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const logs = await audit_service_js_1.auditService.getLogsByEntity(entity, entityId, limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to fetch audit logs',
            });
        }
    }
    /**
     * Get audit logs by user
     * GET /admin/audit/user/:userId
     */
    async getLogsByUser(req, res) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const logs = await audit_service_js_1.auditService.getLogsByUser(userId, limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to fetch audit logs',
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
            const logs = await audit_service_js_1.auditService.getRecentLogs(limit);
            return res.json({
                logs,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to fetch recent audit logs',
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
            const stats = await audit_service_js_1.auditService.getStats(start, end);
            return res.json({
                stats,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to fetch audit statistics',
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
            const result = await audit_service_js_1.auditService.cleanOldLogs(retentionDays);
            return res.json({
                message: 'Audit logs cleaned successfully',
                ...result,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message || 'Failed to clean audit logs',
            });
        }
    }
}
exports.AuditController = AuditController;
exports.auditController = new AuditController();
//# sourceMappingURL=audit.controller.js.map