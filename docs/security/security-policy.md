# ECMS6 - Política de Segurança Avançada

## Visão Geral

Este documento estabelece as políticas de segurança detalhadas para o ECMS6, cobrindo todos os aspectos da proteção do sistema, dados e usuários.

---

## 1. Governança de Segurança

### 1.1 Responsabilidades

| Papel | Responsabilidades |
|-------|------------------|
| **Security Owner** | Definir políticas, revisar auditorias, aprovar mudanças críticas |
| **Dev Team** | Implementar segurança no código, seguir padrões, reportar vulnerabilidades |
| **Ops Team** | Configurar infraestrutura segura, monitorar, responder incidentes |
| **Todos** | Seguir políticas, reportar suspeitas, completar treinamentos |

### 1.2 Revisão de Segurança

- **Trimestral**: Revisão completa de políticas
- **Mensal**: Análise de logs e incidentes
- **Por Release**: Security checklist antes de deploy
- **Contínuo**: Monitoramento automatizado

---

## 2. Classificação de Dados

### 2.1 Níveis de Sensibilidade

| Nível | Exemplos | Tratamento |
|-------|----------|------------|
| **Público** | Nome da loja, produtos públicos | Sem restrições |
| **Interno** | Logs operacionais, métricas | Acesso apenas equipe |
| **Confidencial** | Dados de clientes, pedidos | Criptografia, acesso restrito |
| **Crítico** | Senhas, chaves API, dados financeiros | Criptografia forte, MFA, audit |

### 2.2 Dados Pessoais (LGPD)

**Dados tratados:**
- Nome, telefone, email
- Endereço de entrega
- Histórico de pedidos

**Princípios seguidos:**
- Minimização (apenas necessário)
- Finalidade específica
- Consentimento registrado
- Direito à exclusão (implementando)

---

## 3. Autenticação e Autorização

### 3.1 Admin Users

```typescript
// Requisitos de senha
{
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90 // dias
}

// MFA obrigatório para:
- SUPER_ADMIN
- STORE_OWNER
- Acesso a dados críticos
```

### 3.2 JWT Tokens

```typescript
{
  algorithm: 'HS256',
  expiresIn: '7d',
  refreshEnabled: true,
  refreshExpiresIn: '30d',
  rotationOnRefresh: true
}
```

### 3.3 RBAC (Role-Based Access Control)

| Role | Permissões |
|------|------------|
| **SUPER_ADMIN** | Acesso total a todas as lojas e configurações |
| **STORE_OWNER** | Gestão completa da(s) sua(s) loja(s) |
| **STORE_MANAGER** | Operações comerciais, sem gestão de usuários |
| **OPERATOR** | Apenas operações básicas (visualizar pedidos) |

### 3.4 Customer Authorization

```
Fluxo de autorização por loja:
1. Cliente identificado pelo phone
2. Verificar StoreCustomer.status:
   - BLOCKED → Negado permanentemente
   - PENDING + approvalRequired → Negado até aprovação
   - APPROVED → Autorizado
   - INACTIVE → Negado
```

---

## 4. Segurança de API

### 4.1 Rate Limiting

```typescript
// Configuração padrão
{
  windowMs: 60000,        // 1 minuto
  max: 100,               // 100 requisições por IP
  message: 'Too many requests'
}

// Endpoints críticos (auth, webhook)
{
  windowMs: 60000,
  max: 20                 // Mais restritivo
}
```

### 4.2 Headers de Segurança (Helmet)

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 4.3 CORS

```typescript
// Produção
{
  origin: ['https://dominio.com', 'https://www.dominio.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}

// Nunca usar '*' em produção com credentials
```

### 4.4 Validação de Entrada

**Todas as entradas devem ser validadas:**

```typescript
// Schema Zod obrigatório
const createOrderSchema = z.object({
  customerId: z.string().cuid(),
  storeId: z.string().cuid(),
  paymentMethod: z.enum(['PIX', 'CARD', 'CASH', 'PAYMENT_ON_DELIVERY']),
  deliveryAddress: z.string().min(10).max(500),
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive().max(100)
  })).min(1).max(50)
});

// Validar SEMPRE antes de processar
const validatedData = createOrderSchema.parse(req.body);
```

---

## 5. Segurança de Dados

### 5.1 Criptografia

| Tipo | Algoritmo | Uso |
|------|-----------|-----|
| **Senhas** | bcrypt (cost 12) ou Argon2id | Hash de senhas |
| **JWT** | HS256 | Tokens de sessão |
| **Dados em trânsito** | TLS 1.3 | HTTPS obrigatório |
| **Dados sensíveis** | AES-256-GCM | Dados financeiros (futuro) |

### 5.2 Multi-Tenancy Seguro

**Regras obrigatórias:**

