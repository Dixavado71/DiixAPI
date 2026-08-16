# Bot Engine - ECMS6

## Visão Geral

O **Bot Engine** é o sistema de conversação inteligente do ECMS6 que permite interações automatizadas com clientes via WhatsApp. Ele gerencia fluxos de conversação baseados em estados, proporcionando uma experiência de compra natural e intuitiva.

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  WhatsApp       │────▶│  Evolution API   │────▶│  Webhook        │
│  Client         │     │                  │     │  Service        │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Respostas      │◀────│  Bot Engine      │◀────│  Contexto       │
│  (Buttons,      │     │  Service         │     │  Conversation   │
│   Lists, Text)  │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Estados da Conversação

| Estado | Descrição | Gatilho |
|--------|-----------|---------|
| `IDLE` | Estado inicial/aguardando comando | Início ou reset |
| `BROWSE_CATALOG` | Navegando catálogo de produtos | "catalog", "produtos" |
| `VIEW_PRODUCT` | Visualizando detalhes de produto | Seleção de produto |
| `CART_ADD` | Adicionando produto ao carrinho | "adicionar" |
| `CART_VIEW` | Visualizando carrinho | "carrinho", "cart" |
| `CHECKOUT_START` | Iniciando checkout | "finalizar", "checkout" |
| `CHECKOUT_ADDRESS` | Informando endereço | Após iniciar checkout |
| `CHECKOUT_PAYMENT` | Escolhendo pagamento | Após informar endereço |
| `ORDER_TRACKING` | Acompanhando pedido | "pedido", "order" |
| `SUPPORT` | Solicitando suporte | "ajuda", "suporte" |

## Tipos de Mensagem

### Text
Mensagem simples de texto.
```typescript
{
  text: "Olá! Como posso ajudar?",
  type: "text"
}
```

### Button
Mensagem com botões de ação.
```typescript
{
  text: "Selecione uma opção:",
  type: "button",
  buttons: [
    { id: "opt1", text: "Opção 1", type: "reply" },
    { id: "opt2", text: "Opção 2", type: "reply" }
  ]
}
```

### List
Mensagem com lista de opções.
```typescript
{
  text: "Produtos disponíveis:",
  type: "list",
  sections: [{
    title: "Categoria A",
    rows: [
      { id: "p1", title: "Produto 1", description: "R$ 99,90" }
    ]
  }]
}
```

### Image
Mensagem com imagem.
```typescript
{
  text: "Veja nosso produto:",
  type: "image",
  image: {
    url: "https://example.com/prod.jpg",
    caption: "Produto X - R$ 99,90"
  }
}
```

### Quick Reply
Respostas rápidas.
```typescript
{
  text: "Forma de pagamento:",
  type: "quick_reply",
  buttons: [
    { id: "pix", text: "PIX", type: "reply" },
    { id: "card", text: "Cartão", type: "reply" }
  ]
}
```

## Endpoints da API

### Enviar Mensagem
```http
POST /bot/:customerId/:storeId/message
Content-Type: application/json

{
  "message": "quero ver catálogo"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "customerId": "cust123",
    "storeId": "store456",
    "message": "quero ver catálogo",
    "responses": [
      {
        "text": "🛍️ Catálogo de Produtos",
        "type": "button",
        "buttons": [...]
      }
    ]
  }
}
```

### Resetar Contexto
```http
POST /bot/:customerId/:storeId/reset
```

### Finalizar Conversação
```http
POST /bot/:customerId/:storeId/end
```

### Obter Contexto
```http
GET /bot/:customerId/:storeId/context
```

## Fluxo de Compra Completo

```
1. IDLE → Usuário digita "catálogo"
2. BROWSE_CATALOG → Exibe produtos com botões
3. VIEW_PRODUCT → Usuário seleciona produto
4. CART_ADD → Usuário clica "Adicionar ao Carrinho"
5. CART_VIEW → Exibe carrinho com opção de finalizar
6. CHECKOUT_START → Inicia processo de checkout
7. CHECKOUT_ADDRESS → Usuário informa endereço
8. CHECKOUT_PAYMENT → Usuário escolhe pagamento
9. ORDER_TRACKING → Pedido criado, exibe número
```

## Comandos Reconhecidos

| Comando | Ação |
|---------|------|
| "oi", "olá" | Mensagem de boas-vindas |
| "catálogo", "produtos" | Navegar catálogo |
| "carrinho", "cart" | Ver carrinho |
| "pedido", "order" | Acompanhar pedido |
| "ajuda", "suporte" | Suporte |
| "tchau", "adeus" | Despedida |

## Configuração

```typescript
const botConfig: BotConfig = {
  welcomeMessage: 'Olá! Bem-vindo à nossa loja!',
  timeoutMinutes: 30,
  maxRetries: 3,
  enableSuggestions: true,
  language: 'pt-BR',
};
```

## Integração com Webhook

O Bot Engine é acionado automaticamente quando o WebhookService recebe mensagens do cliente:

```typescript
// No webhook.service.ts
const responses = await this.botEngine.processMessage(
  customerId,
  storeId,
  messageText
);

// Envia respostas via Evolution API
for (const response of responses) {
  await this.evolutionClient.sendMessage(remoteJid, response);
}
```

## Modelos de Dados

### Conversation (Prisma)
```prisma
model Conversation {
  id              String   @id @default(uuid())
  customerId      String
  storeId         String
  state           String   // BotState
  currentProductId String?
  currentCartId   String?
  currentOrderId  String?
  lastMessageAt   DateTime
  metadata        Json?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  customer Customer @relation(fields: [customerId], references: [id])
  store    Store    @relation(fields: [storeId], references: [id])
}
```

## Melhores Práticas

1. **Sempre salvar contexto** após cada interação
2. **Validar estado atual** antes de processar mensagem
3. **Fornecer opções claras** com botões
4. **Manter mensagens concisas** para melhor UX no WhatsApp
5. **Permitir voltar** ao catálogo a qualquer momento
6. **Registrar logs** de todas as conversas

## Testes

Os testes cobrem:
- Transições de estado
- Tipos de mensagem
- Persistência de contexto
- Erros e exceções
- Fluxos completos de compra

Execute os testes:
```bash
npm test -- bot-engine
```

## Próximas Evoluções

- [ ] NLP para entendimento de linguagem natural
- [ ] Machine Learning para recomendações
- [ ] Múltiplos idiomas
- [ ] Templates personalizados por loja
- [ ] Analytics de conversão
- [ ] Integração com CRM

## Links Relacionados

- [Documentação Evolution API](../integrations/evolution.md)
- [API Reference](../api/README.md)
- [Arquitetura](../architecture/overview.md)
