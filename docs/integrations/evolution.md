# Evolution API Integration

## Overview

The ECMS6 platform integrates with **Evolution API v2.3.7** to enable WhatsApp messaging capabilities for multi-store e-commerce operations.

## Components

### 1. EvolutionClient

**Location:** `src/integrations/evolution/evolution.client.ts`

Central client for all communication with Evolution API.

#### Features:
- ✅ Instance management (create, delete, fetch)
- ✅ Connection state monitoring
- ✅ Message sending (text, media)
- ✅ Webhook configuration
- ✅ Error handling and logging
- ✅ Singleton pattern for efficient resource usage

#### Available Methods:

```typescript
// Get all instances
getInstances(): Promise<InstanceInfo[]>

// Get connection status
getConnectionState(instanceName: string): Promise<{ state: string }>

// Send text message
sendText(instanceName: string, to: string, message: string): Promise<SendMessageResult>

// Send media message
sendMedia(instanceName: string, to: string, mediaUrl: string, caption?: string): Promise<SendMessageResult>

// Set webhook URL
setWebhook(instanceName: string, config: WebhookConfig): Promise<{ success: boolean }>

// Create new instance (QR Code generation)
createInstance(instanceName: string): Promise<{ instanceId: string }>

// Delete instance
deleteInstance(instanceName: string): Promise<{ success: boolean }>

// Logout from instance
logout(instanceName: string): Promise<{ success: boolean }>
```

#### Configuration:

Set environment variables:
```bash
EVOLUTION_API_URL=http://your-evolution-api-url
EVOLUTION_API_KEY=your-api-key
```

### 2. WebhookService

**Location:** `src/services/webhook/webhook.service.ts`

Handles incoming webhooks from Evolution API and processes messages.

#### Features:
- ✅ Idempotency check (prevents duplicate processing)
- ✅ Event logging in database
- ✅ Automatic customer creation/extraction
- ✅ Conversation state management
- ✅ Message type detection (text, image, document)
- ✅ Phone number normalization
- ✅ Bot integration ready

#### Supported Events:
- `messages.upsert` - New incoming messages
- `messages.update` - Message status updates (sent, delivered, read)
- `connection.update` - Instance connection status changes

#### Flow:

```
Evolution API → Webhook Route → WebhookService → Database + Bot Engine
```

### 3. Webhook Routes

**Location:** `src/routes/webhook.routes.ts`

RESTful endpoint for receiving Evolution API webhooks.

#### Endpoint:
```
POST /api/v1/webhooks/evolution
```

#### Request Payload:
```json
{
  "event": "messages.upsert",
  "instance": "store-instance-name",
  "data": {
    "id": "message-id",
    "key": {
      "id": "msg-123",
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "Hello"
    },
    "pushName": "Customer Name"
  }
}
```

#### Response:
```json
{
  "status": "processed",
  "eventId": "uuid-here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Models

### WebhookEvent
Logs all webhook events for audit and idempotency.

```prisma
model WebhookEvent {
  id          String    @id @default(cuid())
  eventId     String    @unique
  instance    String
  eventType   String
  payload     Json
  processed   Boolean   @default(false)
  processedAt DateTime?
  error       String?
  createdAt   DateTime  @default(now())
}
```

### ConversationState
Stores conversation context for bot interactions.

```prisma
model ConversationState {
  id         String   @id @default(cuid())
  instance   String
  phone      String
  storeId    String?
  customerId String?
  state      String   @default("IDLE")
  context    Json?
  lastActive DateTime @default(now())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([instance, phone])
}
```

## Usage Examples

### Sending a Message

```typescript
import { getEvolutionClient } from './integrations/evolution/evolution.client';

const client = getEvolutionClient();

// Send text message
const result = await client.sendText(
  'store-instance',
  '5511999999999',
  'Hello! Your order is ready.'
);

console.log(result.messageId); // Message ID
```

### Setting Up Webhook

```typescript
import { getEvolutionClient } from './integrations/evolution/evolution.client';

const client = getEvolutionClient();

await client.setWebhook('store-instance', {
  url: 'https://your-domain.com/api/v1/webhooks/evolution',
  events: ['messages.upsert', 'messages.update', 'connection.update']
});
```

### Creating Instance

```typescript
import { getEvolutionClient } from './integrations/evolution/evolution.client';

const client = getEvolutionClient();

// Create new instance for a store
const { instanceId } = await client.createInstance('store-123');

// Generate QR Code (handled by Evolution API UI)
// Visit Evolution API dashboard to scan QR code
```

## Testing

Run webhook service tests:

```bash
npm test -- tests/services/webhook.service.test.ts
```

Tests cover:
- ✅ Message processing
- ✅ Idempotency (duplicate prevention)
- ✅ Outgoing message filtering
- ✅ Different event types
- ✅ Error handling
- ✅ Message text extraction
- ✅ Phone normalization

## Architecture

```
┌─────────────────┐
│  WhatsApp User  │
└────────┬────────┘
         │
         │ Message
         ▼
┌─────────────────┐
│  Evolution API  │
└────────┬────────┘
         │
         │ Webhook POST
         ▼
┌─────────────────┐
│  Webhook Route  │ → Validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ WebhookService  │ → Idempotency Check
└────────┬────────┘
         │
         ├─→ Log Event (Database)
         ├─→ Get/Create Customer
         ├─→ Update Conversation State
         └─→ Trigger Bot Engine (Future)
```

## Next Steps (Phase 7)

1. **Bot Engine Implementation**
   - Conversation flow management
   - Intent recognition
   - Context-aware responses

2. **Message Templates**
   - Order confirmations
   - Shipping updates
   - Promotion notifications

3. **Rich Media Support**
   - Product catalogs
   - Interactive buttons
   - Quick replies

4. **Analytics**
   - Response time tracking
   - Conversation metrics
   - Customer engagement

## Troubleshooting

### Common Issues

**Authentication Failed:**
- Verify `EVOLUTION_API_KEY` is correct
- Check API key permissions in Evolution dashboard

**Webhook Not Received:**
- Ensure webhook URL is publicly accessible
- Verify SSL certificate is valid
- Check Evolution API webhook configuration

**Duplicate Messages:**
- Idempotency check uses `eventId` from payload
- Ensure Evolution API sends unique IDs

**Phone Number Format:**
- All numbers are normalized to E.164 format
- Country code (55 for Brazil) is auto-added if missing

## References

- [Evolution API Documentation](https://doc.evolution-api.com/)
- [Evolution API GitHub](https://github.com/EvolutionAPI/evolution-api)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)
