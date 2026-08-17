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

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    const result = await adminAuthService.verifyToken(token);

    if (!result.valid) {
      return res.status(401).json({
        error: result.error || 'Invalid token',
      });
    }

    req.user = {
      userId: result.userId,
      email: result.email,
      role: result.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error during authentication',
    });
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        yourRole: req.user.role,
      });
    }

    next();
  };
};

export const requireSuperAdmin = authorize('SUPER_ADMIN');

export const requireStoreOwner = authorize('STORE_OWNER', 'SUPER_ADMIN');

export const requireStoreManager = authorize(
  'STORE_MANAGER',
  'STORE_OWNER',
  'SUPER_ADMIN'
);

export const requireOperator = authorize(
  'OPERATOR',
  'STORE_MANAGER',
  'STORE_OWNER',
  'SUPER_ADMIN'
);

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const result = await adminAuthService.verifyToken(token);

      if (result.valid) {
        req.user = {
          userId: result.userId,
          email: result.email,
          role: result.role,
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
};
