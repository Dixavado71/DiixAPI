import { PrismaClient } from '@prisma/client';
import type { BotMessage } from '../../types/bot.types';
import { ProductService } from '../product/product.service';
export declare class BotEngineService {
    private prisma;
    private productService;
    private handlers;
    constructor(prisma: PrismaClient, productService: ProductService);
    private initializeHandlers;
    /**
     * Processa uma mensagem recebida e retorna as respostas do bot
     */
    processMessage(customerId: string, storeId: string, message: string): Promise<BotMessage[]>;
    /**
     * Obtém ou cria contexto de conversação
     */
    private getOrCreateContext;
    /**
     * Salva o contexto da conversação
     */
    private saveContext;
    /**
     * Retorna o step atual baseado no estado
     */
    private getCurrentStep;
    /**
     * Define todos os passos do fluxo de conversação
     */
    private getFlowSteps;
    /**
     * Step: Estado inicial (IDLE)
     */
    private createIdleStep;
    /**
     * Step: Navegar catálogo
     */
    private createBrowseCatalogStep;
    /**
     * Executa lógica de navegação do catálogo
     */
    private executeBrowseCatalog;
    /**
     * Step: Ver produto
     */
    private createViewProductStep;
    /**
     * Step: Adicionar ao carrinho
     */
    private createCartAddStep;
    /**
     * Step: Ver carrinho
     */
    private createCartViewStep;
    /**
     * Executa lógica de visualização do carrinho
     */
    private executeCartView;
    /**
     * Step: Iniciar checkout
     */
    private createCheckoutStartStep;
    /**
     * Step: Endereço de entrega
     */
    private createCheckoutAddressStep;
    /**
     * Step: Pagamento
     */
    private createCheckoutPaymentStep;
    /**
     * Step: Acompanhamento de pedido
     */
    private createOrderTrackingStep;
    /**
     * Executa lógica de acompanhamento de pedido
     */
    private executeOrderTracking;
    /**
     * Step: Suporte
     */
    private createSupportStep;
    /**
     * Executa lógica de suporte
     */
    private executeSupport;
    /**
     * Trata comandos gerais quando não há step específico
     */
    private handleGeneralCommand;
    /**
     * Reseta o contexto da conversação
     */
    resetContext(customerId: string, storeId: string): Promise<void>;
    /**
     * Finaliza a conversação
     */
    endConversation(customerId: string, storeId: string): Promise<void>;
}
//# sourceMappingURL=bot-engine.service.d.ts.map