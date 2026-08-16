import { BotEngineService } from '../../src/services/bot/bot-engine.service';
import { PrismaClient } from '@prisma/client';
import { CustomerService } from '../../src/services/customer/customer.service';
import { ProductService } from '../../src/services/product/product.service';
import { CartService } from '../../src/services/cart/cart.service';
import { OrderService } from '../../src/services/order/order.service';

// Mocks
const mockPrisma = {
  conversation: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
} as unknown as PrismaClient;

const mockCustomerService = {} as CustomerService;
const mockProductService = {
  findAll: jest.fn(),
  findById: jest.fn(),
} as unknown as ProductService;
const mockCartService = {} as CartService;
const mockOrderService = {} as OrderService;

describe('BotEngineService', () => {
  let botService: BotEngineService;

  beforeEach(() => {
    jest.clearAllMocks();
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
      mockPrisma.conversation.findFirst.mockResolvedValue(null);
      mockPrisma.conversation.create.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
      });

      const responses = await botService.processMessage('cust1', 'store1', 'oi');

      expect(responses).toHaveLength(1);
      expect(responses[0].type).toBe('text');
      expect(responses[0].text).toContain('Bem-vindo');
    });

    it('should navigate to catalog when user asks for products', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      mockProductService.findAll.mockResolvedValue([
        {
          id: 'prod1',
          name: 'Produto Teste',
          price: 99.90,
          description: 'Descrição do produto',
          stockQuantity: 10,
        },
      ]);

      const responses = await botService.processMessage('cust1', 'store1', 'quero ver catálogo');

      expect(responses).toHaveLength(1);
      expect(responses[0].type).toBe('button');
      expect(responses[0].buttons).toHaveLength(1);
    });

    it('should handle support request', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      const responses = await botService.processMessage('cust1', 'store1', 'preciso de ajuda');

      expect(responses).toHaveLength(1);
      expect(responses[0].text).toContain('Suporte');
    });
  });

  describe('resetContext', () => {
    it('should reset conversation context to IDLE', async () => {
      mockPrisma.conversation.updateMany.mockResolvedValue({ count: 1 });

      await botService.resetContext('cust1', 'store1');

      expect(mockPrisma.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          customerId: 'cust1',
          storeId: 'store1',
          isActive: true,
        },
        data: {
          state: 'IDLE',
          currentProductId: null,
          currentCartId: null,
          currentOrderId: null,
          metadata: null,
        },
      });
    });
  });

  describe('endConversation', () => {
    it('should mark conversation as inactive', async () => {
      mockPrisma.conversation.updateMany.mockResolvedValue({ count: 1 });

      await botService.endConversation('cust1', 'store1');

      expect(mockPrisma.conversation.updateMany).toHaveBeenCalledWith({
        where: {
          customerId: 'cust1',
          storeId: 'store1',
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    });
  });

  describe('conversation flow', () => {
    it('should handle complete purchase flow', async () => {
      // Step 1: Initial state
      mockPrisma.conversation.findFirst.mockResolvedValueOnce({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      let responses = await botService.processMessage('cust1', 'store1', 'catalogo');
      expect(responses[0].text).toContain('Catálogo');

      // Step 2: View product
      mockPrisma.conversation.findFirst.mockResolvedValueOnce({
        id: 'conv1',
        state: 'BROWSE_CATALOG',
        customerId: 'cust1',
        storeId: 'store1',
        currentProductId: 'prod1',
        lastMessageAt: new Date(),
      });

      mockProductService.findById.mockResolvedValue({
        id: 'prod1',
        name: 'Produto Teste',
        price: 99.90,
        description: 'Descrição completa',
        stockQuantity: 5,
      });

      responses = await botService.processMessage('cust1', 'store1', 'ver produto 1');
      expect(responses[0].text).toContain('Produto Teste');
      expect(responses[0].buttons).toBeDefined();
    });
  });

  describe('message types', () => {
    it('should return text message type', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue(null);
      mockPrisma.conversation.create.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
      });

      const responses = await botService.processMessage('cust1', 'store1', 'olá');

      expect(responses[0].type).toBe('text');
      expect(typeof responses[0].text).toBe('string');
    });

    it('should return button message type for catalog', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      mockProductService.findAll.mockResolvedValue([
        { id: 'p1', name: 'Prod 1', price: 10, description: 'D1', stockQuantity: 1 },
        { id: 'p2', name: 'Prod 2', price: 20, description: 'D2', stockQuantity: 2 },
      ]);

      const responses = await botService.processMessage('cust1', 'store1', 'produtos');

      expect(responses[0].type).toBe('button');
      expect(responses[0].buttons).toHaveLength(2);
    });
  });

  describe('error handling', () => {
    it('should handle prisma errors gracefully', async () => {
      mockPrisma.conversation.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(botService.processMessage('cust1', 'store1', 'test'))
        .rejects.toThrow('Database error');
    });
  });

  describe('state transitions', () => {
    it('should transition from IDLE to BROWSE_CATALOG', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      mockProductService.findAll.mockResolvedValue([]);

      await botService.processMessage('cust1', 'store1', 'ver catálogo');

      expect(mockPrisma.conversation.updateMany).toHaveBeenCalled();
      const updateCall = (mockPrisma.conversation.updateMany as jest.Mock).mock.calls[0][0];
      expect(updateCall.data.state).toBe('BROWSE_CATALOG');
    });

    it('should transition to SUPPORT state', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      await botService.processMessage('cust1', 'store1', 'suporte');

      const updateCall = (mockPrisma.conversation.updateMany as jest.Mock).mock.calls[0][0];
      expect(updateCall.data.state).toBe('SUPPORT');
    });

    it('should transition to ORDER_TRACKING state', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue({
        id: 'conv1',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        lastMessageAt: new Date(),
      });

      await botService.processMessage('cust1', 'store1', 'meu pedido');

      const updateCall = (mockPrisma.conversation.updateMany as jest.Mock).mock.calls[0][0];
      expect(updateCall.data.state).toBe('ORDER_TRACKING');
    });
  });

  describe('context persistence', () => {
    it('should create new conversation if none exists', async () => {
      mockPrisma.conversation.findFirst.mockResolvedValue(null);
      mockPrisma.conversation.create.mockResolvedValue({
        id: 'new-conv',
        state: 'IDLE',
        customerId: 'cust1',
        storeId: 'store1',
        createdAt: new Date(),
      });

      await botService.processMessage('cust1', 'store1', 'oi');

      expect(mockPrisma.conversation.create).toHaveBeenCalledWith({
        data: {
          customerId: 'cust1',
          storeId: 'store1',
          state: 'IDLE',
          isActive: true,
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
      };

      mockPrisma.conversation.findFirst.mockResolvedValue(existingConversation);

      await botService.processMessage('cust1', 'store1', 'olá');

      expect(mockPrisma.conversation.create).not.toHaveBeenCalled();
      expect(mockPrisma.conversation.updateMany).toHaveBeenCalled();
    });
  });
});
