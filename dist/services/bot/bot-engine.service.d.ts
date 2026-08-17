import { PrismaClient } from '@prisma/client';
import type { BotMessage } from '../../types/bot.types';
export declare class BotEngineService {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Processa uma mensagem recebida e retorna as respostas do bot
     */
    processMessage(customerId: string, storeId: string, message: string): Promise<BotMessage[]>;
    private getOrCreateContext;
    private saveContext;
    private handleIdle;
    private handleBrowseCatalog;
    private handleViewProduct;
    private handleAddToCart;
    private handleViewCart;
    private handleCheckout;
    private handleSupport;
    private handleGoodbye;
}
//# sourceMappingURL=bot-engine.service.d.ts.map