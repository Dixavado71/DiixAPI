"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_js_1 = __importDefault(require("./health.routes.js"));
const webhook_routes_js_1 = __importDefault(require("./webhook.routes.js"));
const order_routes_js_1 = __importDefault(require("./order.routes.js"));
const router = (0, express_1.Router)();
router.use('/health', health_routes_js_1.default);
router.use('/webhooks', webhook_routes_js_1.default);
router.use('/orders', order_routes_js_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map