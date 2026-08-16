import { describe, it, expect, beforeEach } from 'vitest';
import { PromotionService } from '../src/services/promotion';
import { createPromotionSchema } from '../src/validators/promotion';

describe('PromotionService', () => {
  let promotionService: PromotionService;

  beforeEach(() => {
    promotionService = new PromotionService();
  });

  describe('validateDateRange', () => {
    it('should throw error when end date is before start date', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      expect(() => {
        (promotionService as any).validateDateRange(startDate, endDate);
      }).toThrow('END_DATE_MUST_BE_AFTER_START_DATE');
    });

    it('should not throw when dates are valid', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      expect(() => {
        (promotionService as any).validateDateRange(startDate, endDate);
      }).not.toThrow();
    });
  });

  describe('validateValue', () => {
    it('should throw error when percentage value is less than 0', () => {
      expect(() => {
        (promotionService as any).validateValue('PERCENTAGE', -10);
      }).toThrow('PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100');
    });

    it('should throw error when percentage value is greater than 100', () => {
      expect(() => {
        (promotionService as any).validateValue('PERCENTAGE', 150);
      }).toThrow('PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100');
    });

    it('should not throw when percentage value is between 0 and 100', () => {
      expect(() => {
        (promotionService as any).validateValue('PERCENTAGE', 50);
      }).not.toThrow();
    });

    it('should throw error when fixed value is negative', () => {
      expect(() => {
        (promotionService as any).validateValue('FIXED', -100);
      }).toThrow('FIXED_VALUE_MUST_BE_NON_NEGATIVE');
    });

    it('should not throw when fixed value is non-negative', () => {
      expect(() => {
        (promotionService as any).validateValue('FIXED', 100);
      }).not.toThrow();
    });
  });

  describe('calculateDiscount', () => {
    it('should return 0 discount when subtotal is below minAmount', () => {
      const promotion = {
        id: 'promo-1',
        storeId: 'store-1',
        name: 'Test Promotion',
        type: 'PERCENTAGE' as const,
        value: 10,
        minAmount: 100,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const discount = promotionService.calculateDiscount(promotion, 50, 1, 50);
      expect(discount).toBe(0);
    });

    it('should calculate percentage discount correctly', () => {
      const promotion = {
        id: 'promo-1',
        storeId: 'store-1',
        name: 'Test Promotion',
        type: 'PERCENTAGE' as const,
        value: 20,
        minAmount: null,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const discount = promotionService.calculateDiscount(promotion, 100, 2, 200);
      expect(discount).toBe(40); // 20% of 200
    });

    it('should calculate fixed discount correctly', () => {
      const promotion = {
        id: 'promo-1',
        storeId: 'store-1',
        name: 'Test Promotion',
        type: 'FIXED' as const,
        value: 15,
        minAmount: null,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const discount = promotionService.calculateDiscount(promotion, 100, 3, 300);
      expect(discount).toBe(45); // 15 * 3 items
    });

    it('should not exceed subtotal with discount', () => {
      const promotion = {
        id: 'promo-1',
        storeId: 'store-1',
        name: 'Test Promotion',
        type: 'FIXED' as const,
        value: 100,
        minAmount: null,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const discount = promotionService.calculateDiscount(promotion, 10, 5, 50);
      expect(discount).toBe(50); // Should cap at subtotal
    });
  });
});

describe('Promotion Validators', () => {
  it('should validate create promotion input correctly', () => {
    const validInput = {
      name: 'Summer Sale',
      type: 'PERCENTAGE' as const,
      value: 20,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      active: true,
    };

    const result = createPromotionSchema.parse(validInput);
    expect(result.name).toBe('Summer Sale');
    expect(result.type).toBe('PERCENTAGE');
    expect(result.value).toBe(20);
  });

  it('should reject invalid promotion type', () => {
    const invalidInput = {
      name: 'Invalid Promotion',
      type: 'INVALID_TYPE',
      value: 20,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
    };

    expect(() => createPromotionSchema.parse(invalidInput)).toThrow();
  });

  it('should reject negative promotion value', () => {
    const invalidInput = {
      name: 'Invalid Promotion',
      type: 'FIXED' as const,
      value: -100,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
    };

    expect(() => createPromotionSchema.parse(invalidInput)).toThrow();
  });
});
