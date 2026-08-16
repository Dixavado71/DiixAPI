# ECMS6 - Diretrizes de Segurança

## Princípios Fundamentais

### 1. Nunca Confiar no Cliente
- Validar TODAS as entradas com Zod
- Preços sempre obtidos do banco
- Estoque validado no backend
- Autorização verificada em cada operação

### 2. Multi-Tenancy Seguro
- `storeId` em todas as queries
- Validação cruzada de pertencimento
- Índices compostos para isolamento

### 3. Proteção de Dados Sensíveis
- Nunca logar: DATABASE_URL, REDIS_URL, API keys, JWT secrets
- Senhas hash com bcrypt/argon2
- Dados financeiros com precisão Decimal

### 4. Idempotência
- WebhookEvent.eventId único
- Previne processamento duplicado
- Critical para pagamentos e pedidos

## Headers de Segurança (Helmet)

```typescript
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict-Transport-Security
```

## Rate Limiting

```typescript
windowMs: 60000  // 1 minuto
max: 100         // 100 requisições por IP
```

## Validação de Entrada

Todos os endpoints usam schemas Zod:

```typescript
const createOrderSchema = z.object({
  customerId: z.string().cuid(),
  paymentMethod: z.enum(['PIX', 'CARD', 'CASH', 'PAYMENT_ON_DELIVERY']),
  deliveryAddress: z.string().min(10),
  notes: z.string().max(500).optional()
});
```

## Autorização

### Customer Authorization Flow
```
1. Receber phone da mensagem
2. Normalizar telefone
3. Buscar Customer
4. Buscar StoreCustomer
5. Verificar status:
   - BLOCKED → NEGADO
   - PENDING + approvalRequired → NEGADO
   - APPROVED → AUTORIZADO
```

### Admin Roles
- SUPER_ADMIN: Acesso total
- STORE_OWNER: Apenas suas lojas
- STORE_MANAGER: Operações da loja
- OPERATOR: Operações limitadas

## Logs Seguros

### Registrar
- eventId, storeId, customerId (IDs apenas)
- Ações realizadas
- Timestamps
- IP (quando disponível)

### NUNCA Registrar
- DATABASE_URL
- REDIS_URL
- EVOLUTION_API_KEY
- JWT_SECRET
- Senhas
- Tokens completos
- Dados completos de cartão

## PostgreSQL Security

- Conexões com SSL em produção
- Usuário com privilégios mínimos
- Prepared statements (Prisma)
- Índices para performance

## Redis Security

- Senha em produção
- Namespaces por ambiente
- TTL em sessões temporárias
- Não armazenar dados críticos

## Webhook Security

1. Validar secret da Evolution API
2. Verificar eventId para idempotência
3. Validar schema do payload
4. Log seguro do evento
5. Processar assimetricamente

## LGPD / Privacidade

- Minimização de dados
- Consentimento registrado
- Exportação de dados (futuro)
- Deleção de dados (futuro)
- Anonimização de logs

## Checklist de Segurança

- [ ] Variáveis de ambiente validadas
- [ ] Secrets não versionadas
- [ ] HTTPS em produção
- [ ] Rate limiting ativo
- [ ] Helmet configurado
- [ ] CORS restrito
- [ ] Validação Zod em todos inputs
- [ ] Logs sem dados sensíveis
- [ ] Multi-tenancy enforced
- [ ] Idempotência implementada
