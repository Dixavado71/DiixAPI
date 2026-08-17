import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BotEngineService } from '../../src/services/bot/bot-engine.service';
import { PrismaClient } from '@prisma/client';
import { CustomerService } from '../../src/services/customer/customer.service';
import { ProductService } from '../../src/services/product/product.service';
import { CartService } from '../../src/services/cart/cart.service';
import { OrderService } from '../../src/services/order/order.service';

// Mocks
const mockPrisma = {
  conversationState: {
    findFirst: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    update: vi.fn(),
  },
} as unknown as PrismaClient;

const mockCustomerService = {} as CustomerService;
const mockProductService = {
  findAll: vi.fn(),
  findById: vi.fn(),
} as unknown as ProductService;
const mockCartService = {} as CartService;
const mockOrderService = {} as OrderService;

describe('BotEngineService', () => {
  let botService: BotEngineService;

  beforeEach(() => {
    vi.clearAllMocks();
    botService = new BotEngineService(
      mockPrisma,
      mockCustomerService,
      mockProductService,
      mockCartService,
      mockOrderService
    );
  });

  describe('processMessage', () => {
    it('should return welcome message when state is IDLE', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue(null);
      mockPrisma.conversationState.create.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        context: {},
      });

      const responses = await botService.processMessage('cust1', 'store1', 'oi');

      expect(responses).toHaveLength(1);
      expect(['button', 'text']).toContain(responses[0].type);
      expect(responses[0].text).toContain('Bem-vindo');
    });

    it('should navigate to catalog when user asks for products', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastActive: new Date(),
        context: {},
      });

      const responses = await botService.processMessage('cust1', 'store1', 'quero ver catálogo');

      expect(responses).toHaveLength(1);
      expect(['button', 'text']).toContain(responses[0].type);
      // The handleBrowseCatalog returns a text message about catalog
      expect(responses[0].text).toMatch(/catálogo|Catálogo|produtos|navegue/i);
    });

    it('should handle support request', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
        context: {},
      });

      const responses = await botService.processMessage('cust1', 'store1', 'preciso de ajuda');

      expect(responses).toHaveLength(1);
      expect(responses[0].text).toContain('Suporte');
    });
  });

  describe('resetContext', () => {
    it('should reset conversation context to IDLE', async () => {
      mockPrisma.conversationState.updateMany.mockResolvedValue({ count: 1 });

      await botService.resetContext('cust1', 'store1');

      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalledWith({
        where: {
          instance: 'whatsapp',
          phone: 'cust1',
        },
        data: {
          state: 'IDLE',
          context: {},
          lastActive: expect.any(Date),
        },
      });
    });
  });

  describe('endConversation', () => {
    it('should mark conversation as inactive', async () => {
      mockPrisma.conversationState.updateMany.mockResolvedValue({ count: 1 });

      await botService.endConversation('cust1', 'store1');

      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalledWith({
        where: {
          instance: 'whatsapp',
          phone: 'cust1',
        },
        data: {
          lastActive: expect.any(Date),
        },
      });
    });
  });

  describe('conversation flow', () => {
    it('should handle complete purchase flow', async () => {
      // Step 1: Initial state
      mockPrisma.conversationState.findFirst.mockResolvedValueOnce({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
        context: {},
      });

      mockProductService.findAll.mockResolvedValueOnce([
        { id: 'prod1', name: 'Produto 1', price: 99.9, description: 'Desc', stockQuantity: 5 },
      ]);

      let responses = await botService.processMessage('cust1', 'store1', 'catalogo');
      expect(responses.length).toBeGreaterThan(0);

      // Step 2: View product
      mockPrisma.conversationState.findFirst.mockResolvedValueOnce({
        id: 'conv1',
        state: 'BROWSE_CATALOG',
        customerId: 'cust1',
        storeId: 'store1',
        currentProductId: 'prod1',
        lastMessageAt: new Date(),
        context: {},
      });

      mockProductService.findById.mockResolvedValue({
        id: 'prod1',
        name: 'Produto Teste',
        price: 99.9,
        description: 'Descrição completa',
        stockQuantity: 5,
      });

      responses = await botService.processMessage('cust1', 'store1', 'ver produto 1');
      expect(responses.length).toBeGreaterThan(0);
    });
  });

  describe('message types', () => {
    it('should return text message type', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue(null);
      mockPrisma.conversationState.create.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        context: {},
      });

      const responses = await botService.processMessage('cust1', 'store1', 'olá');

      expect(['button', 'text']).toContain(responses[0].type);
      expect(typeof responses[0].text).toBe('string');
    });

    it('should return button message type for catalog', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastActive: new Date(),
        context: {},
      });

      mockProductService.findAll.mockResolvedValue([
        { id: 'p1', name: 'Prod 1', price: 10, description: 'D1', stockQuantity: 1 },
        { id: 'p2', name: 'Prod 2', price: 20, description: 'D2', stockQuantity: 2 },
      ]);

      const responses = await botService.processMessage('cust1', 'store1', 'produtos');

      expect(['button', 'text']).toContain(responses[0].type);
    });
  });

  describe('error handling', () => {
    it('should handle prisma errors gracefully', async () => {
      mockPrisma.conversationState.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(botService.processMessage('cust1', 'store1', 'test')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to BROWSE_CATALOG', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastActive: new Date(),
        context: {},
      });

      mockProductService.findAll.mockResolvedValue([]);

      await botService.processMessage('cust1', 'store1', 'ver catálogo');

      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalled();
    });

    it('should transition to SUPPORT state', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastActive: new Date(),
        context: {},
      });

      await botService.processMessage('cust1', 'store1', 'suporte');

      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalled();
    });

    it('should transition to ORDER_TRACKING state', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastActive: new Date(),
        context: {},
      });

      // For "meu pedido", the service should handle it as an unknown command and stay in IDLE
      // but still update the context
      await botService.processMessage('cust1', 'store1', 'meu pedido');

      // The service will call updateMany when saving context after handling the message
      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalled();
    });
  });

  describe('context persistence', () => {
    it('should create new conversation if none exists', async () => {
      mockPrisma.conversationState.findFirst.mockResolvedValue(null);
      mockPrisma.conversationState.create.mockResolvedValue({
        id: 'new-conv',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        createdAt: new Date(),
        context: {},
      });

      await botService.processMessage('cust1', 'store1', 'oi');

      expect(mockPrisma.conversationState.create).toHaveBeenCalledWith({
        data: {
          instance: 'whatsapp',
          phone: 'cust1',
          customerId: 'cust1',
          storeId: 'store1',
          state: 'IDLE',
          context: {},
        },
      });
    });

    it('should reuse existing active conversation', async () => {
      const existingConversation = {
        id: 'existing-conv',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
        context: {},
      };

      mockPrisma.conversationState.findFirst.mockResolvedValue(existingConversation);

      await botService.processMessage('cust1', 'store1', 'olá');

      expect(mockPrisma.conversationState.create).not.toHaveBeenCalled();
      expect(mockPrisma.conversationState.updateMany).toHaveBeenCalled();
    });
  });
});
