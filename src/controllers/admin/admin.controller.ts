import { Request, Response } from 'express';
import { adminAuthService } from '../../services/admin/admin-auth.service.js';
import { auditService } from '../../services/audit/audit.service.js';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import type { Role } from '@prisma/client';

export class AdminController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Email, password and name are required',
        });
      }

      const user = await adminAuthService.createUser({
        email,
        password,
        name,
        role: role as Role,
      });

      await auditService.logUserCreation('system', user.id, req.ip || undefined);

      return res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || 'Failed to create user',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        });
      }

      const result = await adminAuthService.login({ email, password });

      await auditService.logLogin(result.user.id, req.ip || undefined, true);

      return res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      return res.status(401).json({
        error: error.message || 'Login failed',
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const user = await adminAuthService.getUserById(req.user.userId);

      return res.json({
        user,
      });
    } catch (error: any) {
      return res.status(404).json({
        error: error.message || 'User not found',
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      const { name, email } = req.body;

      const user = await adminAuthService.updateUser(req.user.userId, {
        name,
        email,
      });

      await auditService.logUserUpdate(
        req.user.userId,
        req.user.userId,
        { name, email },
        req.ip || undefined
      );

      return res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || 'Failed to update profile',
      });
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
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

      await adminAuthService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      await auditService.logPasswordChange(req.user.userId, req.ip || undefined);

      return res.json({
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || 'Failed to change password',
      });
    }
  }

  async logout(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
        });
      }

      await auditService.logLogout(req.user.userId, req.ip || undefined);

      return res.json({
        message: 'Logout successful',
      });
    } catch (error: any) {
      return res.status(500).json({
        error: error.message || 'Failed to logout',
      });
    }
  }
}

export const adminController = new AdminController();
