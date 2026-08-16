# ECMS6 - Webhook da Evolution API

## Visão Geral

O webhook recebe eventos do WhatsApp através da Evolution API e inicia o processamento das mensagens.

## Endpoint

```
POST /api/v1/webhooks/evolution
```

## Fluxo de Processamento

```
Evolution API
     ↓
WebhookController (valida payload)
     ↓
WebhookService (processa evento)
     ↓
EvolutionEventParser (extrai dados)
     ↓
StoreResolver (identifica loja pela instância)
     ↓
CustomerResolver (identifica cliente pelo phone)
     ↓
CustomerAuthorizationService (verifica permissão)
     ↓
ConversationService (atualiza estado)
     ↓
BotEngine (processa mensagem) [Futuro]
```

## Payload Esperado

```json
{
  "event": "messages.upsert",
  "instance": "loja_a",
  "data": {
    "key": {
      "id": "message_id_unico",
      "remoteJid": "5561999999999@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "Olá, quero fazer um pedido",
      "extendedTextMessage": { ... }
    },
    "pushName": "João Silva",
    "messageTimestamp": 1234567890
  }
}
```

## Idempotência

Cada evento possui um `eventId` único:

```typescript
// Extrair ID único
const eventId = `${instance}-${messageId}`;

// Verificar se já processado
const existing = await prisma.webhookEvent.findUnique({
  where: { eventId }
});

if (existing && existing.processed) {
  return res.status(200).json({ success: true });
}
```

## Validação

### 1. Schema Validation (Zod)
```typescript
const webhookSchema = z.object({
  event: z.string(),
  instance: z.string(),
  data: z.object({
    key: z.object({
      id: z.string(),
      remoteJid: z.string(),
      fromMe: z.boolean()
    }),
    message: z.object({
      conversation: z.string().optional(),
      extendedTextMessage: z.any().optional()
    }),
    pushName: z.string().optional(),
    messageTimestamp: z.number()
  })
});
```

### 2. Secret Validation (Futuro)
```typescript
const signature = req.headers['x-evolution-signature'];
const isValid = verifySignature(body, secret, signature);
```

## Resolução da Loja

```typescript
// evolutionInstance → Store
const store = await prisma.store.findFirst({
  where: { evolutionInstanceId: instance }
});

if (!store) {
  throw new Error('STORE_NOT_FOUND');
}
```

## Resolução do Cliente

```typescript
// remoteJid → phone normalizado → Customer
const phone = normalizePhone(remoteJid);
let customer = await prisma.customer.findUnique({
  where: { phone }
});

// Se não existir, criar ou retornar null dependendo da config
if (!customer && !settings.customerRegistrationRequired) {
  customer = await prisma.customer.create({
    data: { phone, name: pushName }
  });
}
```

## Autorização

```typescript
const authorization = await CustomerAuthorizationService.isAllowed({
  storeId: store.id,
  customerId: customer.id
});

if (!authorization.allowed) {
  // Enviar mensagem de bloqueio
  await EvolutionClient.sendText({
    instance: store.evolutionInstanceId,
    phone: customer.phone,
    message: 'Você não está autorizado a fazer pedidos nesta loja.'
  });
  
  return;
}
```

## Estados da Conversa

```typescript
enum ConversationState {
  IDLE = 'IDLE',
  MENU = 'MENU',
  PRODUCT_BROWSING = 'PRODUCT_BROWSING',
  PRODUCT_SELECTION = 'PRODUCT_SELECTION',
  CART = 'CART',
  DELIVERY_ADDRESS = 'DELIVERY_ADDRESS',
  DELIVERY_METHOD = 'DELIVERY_METHOD',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  SUPPORT = 'SUPPORT'
}
```

## Respostas

### Sucesso
```json
{
  "success": true,
  "processed": true
}
```

### Erro de Validação
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload inválido"
  }
}
```

### Erro de Processamento
```json
{
  "success": false,
  "error": {
    "code": "PROCESSING_ERROR",
    "message": "Erro ao processar mensagem"
  }
}
```

## Logs

```typescript
logger.info({
  event: 'webhook_received',
  eventId,
  instance,
  storeId: store?.id,
  phone: customer?.phone,
  messageType: extractMessageType(data.message)
});
```

## Configuração na Evolution API

1. Acesse o painel da Evolution API
2. Vá em "Webhooks"
3. Configure:
   - URL: `https://seu-ecms6.com/api/v1/webhooks/evolution`
   - Events: `messages.upsert`
   - Secret: (opcional, para validação)

## Troubleshooting

### Webhook não chega
- Verificar logs da Evolution API
- Confirmar URL pública acessível
- Testar com ngrok localmente

### Processamento duplicado
- Verificar índice unique em `WebhookEvent.eventId`
- Confirmar lógica de idempotência

### Loja não encontrada
- Verificar `evolutionInstanceId` configurada na Store
- Confirmar nome da instância na Evolution API
