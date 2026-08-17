/**
 * Tipos para o Bot Engine e fluxos de conversação
 */
export type BotState = 'IDLE' | 'BROWSE_CATALOG' | 'VIEW_PRODUCT' | 'CART_ADD' | 'CART_VIEW' | 'CHECKOUT_START' | 'CHECKOUT_ADDRESS' | 'CHECKOUT_PAYMENT' | 'ORDER_TRACKING' | 'SUPPORT';
export interface ConversationContext {
    state: BotState;
    customerId: string;
    storeId: string;
    currentProductId?: string;
    currentCartId?: string;
    currentOrderId?: string;
    lastMessageAt: Date;
    metadata?: Record<string, any>;
}
export interface BotMessage {
    text: string;
    type: 'text' | 'image' | 'button' | 'list' | 'quick_reply';
    buttons?: ButtonOption[];
    sections?: ListSection[];
    image?: {
        url: string;
        caption?: string;
    };
}
export interface ButtonOption {
    id: string;
    text: string;
    type: 'reply' | 'url' | 'phone';
    url?: string;
    phone?: string;
}
export interface ListSection {
    title: string;
    rows: ListRow[];
}
export interface ListRow {
    id: string;
    title: string;
    description?: string;
}
export interface FlowStep {
    id: string;
    name: string;
    trigger: (context: ConversationContext, message: string) => Promise<boolean>;
    execute: (context: ConversationContext, message: string) => Promise<BotMessage[]>;
    transitions: FlowTransition[];
}
export interface FlowTransition {
    condition: (context: ConversationContext, message: string) => boolean;
    nextState: BotState;
}
export interface BotConfig {
    welcomeMessage: string;
    timeoutMinutes: number;
    maxRetries: number;
    enableSuggestions: boolean;
    language: 'pt-BR' | 'en-US' | 'es-ES';
}
//# sourceMappingURL=bot.types.d.ts.map