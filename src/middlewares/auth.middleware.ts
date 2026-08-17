import { Request, Response, NextFunction } from 'express';
import { adminAuthService } from '../services/admin/admin-auth.service.js';
import type { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Invalid token format',
      });
      return;
    }

    const result = await adminAuthService.verifyToken(token);

    if (!result.valid || !result.userId || !result.email || !result.role) {
      res.status(401).json({
        error: result.error || 'Invalid token',
      });
      return;
    }

    req.user = {
      userId: result.userId,
      email: result.email,
      role: result.role,
    };

    next();
  } catch {
    res.status(500).json({
      error: 'Internal server error during authentication',
    });
  }
};

export const authorize = (...allowedRoles: Role[]): ((req: AuthRequest, res: Response, next: NextFunction) => void) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
      return;
    }

    next();
  };
};

export const requireSuperAdmin = authorize('SUPER_ADMIN');

export const requireStoreOwner = authorize('STORE_OWNER', 'SUPER_ADMIN');

export const requireStoreManager = authorize('STORE_MANAGER', 'STORE_OWNER', 'SUPER_ADMIN');

export const requireOperator = authorize('OPERATOR', 'STORE_MANAGER', 'STORE_OWNER', 'SUPER_ADMIN');

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        const result = await adminAuthService.verifyToken(token);

        if (result.valid && result.userId && result.email && result.role) {
          req.user = {
            userId: result.userId,
            email: result.email,
            role: result.role,
          };
        }
      }
    }

    next();
  } catch {
    next();
  }
};
