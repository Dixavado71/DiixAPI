import { adminAuthService } from '../../services/admin/admin-auth.service.js';
import { auditService } from '../../services/audit/audit.service.js';
export class UsersController {
    /**
     * Get all users with pagination
     * GET /admin/users
     */
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await adminAuthService.getAllUsers(page, limit);
            return res.json({
                ...result,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch users',
            });
        }
    }
    /**
     * Get user by ID
     * GET /admin/users/:id
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            const user = await adminAuthService.getUserById(id);
            return res.json({
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(404).json({
                error: err.message || 'User not found',
            });
        }
    }
    /**
     * Get users by role
     * GET /admin/users/role/:role
     */
    async getUsersByRole(req, res) {
        try {
            const { role } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            if (!role ||
                Array.isArray(role) ||
                !['SUPER_ADMIN', 'STORE_OWNER', 'STORE_MANAGER', 'OPERATOR'].includes(role)) {
                return res.status(400).json({
                    error: 'Invalid role',
                });
            }
            const result = await adminAuthService.getUsersByRole(role, page, limit);
            return res.json({
                ...result,
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to fetch users',
            });
        }
    }
    /**
     * Update user
     * PUT /admin/users/:id
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role, active } = req.body;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            const user = await adminAuthService.updateUser(id, {
                name,
                email,
                role: role,
                active,
            });
            // Audit log
            await auditService.logUserUpdate(req.user.userId, id, { name, email, role: role, active }, req.ip || undefined);
            // If role changed, log it
            if (role && typeof role === 'string') {
                await auditService.logRoleChange(req.user.userId, id, 'UNKNOWN', role, req.ip || undefined);
            }
            return res.json({
                message: 'User updated successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to update user',
            });
        }
    }
    /**
     * Deactivate user
     * POST /admin/users/:id/deactivate
     */
    async deactivateUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            const user = await adminAuthService.deactivateUser(id);
            // Audit log
            await auditService.logUserDeletion(req.user.userId, id, req.ip || undefined);
            return res.json({
                message: 'User deactivated successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to deactivate user',
            });
        }
    }
    /**
     * Activate user
     * POST /admin/users/:id/activate
     */
    async activateUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            const user = await adminAuthService.activateUser(id);
            // Audit log
            await auditService.log({
                userId: req.user.userId,
                action: 'USER_ACTIVATED',
                entity: 'AdminUser',
                entityId: id,
                ipAddress: req.ip || undefined,
            });
            return res.json({
                message: 'User activated successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to activate user',
            });
        }
    }
    /**
     * Reset user password (admin only)
     * POST /admin/users/:id/reset-password
     */
    async resetPassword(req, res) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            if (!newPassword || Array.isArray(newPassword)) {
                return res.status(400).json({
                    error: 'New password is required',
                });
            }
            await adminAuthService.resetPassword(req.user.userId, id, newPassword);
            // Audit log
            await auditService.log({
                userId: req.user.userId,
                action: 'PASSWORD_RESET',
                entity: 'AdminUser',
                entityId: id,
                ipAddress: req.ip || undefined,
                metadata: { resetBy: req.user.userId },
            });
            return res.json({
                message: 'Password reset successfully',
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to reset password',
            });
        }
    }
    /**
     * Delete user (soft delete)
     * DELETE /admin/users/:id
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return res.status(400).json({
                    error: 'Invalid user ID',
                });
            }
            const user = await adminAuthService.deleteUser(id);
            // Audit log
            await auditService.logUserDeletion(req.user.userId, id, req.ip || undefined);
            return res.json({
                message: 'User deleted successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to delete user',
            });
        }
    }
}
export const usersController = new UsersController();
//# sourceMappingURL=users.controller.js.map