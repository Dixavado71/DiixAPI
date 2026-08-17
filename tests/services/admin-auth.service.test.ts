import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma first
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

// Mock dependencies
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn((password: string) => Promise.resolve(`hashed_${password}`)),
    compare: vi.fn((password: string, hash: string) => {
      if (hash === 'hashed_correct_password') return Promise.resolve(true);
      if (password === 'correct_password' && hash.includes('hashed_')) return Promise.resolve(true);
      return Promise.resolve(false);
    }),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock_jwt_token'),
    verify: vi.fn((token: string) => {
      if (token === 'valid_token') {
        return { userId: 'user123', email: 'test@example.com', role: 'SUPER_ADMIN' };
      }
      throw new Error('Invalid token');
    }),
  },
}));

import { AdminAuthService } from '../../src/services/admin/admin-auth.service.js';

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AdminAuthService();
  });

  it('should register a new user', async () => {
    mockPrisma.adminUser.findFirst.mockResolvedValue(null);
    mockPrisma.adminUser.create.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: true,
    });

    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBe('mock_jwt_token');
  });

  it('should login with correct credentials', async () => {
    mockPrisma.adminUser.findFirst.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: true,
      passwordHash: 'hashed_correct_password',
    });

    const result = await service.login({
      email: 'test@example.com',
      password: 'correct_password',
    });

    expect(result.token).toBe('mock_jwt_token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should fail login with wrong password', async () => {
    mockPrisma.adminUser.findFirst.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: true,
      passwordHash: 'hashed_wrong_password',
    });

    await expect(
      service.login({ email: 'test@example.com', password: 'wrong_password' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should verify valid token', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: 'user123',
      active: true,
      role: 'SUPER_ADMIN',
    });

    const result = await service.verifyToken('valid_token');

    expect(result.userId).toBe('user123');
    expect(result.email).toBe('test@example.com');
  });

  it('should fail to verify invalid token', async () => {
    await expect(service.verifyToken('invalid_token')).rejects.toThrow();
  });

  it('should get user profile', async () => {
    mockPrisma.adminUser.findUnique.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: true,
    });

    const result = await service.getUserProfile('user123');

    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');
  });

  it('should update user profile', async () => {
    mockPrisma.adminUser.update.mockResolvedValue({
      id: 'user123',
      email: 'updated@example.com',
      name: 'Updated User',
      role: 'SUPER_ADMIN',
      active: true,
    });

    const result = await service.updateUser('user123', {
      email: 'updated@example.com',
      name: 'Updated User',
    });

    expect(result.email).toBe('updated@example.com');
  });

  it('should deactivate user', async () => {
    mockPrisma.adminUser.update.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: false,
    });

    const result = await service.deactivateUser('user123');

    expect(result.active).toBe(false);
  });

  it('should list all users', async () => {
    mockPrisma.adminUser.findMany.mockResolvedValue([
      { id: 'user1', email: 'user1@example.com', name: 'User 1', role: 'SUPER_ADMIN', active: true },
      { id: 'user2', email: 'user2@example.com', name: 'User 2', role: 'OPERATOR', active: true },
    ]);

    const result = await service.listUsers();

    expect(result).toHaveLength(2);
  });

  it('should get user statistics', async () => {
    mockPrisma.adminUser.count.mockResolvedValueOnce(10);
    mockPrisma.adminUser.count.mockResolvedValueOnce(8);

    const result = await service.getStats();

    expect(result.totalUsers).toBe(10);
    expect(result.activeUsers).toBe(8);
  });

  it('should delete user by deactivating', async () => {
    mockPrisma.adminUser.update.mockResolvedValue({
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'SUPER_ADMIN',
      active: false,
    });

    const result = await service.deleteUser('user123');

    expect(result.active).toBe(false);
  });
});
