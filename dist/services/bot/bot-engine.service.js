"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotEngineService = void 0;
class BotEngineService {
    prisma;
    customerService;
    productService;
    cartService;
    orderService;
    config;
    constructor(prisma, customerService, productService, cartService, orderService, config) {
        this.prisma = prisma;
        this.customerService = customerService;
        this.productService = productService;
        this.cartService = cartService;
        this.orderService = orderService;
        this.config = {
            welcomeMessage: 'Olá! Bem-vindo à nossa loja. Como posso ajudar você hoje?',
            timeoutMinutes: 30,
            maxRetries: 3,
            enableSuggestions: true,
            language: 'pt-BR',
            ...config,
        };
    }
    /**
     * Processa uma mensagem recebida e retorna as respostas do bot
     */
    async processMessage(customerId, storeId, message) {
        // Obtém ou cria contexto da conversação
        const context = await this.getOrCreateContext(customerId, storeId);
        // Atualiza timestamp da última mensagem
        context.lastMessageAt = new Date();
        // Encontra o step atual baseado no estado
        const step = this.getCurrentStep(context.state);
        if (step) {
            // Executa o step atual
            return await step.execute(context, message);
        }
        // Se não houver step específico, trata como comando geral
        return await this.handleGeneralCommand(context, message);
    }
    /**
     * Obtém ou cria contexto de conversação
     */
    async getOrCreateContext(customerId, storeId) {
        let conversation = await this.prisma.conversation.findFirst({
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
            conversation = await this.prisma.conversation.create({
                data: {
                    customerId,
                    storeId,
                    state: 'IDLE',
                    isActive: true,
                },
            });
        }
        return {
            state: conversation.state,
            customerId,
            storeId,
            currentProductId: conversation.currentProductId || undefined,
            currentCartId: conversation.currentCartId || undefined,
            currentOrderId: conversation.currentOrderId || undefined,
            lastMessageAt: conversation.lastMessageAt || new Date(),
            metadata: conversation.metadata || {},
        };
    }
    /**
     * Salva o contexto da conversação
     */
    async saveContext(context) {
        await this.prisma.conversation.updateMany({
            where: {
                customerId: context.customerId,
                storeId: context.storeId,
                isActive: true,
            },
            data: {
                state: context.state,
                currentProductId: context.currentProductId,
                currentCartId: context.currentCartId,
                currentOrderId: context.currentOrderId,
                lastMessageAt: context.lastMessageAt,
                metadata: context.metadata,
            },
        });
    }
    /**
     * Retorna o step atual baseado no estado
     */
    getCurrentStep(state) {
        const steps = this.getFlowSteps();
        return steps.find(step => {
            const mockContext = {
                state,
                customerId: '',
                storeId: '',
                lastMessageAt: new Date(),
            };
            return step.trigger(mockContext, '');
        }) || null;
    }
    /**
     * Define todos os passos do fluxo de conversação
     */
    getFlowSteps() {
        return [
            this.createIdleStep(),
            this.createBrowseCatalogStep(),
            this.createViewProductStep(),
            this.createCartAddStep(),
            this.createCartViewStep(),
            this.createCheckoutStartStep(),
            this.createCheckoutAddressStep(),
            this.createCheckoutPaymentStep(),
            this.createOrderTrackingStep(),
            this.createSupportStep(),
        ];
    }
    /**
     * Step: Estado inicial (IDLE)
     */
    createIdleStep() {
        return {
            id: 'idle',
            name: 'Estado Inicial',
            trigger: async (context) => context.state === 'IDLE',
            execute: async (context, message) => {
                const lowerMessage = message.toLowerCase();
                // Comandos principais
                if (lowerMessage.includes('catalog') || lowerMessage.includes('produt')) {
                    context.state = 'BROWSE_CATALOG';
                    await this.saveContext(context);
                    return await this.executeBrowseCatalog(context, message);
                }
                if (lowerMessage.includes('carrinho') || lowerMessage.includes('cart')) {
                    context.state = 'CART_VIEW';
                    await this.saveContext(context);
                    return await this.executeCartView(context, message);
                }
                if (lowerMessage.includes('pedido') || lowerMessage.includes('order')) {
                    context.state = 'ORDER_TRACKING';
                    await this.saveContext(context);
                    return await this.executeOrderTracking(context, message);
                }
                if (lowerMessage.includes('ajuda') || lowerMessage.includes('suporte')) {
                    context.state = 'SUPPORT';
                    await this.saveContext(context);
                    return await this.executeSupport(context, message);
                }
                // Mensagem de boas-vindas com opções
                return [{
                        text: `${this.config.welcomeMessage}\n\nDigite:\n• "catalog" para ver produtos\n• "carrinho" para ver seu carrinho\n• "pedido" para acompanhar pedidos\n• "ajuda" para suporte`,
                        type: 'text',
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Navegar catálogo
     */
    createBrowseCatalogStep() {
        return {
            id: 'browse_catalog',
            name: 'Navegar Catálogo',
            trigger: async (context) => context.state === 'BROWSE_CATALOG',
            execute: async (context, message) => {
                return await this.executeBrowseCatalog(context, message);
            },
            transitions: [],
        };
    }
    /**
     * Executa lógica de navegação do catálogo
     */
    async executeBrowseCatalog(context, message) {
        const products = await this.productService.findAll(context.storeId);
        if (products.length === 0) {
            return [{
                    text: 'Desculpe, não há produtos disponíveis no momento.',
                    type: 'text',
                }];
        }
        const buttons = products.slice(0, 5).map((product, index) => ({
            id: `view_product_${product.id}`,
            text: product.name.substring(0, 20),
            type: 'reply',
        }));
        return [{
                text: `🛍️ *Catálogo de Produtos*\n\nEncontrei ${products.length} produtos. Selecione um para ver detalhes:`,
                type: 'button',
                buttons,
            }];
    }
    /**
     * Step: Ver produto
     */
    createViewProductStep() {
        return {
            id: 'view_product',
            name: 'Ver Produto',
            trigger: async (context) => context.state === 'VIEW_PRODUCT',
            execute: async (context, message) => {
                if (!context.currentProductId) {
                    context.state = 'BROWSE_CATALOG';
                    await this.saveContext(context);
                    return await this.executeBrowseCatalog(context, message);
                }
                const product = await this.productService.findById(context.currentProductId);
                if (!product) {
                    return [{
                            text: 'Produto não encontrado.',
                            type: 'text',
                        }];
                }
                return [{
                        text: `*${product.name}*\n\n${product.description}\n\n💰 *R$ ${product.price.toFixed(2)}*\n\n${product.stockQuantity > 0 ? '✅ Em estoque' : '❌ Sem estoque'}`,
                        type: 'button',
                        buttons: [
                            { id: 'add_to_cart', text: 'Adicionar ao Carrinho', type: 'reply' },
                            { id: 'back_catalog', text: 'Voltar ao Catálogo', type: 'reply' },
                        ],
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Adicionar ao carrinho
     */
    createCartAddStep() {
        return {
            id: 'cart_add',
            name: 'Adicionar ao Carrinho',
            trigger: async (context) => context.state === 'CART_ADD',
            execute: async (context, message) => {
                // Lógica para adicionar produto ao carrinho
                context.state = 'CART_VIEW';
                await this.saveContext(context);
                return [{
                        text: '✅ Produto adicionado ao carrinho!\n\nDeseja ver seu carrinho ou continuar comprando?',
                        type: 'button',
                        buttons: [
                            { id: 'view_cart', text: 'Ver Carrinho', type: 'reply' },
                            { id: 'continue_shopping', text: 'Continuar Comprando', type: 'reply' },
                        ],
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Ver carrinho
     */
    createCartViewStep() {
        return {
            id: 'cart_view',
            name: 'Ver Carrinho',
            trigger: async (context) => context.state === 'CART_VIEW',
            execute: async (context, message) => {
                return await this.executeCartView(context, message);
            },
            transitions: [],
        };
    }
    /**
     * Executa lógica de visualização do carrinho
     */
    async executeCartView(context, message) {
        // Implementação simplificada - na prática buscaria do banco
        return [{
                text: '🛒 *Seu Carrinho*\n\nVocê ainda não tem itens no carrinho.\n\nQue tal começar comprando algum produto?',
                type: 'button',
                buttons: [
                    { id: 'browse_catalog', text: 'Ver Catálogo', type: 'reply' },
                ],
            }];
    }
    /**
     * Step: Iniciar checkout
     */
    createCheckoutStartStep() {
        return {
            id: 'checkout_start',
            name: 'Iniciar Checkout',
            trigger: async (context) => context.state === 'CHECKOUT_START',
            execute: async (context, message) => {
                context.state = 'CHECKOUT_ADDRESS';
                await this.saveContext(context);
                return [{
                        text: '📦 *Finalizar Compra*\n\nPor favor, informe seu endereço de entrega:',
                        type: 'text',
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Endereço de entrega
     */
    createCheckoutAddressStep() {
        return {
            id: 'checkout_address',
            name: 'Endereço de Entrega',
            trigger: async (context) => context.state === 'CHECKOUT_ADDRESS',
            execute: async (context, message) => {
                // Salvar endereço no metadata
                context.metadata = { ...context.metadata, address: message };
                context.state = 'CHECKOUT_PAYMENT';
                await this.saveContext(context);
                return [{
                        text: '✅ Endereço registrado!\n\nEscolha a forma de pagamento:',
                        type: 'button',
                        buttons: [
                            { id: 'pay_pix', text: 'PIX', type: 'reply' },
                            { id: 'pay_credit', text: 'Cartão de Crédito', type: 'reply' },
                            { id: 'pay_debit', text: 'Cartão de Débito', type: 'reply' },
                        ],
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Pagamento
     */
    createCheckoutPaymentStep() {
        return {
            id: 'checkout_payment',
            name: 'Pagamento',
            trigger: async (context) => context.state === 'CHECKOUT_PAYMENT',
            execute: async (context, message) => {
                // Processar pagamento e criar pedido
                context.state = 'ORDER_TRACKING';
                await this.saveContext(context);
                return [{
                        text: '✅ Pedido criado com sucesso!\n\nNúmero do pedido: #12345\n\nAcompanhe o status abaixo:',
                        type: 'text',
                    }];
            },
            transitions: [],
        };
    }
    /**
     * Step: Acompanhamento de pedido
     */
    createOrderTrackingStep() {
        return {
            id: 'order_tracking',
            name: 'Acompanhamento de Pedido',
            trigger: async (context) => context.state === 'ORDER_TRACKING',
            execute: async (context, message) => {
                return await this.executeOrderTracking(context, message);
            },
            transitions: [],
        };
    }
    /**
     * Executa lógica de acompanhamento de pedido
     */
    async executeOrderTracking(context, message) {
        return [{
                text: '📦 *Acompanhar Pedido*\n\nDigite o número do seu pedido para acompanhar:',
                type: 'text',
            }];
    }
    /**
     * Step: Suporte
     */
    createSupportStep() {
        return {
            id: 'support',
            name: 'Suporte',
            trigger: async (context) => context.state === 'SUPPORT',
            execute: async (context, message) => {
                return await this.executeSupport(context, message);
            },
            transitions: [],
        };
    }
    /**
     * Executa lógica de suporte
     */
    async executeSupport(context, message) {
        return [{
                text: '🤝 *Suporte*\n\nComo podemos ajudar você?\n\n• Dúvidas sobre produtos\n• Problemas com pedidos\n• Reclamações\n• Outros\n\nDescreva sua dúvida ou problema:',
                type: 'text',
            }];
    }
    /**
     * Trata comandos gerais quando não há step específico
     */
    async handleGeneralCommand(context, message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage === 'oi' || lowerMessage === 'olá' || lowerMessage === 'ola') {
            return [{
                    text: this.config.welcomeMessage,
                    type: 'text',
                }];
        }
        if (lowerMessage === 'tchau' || lowerMessage === 'adeus') {
            return [{
                    text: 'Obrigado pela visita! Volte sempre! 👋',
                    type: 'text',
                }];
        }
        return [{
                text: 'Desculpe, não entendi. Digite "ajuda" para ver as opções disponíveis.',
                type: 'text',
            }];
    }
    /**
     * Reseta o contexto da conversação
     */
    async resetContext(customerId, storeId) {
        await this.prisma.conversation.updateMany({
            where: {
                customerId,
                storeId,
                isActive: true,
            },
            data: {
                state: 'IDLE',
                currentProductId: null,
                currentCartId: null,
                currentOrderId: null,
                metadata: null,
            },
        });
    }
    /**
     * Finaliza a conversação
     */
    async endConversation(customerId, storeId) {
        await this.prisma.conversation.updateMany({
            where: {
                customerId,
                storeId,
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });
    }
}
exports.BotEngineService = BotEngineService;
//# sourceMappingURL=bot-engine.service.js.map