# ECMS6 - Arquitetura do Sistema

## Visão Geral

ECMS6 é uma plataforma comercial multi-loja integrada ao WhatsApp via Evolution API. O sistema foi projetado com arquitetura modular, escalável e segura para suportar múltiplas lojas independentes operando através do WhatsApp.

## Stack Tecnológico

### Backend
- **Runtime**: Node.js LTS (>=20.0.0)
- **Linguagem**: TypeScript (strict mode)
- **Framework**: Express.js
- **ORM**: Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Cache/Sessões**: Redis
- **Validação**: Zod
- **Logging**: Pino

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Deploy**: Railway
- **CI/CD**: GitHub Actions (futuro)

### Desenvolvimento
- **Testes**: Vitest
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript

## Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                         HTTP Layer                          │
│  (Express Routes, Middleware, CORS, Rate Limiting, Helmet)  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Controllers Layer                      │
│         (Request/Response Transformation, Validation)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Services Layer (Business Logic)          │
│  (Store, Customer, Product, Cart, Order, Payment, Promotion)│
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Repositories Layer                        │
│              (Data Access Abstraction, Prisma)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                          │
│                  (PostgreSQL + Redis Cache)                 │
└─────────────────────────────────────────────────────────────┘
```

## Estrutura de Diretórios

```
ecms6/
├── src/
│   ├── app.ts                 # Configuração da aplicação Express
│   ├── server.ts              # Entry point do servidor
│   │
│   ├── config/                # Configurações da aplicação
│   │   ├── env.ts             # Validação de variáveis de ambiente
│   │   ├── database.ts        # Conexão PostgreSQL
│   │   └── redis.ts           # Conexão Redis
│   │
│   ├── routes/                # Definição de rotas HTTP
│   │   ├── index.ts           # Router principal
│   │   ├── health.routes.ts   # Health checks
│   │   ├── webhook.routes.ts  # Webhooks Evolution API
│   │   ├── store.routes.ts    # Rotas de lojas
│   │   ├── customer.routes.ts # Rotas de clientes
│   │   ├── product.routes.ts  # Rotas de produtos
│   │   ├── order.routes.ts    # Rotas de pedidos
│   │   └── ...
│   │
│   ├── controllers/           # Controladores HTTP
│   │   ├── store.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── order.controller.ts
│   │   └── ...
│   │
│   ├── services/              # Regras de negócio
│   │   ├── store/
│   │   ├── customer/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── delivery/
│   │   └── checkout/
│   │
│   ├── repositories/          # Acesso a dados
│   │   ├── store.repository.ts
│   │   ├── customer.repository.ts
│   │   ├── order.repository.ts
│   │   └── ...
│   │
│   ├── validators/            # Schemas Zod
│   │   ├── store.validator.ts
│   │   ├── customer.validator.ts
│   │   └── ...
│   │
│   ├── middleware/            # Middleware Express
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── integrations/          # Integrações externas
│   │   └── evolution/
│   │       └── evolution.client.ts
│   │
│   ├── types/                 # Tipos TypeScript
│   │   ├── store.types.ts
│   │   ├── customer.types.ts
│   │   └── ...
│   │
│   ├── domain/                # Entidades de domínio
│   │
│   ├── jobs/                  # Background jobs
│   │
│   └── utils/                 # Utilitários
│       ├── logger.ts
│       └── phone.ts
│
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrations do Prisma
│
├── tests/
│   ├── unit/                  # Testes unitários
│   └── integration/           # Testes de integração
│
├── docs/                      # Documentação
│ ├── docker/                  # Configurações Docker
│ ├── scripts/                 # Scripts utilitários
│ │
├── Dockerfile                 # Container da aplicação
├── docker-compose.yml         # Orquestração local
├── .env.example               # Template de variáveis de ambiente
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── eslint.config.js           # Configuração ESLint
├── prettier.config.js         # Configuração Prettier
├── railway.toml               # Configuração Railway
└── README.md                  # Documentação principal
```

## Princípios de Design

### 1. Multi-Tenancy
Cada loja é um tenant isolado. Todas as entidades comerciais possuem `storeId` para garantir isolamento de dados.

### 2. Separação de Responsabilidades
- **Controllers**: Transformação HTTP ↔ Domain
- **Services**: Regras de negócio puras
- **Repositories**: Acesso a dados
- **Validators**: Validação de entrada

### 3. Segurança por Padrão
- Validação de todas as entradas com Zod
- Headers de segurança com Helmet
- Rate limiting configurável
- Logs sem dados sensíveis
- Multi-tenancy enforced em todas as queries

### 4. Observabilidade
- Logging estruturado com Pino
- Health checks detalhados
- Auditoria de operações críticas

### 5. Escalabilidade
- Stateless application (Redis para sessões)
- Cache estratégico
- Transações otimizadas
- Índices apropriados

## Fluxo de Requisição

```
Cliente → Express → Middleware → Controller → Service → Repository → Database
              ↓                                              ↓
         Logging                                       Cache (Redis)
              ↓
         Response ← Serializer ← Controller ← Service ← Repository
```

## Integração com Evolution API

```
WhatsApp Client ↔ Evolution API ↔ ECMS6 Webhook
                                      ↓
                              WebhookController (validação)
                                      ↓
                              Store Resolver
                                      ↓
                              Customer Resolver
                                      ↓
                              ConversationService (Fase 7)
                                      ↓
                              Bot Engine (Fase 7)
                                      ↓
                              Order/Commerce Services
                                      ↓
                              EvolutionClient (respostas)
```

### Componentes Implementados

**EvolutionClient** (`src/integrations/evolution/evolution.client.ts`):
- `getInstances()` - Listar instâncias
- `getConnectionState()` - Verificar status da conexão
- `sendText()` - Enviar mensagens de texto
- `sendMedia()` - Enviar imagens/mídia
- `setWebhook()` - Configurar webhook
- `createInstance()` - Criar nova instância
- `deleteInstance()` - Remover instância
- `logout()` - Desconectar instância

**Webhook Endpoint** (`src/routes/webhook.routes.ts`):
- `POST /api/v1/webhooks/evolution`
- Validação de payload com Zod
- Logging estruturado
- Idempotência (pendente implementação completa)

## Modelo de Dados Principal

### Core Entities
- **Store**: Tenant multi-loja
- **StoreSettings**: Configurações por loja
- **Customer**: Cliente global
- **StoreCustomer**: Relacionamento cliente-loja

### Commerce Entities
- **ProductCategory**: Categorias de produtos
- **Product**: Produtos
- **ProductVariant**: Variantes de produtos
- **Cart**: Carrinho de compras
- **CartItem**: Itens do carrinho

### Order Entities
- **Order**: Pedido
- **OrderItem**: Itens do pedido
- **Payment**: Pagamentos
- **Delivery**: Entrega

### Admin Entities
- **AdminUser**: Usuários administrativos
- **AuditLog**: Log de auditoria

### Integration Entities
- **WebhookEvent**: Eventos de webhook
- **ConversationState**: Estado da conversa

## Próximas Evoluções

1. **Bot Engine**: Motor de conversação determinístico
2. **AI Integration**: Assistente inteligente opcional
3. **Analytics**: Relatórios e dashboards
4. **Admin Panel**: Painel administrativo frontend

## Links Relacionados

- [Database Schema](../database/schema.md)
- [API Reference](../api/README.md)
- [Security Guidelines](../security/guidelines.md)
- [Deployment Guide](../deployment/railway.md)
