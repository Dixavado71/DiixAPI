import { StoreService } from '../services/store/store.service';
import { createStoreSchema, updateStoreSchema } from '../validators/store.validator';
import { logger as baseLogger } from '../utils/logger';
const logger = baseLogger.child({ module: 'store-controller' });
const storeService = new StoreService();
export class StoreController {
    async findAll(_req, res, next) {
        try {
            const stores = await storeService.findAll();
            res.json({
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
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const store = await storeService.findById(id);
            if (!store) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            res.json({
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
            const validatedData = createStoreSchema.parse(req.body);
            const store = await storeService.create(validatedData);
            logger.info({ storeId: store.id }, 'Store created via API');
            res.status(201).json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_ALREADY_EXISTS') {
                res.status(409).json({
                    success: false,
                    error: {
                        code: 'STORE_ALREADY_EXISTS',
                        message: 'A store with this slug already exists',
                    },
                });
                return;
            }
            if (err.message === 'EVOLUTION_INSTANCE_ALREADY_EXISTS') {
                res.status(409).json({
                    success: false,
                    error: {
                        code: 'EVOLUTION_INSTANCE_ALREADY_EXISTS',
                        message: 'A store with this Evolution instance already exists',
                    },
                });
                return;
            }
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const validatedData = updateStoreSchema.parse(req.body);
            const store = await storeService.update(id, validatedData);
            logger.info({ storeId: id }, 'Store updated via API');
            res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            if (err.message === 'STORE_ALREADY_EXISTS') {
                res.status(409).json({
                    success: false,
                    error: {
                        code: 'STORE_ALREADY_EXISTS',
                        message: 'A store with this slug already exists',
                    },
                });
                return;
            }
            if (err.message === 'EVOLUTION_INSTANCE_ALREADY_EXISTS') {
                res.status(409).json({
                    success: false,
                    error: {
                        code: 'EVOLUTION_INSTANCE_ALREADY_EXISTS',
                        message: 'A store with this Evolution instance already exists',
                    },
                });
                return;
            }
            next(error);
        }
    }
    async activate(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const store = await storeService.activate(id);
            res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            next(error);
        }
    }
    async deactivate(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const store = await storeService.deactivate(id);
            res.json({
                success: true,
                data: store,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            next(error);
        }
    }
    async getSettings(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const settings = await storeService.getSettings(id);
            res.json({
                success: true,
                data: settings,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            next(error);
        }
    }
    async updateSettings(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_ID',
                        message: 'Invalid store ID',
                    },
                });
                return;
            }
            const validatedData = req.body;
            const settings = await storeService.updateSettings(id, validatedData);
            logger.info({ storeId: id }, 'Store settings updated via API');
            res.json({
                success: true,
                data: settings,
            });
        }
        catch (error) {
            const err = error;
            if (err.message === 'STORE_NOT_FOUND') {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'STORE_NOT_FOUND',
                        message: 'Store not found',
                    },
                });
                return;
            }
            next(error);
        }
    }
}
export default new StoreController();
//# sourceMappingURL=store.controller.js.map