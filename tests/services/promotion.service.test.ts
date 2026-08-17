import { describe, it, expect, vi } from 'vitest';
import { PromotionService } from '../../src/services/promotion';
import { PromotionRepository } from '../../src/repositories/promotion.repository';
import { ProductRepository } from '../../src/repositories/product.repository';
// import { prisma } from '../../src/config/database';

// Mock repositories
vi.mock('../../src/repositories/promotion.repository');
vi.mock('../../src/repositories/product.repository');
vi.mock('../../src/config/database');

describe('PromotionService', () => {
  let promotionService: PromotionService;
  let mockPromotionRepository: jest.Mocked<PromotionRepository>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    promotionService = new PromotionService();
    mockPromotionRepository = promotionService['promotionRepository'] as any;
    mockProductRepository = promotionService['productRepository'] as any;
  });

  describe('validateDateRange', () => {
    it('should throw error when end date is before start date', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      expect(() => (promotionService as any).validateDateRange(startDate, endDate)).toThrow(
        'END_DATE_MUST_BE_AFTER_START_DATE'
      );
    });

    it('should not throw when dates are valid', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      expect(() => (promotionService as any).validateDateRange(startDate, endDate)).not.toThrow();
    });
  });

  describe('validateValue', () => {
    it('should throw error for percentage value > 100', () => {
      expect(() => (promotionService as any).validateValue('PERCENTAGE', 150)).toThrow(
        'PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100'
      );
    });

    it('should throw error for percentage value < 0', () => {
      expect(() => (promotionService as any).validateValue('PERCENTAGE', -10)).toThrow(
        'PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100'
      );
    });

    it('should throw error for fixed value < 0', () => {
      expect(() => (promotionService as any).validateValue('FIXED', -50)).toThrow(
        'FIXED_VALUE_MUST_BE_NON_NEGATIVE'
      );
    });

    it('should not throw for valid percentage', () => {
      expect(() => (promotionService as any).validateValue('PERCENTAGE', 50)).not.toThrow();
    });

    it('should not throw for valid fixed value', () => {
      expect(() => (promotionService as any).validateValue('FIXED', 100)).not.toThrow();
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate percentage discount correctly', () => {
      const promotion = {
        id: 'promo-1',
        type: 'PERCENTAGE',
        value: 20,
        minAmount: null,
      } as any;

      const discount = promotionService.calculateDiscount(promotion, 100, 2, 200);
      expect(discount).toBe(40); // 20% of 200
    });

    it('should calculate fixed discount correctly', () => {
      const promotion = {
        id: 'promo-1',
        type: 'FIXED',
        value: 10,
        minAmount: null,
      } as any;

      const discount = promotionService.calculateDiscount(promotion, 100, 2, 200);
      expect(discount).toBe(20); // 10 * 2 items
    });

    it('should return 0 when subtotal is below minAmount', () => {
      const promotion = {
        id: 'promo-1',
        type: 'PERCENTAGE',
        value: 20,
        minAmount: 500,
      } as any;

      const discount = promotionService.calculateDiscount(promotion, 100, 2, 200);
      expect(discount).toBe(0);
    });

    it('should not exceed subtotal', () => {
      const promotion = {
        id: 'promo-1',
        type: 'FIXED',
        value: 100,
        minAmount: null,
      } as any;

      const discount = promotionService.calculateDiscount(promotion, 10, 5, 50);
      expect(discount).toBe(50); // capped at subtotal
    });
  });

  describe('createPromotion', () => {
    it('should create promotion successfully', async () => {
      const input = {
        storeId: 'store-1',
        name: 'Summer Sale',
        type: 'PERCENTAGE' as const,
        value: 20,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        active: true,
      };

      const mockPromotion = { id: 'promo-1', ...input };
      mockPromotionRepository.create.mockResolvedValue(mockPromotion as any);

      const result = await promotionService.createPromotion(input);

      expect(mockPromotionRepository.create).toHaveBeenCalledWith(
        input.storeId,
        expect.any(Object)
      );
      expect(result).toEqual(mockPromotion);
    });

    it('should validate products belong to store', async () => {
      const input = {
        storeId: 'store-1',
        name: 'Product Promo',
        type: 'FIXED' as const,
        value: 10,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
        productIds: ['product-1'],
      };

      mockProductRepository.findById.mockResolvedValue({
        id: 'product-1',
        storeId: 'store-2', // Different store
      } as any);

      await expect(promotionService.createPromotion(input)).rejects.toThrow(
        'PRODUCT_STORE_MISMATCH'
      );
    });
  });

  describe('getActivePromotions', () => {
    it('should return active promotions for store', async () => {
      const storeId = 'store-1';
      const mockPromotions = [
        { id: 'promo-1', name: 'Sale 1', active: true },
        { id: 'promo-2', name: 'Sale 2', active: true },
      ];

      mockPromotionRepository.findActivePromotions.mockResolvedValue(mockPromotions as any);

      const result = await promotionService.getActivePromotions(storeId);

      expect(mockPromotionRepository.findActivePromotions).toHaveBeenCalledWith(storeId);
      expect(result).toEqual(mockPromotions);
    });
  });

  describe('promotionAppliesToProduct', () => {
    it('should return false for inactive promotion', async () => {
      mockPromotionRepository.findById.mockResolvedValue({
        id: 'promo-1',
        active: false,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      } as any);

      const result = await promotionService.promotionAppliesToProduct('promo-1', 'product-1');
      expect(result).toBe(false);
    });

    it('should return false when outside date range', async () => {
      mockPromotionRepository.findById.mockResolvedValue({
        id: 'promo-1',
        active: true,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-08-31'),
      } as any);

      // Mock current date to be outside range
      const originalDate = Date;
      global.Date = class extends originalDate {
        constructor() {
          super();
          return new originalDate('2024-01-01');
        }
      } as any;

      const result = await promotionService.promotionAppliesToProduct('promo-1', 'product-1');

      global.Date = originalDate;
      expect(result).toBe(false);
    });

    it('should return true when promotion applies', async () => {
      const now = new Date();
      const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

      mockPromotionRepository.findById.mockResolvedValue({
        id: 'promo-1',
        active: true,
        startDate,
        endDate,
      } as any);
      mockPromotionRepository.getRules.mockResolvedValue([]);
      mockPromotionRepository.getProducts.mockResolvedValue([]);

      const result = await promotionService.promotionAppliesToProduct('promo-1', 'product-1');
      expect(result).toBe(true);
    });
  });
});
