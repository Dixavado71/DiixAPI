"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const store_service_js_1 = require("../../services/store/store.service.js");
const store_validator_js_1 = require("../../validators/store.validator.js");
const logger_js_1 = require("../../utils/logger.js");
const logger = (0, logger_js_1.getLogger)().child({ module: 'store-controller' });
const storeService = new store_service_js_1.StoreService();
class StoreController {
    async findAll(_req, res, next) {
        try {
            const stores = await storeService.findAll();
            return res.json({
                success: true,
                data: stores,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const { id } = req.params;
            const store = await storeService.findById(id);
            if (!store) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            return res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const validatedData = store_validator_js_1.createStoreSchema.parse(req.body);
            const store = await storeService.create(validatedData);
            logger.info({ storeId: store.id }, 'Store created via API');
            return res.status(201).json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'STORE_ALREADY_EXISTS',
                        message: 'A store with this slug already exists',
                    },
                });
            }
            if (err.message === 'EVOLUTION_INSTANCE_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'EVOLUTION_INSTANCE_ALREADY_EXISTS',
                        message: 'A store with this Evolution instance already exists',
                    },
                });
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = store_validator_js_1.updateStoreSchema.parse(req.body);
            const store = await storeService.update(id, validatedData);
            logger.info({ storeId: id }, 'Store updated via API');
            return res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            if (err.message === 'STORE_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'STORE_ALREADY_EXISTS',
                        message: 'A store with this slug already exists',
                    },
                });
            }
            if (err.message === 'EVOLUTION_INSTANCE_ALREADY_EXISTS') {
                return res.status(409).json({
                    success: false,
                    error: {
                        code: 'EVOLUTION_INSTANCE_ALREADY_EXISTS',
                        message: 'A store with this Evolution instance already exists',
                    },
                });
            }
            next(error);
        }
    }
    async activate(req, res, next) {
        try {
            const { id } = req.params;
            const store = await storeService.activate(id);
            return res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            next(error);
        }
    }
    async deactivate(req, res, next) {
        try {
            const { id } = req.params;
            const store = await storeService.deactivate(id);
            return res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            next(error);
        }
    }
    async getSettings(req, res, next) {
        try {
            const { id } = req.params;
            const settings = await storeService.getSettings(id);
            return res.json({
                success: true,
                data: settings,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            next(error);
        }
    }
    async updateSettings(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = req.body;
            const settings = await storeService.updateSettings(id, validatedData);
            logger.info({ storeId: id }, 'Store settings updated via API');
            return res.json({
                success: true,
                data: settings,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
            }
            next(error);
        }
    }
}
exports.StoreController = StoreController;
exports.default = new StoreController();
//# sourceMappingURL=store.controller.js.map