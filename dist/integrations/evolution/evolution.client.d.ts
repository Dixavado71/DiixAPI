export interface EvolutionConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
}
export interface InstanceInfo {
    instanceId: string;
    status: string;
    connectionStatus: string;
}
export interface SendMessageResult {
    messageId: string;
    status: string;
}
export interface WebhookConfig {
    url: string;
    events?: string[];
}
/**
 * Evolution API Client - Centralizes all communication with Evolution API v2.3.7
 *
 * IMPORTANT: Only implement methods that are confirmed to exist in the API version.
 * If a method is not implemented, it will throw NOT_IMPLEMENTED error.
 */
export declare class EvolutionClient {
    private client;
    constructor(config: EvolutionConfig);
    /**
     * Get all instances
     * GET /instance/fetchInstances
     */
    getInstances(): Promise<InstanceInfo[]>;
    /**
     * Get instance connection status
     * GET /connectionState/:instanceName
     */
    getConnectionState(instanceName: string): Promise<{
        state: string;
    }>;
    /**
     * Send text message
     * POST /message/sendText/:instanceName
     */
    sendText(instanceName: string, to: string, message: string): Promise<SendMessageResult>;
    /**
     * Send media message
     * POST /message/sendMedia/:instanceName
     */
    sendMedia(instanceName: string, to: string, mediaUrl: string, caption?: string): Promise<SendMessageResult>;
    /**
     * Set webhook URL
     * POST /webhook/set/:instanceName
     */
    setWebhook(instanceName: string, config: WebhookConfig): Promise<{
        success: boolean;
    }>;
    /**
     * Create new instance (QR Code generation)
     * POST /instance/create
     */
    createInstance(instanceName: string): Promise<{
        instanceId: string;
    }>;
    /**
     * Delete instance
     * DELETE /instance/delete/:instanceName
     */
    deleteInstance(instanceName: string): Promise<{
        success: boolean;
    }>;
    /**
     * Logout from instance
     * POST /connection/logout/:instanceName
     */
    logout(instanceName: string): Promise<{
        success: boolean;
    }>;
    private handleError;
}
export declare function getEvolutionClient(): EvolutionClient;
//# sourceMappingURL=evolution.client.d.ts.map