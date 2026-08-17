import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  WebhookService,
  WebhookPayload,
  MessageData,
} from '../../src/services/webhook/webhook.service';
import { prisma } from '../../src/config/database';

// Mock prisma client
vi.mock('../../src/config/database', () => ({
  prisma: {
    webhookEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
    },
    customer: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    conversationState: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    webhookService = new WebhookService();
    vi.clearAllMocks();
  });

  describe('processWebhook', () => {
    it('should process messages.upsert event successfully', async () => {
      const payload: WebhookPayload = {
        event: 'messages.upsert',
        instance: 'test-instance',
        data: {
          id: 'msg-123',
          key: {
            id: 'msg-123',
            remoteJid: '5511999999999@s.whatsapp.net',
            fromMe: false,
          },
          message: {
            conversation: 'Hello',
          },
          pushName: 'Test User',
        },
      };

      vi.mocked(prisma.webhookEvent.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.webhookEvent.create).mockResolvedValue({ id: 'event-1' } as any);
      vi.mocked(prisma.customer.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.customer.create).mockResolvedValue({
        id: 'customer-1',
        phone: '5511999999999',
      } as any);
      vi.mocked(prisma.conversationState.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.conversationState.create).mockResolvedValue({
        id: 'state-1',
        state: 'IDLE',
        context: {},
      } as any);
      vi.mocked(prisma.webhookEvent.updateMany).mockResolvedValue({ count: 1 } as any);
      vi.mocked(prisma.conversationState.update).mockResolvedValue({ id: 'state-1' } as any);

      const result = await webhookService.processWebhook(payload);

      expect(result.success).toBe(true);
      expect(prisma.webhookEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventId: 'msg-123',
            instance: 'test-instance',
            eventType: 'messages.upsert',
            processed: false,
          }),
        })
      );
      expect(prisma.customer.create).toHaveBeenCalled();
      expect(prisma.conversationState.create).toHaveBeenCalled();
    });

    it('should handle duplicate webhook events (idempotency)', async () => {
      const payload: WebhookPayload = {
        event: 'messages.upsert',
        instance: 'test-instance',
        data: {
          id: 'msg-duplicate',
          key: {
            id: 'msg-duplicate',
            remoteJid: '5511999999999@s.whatsapp.net',
            fromMe: false,
          },
          message: {
            conversation: 'Hello again',
          },
        },
      };

      vi.mocked(prisma.webhookEvent.findUnique).mockResolvedValue({
        id: 'existing-event-id',
        eventId: 'msg-duplicate',
        processed: true,
      } as any);

      const result = await webhookService.processWebhook(payload);

      expect(result.success).toBe(true);
      expect(result.eventId).toBe('existing-event-id');
      expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    });

    it('should ignore messages sent by the bot itself', async () => {
      const payload: WebhookPayload = {
        event: 'messages.upsert',
        instance: 'test-instance',
        data: {
          id: 'msg-outgoing',
          key: {
            id: 'msg-outgoing',
            remoteJid: '5511999999999@s.whatsapp.net',
            fromMe: true, // Message from bot
          },
          message: {
            conversation: 'Bot response',
          },
        },
      };

      vi.mocked(prisma.webhookEvent.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.webhookEvent.create).mockResolvedValue({ id: 'event-2' } as any);
      vi.mocked(prisma.webhookEvent.updateMany).mockResolvedValue({ count: 1 } as any);

      await webhookService.processWebhook(payload);

      expect(prisma.customer.findUnique).not.toHaveBeenCalled();
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('should handle connection.update events', async () => {
      const payload: WebhookPayload = {
        event: 'connection.update',
        instance: 'test-instance',
        data: {
          status: 'open',
        },
      };

      vi.mocked(prisma.webhookEvent.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.webhookEvent.create).mockResolvedValue({ id: 'event-3' } as any);
      vi.mocked(prisma.webhookEvent.updateMany).mockResolvedValue({ count: 1 } as any);

      const result = await webhookService.processWebhook(payload);

      expect(result.success).toBe(true);
      expect(prisma.webhookEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'connection.update',
          }),
        })
      );
    });

    it('should handle errors and mark event as failed', async () => {
      const payload: WebhookPayload = {
        event: 'messages.upsert',
        instance: 'test-instance',
        data: {
          id: 'msg-error',
          key: {
            id: 'msg-error',
            remoteJid: '5511999999999@s.whatsapp.net',
            fromMe: false,
          },
          message: {
            conversation: 'Test',
          },
        },
      };

      vi.mocked(prisma.webhookEvent.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.webhookEvent.create).mockResolvedValue({ id: 'event-4' } as any);
      vi.mocked(prisma.customer.findUnique).mockRejectedValue(new Error('Database error'));

      await expect(webhookService.processWebhook(payload)).rejects.toThrow('Database error');

      expect(prisma.webhookEvent.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            processed: true,
            error: 'Database error',
          }),
        })
      );
    });
  });

  describe('extractMessageText', () => {
    it('should extract text from conversation message', () => {
      const messageData: MessageData = {
        key: {
          id: 'msg-1',
          remoteJid: '5511999999999@s.whatsapp.net',
          fromMe: false,
        },
        message: {
          conversation: 'Hello World',
        },
      };

      // Access private method via any cast for testing
      const service = webhookService as any;
      const text = service.extractMessageText(messageData);

      expect(text).toBe('Hello World');
    });

    it('should extract text from extendedTextMessage', () => {
      const messageData: MessageData = {
        key: {
          id: 'msg-2',
          remoteJid: '5511999999999@s.whatsapp.net',
          fromMe: false,
        },
        message: {
          extendedTextMessage: {
            text: 'Extended message text',
          },
        },
      };

      const service = webhookService as any;
      const text = service.extractMessageText(messageData);

      expect(text).toBe('Extended message text');
    });

    it('should extract caption from image message', () => {
      const messageData: MessageData = {
        key: {
          id: 'msg-3',
          remoteJid: '5511999999999@s.whatsapp.net',
          fromMe: false,
        },
        message: {
          imageMessage: {
            caption: 'Image caption',
          },
        },
      };

      const service = webhookService as any;
      const text = service.extractMessageText(messageData);

      expect(text).toBe('Image caption');
    });

    it('should return null for message without text', () => {
      const messageData: MessageData = {
        key: {
          id: 'msg-4',
          remoteJid: '5511999999999@s.whatsapp.net',
          fromMe: false,
        },
        message: {},
      };

      const service = webhookService as any;
      const text = service.extractMessageText(messageData);

      expect(text).toBeNull();
    });
  });

  describe('normalizePhone', () => {
    it('should normalize phone number from JID', () => {
      const jid = '5511999999999@s.whatsapp.net';
      const service = webhookService as any;
      const phone = service.normalizePhone(jid);

      expect(phone).toBe('5511999999999');
    });

    it('should remove non-digit characters', () => {
      const jid = '55-11-99999-9999@s.whatsapp.net';
      const service = webhookService as any;
      const phone = service.normalizePhone(jid);

      expect(phone).toBe('5511999999999');
    });
  });
});
