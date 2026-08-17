import { Router } from 'express';
import { adminController } from '../controllers/admin/admin.controller.js';
import { usersController } from '../controllers/admin/users.controller.js';
import { auditController } from '../controllers/admin/audit.controller.js';
import {
  authenticate,
  authorize,
  requireSuperAdmin,
  requireStoreOwner,
  requireOperator,
} from '../middlewares/auth.middleware.js';

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Register new user (only for initial setup or by invitation)
router.post('/auth/register', adminController.register.bind(adminController));

// Login
router.post('/auth/login', adminController.login.bind(adminController));

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Auth routes
router.get(
  '/auth/me',
  authenticate,
  adminController.getProfile.bind(adminController)
);
router.put(
  '/auth/profile',
  authenticate,
  adminController.updateProfile.bind(adminController)
);
router.post(
  '/auth/change-password',
  authenticate,
  adminController.changePassword.bind(adminController)
);
router.post(
  '/auth/logout',
  authenticate,
  adminController.logout.bind(adminController)
);

// User management routes (SUPER_ADMIN and STORE_OWNER only)
router.get(
  '/users',
  authenticate,
  requireStoreOwner,
  usersController.getAllUsers.bind(usersController)
);
router.get(
  '/users/:id',
  authenticate,
  requireStoreOwner,
  usersController.getUserById.bind(usersController)
);
router.get(
  '/users/role/:role',
  authenticate,
  requireSuperAdmin,
  usersController.getUsersByRole.bind(usersController)
);
router.put(
  '/users/:id',
  authenticate,
  requireStoreOwner,
  usersController.updateUser.bind(usersController)
);
router.post(
  '/users/:id/deactivate',
  authenticate,
  requireStoreOwner,
  usersController.deactivateUser.bind(usersController)
);
router.post(
  '/users/:id/activate',
  authenticate,
  requireStoreOwner,
  usersController.activateUser.bind(usersController)
);
router.post(
  '/users/:id/reset-password',
  authenticate,
  requireSuperAdmin,
  usersController.resetPassword.bind(usersController)
);
router.delete(
  '/users/:id',
  authenticate,
  requireStoreOwner,
  usersController.deleteUser.bind(usersController)
);

// Audit log routes (SUPER_ADMIN and STORE_OWNER only)
router.get(
  '/audit/logs',
  authenticate,
  requireStoreOwner,
  auditController.getLogs.bind(auditController)
);
router.get(
  '/audit/entity/:entity/:entityId',
  authenticate,
  requireStoreOwner,
  auditController.getLogsByEntity.bind(auditController)
);
router.get(
  '/audit/user/:userId',
  authenticate,
  requireStoreOwner,
  auditController.getLogsByUser.bind(auditController)
);
router.get(
  '/audit/recent',
  authenticate,
  requireOperator,
  auditController.getRecentLogs.bind(auditController)
);
router.get(
  '/audit/stats',
  authenticate,
  requireStoreOwner,
  auditController.getStats.bind(auditController)
);
router.post(
  '/audit/cleanup',
  authenticate,
  requireSuperAdmin,
  auditController.cleanupLogs.bind(auditController)
);

export { router as adminRoutes };
