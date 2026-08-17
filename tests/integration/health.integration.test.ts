import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('Integration Tests - Health Endpoints', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status with all services', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('ok');
    });

    it('should include database status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('database');
    });

    it('should include redis status', async () => {
      const response = await request(app).get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body.services).toHaveProperty('redis');
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return ready status when all services are up', async () => {
      const response = await request(app).get('/api/v1/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ready');
    });
  });

  describe('GET /api/v1/health/live', () => {
    it('should return live status', async () => {
      const response = await request(app).get('/api/v1/health/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('alive');
    });
  });
});