1. TODO query deve incluir `storeId`
2. Validação cruzada de pertencimento
3. Índices compostos para isolamento
4. Nunca expor IDs de outras lojas

```typescript
// ✅ CORRETO
const product = await prisma.product.findFirst({
  where: { id: productId, storeId: authenticatedStoreId }
});

// ❌ ERRADO - NUNCA FAZER
const product = await prisma.product.findUnique({
  where: { id: productId }
});
```

### 5.3 Prevenção de Vazamento

**Nunca logar:**
- [ ] DATABASE_URL
- [ ] REDIS_URL
- [ ] JWT_SECRET
- [ ] EVOLUTION_API_KEY
- [ ] Senhas completas
- [ ] Tokens de sessão
- [ ] Dados completos de cartão

**Sempre mascarar:**
- CPF/CNPJ: `123.***.***-45`
- Telefone: `+55 11 9****-****`
- Email: `joao****@gmail.com`
- Cartão: `**** **** **** 1234`

---

## 6. Segurança de Webhook

### 6.1 Validação de Eventos Evolution API

```typescript
// 1. Verificar assinatura (quando disponível)
const signature = req.headers['x-evolution-signature'];
const isValid = verifySignature(body, secret, signature);

// 2. Idempotência pelo eventId
const existing = await prisma.webhookEvent.findUnique({
  where: { eventId: payload.eventId }
});
if (existing?.processed) return res.status(200).send();

// 3. Validar schema
const validated = webhookSchema.safeParse(payload);
if (!validated.success) return res.status(400).send();

// 4. Log seguro antes de processar
logger.info({ eventId: payload.eventId, type: payload.event });

// 5. Processar assimetricamente
processWebhookAsync(payload);
res.status(200).send({ received: true });
```

### 6.2 Proteção contra Replay Attack

- Usar timestamps nas requisições
- Rejeitar eventos com > 5 minutos
- Manter registro de eventIds processados (TTL 24h)

---

## 7. Segurança de Infraestrutura

### 7.1 Docker

```dockerfile
# Boas práticas implementadas
- Imagem mínima (node:20-bookworm)
- Usuário não-root (nodejs)
- HEALTHCHECK configurado
- Secrets via environment variables
- Sem dados sensíveis na imagem
```

### 7.2 Railway/Cloud

**Configurações obrigatórias:**
- HTTPS forçado
- Variáveis de ambiente criptografadas
- Database com SSL
- Backup automático diário
- Firewall restritivo

### 7.3 Redis

```typescript
// Configuração segura
{
  password: process.env.REDIS_PASSWORD,  // Obrigatório em produção
  tls: {},                               // SSL em produção
  maxmemory: '256mb',                    // Limite de memória
  maxmemoryPolicy: 'allkeys-lru'         // Evitar OOM
}
```

### 7.4 PostgreSQL

**Configurações de segurança:**
- SSL obrigatório em produção
- Usuário com privilégios mínimos
- Conexões limitadas (pool)
- Backup automático com retenção 7 dias

---

## 8. Logging e Auditoria

### 8.1 Logs Seguros

```typescript
// ✅ Log apropriado
logger.info({
  event: 'order_created',
  orderId: order.id,           // ID apenas
  storeId: order.storeId,
  customerId: order.customerId,
  total: order.total.toString(),
  ip: req.ip
});

// ❌ Log inseguro - NUNCA FAZER
logger.info({
  order: order,                // Objeto completo pode ter dados sensíveis
  customer: customer,
  payment: payment
});
```

### 8.2 AuditLog

**Eventos auditados:**
- Login/logout de admin
- Criação/edição/exclusão de lojas
- Alteração de preços
- Cancelamento de pedidos
- Mudança de permissões
- Exportação de dados

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  entity    String   // Store, Product, Order, User
  entityId  String?
  ipAddress String?
  metadata  Json?    // Dados contextuais seguros
  createdAt DateTime @default(now())
}
```

### 8.3 Retenção de Logs

| Tipo de Log | Retenção | Armazenamento |
|-------------|----------|---------------|
| HTTP Logs | 30 dias |stdout/Arquivo |
| Audit Logs | 2 anos | Banco de dados |
| Error Logs | 90 dias | Arquivo/Sentry |
| Access Logs | 1 ano | S3/Object Storage |

---

## 9. Resposta a Incidentes

### 9.1 Classificação de Incidentes

| Severidade | Exemplos | Tempo de Resposta |
|------------|----------|-------------------|
| **Crítico** | Vazamento de dados, indisponibilidade total | Imediato (< 15min) |
| **Alto** | Ataque DDoS, autenticação comprometida | < 1 hora |
| **Médio** | Erros recorrentes, performance degradada | < 4 horas |
| **Baixo** | Bugs menores, melhorias de segurança | < 24 horas |

### 9.2 Plano de Resposta

```
1. DETECÇÃO
   - Alertas automáticos
   - Reports de usuários
   - Monitoramento contínuo

