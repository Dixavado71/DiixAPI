# ECMS6 - Guia de Multi-Tenancy

## Visão Geral

ECMS6 é uma plataforma multi-loja onde cada loja (tenant) opera de forma isolada, compartilhando a mesma infraestrutura mas com dados completamente separados.

## Princípios Fundamentais

### 1. Isolamento por storeId
TODA entidade comercial possui `storeId`:
- Products
- Categories
- Carts
- Orders
- Customers (via StoreCustomer)
- Promotions
- Deliveries

### 2. Validação Cruzada
Sempre validar que a entidade pertence à loja correta:
```typescript
const product = await prisma.product.findFirst({
  where: {
    id: productId,
    storeId: storeId // Crucial!
  }
});
```

### 3. Índices Estratégicos
Índices compostos para performance e isolamento:
```prisma
@@index([storeId, active])
@@index([storeId, status])
@@unique([storeId, slug])
```

## Implementação

### Repository Pattern
```typescript
class ProductRepository {
  async findByStore(storeId: string, filters: Filters) {
    return this.prisma.product.findMany({
      where: {
        storeId, // Sempre filtrar por store
        ...filters
      }
    });
  }
  
  async findById(storeId: string, id: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
        storeId // Validar pertencimento
      }
    });
  }
}
```

### Service Layer
```typescript
class OrderService {
  async create(data: CreateOrderDTO) {
    // 1. Validar loja
    const store = await this.storeRepository.findById(data.storeId);
    
    // 2. Validar configurações da loja
    const settings = await this.settingsRepository.findByStore(data.storeId);
    if (!settings.commerceEnabled) {
      throw new Error('COMMERCE_DISABLED');
    }
    
    // 3. Validar autorização do cliente
    const authorized = await this.authorizationService.isAllowed({
      storeId: data.storeId,
      customerId: data.customerId
    });
    
    // 4. Criar pedido COM storeId
    return this.orderRepository.create({
      ...data,
      storeId: store.id
    });
  }
}
```

## Cenários Comuns

### ✅ Correto: Buscar produtos da loja
```typescript
const products = await prisma.product.findMany({
  where: {
    storeId: 'loja-a',
    active: true
  }
});
```

### ❌ Errado: Buscar sem filtro de loja
```typescript
// NUNCA faça isso!
const products = await prisma.product.findMany({
  where: { active: true }
});
```

### ✅ Correto: Adicionar item ao carrinho
```typescript
async function addToCart(storeId: string, cartId: string, productId: string) {
  // Validar que produto pertence à loja
  const product = await prisma.product.findFirst({
    where: { id: productId, storeId }
  });
  
  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND_OR_NOT_IN_STORE');
  }
  
  // Validar que carrinho pertence à loja
  const cart = await prisma.cart.findFirst({
    where: { id: cartId, storeId }
  });
  
  if (!cart) {
    throw new Error('CART_NOT_FOUND_OR_NOT_IN_STORE');
  }
  
  // Adicionar item
  return prisma.cartItem.create({
    data: { cartId, productId, quantity: 1 }
  });
}
```

## Constraints de Banco

### Unique por Loja
```prisma
model Product {
  storeId String
  sku     String?
  
  @@unique([storeId, sku]) // SKU único dentro da loja
}
```

### Foreign Keys
```prisma
model Product {
  storeId    String
  store      Store @relation(fields: [storeId], references: [id])
  categoryId String?
  category   ProductCategory? @relation(fields: [categoryId], references: [id])
  
  // Validação implícita: category deve existir
}
```

## Testes de Multi-Tenancy

### Teste Unitário
```typescript
test('não deve permitir acesso a produto de outra loja', async () => {
  const storeA = await createTestStore('loja-a');
  const storeB = await createTestStore('loja-b');
  const productA = await createProduct(storeA.id);
  
  // Tentar acessar produto da loja A usando contexto da loja B
  const result = await productService.findById(storeB.id, productA.id);
  
  expect(result).toBeNull();
});
```

### Teste de Integração
```typescript
test('catálogo deve retornar apenas produtos da loja', async () => {
  const storeA = await createTestStore('loja-a');
  const storeB = await createTestStore('loja-b');
  
  await createProduct(storeA.id, { name: 'Produto A' });
  await createProduct(storeB.id, { name: 'Produto B' });
  
  const catalogA = await catalogService.getCatalog(storeA.id);
  
  expect(catalogA.products).toHaveLength(1);
  expect(catalogA.products[0].name).toBe('Produto A');
});
```

## Segurança

### Validação em Cascata
```typescript
async function validateOrderItems(storeId: string, items: OrderItem[]) {
  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
        storeId // ← Crucial!
      }
    });
    
    if (!product) {
      throw new AppError({
        code: 'PRODUCT_NOT_IN_STORE',
        message: `Produto ${item.productId} não pertence à loja`
      });
    }
    
    if (!product.active) {
      throw new AppError({
        code: 'PRODUCT_INACTIVE',
        message: `Produto ${product.name} está inativo`
      });
    }
  }
}
```

### Logs Seguros
```typescript
logger.info({
  event: 'order_created',
  storeId: order.storeId, // Loggar ID, não dados sensíveis
  orderId: order.id,
  customerId: order.customerId
});
```

## Performance

### Índices Recomendados
```prisma
model Order {
  storeId    String
  customerId String
  status     OrderStatus
  
  @@index([storeId])
  @@index([storeId, status])
  @@index([customerId])
}
```

### Query Optimization
```typescript
// Bom: Usa índice composto
const orders = await prisma.order.findMany({
  where: {
    storeId,
    status: 'PENDING'
  },
  orderBy: { createdAt: 'desc' },
  take: 20
});

// Ruim: Full table scan
const orders = await prisma.order.findMany({
  where: {
    status: 'PENDING'
  }
});
```

## Checklist de Implementação

Ao criar nova feature:

- [ ] Adicionar `storeId` na entidade
- [ ] Criar índice em `storeId`
- [ ] Validar `storeId` em todas as queries
- [ ] Testar isolamento entre lojas
- [ ] Documentar restrições específicas

## Anti-Patterns

### ❌ Nunca fazer:
```typescript
// Busca global sem filtro de loja
const allProducts = await prisma.product.findMany();

// Usar primeiro resultado sem validar storeId
const product = await prisma.product.findUnique({ where: { id } });
if (product) { /* usa produto */ }

// Confiar no clientId enviado pelo usuário
const cart = await prisma.cart.findUnique({
  where: { id: req.body.cartId }
});
```

### ✅ Sempre fazer:
```typescript
// Filtrar por storeId
const products = await prisma.product.findMany({
  where: { storeId, active: true }
});

// Validar pertencimento
const product = await prisma.product.findFirst({
  where: { id, storeId }
});

// Obter storeId do contexto autenticado
const cart = await prisma.cart.findFirst({
  where: { 
    id: cartId,
    storeId: authenticatedUser.storeId
  }
});
```
