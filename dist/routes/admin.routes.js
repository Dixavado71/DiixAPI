"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin/admin.controller.js");
const users_controller_js_1 = require("../controllers/admin/users.controller.js");
const audit_controller_js_1 = require("../controllers/admin/audit.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
exports.adminRoutes = router;
// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
// Register new user (only for initial setup or by invitation)
router.post('/auth/register', admin_controller_js_1.adminController.register.bind(admin_controller_js_1.adminController));
// Login
router.post('/auth/login', admin_controller_js_1.adminController.login.bind(admin_controller_js_1.adminController));
// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
// Auth routes
router.get('/auth/me', auth_middleware_js_1.authenticate, admin_controller_js_1.adminController.getProfile.bind(admin_controller_js_1.adminController));
router.put('/auth/profile', auth_middleware_js_1.authenticate, admin_controller_js_1.adminController.updateProfile.bind(admin_controller_js_1.adminController));
router.post('/auth/change-password', auth_middleware_js_1.authenticate, admin_controller_js_1.adminController.changePassword.bind(admin_controller_js_1.adminController));
router.post('/auth/logout', auth_middleware_js_1.authenticate, admin_controller_js_1.adminController.logout.bind(admin_controller_js_1.adminController));
// User management routes (SUPER_ADMIN and STORE_OWNER only)
router.get('/users', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.getAllUsers.bind(users_controller_js_1.usersController));
router.get('/users/:id', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.getUserById.bind(users_controller_js_1.usersController));
router.get('/users/role/:role', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireSuperAdmin, users_controller_js_1.usersController.getUsersByRole.bind(users_controller_js_1.usersController));
router.put('/users/:id', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.updateUser.bind(users_controller_js_1.usersController));
router.post('/users/:id/deactivate', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.deactivateUser.bind(users_controller_js_1.usersController));
router.post('/users/:id/activate', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.activateUser.bind(users_controller_js_1.usersController));
router.post('/users/:id/reset-password', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireSuperAdmin, users_controller_js_1.usersController.resetPassword.bind(users_controller_js_1.usersController));
router.delete('/users/:id', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, users_controller_js_1.usersController.deleteUser.bind(users_controller_js_1.usersController));
// Audit log routes (SUPER_ADMIN and STORE_OWNER only)
router.get('/audit/logs', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, audit_controller_js_1.auditController.getLogs.bind(audit_controller_js_1.auditController));
router.get('/audit/entity/:entity/:entityId', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, audit_controller_js_1.auditController.getLogsByEntity.bind(audit_controller_js_1.auditController));
router.get('/audit/user/:userId', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, audit_controller_js_1.auditController.getLogsByUser.bind(audit_controller_js_1.auditController));
router.get('/audit/recent', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireOperator, audit_controller_js_1.auditController.getRecentLogs.bind(audit_controller_js_1.auditController));
router.get('/audit/stats', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireStoreOwner, audit_controller_js_1.auditController.getStats.bind(audit_controller_js_1.auditController));
router.post('/audit/cleanup', auth_middleware_js_1.authenticate, auth_middleware_js_1.requireSuperAdmin, audit_controller_js_1.auditController.cleanupLogs.bind(audit_controller_js_1.auditController));
//# sourceMappingURL=admin.routes.js.map