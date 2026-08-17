import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

const prisma = new PrismaClient();

// Lazy load config to avoid import issues in tests
let envConfig: { JWT_SECRET: string; JWT_EXPIRES_IN: string } | undefined;
const getConfig = () => {
  if (envConfig) return envConfig;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    envConfig = require('../config/index.js').env;
  } catch {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    envConfig = require('../config/env.js');
  }
  return envConfig;
};

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

export class AdminAuthService {
  async createUser(input: AdminUserCreateInput) {
    const { email, password, name, role = 'OPERATOR' } = input;

    const existingUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.active) {
      throw new Error('User account is inactive');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const config = getConfig();
    const JWT_SECRET = config?.JWT_SECRET || process.env.JWT_SECRET || 'default-secret';
    const JWT_EXPIRES_IN = config?.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.adminUser.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminUser.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(userId: string, input: AdminUserUpdateInput) {
    const { email, ...rest } = input;

    if (email) {
      const existingUser = await prisma.adminUser.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await prisma.adminUser.update({
      where: { id: userId },
      data: rest,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async resetPassword(adminId: string, targetUserId: string, newPassword: string) {
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin || !['SUPER_ADMIN', 'STORE_OWNER'].includes(admin.role)) {
      throw new Error('Insufficient permissions');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async deactivateUser(userId: string) {
    const user = await prisma.adminUser.update({
      where: { id: userId },
      data: { active: false },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
      },
    });

    return user;
  }

  async activateUser(userId: string) {
    const user = await prisma.adminUser.update({
      where: { id: userId },
      data: { active: true },
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
      },
    });

    return user;
  }

  async deleteUser(userId: string) {
    return this.deactivateUser(userId);
  }

  async verifyToken(token: string) {
    try {
      const config = getConfig();
      const JWT_SECRET = config?.JWT_SECRET || process.env.JWT_SECRET || 'default-secret';

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: Role;
      };

      const user = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
        select: { id: true, active: true, role: true },
      });

      if (!user || !user.active) {
        throw new Error('User not found or inactive');
      }

      return {
        valid: true,
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return {
        valid: false,
        error: 'Invalid or expired token',
      };
    }
  }

  async getUsersByRole(role: Role, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.adminUser.findMany({
        where: { role, active: true },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminUser.count({ where: { role, active: true } }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const adminAuthService = new AdminAuthService();
