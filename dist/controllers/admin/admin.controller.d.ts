import { Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
export declare class AdminController {
    register(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const adminController: AdminController;
//# sourceMappingURL=admin.controller.d.ts.map