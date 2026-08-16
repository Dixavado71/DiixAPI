"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const webhook_routes_1 = __importDefault(require("./webhook.routes"));
const order_routes_1 = require("./order.routes");
const promotion_routes_1 = require("./promotion.routes");
const cart_routes_1 = require("./cart.routes");
const router = (0, express_1.Router)();
router.use('/health', health_routes_1.default);
router.use('/webhooks', webhook_routes_1.default);
router.use('/orders', (0, order_routes_1.createOrderRoutes)());
router.use('/stores/:storeId/promotions', new promotion_routes_1.PromotionRoutes().getRouter());
router.use('/stores/:storeId/customers/:customerId/cart', new cart_routes_1.CartRoutes().getRouter());
exports.default = router;
//# sourceMappingURL=index.js.map