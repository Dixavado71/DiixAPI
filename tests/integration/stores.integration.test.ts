import { describe, expect, it } from 'vitest';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

// Mock de dados para testes de integração de stores
describe('Integration Tests - Stores API', () => {
  let createdStoreId: string;

  describe('POST /api/v1/stores', () => {
    it('should create a new store successfully', async () => {
      const storeData = {
        name: 'Test Store Integration',
        slug: 'test-store-integration',
        document: '12345678901234',
        email: 'test@store.com',
        phone: '+5511999999999',
        isActive: true,
      };

      const response = await request(app).post('/api/v1/stores').send(storeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(storeData.name);
      expect(response.body.slug).toBe(storeData.slug);

      createdStoreId = response.body.id;
    });

    it('should fail to create store with duplicate slug', async () => {
      const storeData = {
        name: 'Duplicate Store',
        slug: 'test-store-integration',
        document: '98765432109876',
        email: 'duplicate@store.com',
        phone: '+5511999999998',
        isActive: true,
      };

      const response = await request(app).post('/api/v1/stores').send(storeData);

      expect(response.status).toBe(409);
    });
  });

  describe('GET /api/v1/stores', () => {
    it('should return list of stores', async () => {
      const response = await request(app).get('/api/v1/stores');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/stores/:id', () => {
    it('should return store by id', async () => {
      if (!createdStoreId) {
        // Create store first if not exists
        const storeData = {
          name: 'Test Store Get',
          slug: 'test-store-get',
          document: '11122233344455',
          email: 'get@store.com',
          phone: '+5511999999997',
          isActive: true,
        };

        const createResponse = await request(app).post('/api/v1/stores').send(storeData);

        createdStoreId = createResponse.body.id;
      }

      const response = await request(app).get(`/api/v1/stores/${createdStoreId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdStoreId);
    });

    it('should return 404 for non-existent store', async () => {
      const response = await request(app).get('/api/v1/stores/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/stores/:id', () => {
    it('should update store successfully', async () => {
      const updateData = {
        name: 'Updated Test Store',
        phone: '+5511988888888',
      };

      const response = await request(app).put(`/api/v1/stores/${createdStoreId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /api/v1/stores/:id', () => {
    it('should deactivate store (soft delete)', async () => {
      const response = await request(app).delete(`/api/v1/stores/${createdStoreId}`);

      expect(response.status).toBe(200);
    });
  });
});
