import { Request, Response, NextFunction } from 'express';
export declare class CartController {
    private cartService;
    constructor();
    /**
     * Get or create cart for customer
     * GET /api/v1/stores/:storeId/customers/:customerId/cart
     */
    getCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add item to cart
     * POST /api/v1/stores/:storeId/customers/:customerId/cart/items
     */
    addItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update cart item quantity
     * PUT /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
     */
    updateItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove item from cart
     * DELETE /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
     */
    removeItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Clear cart
     * DELETE /api/v1/stores/:storeId/customers/:customerId/cart
     */
    clearCart(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Checkout cart
     * POST /api/v1/stores/:storeId/customers/:customerId/cart/checkout
     */
    checkout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map