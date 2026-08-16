# ECMS6 API Documentation

## Visão Geral

API RESTful completa para sistema de e-commerce multi-loja integrado com WhatsApp.

**Base URL:** `http://localhost:3000/api`

## Autenticação

A maioria dos endpoints requer autenticação via header:
```
Authorization: Bearer <token>
```

## Endpoints por Categoria

### 🏪 Stores (Lojas)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stores` | Listar todas as lojas |
| POST | `/stores` | Criar nova loja |
| GET | `/stores/:id` | Obter detalhes da loja |
| PUT | `/stores/:id` | Atualizar loja |
| DELETE | `/stores/:id` | Deletar loja |

### 👥 Customers (Clientes)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/customers` | Listar clientes |
| POST | `/customers` | Criar cliente |
| GET | `/customers/:id` | Obter cliente |
| PUT | `/customers/:id` | Atualizar cliente |
| DELETE | `/customers/:id` | Deletar cliente |
| GET | `/stores/:storeId/customers` | Clientes de uma loja |

### 📦 Products (Produtos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stores/:storeId/products` | Listar produtos da loja |
| POST | `/stores/:storeId/products` | Criar produto |
| GET | `/products/:id` | Obter produto |
| PUT | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Deletar produto |
| GET | `/stores/:storeId/products/search` | Buscar produtos |

### 🏷️ Categories (Categorias)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stores/:storeId/categories` | Listar categorias |
| POST | `/stores/:storeId/categories` | Criar categoria |
| GET | `/categories/:id` | Obter categoria |
| PUT | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Deletar categoria |

### 🛒 Cart (Carrinho)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/carts/:id` | Obter carrinho |
| POST | `/carts` | Criar carrinho |
| POST | `/carts/:id/items` | Adicionar item ao carrinho |
| PUT | `/carts/:id/items/:itemId` | Atualizar item do carrinho |
| DELETE | `/carts/:id/items/:itemId` | Remover item do carrinho |
| DELETE | `/carts/:id` | Esvaziar carrinho |

### 📋 Orders (Pedidos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stores/:storeId/orders` | Listar pedidos da loja |
| POST | `/orders` | Criar pedido (checkout) |
| GET | `/orders/:id` | Obter pedido |
| PUT | `/orders/:id/status` | Atualizar status do pedido |
| DELETE | `/orders/:id` | Cancelar pedido |
| GET | `/customers/:customerId/orders` | Pedidos do cliente |

### 🎁 Promotions (Promoções)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/stores/:storeId/promotions` | Listar promoções |
| POST | `/stores/:storeId/promotions` | Criar promoção |
| GET | `/stores/:storeId/promotions/active` | Promoções ativas |
| GET | `/promotions/:id` | Obter promoção |
| PUT | `/promotions/:id` | Atualizar promoção |
| DELETE | `/promotions/:id` | Deletar promoção |
| POST | `/promotions/:id/rules` | Adicionar regra |
| DELETE | `/promotions/:id/rules/:ruleId` | Remover regra |
| POST | `/promotions/:id/products` | Adicionar produtos |
| DELETE | `/promotions/:id/products/:productId` | Remover produto |

### 💬 Webhook (Evolution API)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/webhook/evolution` | Receber eventos do WhatsApp |
| GET | `/webhook/health` | Health check do webhook |

### 🤖 Bot (Bot Engine)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/bot/:customerId/:storeId/message` | Enviar mensagem ao bot |
| POST | `/bot/:customerId/:storeId/reset` | Resetar contexto |
| POST | `/bot/:customerId/:storeId/end` | Finalizar conversação |
| GET | `/bot/:customerId/:storeId/context` | Obter contexto atual |

## Exemplos de Uso

### Criar Loja
```bash
curl -X POST http://localhost:3000/api/stores \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Loja",
    "document": "12345678000190",
    "email": "contato@loja.com",
    "phone": "+5511999999999"
  }'
```

### Listar Produtos
```bash
curl http://localhost:3000/api/stores/{storeId}/products
```

### Adicionar ao Carrinho
```bash
curl -X POST http://localhost:3000/api/carts/{cartId}/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod123",
    "quantity": 2
  }'
```

### Criar Pedido (Checkout)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust123",
    "storeId": "store456",
    "cartId": "cart789",
    "shippingAddress": {
      "street": "Rua X",
      "number": "123",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    },
    "paymentMethod": "PIX"
  }'
```

### Enviar Mensagem ao Bot
```bash
curl -X POST http://localhost:3000/api/bot/cust123/store456/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "quero ver catálogo"
  }'
```

## Respostas de Erro

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Campo nome é obrigatório"]
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Detalhes do erro"
}
```

## Rate Limiting

- **Limite:** 100 requisições por minuto por IP
- **Header:** `X-RateLimit-Remaining` indica requisições restantes

## Webhooks

O sistema envia webhooks para os seguintes eventos:

| Evento | Descrição |
|--------|-----------|
| `order.created` | Pedido criado |
| `order.updated` | Pedido atualizado |
| `order.cancelled` | Pedido cancelado |
| `payment.confirmed` | Pagamento confirmado |

## Modelos de Dados

### Product
```json
{
  "id": "prod123",
  "storeId": "store456",
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 99.90,
  "stockQuantity": 100,
  "categoryId": "cat789",
  "images": ["url1.jpg", "url2.jpg"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Order
```json
{
  "id": "order123",
  "storeId": "store456",
  "customerId": "cust789",
  "status": "PENDING_PAYMENT",
  "totalAmount": 199.80,
  "items": [
    {
      "productId": "prod123",
      "quantity": 2,
      "unitPrice": 99.90,
      "subtotal": 199.80
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "PIX",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### BotMessage
```json
{
  "text": "🛍️ Catálogo de Produtos",
  "type": "button",
  "buttons": [
    {
      "id": "view_product_1",
      "text": "Produto 1",
      "type": "reply"
    }
  ]
}
```

## Versionamento

A API utiliza versionamento por URL:
- `v1`: `/api/v1/...` (atual)

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou contate a equipe de desenvolvimento.
