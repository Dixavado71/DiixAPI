import { describe, it, expect } from 'vitest';
import { checkDatabaseHealth } from '../src/config/database';
import { checkRedisHealth } from '../src/config/redis';

describe('Health Checks', () => {
  describe('Database', () => {
    it('should have database health check function', () => {
      expect(typeof checkDatabaseHealth).toBe('function');
    });
  });

  describe('Redis', () => {
    it('should have redis health check function', () => {
      expect(typeof checkRedisHealth).toBe('function');
    });
  });
});

describe('Environment Validation', () => {
  it('should have required environment variables structure', () => {
    // Basic validation that env vars are loaded
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
