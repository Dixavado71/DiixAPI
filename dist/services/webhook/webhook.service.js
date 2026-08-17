"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookService = exports.WebhookService = void 0;
const database_1 = require("../../config/database");
const logger_1 = require("../../utils/logger");
const evolution_client_1 = require("../../integrations/evolution/evolution.client");
const logger = (0, logger_1.getLogger)().child({ module: 'webhook-service' });
class WebhookService {
    /**
     * Process incoming webhook from Evolution API
     */
    async processWebhook(payload) {
        const eventId = crypto.randomUUID();
        try {
            logger.info({
                eventId,
                event: payload.event,
                instance: payload.instance,
            }, 'Processing webhook');
            // Check for idempotency - prevent duplicate processing
            const existingEvent = await database_1.prisma.webhookEvent.findUnique({
                where: { eventId: payload.data['id'] || eventId },
            });
            if (existingEvent) {
                logger.warn({ eventId, existingEventId: existingEvent.id }, 'Duplicate webhook event');
                return { success: true, eventId: existingEvent.id };
            }
            // Log webhook event
            await database_1.prisma.webhookEvent.create({
                data: {
                    eventId: payload.data['id'] || eventId,
                    instance: payload.instance,
                    eventType: payload.event,
                    payload: payload.data,
                    processed: false,
                },
            });
            // Route to appropriate handler based on event type
            switch (payload.event) {
                case 'messages.upsert':
                    await this.handleMessageUpsert(payload.instance, payload.data);
                    break;
                case 'messages.update':
                    await this.handleMessageUpdate(payload.instance, payload.data);
                    break;
                case 'connection.update':
                    await this.handleConnectionUpdate(payload.instance, payload.data);
                    break;
                default:
                    logger.debug({ event: payload.event }, 'Unhandled webhook event type');
            }
            // Mark event as processed
            await database_1.prisma.webhookEvent.updateMany({
                where: { eventId: payload.data['id'] || eventId },
                data: {
                    processed: true,
                    processedAt: new Date(),
                },
            });
            logger.info({ eventId, event: payload.event }, 'Webhook processed successfully');
            return { success: true, eventId };
        }
        catch (error) {
            logger.error({ error, eventId }, 'Error processing webhook');
            // Update webhook event with error
            await database_1.prisma.webhookEvent.updateMany({
                where: { eventId: payload.data['id'] || eventId },
                data: {
                    processed: true,
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
            });
            throw error;
        }
    }
    /**
     * Handle incoming messages
     */
    async handleMessageUpsert(instance, data) {
        // Ignore messages sent by the bot itself
        if (data.key.fromMe) {
            logger.debug({ messageId: data.key.id }, 'Ignoring outgoing message');
            return;
        }
        const phone = this.normalizePhone(data.key.remoteJid);
        const messageText = this.extractMessageText(data);
        logger.info({ instance, phone, message: messageText?.substring(0, 50) }, 'Incoming message received');
        // Extract or create customer
        const customer = await this.getOrCreateCustomer(phone, data.pushName);
        // Get or create conversation state
        const conversationState = await this.getOrCreateConversationState(instance, phone, customer.id);
        // Process message through bot engine
        // TODO: Import and call BotEngineService when implemented
        logger.info({ customerId: customer.id, state: conversationState.state }, 'Message ready for bot processing');
        // For now, just update last active timestamp
        await database_1.prisma.conversationState.update({
            where: { id: conversationState.id },
            data: {
                lastActive: new Date(),
                context: {
                    ...conversationState.context,
                    lastMessage: messageText,
                    lastMessageAt: new Date().toISOString(),
                },
            },
        });
    }
    /**
     * Handle message status updates
     */
    async handleMessageUpdate(instance, data) {
        logger.debug({ instance, data }, 'Message status update received');
        // TODO: Implement message status tracking (sent, delivered, read)
    }
    /**
     * Handle connection status updates
     */
    async handleConnectionUpdate(instance, data) {
        logger.info({ instance, status: data.status }, 'Connection status updated');
        // TODO: Update store's evolution instance status if needed
    }
    /**
     * Get existing customer or create new one
     */
    async getOrCreateCustomer(phone, name) {
        let customer = await database_1.prisma.customer.findUnique({
            where: { phone },
        });
        if (!customer) {
            customer = await database_1.prisma.customer.create({
                data: {
                    phone,
                    name: name || null,
                },
            });
            logger.info({ customerId: customer.id, phone }, 'New customer created');
        }
        return customer;
    }
    /**
     * Get or create conversation state
     */
    async getOrCreateConversationState(instance, phone, customerId) {
        let state = await database_1.prisma.conversationState.findUnique({
            where: {
                instance_phone: {
                    instance,
                    phone,
                },
            },
        });
        if (!state) {
            state = await database_1.prisma.conversationState.create({
                data: {
                    instance,
                    phone,
                    customerId,
                    state: 'IDLE',
                    context: {},
                },
            });
            logger.info({ stateId: state.id }, 'New conversation state created');
        }
        return state;
    }
    /**
     * Extract text from message
     */
    extractMessageText(data) {
        if (data.message?.conversation) {
            return data.message.conversation;
        }
        if (data.message?.extendedTextMessage?.text) {
            return data.message.extendedTextMessage.text;
        }
        if (data.message?.imageMessage?.caption) {
            return data.message.imageMessage.caption;
        }
        return null;
    }
    /**
     * Normalize phone number to standard format
     */
    normalizePhone(jid) {
        // Remove @s.whatsapp.net suffix and any non-digit characters
        const phone = jid.replace('@s.whatsapp.net', '').replace(/\D/g, '');
        return phone;
    }
    /**
     * Send message via Evolution API
     */
    async sendMessage(instanceName, phone, message) {
        try {
            const client = (0, evolution_client_1.getEvolutionClient)();
            const normalizedPhone = this.normalizePhoneForSend(phone);
            const result = await client.sendText(instanceName, normalizedPhone, message);
            logger.info({ instanceName, phone: normalizedPhone, messageId: result.messageId }, 'Message sent successfully');
            return result;
        }
        catch (error) {
            logger.error({ error, instanceName, phone }, 'Failed to send message');
            throw error;
        }
    }
    /**
     * Normalize phone for sending (add country code if missing)
     */
    normalizePhoneForSend(phone) {
        const cleaned = phone.replace(/\D/g, '');
        // If doesn't start with country code (55 for Brazil), add it
        if (!cleaned.startsWith('55') && cleaned.length === 10) {
            return '55' + cleaned;
        }
        return cleaned;
    }
}
exports.WebhookService = WebhookService;
exports.webhookService = new WebhookService();
//# sourceMappingURL=webhook.service.js.map