import { SendMessageResult } from '../../integrations/evolution/evolution.client';
export interface WebhookPayload {
    event: string;
    instance: string;
    data: Record<string, unknown>;
}
export interface MessageData {
    key: {
        id: string;
        remoteJid: string;
        fromMe: boolean;
    };
    message?: {
        conversation?: string;
        extendedTextMessage?: {
            text: string;
        };
        imageMessage?: {
            caption?: string;
            url?: string;
        };
        documentMessage?: {
            title?: string;
            url?: string;
        };
    };
    pushName?: string;
}
export declare class WebhookService {
    /**
     * Process incoming webhook from Evolution API
     */
    processWebhook(payload: WebhookPayload): Promise<{
        success: boolean;
        eventId: string;
    }>;
    /**
     * Handle incoming messages
     */
    private handleMessageUpsert;
    /**
     * Handle message status updates
     */
    private handleMessageUpdate;
    /**
     * Handle connection status updates
     */
    private handleConnectionUpdate;
    /**
     * Get existing customer or create new one
     */
    private getOrCreateCustomer;
    /**
     * Get or create conversation state
     */
    private getOrCreateConversationState;
    /**
     * Extract text from message
     */
    private extractMessageText;
    /**
     * Normalize phone number to standard format
     */
    private normalizePhone;
    /**
     * Send message via Evolution API
     */
    sendMessage(instanceName: string, phone: string, message: string): Promise<SendMessageResult>;
    /**
     * Normalize phone for sending (add country code if missing)
     */
    private normalizePhoneForSend;
}
export declare const webhookService: WebhookService;
//# sourceMappingURL=webhook.service.d.ts.map