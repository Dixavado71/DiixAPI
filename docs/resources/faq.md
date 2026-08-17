# ECMS6 - FAQ e Troubleshooting

## Índice

1. [Perguntas Frequentes (FAQ)](#perguntas-frequentes-faq)
2. [Problemas Comuns e Soluções](#problemas-comuns-e-soluções)
3. [Erros Específicos](#erros-específicos)
4. [Performance](#performance)
5. [Segurança](#segurança)

---

## Perguntas Frequentes (FAQ)

### Geral

#### O que é o ECMS6?
ECMS6 é uma plataforma multi-loja de e-commerce integrada ao WhatsApp via Evolution API, permitindo que lojas gerenciem vendas e atendimento através de mensagens.

#### É gratuito?
O código é open-source (MIT License), mas você precisará pagar por:
- Hospedagem (Railway, AWS, etc.)
- Banco de dados PostgreSQL
- Redis (opcional em dev, necessário em produção)
- Evolution API (se usar serviço gerenciado)

#### Qual o custo estimado para rodar em produção?
- **Mínimo:** ~R$ 50-100/mês (Railway básico + DB + Redis)
- **Recomendado:** ~R$ 150-300/mês (recursos adequados)
- **Escala:** ~R$ 500+/mês (auto-scaling, backups, monitoring)

#### Preciso saber programar?
Para **usar** a plataforma: não necessariamente, mas ajuda.  
Para **instalar e configurar**: conhecimentos básicos de terminal, Git e Docker são necessários.  
Para **customizar**: conhecimentos de Node.js, TypeScript, React e SQL são essenciais.

---

### Instalação

#### Quanto tempo leva para instalar?
- **Experiência média:** 30-60 minutos
- **Primeira vez:** 1-2 horas (incluindo leitura da documentação)
- **Já familiarizado:** 15-30 minutos

#### Posso rodar sem Docker?
Sim, mas não é recomendado. Você precisará instalar manualmente:
- PostgreSQL 14+
- Redis 6+
- Node.js 20+

Docker simplifica muito o processo.

#### Funciona no Windows?
Sim, mas use WSL2 (Windows Subsystem for Linux) para melhor experiência.  
Docker Desktop para Windows também funciona.

#### E no Mac?
Funciona nativamente com Docker Desktop para Mac.

---

### Multi-Tenancy

#### Como funciona o isolamento entre lojas?
Cada loja tem um `storeId` único. Todas as queries incluem esse ID, garantindo que:
- Loja A nunca vê dados da Loja B
- URLs são separadas por slug
- Configurações são independentes

#### Posso ter múltiplas lojas no mesmo banco?
Sim! Essa é a arquitetura multi-tenancy. Todas as lojas compartilham o mesmo banco, mas os dados são logicamente isolados.

#### Posso separar bancos por loja?
Tecnicamente sim, mas perderia as vantagens do multi-tenancy. Se precisar de isolamento físico total, considere instâncias separadas.

---

### WhatsApp Integration

#### Preciso da Evolution API?
Sim, o ECMS6 depende da Evolution API para comunicação com WhatsApp.

#### Evolution API é gratuita?
A Evolution API é open-source, mas você precisa hospedá-la separadamente. Há serviços gerenciados pagos disponíveis.

#### Posso usar WhatsApp Business API oficial?
Não diretamente. O ECMS6 foi construído para Evolution API. Integração com WhatsApp Business API oficial seria um projeto separado.

#### Quantos números WhatsApp posso usar?
Ilimitado. Cada loja pode ter sua própria instância na Evolution API.

---

### Dados e Backup

#### Como faço backup dos dados?
**PostgreSQL:**
```bash
# Backup manual
pg_dump "$DATABASE_URL" > backup.sql

# Ou usar backup automático do Railway/cloud provider
```

**Redis:**
Geralmente não precisa de backup (dados efêmeros). Se usar para persistência:
```bash
redis-cli SAVE
```

#### Com que frequência devo fazer backup?
- **Produção:** Diário (automático)
- **Homologação:** Semanal
- **Desenvolvimento:** Não necessário

#### Como restaurar backup?
```bash
psql "$DATABASE_URL" < backup.sql
```

---

## Problemas Comuns e Soluções

### Erro: "Environment validation failed"

**Sintoma:** Aplicação não inicia, mostra erro de validação.

**Causa:** Variáveis de ambiente faltando ou inválidas.

**Solução:**
```bash
# Verificar variáveis setadas
printenv | grep -E "DATABASE_URL|JWT_SECRET"

# Comparar com exemplo
diff .env .env.example

# Corrigir .env e reiniciar
```

---

### Erro: "Cannot connect to database"

**Sintoma:** Erro ao iniciar aplicação ou executar queries.

**Causas possíveis:**
1. PostgreSQL não está rodando
2. DATABASE_URL incorreta
3. Firewall bloqueando conexão
4. Credenciais erradas

**Solução:**
```bash
# 1. Verificar se PostgreSQL está up
docker compose ps postgres

# 2. Ver logs do banco
docker compose logs postgres

# 3. Testar conexão
psql "$DATABASE_URL" -c "SELECT 1"

# 4. Se falhar, verificar DATABASE_URL no .env
# Formato correto:
# postgresql://user:password@host:port/database

# 5. Reiniciar serviços
docker compose down
docker compose up -d postgres

# 6. Aguardar 10 segundos e tentar novamente
```

---

### Erro: "Port 3000 already in use"

**Sintoma:** Servidor não inicia, erro de porta ocupada.

**Solução:**
```bash
# Opção 1: Matar processo usando porta 3000
lsof -ti:3000 | xargs kill -9

# Opção 2: Mudar porta no .env
PORT=3001

# Opção 3: Usar outra porta no docker-compose
# (se o conflito for com container)
```

---

### Erro: "Prisma Client not generated"

**Sintoma:** Erro de import do Prisma Client.

**Solução:**
```bash
# Gerar Prisma Client
npx prisma generate

# Se persistir, limpar cache
rm -rf node_modules/.prisma
npx prisma generate
```

---

### Erro: "Migration failed"

**Sintoma:** Erro ao rodar migrations.

**Solução:**
```bash
# Verificar status das migrations
npx prisma migrate status

# Se houver migration pendente falhada
npx prisma migrate resolve --applied "<migration-name>"

# Ou resetar banco (DESVOLVIMENTO APENAS!)
npx prisma migrate reset

# Em produção, NUNCA resetar. Contatar suporte.
```

---

### Erro: "Redis connection refused"

**Sintoma:** Erro ao conectar no Redis.

**Solução:**
```bash
# Verificar se Redis está rodando
docker compose ps redis

# Testar conexão
redis-cli ping  # Deve retornar PONG

# Se usar senha, incluir na URL
# redis://:password@localhost:6379

# Ver logs
docker compose logs redis
```

---

### Frontend não carrega

**Sintoma:** Backend funciona, frontend retorna 404 ou tela branca.

**Solução:**
```bash
# 1. Verificar se frontend foi buildado
ls -la frontend/dist/

# 2. Se vazio, buildar frontend
cd frontend && npm run build

# 3. Verificar se backend está servindo estáticos
# No production, backend serve files de frontend/dist/

# 4. Em desenvolvimento, rodar frontend separado
cd frontend && npm run dev
# Acessar http://localhost:5173
```

---

### Webhooks não chegam

**Sintoma:** Mensagens WhatsApp não são processadas.

**Solução:**
```bash
# 1. Verificar se webhook endpoint está acessível
curl -X POST https://seu-dominio.com/api/v1/webhooks/evolution \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'

# 2. Verificar configuração na Evolution API
# URL deve ser pública e acessível

# 3. Ver logs do webhook
# Procurar por "webhook_received" nos logs

# 4. Testar com ngrok localmente
ngrok http 3000
# Atualizar URL na Evolution API temporariamente
```

---

## Erros Específicos

### Erro Zod Validation

```typescript
// Exemplo de erro
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["name"]
  }
]
```

**Solução:** Verificar payload da requisição. Campo `name` está faltando.

---

### Erro JWT Invalid

```
JsonWebTokenError: invalid signature
```

**Solução:**
1. Verificar se JWT_SECRET é o mesmo em todos os lugares
2. Não mudar JWT_SECRET em produção (invalida tokens existentes)
3. Clear cookies/tokens do navegador

---

### Erro CORS

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solução:**
```bash
# Adicionar origem do frontend no CORS_ORIGIN
CORS_ORIGIN=http://localhost:5173,https://app.dominio.com

# Em desenvolvimento, pode usar *
CORS_ORIGIN=*
```

---

## Performance

### Sistema lento

**Diagnóstico:**
```bash
# Verificar uso de recursos
docker stats

# Ver slow queries no PostgreSQL
# Habilitar log de queries lentas

# Verificar Redis memory
redis-cli INFO memory
```

**Soluções:**
1. Adicionar índices em colunas filtradas
2. Implementar paginação
3. Cache com Redis
4. Otimizar queries N+1

---

### Database lento

**Solução:**
```sql
-- Analisar queries lentas
EXPLAIN ANALYZE SELECT * FROM "Product" WHERE "storeId" = '...';

-- Criar índices
CREATE INDEX "Product_storeId_idx" ON "Product"("storeId");
CREATE INDEX "Product_active_idx" ON "Product"("active");

-- Vacuum analyze
VACUUM ANALYZE;
```

---

## Segurança

### Suspeita de vazamento

**Ações imediatas:**
1. Rotacionar TODOS os secrets (JWT, API keys, senhas)
2. Revogar sessões ativas
3. Analisar logs de acesso
4. Notificar afetados (se aplicável por LGPD)

**Prevenção:**
- Nunca commit `.env`
- Usar gerenciador de secrets
- Revisar code changes
- Auditar permissões

---

### Ataque DDoS

**Sinais:**
- Tráfego anormalmente alto
- Lentidão extrema
- Rate limits sendo atingidos

**Ações:**
1. Habilitar Cloudflare/proxy reverso
2. Aumentar rate limiting
3. Bloquear IPs ofensores
4. Contactar provedor de hospedagem

---

## Como Obter Ajuda

### Antes de Pedir Ajuda

1. ✅ Ler documentação relevante
2. ✅ Buscar erros similares no histórico
3. ✅ Verificar logs detalhadamente
4. ✅ Tentar soluções sugeridas
5. ✅ Documentar passos já tentados

### Ao Pedir Ajuda, Incluir

- Descrição clara do problema
- Passos para reproduzir
- Logs relevantes (sem dados sensíveis)
- Ambiente (OS, versões, etc.)
- O que já tentou

### Onde Pedir Ajuda

- **GitHub Issues:** Bugs e feature requests
- **Discord/Slack:** Dúvidas rápidas
- **Email:** Assuntos sensíveis/segurança

---

## Recursos Adicionais

- [Documentação Completa](./README.md)
- [Guia do Desenvolvedor](./development/developer-guide.md)
- [Security Guidelines](./security/guidelines.md)
- [Glossário](./resources/glossary.md)

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
