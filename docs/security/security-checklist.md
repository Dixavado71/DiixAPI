# ECMS6 - Checklist de Segurança

## Visão Geral

Este checklist deve ser usado para verificar a conformidade com as políticas de segurança do ECMS6. Deve ser executado:

- ✅ Antes de cada deploy em produção
- ✅ Mensalmente para auditoria contínua
- ✅ Após incidentes de segurança
- ✅ Quando novas features são adicionadas

---

## 📋 Checklist de Deploy

### Ambiente e Configuração

- [ ] Variáveis de ambiente configuradas corretamente
- [ ] `.env` não commitado no Git
- [ ] Secrets armazenados no Railway/Gerenciador de Secrets
- [ ] `NODE_ENV=production` configurado
- [ ] `PORT` configurado dinamicamente (Railway)

### Banco de Dados

- [ ] SSL habilitado na conexão PostgreSQL
- [ ] Usuário do banco com privilégios mínimos necessários
- [ ] Migrations aplicadas com sucesso
- [ ] Backup automático configurado
- [ ] Connection pool configurado corretamente

### Redis

- [ ] Senha configurada (REDIS_PASSWORD)
- [ ] SSL/TLS habilitado (produção)
- [ ] Maxmemory definido
- [ ] Namespaces separados por ambiente

### API e HTTP

- [ ] HTTPS forçado (Railway faz automaticamente)
- [ ] CORS configurado com origens específicas
- [ ] Rate limiting ativo e testado
- [ ] Helmet headers verificados
- [ ] Body parser com limites de tamanho

### Autenticação e Autorização

- [ ] JWT_SECRET forte e único
- [ ] Expiração de tokens configurada
- [ ] RBAC implementado e testado
- [ ] Multi-tenancy enforced em todas as queries

### Logs e Monitoramento

- [ ] Nível de log apropriado (info/warn/error)
- [ ] Logs não contêm dados sensíveis
- [ ] Health checks funcionando
- [ ] Alertas configurados (Railway/external)

### Frontend

- [ ] Build do frontend gerado corretamente
- [ ] Arquivos estáticos servidos pelo backend
- [ ] SPA routing configurado
- [ ] Assets otimizados (gzip/brotli)

---

## 🔒 Checklist de Código

### Validação de Entrada

- [ ] Todos os endpoints usam schemas Zod
- [ ] Validação ocorre antes do processamento
- [ ] Tipos TypeScript corretos
- [ ] Inputs sanitizados quando necessário

### Autorização

- [ ] `storeId` em todas as queries multi-loja
- [ ] Validação cruzada de pertencimento
- [ ] Customer authorization verificada
- [ ] Admin roles verificadas

### Dados Sensíveis

- [ ] Senhas hash com bcrypt/argon2
- [ ] Dados financeiros como Decimal
- [ ] PII (dados pessoais) minimizada
- [ ] Máscaras aplicadas em logs

### Segurança de API

- [ ] Rate limiting por endpoint crítico
- [ ] Idempotência implementada (webhooks)
- [ ] Timeouts configurados
- [ ] Erros não expõem detalhes internos

### Prevenção de Injeção

- [ ] Prisma ORM usado (previne SQL injection)
- [ ] Queries parametrizadas
- [ ] Inputs validados e sanitizados
- [ ] XSS prevenido (React escapa por padrão)

---

## 🏗️ Checklist de Infraestrutura

### Docker

- [ ] Imagem base mínima
- [ ] Usuário não-root configurado
- [ ] HEALTHCHECK definido
- [ ] Secrets via environment variables
- [ ] .dockerignore configurado

### Railway/Cloud

- [ ] Domínio personalizado configurado (opcional)
- [ ] SSL/TLS ativo
- [ ] Variáveis de ambiente criptografadas
- [ ] Auto-deploy da branch main
- [ ] Rollback rápido possível

### PostgreSQL

- [ ] Versão 14+ (preferencialmente 16)
- [ ] Extensions necessárias instaladas
- [ ] Índices criados para performance
- [ ] Query logging ativado (dev)
- [ ] Slow query log monitorado

### Redis

- [ ] Persistência configurada (se necessário)
- [ ] Eviction policy definida
- [ ] Monitoramento de memória
- [ ] Cluster mode (se escala necessária)

---

## 🧪 Checklist de Testes

### Testes Unitários

- [ ] Services testados (>90% coverage)
- [ ] Utils testados (>95% coverage)
- [ ] Validators testados
- [ ] Casos de erro testados

### Testes de Integração

- [ ] Endpoints críticos testados
- [ ] Fluxos multi-loja testados
- [ ] Isolamento de tenants verificado
- [ ] Performance básica testada

### Testes de Segurança

- [ ] Validação de inputs testada
- [ ] Autorização testada
- [ ] Rate limiting testado
- [ ] Webhook idempotência testada

