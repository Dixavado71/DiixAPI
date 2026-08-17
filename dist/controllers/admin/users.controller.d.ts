import { Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
export declare class UsersController {
    /**
     * Get all users with pagination
     * GET /admin/users
     */
    getAllUsers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user by ID
     * GET /admin/users/:id
     */
    getUserById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get users by role
     * GET /admin/users/role/:role
     */
    getUsersByRole(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update user
     * PUT /admin/users/:id
     */
    updateUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Deactivate user
     * POST /admin/users/:id/deactivate
     */
    deactivateUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Activate user
     * POST /admin/users/:id/activate
     */
    activateUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Reset user password (admin only)
     * POST /admin/users/:id/reset-password
     */
    resetPassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete user (soft delete)
     * DELETE /admin/users/:id
     */
    deleteUser(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const usersController: UsersController;
//# sourceMappingURL=users.controller.d.ts.map