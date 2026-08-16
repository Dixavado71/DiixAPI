# ECMS6 - Schema do Banco de Dados

## Visão Geral

O ECMS6 utiliza PostgreSQL como banco de dados principal, gerenciado através do Prisma ORM. O schema foi projetado para suportar multi-tenancy, integridade referencial e performance em operações comerciais.

## Princípios de Design

### 1. Identificadores
- **Tipo**: `cuid()` (globally unique, index-friendly)
- **Vantagens**: Melhor distribuição que UUID, mais seguro que auto-increment

### 2. Timestamps
- Todas as entidades possuem `createdAt` e `updatedAt`
- Padrão: `@default(now())` e `@updatedAt`

### 3. Relacionamentos
- Foreign keys explícitas
- Cascade delete apenas quando seguro
- Índices em todas as chaves estrangeiras

### 4. Enums
- Status e tipos definidos como enums Prisma
- Validação no banco de dados

### 5. Decimal para Valores Financeiros
- Nunca usar `Float` para preços
- Precision: `Decimal(10, 2)`

## Entidades Principais

### Core Entities

#### Store
Representa um tenant (loja) no sistema multi-loja.

```prisma
model Store {
  id                  String      @id @default(cuid())
  name                String
  slug                String      @unique
  description         String?
  phone               String?
  status              StoreStatus @default(ACTIVE)
  timezone            String      @default("America/Sao_Paulo")
  currency            String      @default("BRL")
  evolutionInstanceId String?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  // Relacionamentos
  settings       StoreSettings?
  storeCustomers StoreCustomer[]
  products       Product[]
  categories     ProductCategory[]
  carts          Cart[]
  orders         Order[]
  deliveries     Delivery[]
  promotions     Promotion[]

  @@index([slug])
  @@index([status])
}
```

**Índices:**
- `slug`: Busca por URL amigável
- `status`: Filtro por status da loja

#### StoreSettings
Configurações específicas de cada loja.

```prisma
model StoreSettings {
  id      String @id @default(cuid())
  storeId String @unique
  store   Store  @relation(fields: [storeId], references: [id], onDelete: Cascade)

  // Commerce
  commerceEnabled              Boolean @default(true)
  customerRegistrationRequired Boolean @default(false)
  customerApprovalRequired     Boolean @default(false)

  // Delivery
  deliveryEnabled Boolean @default(true)
  pickupEnabled   Boolean @default(false)

  // Payment
  pixEnabled               Boolean @default(true)
  cashEnabled              Boolean @default(true)
  cardEnabled              Boolean @default(true)
  paymentOnDeliveryEnabled Boolean @default(true)

  // Bot
  botEnabled     Boolean @default(true)
  supportEnabled Boolean @default(true)

  // Promotion
  promotionEnabled Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([storeId])
}
```

**Relação:** 1:1 com Store (Cascade Delete)

#### Customer
Cliente global (pode se relacionar com múltiplas lojas).

```prisma
model Customer {
  id        String         @id @default(cuid())
  name      String?
  phone     String
  email     String?
  status    CustomerStatus @default(ACTIVE)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  storeCustomers StoreCustomer[]

  @@unique([phone])
  @@index([phone])
  @@index([status])
}
```

**Constraint Única:** `phone` (normalizado)

#### StoreCustomer
Relacionamento cliente-loja com status específico.

```prisma
model StoreCustomer {
  id         String              @id @default(cuid())
  storeId    String
  store      Store               @relation(fields: [storeId], references: [id], onDelete: Cascade)
  customerId String
  customer   Customer            @relation(fields: [customerId], references: [id], onDelete: Cascade)
  status     StoreCustomerStatus @default(PENDING)
  approvedAt DateTime?
  blockedAt  DateTime?
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt

  @@unique([storeId, customerId])
  @@index([storeId, status])
  @@index([customerId])
}
```

**Constraint Única Composta:** `(storeId, customerId)`

### Product Entities

#### ProductCategory
Categorias de produtos hierárquicas.

```prisma
model ProductCategory {
  id          String            @id @default(cuid())
  storeId     String
  store       Store             @relation(fields: [storeId], references: [id], onDelete: Cascade)
  name        String
  description String?
  parentId    String?
  parent      ProductCategory?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    ProductCategory[] @relation("CategoryHierarchy")
  active      Boolean           @default(true)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  products Product[]

  @@index([storeId])
  @@index([storeId, active])
}
```

**Hierarquia:** Auto-relacionamento para categorias pai/filho

