# ECMS6 - Plataforma Comercial Multi-Loja para WhatsApp

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-blue)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6+-red)](https://redis.io/)

Plataforma comercial multi-loja integrada ao WhatsApp via Evolution API para automação de vendas, atendimento e gestão de pedidos.

## 🎯 Visão Geral

ECMS6 permite que múltiplas lojas operem independentemente através do WhatsApp, com:

- ✅ **Multi-Tenancy**: Cada loja com dados isolados e configurações próprias
- ✅ **Catálogo de Produtos**: Gestão completa de produtos, categorias e variantes
- ✅ **Carrinho de Compras**: Carrinho persistente por cliente e loja
- ✅ **Pedidos**: Fluxo completo com máquina de estados
- ✅ **Pagamentos**: Suporte a PIX, cartão, dinheiro e pagamento na entrega
- ✅ **Entregas**: Múltiplos métodos de entrega configuráveis
- ✅ **Clientes**: Cadastro, aprovação e bloqueio por loja
- ✅ **WhatsApp Integration**: Atendimento automático via Evolution API

## 📚 Documentação Completa

A documentação detalhada está em [`docs/`](./docs/):

| Seção | Descrição |
|-------|-----------|
| [📐 Arquitetura](./docs/architecture/overview.md) | Stack, estrutura, princípios de design |
| [💾 Database](./docs/database/schema.md) | Schema completo, models, enums, índices |
| [🔌 API Reference](./docs/api/README.md) | Endpoints, autenticação, erros |
| [🔒 Segurança](./docs/security/guidelines.md) | Validação, autorização, LGPD |
| [🚀 Deploy Railway](./docs/deployment/railway.md) | Guia completo de deploy |
| [🔄 Webhooks](./docs/webhooks/evolution.md) | Integração com Evolution API |
| [🛠️ Multi-Tenancy](./docs/development/multi-tenancy.md) | Isolamento de lojas, validações |
| [📋 TODO/Roadmap](./docs/development/todo.md) | Fases concluídas e pendentes |

## 🚀 Quick Start

### Pré-requisitos

- Node.js >= 20
- Docker + Docker Compose
- PostgreSQL 14+
- Redis 6+

### Instalação Local

```bash
# 1. Clonar repositório
git clone <repository-url>
cd ecms6

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Subir banco de dados e Redis
docker compose up -d

# 5. Rodar migrations
npx prisma migrate dev

# 6. Gerar Prisma Client
npx prisma generate

# 7. Iniciar servidor em desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`.

### Health Checks

```bash
# Status do serviço
curl http://localhost:3000/api/v1/health

# Verifica PostgreSQL e Redis
curl http://localhost:3000/api/v1/health/ready
```

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Layer (Express)                     │
│         (Routes, Middleware, CORS, Rate Limiting)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 Controllers (Request/Response)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Services (Business Logic Core)                 │
│     (Store, Customer, Product, Cart, Order, Payment)        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            Repositories (Data Access with Prisma)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL + Redis Cache                     │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
ecms6/
├── src/
│   ├── app.ts                 # Configuração Express
│   ├── server.ts              # Entry point
│   ├── config/                # Configurações (env, database, redis)
│   ├── routes/                # Rotas da API
│   ├── controllers/           # Controladores HTTP
│   ├── services/              # Regras de negócio
│   ├── repositories/          # Acesso a dados
│   ├── validators/            # Schemas Zod
│   ├── middleware/            # Middleware Express
│   ├── integrations/          # Evolution API client
│   ├── types/                 # Tipos TypeScript
│   └── utils/                 # Utilitários
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── migrations/            # Migrations
├── tests/
│   ├── unit/                  # Testes unitários
│   └── integration/           # Testes de integração
├── docs/                      # Documentação completa
├── docker/                    # Configurações Docker
├── Dockerfile
├── docker-compose.yml
├── railway.toml
└── package.json
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar em modo desenvolvimento
npm run build            # Compilar TypeScript
npm run start            # Iniciar em produção

# Qualidade de código
npm run lint             # Executar ESLint
npm run lint:fix         # Corrigir problemas ESLint
npm run format           # Formatrar com Prettier
npm run format:check     # Verificar formatação

# Banco de dados
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Criar/executar migrations
npm run prisma:studio    # Abrir Prisma Studio

# Testes
npm test                 # Executar testes
npm run test:watch       # Testes em watch mode
npm run test:coverage    # Testes com coverage

# Docker
npm run docker:up        # Subir containers
npm run docker:down      # Derrubar containers
npm run docker:logs      # Ver logs dos containers
```

## 🌍 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/ecms6

# Redis
REDIS_URL=redis://localhost:6379

# Evolution API
EVOLUTION_API_URL=https://evolution-api-production-8490.up.railway.app
EVOLUTION_API_KEY=sua_chave_aqui
EVOLUTION_WEBHOOK_SECRET=seu_secret_aqui

# Segurança
JWT_SECRET=gerar_aleatorio_seguro

# Logs
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## 🚢 Deploy no Railway

1. Conecte seu repositório GitHub ao Railway
2. Adicione serviços: PostgreSQL + Redis
3. Configure variáveis de ambiente
4. Deploy automático em cada push

Veja o guia completo em [docs/deployment/railway.md](./docs/deployment/railway.md)

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes específicos
npx vitest tests/unit/services/store.service.test.ts

# Coverage
npm run test:coverage
```

## 📊 Status das Fases

| Fase | Status | Descrição |
|------|--------|-----------|
| 1 | ✅ | Infraestrutura base (Node, TS, Express, Prisma, Docker) |
| 2 | ✅ | Multi-loja + Clientes + Autorização |
| 3 | ✅ | Produtos + Categorias + Catálogo + Carrinho |
| 4 | ✅ | Pedidos + Checkout + Máquina de Estados |
| 5 | ⏳ | Promoções |
| 6 | ⏳ | Integração Evolution API completa |
| 7 | ⏳ | Bot Engine + Conversação |
| 8 | ⏳ | Admin Auth + RBAC + Audit |
| 9 | ⏳ | Testes completos |
| 10 | ⏳ | Docker + Railway final |

## 🔐 Segurança

- Validação de todas as entradas com Zod
- Headers de segurança com Helmet
- Rate limiting configurável
- Logs sem dados sensíveis
- Multi-tenancy enforced em todas as queries
- Idempotência em webhooks e operações críticas

Veja mais em [docs/security/guidelines.md](./docs/security/guidelines.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação](./docs/)
2. Verifique os logs da aplicação
3. Execute os testes para identificar problemas

## 🙏 Agradecimentos

- [Prisma](https://prisma.io/) - ORM type-safe
- [Evolution API](https://github.com/EvolutionAPI) - Integração WhatsApp
- [Express](https://expressjs.com/) - Framework web
- [Zod](https://zod.dev/) - Validação de schemas

---

**ECMS6** - Plataforma comercial multi-loja para WhatsApp 🚀
