import type { Role } from '@prisma/client';
export interface AdminUserCreateInput {
    email: string;
    password: string;
    name: string;
    role?: Role;
}
export interface AdminUserUpdateInput {
    name?: string;
    email?: string;
    role?: Role;
    active?: boolean;
    lastLogin?: Date;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: Role;
    };
}
export declare class AdminAuthService {
    createUser(input: AdminUserCreateInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        active: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
    login(input: LoginInput): Promise<AuthResponse>;
    getUserById(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        email: string;
        updatedAt: Date;
        active: boolean;
        role: import(".prisma/client").$Enums.Role;
        lastLogin: Date | null;
    }>;
    getAllUsers(page?: number, limit?: number): Promise<{
        users: {
            name: string;
            id: string;
            createdAt: Date;
            email: string;
            active: boolean;
            role: import(".prisma/client").$Enums.Role;
            lastLogin: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(userId: string, input: AdminUserUpdateInput): Promise<{
        name: string;
        id: string;
        email: string;
        updatedAt: Date;
        active: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    resetPassword(adminId: string, targetUserId: string, newPassword: string): Promise<{
        success: boolean;
    }>;
    deactivateUser(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        active: boolean;
    }>;
    activateUser(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        active: boolean;
    }>;
    deleteUser(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        active: boolean;
    }>;
    verifyToken(token: string): Promise<{
        valid: boolean;
        userId: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        error?: undefined;
    } | {
        valid: boolean;
        error: string;
        userId?: undefined;
        email?: undefined;
        role?: undefined;
    }>;
    getUsersByRole(role: Role, page?: number, limit?: number): Promise<{
        users: {
            name: string;
            id: string;
            createdAt: Date;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            lastLogin: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
export declare const adminAuthService: AdminAuthService;
//# sourceMappingURL=admin-auth.service.d.ts.map