#### Product
Produtos da loja.

```prisma
model Product {
  id         String           @id @default(cuid())
  storeId    String
  store      Store            @relation(fields: [storeId], references: [id], onDelete: Cascade)
  categoryId String?
  category   ProductCategory? @relation(fields: [categoryId], references: [id])

  name        String
  description String?
  sku         String?
  price       Decimal  @db.Decimal(10, 2)
  promoPrice  Decimal? @db.Decimal(10, 2)
  stock       Int?
  active      Boolean  @default(true)
  images      String[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  variants          ProductVariant[]
  cartItems         CartItem[]
  orderItems        OrderItem[]
  promotionProducts PromotionProduct[]

  @@index([storeId])
  @@index([storeId, active])
  @@index([categoryId])
}
```

**Preços:** `Decimal(10, 2)` para precisão financeira

#### ProductVariant
Variantes de produtos (tamanho, cor, etc.).

```prisma
model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  name      String
  value     String
  price     Decimal? @db.Decimal(10, 2)
  stock     Int?

  @@index([productId])
}
```

### Cart Entities

#### Cart
Carrinho de compras.

```prisma
model Cart {
  id         String     @id @default(cuid())
  storeId    String
  store      Store      @relation(fields: [storeId], references: [id], onDelete: Cascade)
  customerId String
  status     CartStatus @default(ACTIVE)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  items CartItem[]

  @@index([storeId, customerId])
  @@index([status])
}
```

**Status:** ACTIVE, ABANDONED, CONVERTED

#### CartItem
Itens do carrinho.

```prisma
model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId])
  @@index([cartId])
}
```

**Constraint Única:** `(cartId, productId)` - Um produto por vez no carrinho

### Order Entities

#### Order
Pedidos.

```prisma
model Order {
  id              String          @id @default(cuid())
  storeId         String
  store           Store           @relation(fields: [storeId], references: [id], onDelete: Cascade)
  customerId      String
  orderNumber     String          @unique
  status          OrderStatus     @default(PENDING)
  subtotal        Decimal         @db.Decimal(10, 2)
  discount        Decimal         @default(0) @db.Decimal(10, 2)
  total           Decimal         @db.Decimal(10, 2)
  paymentMethod   PaymentMethod?
  paymentStatus   PaymentStatus   @default(PENDING)
  deliveryMethod  DeliveryMethod?
  deliveryAddress String?
  deliveryFee     Decimal         @default(0) @db.Decimal(10, 2)
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  items    OrderItem[]
  payments Payment[]
  delivery Delivery?

  @@index([storeId])
  @@index([customerId])
  @@index([status])
  @@index([orderNumber])
}
```

**Order Number:** Único globalmente para referência

#### OrderItem
Itens do pedido (snapshot de preço).

```prisma
model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity   Int
  unitPrice  Decimal  @db.Decimal(10, 2)
  totalPrice Decimal  @db.Decimal(10, 2)
  createdAt  DateTime @default(now())

  @@index([orderId])
}
```

**Snapshot:** `unitPrice` é copiado no momento do pedido

### Payment & Delivery

#### Payment
Registros de pagamento.

```prisma
model Payment {
  id            String        @id @default(cuid())
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)
  amount        Decimal       @db.Decimal(10, 2)
  transactionId String?
  metadata      Json?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([orderId])
  @@index([status])
}
```

#### Delivery
Informações de entrega.

```prisma
model Delivery {
  id             String         @id @default(cuid())
  orderId        String         @unique
  order          Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  storeId        String
  store          Store          @relation(fields: [storeId], references: [id], onDelete: Cascade)
  method         DeliveryMethod
  address        String
  recipientName  String
  recipientPhone String
  status         DeliveryStatus @default(PENDING)
  trackingInfo   String?
  deliveredAt    DateTime?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@index([orderId])
  @@index([storeId])
  @@index([status])
}
```

### Promotion Entities

#### Promotion
Promoções configuráveis.

```prisma
model Promotion {
  id          String        @id @default(cuid())
  storeId     String
  store       Store         @relation(fields: [storeId], references: [id], onDelete: Cascade)
  name        String
  description String?
  type        PromotionType
  value       Decimal       @db.Decimal(10, 2)
  minAmount   Decimal?      @db.Decimal(10, 2)
  startDate   DateTime
  endDate     DateTime
  active      Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  rules    PromotionRule[]
  products PromotionProduct[]

  @@index([storeId])
  @@index([storeId, active])
}
```

#### PromotionRule
Regras de promoção.

