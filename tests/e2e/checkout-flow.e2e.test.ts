import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

/**
 * Testes End-to-End para fluxo completo de checkout
 *
 * Este teste simula o fluxo completo de uma compra:
 * 1. Criação de loja
 * 2. Cadastro de cliente
 * 3. Adição de produtos
 * 4. Criação de carrinho
 * 5. Aplicação de promoção
 * 6. Checkout
 * 7. Verificação do pedido
 */
describe('E2E Tests - Checkout Flow', () => {
  let storeId: string;
  let customerId: string;
  let productId: string;
  let cartId: string;
  let orderId: string;
  let promotionId: string;

  const storeData = {
    name: 'E2E Test Store',
    slug: 'e2e-test-store',
    document: '99887766554433',
    email: 'e2e@store.com',
    phone: '+5511999888777',
    isActive: true,
  };

  const customerData = {
    name: 'E2E Test Customer',
    email: 'e2e@customer.com',
    phone: '+5511977665544',
    document: '12345678900',
  };

  const productData = {
    name: 'E2E Test Product',
    description: 'Product for E2E testing',
    price: 100.0,
    sku: 'E2E-PROD-001',
    stock: 50,
    isActive: true,
  };

  describe('Step 1: Create Store', () => {
    it('should create a new store', async () => {
      const response = await request(app).post('/api/v1/stores').send(storeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      storeId = response.body.id;
    });
  });

  describe('Step 2: Register Customer', () => {
    it('should register a new customer', async () => {
      const response = await request(app)
        .post(`/api/v1/stores/${storeId}/customers`)
        .send(customerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      customerId = response.body.id;
    });
  });

  describe('Step 3: Create Product', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post(`/api/v1/stores/${storeId}/products`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      productId = response.body.id;
      expect(response.body.price).toBe(productData.price);
    });
  });

  describe('Step 4: Create Cart and Add Items', () => {
    it('should create a cart and add product', async () => {
      // Create cart
      const cartResponse = await request(app)
        .post(`/api/v1/stores/${storeId}/carts`)
        .send({ customerId });

      expect(cartResponse.status).toBe(201);
      cartId = cartResponse.body.id;

      // Add item to cart
      const addItemResponse = await request(app)
        .post(`/api/v1/stores/${storeId}/carts/${cartId}/items`)
        .send({
          productId,
          quantity: 2,
        });

      expect(addItemResponse.status).toBe(200);
      expect(addItemResponse.body.items).toHaveLength(1);
      expect(addItemResponse.body.total).toBe(200); // 2 x R$100
    });
  });

  describe('Step 5: Create and Apply Promotion', () => {
    it('should create a percentage promotion', async () => {
      const promotionData = {
        name: 'E2E Test Promotion',
        description: '10% off for E2E test',
        type: 'PERCENTAGE',
        value: 10,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        minPurchaseAmount: 50,
      };

      const response = await request(app)
        .post(`/api/v1/stores/${storeId}/promotions`)
        .send(promotionData);

      expect(response.status).toBe(201);
      promotionId = response.body.id;
    });

    it('should apply promotion to cart', async () => {
      const response = await request(app)
        .post(`/api/v1/stores/${storeId}/carts/${cartId}/apply-promotion`)
        .send({ promotionId });

      expect(response.status).toBe(200);
      expect(response.body.discount).toBeGreaterThan(0);
    });
  });

  describe('Step 6: Checkout', () => {
    it('should complete checkout successfully', async () => {
      const checkoutData = {
        cartId,
        paymentMethod: 'PIX',
        shippingAddress: {
          street: 'Rua Teste',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234567',
          country: 'BR',
        },
      };

      const response = await request(app)
        .post(`/api/v1/stores/${storeId}/orders/checkout`)
        .send(checkoutData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      orderId = response.body.id;
      expect(response.body.status).toBe('PENDING_PAYMENT');
    });
  });

  describe('Step 7: Verify Order', () => {
    it('should retrieve created order with all details', async () => {
      const response = await request(app).get(`/api/v1/stores/${storeId}/orders/${orderId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.items).toBeDefined();
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('should have order in correct status', async () => {
      const response = await request(app).get(`/api/v1/stores/${storeId}/orders/${orderId}`);

      expect(response.body.status).toBe('PENDING_PAYMENT');
    });
  });

  describe('Step 8: Update Order Status', () => {
    it('should transition order to PAYMENT_CONFIRMED', async () => {
      const response = await request(app)
        .patch(`/api/v1/stores/${storeId}/orders/${orderId}/status`)
        .send({ status: 'PAYMENT_CONFIRMED' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PAYMENT_CONFIRMED');
    });

    it('should transition order to PREPARING', async () => {
      const response = await request(app)
        .patch(`/api/v1/stores/${storeId}/orders/${orderId}/status`)
        .send({ status: 'PREPARING' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PREPARING');
    });

    it('should transition order to READY', async () => {
      const response = await request(app)
        .patch(`/api/v1/stores/${storeId}/orders/${orderId}/status`)
        .send({ status: 'READY' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('READY');
    });
  });
});
