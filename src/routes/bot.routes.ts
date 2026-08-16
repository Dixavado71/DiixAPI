import { Router, Request, Response } from 'express';
import { BotEngineService } from '../services/bot/bot-engine.service';
import { container } from '../config/container';
import { PrismaClient } from '@prisma/client';
import { CustomerService } from '../services/customer/customer.service';
import { ProductService } from '../services/product/product.service';
import { CartService } from '../services/cart/cart.service';
import { OrderService } from '../services/order/order.service';

const router = Router();

// Factory para criar instância do BotEngineService
const createBotEngineService = () => {
  const prisma = new PrismaClient();
  const customerService = new CustomerService(prisma);
  const productService = new ProductService(prisma);
  const cartService = new CartService(prisma);
  const orderService = new OrderService(prisma);
  
  return new BotEngineService(
    prisma,
    customerService,
    productService,
    cartService,
    orderService
  );
};

/**
 * POST /bot/:customerId/:storeId/message
 * Envia uma mensagem para o bot e recebe a resposta
 */
router.post('/:customerId/:storeId/message', async (req: Request, res: Response) => {
  try {
    const { customerId, storeId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
      });
    }

    const botService = createBotEngineService();
    const responses = await botService.processMessage(customerId, storeId, message);

    res.json({
      success: true,
      data: {
        customerId,
        storeId,
        message: message,
        responses,
      },
    });
  } catch (error) {
    console.error('Error processing bot message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /bot/:customerId/:storeId/reset
 * Reseta o contexto da conversação
 */
router.post('/:customerId/:storeId/reset', async (req: Request, res: Response) => {
  try {
    const { customerId, storeId } = req.params;

    const botService = createBotEngineService();
    await botService.resetContext(customerId, storeId);

    res.json({
      success: true,
      data: {
        message: 'Conversation context reset successfully',
      },
    });
  } catch (error) {
    console.error('Error resetting conversation context:', error);
    res.status(500).json({
      error: 'Failed to reset conversation context',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /bot/:customerId/:storeId/end
 * Finaliza a conversação
 */
router.post('/:customerId/:storeId/end', async (req: Request, res: Response) => {
  try {
    const { customerId, storeId } = req.params;

    const botService = createBotEngineService();
    await botService.endConversation(customerId, storeId);

    res.json({
      success: true,
      data: {
        message: 'Conversation ended successfully',
      },
    });
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({
      error: 'Failed to end conversation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /bot/:customerId/:storeId/context
 * Obtém o contexto atual da conversação
 */
router.get('/:customerId/:storeId/context', async (req: Request, res: Response) => {
  try {
    const { customerId, storeId } = req.params;
    const prisma = new PrismaClient();

    const conversation = await prisma.conversation.findFirst({
      where: {
        customerId,
        storeId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!conversation) {
      return res.json({
        success: true,
        data: {
          hasActiveConversation: false,
        },
      });
    }

    res.json({
      success: true,
      data: {
        hasActiveConversation: true,
        conversation: {
          id: conversation.id,
          state: conversation.state,
          currentProductId: conversation.currentProductId,
          currentCartId: conversation.currentCartId,
          currentOrderId: conversation.currentOrderId,
          lastMessageAt: conversation.lastMessageAt,
          metadata: conversation.metadata,
          createdAt: conversation.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Error getting conversation context:', error);
    res.status(500).json({
      error: 'Failed to get conversation context',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as botRoutes };
