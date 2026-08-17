# ECMS6 - Guia do Desenvolvedor

## Índice

1. [Setup Inicial](#setup-inicial)
2. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Comandos Úteis](#comandos-úteis)
5. [Debugging](#debugging)
6. [Boas Práticas](#boas-práticas)

---

## Setup Inicial

### Pré-requisitos

```bash
# Verificar versões
node --version  # >= 20.0.0
npm --version   # >= 9.0.0
docker --version
docker-compose --version
```

### Instalação Passo a Passo

```bash
# 1. Clonar repositório
git clone <repository-url>
cd ecms6

# 2. Instalar dependências
npm install

# 3. Instalar dependências do frontend
cd frontend && npm install && cd ..

# 4. Copiar ambiente
cp .env.example .env

# 5. Editar .env com suas configurações

# 6. Subir serviços (PostgreSQL + Redis)
docker compose up -d postgres redis

# 7. Aguardar serviços estarem prontos
sleep 10

# 8. Rodar migrations
npx prisma migrate dev

# 9. Gerar Prisma Client
npx prisma generate

# 10. Iniciar aplicação
npm run dev
```

### VS Code Extensions Recomendadas

- ESLint
- Prettier
- Prisma
- TypeScript
- Docker
- REST Client

---

## Workflow de Desenvolvimento

### Branch Strategy

```
main (produção)
  └── develop (homologação)
       └── feature/nova-feature (desenvolvimento)
       └── fix/correcao-bug (correções)
       └── hotfix/correcao-urgente (produção)
```

### Commit Convention

```bash
# Format: type(scope): description

feat(api): adicionar endpoint de pedidos
fix(cart): corrigir cálculo de desconto
docs(readme): atualizar instruções de instalação
test(order): adicionar testes unitários
refactor(auth): melhorar estrutura de autenticação
chore(deps): atualizar dependências
```

### Pull Request Process

1. Criar branch da `develop`
2. Desenvolver feature/fix
3. Rodar testes localmente
4. Push e criar PR
5. Code review (pelo menos 1 approval)
6. CI/CD passa
7. Merge na `develop`

---

## Estrutura do Projeto

```
ecms6/
├── src/
│   ├── app.ts                 # Configuração Express
│   ├── server.ts              # Entry point
│   │
│   ├── config/                # Configurações
│   │   ├── env.ts             # Validação de environment
│   │   ├── database.ts        # Conexão PostgreSQL
│   │   └── redis.ts           # Conexão Redis
│   │
│   ├── routes/                # Rotas HTTP
│   │   ├── index.ts           # Router principal
│   │   ├── store.routes.ts    # Rotas de lojas
│   │   └── ...
│   │
│   ├── controllers/           # Controladores
│   │   └── store.controller.ts
│   │
│   ├── services/              # Regras de negócio
│   │   ├── store/
│   │   ├── customer/
│   │   └── ...
│   │
│   ├── repositories/          # Acesso a dados
│   │   └── store.repository.ts
│   │
│   ├── validators/            # Schemas Zod
│   │   └── store.validator.ts
│   │
│   ├── middlewares/           # Middleware Express
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── integrations/          # Integrações externas
│   │   └── evolution/
│   │
│   ├── utils/                 # Utilitários
│   │   ├── logger.ts
│   │   └── phone.ts
│   │
│   └── types/                 # Tipos TypeScript
│
├── frontend/                  # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── ...
│
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── migrations/
│
├── tests/                     # Testes
│   ├── unit/
│   └── integration/
│
├── docs/                      # Documentação
├── .env.example               # Template de environment
├── docker-compose.yml         # Orquestração local
├── Dockerfile                 # Container production
└── package.json               # Dependências e scripts
```

---

## Comandos Úteis

### Desenvolvimento

```bash
# Iniciar servidor (hot reload)
npm run dev

# Build completo
npm run build

# Apenas backend
npm run build:backend

# Apenas frontend
npm run build:frontend

# Gerar Prisma Client
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

### Testes

```bash
# Rodar todos testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Qualidade de Código

```bash
# Lint
npm run lint

# Lint com auto-fix
npm run lint:fix

# Format
npm run format

# Check format
npm run format:check
```

### Docker

```bash
# Subir serviços
npm run docker:up

# Derrubar serviços
npm run docker:down

# Ver logs
npm run docker:logs
```

---

## Debugging

### VS Code Launch Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    }
  ]
}
```

### Logging

```typescript
import { getLogger } from './utils/logger';

const logger = getLogger();

// Níveis de log
logger.trace('Detalhes extras');
logger.debug('Informação de debug');
logger.info('Informação geral');
logger.warn('Aviso importante');
logger.error('Erro ocorreu');
logger.fatal('Erro crítico');

// Com contexto
logger.info({ userId: '123', action: 'login' }, 'User logged in');
```

### Debugando Queries Prisma

```bash
# Habilitar log de queries
export DEBUG=prisma:client

# Ou no código
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
```

---

## Boas Práticas

### Código

✅ **FAÇA:**
- Use TypeScript strict mode
- Valide TODAS as entradas com Zod
- Sempre inclua `storeId` em queries multi-loja
- Use repositórios para acesso a dados
- Mantenha services focados em uma responsabilidade
- Escreva testes para lógica crítica
- Use logger em vez de console.log
- Siga princípios SOLID

❌ **NÃO FAÇA:**
- Nunca confie em dados do cliente
- Não faça queries sem filtro de storeId
- Não logue dados sensíveis
- Não ignore erros em promises
- Não hardcode secrets no código
- Não use `any` no TypeScript

### Git

✅ **FAÇA:**
- Commits atômicos e descritivos
- Branches com nomes claros
- PRs pequenos e focados
- Resolva conflitos rapidamente
- Delete branches após merge

❌ **NÃO FAÇA:**
- Commits gigantes
- Mensagens genéricas ("fix", "update")
- PRs com múltiplas features
- Push direto na main/develop

### Performance

- Use índices em colunas filtradas
- Implemente paginação em listas
- Cache dados frequentemente acessados (Redis)
- Evite N+1 queries (use include do Prisma)
- Monitore slow queries

---

## Troubleshooting Comum

### Erro: "Prisma Client não gerado"

```bash
npx prisma generate
```

### Erro: "Database connection failed"

```bash
# Verificar se Docker está rodando
docker compose ps

# Verificar logs do banco
docker compose logs postgres

# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"
```

### Erro: "Port already in use"

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou mudar porta no .env
PORT=3001
```

### Erro: "Module not found"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## Recursos Adicionais

- [Documentação Completa](./docs/README.md)
- [API Reference](./docs/api/README.md)
- [Security Guidelines](./docs/security/guidelines.md)
- [Testing Guide](./docs/testing/README.md)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
