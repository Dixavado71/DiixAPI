# ECMS6 - E-Commerce Management System 6

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-purple)](https://www.prisma.io/)
[![Progress](https://img.shields.io/badge/Progress-70%25-yellow)]()

Sistema completo de e-commerce multi-loja integrado com WhatsApp, desenvolvido em TypeScript/Node.js.

## 🚀 Status do Projeto

**Progresso: 70% (7/10 fases concluídas)**

### ✅ Fases Concluídas

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Infraestrutura Base | ✅ Concluída |
| 2 | Multi-Loja + Clientes + Autorização | ✅ Concluída |
| 3 | Produtos + Categorias + Catálogo + Carrinho | ✅ Concluída |
| 4 | Pedidos + Checkout + Máquina de Estados | ✅ Concluída |
| 5 | Promoções (sistema completo) | ✅ Concluída |
| 6 | Integração Evolution API | ✅ Concluída |
| 7 | Bot Engine + Conversação | ✅ Concluída |

### 🔜 Próximas Fases

| Fase | Descrição | Prioridade |
|------|-----------|------------|
| 8 | Admin Auth + RBAC + Audit | Alta |
| 9 | Testes Completos | Média |
| 10 | Docker + Railway Final | Média |

## 📋 Funcionalidades

### Core E-Commerce
- ✅ **Multi-tenant**: Suporte a múltiplas lojas independentes
- ✅ **Catálogo de Produtos**: Gestão completa com categorias
- ✅ **Carrinho de Compras**: Adição, remoção e atualização de itens
- ✅ **Checkout**: Fluxo completo de compra
- ✅ **Pedidos**: Sistema com máquina de estados para tracking
- ✅ **Promoções**: Regras de desconto flexíveis

### Integração WhatsApp
- ✅ **Evolution API**: Conexão com WhatsApp Business
- ✅ **Webhooks**: Processamento de eventos em tempo real
- ✅ **Bot Engine**: Conversação automática baseada em estados
- ✅ **Criação Automática de Clientes**: Onboarding via WhatsApp

### Bot Engine
- ✅ **10 Estados de Conversação**: Do catálogo ao suporte
- ✅ **Mensagens Interativas**: Botões, listas, imagens
- ✅ **Contexto Persistente**: Continuidade nas conversas
- ✅ **Comandos Inteligentes**: Reconhecimento natural

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  Express Router + Middleware + Validation (Zod)             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────┐
│  Controllers  │   │    Services     │   │   Webhook     │
│  (REST API)   │   │  (Business Log) │   │   Handler     │
└───────────────┘   └─────────────────┘   └───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Repositories    │
                    │   (Prisma ORM)    │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL DB   │
                    └───────────────────┘
```

## 🛠️ Tecnologias

- **Runtime:** Node.js 20+
- **Linguagem:** TypeScript 5+
- **Framework:** Express.js
- **ORM:** Prisma 5+
- **Banco de Dados:** PostgreSQL
- **Validação:** Zod
- **Testes:** Jest
- **Messaging:** Evolution API (WhatsApp)

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/ecms6.git
cd ecms6

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [API Reference](docs/api/README.md) | Documentação completa da API REST |
| [Arquitetura](docs/architecture/overview.md) | Visão geral da arquitetura |
| [Bot Engine](docs/bot/README.md) | Sistema de conversação |
| [Evolution API](docs/integrations/evolution.md) | Integração WhatsApp |
| [Roadmap](docs/development/todo.md) | Status e próximas fases |

## 🔌 Endpoints Principais

### Stores
```
GET    /api/stores              # Listar lojas
POST   /api/stores              # Criar loja
GET    /api/stores/:id          # Obter loja
PUT    /api/stores/:id          # Atualizar loja
DELETE /api/stores/:id          # Deletar loja
```

### Products
```
GET    /api/stores/:storeId/products     # Listar produtos
POST   /api/stores/:storeId/products     # Criar produto
GET    /api/products/:id                 # Obter produto
PUT    /api/products/:id                 # Atualizar produto
DELETE /api/products/:id                 # Deletar produto
```

### Orders
```
GET    /api/stores/:storeId/orders       # Listar pedidos
POST   /api/orders                       # Criar pedido
GET    /api/orders/:id                   # Obter pedido
PUT    /api/orders/:id/status            # Atualizar status
```

### Bot
```
POST   /api/bot/:customerId/:storeId/message  # Enviar mensagem
POST   /api/bot/:customerId/:storeId/reset    # Resetar contexto
POST   /api/bot/:customerId/:storeId/end      # Finalizar conversa
GET    /api/bot/:customerId/:storeId/context  # Obter contexto
```

### Webhook
```
POST   /api/webhook/evolution      # Receber eventos WhatsApp
GET    /api/webhook/health         # Health check
```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar com coverage
npm run test:coverage

# Executar testes específicos
npm test -- bot-engine
```

## 📊 Métricas do Projeto

| Componente | Quantidade |
|------------|-----------|
| Endpoints | ~55 |
| Services | 18 |
| Controllers | 12 |
| Models Prisma | 15+ |
| Testes Unitários | 45+ |

## 🔐 Variáveis de Ambiente

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecms6"

# Evolution API
EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="your-api-key"

# JWT
JWT_SECRET="your-secret-key"
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Issues:** GitHub Issues
- **Email:** suporte@ecms6.com
- **Documentação:** [docs/](docs/)

---

**ECMS6** - Construindo o futuro do e-commerce com WhatsApp 🚀