---

## 📊 Checklist de Compliance (LGPD)

### Coleta de Dados

- [ ] Apenas dados necessários coletados
- [ ] Consentimento registrado (quando aplicável)
- [ ] Finalidade documentada
- [ ] Termos de uso atualizados

### Armazenamento

- [ ] Dados criptografados em trânsito
- [ ] Acesso restrito por role
- [ ] Retenção definida por tipo de dado
- [ ] Backups seguros

### Direitos dos Titulares

- [ ] Processo de acesso aos dados definido
- [ ] Correção de dados possível
- [ ] Exclusão implementada (parcial)
- [ ] Portabilidade em implementação

### Segurança

- [ ] DPO/Responsável designado
- [ ] Registro de operações mantido
- [ ] Avaliação de impacto realizada
- [ ] Plano de resposta a incidentes

---

## 🔍 Checklist de Revisão de Código

### Para Cada Pull Request

- [ ] Validação de entrada adicionada/atualizada
- [ ] Autorização verificada em novos endpoints
- [ ] Logs seguros (sem dados sensíveis)
- [ ] Tratamento de erros adequado
- [ ] Tests adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Security checklist revisada

### Code Review Focado em Segurança

- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido (React escaping)
- [ ] CSRF considerado (stateless API)
- [ ] Path traversal prevenido
- [ ] SSRF prevenido (URLs validadas)
- [ ] XXE prevenido (JSON apenas)

---

## 🚨 Checklist de Resposta a Incidentes

### Detecção

- [ ] Alertas configurados e testados
- [ ] Logs centralizados acessíveis
- [ ] Monitoramento ativo 24/7 (automático)
- [ ] Canal de report de vulnerabilidades

### Contenção

- [ ] Procedimento de isolamento documentado
- [ ] Kill switch para features críticas
- [ ] Backup de emergência acessível
- [ ] Comunicação de crise preparada

### Recuperação

- [ ] Playbooks de recuperação
- [ ] RTO/RPO definidos
- [ ] Equipe de resposta designada
- [ ] Teste de recovery recente (< 3 meses)

---

## 📈 Checklist de Melhoria Contínua

### Mensal

- [ ] Revisar logs de segurança
- [ ] Analisar tentativas de ataque
- [ ] Verificar dependências vulneráveis (`npm audit`)
- [ ] Atualizar documentação

### Trimestral

- [ ] Revisar políticas de segurança
- [ ] Treinamento da equipe
- [ ] Simulação de incidente
- [ ] Penetration test (interno ou externo)

### Semestral

- [ ] Auditoria completa de segurança
- [ ] Revisão de acessos e permissões
- [ ] Atualizar threat model
- [ ] Revisar compliance (LGPD)

### Anual

- [ ] Certificações (se aplicável)
- [ ] Revisão completa de arquitetura
- [ ] Benchmark com mercado
- [ ] Planejamento de melhorias

---

## ✅ Aprovação para Deploy

### Pré-Deploy

| Item | Responsável | Status | Data |
|------|-------------|--------|------|
| Code review completo | Tech Lead | ⬜ | |
| Testes passando (CI) | Dev | ⬜ | |
| Security scan limpo | Security | ⬜ | |
| Documentation atualizada | Dev | ⬜ | |
| Backup pré-deploy | Ops | ⬜ | |

### Pós-Deploy

| Item | Responsável | Status | Data |
|------|-------------|--------|------|
| Health checks OK | Ops | ⬜ | |
| Logs normais | Ops | ⬜ | |
| Performance aceitável | Dev | ⬜ | |
| Smoke tests passando | QA | ⬜ | |
| Rollback plan testado | Ops | ⬜ | |

---

## 📝 Notas e Observações

### Issues Identificadas

| ID | Descrição | Severidade | Status | Responsável |
|----|-----------|------------|--------|-------------|
| | | | | |

### Ações Corretivas

| Ação | Prazo | Responsável | Status |
|------|-------|-------------|--------|
| | | | |

### Lições Aprendidas

```
Espaço para documentar aprendizados após incidentes ou deploys
```

---

## 📞 Contatos de Emergência

| Função | Nome | Telefone | Email |
|--------|------|----------|-------|
| Security Owner | | | |
| Tech Lead | | | |
| Ops On-call | | | |
| CTO | | | |

---

**Última revisão:** Janeiro 2025  
**Próxima revisão:** Fevereiro 2025  
**Responsável:** Security Team

---

### Como Usar Este Checklist

1. **Copie** este template para seu sistema de gestão (Notion, Jira, etc.)
2. **Marque** cada item conforme verificado
3. **Documente** issues encontradas
4. **Atribua** responsáveis para correções
5. **Acompanhe** até resolução completa
6. **Atualize** o checklist quando processos mudarem

**Importante:** Nunca pule itens críticos marcados como obrigatórios!
