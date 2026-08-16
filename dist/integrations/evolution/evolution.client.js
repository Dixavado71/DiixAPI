"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionClient = void 0;
exports.getEvolutionClient = getEvolutionClient;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)().child({ module: 'evolution-client' });
/**
 * Evolution API Client - Centralizes all communication with Evolution API v2.3.7
 *
 * IMPORTANT: Only implement methods that are confirmed to exist in the API version.
 * If a method is not implemented, it will throw NOT_IMPLEMENTED error.
 */
class EvolutionClient {
    client;
    constructor(config) {
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.apiKey,
            },
            timeout: config.timeout || 30000,
        });
        // Response interceptor for logging
        this.client.interceptors.response.use((response) => response, (error) => {
            logger.error({
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
            }, 'Evolution API request failed');
            return Promise.reject(error);
        });
    }
    /**
     * Get all instances
     * GET /instance/fetchInstances
     */
    async getInstances() {
        try {
            const response = await this.client.get('/instance/fetchInstances');
            return response.data;
        }
        catch (error) {
            logger.error({ error }, 'Failed to fetch instances');
            throw this.handleError(error);
        }
    }
    /**
     * Get instance connection status
     * GET /connectionState/:instanceName
     */
    async getConnectionState(instanceName) {
        try {
            const response = await this.client.get(`/connectionState/${instanceName}`);
            return response.data;
        }
        catch (error) {
            logger.error({ error, instanceName }, 'Failed to get connection state');
            throw this.handleError(error);
        }
    }
    /**
     * Send text message
     * POST /message/sendText/:instanceName
     */
    async sendText(instanceName, to, message) {
        try {
            const response = await this.client.post(`/message/sendText/${instanceName}`, {
                number: to,
                textMessage: { text: message },
            });
            return {
                messageId: response.data.key?.id || crypto.randomUUID(),
                status: 'sent',
            };
        }
        catch (error) {
            logger.error({ error, instanceName, to }, 'Failed to send text message');
            throw this.handleError(error);
        }
    }
    /**
     * Send media message
     * POST /message/sendMedia/:instanceName
     */
    async sendMedia(instanceName, to, mediaUrl, caption) {
        try {
            const response = await this.client.post(`/message/sendMedia/${instanceName}`, {
                number: to,
                mediaMessage: {
                    mediatype: 'image',
                    media: mediaUrl,
                    caption: caption || '',
                },
            });
            return {
                messageId: response.data.key?.id || crypto.randomUUID(),
                status: 'sent',
            };
        }
        catch (error) {
            logger.error({ error, instanceName, to }, 'Failed to send media message');
            throw this.handleError(error);
        }
    }
    /**
     * Set webhook URL
     * POST /webhook/set/:instanceName
     */
    async setWebhook(instanceName, config) {
        try {
            const response = await this.client.post(`/webhook/set/${instanceName}`, {
                url: config.url,
                events: config.events || ['messages.upsert'],
            });
            return response.data;
        }
        catch (error) {
            logger.error({ error, instanceName }, 'Failed to set webhook');
            throw this.handleError(error);
        }
    }
    /**
     * Create new instance (QR Code generation)
     * POST /instance/create
     */
    async createInstance(instanceName) {
        try {
            const response = await this.client.post('/instance/create', {
                instanceName,
            });
            return response.data;
        }
        catch (error) {
            logger.error({ error, instanceName }, 'Failed to create instance');
            throw this.handleError(error);
        }
    }
    /**
     * Delete instance
     * DELETE /instance/delete/:instanceName
     */
    async deleteInstance(instanceName) {
        try {
            const response = await this.client.delete(`/instance/delete/${instanceName}`);
            return response.data;
        }
        catch (error) {
            logger.error({ error, instanceName }, 'Failed to delete instance');
            throw this.handleError(error);
        }
    }
    /**
     * Logout from instance
     * POST /connection/logout/:instanceName
     */
    async logout(instanceName) {
        try {
            const response = await this.client.post(`/connection/logout/${instanceName}`);
            return response.data;
        }
        catch (error) {
            logger.error({ error, instanceName }, 'Failed to logout instance');
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data;
            if (status === 401) {
                return new Error('Evolution API authentication failed - invalid API key');
            }
            if (status === 404) {
                return new Error('Evolution API endpoint not found');
            }
            if (status === 500) {
                return new Error(`Evolution API internal error: ${JSON.stringify(data)}`);
            }
            return new Error(`Evolution API error (${status}): ${JSON.stringify(data)}`);
        }
        if (error instanceof Error) {
            return error;
        }
        return new Error('Unknown error in Evolution API client');
    }
}
exports.EvolutionClient = EvolutionClient;
// Singleton instance (created when needed)
let evolutionClient = null;
function getEvolutionClient() {
    if (!evolutionClient) {
        const baseUrl = process.env.EVOLUTION_API_URL;
        const apiKey = process.env.EVOLUTION_API_KEY;
        if (!baseUrl || !apiKey) {
            throw new Error('EVOLUTION_API_URL and EVOLUTION_API_KEY must be set in environment variables');
        }
        evolutionClient = new EvolutionClient({
            baseUrl,
            apiKey,
            timeout: 30000,
        });
    }
    return evolutionClient;
}
//# sourceMappingURL=evolution.client.js.map