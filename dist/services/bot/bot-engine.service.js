"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotEngineService = void 0;
class BotEngineService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Processa uma mensagem recebida e retorna as respostas do bot
     */
    async processMessage(customerId, storeId, message) {
        const context = await this.getOrCreateContext(customerId, storeId);
        const currentState = context.state;
        let responses = [];
        switch (currentState) {
            case 'IDLE':
                responses = await this.handleIdle(context, message);
                break;
            case 'BROWSE_CATALOG':
                responses = await this.handleBrowseCatalog(context, message);
                break;
            case 'VIEW_PRODUCT':
                responses = await this.handleViewProduct(context, message);
                break;
            case 'ADD_TO_CART':
                responses = await this.handleAddToCart(context, message);
                break;
            case 'VIEW_CART':
                responses = await this.handleViewCart(context, message);
                break;
            case 'CHECKOUT':
                responses = await this.handleCheckout(context, message);
                break;
            case 'SUPPORT':
                responses = await this.handleSupport(context, message);
                break;
            case 'GOODBYE':
                responses = await this.handleGoodbye(context, message);
                break;
            default:
                responses = await this.handleIdle(context, message);
        }
        return responses;
    }
    async getOrCreateContext(customerId, storeId) {
        const phone = customerId;
        const instance = 'whatsapp';
        let conversation = (await this.prisma.conversationState.findFirst({
            where: {
                instance,
                phone,
            },
        }));
        if (!conversation) {
            conversation = (await this.prisma.conversationState.create({
                data: {
                    instance,
                    phone,
                    storeId,
                    customerId,
                    state: 'IDLE',
                    context: {},
                },
            }));
        }
        return {
            customerId,
            storeId,
            state: conversation.state,
            metadata: conversation.context || {},
        };
    }
    async saveContext(context) {
        const contextData = context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : {};
        await this.prisma.conversationState.updateMany({
            where: {
                instance: 'whatsapp',
                phone: context.customerId,
            },
            data: {
                state: context.state,
                context: contextData,
                lastActive: new Date(),
            },
        });
    }
    async handleIdle(context, message) {
        const normalizedMessage = message.toLowerCase().trim();
        if (normalizedMessage.includes('catalog') ||
            normalizedMessage.includes('catálogo') ||
            normalizedMessage.includes('produto')) {
            return this.handleBrowseCatalog(context, message);
        }
        if (normalizedMessage.includes('ajuda') || normalizedMessage.includes('suporte')) {
            return this.handleSupport(context, message);
        }
        if (normalizedMessage.includes('tchau') || normalizedMessage.includes('adeus')) {
            return this.handleGoodbye(context, message);
        }
        return [
            {
                type: 'button',
                text: '👋 Olá! Bem-vindo à nossa loja!\n\nComo posso ajudar você hoje?',
                buttons: [
                    { id: 'catalog', label: 'Ver Catálogo', payload: 'catalog' },
                    { id: 'support', label: 'Ajuda', payload: 'support' },
                ],
            },
        ];
    }
    async handleBrowseCatalog(context, _message) {
        await this.saveContext({ ...context, state: 'BROWSE_CATALOG' });
        return [
            {
                type: 'text',
                text: '🛍️ *Catálogo de Produtos*\n\nNavegue pelos nossos produtos disponíveis.',
            },
        ];
    }
    async handleViewProduct(context, _message) {
        await this.saveContext({ ...context, state: 'VIEW_PRODUCT' });
        return [
            {
                type: 'text',
                text: '📦 *Detalhes do Produto*\n\nVeja mais informações sobre este produto.',
            },
        ];
    }
    async handleAddToCart(context, _message) {
        await this.saveContext({ ...context, state: 'ADD_TO_CART' });
        return [
            {
                type: 'text',
                text: '🛒 *Produto Adicionado*\n\nItem adicionado ao seu carrinho com sucesso!',
            },
        ];
    }
    async handleViewCart(context, _message) {
        await this.saveContext({ ...context, state: 'VIEW_CART' });
        return [
            {
                type: 'text',
                text: '🛒 *Seu Carrinho*\n\nVeja os itens no seu carrinho.',
            },
        ];
    }
    async handleCheckout(context, _message) {
        await this.saveContext({ ...context, state: 'CHECKOUT' });
        return [
            {
                type: 'button',
                text: '💳 *Finalizar Compra*\n\nVamos prosseguir para o pagamento?',
                buttons: [
                    { id: 'confirm_payment', label: 'Confirmar Pagamento', payload: 'confirm' },
                    { id: 'cancel', label: 'Cancelar', payload: 'cancel' },
                ],
            },
        ];
    }
    async handleSupport(context, _message) {
        await this.saveContext({ ...context, state: 'SUPPORT' });
        return [
            {
                type: 'text',
                text: '🤝 *Suporte*\n\nComo podemos ajudar você?\n\nDigite sua dúvida ou solicitação.',
            },
        ];
    }
    async handleGoodbye(context, _message) {
        await this.saveContext({ ...context, state: 'GOODBYE' });
        return [
            {
                type: 'text',
                text: '👋 Obrigado pela visita!\n\nVolte sempre que precisar. Tenha um ótimo dia!',
            },
        ];
    }
    /**
     * Reseta o contexto da conversa para IDLE
     */
    async resetContext(customerId, _storeId) {
        await this.prisma.conversationState.updateMany({
            where: {
                instance: 'whatsapp',
                phone: customerId,
            },
            data: {
                state: 'IDLE',
                context: {},
                lastActive: new Date(),
            },
        });
    }
    /**
     * Marca a conversa como inativa
     */
    async endConversation(customerId, _storeId) {
        await this.prisma.conversationState.updateMany({
            where: {
                instance: 'whatsapp',
                phone: customerId,
            },
            data: {
                lastActive: new Date(),
            },
        });
    }
}
exports.BotEngineService = BotEngineService;
//# sourceMappingURL=bot-engine.service.js.map