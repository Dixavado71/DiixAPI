# ECMS6 - Deploy no Railway

## Visão Geral

O Railway é a plataforma recomendada para deploy do ECMS6 devido à integração nativa com PostgreSQL, Redis e variáveis de ambiente.

## Pré-requisitos

- Conta no GitHub
- Conta no Railway
- Repositório Git com o código do ECMS6

## Passo a Passo

### 1. Preparar Repositório

```bash
# Verificar se .gitignore está correto
cat .gitignore

# Deve incluir:
# node_modules
# .env
# .env.*
# !.env.example
# dist
# coverage
# logs
```

### 2. Criar Projeto no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório `ecms6`

### 3. Adicionar Serviços

#### PostgreSQL
1. Click "+ New" → "Database" → "PostgreSQL"
2. Aguarde provisionamento
3. Anote as variáveis geradas

#### Redis
1. Click "+ New" → "Datastore" → "Redis"
2. Aguarde provisionamento
3. Anote as variáveis geradas

#### Aplicação ECMS6
1. O Railway detectará automaticamente como serviço Node.js
2. Configure as variáveis de ambiente

### 4. Variáveis de Ambiente

Adicione no Railway:

```bash
NODE_ENV=production
PORT=${{PORT}}

DATABASE_URL=${{ECMS6_POSTGRES.DATABASE_URL}}
REDIS_URL=${{ECMS6_REDIS.REDIS_URL}}

EVOLUTION_API_URL=https://evolution-api-production-8490.up.railway.app
EVOLUTION_API_KEY=sua_chave_aqui
EVOLUTION_WEBHOOK_SECRET=seu_secret_aqui

JWT_SECRET=gerar_aleatorio_seguro

LOG_LEVEL=info

CORS_ORIGIN=https://seu-dominio.com

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

### 5. Configurar Build

No Railway, configure:

```toml
# railway.toml já incluso no projeto
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start"
buildCommand = "npm run build && npx prisma migrate deploy"
```

### 6. Domínio (Opcional)

1. Vá em "Settings" → "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 7. Webhook da Evolution API

Configure na Evolution API:

```
Webhook URL: https://seu-ecms6.up.railway.app/api/v1/webhooks/evolution
```

## Variáveis do Railway

O Railway fornece automaticamente:

- `PORT`: Porta dinâmica
- `RAILWAY_ENVIRONMENT`: development/production
- `RAILWAY_PROJECT_ID`: ID do projeto
- `RAILWAY_SERVICE_NAME`: Nome do serviço

## Migrations

As migrations são aplicadas automaticamente no deploy:

```json
"scripts": {
  "build": "tsc",
  "postinstall": "prisma generate",
  "prestart": "prisma migrate deploy"
}
```

## Logs

Acesse logs no Railway:

```bash
# Via CLI do Railway
railway logs

# Ou pela interface web
Project → Logs
```

## Monitoramento

- Health check: `https://seu-ecms6.up.railway.app/api/v1/health`
- Ready check: `https://seu-ecms6.up.railway.app/api/v1/health/ready`

## Troubleshooting

### Build Falha
```bash
# Verificar localmente
docker build -t ecms6-test .
```

### Migration Falha
```bash
# Verificar status
npx prisma migrate status

# Forçar (cuidado em produção)
npx prisma migrate resolve
```

### Porta Incorreta
Verifique se `server.ts` usa:
```typescript
const port = Number(process.env.PORT ?? 3000);
```

## Custos

Railway oferece:
- $5 crédito inicial
- PostgreSQL: ~$5/mês
- Redis: ~$5/mês
- Aplicação: ~$5/mês (dependendo do uso)

Total estimado: $15-25/mês

## Próximos Passos

1. Configurar CI/CD com GitHub Actions
2. Implementar backup automático do PostgreSQL
3. Configurar alertas de monitoramento
4. Adicionar domínio personalizado
