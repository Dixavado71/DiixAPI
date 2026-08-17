"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bot_engine_service_1 = require("../services/bot/bot-engine.service");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// Factory para criar instância do BotEngineService
const createBotEngineService = () => {
    const prisma = new client_1.PrismaClient();
    return new bot_engine_service_1.BotEngineService(prisma);
};
/**
 * POST /bot/:customerId/:storeId/message
 * Envia uma mensagem para o bot e recebe a resposta
 */
router.post('/:customerId/:storeId/message', async (req, res) => {
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
        const { customerId, storeId } = req.params;
        if (!customerId || !storeId) {
            return res.status(400).json({
                error: 'customerId and storeId are required',
            });
        }
        const prisma = new client_1.PrismaClient();
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
        const { customerId, storeId } = req.params;
        if (!customerId || !storeId) {
            return res.status(400).json({
                error: 'customerId and storeId are required',
            });
        }
        const prisma = new client_1.PrismaClient();
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
        const { customerId, storeId } = req.params;
        if (!customerId || !storeId) {
            return res.status(400).json({
                error: 'customerId and storeId are required',
            });
        }
        const prisma = new client_1.PrismaClient();
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
            return res.json({
                success: true,
                data: {
                    hasActiveConversation: false,
                    context: null,
                },
            });
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
//# sourceMappingURL=bot.routes.js.map