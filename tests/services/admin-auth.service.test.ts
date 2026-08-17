import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAuthService } from '../../src/services/admin/admin-auth.service.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn((password: string, _rounds: number) => Promise.resolve(`hashed_${password}`)),
    compare: vi.fn((password: string, hash: string) => {
      if (hash === 'hashed_correct_password') {
        return Promise.resolve(true);
      }
      if (password === 'correct_password' && hash.includes('hashed_')) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn((_payload: any, _secret: string, _options?: any) => 'mock_jwt_token'),
    verify: vi.fn((token: string, _secret: string) => {
      if (token === 'valid_token') {
        return { userId: 'user123', email: 'test@example.com', role: 'SUPER_ADMIN' };
      }
      throw new Error('Invalid token');
    }),
  },
}));

// Mock Prisma
const mockPrisma = {
  adminUser: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrisma),
}));

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AdminAuthService();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue(null);
      mockPrisma.adminUser.create.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'OPERATOR',
        active: true,
        createdAt: new Date(),
      });

      const result = await service.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockPrisma.adminUser.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'existing',
        email: 'test@example.com',
      });

      await expect(
        service.createUser({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        password: 'hashed_correct_password',
        name: 'Test User',
        role: 'SUPER_ADMIN',
        active: true,
      });

      mockPrisma.adminUser.update.mockResolvedValue({});

      const result = await service.login({
        email: 'test@example.com',
        password: 'correct_password',
      });

      expect(result.token).toBe('mock_jwt_token');
      expect(result.user.id).toBe('user123');
      expect(bcrypt.compare).toHaveBeenCalledWith('correct_password', 'hashed_correct_password');
    });

    it('should throw error for invalid credentials', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        password: 'hashed_wrong_password',
        active: true,
      });

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong_password',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for inactive user', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        password: 'hashed_password',
        active: false,
      });

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password',
        })
      ).rejects.toThrow('User account is inactive');
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'SUPER_ADMIN',
        active: true,
      });

      const result = await service.getUserById('user123');

      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error if user not found', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      mockPrisma.adminUser.findMany.mockResolvedValue([
        { id: 'user1', email: 'user1@example.com', name: 'User 1' },
        { id: 'user2', email: 'user2@example.com', name: 'User 2' },
      ]);
      mockPrisma.adminUser.count.mockResolvedValue(50);

      const result = await service.getAllUsers(1, 20);

      expect(result.users).toHaveLength(2);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });
  });

  describe('verifyToken', () => {
    it('should return valid token info', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        active: true,
        role: 'SUPER_ADMIN',
      });

      const result = await service.verifyToken('valid_token');

      expect(result.valid).toBe(true);
      expect(result.userId).toBe('user123');
      expect(result.role).toBe('SUPER_ADMIN');
    });

    it('should return invalid for expired token', async () => {
      const jwtVerify = jwt.verify as any;
      jwtVerify.mockImplementationOnce(() => {
        throw new Error('Token expired');
      });

      const result = await service.verifyToken('expired_token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    });

    it('should return invalid for inactive user', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        active: false,
        role: 'SUPER_ADMIN',
      });

      const result = await service.verifyToken('valid_token');

      expect(result.valid).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        password: 'hashed_current_password',
      });
      mockPrisma.adminUser.update.mockResolvedValue({});

      const result = await service.changePassword('user123', 'current_password', 'new_password');

      expect(result.success).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('current_password', 'hashed_current_password');
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 12);
    });

    it('should throw error for incorrect current password', async () => {
      mockPrisma.adminUser.findUnique.mockResolvedValue({
        id: 'user123',
        password: 'hashed_different_password',
      });

      await expect(
        service.changePassword('user123', 'wrong_password', 'new_password')
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      mockPrisma.adminUser.update.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        active: false,
      });

      const result = await service.deactivateUser('user123');

      expect(result.active).toBe(false);
      expect(mockPrisma.adminUser.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { active: false },
        select: expect.any(Object),
      });
    });
  });

  describe('getUsersByRole', () => {
    it('should return users filtered by role', async () => {
      mockPrisma.adminUser.findMany.mockResolvedValue([
        { id: 'admin1', email: 'admin1@example.com', role: 'SUPER_ADMIN' },
      ]);
      mockPrisma.adminUser.count.mockResolvedValue(1);

      const result = await service.getUsersByRole('SUPER_ADMIN', 1, 20);

      expect(result.users).toHaveLength(1);
      expect(result.users[0].role).toBe('SUPER_ADMIN');
    });
  });
});
