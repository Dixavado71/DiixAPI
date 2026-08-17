# ECMS6 - Guia Completo de Variáveis de Ambiente

## Visão Geral

Este documento descreve todas as variáveis de ambiente necessárias para configurar o ECMS6 em diferentes ambientes (desenvolvimento, staging, produção).

---

## 📋 Índice

1. [Variáveis Obrigatórias](#variáveis-obrigatórias)
2. [Variáveis Opcionais](#variáveis-opcionais)
3. [Configurações por Ambiente](#configurações-por-ambiente)
4. [Exemplos Práticos](#exemplos-práticos)
5. [Segurança](#segurança)
6. [Troubleshooting](#troubleshooting)

---

## 🔐 Variáveis Obrigatórias

### Node.js e Servidor

| Variável | Tipo | Padrão | Descrição | Exemplo |
|----------|------|--------|-----------|---------|
| `NODE_ENV` | Enum | `development` | Ambiente de execução | `production`, `development`, `test` |
| `PORT` | Number | `3000` | Porta do servidor HTTP | `3000`, `8080` |

### Banco de Dados

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `DATABASE_URL` | URL | String de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/ecms6` |

**Formato da URL:**
```
postgresql://[usuario]:[senha]@[host]:[porta]/[database]?[opções]
```

**Opções recomendadas:**
```
postgresql://ecms6:password@localhost:5432/ecms6?schema=public&sslmode=disable
```

**Produção com SSL:**
```
postgresql://ecms6:password@db.railway.app:5432/ecms6?schema=public&sslmode=require
```

### Redis

| Variável | Tipo | Obrigatória | Descrição | Exemplo |
|----------|------|-------------|-----------|---------|
| `REDIS_URL` | URL | Não* | String de conexão Redis | `redis://localhost:6379` |

*Obrigatória em produção se usar cache/sessões.

**Com senha (produção):**
```
redis://:password@redis.railway.app:6379
```

**Com TLS (produção Railway):**
```
rediss://:password@redis.railway.app:6379
```

### Evolution API

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `EVOLUTION_API_URL` | URL | URL base da Evolution API | `https://evolution-api.com` |
| `EVOLUTION_API_KEY` | String | API Key de autenticação | `sua-chave-secreta` |
| `EVOLUTION_WEBHOOK_SECRET` | String | Secret para validar webhooks | `webhook-secret-123` |

### JWT (Autenticação)

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `JWT_SECRET` | String | Chave secreta para JWT | `super-secret-key-min-32-chars` |
| `JWT_EXPIRES_IN` | String | Tempo de expiração do token | `7d`, `24h`, `30d` |

**Requisitos do JWT_SECRET:**
- Mínimo 32 caracteres
- Use caracteres aleatórios
- Nunca use valores padrão em produção
- Gere com: `openssl rand -base64 32`

### CORS

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `CORS_ORIGIN` | String | Origens permitidas | `https://dominio.com` |

**Múltiplas origens (separar por vírgula):**
```
CORS_ORIGIN=https://app.com,https://admin.com
```

**Todos (apenas desenvolvimento):**
```
CORS_ORIGIN=*
```

### Rate Limiting

| Variável | Tipo | Padrão | Descrição | Exemplo |
|----------|------|--------|-----------|---------|
| `RATE_LIMIT_WINDOW_MS` | Number | `60000` | Janela de tempo em ms | `60000` (1 minuto) |
| `RATE_LIMIT_MAX` | Number | `100` | Max requests por janela | `100` |

### Logging

| Variável | Tipo | Padrão | Descrição | Exemplo |
|----------|------|--------|-----------|---------|
| `LOG_LEVEL` | Enum | `info` | Nível de log | `fatal`, `error`, `warn`, `info`, `debug`, `trace` |

---

## 🎛️ Variáveis Opcionais

### Funcionalidades

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `FEATURE_BOT_ENABLED` | Boolean | `true` | Habilita Bot Engine |
| `FEATURE_PROMOTIONS_ENABLED` | Boolean | `true` | Habilita promoções |
| `FEATURE_ANALYTICS_ENABLED` | Boolean | `false` | Habilita analytics |

### Email (futuro)

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `SMTP_HOST` | String | Servidor SMTP |
| `SMTP_PORT` | Number | Porta SMTP |
| `SMTP_USER` | String | Usuário SMTP |
| `SMTP_PASS` | String | Senha SMTP |
| `SMTP_FROM` | String | Email remetente |

### Storage (futuro)

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `S3_BUCKET` | String | Bucket S3 |
| `S3_REGION` | String | Região AWS |
| `S3_ACCESS_KEY` | String | Access Key |
| `S3_SECRET_KEY` | String | Secret Key |

### Monitoramento

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `SENTRY_DSN` | String | DSN do Sentry |
| `DATADOG_API_KEY` | String | API Key Datadog |

---

## 🌍 Configurações por Ambiente

### Desenvolvimento Local (.env)

```bash
# Ambiente
NODE_ENV=development
PORT=3000

# Database (Docker local)
DATABASE_URL=postgresql://ecms6:ecms6password@localhost:5432/ecms6?schema=public

# Redis (Docker local)
REDIS_URL=redis://localhost:6379

# Evolution API (local ou dev)
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=dev-api-key-12345
EVOLUTION_WEBHOOK_SECRET=dev-webhook-secret

# JWT (não crítico em dev)
JWT_SECRET=dev-jwt-secret-not-for-production-use-only
JWT_EXPIRES_IN=30d

# CORS (aberto para dev)
CORS_ORIGIN=*

# Rate Limiting (mais permissivo)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000

# Logging (detalhado)
LOG_LEVEL=debug
```

### Produção Railway (.env no Railway)

```bash
# Ambiente
NODE_ENV=production
PORT=${{PORT}}

# Database (Railway Postgres)
DATABASE_URL=${{ECMS6_POSTGRES.DATABASE_URL}}

# Redis (Railway Redis)
REDIS_URL=${{ECMS6_REDIS.REDIS_URL}}

# Evolution API (produção)
EVOLUTION_API_URL=https://evolution-api.yourdomain.com
EVOLUTION_API_KEY=production-secure-api-key-change-me
EVOLUTION_WEBHOOK_SECRET=production-webhook-secret-change-me

# JWT (GERAR CHAVE FORTE!)
JWT_SECRET=gerar-com-openssl-rand-base64-32-muito-seguro
JWT_EXPIRES_IN=7d

# CORS (restrito)
CORS_ORIGIN=https://app.yourdomain.com,https://admin.yourdomain.com

# Rate Limiting (padrão)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# Logging (produção)
LOG_LEVEL=info
```

### Testes (.env.test)

```bash
# Ambiente
NODE_ENV=test
PORT=3001

# Database (banco separado para testes)
DATABASE_URL=postgresql://ecms6:ecms6password@localhost:5432/ecms6_test?schema=public

# Redis
REDIS_URL=redis://localhost:6379/1

# Evolution API (mock em testes)
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=test-key
EVOLUTION_WEBHOOK_SECRET=test-secret

# JWT
JWT_SECRET=test-jwt-secret-for-tests-only
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=*

# Rate Limiting (desabilitado em testes)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10000

# Logging
LOG_LEVEL=error
```

---

## 📝 Exemplos Práticos

### Gerar JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Output exemplo: xK9vR2mN8pL5qW3zT6yU0iO7aS4dF1gH8jK2lM5nP9=

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output exemplo: 7f3a8b2c9d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4
```

### Validar DATABASE_URL

```bash
# Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"

# Ou com Node
node -e "const {Client} = require('pg'); const c = new Client({connectionString: process.env.DATABASE_URL}); c.connect().then(() => console.log('OK')).catch(console.error)"
```

### Testar Redis

```bash
# Testar conexão
redis-cli -u "$REDIS_URL" ping

# Deve retornar: PONG
```

---

## 🔒 Segurança

### Boas Práticas

✅ **FAÇA:**
- Use `.env.example` como template
- Commit apenas `.env.example` (nunca `.env`)
- Gere secrets fortes para produção
- Rotacione secrets periodicamente
- Use gerenciador de secrets (Railway, AWS Secrets Manager)
- Valide variáveis no startup da aplicação

❌ **NÃO FAÇA:**
- Commit `.env` no Git
- Use secrets padrão em produção
- Compartilhe secrets por chat/email
- Hardcode secrets no código
- Use HTTP em produção com secrets

### .gitignore Configurado

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Allow .env.example
!.env.example
```

### Validação no Startup

A aplicação valida variáveis obrigatórias ao iniciar:

```typescript
// src/config/env.ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(val => Number(val)),
  DATABASE_URL: z.string().url(),
  // ...
});

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Environment validation failed:');
    Object.entries(result.error.flatten().fieldErrors).forEach(([key, errors]) => {
      console.error(`  ${key}: ${errors.join(', ')}`);
    });
    process.exit(1);
  }
  
  return result.data;
}
```

---

## 🐛 Troubleshooting

### Erro: "Environment validation failed"

**Causa:** Variável obrigatória faltando ou inválida

**Solução:**
```bash
# Verificar variáveis setadas
printenv | grep -E "DATABASE_URL|JWT_SECRET|EVOLUTION"

# Comparar com .env.example
diff .env .env.example
```

### Erro: "Cannot connect to database"

**Causas possíveis:**
1. DATABASE_URL incorreta
2. Banco não está rodando
3. Firewall bloqueando

**Solução:**
```bash
# Testar conexão
docker compose ps  # Verificar se PostgreSQL está up
psql "$DATABASE_URL" -c "SELECT 1"  # Testar conexão

# Verificar logs
docker compose logs postgres
```

### Erro: "CORS error" no frontend

**Causa:** CORS_ORIGIN não inclui URL do frontend

**Solução:**
```bash
# Adicionar URL do frontend
CORS_ORIGIN=http://localhost:5173,https://app.dominio.com
```

### Erro: "JWT_SECRET not configured"

**Solução:**
```bash
# Gerar novo secret
export JWT_SECRET=$(openssl rand -base64 32)

# Ou adicionar ao .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Erro: "Redis connection refused"

**Solução:**
```bash
# Verificar se Redis está rodando
docker compose ps redis

# Testar conexão
redis-cli ping

# Se usar Railway, verificar REDIS_URL
echo $REDIS_URL
```

---

## 📊 Matriz de Variáveis por Ambiente

| Variável | Dev | Test | Prod |
|----------|-----|------|------|
| NODE_ENV | development | test | production |
| PORT | 3000 | 3001 | ${{PORT}} |
| DATABASE_URL | localhost | localhost/test | Railway URL |
| REDIS_URL | localhost | localhost/1 | Railway URL |
| EVOLUTION_API_URL | localhost | localhost | Production URL |
| EVOLUTION_API_KEY | dev-key | test-key | **Secret** |
| JWT_SECRET | dev-secret | test-secret | **Strong Secret** |
| CORS_ORIGIN | * | * | Dominios específicos |
| RATE_LIMIT_MAX | 1000 | 10000 | 100 |
| LOG_LEVEL | debug | error | info |

---

## 🔄 Atualização de Variáveis

### Quando Adicionar Nova Variável

1. Adicionar ao schema de validação (`src/config/env.ts`)
2. Adicionar ao `.env.example`
3. Documentar neste arquivo
4. Atualizar CI/CD se necessário
5. Comunicar equipe

### Quando Alterar Variável Existente

1. Manter backward compatibility se possível
2. Documentar breaking changes
3. Avisar equipe com antecedência
4. Atualizar todos os ambientes

---

## 📞 Suporte

Para dúvidas sobre configuração de variáveis:

1. Consultar este documento
2. Verificar `.env.example`
3. Checar logs de validação
4. Contatar equipe de infraestrutura

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0  
**Responsável:** DevOps Team
