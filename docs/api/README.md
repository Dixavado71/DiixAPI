# ECMS6 - API Reference

## Visão Geral

API RESTful versionada (`/api/v1`) para gestão multi-loja com autenticação e autorização.

## Base URL

- Desenvolvimento: `http://localhost:3000/api/v1`
- Produção: `https://seu-domínio.up.railway.app/api/v1`

## Autenticação

### Admin JWT
```http
Authorization: Bearer <token>
```

### Endpoints Públicos
- Health checks
- Webhooks (validação por secret)

## Respostas Padrão

### Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro"
  }
}
```

## Endpoints

### Health
- `GET /health` - Status do serviço
- `GET /health/ready` - Verifica PostgreSQL e Redis

### Stores
- `GET /stores` - Listar lojas
- `POST /stores` - Criar loja
- `GET /stores/:id` - Buscar loja
- `PATCH /stores/:id` - Atualizar loja
- `POST /stores/:id/activate` - Ativar loja
- `POST /stores/:id/deactivate` - Desativar loja
- `GET /stores/:id/settings` - Obter configurações
- `PATCH /stores/:id/settings` - Atualizar configurações

### Customers
- `GET /customers/:id` - Buscar cliente
- `POST /customers` - Criar cliente
- `PATCH /customers/:id` - Atualizar cliente
- `POST /customers/:id/block` - Bloquear cliente
- `POST /customers/:id/unblock` - Desbloquear cliente

### Store Customers
- `GET /stores/:storeId/customers` - Listar clientes da loja
- `POST /stores/:storeId/customers` - Adicionar cliente à loja
- `POST /stores/:storeId/customers/:customerId/approve` - Aprovar cliente
- `POST /stores/:storeId/customers/:customerId/block` - Bloquear cliente

### Categories
- `GET /stores/:storeId/categories` - Listar categorias
- `POST /stores/:storeId/categories` - Criar categoria
- `GET /stores/:storeId/categories/:id` - Buscar categoria
- `PATCH /stores/:storeId/categories/:id` - Atualizar categoria
- `POST /stores/:storeId/categories/:id/activate` - Ativar
- `POST /stores/:storeId/categories/:id/deactivate` - Desativar

### Products
- `GET /stores/:storeId/products` - Listar produtos
- `POST /stores/:storeId/products` - Criar produto
- `GET /stores/:storeId/products/:id` - Buscar produto
- `PATCH /stores/:storeId/products/:id` - Atualizar produto
- `POST /stores/:storeId/products/:id/activate` - Ativar
- `POST /stores/:storeId/products/:id/deactivate` - Desativar

### Catalog
- `GET /stores/:storeId/catalog` - Catálogo público (com filtros e paginação)

### Cart
- `GET /stores/:storeId/cart` - Obter carrinho
- `POST /stores/:storeId/cart/items` - Adicionar item
- `PATCH /stores/:storeId/cart/items/:itemId` - Atualizar item
- `DELETE /stores/:storeId/cart/items/:itemId` - Remover item
- `DELETE /stores/:storeId/cart` - Limpar carrinho

### Orders
- `POST /orders` - Criar pedido do carrinho
- `GET /orders` - Listar pedidos
- `GET /orders/:id` - Buscar pedido
- `PATCH /orders/:id/status` - Atualizar status
- `POST /orders/:id/cancel` - Cancelar pedido
- `GET /orders/:id/possible-states` - Estados possíveis

### Webhooks
- `POST /webhooks/evolution` - Webhook da Evolution API

## Códigos de Erro

| Código | HTTP | Descrição |
|--------|------|-----------|
| VALIDATION_ERROR | 400 | Erro de validação |
| STORE_NOT_FOUND | 404 | Loja não encontrada |
| CUSTOMER_NOT_FOUND | 404 | Cliente não encontrado |
| PRODUCT_NOT_FOUND | 404 | Produto não encontrado |
| CUSTOMER_NOT_AUTHORIZED | 403 | Cliente não autorizado |
| STORE_INACTIVE | 403 | Loja inativa |
| OUT_OF_STOCK | 422 | Sem estoque |
| INVALID_STATE_TRANSITION | 422 | Transição inválida |

## Paginação

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## Filtros Comuns

- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 20, max: 100)
- `search`: Termo de busca
- `status`: Filtro por status
- `active`: true/false
- `category`: ID da categoria
