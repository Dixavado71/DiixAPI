"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoutes = void 0;
const express_1 = require("express");
const cart_1 = require("../controllers/cart");
class CartRoutes {
    router;
    controller;
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new cart_1.CartController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get or create cart
        this.router.get('/', (req, res, next) => this.controller.getCart(req, res, next));
        // Add item to cart
        this.router.post('/items', (req, res, next) => this.controller.addItem(req, res, next));
        // Update cart item
        this.router.put('/items/:itemId', (req, res, next) => this.controller.updateItem(req, res, next));
        // Remove item from cart
        this.router.delete('/items/:itemId', (req, res, next) => this.controller.removeItem(req, res, next));
        // Clear cart
        this.router.delete('/', (req, res, next) => this.controller.clearCart(req, res, next));
        // Checkout cart
        this.router.post('/checkout', (req, res, next) => this.controller.checkout(req, res, next));
    }
    getRouter() {
        return this.router;
    }
}
exports.CartRoutes = CartRoutes;
//# sourceMappingURL=cart.routes.js.map