# ECMS6 - Documentação Completa

Bem-vindo à documentação oficial do **ECMS6**, uma plataforma comercial multi-loja integrada ao WhatsApp via Evolution API.

## 📋 Índice Geral

### 📖 Documentação Principal
- [Visão Geral do Projeto](#visão-geral)
- [Status do Projeto](#status-do-projeto)
- [Começando Rápido](#começando-rápido)
- [Estrutura da Documentação](#estrutura-da-documentação)

### 🏗️ Arquitetura e Design
- [Arquitetura do Sistema](./architecture/overview.md)
- [Modelo de Dados (Schema)](./database/schema.md)
- [Guia de Multi-Tenancy](./development/multi-tenancy.md)

### 🔌 API e Integrações
- [Referência Completa da API](./api/README.md)
- [Integração Evolution API](./integrations/evolution.md)
- [Webhooks](./webhooks/evolution.md)
- [Bot Engine](./bot/README.md)

### 🔒 Segurança
- [Diretrizes de Segurança](./security/guidelines.md)
- **[Política de Segurança Avançada](./security/security-policy.md)** ⭐ NOVO
- **[Checklist de Segurança](./security/security-checklist.md)** ⭐ NOVO

### 🚀 Deploy e Operação
- [Deploy no Railway](./deployment/railway.md)
- **[Guia Docker Completo](./deployment/docker.md)** ⭐ NOVO
- **[Monitoramento e Logs](./deployment/monitoring.md)** ⭐ NOVO
- **[Variáveis de Ambiente](./deployment/environment-variables.md)** ⭐ NOVO

### 🛠️ Desenvolvimento
- [Guia do Desenvolvedor](./development/developer-guide.md) ⭐ NOVO
- [Multi-Tenancy](./development/multi-tenancy.md)
- **[Padrões de Código](./development/coding-standards.md)** ⭐ NOVO
- **[Roadmap e Evolução](./development/roadmap.md)** ⭐ NOVO

### 🧪 Testes e Qualidade
- [Guia de Testes](./testing/README.md)
- **[Testes de Integração](./testing/integration-tests.md)** ⭐ NOVO

### 📚 Recursos Adicionais
- [Glossário](./resources/glossary.md) ⭐ NOVO
- [FAQ e Troubleshooting](./resources/faq.md) ⭐ NOVO
- [Contribuição](./resources/contributing.md) ⭐ NOVO

---

## Visão Geral

O **ECMS6** é uma plataforma SaaS multi-loja que permite que múltiplas lojas operem seus e-commerces através do WhatsApp, utilizando a Evolution API para comunicação.

### Principais Características

| Recurso | Descrição |
|---------|-----------|
| 🏪 **Multi-Tenancy** | Múltiplas lojas isoladas na mesma infraestrutura |
| 💬 **WhatsApp Integration** | Pedidos e atendimento via WhatsApp |
| 🛒 **E-commerce Completo** | Catálogo, carrinho, checkout e pedidos |
| 🎁 **Promoções** | Sistema avançado de promoções e descontos |
| 🤖 **Bot Engine** | Conversação automatizada inteligente |
| 🔒 **Segurança** | Validação, autorização e auditoria completas |
| 📊 **Admin Dashboard** | Painel administrativo React |

### Stack Tecnológico

**Backend:**
- Node.js 20+ com TypeScript
- Express.js (API RESTful)
- Prisma ORM + PostgreSQL
- Redis (cache e sessões)
- Zod (validação)
- Pino (logging)

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS
- Context API (estado)

**Infraestrutura:**
- Docker + Docker Compose
- Railway (deploy)
- GitHub Actions (CI/CD)

---

## Status do Projeto

### ✅ Fases Concluídas

| Fase | Componente | Status | Descrição |
|------|------------|--------|-----------|
| 1 | Infraestrutura Base | ✅ 100% | Node, TS, Express, Prisma, Docker |
| 2 | Multi-Tenancy | ✅ 100% | Isolamento de lojas e clientes |
| 3 | Catálogo de Produtos | ✅ 100% | Produtos, categorias, variantes |
| 4 | Carrinho e Checkout | ✅ 100% | Carrinho, pedidos, máquina de estados |
| 5 | Promoções | ✅ 100% | Sistema completo de promoções |
| 6 | Webhook Evolution | ✅ 100% | Recebimento e processamento de mensagens |
| 7 | Frontend Admin | ✅ 100% | Dashboard React funcional |
| 8 | Deploy Produção | ✅ 100% | Railway configurado e testado |

### 🔄 Em Desenvolvimento

| Fase | Componente | Progresso | Descrição |
|------|------------|-----------|-----------|
| 9 | Bot Engine | 🔄 70% | Motor de conversação |
| 10 | Admin Auth | 🔄 60% | Autenticação e RBAC |
| 11 | Testes E2E | 🔄 50% | Testes end-to-end |
| 12 | Analytics | 📋 0% | Relatórios e dashboards |

---

## Começando Rápido

### Pré-requisitos

- Node.js >= 20.0.0
- npm ou pnpm
- Docker e Docker Compose
- Git

### Instalação Local (5 minutos)

```bash
# 1. Clonar repositório
git clone <repository-url>
cd ecms6

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Edite .env com suas configurações

# 4. Subir banco de dados e Redis
docker compose up -d postgres redis

# 5. Rodar migrations
npx prisma migrate dev

# 6. Gerar Prisma Client
npx prisma generate

# 7. Iniciar servidor (backend + frontend)
npm run dev
```

### Acesso

- **API:** http://localhost:3000/api/v1
- **Frontend:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/v1/health

---

## Estrutura da Documentação

### Para Desenvolvedores

1. **[Arquitetura](./architecture/overview.md)** - Entenda o design do sistema
2. **[Guia do Desenvolvedor](./development/developer-guide.md)** - Setup e workflow
3. **[Padrões de Código](./development/coding-standards.md)** - Best practices
4. **[API Reference](./api/README.md)** - Todos os endpoints
5. **[Testes](./testing/README.md)** - Como testar

### Para Operadores

1. **[Deploy no Railway](./deployment/railway.md)** - Deploy passo a passo
2. **[Guia Docker](./deployment/docker.md)** - Containerização
3. **[Variáveis de Ambiente](./deployment/environment-variables.md)** - Configuração
4. **[Monitoramento](./deployment/monitoring.md)** - Logs e métricas

### Para Segurança

1. **[Diretrizes de Segurança](./security/guidelines.md)** - Princípios fundamentais
2. **[Política de Segurança](./security/security-policy.md)** - Políticas detalhadas
3. **[Checklist de Segurança](./security/security-checklist.md)** - Verificação

---

## Links Rápidos

| Categoria | Links |
|-----------|-------|
| **Código** | [README Principal](../README.md), [Schema Prisma](../prisma/schema.prisma) |
| **Config** | [.env.example](../.env.example), [Dockerfile](../Dockerfile), [docker-compose.yml](../docker-compose.yml) |
| **CI/CD** | [GitHub Actions](../.github/workflows/ci.yml) |

---

## Suporte e Contribuição

### Precisa de Ajuda?

1. Consulte a documentação específica
2. Verifique o [FAQ](./resources/faq.md)
3. Analise os logs da aplicação
4. Execute testes para isolar o problema

### Quer Contribuir?

1. Leia o [Guia de Contribuição](./resources/contributing.md)
2. Siga os [Padrões de Código](./development/coding-standards.md)
3. Adicione testes para novas features
4. Atualize a documentação relevante

---

## Licença

MIT License - veja [LICENSE](../LICENSE) para detalhes.

---

**Última atualização:** Janeiro 2025  
**Versão da Documentação:** 1.0.0