2. CONTENÇÃO
   - Isolar sistema afetado
   - Revogar acessos comprometidos
   - Ativar modo de emergência

3. INVESTIGAÇÃO
   - Coletar evidências
   - Analisar logs
   - Identificar causa raiz

4. ERRADICAÇÃO
   - Corrigir vulnerabilidade
   - Remover backdoors
   - Patch de segurança

5. RECUPERAÇÃO
   - Restaurar backups
   - Retomar operações
   - Validar integridade

6. LIÇÕES APRENDIDAS
   - Documentar incidente
   - Atualizar políticas
   - Treinar equipe
```

### 9.3 Comunicação

**Em caso de vazamento de dados:**
1. Notificar autoridade (ANPD) em até 2 dias úteis
2. Comunicar afetados imediatamente
3. Publicar nota transparente
4. Oferecer suporte aos afetados

---

## 10. Segurança no Ciclo de Desenvolvimento

### 10.1 SDLC Seguro

| Fase | Atividades de Segurança |
|------|------------------------|
| **Requisitos** | Definir requisitos de segurança, classificação de dados |
| **Design** | Threat modeling, revisão de arquitetura |
| **Implementação** | Code review, SAST, validação de inputs |
| **Testes** | DAST, testes de penetração, fuzzing |
| **Deploy** | Checklist de segurança, scan de vulnerabilidades |
| **Operação** | Monitoramento, patch management, resposta incidentes |

### 10.2 Code Review Checklist

- [ ] Validação de todas as entradas
- [ ] Autorização verificada
- [ ] Dados sensíveis mascarados
- [ ] Logs seguros
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido (React)
- [ ] CSRF tokens (quando aplicável)
- [ ] Rate limiting considerado

### 10.3 Dependências

```bash
# Verificar vulnerabilidades semanalmente
npm audit --production

# Atualizar dependências criticas imediatamente
npm update --save

# Usar dependências com versões fixas
"express": "4.18.2"  // ✅
"express": "^4.18.2" // ⚠️ Pode quebrar
```

---

## 11. Compliance e Regulamentação

### 11.1 LGPD (Lei Geral de Proteção de Dados)

**Direitos dos titulares implementados:**
- [x] Acesso aos dados
- [x] Correção de dados incorretos
- [ ] Portabilidade (em implementação)
- [ ] Exclusão total (em implementação)
- [x] Revogação de consentimento

**Base legal para processamento:**
- Execução de contrato (pedidos)
- Legítimo interesse (fraude prevention)
- Consentimento (marketing)

### 11.2 PCI-DSS (Pagamentos)

**Escopo reduzido:**
- NÃO armazenamos dados de cartão
- Pagamentos processados por terceiros (PIX, links)
- Apenas método de pagamento é registrado

---

## 12. Treinamento e Conscientização

### 12.1 Treinamentos Obrigatórios

| Público | Frequência | Conteúdo |
|---------|------------|----------|
| Devs | Trimestral | Secure coding, OWASP Top 10 |
| Ops | Trimestral | Hardening, resposta incidentes |
| Todos | Semestral | Phishing, segurança básica |

### 12.2 Simulações

- **Phishing**: Simulação mensal
- **Incidente**: Drill trimestral
- **Backup restore**: Teste mensal

---

## 13. Métricas de Segurança

### 13.1 KPIs Monitorados

| Métrica | Meta | Frequência |
|---------|------|------------|
| Vulnerabilidades críticas | 0 | Contínuo |
| Tempo médio de patch (crítico) | < 24h | Por incidente |
| Cobertura de testes de segurança | > 80% | Mensal |
| Incidentes de segurança | 0 | Mensal |
| Treinamentos completados | 100% | Trimestral |

### 13.2 Dashboard de Segurança

Acompanhar:
- Tentativas de ataque bloqueadas
- Requests com rate limit excedido
- Falhas de autenticação
- Webhooks rejeitados
- Dependências vulneráveis

---

## 14. Aprovações e Revisões

| Versão | Data | Autor | Aprovador | Mudanças |
|--------|------|-------|-----------|----------|
| 1.0 | Jan/2025 | Security Team | CTO | Versão inicial |

**Próxima revisão:** Abril/2025

---

## Anexos

### A. Glossário de Termos

- **MFA**: Multi-Factor Authentication
- **RBAC**: Role-Based Access Control
- **SAST**: Static Application Security Testing
- **DAST**: Dynamic Application Security Testing
- **OWASP**: Open Web Application Security Project

### B. Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LGPD Texto Completo](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [PCI-DSS Requirements](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4.pdf)
- [Node.js Security Best Practices](https://nodejs.org/en/security/)

---

**Documento classificado como: CONFIDENCIAL**  
**Distribuição restrita à equipe técnica e gestores**
