import { Request, Response, NextFunction } from 'express';
import { StoreService } from '../../services/store/store.service';
import { createStoreSchema, updateStoreSchema } from '../../validators/store.validator';
import { getLogger } from '../../utils/logger';

const logger = getLogger().child({ module: 'store-controller' });
const storeService = new StoreService();

export class StoreController {
  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const stores = await storeService.findAll();
      return res.json({
        success: true,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createStoreSchema.parse(req.body);
      const store = await storeService.create(validatedData);

      logger.info({ storeId: store.id }, 'Store created via API');
      
      return res.status(201).json({
        success: true,
        data: store,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateStoreSchema.parse(req.body);
      const store = await storeService.update(id, validatedData);

      logger.info({ storeId: id }, 'Store updated via API');
      
      return res.json({
        success: true,
        data: store,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const store = await storeService.activate(id);

      return res.json({
        success: true,
        data: store,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const store = await storeService.deactivate(id);

      return res.json({
        success: true,
        data: store,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const settings = await storeService.getSettings(id);

      return res.json({
        success: true,
        data: settings,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = req.body;
      const settings = await storeService.updateSettings(id, validatedData);

      logger.info({ storeId: id }, 'Store settings updated via API');
      
      return res.json({
        success: true,
        data: settings,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
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

export default new StoreController();
