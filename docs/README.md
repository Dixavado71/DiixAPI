# ECMS6 - Documentação

Bem-vindo à documentação do ECMS6, uma plataforma comercial multi-loja integrada ao WhatsApp via Evolution API.

## Estrutura da Documentação

### 📐 Arquitetura
- [Visão Geral](./architecture/overview.md) - Stack tecnológico, estrutura de diretórios, princípios de design

### 💾 Banco de Dados
- [Schema Completo](./database/schema.md) - Modelos, relacionamentos, enums, índices

### 🔌 API
- [Referência da API](./api/README.md) - Endpoints, autenticação, erros, paginação

### 🔒 Segurança
- [Diretrizes de Segurança](./security/guidelines.md) - Validação, autorização, logs seguros, LGPD

### 🚀 Deploy
- [Deploy no Railway](./deployment/railway.md) - Passo a passo completo para produção

### 🔄 Webhooks
- [Webhook Evolution API](./webhooks/evolution.md) - Processamento de mensagens do WhatsApp

### 🛠️ Desenvolvimento
- [Guia de Multi-Tenancy](./development/multi-tenancy.md) - Isolamento de lojas, validações, performance

## Links Rápidos

- [README Principal](../README.md)
- [Variáveis de Ambiente](../.env.example)
- [Schema Prisma](../prisma/schema.prisma)

## Status do Projeto

| Fase | Status | Descrição |
|------|--------|-----------|
| 1 | ✅ Concluída | Infraestrutura base (Node, TS, Express, Prisma, Docker) |
| 2 | ✅ Concluída | Multi-loja + Clientes + Autorização |
| 3 | ✅ Concluída | Produtos + Categorias + Catálogo + Carrinho |
| 4 | ✅ Concluída | Pedidos + Checkout + Máquina de Estados |
| 5 | ✅ Concluída | Promoções (sistema completo implementado) |
| 6 | ⏳ Pendente | Integração Evolution API completa |
| 7 | ⏳ Pendente | Bot Engine + Conversação |
| 8 | ⏳ Pendente | Admin Auth + RBAC + Audit |
| 9 | ⏳ Pendente | Testes completos |
| 10 | ⏳ Pendente | Docker + Railway final |

## Começando

1. **Desenvolvimento Local**
   ```bash
   # Clonar repositório
   git clone <repo>
   
   # Instalar dependências
   npm install
   
   # Configurar ambiente
   cp .env.example .env
   
   # Subir banco e redis
   docker compose up -d
   
   # Rodar migrations
   npx prisma migrate dev
   
   # Iniciar servidor
   npm run dev
   ```

2. **Primeiros Passos**
   - Ler [Arquitetura](./architecture/overview.md)
   - Entender [Multi-Tenancy](./development/multi-tenancy.md)
   - Explorar [API](./api/README.md)

3. **Deploy em Produção**
   - Seguir guia do [Railway](./deployment/railway.md)
   - Configurar [Webhooks](./webhooks/evolution.md)
   - Revisar [Segurança](./security/guidelines.md)

## Suporte

Para dúvidas ou problemas:
1. Verificar documentação específica
2. Checar logs da aplicação
3. Revisar testes de exemplo

## Contribuição

Ao adicionar novas features:
1. Atualizar documentação relevante
2. Adicionar testes
3. Seguir guidelines de segurança
4. Manter compatibilidade multi-loja