```prisma
model PromotionRule {
  id          String    @id @default(cuid())
  promotionId String
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  type        RuleType
  value       String
  createdAt   DateTime  @default(now())

  @@index([promotionId])
}
```

#### PromotionProduct
Produtos em promoção.

```prisma
model PromotionProduct {
  id          String    @id @default(cuid())
  promotionId String
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  productId   String
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([promotionId, productId])
}
```

### Admin & Auth

#### AdminUser
Usuários administrativos.

```prisma
model AdminUser {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  role      Role      @default(OPERATOR)
  active    Boolean   @default(true)
  lastLogin DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  auditLogs AuditLog[]

  @@index([email])
  @@index([role])
}
```

#### AuditLog
Log de auditoria.

```prisma
model AuditLog {
  id        String     @id @default(cuid())
  userId    String?
  user      AdminUser? @relation(fields: [userId], references: [id])
  action    String
  entity    String
  entityId  String?
  ipAddress String?
  metadata  Json?
  createdAt DateTime   @default(now())

  @@index([action])
  @@index([entity])
  @@index([createdAt])
}
```

### Integration Entities

#### WebhookEvent
Log de eventos webhook para idempotência.

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

  @@index([eventId])
  @@index([instance])
  @@index([eventType])
  @@index([processed])
}
```

**Idempotência:** `eventId` único previne processamento duplicado

#### ConversationState
Estado da conversa (backup do Redis).

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
  @@index([instance, phone])
  @@index([storeId])
}
```

## Enums

### StoreStatus
```prisma
enum StoreStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### CustomerStatus
```prisma
enum CustomerStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}
```

### StoreCustomerStatus
```prisma
enum StoreCustomerStatus {
  PENDING
  APPROVED
  BLOCKED
  INACTIVE
}
```

### CartStatus
```prisma
enum CartStatus {
  ACTIVE
  ABANDONED
  CONVERTED
}
```

### OrderStatus
```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  PAYMENT_PENDING
  PAID
  PREPARING
  READY
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}
```

### PaymentMethod
```prisma
enum PaymentMethod {
  PIX
  CARD
  CASH
  PAYMENT_ON_DELIVERY
  PAYMENT_LINK
}
```

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING
  IN_PROGRESS
  PAID
  FAILED
  REFUNDED
  CANCELLED
}
```

### DeliveryMethod
```prisma
enum DeliveryMethod {
  PICKUP
  STORE_DELIVERY
  COURIER
  THIRD_PARTY
}
```

### DeliveryStatus
```prisma
enum DeliveryStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  IN_TRANSIT
  DELIVERED
  FAILED
  CANCELLED
}
```

### PromotionType
```prisma
enum PromotionType {
  PERCENTAGE
  FIXED
}
```

### RuleType
```prisma
enum RuleType {
  CATEGORY
  PRODUCT
  DAY_OF_WEEK
  MIN_QUANTITY
  CUSTOMER_TYPE
}
```

### Role
```prisma
enum Role {
  SUPER_ADMIN
  STORE_OWNER
  STORE_MANAGER
  OPERATOR
}
```

## Índices Estratégicos

### Performance
- `storeId` em todas as entidades multi-loja
- `status` para filtros comuns
- `phone` para busca de clientes
- `orderNumber` para referência rápida
- `eventId` para idempotência

### Compostos
- `(storeId, customerId)` em StoreCustomer
- `(storeId, active)` em Product e Category
- `(instance, phone)` em ConversationState

## Constraints de Integridade

### Unique
- `Store.slug`
- `Customer.phone`
- `StoreSettings.storeId`
- `StoreCustomer.(storeId, customerId)`
- `CartItem.(cartId, productId)`
- `Order.orderNumber`
- `Delivery.orderId`
- `PromotionProduct.(promotionId, productId)`
- `WebhookEvent.eventId`
- `ConversationState.(instance, phone)`

### Foreign Keys
- Todas as relações com `@relation`
- `onDelete: Cascade` apenas quando seguro
- Índices automáticos em FKs

## Migrations

As migrations são gerenciadas pelo Prisma Migrate:

```bash
# Criar nova migration
npx prisma migrate dev --name descricao_da_mudanca

# Aplicar migrations em produção
npx prisma migrate deploy

# Gerar client
npx prisma generate
```

## Links Relacionados

- [Architecture Overview](../architecture/overview.md)
- [API Reference](../api/README.md)
- [Multi-Tenancy Guide](../development/multi-tenancy.md)
