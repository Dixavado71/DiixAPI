import { Router } from 'express';
import { BotEngineService } from '../services/bot/bot-engine.service';
import { PrismaClient } from '@prisma/client';
const router = Router();
// Factory para criar instância do BotEngineService
const createBotEngineService = () => {
    const prisma = new PrismaClient();
    return new BotEngineService(prisma);
};
// Helper para extrair string segura de params
const getStringParam = (param) => {
    if (Array.isArray(param)) {
        return param[0] ?? '';
    }
    return param ?? '';
};
/**
 * POST /bot/:customerId/:storeId/message
 * Envia uma mensagem para o bot e recebe a resposta
 */
router.post('/:customerId/:storeId/message', async (req, res) => {
    try {
        const customerId = getStringParam(req.params.customerId);
        const storeId = getStringParam(req.params.storeId);
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            res.status(400).json({
                error: 'Message is required and must be a string',
            });
            return;
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
    }
    catch (error) {
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
router.post('/:customerId/:storeId/reset', async (req, res) => {
    try {
        const customerId = getStringParam(req.params.customerId);
        const storeId = getStringParam(req.params.storeId);
        if (!customerId || !storeId) {
            res.status(400).json({
                error: 'customerId and storeId are required',
            });
            return;
        }
        const prisma = new PrismaClient();
        await prisma.conversationState.updateMany({
            where: {
                instance: 'whatsapp',
                phone: customerId,
            },
            data: {
                state: 'IDLE',
                context: {},
            },
        });
        res.json({
            success: true,
            data: {
                message: 'Conversation context reset successfully',
            },
        });
    }
    catch (error) {
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
router.post('/:customerId/:storeId/end', async (req, res) => {
    try {
        const customerId = getStringParam(req.params.customerId);
        const storeId = getStringParam(req.params.storeId);
        if (!customerId || !storeId) {
            res.status(400).json({
                error: 'customerId and storeId are required',
            });
            return;
        }
        const prisma = new PrismaClient();
        await prisma.conversationState.updateMany({
            where: {
                instance: 'whatsapp',
                phone: customerId,
            },
            data: {
                state: 'GOODBYE',
                lastActive: new Date(),
            },
        });
        res.json({
            success: true,
            data: {
                message: 'Conversation ended successfully',
            },
        });
    }
    catch (error) {
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
router.get('/:customerId/:storeId/context', async (req, res) => {
    try {
        const customerId = getStringParam(req.params.customerId);
        const storeId = getStringParam(req.params.storeId);
        if (!customerId || !storeId) {
            res.status(400).json({
                error: 'customerId and storeId are required',
            });
            return;
        }
        const prisma = new PrismaClient();
        const conversation = await prisma.conversationState.findFirst({
            where: {
                instance: 'whatsapp',
                phone: customerId,
            },
            orderBy: {
                lastActive: 'desc',
            },
        });
        if (!conversation) {
            res.json({
                success: true,
                data: {
                    hasActiveConversation: false,
                    context: null,
                },
            });
            return;
        }
        res.json({
            success: true,
            data: {
                hasActiveConversation: true,
                context: {
                    state: conversation.state,
                    metadata: conversation.context,
                    lastActive: conversation.lastActive,
                },
            },
        });
    }
    catch (error) {
        console.error('Error getting conversation context:', error);
        res.status(500).json({
            error: 'Failed to get conversation context',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
export default router;
//# sourceMappingURL=bot.routes.js.map