"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_auth_service_js_1 = require("../../services/admin/admin-auth.service.js");
const audit_service_js_1 = require("../../services/audit/audit.service.js");
class AdminController {
    async register(req, res) {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name) {
                return res.status(400).json({
                    error: 'Email, password and name are required',
                });
            }
            const user = await admin_auth_service_js_1.adminAuthService.createUser({
                email,
                password,
                name,
                role: role,
            });
            await audit_service_js_1.auditService.logUserCreation('system', user.id, req.ip || undefined);
            return res.status(201).json({
                message: 'User created successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to create user',
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required',
                });
            }
            const result = await admin_auth_service_js_1.adminAuthService.login({ email, password });
            await audit_service_js_1.auditService.logLogin(result.user.id, req.ip || undefined, true);
            return res.json({
                message: 'Login successful',
                ...result,
            });
        }
        catch (error) {
            const err = error;
            return res.status(401).json({
                error: err.message || 'Login failed',
            });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                });
            }
            const user = await admin_auth_service_js_1.adminAuthService.getUserById(req.user.userId);
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
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                });
            }
            const { name, email } = req.body;
            const user = await admin_auth_service_js_1.adminAuthService.updateUser(req.user.userId, {
                name,
                email,
            });
            await audit_service_js_1.auditService.logUserUpdate(req.user.userId, req.user.userId, { name, email }, req.ip || undefined);
            return res.json({
                message: 'Profile updated successfully',
                user,
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to update profile',
            });
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                });
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    error: 'Current password and new password are required',
                });
            }
            await admin_auth_service_js_1.adminAuthService.changePassword(req.user.userId, currentPassword, newPassword);
            await audit_service_js_1.auditService.logPasswordChange(req.user.userId, req.ip || undefined);
            return res.json({
                message: 'Password changed successfully',
            });
        }
        catch (error) {
            const err = error;
            return res.status(400).json({
                error: err.message || 'Failed to change password',
            });
        }
    }
    async logout(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                });
            }
            await audit_service_js_1.auditService.logLogout(req.user.userId, req.ip || undefined);
            return res.json({
                message: 'Logout successful',
            });
        }
        catch (error) {
            const err = error;
            return res.status(500).json({
                error: err.message || 'Failed to logout',
            });
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=admin.controller.js.map