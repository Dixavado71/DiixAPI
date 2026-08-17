import { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: Role;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...allowedRoles: Role[]) => ((req: AuthRequest, res: Response, next: NextFunction) => void);
export declare const requireSuperAdmin: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireStoreOwner: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireStoreManager: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const requireOperator: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map